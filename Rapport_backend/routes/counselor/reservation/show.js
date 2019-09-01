const { User, Reservation, Application } = require('../../../models');
const viewAuthorityVerifier = require('../../../middlewares/viewAuthority/id');
const decryptApplication = require('../../../middlewares/etcFunc/decryptApplication');
const CustomError = require('../../../middlewares/errorHandler/customError');

const show = async (req, res, next) => {
  try {
    const { id } = req.params;  // Reservation의 id
    const { counselorId } = req.query;
    
    let rsvDetail = await Reservation.findOne({
      attributes: ['date', 'time', 'session', 'serviceType', 'address', 'rentalLocation', 'price'],
      where: { id },
      include: [
        { model: User, as: 'fkCounselor', attributes: ['id']},
        { model: Application, as: 'Application', attributes: ['name', 'sex', 'age', 'problem']}
      ]
    });

    if (!rsvDetail) {
      return next(
        CustomError('BadRequest', 'Reservation do not exist.')
      )
    } else {
      const resultId = rsvDetail["fkCounselor"]["id"];
      await viewAuthorityVerifier(counselorId, resultId);
      if (rsvDetail.Application) {
        rsvDetail = await decryptApplication(rsvDetail);
      }
    }

    return res.status(200).json({ success:true, rsvDetail });
  } catch (error) {
    next(error);
  }
};

module.exports = show;