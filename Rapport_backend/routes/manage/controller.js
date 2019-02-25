const router = require('express').Router();

/* 'manage/counselor' */
router.use('/counselor', require('./counselor/controller'));
/* 'manage/reservation */
router.use('/reservation', require('./reservation/controller'));

module.exports = router;