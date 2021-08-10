const { Sequelize } = require('../models')
const { Op } = Sequelize

const createFieldOrLocationClause = (fieldOrLocationArr) => {
  const condArr = fieldOrLocationArr.map(fieldOrLocation => ({ [fieldOrLocation]: true }))
  const clause = {
    [Op.or]: condArr,
  }

  return clause
}

module.exports = createFieldOrLocationClause