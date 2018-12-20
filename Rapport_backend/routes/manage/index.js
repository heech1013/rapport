const router = require('express').Router();
const { check } = require('express-validator/check');
const ctrl = require('./manage.ctrl');

/* GET '/manage/case' : 모든 상담케이스 조회 */
router.get('/case', ctrl.caseIndex);

/* PATCH '/manage/case/:id' : 상담케이스 confirmation 수정 */
router.patch('/case/:id', ctrl.caseUpdate);

/* GET '/manage/counselor' : 모든 상담사 회원 조회 */
router.get('/counselor', ctrl.counselorIndex);

/* PATCH '/manage/counselor/:id : 상담사 자격 및 지역 수정 */
router.patch('/counselor/:id', [
    check('qualification',
      'GS', 'YC', 'GR', 'YDP', 'DJ', 'GC', 'GA', 'SC', 'GN', 'SP', 'GD', 'MP', 'EP',
      'SDM', 'JN', 'YS', 'SB', 'GB', 'DB', 'NW', 'JNg', 'DDM', 'SD', 'GJ', 'JG'
    ).isBoolean()
  ],
  ctrl.counselorUpdate
);

module.exports = router;