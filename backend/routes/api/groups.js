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


module.exports = router;
