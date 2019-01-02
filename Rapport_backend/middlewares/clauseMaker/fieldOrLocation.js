const { Sequelize } = require('../../models');
const Op = Sequelize.Op;

const fieldOrLocationClauseMaker = (val) => {
  return new Promise((resolve, reject) => {
    let clause = {};
    if (val.length) {
      const reformattedArray = val.map((x) => {
        const rx = {};
        rx[x] = true;
        return rx;
      });
      clause = { [Op.or] : reformattedArray};
    }
    resolve(clause);
  })
}

module.exports = fieldOrLocationClauseMaker;
// 예시 fieldClause = {  [Op.or] : [ {family:true}, {relationship:true} ]  }