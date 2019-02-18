const router = require('express').Router();

const { checkForId, checkForDeleteRsv, checkForReservation } = require('../../../middlewares/validator/check');
const show = require('./show');
const index = require('./index');
const create = require('./create');
const destroy = require('./destroy');

/* GET '/reservation/:id' : 예약 자세히 보기(사용자용 상담예약관리 페이지) */
router.get('/:id', checkForId, show);
/* GET '/reservation' : 전체 예약 조회(사용자용 상담예약관리 페이지) */
router.get('/', checkForId, index);
/* POST '/reservation' : 상담 예약 */
router.post('/', checkForReservation, create);
/* DELETE '/reservation/:id' : (사용자용) 예약 취소 */
router.delete('/:id', checkForDeleteRsv, destroy);

module.exports = router;