const express = require('express');
const { check, validationResult } = require('express-validator/check');
const { sequelize, User, CounselorProfile, CounselorField, CounselorLocation } = require('../models');

const router = express.Router();

router.get('/:id', async (req, res, next) => {
  try{
    const { id } = req.params;
    const profile = await User.findOne({
      attributes: ['id', 'email', 'phoneNumber', 'emailAuthentication', 'qualification'],
      where: { userType: 'counselor', id },
      include: [
        {
          model: CounselorProfile,
          as: 'CounselorProfile',
          attributes: ['name', 'address', 'price', 'career', 'simpleIntoduction', 'detailIntroduction' ]
        },
        {
          model: CounselorField,
          as: 'CounselorField',
          attributes: ['family', 'relationship', 'personality', 'emotion', 'sexual', 'addiction', 'lifestyle', 'development', 'study']
        },
        {
          model: CounselorLocation,
          as: 'CounselorLocation',
          attributes: ['GS', 'YC', 'GR', 'YDP', 'DJ', 'GC', 'GA', 'SC', 'GN', 'SP', 'GD', 'MP', 'EP', 'SDM', 'JN', 'YS', 'SB', 'GB', 'DB', 'NW', 'JNg', 'DDM', 'SD', 'GJ', 'JG']
        }  // 상담 가능 지역을 수정하기 위해서는 고객 센터로 연락주세요.
      ]
    });
    return res.status(200).json({ profile });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', [
  check('price').isNumeric(),
  check('family', 'relationship', 'personality', 'emotion', 'sexual', 'addiction', 'lifestyle', 'development', 'study').isBoolean()
], async (req, res, next) => {
  try{
    let { id } = req.params;
    let {
      phoneNumber,  // User
      name, address, price, career, simpleIntroduction, detailIntroduction,  // CounselorProfile
      family, relationship, personality, emotion, sexual, addiction, lifestyle, development, study  // CounselorField
    } = req.body;

    // express-validator 형식 체크 결과
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      return res.status(400).json({ validationError: true, body: validationError.array() });
    }
    // 핸드폰 번호 형식 체크: - 포함
    const phoneNumberRegExp = /^\d{3}-\d{3,4}-\d{4}$/;
    if (!phoneNumberRegExp.test(phoneNumber)) {
      return res.status(400).json({ validationError: true, body: "phoneNumber"});
    }

    const transaction = await sequelize.transaction();
    try{
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
      return res.status(201).json({ updateSuccess: true });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;