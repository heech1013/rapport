const validationResult = require('../../middlewares/validator/validationResult');
const dateValidator = require('../../middlewares/validator/dateValidator');
const fiveSessionArray = require('../../middlewares/dateMaker/fiveSessionArray');

const { sequelize, Case, Application } = require('../../models');

const create = async (req, res, next) => {
  try{
    const {
      clientId, counselorId,  // reservation info
      date, time,  // Case
      name, sex, age, problem  // Application
    } = req.body;
    
    await validationResult(req);
    await dateValidator(date);
    
    const dateArray = fiveSessionArray(date);

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

      const casePrototype = await Case.findOne({
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

      return res.status(201).json({ success:true });

    } catch (error) {

      await transaction.rollback();

      next(error);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = create;