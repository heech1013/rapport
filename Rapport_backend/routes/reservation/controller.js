const router = require('express').Router();

const { checkForReservation } = require('../../middlewares/validator/check');
const show = require('./show');
const index = require('./index');
const create = require('./create');
const destroy = require('./destroy');

/* GET '/reservation/:id' : 예약 자세히 보기(사용자용 상담예약관리 페이지) */
router.get('/:id', show);
/* GET '/reservation' : 전체 예약 조회(사용자용 상담예약관리 페이지) */
router.get('/', index);
/* POST '/reservation' : 상담 예약 */
router.post('/', checkForReservation, create);
/* DELETE '/reservation/:id' : 예약 제거 */
router.delete('/:id', destroy);

module.exports = router;