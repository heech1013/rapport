const customError = require('../errorHandler/customError');

const nickValidator = (nick) => {
  return (req, res, next) => {
    const nickRegExp = /^[\w가-힣]{2,12}$/;  // 영대소문자/한글/숫자 2~12자리
    if (!nickRegExp.test(nick)) {
      return next(
        customError('ValidationError', 'Nick validation error.')
      );
    }
  }
}

module.exports = nickValidator;