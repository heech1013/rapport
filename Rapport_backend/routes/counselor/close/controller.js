const router = require('express').Router();

const index = require('./index');
const update = require('./update');

/* GET '/close' : 휴무일 조회 */
router.get('/', index);
/* PUT '/close' : 휴무일 변경(사실은 생성과 삭제) */
router.put('/', update);

module.exports = router;