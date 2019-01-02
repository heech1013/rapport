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
          as: 'CounselorLocation'
        }
      ]
    });
    return res.status(200).json({ success:true, counselorList });
  } catch (error) {
    next(error);
  }
};

module.exports = index;