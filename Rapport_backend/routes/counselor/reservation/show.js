const { Reservation, Application } = require('../../../models');
const CustomError = require('../../../middlewares/errorHandler/customError');

const show = async (req, res, next) => {
  try {
    const { id } = req.params;  // Reservation의 id
    
    const rsvDetail = await Reservation.findOne({
      attributes: ['date', 'time', 'session', 'price', 'address'],
      where: { id },
      include: [
        {
          model: Application,
          as: 'Application',
          attributes: ['name', 'sex', 'age', 'problem']
        }
      ]
    });

    if (!rsvDetail.date) {
      return next(
        CustomError('BadRequest', 'Reservation do not exist.')
      )
    }

    return res.status(200).json({ success:true, rsvDetail });
  } catch (error) {
    next(error);
  }
};

module.exports = show;