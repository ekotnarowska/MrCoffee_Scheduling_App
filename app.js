const express = require('express');
const path = require('path')
const cors = require('cors')
const client = require('./config/db')
const exphbs = require('express-handlebars');


const app = express()


//Body Parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Static folder
app.use(express.static(path.join(__dirname, 'public')));


//Handlebars Helpers
const { counter, showDays, days } = require('./helpers/hbs')

//Handlebars Middleware
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        counter,
        showDays
    }
})
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

//@desc Show all schedules
//@route GET/
app.get('/', async (req, res) => {
    try {
        const allSchedules = await client.query(
            "SELECT to_char(start_at, 'HH24:MI') as start_time, to_char(end_at, 'HH24:MI') as end_time, user_name, day FROM schedules")
        const allSchedulesData = allSchedules.rows
        res.render ('schedules/all', {
            allSchedulesData
        })
   

    
    } catch (err ){
        console.error(err)
    }
})


//@desc Show add page
//@route GET/new
app.get('/new', async (req, res) => {
        res.render('schedules/add', {
            days
        })

})

// @desc Process add schedule form
// @route POST/schedules
app.post('/', async (req, res) => {
    try {
        const { user_name, day, start_at, end_at } = req.body
        const newSchedule = await client.query(
            "INSERT INTO schedules (user_name, day, start_at, end_at) VALUES ($1, $2, $3, $4) RETURNING *", 
            [user_name, day, start_at, end_at]);

            // res.json(newSchedule.rows[0])
            res.redirect('/')
    } catch (err) {
        console.error(err)
    }
})

////@desc Show a single schedule
//@route GET/:id

// app.get('/:id', async (req, res) => {
//     try {
//         const { id } = req.params
//         const schedule = await client.query("SELECT * FROM schedules WHERE schedule_id = $1", [id])
//     } catch (err) {
//         console.error(err.message)
//     }
// })

//update a schedule

// app.put('/:id', async(req, res) => {
//     try {
//         const { id } = req.params
//         const { user_name, day, start_at, start_end } = req.body
//         const updateSchedule = await client.query(
//             "UPDATE schedules SET user_name =$1, day=$2, start_at=$3, start_end=$4 WHERE schedule_id = $5",
//             [user_name, day, start_at, start_end, id])

//             res.json("schedules updated")
//     } catch (err) {
//  console.error(err.message)
//     }
// })

const PORT = process.env.PORT || 5001

app.listen(PORT, console.log(`Server running on port ${PORT}`))