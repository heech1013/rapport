const { validationResult } = require('express-validator/check');
const format = require('date-fns/format');
const addDays = require('date-fns/add_days');
const { sequelize, User, Case, CounselorProfile, Application } = require('../../models');

const show = async (req, res, next) => {
  try{
    const { id } = req.params;  // case의 id
    const reservationDetail = await Case.findOne({
      attributes: ['id','date', 'time', 'confirmation', 'price', 'address'],
      where: { id },
      include: [
        {
          model: User,
          as: 'fkCounselor',
          attributes: ['name'],
          include: [
            {
              model: CounselorProfile,
              as: 'CounselorProfile',
              attributes: ['name']
            }
          ]
        }
      ]
    });
    return res.status(200).json({ reservationDetail });
  } catch (error) {
    next(error);
  }
};

const index = async (req, res, next) => {
  try{
    const { clientId } = req.query;  // user(client)의 id
    // 구획: 예약 신청 / 확정
    // 정보: 상담사 이름 /  날짜 및 시간 /  예약 상태(신청/확정)
    // 기능 : 자세히 보기 / 예약 신청 취소 (예약 확정 시 취소하려면 고객센터. 환불필요)

    const UserPrototype = await User.findOne({
      where: { id: clientId }
    });
    const reservationList = await UserPrototype.getReservedCases({
      attributes: [ 'id', 'date', 'time', 'confirmation' ],
      include: [
        {
          model: User,
          as: 'fkCounselor',
          attributes: ['id'],
          include: [
            {
              model: CounselorProfile,
              as: 'CounselorProfile',
              attributes: ['name']
            }
          ]
        }
      ]
    });
    return res.status(200).json({ reservationList });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try{
    const {
      clientId, counselorId,  // reservation info
      date, time,  // Case
      name, sex, age, problem  // Application
    } = req.body;
    
    // req check 결과
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      return res.status(400).json({ validationError: true, body: validationError.array() });
    }
    // date 형식 체크(YYYY.MM.DD)
    const dateRegExp = /([12]\d{3}\-(0[1-9]|1[0-2])\-(0[1-9]|[12]\d|3[01]))/;
    if (!dateRegExp.test(date)) {
      return res.status(400).json({ validationError: true, body: "date" });
    }
    // 5회기분 날짜 배열 생성
    let dateArray = [date];
    for(let x = 1; x <= 4; x++) {
      dateArray[x] = format( addDays(date, x * 7), 'YYYY-MM-DD' );
    }
    
    // Unmanaged transaction(sequelize) + await/async
    const transaction = await sequelize.transaction();
    try{
      await Case.update(
        { fkClientId: clientId },
        {
          where: {
            fkCounselorId: counselorId,
            fkClientId: null,
            date: dateArray,
            time
          }, 
          transaction
        });
      let casePrototype = await Case.findOne({
        where: {
          fkCounselorId: counselorId,
          fkClientId: clientId,
          date: dateArray[0],
          time
        },
        include: [
          {
            model: Application,
            as: 'CaseApplication'
          }
        ],
        transaction
      });
      await casePrototype.createCaseApplication({
        name, sex, age, problem
      }, { transaction });
      await transaction.commit();
      return res.status(201).json({ reservationSuccess: true });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try{
    // 케이스가 예약 확정되지 않은 상태인지 확인하는 것: 현우가 1차, 내가 2차로
    const { id } = req.params;  // case의 id
    const CasePrototype = await Case.findOne({
      where: { id }
    });
    if (CasePrototype.confirmation === true ) {
      return res.status(400).json({ message: 'Already Confirmed Reservation' });
    } else {
      await CasePrototype.destroy();
      return res.status(204).json({ deleteReservation: true });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { show, index, create, destroy };