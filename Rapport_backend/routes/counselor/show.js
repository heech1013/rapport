const { User, CounselorProfile, CounselorField, CounselorLocation, Case } = require('../../models')

const show = async (req, res, next) => {
  try{
    const { id } = req.params;
    
    const counselorDetail = await User.findOne({
      attributes: ['id'],
      where: { id, userType: 'counselor' },
      include: [
        {
          model: CounselorProfile,
          as: 'CounselorProfile',
          attributes: ['name', 'address', 'price', 'career', 'simpleIntroduction', 'detailIntroduction']
        },
        {
          model: CounselorField,
          as: 'CounselorField',
          attributes: [
            'family', 'relationship', 'personality', 'emotion', 'sexual', 'addiction', 'lifestyle', 'development', 'study'
          ]
        },
        {
          model: CounselorLocation,
          as: 'CounselorLocation',
          attributes: [
            'GS', 'YC', 'GR', 'YDP', 'DJ', 'GC', 'GA', 'SC', 'GN', 'SP', 'GD', 'MP',
            'EP', 'SDM', 'JN', 'YS', 'SB', 'GB', 'DB', 'NW', 'JNg', 'DDM', 'SD', 'GJ'
          ]
        },
        {
          model: Case,
          as: 'OpenCases',
          attributes: ['date', 'time'],
          where: { fkClientId: null }
        }
      ]
    });

    return res.status(200).json({ success: true, counselorDetail });

  } catch (error) {
    next(error);
  }
}


module.exports = show;