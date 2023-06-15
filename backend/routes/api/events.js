const express = require('express');
const { Op } = require('sequelize');

//const bcrypt = require('bcryptjs');
//const { check } = require('express-validator');
//const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');

const { User, Group, Venue, GroupImage, Event, EventImage } = require('../../db/models');


const router = express.Router();

router.get('/', async (req, res) => {
    let events = await Event.findAll();

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

    let image = await EventImage.create({
        groupId: id,
        url,
        preview
    });

    res.json({
        image
    })
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


})

router.delete("/:id", requireAuth, async (req, res) => {
    let id = req.params.id;
    let ids = await Group.findByPk(id);



    if (!ids) {

        res.json({"message": "Event couldn't be found"});

    }



    await Event.destroy({
        where: {
            id: parseInt(id)
        }
    })




    res.json({
        message: "Successfully deleted"
    })

})


module.exports = router;
