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

router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    let Groups = await Group.findAll({
        where: {
            organizerId: user.dataValues.id,
        }
    })

    let userEvents = []


    for (let g of Groups) {
        let Events = await Event.findAll({
            where: {
                groupId: g.dataValues.id
            },
            include: [
                { model: EventImage },
                { model: Group },
            ]
        })

        for (let e of Events) {
            userEvents.push(e)

        }

    }

    res.json({
        userEvents
    })

})

router.get('/other', requireAuth, async (req, res) => {
    const { user } = req;
    let Groups = await Group.findAll({
        where: {
            organizerId: { [Op.ne]: user.dataValues.id },
        }
    })

    let userEvents = []


    for (let g of Groups) {
        let Events = await Event.findAll({
            where: {
                groupId: g.dataValues.id
            },
            include: [
                { model: EventImage },
                { model: Group },
                { model: Attendance,
                  where: {
                    userId: user.dataValues.id,
                    status: "attending"
                  }
                }
            ]
        })

        for (let e of Events) {
            userEvents.push(e)

        }

    }

    res.json({
        userEvents
    })

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
                    exclude: ['createdAt', 'updatedAt', 'organizerId']
                },

            },
            {
                model: Venue,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'groupId']
                },

            },
            {
                model: EventImage,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'eventId']
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
    else {
        res.status(404).json({
            message: "Only the organizer may add an image"
    })
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
    else {
        res.status(404).json({
            message: "Only the organizer may edit an event"
    })
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
    else {
        res.status(404).json({
            message: "Only the organizer may delete an event"
    })
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


   Attendees = await Attendance.findAll({
        where: {
            eventId: id
        },
        include: [
            { model: User }
        ]
   })

    res.json({
        Attendees
    })


})

router.post('/:id/attendance', requireAuth, async (req, res) => {
    let id = req.params.id;
    let { user } = req
    // const { userId } = req.body

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
            groupId: event.dataValues.groupId,
            status: ['co-host', 'member']
        }
    })

    if (!member) {
        res.status(404).json({message: "Membership between the user and the event does not exist"});

    }

    let attendance
    if (!attende && member) {
        attendance = await Attendance.create({
            userId: user.dataValues.id,
            eventId: parseInt(id),
            status: 'pending'
        })

       let Attendees = await Attendance.findAll({
            where: {
                eventId: id
            },
            include: [
                { model: User }
            ]
       })

        res.json({
            Attendees
        })

    }
    else if (attende.dataValues.status === 'pending') {
        res.status(400).json({
            "message": "Attendance has already been requested"
        })
    }
    else if (attende.dataValues.status === 'attending' && attende) {
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
    }else {
        res.status(404).json({message: "Only the organizer may edit an Attendance"});
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
    // const { userId } = req.body
    let { user } = req

    let findUser = await User.findByPk(user.dataValues.id)

    if (!findUser) {
        res.status(404).json({
            message: "Validation Error",
            errors: {
              memberId: "User couldn't be found"
            }
    })
    }

    let id = req.params.id;

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

    if (!attende) {
        res.status(404).json({message: "Attendance does not exist for this User"});

    }

    if (attende) {

        attende.destroy()

        res.json({
            message: "Successfully deleted Attendance from group"
          })

    }

})

module.exports = router;
