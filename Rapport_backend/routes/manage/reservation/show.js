const { User, Case, CounselorProfile } = require('../../../models');

const show = async (req, res, next) => {
  try{
    const { id } = req.params;  // case의 id
    const reservationDetail = await Case.findOne({
      attributes: ['id','date', 'time', 'confirmation', 'price', 'address'],
      where: { id },
      include: [
        {
          model: User,
          as: 'fkCounselor',
          attributes: ['id'],
          include: [
            {
              model: CounselorProfile,
              as: 'CounselorProfile',
              attributes: ['name']
            }
          ]
        }
      ]
    });
    return res.status(200).json({ success:true, reservationDetail });
  } catch (error) {
    next(error);
  }
};

module.exports = show;