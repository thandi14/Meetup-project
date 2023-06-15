const express = require('express');
const { Op } = require('sequelize');

//const bcrypt = require('bcryptjs');
//const { check } = require('express-validator');
//const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, restoreUser, requireAuth, } = require('../../utils/auth');

const { User, Group, Venue, GroupImage, Event, EventImage, Membership } = require('../../db/models');
const { JsonWebTokenError } = require('jsonwebtoken');

const router = express.Router();

router.get('/', async (req, res) => {
    let groups = await Group.findAll({
        include: User

    })

    res.json({groups})

})

router.get('/current', requireAuth, async (req, res) => {
        const { user } = req;

        let userGroups = await Group.findOne({
            where: {
                organizerId: user.dataValues.id
            },
            include: User
        })

        res.json({
        userGroups
        })

})

router.get('/:id', async (req, res) => {
    let id = req.params.id;
    let ids = await Group.findByPk(id);

    if (!ids) {

    res.json({"message": "Group couldn't be found"});

    }


    let group = await Group.findByPk(id, {
        include: [{
            model: GroupImage
        },
        {
            model: User
        },
        {
            model: Venue
        }]
    })

    res.json({
        group
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

    res.json({
        group
    })
})

router.post('/:id/images', requireAuth, async (req, res) => {
    const { url, preview } = req.body
    let id = req.params.id;

    let ids = await Group.findByPk(id);

    if (!ids) {

    res.json({"message": "Group couldn't be found"});

    }

    let image = await GroupImage.create({
        groupId: id,
        url,
        preview
    });

    res.json({
        image
    })

})

router.put('/:id', requireAuth, async (req, res) => {

    const { name, about, type, private, city, state } = req.body
    let id = req.params.id;

    let ids = await Group.findByPk(id);

    if (!ids) {

    res.json({"message": "Group couldn't be found"});

    }

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

    res.json({
        ids
    })
})

router.delete("/:id", requireAuth, async (req, res) => {
    let id = req.params.id;

    let ids = await Group.findByPk(id);

    if (!ids) {

    res.json({"message": "Group couldn't be found"});

    }

    await ids.destroy()

    res.json({
        message: "Successfully deleted"
    })

})

router.get('/:id/venues', requireAuth, async (req, res) => {

    let id = req.params.id;

    let ids = await Group.findByPk(id);

    if (!ids) {

    res.json({"message": "Group couldn't be found"});

    }

    let venue = await Venue.findAll({
            where: {
                groupId: id
            }
    })

    res.json({
        venue
    })

})

router.post('/:id/venues', requireAuth, async (req, res) => {
    const { address, city, state, lat, lng } = req.body
    let id = req.params.id;

    let ids = await Group.findByPk(id);

    if (!ids) {

    res.json({"message": "Group couldn't be found"});

    }

    let venue = await Venue.create({
        groupId: parseInt(id),
        address,
        city,
        state,
        lat,
        lng
    })


    res.json({
        venue
    })
})

router.get('/:id/events', async (req, res) => {
    let id = req.params.id;

    let ids = await Group.findByPk(id);

    if (!ids) {

    res.json({"message": "Group couldn't be found"});

    }

    let events = await Event.findByPk(id, {
        include: [
            {
                model: Venue
            },
            {
                model: Group
            },
        ]
    })

    res.json({
        events
    })

})

router.post('/:id/events', requireAuth, async (req, res) => {
    const { venueId, name, type, capacity, price, description } = req.body
    let id = req.params.id;
    let ids = await Group.findByPk(id);


    if (!ids) {

        res.json({"message": "Group couldn't be found"});

    }

    let event = await Event.create({
        groupId: id,
        venueId,
        name,
        type,
        capacity,
        price
    });

    res.json({
        event
    })

})

router.get('/:id/members', async (req, res) => {
    let id = req.params.id;
    let { user }= req

    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id
        }
    })

    let group = await Group.findByPk(id);

    if (!group) {
        res.json({
            message: "Group couldn't be found"
        })
    }

    let ids

    if (member.dataValues.status !== 'pending') {
     ids = await User.findAll({
        include: {
            model: Membership,
            attributes: ['status'],
            where: {
                groupId: id
            }
        },
    });
    }
    else {
        res.json({
            message: "Group couldn't be found"
        })
    }

    res.json({
        ids
    })


})


router.post('/:id/membership', requireAuth, async (req, res) => {
    let id = req.params.id;
    let { user } = req

    let group = await Group.findByPk(id);

    if (!group) {
        res.json({
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
        res.json({
            "message": "Membership has already been requested"
        })
    }
    else if (member && member.dataValues.status === 'co-host' || member.dataValues.status === 'member') {
        res.json({
            message: "User is already a member of the group"
          })
    }

    res.json({
        membership
    })

})

router.put('/:id/membership', requireAuth, async (req, res) => {
    const { memberId, status } = req.body

    let id = req.params.id;
    let { user } = req

    let group = await Group.findByPk(id);

    if (!group) {
        res.json({
            message: "Group couldn't be found"
        })
    }

    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id,
            groupId: parseInt(id)
        }
    })

    let otherMember = await Membership.findOne({
        where: {
            userId: memberId,
            groupId: parseInt(id)
        }
    })

    let pendingMember = await User.findByPk(memberId)

    if (member.dataValues.status === 'co-host') {
        otherMember.set({
            status
        })

        await otherMember.save()

        res.json({
            otherMember
        })
    }
    else if (!pendingMember) {
        res.json({
                message: "Validation Error",
                errors: {
                  memberId: "User couldn't be found"
                }
        })
    }
    else if (!member) {
        res.json({
            message: "Membership between the user and the group does not exist"
        })
    }
    else {
        res.json({
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
        res.json({
            message: "Group couldn't be found"
        })
    }

    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id,
            groupId: parseInt(id)
        }
    })

    let otherMember = await Membership.findOne({
        where: {
            userId: memberId,
            groupId: parseInt(id)
        }
    })

    let pendingMember = await User.findByPk(memberId)


    if (member.dataValues.status === 'co-host') {
        otherMember.destroy()

        res.json({
            message: "Successfully deleted membership from group"
          })
    }
    else if (!pendingMember) {
        res.json({
                message: "Validation Error",
                errors: {
                  memberId: "User couldn't be found"
                }
        })
    }
    else if (!otherMember) {
        res.json({
            message: "Membership between the user and the group does not exist"
        })
    } else if (member.dataValues.status === 'member' && memberId === user.dataValues.id) {
        member.destroy()

        res.json({
            message: "Successfully deleted membership from group"
          })
    }

})

module.exports = router;
