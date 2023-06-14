const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const user = require('../../db/models/user');

const router = express.Router();



router.get(
  '/', requireAuth,
  async (req, res) => {
  const { user } = req;

    if (user) {
    const safeUser = {
     id: user.id,
     firstName: user.firstName,
     lastName: user.lastname,
     email: user.email,
     username: user.username,
     };
     return res.json({
     user: safeUser
    });
    } else {
    return res.json({
    user: null,
    },
    )
    }
})

    const validateLogin = [
        check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid email or username.'),
        check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a password.'),
        handleValidationErrors
    ];

router.post(
    '/', validateLogin,
    async (req, res, next) => {
    const { credential, password, firstName, lastName } = req.body;

    const user = await User.unscoped().findOne({
     where: {
        [Op.or]: {
         username: credential,
         email: credential
         }
     }
    });


             if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
               console.log('this better not work')
               const err = new Error('Login failed');
               err.status = 401;
               err.title = 'Login failed';
               err.errors = { credential: 'The provided credentials were invalid.' };
               return next(err);
             }

             const userEmails = await User.findAll({
               attributes: ['email']
             })

             let credentials = []
             for (let emails of userEmails) {
                 credentials.push(emails.dataValues.email)
             }

             const userUsername = await User.findAll({
               attributes: ['username']
             })

             for (let usernames of userUsername) {
               credentials.push(usernames.dataValues.username)
             }

             if (!credentials.includes(credential)) {
                 console.log('this better not work')
               const err = new Error('Login failed');
               err.status = 401;
               err.title = 'Login failed';
               err.errors = { credential: 'The provided credentials were invalid.' };
               return next(err);
             }

        const safeUser = {
         id: user.id,
         firstName,
         lastName,
         email: user.email,
         username: user.username,
        };

        await setTokenCookie(res, safeUser);

        return res.json({
        user: safeUser
        });
    }
);


module.exports = router;
