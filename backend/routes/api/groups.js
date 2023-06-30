const express = require('express');
const { Op } = require('sequelize');

//const bcrypt = require('bcryptjs');
//const { check } = require('express-validator');
//const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, restoreUser, requireAuth, } = require('../../utils/auth');

const { User, Group, Venue, GroupImage, Event, EventImage, Membership, Attendance } = require('../../db/models');
const { JsonWebTokenError } = require('jsonwebtoken');
const group = require('../../db/models/group');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateGroup = [
    check('city')
     .isLength({ min: 1 })
     .withMessage('City is required'),
     check('state')
     .isLength({ min: 1 })
     .withMessage('State is required'),
     handleValidationErrors
]

const validateVenue = [
    check('address')
    .isLength({ min: 1 })
    .withMessage('Street address is required'),
    check('city')
    .isLength({ min: 1 })
    .withMessage('City is required'),
    check('state')
    .isLength({ min: 1 })
    .withMessage('State is required'),
    handleValidationErrors
]

const validateEvent = [
    check('description')
    .isLength({ min: 1 })
    .withMessage('Description is required'),
   handleValidationErrors
]


const router = express.Router();

router.get('/', async (req, res) => {
    let Groups = await Group.findAll({})

    if (Groups.length > 0) {
    let arr = []

    for (let group of Groups) {
        arr.push(group.dataValues.id)
    }

    for (let i = 0; i < arr.length; i++) {
        let num = await Membership.count({
            where: {
                groupId: arr[i]
            }
        })

        let image = await GroupImage.findAll({
            attributes: ['url'],
            where: {
                groupId: arr[i],
                preview: true

            },
            include: {
                model: Group,
                attributes: []
            }
        });

        let images = ''


        // image.forEach((element, i) => {
        if (image.length) {
        images += image[image.length - 1].dataValues.url
        }

        Groups[i].dataValues.previewImage = images

        Groups[i].dataValues.numMembers = num

    }
    }
    else {
        let num = await Membership.count({
            where: {
                groupId: Groups[0].dataValues.groupId
            }
        })

        let image = await GroupImage.findAll({
            attributes: ['url'],
            where: {
                groupId: Groups[0].dataValues.groupId,

            },
            include: {
                model: Group,
                attributes: []
            }
        });

        let images = ''
        image.forEach((element, i) => {
            if (i === 0) {
                images += element.dataValues.url
            }
            images += ', ' + element.dataValues.url

        });

        Groups[0].dataValues.previewImage = images

        Groups[0].dataValues.numMembers = num
    }



    res.json({Groups})

})

router.get('/current', requireAuth, async (req, res) => {
        const { user } = req;

        let Groups = await Group.findAll({
            where: {
                organizerId: user.dataValues.id
            }
        })

        let arr = []

    for (let group of Groups) {
        console.log(group)
        arr.push(group.dataValues.id)
    }

    for (let i = 0; i < arr.length; i++) {
        let num = await Membership.count({
            where: {
                groupId: arr[i]
            }
        })

        let image = await GroupImage.findAll({
            attributes: ['url'],
            where: {
                groupId: arr[i],
                preview: true
            },
            include: {
                model: Group,
                attributes: []
            }
        });

        let images = ''


        // image.forEach((element, i) => {
            if (image.length) {
            images += image[image.length - 1].dataValues.url
            }

        Groups[i].dataValues.previewImage = images

        Groups[i].dataValues.numMembers = num

    }

        res.json({
        Groups
        })

})

router.get('/:id', async (req, res) => {
    let firstId = req.params.id;
    let ids = await Group.findByPk(firstId);

    if (!ids) {

    res.status(404).json({"message": "Group couldn't be found"});

    }


    let group = await Group.findByPk(firstId, {
        // attributes: {
        //     exclude: ['createdAt', 'updatedAt']
        // },
        include: [{
            model: GroupImage,
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'groupId']
            }
        },
        {
            model: User,
            attributes: ['id','firstName', 'lastName'],
            through: {
                  attributes: []
            }
        },
        {
            model: Venue,
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        }],
    })

    let num = await Membership.count({
        where: {
            groupId: firstId
        }
    })

    group.dataValues.numMembers = num

    let { id, organizerId, name, about, type, private, city, state, numMembers, createdAt, updatedAt } = group.toJSON()

    res.json({
        id,
        organizerId,
        name,
        about,
        type,
        private,
        city,
        state,
        createdAt,
        updatedAt,
        GroupImages: group.toJSON().GroupImages,
        Organizer: group.toJSON().Users,
        Venues: group.toJSON().Venues,
        numMembers
    })
})

router.post('/', validateGroup, requireAuth, async (req, res) => {
    const { name, about, type, private, city, state} = req.body;
    const { user } = req;
    const id = user.dataValues.id;

    let group = await Group.create({
        organizerId: id,
        name,
        about,
        type,
        private,
        city,
        state
    })

    let member = await Membership.create({
        userId: user.dataValues.id,
        groupId: group.id,
        status: 'co-host'
    })


    res.json(
        group
    )
})

router.post('/:id/images', requireAuth, async (req, res) => {
    const { url, preview } = req.body
    let id = req.params.id;
    const { user } = req

    let ids = await Group.findByPk(id);

    if (!ids) {

        res.status(404).json({message: "Group couldn't be found"});

    }

    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id,
            groupId: parseInt(id)
        }
    })

    if (!member) {
        res.status(404).json({
            message: "Membership between the user and the group does not exist"
        })
    }

    if (member.dataValues.status === 'co-host') {
    let image = await GroupImage.create({
        groupId: id,
        url,
        preview
    });
    let createdImage = await GroupImage.findByPk(image.id, {
        attributes: ['id', 'url', 'preview'],
        include: {
            model: Group,
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

router.put('/:id', validateGroup, requireAuth, async (req, res) => {

    const { name, about, type, private, city, state } = req.body
    let id = req.params.id;
    const { user } = req

    let ids = await Group.findByPk(id);

    if (!ids) {

        res.status(404).json({message: "Group couldn't be found"});

    }

    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id,
            groupId: parseInt(id)
        }
    })


    if (!member) {
    res.status(404).json({
        message: "Membership between the user and the group does not exist"
    })
    }

    if (member.dataValues.status === 'co-host') {
    ids.set({
        organizerId: user.dataValues.id,
        name,
        about,
        type,
        private,
        city,
        state
    })
    await ids.save()

    res.json(
        ids
    )
    }
    else {
        res.status(404).json({
            message: "Only the organizer may edit a group"
    })
    }

})

router.delete("/:id", requireAuth, async (req, res) => {
    let id = req.params.id;
    const { user } = req

    let ids = await Group.findByPk(id);

    if (!ids) {

        res.status(404).json({message: "Group couldn't be found"});

    }

    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id,
            groupId: parseInt(id)
        }
    })

    if (!member) {
        res.status(404).json({
            message: "Membership between the user and the group does not exist"
        })
        }


    if (member.dataValues.status === 'co-host') {
    await ids.destroy()

    res.json({
        message: "Successfully deleted"
    })

    }
    else {
        res.status(404).json({
            message: "Only the organizer may delete a group"
    })
    }


})

router.get('/:id/venues', requireAuth, async (req, res) => {

    let id = req.params.id;
    const { user } = req

    let ids = await Group.findByPk(id);

    if (!ids) {

        res.status(404).json({message: "Group couldn't be found"});

    }

    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id,
            groupId: parseInt(id)
        }
    })

    if (!member) {
        res.status(404).json({
            message: "Membership between the user and the group does not exist"
        })
    }


    if (member.dataValues.status === 'co-host') {
    let Venues = await Venue.findAll({
            where: {
                groupId: id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
    })


    res.json({
        Venues
    })
    }
    else {
        res.status(404).json({
            message: "Only the organizer may view a venue"
    })
    }

})

router.post('/:id/venues', validateVenue, requireAuth, async (req, res) => {
    const { address, city, state, lat, lng } = req.body
    let id = req.params.id;
    const { user } = req

    let ids = await Group.findByPk(id);

    if (!ids) {

        res.status(404).json({message: "Group couldn't be found"});

    }

    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id,
            groupId: parseInt(id)
        }
    })

    if (!member) {
        res.status(404).json({
            message: "Membership between the user and the group does not exist"
        })
    }

    if (member.dataValues.status === 'co-host' ) {
    let venue = await Venue.create({
        groupId: parseInt(id),
        address,
        city,
        state,
        lat,
        lng
    })
    let createdVenue = await Venue.findByPk(venue.id, {
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
    })
    res.json(
        createdVenue
    )
    }
    else {
        res.status(404).json({
            message: "Only the organizer may add a venue"
    })
    }

})


router.get('/:id/events', async (req, res) => {
    let id = req.params.id;

    let ids = await Group.findByPk(id);

    if (!ids) {

        res.status(404).json({message: "Group couldn't be found"});

    }

    let Events = await Event.findAll({
        where: {
            groupId: id
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        include: [
            {
                model: Group,
                attributes: ['id', 'name', 'city', 'state']
            },
            {
                model: Venue,
                attributes: ['id', 'city', 'state']
            },

        ]
    })

    if (Events.length > 0) {
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

    res.json({
        Events
    })

})

router.post('/:id/events', validateEvent, requireAuth, async (req, res) => {
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body
    let id = req.params.id;
    let ids = await Group.findByPk(id);
    let { user } = req

    let venue = await Venue.findByPk(venueId)

    if (!venue) {

        res.status(404).json({message: "Venue does not exist"});

    }


    if (!ids) {

        res.status(404).json({message: "Group couldn't be found"});

    }

    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id,
            groupId: parseInt(id)
        }
    })

    if (!member) {
        res.status(404).json({
            message: "Membership between the user and the group does not exist"
        })
        }

    if (member.dataValues.status === 'co-host') {
    let event = await Event.create({
        groupId: parseInt(id),
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate
    });

    let attending = await Attendance.create({
        userId: user.dataValues.id,
        eventId: event.id,
        status: 'attending'
    })

    let createdEvent = await Event.findByPk(event.id, {
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        include: [{
            model: Venue,
            attributes: []
        },
        {
            model: Group,
            attributes: []
        }]
    })



    res.json(
        createdEvent
    )
    }
    else {
        res.status(404).json({
            message: "Only the organizer may add an event"
    })
    }

})

router.get('/:id/members', async (req, res) => {
    let id = req.params.id;
    let { user }= req

    let Members

    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id,
            groupId: id
        }
    })

    if (!member) {
        Members = await User.findAll({
            attributes: {
                exclude: ['username']
            },
            include: {
                model: Membership,
                attributes: ['status'],
                where: {
                    groupId: id,
                    status: ['member', 'co-host']

                }
            },
        });
    }


    let group = await Group.findByPk(id);

    if (!group) {
        res.status(404).json({
            message: "Group couldn't be found"
        })
    }

    if (!member) {
        Members = await User.findAll({
            attributes: {
                exclude: ['username']
            },
            include: {
                model: Membership,
                attributes: ['status'],
                where: {
                    groupId: id,
                    status: ['member', 'co-host']

                }
            },
        });
    }
    else if (member.dataValues.status !== 'co-host') {
        Members = await User.findAll({
            attributes: {
                exclude: ['username']
            },
           include: {
               model: Membership,
               attributes: ['status'],
               where: {
                   groupId: id,
                   status: ['member', 'co-host']

               }
           },
       });
    }
    else if (member.dataValues.status === 'co-host' ){
        Members = await User.findAll({
            attributes: {
                exclude: ['username']
            },
            include: {
                model: Membership,
                attributes: ['status'],
                where: {
                    groupId: id
                }
            },
        })
    }

    res.json({
        Members
    })


})


router.post('/:id/membership', requireAuth, async (req, res) => {
    let id = req.params.id;
    let { user } = req
    const { memberId, status } = req.body

    if (memberId !== user.dataValues.id) {
        res.status(404).json({message: "Only the user may add a membership"});

    }


    let pendingMember = await User.findByPk(memberId)

    if (!pendingMember) {
        res.status(404).json({
                message: "Validation Error",
                errors: {
                  memberId: "User couldn't be found"
                }
        })
    }


    let group = await Group.findByPk(id);

    if (!group) {
        res.status(404).json({
            message: "Group couldn't be found"
        })
    }

    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id,
            groupId: parseInt(id)
        }
    })

    let membership
    if (!member) {
        membership = await Membership.create({
            userId: user.dataValues.id,
            groupId: parseInt(id),
            status: 'pending'
        })
    }
    else if (member.dataValues.status === 'pending') {
        res.status(400).json({
            "message": "Membership has already been requested"
        })
    }
    else if (member && member.dataValues.status === 'co-host' || member.dataValues.status === 'member') {
        res.status(404).json({
            message: "User is already a member of the group"
          })
    }

    res.json(
        membership
    )

})

router.put('/:id/membership', requireAuth, async (req, res) => {
    const { memberId, status } = req.body
    let id = req.params.id;
    let { user } = req

    let group = await Group.findByPk(id);

    if (!group) {
        res.status(404).json({
            message: "Group couldn't be found"
        })
    }

    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id,
            groupId: parseInt(id)
        }
    })

    if (!member) {
        res.status(404).json({
            message: "Membership between the user and the group does not exist"
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

    let pendingMember = await User.findByPk(memberId)

    if (!pendingMember) {
        res.status(404).json({
                message: "Validation Error",
                errors: {
                  memberId: "User couldn't be found"
                }
        })
    }

    let otherMember = await Membership.findOne({
        where: {
            userId: memberId,
           groupId: parseInt(id)
        }
    })

    if (!otherMember) {
        res.status(404).json({
            message: "Membership between the user and the group does not exist"
        })
    }

    if (member.dataValues.status === 'co-host' && status !== 'pending') {
        otherMember.set({
            status
        })

        await otherMember.save()

        res.json(
            otherMember
        )
    }
    else {
        res.status(404).json({
            message: "Only the organizer may edit a membership"
    })
    }

})

router.delete('/:id/membership', requireAuth, async (req, res) => {
    const { memberId } = req.body

    let id = req.params.id;
    let { user } = req

    let group = await Group.findByPk(id);

    if (!group) {
        res.status(404).json({
            message: "Group couldn't be found"
        })
    }

    let pendingMember = await User.findByPk(memberId)


    if (!pendingMember) {
        res.status(404).json({

                message: "Validation Error",
                errors: {
                  "memberId": "User couldn't be found"
                }

        })
    }

    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id,
            groupId: parseInt(id)
        }
    })

    if (!member) {
        res.status(404).json({
            message: "Membership between the user and the group does not exist"
        })
    }

    let otherMember = await Membership.findOne({
        where: {
            userId: memberId,
            groupId: parseInt(id)
        }
    })

    if (!otherMember) {
        res.status(404).json({
            message: "Membership between the user and the group does not exist"
        })
    }

    if (member.dataValues.status === 'co-host') {
        otherMember.destroy()

        res.json({
            message: "Successfully deleted membership from group"
          })

    } else if (member.dataValues.status === 'member' && memberId === user.dataValues.id) {
        member.destroy()

        res.json({
            message: "Successfully deleted membership from group"
          })
    }
    else {
        res.status(404).json({
            message: "Only the organizer may delete a membership"
        })
    }

})


module.exports = router;
