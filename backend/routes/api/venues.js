const express = require('express');
const { Op } = require('sequelize');

//const bcrypt = require('bcryptjs');
//const { check } = require('express-validator');
//const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');

const { User, Group, Venue, GroupImage, Membership } = require('../../db/models');


const router = express.Router();


router.put('/:id', requireAuth, async (req, res) => {
    const { address, city, state, lat, lng } = req.body;
    const { user } = req

    let id = req.params.id;

    let ids = await Venue.findByPk(id, {
    }
    );

    if (!ids) {

    res.json({"message": "Venue couldn't be found"});

    }

    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id,
        }
    })

    if (!member) {
        res.json({
            message: "Membership between the user and the group does not exist"
        })
    }

    if (member.dataValues.status === 'co-host') {
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
    }

})


module.exports = router;
