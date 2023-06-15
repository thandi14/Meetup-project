const express = require('express');
const { Op } = require('sequelize');

//const bcrypt = require('bcryptjs');
//const { check } = require('express-validator');
//const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');

const { User, Group, Venue, GroupImage } = require('../../db/models');


const router = express.Router();


router.put('/:id', requireAuth, async (req, res) => {
    const { address, city, state, lat, lng } = req.body;

    let id = req.params.id;

    let ids = await Venue.findByPk(id, {
        include: [
        {
            model: Venue
        },
        {
            model: Group
        },
    ]
    }
    );

    if (!ids) {

    res.json({"message": "Venue couldn't be found"});

    }

    ids.set({
        address,
        city,
        state,
        lat,
        lng
    })

    await ids.save();

    res.json({
        ids
    })

})


module.exports = router;
