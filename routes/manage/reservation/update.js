const { Reservation } = require('../../../models');

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { address } = req.body;
      
    await Reservation.update({ address, confirmation: true }, { where: { id }});

    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = update;