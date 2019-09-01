const router = require('express').Router();

const { checkForParamId, checkForCreateCounselor } = require('../../middlewares/validator/check');
const tokenVerify = require('../../middlewares/tokenVerify/tokenVerify');

const create = require('./create');
const show = require('./show');
const index = require('./index');

/* '/counselor/profile' */
router.use('/profile', /* tokenVerify('counselor'), */ require('./profile/controller'));
/* '/counselor/open' */
router.use('/open', tokenVerify('counselor'), require('./open/controller'));
/* '/counselor/close' */
router.use('/close', tokenVerify('counselor'), require('./close/controller'));
/* '/counselor/reservation' */
router.use('/reservation', tokenVerify('counselor'), require('./reservation/controller'));

/* GET '/counselor/:id' :상담사 자세히 보기 */
router.get('/:id', checkForParamId, show);
/* GET '/counselor' : 상담사 전체 보기(검색필터) */
router.get('/', index);
/* POST '/counselor': 상담사 생성(회원가입) */
router.post('/', /*checkForCreateCounselor,*/ create);

module.exports = router;