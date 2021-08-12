const express = require('express');
const router = express.Router()
const client = require('../config/db')
const generateAuthToken = require('../middlewares/auth')
const getHashedPassword = require('../middlewares/auth')

// //@desc Show register page
// //@route GET/register
// router.get('/register', async (req, res) => {
//     res.render('register', {
//         layout: 'login'
//     })
// })

// // @desc Process register new user
// // @route POST/register
// router.post('/register', async (req, res) => {
//     try {
//         const { first_name, last_name, email, password, confirm_password } = req.body

//         if (password !== confirm_password) {
//             res.render('register', {
//                 layout: 'login',
//                 message: 'Passwords does not match.'
//             });
//         }

//         // const user = await client.query("SELECT * FROM users WHERE email = $1", [
//         //     email
//         //   ]);

//         const hashedPassword = getHashedPassword(password);
//         const newUser = await client.query(
//             "INSERT INTO users(first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
//             [first_name, last_name, email, hashedPassword])

//             // res.json(newUser)
//             res.render ('login', {
//                 layout: 'login',
//                 message: 'Registration Complete. Please login to continue.'
//             })

//     } catch (err) {
//         console.error(err)
//         res.status(404).render('error/23505')
//       }

// })



module.exports = router