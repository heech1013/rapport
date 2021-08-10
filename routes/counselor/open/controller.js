const router = require('express').Router();

const { checkForCounselorId } = require('../../../middlewares/validator/check');

const index = require('./index');
const update = require('./update');

/* GET '/open' : 상담사의 상담 오픈 조회 */
router.get('/', checkForCounselorId, index);
/* POST '/open' : 상담케이스 수정 */
router.put('/', checkForCounselorId, update);

module.exports = router;