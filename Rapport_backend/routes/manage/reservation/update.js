const CustomError = require('../../../middlewares/errorHandler/customError');
const fiveSessionArrayMaker = require('../../../middlewares/dateMaker/fiveSessionArray');
const { Sequelize, Reservation } = require('../../../models');

const { Op } = Sequelize;

/* 기능: 상담 예약 확정 처리하기
  1회기의 예약 데이터 id를 받아, 총 5회기의 예약 데이터를 찾은 후 confirmation을 true 처리한다. */

const update = async (req, res, next) => {
  try {
    const { id } = req.params;  // reservation의 id

    const session1 = await Reservation.findOne({
      attributes: ['date', 'time', 'session', 'fkCounselorId', 'fkClientId'],
      where: { id }
    });

    const fiveSessionArray = await fiveSessionArrayMaker(session1.date);

    const session5Arr = await Reservation.findAll({
      attributes: ['id'],
      where: {
        date: {
          [Op.in]: fiveSessionArray
        },
        time: session1.time,
        fkCounselorId: session1.fkCounselorId,
        fkClientId: session1.fkClientId,
        confirmation: false
      }
    });

    if (session5Arr.length !== 5 || session1.session != 1) {
      return next(
        CustomError('BadRequest', 'Reservation is not searched in 5 session.')
      )
    } else {
      await Reservation.update(
        {
          confirmation: true
        },
        {
          where: {
            date: {
              [Op.in]: fiveSessionArray
            },
            time: session1.time,
            fkCounselorId: session1.fkCounselorId,
            fkClientId: session1.fkClientId,
            confirmation: false
          }
        }
      )
    }

    return res.status(200).json({ success: true,  });
  } catch (error) {
    next(error);
  }
};

module.exports = update;