const validationResult = require('../../../middlewares/validator/validationResult');

const { sequelize, User, CounselorLocation } = require('../../../models');

const update = async (req, res, next) => {
  try{
    const { id } = req.params;
    const {
      qualification,
      GS, YC, GR, YDP, DJ, GC, GA, SC, GN, SP, GD, MP, EP,
      SDM, JN, YS, SB, GB, DB, NW, JNg, DDM, SD, GJ, JG
    } = req.body;

    await validationResult(req);

    const transaction = await sequelize.transaction();
    try {
      await User.update(
        { qualification },
        {
          where: { id },
          transaction
        }
      );
      await CounselorLocation.update(
        { GS, YC, GR, YDP, DJ, GC, GA, SC, GN, SP, GD, MP, EP,
          SDM, JN, YS, SB, GB, DB, NW, JNg, DDM, SD, GJ, JG },
        {
          where: { fkCounselorId: id },
          transaction
        }
      );
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

module.exports = update;