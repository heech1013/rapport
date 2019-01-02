const router = require('express').Router();

const { checkForClient } = require('../../middlewares/validator/check');
const create = require('./create');

/* POST '/client' : 회원가입(이메일 인증) */
router.post('/', checkForClient, create);

module.exports = router;