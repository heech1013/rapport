const { User, CounselorProfile, Open } = require('../../../models');
const openListCleaner = require('../../../middlewares/etcFunc/openListCleaner');

const index = async (req, res, next) => {
  try {
    const uncleanedOpenList = await User.findAll({
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
          attributes: ['name']
        },
        {
          model: Open,
          as: 'Open',
          attributes: [
            'startDate', 'endDate',
            'MON9', 'MON10', 'MON11', 'MON12', 'MON13', 'MON14', 'MON15', 'MON16', 'MON17', 'MON18',
            'TUE9', 'TUE10', 'TUE11', 'TUE12', 'TUE13', 'TUE14', 'TUE15', 'TUE16', 'TUE17', 'TUE18',
            'WED9', 'WED10', 'WED11', 'WED12', 'WED13', 'WED14', 'WED15', 'WED16', 'WED17', 'WED18',
            'THU9', 'THU10', 'THU11', 'THU12', 'THU13', 'THU14', 'THU15', 'THU16', 'THU17', 'THU18',
            'FRI9', 'FRI10', 'FRI11', 'FRI12', 'FRI13', 'FRI14', 'FRI15', 'FRI16', 'FRI17', 'FRI18',
            'SAT9', 'SAT10', 'SAT11', 'SAT12', 'SAT13', 'SAT14', 'SAT15', 'SAT16', 'SAT17', 'SAT18',
            'SUN9', 'SUN10', 'SUN11', 'SUN12', 'SUN13', 'SUN14', 'SUN15', 'SUN16', 'SUN17', 'SUN18'
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