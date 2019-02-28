const validationResult = require('../../../middlewares/validator/validationResult');
const dateValidator = require('../../../middlewares/validator/dateValidator');
const dateRangeValidator = require('../../../middlewares/validator/dateRange');
const fiveSessionArrayMaker = require('../../../middlewares/dateMaker/fiveSessionArray');
const CustomError = require('../../../middlewares/errorHandler/customError');

const { Sequelize, Reservation } = require('../../../models');

const { Op } = Sequelize;

const destroy = async (req, res, next) => {
  try {
    /* 클라이언트는 1회기의 date를 보내주어야 한다. */
    const { id } = req.params;
    const { clientId, counselorId, date, time } = req.body;

    await validationResult(req);
    await dateValidator(date);
    await dateRangeValidator('future', date);

    const fiveSessionArray = fiveSessionArrayMaker(date);

    const RsvPrototype = await Reservation.findAll({
      where: {
        date: {
          [Op.in] : fiveSessionArray
        },
        time,
        fkClientId: clientId,
        fkCounselorId: counselorId
      }
    });

    /* Promise 함수 정의 */
    const func = (Prototype) => {
      return new Promise((resolve, reject) => {
        for (let i in Prototype) {
          /* 클라이언트 측에서 넘어온 날짜 데이터가 1회기 상담의 날짜가 맞는지 확인 */
          if (Prototype[i].id == id &&Prototype[i].date === date && Prototype[i].session == 1) {
            flag = true;
          }
          /* 이미 예약 확정되지 않은 상태인지 확인: 현우가 1차, 내가 2차로 */
          if (Prototype[i].confirmation === true) {
            reject (
              CustomError('BadRequest', 'Reservation is already confirmed.')
            )
          }
          count++;
        }
        resolve();
      })
    };
    
    let flag = false, count = 0;
    await func(RsvPrototype);

    /* 검색된 예약 데이터가 5개가 맞는지 확인 */
    if (count !== 5) {
      return next(
        CustomError('BadRequest', 'Reservation is not 5 session.')
      )
    }
    /* 클라이언트 측에서 넘어온 날짜 데이터가 1회기 상담의 날짜와 일치할 때 */
    if (flag) {
      await Reservation.destroy({
        where: {
          date: {
            [Op.in] : fiveSessionArray
          },
          time,
          fkClientId: clientId,
          fkCounselorId: counselorId
        }
      });
      return res.status(204).json({ success: true });
    }
    /* 클라이언트 측에서 넘어온 날짜 데이터가 1회기 상담의 날짜와 일치하지 않을 때. */
    else {
      return next(
        CustomError('BadRequest', 'Reservation have no session 1.')
      )
    }
  } catch (error) {
    next(error);
  }
};

module.exports = destroy;