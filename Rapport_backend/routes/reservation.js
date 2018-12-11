const express = require('express');
const { check, validationResult } = require('express-validator/check');
const format = require('date-fns/format');
const addDays = require('date-fns/add_days');

const { sequelize, Case, Application } = require('../models');

const router = express.Router();

/* POST '/reservation' : 상담 예약 */
router.post('/', [
  check('date', 'name', 'problem').isLength({ min: 1 }),
  check('time', 'sex', 'age').isNumeric()
], async (req, res, next) => {
  try{
    let {
      clientId, counselorId,
      date, time,
      name, sex, age, problem } = req.body;
    
    // post req.body 형식체크 결과
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
      return res.status(400).json({ validationError: true, body: validationError.array() });
    }
    // date 형식 체크(YYYY.MM.DD)
    //const dateRegExp = /([12]\d{3}\.\s(0[1-9]|1[0-2])\.\s(0[1-9]|[12]\d|3[01])\.)/;
    const dateRegExp = /([12]\d{3}\-(0[1-9]|1[0-2])\-(0[1-9]|[12]\d|3[01]))/;
    if (!dateRegExp.test(date)) {
      return res.status(400).json({ validationError: true, body: "date" });
    }

    let dateArray = [date];
    for(let x = 1; x <= 4; x++) {
      dateArray[x] = format( addDays(date, x * 7), 'YYYY-MM-DD' );
    }
    
    // Unmanaged transaction(sequelize) + await/async
    const transaction = await sequelize.transaction();
    try{
      await Case.update(
        { fkClientId: clientId },
        {
          where: {
            fkCounselorId: counselorId,
            fkClientId: null,
            date: dateArray,
            time
          }, 
          transaction
        });
      let casePrototype = await Case.findOne({
        where: {
          fkCounselorId: counselorId,
          fkClientId: clientId,
          date: dateArray[0],
          time
        },
        include: [
          {
            model: Application,
            as: 'CaseApplication'
          }
        ],
        transaction
      });
      await casePrototype.createCaseApplication({
        name, sex, age, problem
      }, { transaction });
      await transaction.commit();
      return res.status(201).json({ reservationSuccess: true });
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;