const { User, CounselorProfile } = require('../models');

/* GET '/counselor' : 상담사 모두 보기(검색 필터) */
const index = async (req, res, next) => {
  try {
     const searchResult = await User.findAll({
       attributes: ['id'],
       where: {
         userType: 'counselor',
         emailAuthentication: true,
         qualification: true
       },
       include: [
         {
           model: CounselorProfile,
           as: 'CounselorProfile',
           attributes: ['name', 'address', 'price', 'simpleIntroduction']
         }
       ]
     });
     return res.status(200).json({ success: true, searchResult });
  } catch (error) {
    next(error);
  }
};

module.exports = index;