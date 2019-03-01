const CustomError = require('../errorHandler/customError');
const transporterFunc = require('./transporter');
const mailOption = require('./mailOption');

const mailer = (email) => {
  return new Promise( async(resolve, reject) => {
    try {
      const transporter = await transporterFunc();
      const option = await mailOption(email);

      transporter.sendMail(option, (error, __) => {
        if (error) {
          console.error(error);
          reject(CustomError('InternalServerError', 'Mailer error.'))  // db에 계정은 생성된 상태. 고객센터로 문의 필요.
        } else {
          resolve();
        }
      }); 
    } catch (error) {
      reject(error);
    }
  })
}

module.exports = mailer;