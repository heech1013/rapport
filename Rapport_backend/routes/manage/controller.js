const router = require('express').Router();

/* 'manage/case' */
router.use('/case', require('./case/controller'));
/* 'manage/counselor' */
router.use('/counselor', require('./counselor/controller'));
/* 'manage/reservation */
router.use('/reservation', require('./reservation/controller'));

module.exports = router;