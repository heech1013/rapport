const { User, Case, Application } = require('../../models');

const show = async (req, res, next) => {
  try{
    const { id } = req.params;  // case의 id

    const caseDetail = await Case.findOne({
      attributes: [ 'date', 'time', 'confirmation', 'price', 'address' ],
      where: { id },
      include: [
        {
          model: User,
          as: 'fkClient',
          attributes: [ 'nick' ]
        },
        {
          model: Application,
          as: 'CaseApplication',
          attributes: ['name', 'sex', 'age', 'problem']
        }
      ]
    });

    return res.status(200).json({ success: true, caseDetail });
  } catch (error) {
    next(error);
  }
};

module.exports = show;