const express = require('express');
const path = require('path')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const client = require('./config/db')
const exphbs = require('express-handlebars');
const crypto = require ('crypto')
const requireAuth = require ('./middlewares/auth')


const app = express()


//Body Parser
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.json())

//Static folder
app.use(express.static(path.join(__dirname, 'public')));


//Handlebars Helpers
const { counter, showDays, days, toUpperCase, select } = require('./helpers/hbs');
const { query } = require('express');

//Handlebars Middleware
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        counter,
        showDays,
        toUpperCase,
        select
    }
})
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

const authTokens = {};

//Middlware req.user

app.use((req, res, next) => {
    console.log(JSON.stringify(authTokens, null, 2));
    // Get auth token from the cookies
    const authToken = req.cookies['AuthToken'];
    //// Inject the user to the request
    req.user = authTokens[authToken];

    next();
});

//Method override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  }))


const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

app.use('/', require('./routes/index'))
app.use('/login', require('./routes/login'))
app.use('/register', require('./routes/register'))
app.use('/schedules', require('./routes/schedules'))


//@desc Show login page
//@route GET/login
app.get('/login', async (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

//@desc Show register page
//@route GET/register
app.get('/register', async (req, res) => {
    res.render('register', {
        layout: 'login'
    })
})



// @desc Process register new user
// @route POST/register
app.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, password, confirm_password } = req.body

        if (password !== confirm_password) {
            res.render('register', {
                layout: 'login',
                message: 'Passwords does not match.'
            });
        }

        // const user = await client.query("SELECT * FROM users WHERE email = $1", [
        //     email
        //   ]);

        const hashedPassword = getHashedPassword(password);
        const newUser = await client.query(
            "INSERT INTO users(first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
            [first_name, last_name, email, hashedPassword])

            // res.json(newUser)
            res.render ('login', {
                layout: 'login',
                message: 'Registration Complete. Please login to continue.'
            })

    } catch (err) {
        console.error(err)
        res.status(404).render('error/23505')
      }

})

// @desc Process login new user
// @route POST/login

app.post('/login', async (req, res) => {

    try {
        const {email, password} = req.body;
        const hashedPassword = getHashedPassword(password)

        const userData = await client.query("SELECT * FROM users WHERE email = $1", [
            email
          ]);

        if (userData.rows.length === 0) {
            res.render('login', {
                layout: 'login',
                message: 'User does not exist.',
            })
            return;
        }

        const user = {
            email: `${userData.rows[0].email}`,
            password: `${userData.rows[0].password}`,
            name: `${userData.rows[0].first_name}`,
            lastName: `${userData.rows[0].last_name}`,
            user_id: `${userData.rows[0].id}`,
        }

        if (user.email === email && user.password !== hashedPassword ) {
                res.render('login', {
                    layout: 'login',
                    message: 'Invalid password',
                })

        } else {
            const authToken = generateAuthToken();
            authTokens[authToken] = user;
            res.cookie('AuthToken', authToken)
            res.redirect('/dashboard')
        }

    } catch (err) {
        console.error(err)
    }
})

//@desc Logout user
//@route /logout

app.get('/logout', (req, res) => {
    res.clearCookie('AuthToken');
    res.redirect('/login')
})

const PORT = process.env.PORT || 5001

app.listen(PORT, console.log(`Server running on port ${PORT}`))