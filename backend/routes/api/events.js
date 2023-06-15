const express = require('express');
const { Op } = require('sequelize');

//const bcrypt = require('bcryptjs');
//const { check } = require('express-validator');
//const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');

const { User, Group, Venue, GroupImage, Event } = require('../../db/models');


const router = express.Router();


router.get('/', async (req, res) => {
    let events = await Event.findAll()

    res.json({
        events
    })
})




module.exports = router;
