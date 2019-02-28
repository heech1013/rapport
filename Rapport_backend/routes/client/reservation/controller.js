const router = require('express').Router();

const { checkForParamId, checkForClientId, checkForCreateClientRsv, checkForDestroyClientRsv } = require('../../../middlewares/validator/check');
const show = require('./show');
const index = require('./index');
const create = require('./create');
const destroy = require('./destroy');

/* GET '/reservation/:id' : 예약 자세히 보기(사용자용 상담예약관리 페이지) */
router.get('/:id', checkForParamId, show);
/* GET '/reservation' : 전체 예약 조회(사용자용 상담예약관리 페이지) */
router.get('/', checkForClientId, index);
/* POST '/reservation' : 상담 예약 */
router.post('/', checkForCreateClientRsv, create);
/* DELETE '/reservation/:id' : (사용자용) 예약 취소 */
router.delete('/:id', checkForDestroyClientRsv, destroy);

module.exports = router;