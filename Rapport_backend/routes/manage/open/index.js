const { User, CounselorProfile, Open } = require('../../../models');
const openListCleaner = require('../../../middlewares/etcFunc/openListCleaner');
const createDayTimeArr = require('../../../middlewares/etcFunc/createDayTimeArr');

const index = async (req, res, next) => {
  try {
    const dayTimeArr = createDayTimeArr()
    
    const uncleanedOpenList = await User.findAll({
      attributes: ['id'],
      where: {
        userType: 'counselor',
        qualification: true
      },
      include: [
        {
          model: CounselorProfile,
          as: 'CounselorProfile',
          attributes: ['name']
        },
        {
          model: Open,
          as: 'Open',
          attributes: [
            'startDate', 'endDate',
            ...dayTimeArr,
          ]
        }
      ]
    });

    const openList = await openListCleaner(uncleanedOpenList);    
    return res.status(200).json({ success: true, openList });
  } catch (error) {
    next(error);
  }
};

module.exports = index;