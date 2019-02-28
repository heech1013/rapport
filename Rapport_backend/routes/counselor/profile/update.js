const validationResult = require('../../../middlewares/validator/validationResult');
const phoneNumberValidator = require('../../../middlewares/validator/phoneNumberValidator');

const { sequelize, User, CounselorProfile, CounselorField } = require('../../../models');

const update = async (req, res, next) => {
  try {
    const { id } = req.params;  // :id를 현우가 보내야 함. url 상에서 수정할 수 없게. id가 7인 사용자가 id가 9인 사용자의 프로필 수정 요청을 보낼 수 없게.
    const {
      phoneNumber,  // User
      name, address, price, career, simpleIntroduction, detailIntroduction,  // CounselorProfile
      family, relationship, personality, emotion, sexual, addiction, lifestyle, development, study  // CounselorField
    } = req.body;

    await validationResult(req);
    await phoneNumberValidator(phoneNumber);

    const transaction = await sequelize.transaction();
    try {

      await User.update(
        { phoneNumber },
        {
          where: { id, userType: 'counselor' },
          transaction
        }
      );

      await CounselorProfile.update(
        { name, address, price, career, simpleIntroduction, detailIntroduction },
        {
          where: { fkCounselorId: id },
          transaction
        }
      );

      await CounselorField.update(
        { family, relationship, personality, emotion, sexual, addiction, lifestyle, development, study },
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