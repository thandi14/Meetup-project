const router = require('express').Router();

const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const groupsRouter = require('./groups');
const venuesRouter = require('./venues');
const eventsRouter = require('./events')
const groupimagesRouter = require('./group-images')
const eventimagesRouter = require('./event-images')

const { restoreUser } = require("../../utils/auth.js");

router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
});

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/groups', groupsRouter);

router.use('/venues', venuesRouter);

router.use('/events', eventsRouter);

router.use('/group-images', groupimagesRouter)

router.use('/event-images', eventimagesRouter)


router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});


module.exports = router;
