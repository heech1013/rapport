const customError = require('../errorHandler/customError');

const nickValidator = (nick) => {
  return new Promise((resolve, reject) => {
    const nickRegExp = /^[\w가-힣]{2,12}$/;  // 영대소문자/한글/숫자 2~12자리
    if (!nickRegExp.test(nick)) {
      reject(
        customError('ValidationError', 'Nick is not valid.')
      )
    } else resolve();
  })  
}

module.exports = nickValidator;