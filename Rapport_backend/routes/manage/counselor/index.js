const { User, CounselorProfile, CounselorLocation } = require('../../../models');

const index = async (req, res, next) => {
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
          as: 'CounselorLocation',
          attributes: [
            'GS', 'YC', 'GR', 'YDP', 'DJ', 'GC', 'GA', 'SC', 'GN', 'SP', 'GD', 'MP', 'EP',
            'SDM', 'JN', 'YS', 'SB', 'GB', 'DB', 'NW', 'JNg', 'DDM', 'SD', 'GJ', 'JG'
          ]
        }
      ]
    });
    return res.status(200).json({ success:true, counselorList });
  } catch (error) {
    next(error);
  }
};

module.exports = index;