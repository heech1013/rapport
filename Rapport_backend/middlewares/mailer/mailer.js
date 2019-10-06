const CustomError = require('../errorHandler/customError');
const transporterFunc = require('./transporterFunc');
const mailOption = require('./mailOption');

const mailer = (type) => {
  return new Promise(( async(resolve, reject) => {
    try {
      const transporter = await transporterFunc();
      const option = await mailOption(type);

      transporter.sendMail(option, (error, __) => {
        if (error) {
          console.error(error);
          reject(CustomError('InternalServerError', 'Mailer error'));
        } else resolve();
      });
    } catch (error) {
      reject(error);
    }
  }))
}

module.exports = mailer;