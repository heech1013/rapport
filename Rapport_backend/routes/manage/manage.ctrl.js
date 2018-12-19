const { validationResult } = require('express-validator/check');
const { sequelize, User, CounselorProfile, CounselorLocation, Case } = require('../../models');

const caseUpdate = async (req, res, next) => {
  try{
    const { id } = req.params;  // case의 id
    await Case.update(
      { confirmation : true },
      { where: { id }}
    );
    return res.status(201).json({ caseConfirm: true });
  } catch (error) {
    next(error);
  }
};


const caseIndex = async (req, res, next) => {
  try{
    const { date } = req.query;  // GET '/manage/case?date=2018-12-14'
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
};

const counselorUpdate = async (req, res, next) => {
  try{
    const { id } = req.params;  // User id
    const {
      qualification,
      GS, YC, GR, YDP, DJ, GC, GA, SC, GN, SP, GD, MP, EP,
      SDM, JN, YS, SB, GB, DB, NW, JNg, DDM, SD, GJ, JG
    } = req.body;

    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      return res.status(400).json({ validationError: true, body: validationError.array() });
    }
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
};

const counselorIndex = async (req, res, next) => {
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
};

module.exports = { caseIndex, caseUpdate, counselorIndex, counselorUpdate };