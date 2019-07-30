const CustomError = require('../../../middlewares/errorHandler/customError');
const { Reservation } = require('../../../models');

const update = async (req, res, next) => {
  try {
    const { id } = req.params;  // reservation의 id
      
    await Reservation.update({ confirmation: true }, { where: { id }});

    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = update;