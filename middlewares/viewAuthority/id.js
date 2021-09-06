const CustomError = require('../errorHandler/customError');

const viewAuthorityVerifier = (viewerId, resultId) => {
    if (viewerId != resultId) {
      throw CustomError('Unauthorized', 'Unauthorized view access.');
    }
}

module.exports = viewAuthorityVerifier;