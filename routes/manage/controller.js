const router = require('express').Router();

/* 'manage/counselor' */
router.use('/counselor', require('./counselor/controller'));
/* 'manage/reservation */
router.use('/reservation', require('./reservation/controller'));
/* 'manage/open' */
router.use('/open', require('./open/controller'));

module.exports = router;