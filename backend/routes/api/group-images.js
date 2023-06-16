const express = require('express');
const { Op } = require('sequelize');

//const bcrypt = require('bcryptjs');
//const { check } = require('express-validator');
//const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');

const { User, Group, Venue, GroupImage, Membership } = require('../../db/models');


const router = express.Router();

router.delete('/:id', requireAuth, async (req, res) => {

    let id = req.params.id
    const { user } = req

    let member = await Membership.findOne({
        where: {
            userId: user.dataValues.id,
        },
    })

    if (!member) {
        res.json({
            message: "Membership between the user and the group does not exist"
        })
    }

    let image = await GroupImage.findByPk(id, {
        where: {
            groupId: member.dataValues.groupId
        }
    })

    if (!image) {
        res.json({
            message: "Group Image couldn't be found"
        })
    }

    if (member.dataValues.status === "co-host" && member.dataValues.groupId === image.dataValues.groupId) {

       image.destroy()

        res.json(
            {
            message: "Successfully deleted"
            }
        )

    }



})






module.exports = router;
