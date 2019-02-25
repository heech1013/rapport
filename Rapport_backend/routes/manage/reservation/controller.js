const router = require('express').Router();

const index = require('./index');
const update = require('./update');

/* GET '/manage/reservation' : 전체 예약 조회(사용자용 상담예약관리 페이지) */
router.get('/', index);
/* PUT 'manage/reservation/:id */
router.put('/:id', update);

module.exports = router;