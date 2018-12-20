const CustomError = ( name, message = '' ) => {
  const CustomError = new Error();
  CustomError.name = name;
  CustomError.message = message;

  return CustomError;
};
// CustomError.prototype = Error.prototype;
// CustomError.prototype = new Error();

module.exports = CustomError;