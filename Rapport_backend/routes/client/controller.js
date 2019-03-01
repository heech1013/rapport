const router = require('express').Router();

const { checkForCreateClient } = require('../../middlewares/validator/check');
const tokenVerify = require('../../middlewares/tokenVerify/tokenVerify');

const create = require('./create');

/* '/client/reservation' */
router.use('/reservation', tokenVerify('client'), require('./reservation/controller'));

/* POST '/client' : 회원가입(이메일 인증) */
router.post('/', checkForCreateClient, create);

module.exports = router;