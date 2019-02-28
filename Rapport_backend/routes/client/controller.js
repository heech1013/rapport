const router = require('express').Router();

const { checkForCreateClient } = require('../../middlewares/validator/check');
const create = require('./create');

/* '/client/reservation' */
router.use('/reservation', require('./reservation/controller'));

/* POST '/client' : 회원가입(이메일 인증) */
router.post('/', checkForCreateClient, create);

module.exports = router;