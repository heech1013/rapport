const { User, CounselorProfile, CounselorField, CounselorLocation } = require('../../../models');
const validationResult = require('../../../middlewares/validator/validationResult');

const show = async (req, res, next) => {
  try {
    const { id } = req.params;

    await validationResult(req);

    const profile = await User.findOne({
      attributes: ['id', 'email', 'phoneNumber', 'qualification'],
      where: { userType: 'counselor', id },
      include: [
        {
          model: CounselorProfile,
          as: 'CounselorProfile',
          attributes: ['name', 'address', 'price', 'career', 'simpleIntroduction', 'detailIntroduction' ]
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

    return res.status(200).json({ success: true, profile });
    
  } catch (error) {
    next(error);
  }
};

module.exports = show;