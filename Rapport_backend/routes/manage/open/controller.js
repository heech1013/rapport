const router = require('express').Router();

const index = require('./index');

/* GET '/manage/open' : 모든 상담사의 상담 오픈 계획 조회 */
router.get('/', index);

module.exports = router;