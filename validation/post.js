const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = validateInput = (data) => {
  console.log('data', data)
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.description = !isEmpty(data.description) ? data.description : '';

  if (validator.isEmpty(data.title)) {
    errors.title = 'Title should not be empty';
  }
  if (validator.isEmpty(data.description)) {
    errors.description = 'Description should not be empty';
  }
  if (!validator.isLength(data.description, { min: 20, max: 300 })) {
    errors.description = 'Description should be between 20 to 300 characters';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}