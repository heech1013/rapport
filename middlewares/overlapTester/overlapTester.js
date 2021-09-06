const CustomError = require('../errorHandler/customError');

const { User } = require('../../models');

const overlapTester = async (type, val) => {
  try {
    const whereClause = {
      ...((type === 'email') ? { email: val } : {}),
      ...((type === 'nick') ? { nick: val } : {}),
    };

    const user = User.findAll({ where: { ...whereClause } })
    if (user) {
      throw CustomError('OverlapError',  `${type} overlapped.`);
    }
  } catch (e) {
    next(e)
  }
}

module.exports = overlapTester;