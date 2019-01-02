const { Case } = require('../../../models');

const update = async (req, res, next) => {
  try{
    const { id } = req.params;  // case의 id

    await Case.update(
      { confirmation : true },
      { where: { id }}
    );

    return res.status(201).json({ success:true });
  } catch (error) {
    next(error);
  }
};

module.exports = update;