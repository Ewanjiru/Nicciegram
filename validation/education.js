const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = validateInput = (data) => {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.field = !isEmpty(data.field) ? data.field : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if (validator.isEmpty(data.school)) {
    errors.school = 'School name is required';
  }
  if (validator.isEmpty(data.degree)) {
    errors.degree = 'Degree title is required';
  }
  if (validator.isEmpty(data.field)) {
    errors.field = 'Field of Study is Required.';
  }
  if (validator.isEmpty(data.from)) {
    errors.from = 'Study start date is Required.';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}