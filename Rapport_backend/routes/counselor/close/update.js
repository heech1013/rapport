const { Sequelize, sequelize, Close } = require('../../../models');

const { Op } = Sequelize;

const update = async (req, res, next) => {
  try {    
    const { counselorId, newClose, deadClose } = req.body;

    // 유효성 검사

    let createClause, destroyClause = null;
    if (newClose.length) {
      // newClose와 deadClose 배열요소(객체) 각각의 마지막 key/value 값으로 fkCounselorId를 추가
      createClause = newClose.map((obj) => {
        obj["fkCounselorId"] = counselorId;
        return obj
      });
    } else {
      createClause = null;
    }
    if (deadClose.length) {
      destroyClause = deadClose.map((obj) => {
        obj["fkCounselorId"] = counselorId;
        return obj
      });
    } else {
      destroyClause = null;
    }

    const transaction = await sequelize.transaction();
    try {
      if (createClause) {
        await Close.bulkCreate([
          ...createClause
        ], { transaction });
      }

      if (destroyClause) {
        await Close.destroy({
          where: { [Op.or]: [ ...destroyClause ] },
          transaction
        });
      }

      await transaction.commit();

      return res.status(200).json({ success: true });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  } catch (error) {
    next(error);
  }
}

module.exports = update

    /*
      - 새로 추가하는 휴무일 -> newClose
      - 기존 휴무일을 취소 -> deadClose
      - ***주의*** destroy의 조건으로 where: {}을 주면 모든 데이터가 삭제됨.
      - newClose나 deadClose가 없어도 빈 배열의 형태로 주어야 함.
    */
    /*
      {
        "counselorId": "45",
        "newClose": [
          { "date": "2019-01-29", "time": "9" },
          { "date": "2019-01-30", "time": "10" }
        ],
        "deadClose": [
          { "date": "2019-01-29", "time": "9" },
          { "date": "2019-01-30", "time": "10" }
        ]
      }
    */

    /*
      await Close.bulkCreate([
        { "date": "2019-01-29", "time": "9", "fkCounselorId": "45" },
        { "date": "2019-01-30", "time": "10", "fkCounselorId": "45" }
      ]);
      
      await Close.destroy({
        where: {
          [Op.or]: [
            { "date": "2019-01-30", "time": "8", "fkCounselorId": "45" },
            { "date": "2019-01-30", "time": "9", "fkCounselorId": "45" }
          ]
        }
      });
    */