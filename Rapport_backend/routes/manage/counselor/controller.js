const router = require('express').Router();

const { checkForCounselorManage } = require('../../../middlewares/validator/check');
const index = require('./index');
const update = require('./update');

/* GET '/manage/counselor' : 모든 상담사 회원 조회 */
router.get('/', index);
/* PATCH '/manage/counselor/:id : 상담사 자격 및 지역 수정 */
router.put('/:id', checkForCounselorManage, update);

module.exports = router;