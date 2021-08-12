const express = require('express');
const router = express.Router()
const client = require('../config/db')
const requireAuth = require ('../middlewares/auth')

//@desc Show home page
//@route GET/
router.get('/', (req, res) => {
    res.render('home.hbs',
     {layout: 'home'})
})


//@desc Show all schedules
//@route GET/
router.get('/dashboard', requireAuth, async (req, res) => {
    try {
        const allSchedulesData = await client.query(
            "SELECT schedules.id as schedule_id, schedules.user_id, to_char(schedules.start_at, 'HH24:MI') as start_time, to_char(schedules.end_at, 'HH24:MI') as end_time, schedules.day , users.first_name, users.last_name FROM schedules JOIN users  ON schedules.user_id = users.id"
            )
            const allSchedules = allSchedulesData.rows
            console.log(allSchedules)

            // allSchedules.forEach(elem => {
            //     elem.userName = req.user.name
            //     elem.userLastName = req.user.lastName
            // })

        res.render  ('dashboard', {
                allSchedules,
                userEmail: req.user.email,
                userName: req.user.name,
        })

    } catch (err) {
        console.error(err)
    }
})

// @desc Process add schedule form
// @route POST/dash
router.post('/dashboard', requireAuth, async (req, res) => {
    try {
        const { day, start_at, end_at } = req.body
        const user_id = req.user.user_id
        console.log(`ewa printuje ${user_id}`)
        const newSchedule = await client.query(
            "INSERT INTO schedules (user_id, day, start_at, end_at) VALUES ($1, $2, $3, $4) RETURNING *",
            [user_id, day, start_at, end_at]);

            res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
    }
})






// //@desc Logout user
// //@route /logout

// router.get('/logout', (req, res) => {
//     res.clearCookie('AuthToken');
//     res.redirect('/login')
// })

module.exports = router