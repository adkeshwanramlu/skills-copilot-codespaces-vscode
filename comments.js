// Create web server
const express = require('express');
const router = express.Router();
const comments = require('../models/comments');
const users = require('../models/users');
const { validateComment } = require('../validations/comments');
const { validateUser } = require('../validations/users');
const { validateObjectId } = require('../validations/common');
const { validateUserToken } = require('../validations/auth');

// Create a comment
router.post('/', validateUserToken, async (req, res) => {
  // Validate request body
  const { error } = validateComment(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Validate user
  const user = await users.findById(req.user._id);
  if (!user) return res.status(400).send('Invalid user');

  // Create a comment
  const comment = new comments({
    userId: req.user._id,
    text: req.body.text,
    postId: req.body.postId,
    date: new Date()
  });

  // Save comment
  try {
    const result = await comment.save();
    res.send(result);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get all comments
router.get('/', async (req, res) => {
  const result = await comments.find();
  res.send(result);
});

// Get comments by post id
router.get('/post/:id', async (req, res) => {
  // Validate post id
  const { error } = validateObjectId(req.params.id);
  if (error) return res.status(400).send(error.details[0].message);

  const result = await comments.find({ postId: req.params.id });
  res.send(result);
});

// Get comments by user id
router.get('/user/:id', async (req, res) => {
  // Validate user id
  const { error } = validateObjectId(req.params.id);
  if (error) return res.status(400).send(error.details[0].message);

  const result = await comments.find({ userId: req.params.id });
  res.send(result);
});

// Update a comment
router.put('/:id', validateUserToken, async (req, res) => {
  // Validate request body
  const { error } = validateComment(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //