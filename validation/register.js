const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = validateInput = (data) => {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';


  if (!validator.isLength(data.name, { min: 2, max: 50 })) {
    errors.name = 'Name should be bewteen 2 and 50 characters';
  }
  if (validator.isEmpty(data.name)) {
    errors.name = 'Name should not be empty';
  }
  if (validator.isEmpty(data.email)) {
    errors.email = 'Email should not be empty';
  }
  if (!validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }
  if (validator.isEmpty(data.password)) {
    errors.password = 'Password should not be empty';
  }
  if (!validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password should be between 6 and 30 characters';
  }
  if (validator.isEmpty(data.password2)) {
    errors.password2 = 'password2 should not be empty';
  }
  if (!validator.equals(data.password, data.password2)) {
    errors.password2 = 'passwords do not match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}