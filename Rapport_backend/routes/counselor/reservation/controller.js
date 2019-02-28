const router = require('express').Router();

const { checkForCounselorId, checkForParamId } = require('../../../middlewares/validator/check');

const index = require('./index');
const show = require('./show');

/* GET '/counselor/reservation' : 예약 목록 전체 조회(상담사 마이페이지 - 상담예약확인) */
router.get('/', checkForCounselorId, index);
/* GET '/counselor/reservation/:id' : 예약 자세히 보기(상담사 마이페이지 - 상담예약확인) */
router.get('/:id', checkForParamId, show);

module.exports = router;