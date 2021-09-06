const { Sequelize, sequelize, Close, Reservation } = require('../../../models');
const CustomError = require('../../../middlewares/errorHandler/customError');
const validationResult = require('../../../middlewares/validator/validationResult');
const closeValidator = require('../../../middlewares/validator/closeValidator');

const { Op } = Sequelize;

const update = async (req, res, next) => {
  try {    
    const { counselorId, newClose, deadClose } = req.body;

    await validationResult(req);

    let createClause, destroyClause = null;
    
    /* newClose가 들어왔을 경우 */
    if (newClose.length) {
      // 유효성 검사(date, time)
      closeValidator(newClose);

      /* overlapClose를 조회 / newClose를 생성하는 데에 필요한 clause 생성 */
      createClause = newClose.map((obj) => {
        obj["fkCounselorId"] = counselorId;
        return obj
      });

      /* 일치하는 기존 휴무일 데이터 조회 */
      const overlapClose = await Close.findAll({
        where: {
          [Op.or]: createClause
        }
      });
      /* 기존 데이터가 있을 경우 */
      if (overlapClose.length) {
        return next(CustomError('BadRequest', 'Already exist close day.'))
      }

      /* 일치하는 예약 데이터 조회 */
      const overlapRsv = await Reservation.findAll({
        where: {
          [Op.or]: createClause
        }
      });
      
      if (overlapRsv.length) {
        return next(CustomError('BadRequest', 'Already reserved day.'))
      };
    }

    /* deadClose를 제출했을 경우 */
    if (deadClose.length) {
      /* 유효성 검사: date, time */
      closeValidator(deadClose);

      /* deadClose를 제거하는 데에 필요한 clause 생성 */
      destroyClause = deadClose.map((obj) => {
        obj["fkCounselorId"] = counselorId;
        return obj
      });
    }

    const transaction = await sequelize.transaction();
    try {
      if (createClause) {
        await Close.bulkCreate([
          ...createClause
        ], { transaction });
      }

      if (destroyClause) {
        await Close.destroy({
          where: { [Op.or]: [ ...destroyClause ] },
          transaction
        });
      }

      await transaction.commit();

      return res.status(200).json({ success: true });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  } catch (error) {
    next(error);
  }
}

module.exports = update