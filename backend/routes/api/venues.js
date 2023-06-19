const express = require('express');
const { Op } = require('sequelize');

//const bcrypt = require('bcryptjs');
//const { check } = require('express-validator');
//const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');

const { User, Group, Venue, GroupImage, Membership } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

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


router.put('/:id', validateVenue, requireAuth, async (req, res) => {
    const { address, city, state, lat, lng } = req.body;
    const { user } = req

    let id = req.params.id;

    let ids = await Venue.findByPk(id, {
    }
    );

    console.log(ids)

    if (!ids) {

    res.status(404).json({message: "Venue couldn't be found"});

    }

    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id,
            groupId: ids.dataValues.groupId
        }
    })

    if (!member) {
        res.status(404).json({
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

    res.json(
        ids
    )
    }
    else {
        res.status(404).json({
            message: "Only the organizer may edit a venue"
    })
    }

})


module.exports = router;
