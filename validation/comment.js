const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = validateInput = (data) => {
  let errors = {};

  data.description = !isEmpty(data.description) ? data.description : '';

  if (validator.isEmpty(data.description)) {
    errors.description = 'description should not be empty';
  }
  if (!validator.isLength(data.description, { min: 2, max: 300 })) {
    errors.description = 'description should be between 20 to 300 characters';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}