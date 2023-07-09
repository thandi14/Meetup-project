const express = require('express');
const bcrypt = require('bcryptjs');


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

    const validateSignup = [
    check('firstName')
      .isLength({ min: 1 })
      .withMessage('First Name is required'),
      check('lastName')
      .isLength({ min: 1 })
      .withMessage('Last Name is required'),
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
    ];

router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { email, password, username, firstName, lastName } = req.body;
      const hashedPassword = bcrypt.hashSync(password);

      const userEmails = await User.findAll({
          attributes: ['email']
        })

        let allEmails = []
        for (let emails of userEmails) {
            allEmails.push(emails.dataValues.email)
        }
        const userUsername = await User.findAll({
            attributes: ['username']
        })
        let allUsernames = []
        for (let usernames of userUsername) {
            allUsernames.push(usernames.dataValues.username)
        }

        let safeUser

        if (allEmails.includes(email)) {

            res.json(
                {
                    message: "User already exists",
                    errors: {
                        email: "User with that email already exists"
                    }
                },
                res.statusCode = 500
                )
        }
        else if (allUsernames.includes(username)) {

                res.json(
                    {
                        message: "User already exists",
                        errors: {
                            username: "User with that username already exists"
                        }
                    },
                    res.statusCode = 500
                    )
        }
        else {

            const user = await User.create({ email, username, hashedPassword, firstName, lastName });

            safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username


        }
      };



      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser
      });
    }
);

module.exports = router;
