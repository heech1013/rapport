const router = require('express').Router();

const { checkForCounselor } = require('../../middlewares/validator/check');
const tokenVerify = require('../../middlewares/tokenVerify/tokenVerify');
const create = require('./create');
const show = require('./show');

/* '/counselor/profile' */
router.use('/profile', tokenVerify('counselor'), require('./profile/controller'));
/* '/counselor/open' */
router.use('/open', require('./open/controller'));
/* '/counselor/close' */
router.use('/close', require('./close/controller'));
/* '/counselor/reservation' */
router.use('/reservation', require('./reservation/controller'));

/* GET '/counselor/:id' :상담사 자세히 보기 */
router.get('/:id', show);
/* POST '/counselor': 상담사 생성(회원가입) */
router.post('/', checkForCounselor, create);

module.exports = router;