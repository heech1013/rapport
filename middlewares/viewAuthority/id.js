const CustomError = require('../errorHandler/customError');

const viewAuthorityVerifier = (viewerId, resultId) => {
  return new Promise((resolve, reject) => {
    if (viewerId != resultId) {
      reject( CustomError('Unauthorized', 'Unauthorized view access.'))
    } else resolve();
  })
}

module.exports = viewAuthorityVerifier;