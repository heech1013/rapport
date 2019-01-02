const router = require('express').Router();

const index = require('./index');
const update = require('./update');

/* GET '/manage/case' : 모든 상담케이스 조회 */
router.get('/', index);
/* PATCH '/manage/case/:id' : 상담케이스 confirmation 수정 */
router.patch('/:id', update);

module.exports = router;