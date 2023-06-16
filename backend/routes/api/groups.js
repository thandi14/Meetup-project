const express = require('express');
const { Op } = require('sequelize');

//const bcrypt = require('bcryptjs');
//const { check } = require('express-validator');
//const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, restoreUser, requireAuth, } = require('../../utils/auth');

const { User, Group, Venue, GroupImage, Event, EventImage, Membership, Attendance } = require('../../db/models');
const { JsonWebTokenError } = require('jsonwebtoken');
const group = require('../../db/models/group');




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

            },
            include: {
                model: Group,
                attributes: []
            }
        });

        let images = ''

        if (image.length > 1) {
            image.forEach((element, i) => {
                if (i === 0) {
                    images += element.dataValues.url
                }
                else {
                    images += ', ' + element.dataValues.url

                }

            });
            }
            else if (image.length == 1) {
                images += image[0].dataValues.url
            }
            else {
                images = ''
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
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        include: [{
            model: GroupImage,
            attributes: {
                exclude: ['createdAt', 'updatedAt']
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

    let { id, organizerId, name, about, type, private, city, state, numMembers } = group.toJSON()

    res.json({
        id,
        organizerId,
        name,
        about,
        type,
        private,
        city,
        state,
        GroupImages: group.toJSON().GroupImages,
        Organizer: group.toJSON().Users,
        Venues: group.toJSON().Venues,
        numMembers
    })
})

router.post('/', requireAuth, async (req, res) => {
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

    if (!ids) {

        res.status(404).json({message: "Group couldn't be found"});

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

})

router.put('/:id', requireAuth, async (req, res) => {

    const { name, about, type, private, city, state } = req.body
    let id = req.params.id;
    const { user } = req

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

    let ids = await Group.findByPk(id);

    if (!ids) {

        res.status(404).json({message: "Group couldn't be found"});

    }

    if (member.dataValues.status === 'co-host') {
    ids.set({
        organizerId: parseInt(id),
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


})

router.get('/:id/venues', requireAuth, async (req, res) => {

    let id = req.params.id;
    const { user } = req

    let ids = await Group.findByPk(id);

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

    if (!ids) {

        res.status(404).json({message: "Group couldn't be found"});

    }

    if (member.dataValues.status === 'co-host' || member.dataValues.status === 'member') {
    let Venue = await Venue.findAll({
            where: {
                groupId: id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
    })


    res.json({
        Venue
    })
    }

})

router.post('/:id/venues', requireAuth, async (req, res) => {
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

    if (member.dataValues.status === 'co-host' || member.dataValues.status === 'member') {
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

            },
            include: {
                model: Event,
                attributes: []
            }
        });

        let images = ''
        if (image.length > 1) {
        image.forEach((element, i) => {
            if (i === 0) {
                images += element.dataValues.url
            }
            images += ', ' + element.dataValues.url

        });
        }
        else if (image.length == 1) {
            images += image[0].dataValues.url
        }
        else {
            images = ''
        }

        Events[i].dataValues.previewImage = images

        Events[i].dataValues.numAttending = num

    }

    }

    res.json({
        Events
    })

})

router.post('/:id/events', requireAuth, async (req, res) => {
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body
    let id = req.params.id;
    let ids = await Group.findByPk(id);
    let { user } = req


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

})

router.get('/:id/members', async (req, res) => {
    let id = req.params.id;
    let { user }= req

    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id,
            groupId: id
        }
    })

    if (!member) {
        res.status(404).json({
            message: "Membership between the user and the group does not exist"
        })
        }


    let group = await Group.findByPk(id);

    if (!group) {
        res.status(404).json({
            message: "Group couldn't be found"
        })
    }

    let Members

    if (!member) {
        Members = await User.findAll({
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
    else if (member.dataValues.status === 'co-host'){
        Members = await User.findAll({
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

    let otherMember = await Membership.findOne({
        where: {
            userId: memberId,
           groupId: parseInt(id)
        }
    })

    let pendingMember = await User.findByPk(memberId)

    if (!pendingMember) {
        res.status(400).json({
                message: "Validation Error",
                errors: {
                  memberId: "User couldn't be found"
                }
        })
    }

    if (member.dataValues.status === 'co-host') {
        otherMember.set({
            status
        })

        await otherMember.save()

        res.json(
            otherMember
        )
    }
    else if (status === pending) {
        res.status(400).json({
            message: "Validations Error",
            errors: {
              status : "Cannot change a membership status to pending"
            }
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

    let pendingMember = await User.findByPk(memberId)

    if (!pendingMember) {
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

})


module.exports = router;
