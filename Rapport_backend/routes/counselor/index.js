const router = require('express').Router();
const { check } = require('express-validator/check');
const ctrl = require('./counselor.ctrl');

/* GET '/counselor/auth': 상담사 추가. 인증 이메일의 링크를 통해 접근 */
router.get('/auth', ctrl.emailAuth);

/* GET '/counselor': 모든 상담사 불러오기 */

/* GET '/counselor/:id' :상담사 자세히 보기 */
router.get('/:id', ctrl.show);

/* POST '/counselor': 상담사 생성(회원가입) */
router.post('/', [
    check('email').isEmail(),
    check('password').isLength({ min: 8, max: 16 }),
    check('price').isNumeric(),
    check('family', 'relationship', 'personality', 'emotion', 'sexual', 'addiction', 'lifestyle', 'development', 'study').isBoolean(),
  ],
  ctrl.create
);

module.exports = router;