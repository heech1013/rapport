const router = require('express').Router();

const index = require('./index');
const update = require('./update');

/* GET '/open' : 상담사의 상담 오픈 조회 */
router.get('/', index);
/* POST '/open' : 상담케이스 수정 */
router.put('/', update);

module.exports = router;