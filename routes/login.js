const express = require('express');
const router = express.Router();
const client = require('../config/db')
const generateAuthToken = require('../middlewares/auth')
const getHashedPassword = require('../middlewares/auth')





// //@desc Show login page
// //@route GET/login
// router.get('/', async (req, res) => {
//     res.render('login', {
//         layout: 'login'
//     })
// })


// // @desc Process login new user
// // @route POST/login

// router.post('/', async (req, res) => {

//     try {
//         const {email, password} = req.body;
//         const hashedPassword = getHashedPassword(password)

//         const userData = await client.query("SELECT * FROM users WHERE email = $1", [
//             email
//           ]);

//         if (userData.rows.length === 0) {
//             res.render('login', {
//                 layout: 'login',
//                 message: 'User does not exist.',
//             })
//             return;
//         }

//         const user = {
//             email: `${userData.rows[0].email}`,
//             password: `${userData.rows[0].password}`,
//             name: `${userData.rows[0].first_name}`,
//             lastName: `${userData.rows[0].last_name}`,
//             user_id: `${userData.rows[0].id}`,
//         }

//         if (user.email === email && user.password !== hashedPassword ) {
//                 res.render('login', {
//                     layout: 'login',
//                     message: 'Invalid password',
//                 })

//         } else {
//             const authToken = generateAuthToken();
//             authTokens[authToken] = user;
//             res.cookie('AuthToken', authToken)
//             res.redirect('/dashboard')
//         }

//     } catch (err) {
//         console.error(err)
//     }
// })




module.exports = router