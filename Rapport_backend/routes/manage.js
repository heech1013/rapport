const express = require('express');
const { check, validationResult } = require('express-validator/check');
const { sequelize, User, CounselorProfile, CounselorLocation, Case } = require('../models');
const router = express.Router();

/* PATCH '/manage/case/:id' : 상담케이스 confirmation 수정 */
router.patch('/case/:id', async (req, res, next) => {  // case의 id
  try{
    const { id } = req.params;
    await Case.update(
      { confirmation : true },
      { where: { id }}
    );
    return res.status(201).json({ caseConfirm: true });
  } catch (error) {
    next(error);
  }
});

/* GET '/manage/case' : 모든 상담케이스 조회 */
router.get('/case', async (req, res, next) => {  // GET '/manage/case?date=2018-12-14'
  try{
    const { date } = req.query;
    const caseList = await Case.findAll({
      attributes: ['id', 'date', 'time', 'confirmation'],
      where: { date },
      include: [
        {
          model: User,
          as: 'fkCounselor',
          attributes: ['id', 'userType', 'email', 'phoneNumber'],
          include: [
            {
              model: CounselorProfile,
              as: 'CounselorProfile',
              attributes: ['name']
            }
          ]
        },
        {
          model: User,
          as: 'fkClient',
          attributes: ['id','userType', 'nick', 'email', 'phoneNumber'],
        }
      ]
    });
    return res.status(200).json({ caseList });
  } catch (error) {
    next(error);
  }
});

/* PATCH '/manage/counselor/:id : 상담사 자격 및 지역 수정 */
router.patch('/counselor/:id', [
  check('qualification',
    'GS', 'YC', 'GR', 'YDP', 'DJ', 'GC', 'GA', 'SC', 'GN', 'SP', 'GD', 'MP', 'EP',
    'SDM', 'JN', 'YS', 'SB', 'GB', 'DB', 'NW', 'JNg', 'DDM', 'SD', 'GJ', 'JG'
  ).isBoolean()
], async (req, res, next) => {
  try{
    const { id } = req.params;  // User id
    const {
      qualification,
      GS, YC, GR, YDP, DJ, GC, GA, SC, GN, SP, GD, MP, EP,
      SDM, JN, YS, SB, GB, DB, NW, JNg, DDM, SD, GJ, JG
    } = req.body;
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
      return res.status(201).json({ updateSuccess: true });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  } catch (error) {
    next(error);
  }
});
  

/* GET '/manage/counselor' : 모든 상담사 회원 조회 */
router.get('/counselor', async (req, res, next) => {
  try{
    const counselorList = await User.findAll({
      attributes: ['id', 'qualification', 'email', 'phoneNumber'],
      where: { userType: 'counselor' },
      include: [
        {
          model: CounselorProfile,
          as: 'CounselorProfile',
          attributes: ['name']
        },
        {
          model: CounselorLocation,
          as: 'CounselorLocation'
        }
      ]
    });
    return res.status(200).json({ counselorList });
  } catch (error) {
    next(error);
  }
});


module.exports = router;