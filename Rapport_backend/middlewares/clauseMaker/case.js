const CustomError = require('../errorHandler/customError');

const caseClauseMaker = (date) => {
  return new Promise((resolve, reject) => {
    const caseClause = { fkClientId : null };
    if (date.length) {
      caseClause.date = date;
    } else {
      reject(
        CustomError('BadRequest', 'Date filter is null.')
      )
    }
    resolve(caseClause);
  });
}

module.exports = caseClauseMaker;