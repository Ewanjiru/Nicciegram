const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = validateInput = (data) => {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (validator.isEmpty(data.email)) {
    errors.email = 'Email should not be empty';
  }
  if (!validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }
  if (validator.isEmpty(data.password)) {
    errors.password = 'Password should not be empty';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}