const express = require('express');
const router = express.Router();
const client = require('../config/db')
const requireAuth = require ('../middlewares/auth')

//@desc Show all schedules for user
//@route GET/:userId/schedules

const { days, toUpperCase} = require('../helpers/hbs');


//@desc Show add page
//@route GET/new
router.get('/add', requireAuth, async (req, res) => {
    res.render('schedules/add', {
        days,
        user_id: req.user.user_id

    })

})


////@desc Show a single schedule
//@route GET/schedules/:id

router.get('/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params
        const scheduleData = await client.query("SELECT schedules.id as schedules_id, schedules.user_id as user_id, to_char(schedules.start_at, 'HH24:MI') as start_time, to_char(schedules.end_at, 'HH24:MI') as end_time, schedules.day, users.first_name, users.last_name FROM schedules JOIN users  ON schedules.user_id = users.id WHERE schedules.id = $1", [id])
        const schedule = scheduleData.rows[0]
        console.log(schedule)
        res.render('schedules/single', {
            schedule
        })
    } catch (err) {
        console.error(err.message)
    }
})

////@desc Show edit page
//@route GET/schedules/:id/edit

router.get('/:id/edit', requireAuth, async (req, res) => {
    try {
        const { id } = req.params
        const scheduleData = await client.query("SELECT schedules.id as schedule_id, to_char(schedules.start_at, 'HH24:MI') as start_time, to_char(schedules.end_at, 'HH24:MI') as end_time, schedules.day, schedules.user_id, users.first_name, users.last_name FROM schedules JOIN users  ON schedules.user_id = users.id WHERE schedules.id = $1", [id])
        const schedule = scheduleData.rows[0]


        if(schedule.user_id != req.user.user_id) {
            res.render('schedules/warning', {
                layout: 'main',
                action: 'edit'
            })
        }
        
        res.render('schedules/edit', {
            days,
            schedule,
            schedule_id: schedule.schedule_id,
        })
    } catch (err) {
        console.error(err.message)
    }
})

//@desc edit schedules
//@route PUT/schedules/:id

router.put('/:id', requireAuth, async(req, res) => {
    try {

        const { id } = req.params
        const user_id = req.user.user_id
        const { day, start_at, end_at } = req.body

        const updateSchedule = await client.query(
            "UPDATE schedules SET user_id=$1, day=$2, start_at=$3, end_at=$4 WHERE id = $5",
            [user_id, day, start_at, end_at, id])

            
            res.redirect('/dashboard')
    } catch (err) {
        console.error(err.message)
    }
})


//@desc Show all schedules for user
//@route GET/schedules/user/:userId

router.get('/user/:userId', requireAuth, async (req, res) => {
    const { userId } = req.params
    try {
        const userSchedulesData = await client.query(
            "SELECT schedules.id as schedules_id, to_char(schedules.start_at, 'HH24:MI') as start_time, to_char(schedules.end_at, 'HH24:MI') as end_time, schedules.day, users.id, users.first_name, users.last_name, users.email FROM schedules JOIN users  ON schedules.user_id = users.id WHERE users.id = $1", [userId])
            
            const userSchedules = userSchedulesData.rows
            console.log('userSchedules', userSchedules)

        res.render  ('schedules/user', {
                userSchedules,
                name: userSchedules[0].first_name,
                lastName: userSchedules[0].last_name,
                email: userSchedules[0].email,
                numberOfSchedules: userSchedules.length
               
        })

    } catch (err) {
        console.error(err)
    }
})

//@desc Delete schedule
//@route GET/
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const { id } = req.params
        
        const deleteScheduleData = await client.query("DELETE FROM schedules WHERE schedules.id = $1", [id])
        console.log(id)
        res.redirect('/dashboard')

    } catch (err) {
        console.error(err.message)
    }
})

module.exports = router