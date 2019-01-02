const { sequelize, Case, CounselorProfile } = require('../../models');

const create = async (req, res, next) => {  // POST '/case?counselorId=3'
  try{
    const { counselorId, caseInfo } = req.query;
    const counselorProfile = await CounselorProfile.findOne({
      attributes: ['price', 'address'],
      where: { fkCounselorId: counselorId }
    });
    console.log(caseInfo);
    caseInfo.split(',');
    

    // Unmanaged transaction(sequelize) in async await
    const transaction = await sequelize.transaction();
    try{
      console.log(caseInfo);
      // [
      //   // price를 임의의 값으로 줘야 함. 아무 값이나~
      //   { date: '2018-12-27', time: 2, fkCounselorId: 40, price: 1, address: 'foo' },
      //   { date: '2018-12-28', time: 2, fkCounselorId: 40, price: 1, address: 'foo' },
      //   { date: '2018-12-29', time: 2, fkCounselorId: 40, price: 1, address: 'foo' },
      // ]
      await Case.bulkCreate(caseInfo, { transaction });

      await Case.update(
        { 
          price: counselorProfile.price,
          address: counselorProfile.address
        },
        {
          where: { fkCounselorId: counselorId },
          transaction
        }
      )

      await transaction.commit();
      return res.status(201).json({ success: true });

    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = create;