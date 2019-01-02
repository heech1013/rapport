const CustomError = require('../../middlewares/errorHandler/customError');
const { Case } = require('../../models');

const destroy = async (req, res, next) => {
  try{
    // 케이스가 예약되지 않은 상태인지 확인하는 것: 현우가 1차로, 내가 2차로
    const { id } = req.params;  // case의 id
    const CasePrototype = await Case.findOne({
      where: { id }
    });

    if (!CasePrototype) {
      return next(CustomError('BadRequest', 'Case do not exist.'));
    } else if (CasePrototype.fkClientId) {
      return next(CustomError('BadRequest', 'Case is already reserved.'));
    } else {
      await CasePrototype.destroy();
      return res.status(204).json({ success: true });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = destroy;