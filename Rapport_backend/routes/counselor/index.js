const { User, CounselorProfile, Certification } = require('../../models');

/* GET '/counselor' : 상담사 모두 보기(검색 필터) */
const index = async (req, res, next) => {
  try {
     const searchResult = await User.findAll({
       attributes: ['id'],
       where: {
         userType: 'counselor',
         qualification: true
       },
       include: [
        {
          model: CounselorProfile,
          as: 'CounselorProfile',
          attributes: ['name', 'price']
        },
        {
          model: Certification,
          as: 'Certification',
          attributes: ['KCounselingPA_1', 'KCounselingPA_2', 'KClinicalPA']
        }
       ]
     });
     return res.status(200).json({ success: true, searchResult });
  } catch (error) {
    next(error);
  }
};

module.exports = index;