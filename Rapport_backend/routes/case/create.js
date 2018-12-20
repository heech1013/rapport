const { sequelize, Case, CounselorProfile } = require('../../models');

const create = async (req, res, next) => {  // POST '/case?counselorId=3'
  try{
    const { counselorId } = req.query;
    const counselorProfile = await CounselorProfile.findOne({
      attributes: ['price', 'address'],
      where: { fkCounselorId: counselorId }
    });

    // Unmanaged transaction(sequelize)
    return sequelize.transaction().then(function (t) {
      // make sure you return all query.
      // method마다 transaction:t 옵션을 줘야 하는 argument 위치가 다름.
      return Case.bulkCreate([
        // price를 임의의 값으로 줘야 함. 아무 값이나~
        { date: '2018-12-11', time: 1, fkCounselorId: 9, price: 1, address: 'foo' },
        { date: '2018-12-18', time: 1, fkCounselorId: 9, price: 1, address: 'foo' },
        { date: '2018-12-25', time: 1, fkCounselorId: 9, price: 1, address: 'foo' },
      ], {transaction: t})
        .then(function() {
          return Case.update(
            { 
              price: counselorProfile.price,
              address: counselorProfile.address
            },
            {
              where: { fkCounselorId: 9 },
              transaction: t
            }
          )
        })
        .then(function () {
          t.commit();
          return res.status(201).json({ caseOpenSuccess: true });
        })
        .catch(function (error) {
          t.rollback();
          return next(error);
        });
    })
  } catch (error) {
    next(error);
  }
};

module.exports = create;