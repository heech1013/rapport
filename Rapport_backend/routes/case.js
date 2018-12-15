const express = require('express');
const { sequelize, User, Case, CounselorProfile, Application } = require('../models')

const router = express.Router();

/* GET '/case/:id' : 상담사 전용 상담케이스 관리 페이지 -> 상담 케이스 자세히 보기 */
router.get('/:id', async (req, res, next) => {
  try{
    const { id } = req.params;  // case의 id
    const caseDetail = await Case.findOne({
      attributes: [ 'date', 'time', 'confirmation', 'price', 'address' ],
      where: { id },
      include: [
        {
          model: User,
          as: 'fkClient',
          attributes: [ 'nick' ]
        },
        {
          model: Application,
          as: 'CaseApplication',
          attributes: ['name', 'sex', 'age', 'problem']
        }
      ]
    });
    return res.status(200).json({ caseDetail });
  } catch (error) {
    next(error);
  }
})

/* GET '/case' : 상담 케이스 전체 조회(상담사 전용 상담케이스 관리 페이지) */
router.get('/', async (req, res, next) => {  // GET '/case?counselorId=3&date=2018-12-12'
  try{
    const { counselorId, date } = req.query;
    // 구획 종류: 오픈한 케이스 / 예약신청된 / 예약확정된 / 시간지난?(달력선택 말고 다른 버튼을 둬야 함)
    // 정보: 날짜 및 시간 / 고객 닉네임
    // 기능: 자세히 보기 / 삭제
    const caseList = await Case.findAll({
      attributes: ['id', 'date', 'time', 'confirmation'],
      where: { fkCounselorId : counselorId, date },
      include: [
        {
          model: User,
          as: 'fkClient',
          attributes: ['nick']
        }
      ]
    });
    return res.status(200).json({ caseList });
    /* 오픈한 케이스 : 검색 결과의 모든 케이스
      오픈은 했지만 예약은 안된 케이스: "user"가 null
      예약 신청만 된 케이스: "user"가 있고 confirmation은 false
      예약 신청 후 결제 완료(예약 완료)된 케이스: confirmation이 true
    */
  } catch (error) {
    next(error);
  }
});

/* POST '/case' : 상담 케이스 생성 */
router.post('/', async (req, res, next) => {  // POST '/case?counselorId=3'
  try{
    const { counselorId } = req.query;
    let counselorProfile = await CounselorProfile.findOne({
      attributes: ['price', 'address'],
      where: { fkCounselorId: counselorId }
    });

    // Unmanaged transaction(sequelize)
    return sequelize.transaction().then(function (t) {
      // make sure you return all query.
      // method마다 transaction:t 옵션을 줘야 하는 argument 위치가 다름.
      return Case.bulkCreate([
        // price를 임의의 값으로 줘야 함. 아무 값이나~
        { date: '2018-12-11', time: 1, fkCounselorId: 9, price: 1, address: 'foo' },
        { date: '2018-12-18', time: 1, fkCounselorId: 9, price: 1, address: 'foo' },
        { date: '2018-12-25', time: 1, fkCounselorId: 9, price: 1, address: 'foo' },
      ], {transaction: t})
        .then(function() {
          return Case.update(
            { 
              price: counselorProfile.price,
              address: counselorProfile.address
            },
            {
              where: { fkCounselorId: 9 },
              transaction: t
            }
          )
        })
        .then(function () {
          t.commit();
          return res.status(201).json({ caseOpenSuccess: true });
        })
        .catch(function (error) {
          t.rollback();
          return next(error);
        })
        
    })
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try{
    // 케이스가 예약되지 않은 상태인지 확인하는 것: 현우가 1차로, 내가 2차로
    const { id } = req.params;  // case의 id
    const CasePrototype = await Case.findOne({
      where: { id }
    });
    if (CasePrototype.fkClientId) {
      return res.status(400).json({ message: 'Already Reserved Case' });
    } else {
      await CasePrototype.destroy();
      return res.status(204).json({ deleteCase: true });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;