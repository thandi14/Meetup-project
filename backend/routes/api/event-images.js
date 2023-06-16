const express = require('express');
const { Op } = require('sequelize');

//const bcrypt = require('bcryptjs');
//const { check } = require('express-validator');
//const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');

const { EventImage, Attendance, Membership, Group, Event } = require('../../db/models');


const router = express.Router();

router.delete('/:id', requireAuth, async (req, res) => {

    let id = req.params.id
    const { user } = req

    // let attende = await Attendance.findOne({
    //     where: {
    //         userId: user.dataValues.id,
    //     },
    // })

    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id,
        },
    })

    if (!member) {
        res.json({
            message: "Membership between the user and the event does not exist"
        })
        }

    let groups = await Group.findByPk(member.dataValues.groupId)

    let events = await Event.findOne({
        where: {
         groupId: groups.dataValues.id
        },
    })

    let image = await EventImage.findByPk(id, {
        where: {
            eventId: events.dataValues.id
        }
    })

    if (!image) {
        res.json({
            message: "Event Image couldn't be found"
        })
    }
    
    if (member.dataValues.status === "co-host" && image.dataValues.eventId === events.dataValues.id) {

      image.destroy()

        res.json(
            {
                message: "Successfully deleted"
            }
        )

    }


})


module.exports = router;
