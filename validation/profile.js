const validator = require('validator');
const isEmpty = require('./isEmpty');

module.exports = validateInput = (data) => {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';
  data.bio = !isEmpty(data.bio) ? data.bio : '';

  if (!validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = 'Handle should be between 2 to 40 characters';
  }
  if (validator.isEmpty(data.handle)) {
    errors.handle = 'Handle is required';
  }
  if (validator.isEmpty(data.status)) {
    errors.status = 'Status is required';
  }
  if (validator.isEmpty(data.skills)) {
    errors.skills = 'Skills Required.';
  }
  if (!validator.isLength(data.bio, { min: 20, max: 300 })) {
    errors.bio = 'Bio should be between 20 to 300 characters';
  }
  if (validator.isEmpty(data.bio)) {
    errors.bio = 'Bio is required';
  }
  if (!isEmpty(data.website)) {
    if (!validator.isURL(data.website)) {
      errors.website = 'Invalid website URL'
    }
  }
  if (!isEmpty(data.youtube)) {
    if (!validator.isURL(data.youtube)) {
      errors.youtube = 'Invalid youtube URL'
    }
  }
  if (!isEmpty(data.facebook)) {
    if (!validator.isURL(data.facebook)) {
      errors.facebook = 'Invalid facebook URL'
    }
  }
  if (!isEmpty(data.instagram)) {
    if (!validator.isURL(data.instagram)) {
      errors.instagram = 'Invalid instagram URL'
    }
  }
  if (!isEmpty(data.twitter)) {
    if (!validator.isURL(data.twitter)) {
      errors.twitter = 'Invalid twitter URL'
    }
  }
  if (!isEmpty(data.linkedin)) {
    if (!validator.isURL(data.linkedin)) {
      errors.linkedin = 'Invalid linkedin URL'
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}