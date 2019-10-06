require('dotenv').config();

const CustomError = require('../errorHandler/customError');

const mailOption = (type) => {
  return new Promise( async(resolve, reject) => {
    try {
      const mailOption = {
        from: "'라포 알림 서버' rapport5959@gmail.com",
        to: 'rapport5959@naver.com',
        subject: null,
        html: '<p>라포 알림 서버에서 발송된 메일입니다.<p>'
      }
      if (type === 'counselorJoin') mailOption.subject = '[라포 알림 서버] 새로운 상담사가 회원가입을 하였습니다.'
      else if (type === 'reservation') mailOption.subject = '[라포 알림 서버] 새로운 예약 신청이 접수되었습니다.'
      else reject(new CustomError('InternalServerError', 'Unintentional email notification type'));

      resolve(mailOption);
    } catch (error) {
      reject(error);
    }
  })
}

module.exports = mailOption;