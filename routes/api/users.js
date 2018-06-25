const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../../models/User');
const validateRegisterData = require('../../validation/register');
const validateLoginData = require('../../validation/login');

const key = process.env.SECRET_KEY;

router.get('/', (req, res) => {
  User
    .find()
    .then(users => res.json(users))
});

router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterData(req.body);
  if (!isValid) {
    res.status(400).send(errors)
  }
  User
    .findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        errors.email = 'Email Already exists';
        return res.status(400).json(errors)
      } else {
        const { name, email, password } = req.body;
        const avatar = gravatar.url(email, { s: 200, r: 'pg', d: 'mm' })
        const newUser = new User({
          name,
          email,
          avatar,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          })
        })
      }
    })
});

router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginData(req.body);
  if (!isValid) {
    res.status(400).send(errors)
  }
  const { email, password } = req.body;
  User
    .findOne({ email })
    .then(user => {
      if (!user) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
      }
      bcrypt
        .compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            jwt.sign({ id: user._id, name: user.name, avatar: user.avatar }, key, { expiresIn: 3600 }, (err, token) => {
              res.json({
                success: 'Login Successful.',
                token: `Bearer ${token}`
              })
            });
          } else {
            errors.password = 'Password Incorrect';
            return res.status(400).json(errors)
          }
        })
    })
});

router.get('/current', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.send({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar
    })
  });


module.exports = router;
