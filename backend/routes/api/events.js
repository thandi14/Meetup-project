const express = require('express');
const { Op } = require('sequelize');

//const bcrypt = require('bcryptjs');
//const { check } = require('express-validator');
//const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');

const { User, Group, Venue, Attendance, Event, EventImage, Membership } = require('../../db/models');
const { parse } = require('dotenv');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const validateBody = [
    check('description')
     .isLength({ min: 1 })
     .withMessage('Description is required'),
     handleValidationErrors
]

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
        //   "name": "Name must be a string",
        //   "type": "Type must be 'Online' or 'In Person'",
        //   "startDate": "Start date must be a valid datetime",
        }
      })
    }

    let Events = await Event.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        where,
        include: [{
            model: Group,
            attributes: ['id', 'name', 'city', 'state']
        },
        {
            model: Venue,
            attributes: ['id', 'city', 'state']
        },
        ],
        ...pagination

    });

    if(Events.length > 0) {
        let arr = []

        for (let event of Events) {
            arr.push(event.dataValues.id)
        }


        for (let i = 0; i < arr.length; i++) {
            let num = await Attendance.count({
                where: {
                    eventId: arr[i]
                }
            })

            let image = await EventImage.findAll({
                attributes: ['url'],
                where: {
                    eventId: arr[i],
                    preview: true

                },
                include: {
                    model: Event,
                    attributes: []
                }
            });

           let images = ''


       // image.forEach((element, i) => {
           if (image.length) {
           images += image[image.length - 1].dataValues.url
           }

            Events[i].dataValues.previewImage = images

            Events[i].dataValues.numAttending = num
            }
        }


    res.json({Events})
})


router.get('/:id', async (req, res) => {
    let id = req.params.id;

    let events = await Event.findByPk(id, {
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        include: [
            {
                model: Group,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },

            },
            {
                model: Venue,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },

            },
            {
                model: EventImage,
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
            }

        ]
    })

    if (!events) {

        res.status(404).json({message: "Event couldn't be found"});

    }



    let num = await Attendance.count({
        where: {
            eventId: id
        }
    })

    events.dataValues.numAttending = num

    res.json(
        events
    )
})

router.post('/:id/images', requireAuth, async (req, res) => {
    const { url, preview } = req.body
    let id = req.params.id;
    const { user } = req

    let ids = await Event.findByPk(id);

    if (!ids) {

    res.status(404).json({message: "Event couldn't be found"});

    }

    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id,
            groupId: ids.dataValues.groupId
        }
    })

    if (!member) {

        res.status(404).json({message: "Membership between the user and the event does not exist"});

    }

    if (member.dataValues.status === 'co-host') {
    let image = await EventImage.create({
        eventId: id,
        url,
        preview
    });
    let createdImage = await EventImage.findByPk(image.id, {
        attributes: ['id', 'url', 'preview'],
        include: {
            model: Event,
            attributes: []
        }
    })

    res.json(
        createdImage
    )
    }
})

router.put('/:id', validateBody, requireAuth, async (req, res) => {

    const { venueId, name, type, capacity, price, description } = req.body
    let id = req.params.id;
    const { user } = req

    let ids = await Event.findByPk(id);

    let venues = await Venue.findByPk(venueId)

    if (!ids) {

    res.status(404).json({message: "Event couldn't be found"});

    }

    if (!venues) {
        res.status(404).json({message: "Venue couldn't be found"});

    }

    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id,
            groupId: ids.dataValues.groupId
        }
    })

    if (!member) {

        res.status(404).json({message: "Membership between the user and the event does not exist"});

    }

    if (member.dataValues.status === 'co-host') {
    ids.set({
     venueId: venueId,
     name,
     type,
     capacity,
     price,
     description
    })

    await ids.save()

    res.json(
      ids
    )
    }


})

router.delete("/:id", requireAuth, async (req, res) => {
    let id = req.params.id;
    let ids = await Event.findByPk(id);
    const { user } = req


    if (!ids) {
        res.status(404).json({message: "Event couldn't be found"});
    }

    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id,
            groupId: ids.dataValues.groupId
        }
    })

    if (!member) {

        res.status(404).json({message: "Membership between the user and the event does not exist"});

    }

    if (ids) {
    if (member.dataValues.status === 'co-host') {
    await Event.destroy({
        where: {
            id: parseInt(id)
        }
    })
    res.json({
        message: "Successfully deleted"
    })
    }
    }


})

router.get('/:id/attendees', async (req, res) => {
    let id = req.params.id;
    let { user } = req

    let Attendees

    let event = await Event.findByPk(id);

    if (!event) {

        res.status(404).json({message: "Event couldn't be found"});

    }

    let attende = await Membership.findOne({
        where: {
            userId: user.dataValues.id,
            groupId: event.dataValues.groupId
        }
    })

    if (!attende) {

        Attendees = await User.findAll({
            include: {
                model: Attendance,
                attributes: ['status'],
                where: {
                    eventId: id,
                    status: ['attending']

                }
            },
        });
    }


    else if (attende.dataValues.status === 'co-host') {
     Attendees = await User.findAll({
        include: {
            model: Attendance,
            attributes: ['status'],
            where: {
                eventId: id
            }
        },
        });
    }
    else if (attende.dataValues.status !== 'co-host') {
        Attendees = await User.findAll({
           include: {
               model: Attendance,
               attributes: ['status'],
               where: {
                   eventId: id,
                   status: ['attending']

               }
           },
       });
    }

    res.json({
        Attendees
    })


})

router.post('/:id/attendance', requireAuth, async (req, res) => {
    let id = req.params.id;
    let { user } = req

    let event = await Event.findByPk(id);


    if (!event) {
        res.status(404).json({
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
            groupId: event.dataValues.groupId
        }
    })

    let attendance
    if (!attende) {
        attendance = await Attendance.create({
            userId: user.dataValues.id,
            eventId: parseInt(id),
            status: 'pending'
        })

        res.json(
            attendance
        )
    }

    if (attende.dataValues.status === 'pending') {
        res.status(400).json({
            "message": "Attendance has already been requested"
        })
    }

    if (member.dataValues.status === 'co-host' || member.dataValues.status === 'member') {
        res.status(400).json({
            message: "User is already a attende of the group"
          })
    }

})

router.put('/:id/attendance', requireAuth, async (req, res) => {
    const { userId, status } = req.body

    let id = req.params.id;
    let { user } = req

    let event = await Event.findByPk(id);

    if (!event) {
        res.status(404).json({
            message: "Event couldn't be found"
        })
    }

    if (status === 'pending') {
        res.status(400).json({
            message: "Validations Error",
            errors: {
              status : "Cannot change an attendance status to pending"
            }
          })
    }

    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id,
            groupId: event.dataValues.groupId
        },
    })

    console.log(event)

    if (!member) {

        res.status(404).json({message: "Membership between the user and the event does not exist"});

    }

    let attende = await Attendance.findOne({
        where: {
            userId: user.dataValues.id,
            eventId: event.dataValues.id
        },
    })

    if (!attende) {

        res.status(404).json({message: "Membership between the user and the event does not exist"});

    }

    let otherAttende = await Attendance.findOne({
        where: {
            userId,
            eventId: id
        }
    })

    if (!otherAttende) {

        res.status(404).json({message: "Attendance between the user and the event does not exist"});

    }

    let pendingAttende = await User.findByPk(userId)

    if (!pendingAttende) {

        res.status(400).json({
            message: "Validation Error",
            errors: {
             memberId: "User couldnt be found"
            }
        });

    }

    if (member.dataValues.status === 'co-host' && status !== 'pending') {
        otherAttende.set({
            eventId: id,
            status
        })

        await otherAttende.save()

        res.json(
            otherAttende
        )
    }

    if (status === 'pending') {
        res.status(400).json({
            message: "Validations Error",
            errors: {
              status : "Cannot change an attendance status to pending"
            }
          })
    }


})


router.delete('/:id/attendance', requireAuth, async (req, res) => {
    const { userId } = req.body

    let findUser = await User.findByPk(userId)

    if (!findUser) {
        res.status(404).json({
            message: "Validation Error",
            errors: {
              memberId: "User couldn't be found"
            }
    })
    }

    let id = req.params.id;
    let { user } = req

    let event = await Event.findByPk(id);

    if (!event) {
        res.status(404).json({
            message: "Event couldn't be found"
        })
    }

    let attende = await Attendance.findOne({
        where: {
            userId,
            eventId: parseInt(id)
        }
    })

    if (!attende) {

        res.status(404).json({message: "Attendance does not exist for this User"});

    }

    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id,
            groupId: event.dataValues.groupId
        },
    })

    if (!member) {

        res.status(404).json({message: "Attendance does not exist for this User"});
    }

    let otherAttende = await Attendance.findOne({
        where: {
            userId: user.dataValues.id,
            eventId: parseInt(id)
        }
    })

    console.log(member)

    if (!otherAttende && attende.dataValues.eventId === id) {

        res.status(404).json({message: "Only the User or organizer may delete an Attendance"});

    }

    let pendingAttende = await User.findByPk(userId)

    if (!pendingAttende) {

        res.status(404).json({
            message: "Validation Error",
            errors: {
              memberId: "User couldn't be found"
            }
    })
    }

    if (!otherAttende) {

        res.status(404).json({message: "Attendance does not exist for this User"});
    }

    if (member.dataValues.status === 'co-host') {
        otherAttende.destroy()

        res.json({
            message: "Successfully deleted membership from group"
          })

    } else if (member.dataValues.status !== 'co-host' && userId === user.dataValues.id) {
        attende.destroy()

        res.json({
            message: "Successfully deleted membership from group"
          })
    }



})

module.exports = router;
