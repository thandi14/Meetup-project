const express = require('express');
const { Op } = require('sequelize');

//const bcrypt = require('bcryptjs');
//const { check } = require('express-validator');
//const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');

const { User, Group, Venue, Attendance, Event, EventImage, Membership } = require('../../db/models');


const router = express.Router();

router.get('/', async (req, res) => {
    let { page, size, name, type, startDate } = req.query

    if (page === undefined || page === NaN) page = 1;
    if (size === undefined || size === NaN) size = 20;

    page = parseInt(page);
    size = parseInt(size);

    let pagination = {};

    let where = {}

    if (name) {
        where.name = name
    }
    if (type) {
        where.type = type
    }
    if (startDate) {
        where.startDate = startDate
    }

    if ((size > 0 && page > 0) || (size <= 20 && page <= 10)) {
        pagination.limit = size;
        pagination.offset = size * (page - 1);
    }
    else {
       return res.status(400).json({
        "message": "Bad Request",
        "errors": {
          "page": "Page must be greater than or equal to 1",
          "size": "Size must be greater than or equal to 1",
          "name": "Name must be a string",
          "type": "Type must be 'Online' or 'In Person'",
          "startDate": "Start date must be a valid datetime",
        }
      })
    }

    console.log(pagination)

    let events = await Event.findAll({
        where,
        ...pagination
    });

    res.json({events})
})


router.get('/:id', async (req, res) => {
    let id = req.params.id;

    let events = await Event.findByPk(id, {
        include: [
            {
                model: Venue
            },
            {
                model: Group
            },
            {
                model: EventImage
            }
        ]
    })


    if (!events) {

    res.json({"message": "Event couldn't be found"});

    }

    res.json({
        events
    })
})

router.post('/:id/images', requireAuth, async (req, res) => {
    const { url, preview } = req.body
    let id = req.params.id;

    let ids = await Event.findByPk(id);

    if (!ids) {

    res.json({"message": "Event couldn't be found"});

    }

    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id
        }
    })

    if (member.dataValues.status !== 'pending') {
    let image = await EventImage.create({
        groupId: id,
        url,
        preview
    });

    res.json({
        image
    })
    }
})

router.put('/:id', requireAuth, async (req, res) => {

    const { venueId, name, type, capacity, price, description } = req.body
    let id = req.params.id;

    let ids = await Event.findByPk(id);

    if (!ids) {

    res.json({"message": "Event couldn't be found"});

    }

    if (!venueId) {
        res.json({"message": "Venue couldn't be found"});

    }

    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id
        }
    })

    if (member.dataValues.status !== 'co-host') {
    ids.set({
     groupId: parseInt(id),
     venueId: venueId,
     name,
     type,
     capacity,
     price,
     description
    })

    await ids.save()

    res.json({
       ids
    })
    }


})

router.delete("/:id", requireAuth, async (req, res) => {
    let id = req.params.id;
    let ids = await Group.findByPk(id);



    if (!ids) {

        res.json({"message": "Event couldn't be found"});

    }

    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id
        }
    })

    if (member.dataValues.status !== 'co-host') {
    await Event.destroy({
        where: {
            id: parseInt(id)
        }
    })

    res.json({
        message: "Successfully deleted"
    })
    }

})

router.get('/:id/attendees', async (req, res) => {
    let id = req.params.id;
    let { user } = req

    let attende = await Membership.findOne({
        where: {
            userId: user.dataValues.id
        }
    })

    let event = await Event.findByPk(id);

    if (!event) {
        res.json({
            message: "Event couldn't be found"
        })
    }

    let ids

    if (attende.dataValues.status === 'co-host') {
     ids = await User.findAll({
        include: {
            model: Attendance,
            attributes: ['status'],
            where: {
                eventId: id
            }
        },
        });
    }
    else if (attende.dataValues.status === 'member') {
        ids = await User.findAll({
           include: {
               model: Attendance,
               attributes: ['status'],
               where: {
                   eventId: id,
                   role: {
                    [Op.ne]: 'pending'
                   }
               }
           },
       });
    }

    res.json({
        ids
    })


})

router.post('/:id/attendance', requireAuth, async (req, res) => {
    let id = req.params.id;
    let { user } = req

    let event = await Event.findByPk(id);

    if (!event) {
        res.json({
            message: "Event couldn't be found"
        })
    }

    let attende = await Attendance.findOne({
        where: {
            userId: user.dataValues.id,
            eventId: parseInt(id)
        }
    })

    let attendance
    if (!attende) {
        attendance = await Attendance.create({
            userId: user.dataValues.id,
            eventId: parseInt(id),
            status: 'pending'
        })
    }
    else if (attende.dataValues.status === 'pending') {
        res.json({
            "message": "Attendance has already been requested"
        })
    }
    else if (attende && attende.dataValues.status === 'co-host' || member.dataValues.status === 'member') {
        res.json({
            message: "User is already a attende of the group"
          })
    }

    res.json({
        attendance
    })

})

router.put('/:id/attendance', requireAuth, async (req, res) => {
    const { userId, status } = req.body

    let id = req.params.id;
    let { user } = req

    let event = await Event.findByPk(id);

    if (!event) {
        res.json({
            message: "Event couldn't be found"
        })
    }

    let attende = await Attendance.findOne({
        where: {
            userId: user.dataValues.id,
            eventId: id
        },
    })


    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id,
            groupId: id
        },
    })

    let otherAttende = await Attendance.findOne({
        where: {
            userId,
            eventId: id
        }
    })

    let pendingAttende = await User.findByPk(userId)

    if (member.dataValues.status === 'co-host') {
        otherAttende.set({
            eventId: id,
            status
        })

        await otherAttende.save()

        res.json({
            otherAttende
        })
    }
    else if (!pendingAttende) {
        res.json({
                message: "Validation Error",
                errors: {
                  memberId: "User couldn't be found"
                }
        })
    }
    else if (!attende || !otherAttende) {
        res.json({
            message: "Attendance between the user and the event does not exist"
        })
    }
    else {
        res.json({
            message: "Validations Error",
            errors: {
              status : "Cannot change an attendance status to pending"
            }
          })
    }


})


router.delete('/:id/attendance', requireAuth, async (req, res) => {
    const { userId } = req.body

    let id = req.params.id;
    let { user } = req

    let event = await Event.findByPk(id);

    if (!event) {
        res.json({
            message: "Event couldn't be found"
        })
    }

    let attende = await Attendance.findOne({
        where: {
            userId: user.dataValues.id,
            eventId: parseInt(id)
        }
    })

    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id,
            groupId: id
        },
    })

    let otherAttende = await Attendance.findOne({
        where: {
            userId: userId,
            eventId: parseInt(id)
        }
    })

    let pendingAttende = await User.findByPk(userId)

    if (member.dataValues.status === 'co-host') {
        otherAttende.destroy()

        res.json({
            message: "Successfully deleted membership from group"
          })
    }
     else if (!pendingAttende) {
        res.json({
                message: "Validation Error",
                errors: {
                  memberId: "User couldn't be found"
                }
        })
    }
    else if (!attende) {
        res.json({
            message: "Membership between the user and the group does not exist"
        })
    } else if (member.dataValues.status === 'member' && userId === user.dataValues.id) {
        attende.destroy()

        res.json({
            message: "Successfully deleted membership from group"
          })
    }


})

module.exports = router;
