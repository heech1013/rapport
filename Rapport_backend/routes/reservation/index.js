const router = require('express').Router();
const { check } = require('express-validator/check');
const ctrl = require('./reservation.ctrl');

/* GET '/reservation/:id' : 예약 자세히 보기(사용자용 상담예약관리 페이지) */
router.get('/:id', ctrl.show);

/* GET '/reservation' : 전체 예약 조회(사용자용 상담예약관리 페이지) */
router.get('/', ctrl.index);

/* POST '/reservation' : 상담 예약 */
router.post('/', [
    check('date', 'name', 'problem').isLength({ min: 1 }),
    check('time', 'sex', 'age').isNumeric()
  ],
  ctrl.create
);

/* DELETE '/reservation/:id' : 예약 제거 */
router.delete('/:id', ctrl.destroy);

module.exports = router;