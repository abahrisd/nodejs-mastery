module.exports.error500next = (error, next) => {
  console.log('error500next',error)
  const throwingError = new Error(error);
  throwingError.httpStatus = 500;
  return next(throwingError);
}