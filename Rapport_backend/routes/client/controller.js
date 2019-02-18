const router = require('express').Router();

const { checkForClient } = require('../../middlewares/validator/check');
const create = require('./create');

/* '/client/reservation' */
router.use('/reservation', require('./reservation/controller'));

/* POST '/client' : 회원가입(이메일 인증) */
router.post('/', checkForClient, create);

module.exports = router;