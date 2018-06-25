const express = require('express');
const router = express.Router();
const passport = require('passport');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const validateProfileData = require('../../validation/profile');
const validateExperienceData = require('../../validation/experience');
const validateEducationData = require('../../validation/education');

router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  Profile
    .findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.profile = 'No profile found';
        return res.status(400).json(errors)
      }
      res.json(profile)
    })
    .catch(err => res.status(404).json(err))
});

router.get('/all', (req, res) => {
  const errors = {};
  Profile
    .find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.profile = 'Profile for that handle does not exist';
        return res.status(404).json()
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: 'No profiles found' }))

})

router.get('/handle/:handleId', (req, res) => {
  const errors = {};
  Profile
    .findOne({ handle: req.params.handleId })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.profile = 'Profile for that handle does not exist'
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err))
});

router.get('/user/:userId', (req, res) => {
  const errors = {};
  Profile
    .findOne({ user: req.params.userId })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.profile = 'Profile for that user does not exist'
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json({ profile: 'Profile for that user does not exist' }))
});

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateProfileData(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const profileData = {};
  const {
    handle, company, website, location, status, skills,
    bio, gitusername, experience, education, youtube,
    facebook, instagram, linkedin, twitter
  } = req.body;

  profileData.user = req.user.id;
  if (handle) profileData.handle = handle;
  if (company) profileData.company = company;
  if (website) profileData.website = website;
  if (location) profileData.location = location;
  if (status) profileData.status = status;
  if (bio) profileData.bio = bio;
  if (gitusername) profileData.gitusername = gitusername;
  if (typeof skills !== undefined) profileData.skills = skills.split(',');

  profileData.social = {};
  if (youtube) profileData.social.youtube = youtube;
  if (facebook) profileData.social.facebook = facebook;
  if (instagram) profileData.social.instagram = instagram;
  if (linkedin) profileData.social.linkedin = linkedin;
  if (twitter) profileData.social.twitter = twitter;

  Profile
    .findOne({ user: profileData.user })
    .then(profile => {
      if (profile) {
        Profile
          .findOneAndUpdate(
            { user: profileData.user },
            { $set: profileData },
            { new: true }
          )
          .then(profile => res.json(profile))
      } else {
        Profile
          .findOne({ handle: profileData.handle })
          .then(profile => {
            if (profile) {
              errors.handle = 'Sorry. That handle already exists';
              res.status(400).json(errors);
            }
            new Profile(profileData)
              .save()
              .then(profile => res.json(profile));
          });
      }

    });
});

router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateExperienceData(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  Profile
    .findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        errors.profile = 'That user has no profile yet';
        res.status(404).json(errors);
      }
      const experience = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }
      profile.experience.unshift(experience);
      profile
        .save()
        .then(prof => res.send(prof))
        .catch(err => res.status(400).json(err))

    })
    .catch(err => res.status(400).json(err))
});

router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateEducationData(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Profile
    .findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        errors.profile = 'That user has no profile yet';
        res.status(404).json(errors);
      }
      const education = {
        school: req.body.school,
        degree: req.body.degree,
        field: req.body.field,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }
      profile.education.unshift(education);
      profile
        .save()
        .then(prof => res.send(prof))
        .catch(err => res.status(400).json(err))
    })
});

router.delete('/experience/:expId', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile
    .findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        errors.profile = 'That user has no profile yet';
        res.status(404).json(errors);
      }

      const experienceIndex = profile.experience.map(experience => experience.id).indexOf(req.params.expId);
      profile.experience.splice(experienceIndex, 1);
      profile
        .save()
        .then(prof => res.send(prof))
        .catch(err => res.status(400).json(err))

    })
    .catch(err => res.status(404).json(err))
});

router.delete('/education/:eduId', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile
    .findOne({ user: req.user.id })
    .then(profile => {
      if (!profile) {
        errors.profile = 'That user has no profile yet';
        res.status(404).json(errors);
      }

      const educationIndex = profile.education.map(education => education.id).indexOf(req.params.eduId);
      profile.education.splice(educationIndex, 1);
      profile
        .save()
        .then(prof => res.send(prof))
        .catch(err => res.status(400).json(err))

    })
    .catch(err => res.status(404).json(err))
});

router.delete('/:profileId', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile
    .findOneAndRemove({ user: req.user.id })
    .then(() => {
      User
        .findOneAndRemove({ _id: req.user.id })
        .then(() => res.json({ success: true }))
    })
})
module.exports = router;
