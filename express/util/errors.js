module.exports.error500next = (error, next) => {
  const throwingError = new Error(err);
  throwingError.httpStatus = 500;
  return next(throwingError);
}