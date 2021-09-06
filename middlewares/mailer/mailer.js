const CustomError = require('../errorHandler/customError');
const transporterFunc = require('./transporterFunc');
const mailOption = require('./mailOption');

const mailer = (type) => {
  const transporter = transporterFunc();
  const option = mailOption(type);

  transporter.sendMail(option, (error, _) => {
    if (error) {
      throw CustomError('InternalServerError', 'Mailer error');
    }
  });
}

module.exports = mailer;