const router = require('express').Router();
const { check } = require('express-validator/check');
const ctrl = require('./client.ctrl');

/* GET '/client/auth' : 일반 사용자 추가. 인증 이메일의 링크를 통해 접근 */
router.get('/auth', ctrl.emailAuth);

/* GET '/client' : 일반 사용자 모두 조회 */

/* POST '/client' : 회원가입(이메일 인증) */
router.post('/', [
    check('email').isEmail(),
    check('password').isLength({ min:8, max:16 })
  ],
  ctrl.create
);

module.exports = router;