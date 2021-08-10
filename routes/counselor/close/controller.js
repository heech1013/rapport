const router = require('express').Router();

const { checkForCounselorId } = require('../../../middlewares/validator/check');

const index = require('./index');
const update = require('./update');

/* GET '/close' : 휴무일 조회 */
router.get('/', checkForCounselorId, index);
/* PUT '/close' : 휴무일 변경(사실은 생성과 삭제) */
router.put('/', checkForCounselorId, update);

module.exports = router;