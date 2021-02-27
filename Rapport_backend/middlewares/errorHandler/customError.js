const CustomError = ( name, message = '' ) => {
  const CustomError = new Error();
  CustomError.name = name;
  CustomError.message = message;

  return CustomError;
};

module.exports = CustomError;