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

    let image = await EventImage.findByPk(id)

    if (!image) {
        res.status(404).json({
            message: "Event Image couldn't be found"
        })
    }

    let events = await Event.findByPk(image.dataValues.eventId)

    let group = await Group.findByPk(events.dataValues.groupId)


    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id,
            groupId: group.dataValues.id

        },
    })

    if (!member) {
        res.status(404).json({
            message: "Membership between the user and the event does not exist"
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
    else if (member.dataValues.status !== "co-host" && events.dataValues.id === image.dataValues.eventId) {

        res.status(403).json(
            {
                message: "Only the organizer may delete an Image"
              }
        )


    }


})


module.exports = router;
