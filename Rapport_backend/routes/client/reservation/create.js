const validationResult = require('../../../middlewares/validator/validationResult');
const dateValidator = require('../../../middlewares/validator/dateValidator');
const fiveSessionArrayMaker = require('../../../middlewares/dateMaker/fiveSessionArray');
const CustomError = require('../../../middlewares/errorHandler/customError');

const { sequelize, Sequelize, Reservation, Application } = require('../../../models');

const { Op } = Sequelize;

const create = async (req, res, next) => {
  try {
    const {
      date, time, price, address, clientId, counselorId,  // Reservation
      name, sex, age, problem  // Application
    } = req.body;
    
    await validationResult(req);
    await dateValidator(date);
    
    const fiveSessionArray = await fiveSessionArrayMaker(date);

    /* bulkCreate clause 생성 */
    const bulkCreateArray = [];
    for (let i = 0; i <= 4; i++) {
      let obj = { "date": fiveSessionArray[i], "time": time, "session": i + 1, "price": price, "address": address, "fkClientId": clientId, "fkCounselorId": counselorId };
      bulkCreateArray.push(obj);
    }

    // Unmanaged transaction(sequelize) + await/async
    const transaction = await sequelize.transaction();
    try {
      /* [예약 가능 시간 조회] ~ [상담 신청] 사이 해당 날짜/시간에 새로운 예약이 이미 등록되어 있지는 않은지 확인 */
      const alreadyRsved = await Reservation.findAll({
        where: {
          date: {
            [Op.in]: fiveSessionArray
          },
          time,
          fkCounselorId: counselorId,
          fkClientId: clientId
        }
      }, { transaction });

      if (alreadyRsved.length) {
        throw CustomError('BadRequest', 'Already reserved.')
      }
      
      await Reservation.bulkCreate([
        ...bulkCreateArray
      ], { transaction });

      /* 위에서 등록한 5회기의 상담 중 1회기의 상담 데이터의 protoType을 생성 */
      const session1 = await Reservation.findOne({
        attributes: ['id'],
        where: {
          date, time,
          session: 1,
          fkClientId: clientId,
          fkCounselorId: counselorId
        },
        transaction
      });

      /* 1회기 상담 예약 데이터가 없을 때(만약의 경우) */
      if (!session1.id) {
        throw CustomError('InternalSeverError');
      }
      
      /* 1회기의 상담에 상담 신청서를 종속시킨다. */
      await Application.create({
        name, sex, age, problem,
        fkReservationId: session1.id
      }, { transaction });

      await transaction.commit();
      return res.status(201).json({ success: true });
    
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = create;