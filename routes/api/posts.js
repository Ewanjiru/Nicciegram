const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const Post = require('../../models/Post');
const validatePostData = require('../../validation/post');
const validateCommentData = require('../../validation/comment');

const router = express.Router();

router.get('/', (req, res) => {
  Post
    .find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ error: 'No posts found' }));
});


router.get('/:postId', (req, res) => {
  Post
    .find({ _id: req.params.postId })
    .then(post => {
      if (post.length <= 0) {
        res.status(404).json({ Post: 'Requested post not found' })
      }
      res.json(post)
    })
    .catch(err => res.status(404).json({ error: 'Post not found' }))
});

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostData(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id,
  })
  post
    .save()
    .then(postCreated => res.json(postCreated))
    .catch(err => console.log(err))

});

router.post('/like/:postId', passport.authenticate('jwt', { session: false }), (req, res) => {
  const user = req.user.id;
  Post
    .findById({ _id: req.params.postId })
    .then(post => {
      const userLikeIndex = post.likes.findIndex(like => like.user && like.user.toString() === user);
      if (userLikeIndex >= 0) {
        post.likes.splice(userLikeIndex, 1)
      }
      if (userLikeIndex == -1) {
        post.likes.unshift({ user })
      }

      post
        .save()
        .then(post => res.json(post))
        .catch(err => res.json(err))
    })
})

router.post('/comment/:postId', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validateCommentData(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  Post
    .findById({ _id: req.params.postId })
    .then(post => {
      const newComment = {
        user: req.user.id,
        description: req.body.description,
        name: req.body.name,
        avatar: req.body.name
      };

      post.comments.unshift(newComment)

      post
        .save()
        .then(post => res.json(post))
        .catch(err => res.json(err))
    })
    .catch(err => res.status(404).json({ post: 'Post not found' }))
});

router.delete('/comment/:postId/:commentId', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post
    .findById({ _id: req.params.postId })
    .then(post => {
      const commentIndex = post.comments.findIndex(comment => comment._id && comment._id.toString() === req.params.commentId);

      if (commentIndex >= 0) {
        post.comments.splice(commentIndex, 1)
      }
      console.log('index', commentIndex)

      post
        .save()
        .then(post => res.json(post))
        .catch(err => res.json(err))
    })
})

router.delete('/:postId', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post
    .findOneAndRemove({ _id: req.params.postId, user: req.user.id })
    .then(post => {
      if (!post) return res.status(401).json({ authorization: 'You are not authorized to delete this post' })
      res.status(200).json({ delete: "successfully deleted" })
    })
    .catch(err => res.status(401).json(err))
});

module.exports = router;
