const CustomError = require('../errorHandler/customError');
const transporter = require('./transporter');
const mailOption = require('./mailOption');

const mailer = (email) => {
  return new Promise((resolve, reject) => {
    const option = mailOption(email);

    transporter.sendMail(option, (error, __) => {
      if (error) {
        console.error(error);
        reject(CustomError('InternalServerError', 'Mailer error.'))  // db에 계정은 생성된 상태. 고객센터로 문의 필요.
      } else {
        resolve();
      }
    });
  })
}

module.exports = mailer;