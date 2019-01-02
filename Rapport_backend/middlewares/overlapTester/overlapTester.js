const CustomError = require('../errorHandler/customError');

const { User } = require('../../models');

const overlapTester = (type, val) => {
  return new Promise((resolve, reject) => {
    let whereClause;
    if (type === 'email') whereClause = { email : val };
    else if (type === 'nick') whereClause = { nick : val };
    else {
      reject(CustomError('InternalServerError'));
    }
    User.findAll({ where: { ...whereClause } })
      .then((user) => {
        if (user.length) {
          reject(CustomError('OverlapError',  `${type} overlapped.`));
        } else resolve();
      });
  })
}

module.exports = overlapTester;