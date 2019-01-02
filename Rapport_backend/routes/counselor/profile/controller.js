const router = require('express').Router();

const { checkForCounselorProfile } = require('../../../middlewares/validator/check');
const show = require('./show');
const update = require('./update');

/* GET '/counselor/profile/:id' : 상담사 프로필 조회 */
router.get('/:id', show);
/* PUT '/counselor/profile/:id' : 상담사 프로필 수정 */
router.put('/:id', checkForCounselorProfile, update);

module.exports = router;