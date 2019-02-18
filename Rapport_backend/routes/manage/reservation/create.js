const validationResult = require('../../../middlewares/validator/validationResult');
const dateValidator = require('../../../middlewares/validator/dateValidator');
const fiveSessionArrayMaker = require('../../../middlewares/dateMaker/fiveSessionArray');
const CustomError = require('../../../middlewares/errorHandler/customError');

const { sequelize, Sequelize, Reservation } = require('../../../models');

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
      let obj = { "date": fiveSessionArray[i], "time": time, "price": price, "address": address, "fkClientId": clientId, "fkCounselorId": counselorId };
      bulkCreateArray.push(obj);
    }

    // Unmanaged transaction(sequelize) + await/async
    const transaction = await sequelize.transaction();
    try {
      /* [예약 가능 시간 조회] ~ [상담 신청] 사이 해당 날짜/시간에 새로운 예약이 이미 등록되어 있지는 않은지 확인 */
      const alreadyExistReservation = await Reservation.findAll({
        where: {
          date: {
            [Op.in]: fiveSessionArray
          },
          time,
          fkCounselorId: counselorId,
          fkClientId: clientId
        }
      });

      if (alreadyExistReservation.length) {
        next(
          CustomError('BadRequest', 'Already reserved.')
        );
      }
      
      await Reservation.bulkCreate([
        ...bulkCreateArray
      ], { transaction });

      const Session1 = await Reservation.findOne({
        where: {
          date, time,
          fkClientId: clientId,
          fkCounselorId: counselorId
        },
        transaction
      });

      await Session1.createApplication({
        name, sex, age, problem
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