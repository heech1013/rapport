const router = require('express').Router();
const ctrl = require('./case.ctrl');

/* GET '/case/:id' : 상담사 전용 상담케이스 관리 페이지 -> 상담 케이스 자세히 보기 */
router.get('/:id', ctrl.show);

/* GET '/case' : 상담 케이스 전체 조회(상담사 전용 상담케이스 관리 페이지) */
router.get('/', ctrl.index);

/* POST '/case' : 상담 케이스 생성 */
router.post('/', ctrl.create);

/* DELETE '/case/:id' : 상담 케이스 삭제 */
router.delete('/:id', ctrl.destroy);

module.exports = router;