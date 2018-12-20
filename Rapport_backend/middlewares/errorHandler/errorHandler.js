const errorJSON = require('./error.json');

const errorHandler = (err, req, res, next) => {
  console.error(err);

  const customError = errorJSON[err.name] || errorJSON.UnhandledError;
  const name = err.name === 'Error' || err.name === undefined ? 'UnhandeledError' : err.name;
  const message = err.message === '' ? customError.message : err.message;
  const { code } = customError;
  
  res.status(code).json({
    name,
    message
  });
};

module.exports = errorHandler;