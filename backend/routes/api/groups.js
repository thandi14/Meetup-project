const express = require('express');
const { Op } = require('sequelize');

//const bcrypt = require('bcryptjs');
//const { check } = require('express-validator');
//const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');

const { User, Group, Venue, GroupImage } = require('../../db/models');

const router = express.Router();

router.get('/', async (req, res) => {
    let groups = await Group.findAll({
        include: User

    })

    res.json({groups})

})

router.get('/current', requireAuth, async (req, res) => {
        const { user } = req;
        console.log(user)

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

router.post('/', async (req, res) => {
    const { name, about, type, private, city, state} = req.body;
    let group = await Group.create({
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

router.post('/:id/images', async (req, res) => {
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

router.put('/:id', async (req, res) => {

    const { name, about, type, private, city, state } = req.body
    let id = req.params.id;

    let ids = await Group.findByPk(id);

    if (!ids) {

    res.json({"message": "Group couldn't be found"});

    }

    ids.set({
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

router.delete("/:id", async (req, res) => {
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

module.exports = router;
