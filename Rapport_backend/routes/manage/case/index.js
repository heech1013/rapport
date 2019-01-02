const { User, CounselorProfile, Case } = require('../../../models');

const index = async (req, res, next) => {
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

    return res.status(200).json({ success:true, caseList });
    
  } catch (error) {
    next(error);
  }
};

module.exports = index;