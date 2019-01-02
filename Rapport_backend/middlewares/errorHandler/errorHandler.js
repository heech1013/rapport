const errorJSON = require('./error.json');

const errorHandler = (err, req, res, next) => {
  console.error(err);

  const CustomError = errorJSON[err.name] || errorJSON.InternalServerError;
  if (err.message) {
    CustomError.message = err.message;
  }
  const { code, name, message } = CustomError;
  
  res.status(code).json({
    success: false,
    name,
    message
  });
};

module.exports = errorHandler;