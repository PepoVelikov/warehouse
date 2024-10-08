const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  console.log('Received registration request:', { name, email, password });
  try {
    let user = await User.findOne({ name });
    if (user) {
      console.log('User already exists');
      return res.status(400).json({ msg: 'User already exists' });
    }
    user = new User({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    console.log('User registered successfully:', user);
    const payload = { user: { id: user.id }};
    jwt.sign(payload, 'yourJWTSecret', { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).send({ msg: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { name, password } = req.body;
  try {
    let user = await User.findOne({ name });
    if (!user) {
      console.log('Invalid credentials: User not found');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid credentials: Password mismatch');
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const payload = { user: { id: user.id }};
    jwt.sign(payload, 'yourJWTSecret', { expiresIn: 360000 }, (err, token) => {
      if (err) {
      console.log('Error generating token:', err);
      throw err;
    }
    console.log('Login successful, token generated');
    res.status(200).json({ token });
  });
} catch (error) {
    console.error('Error logging in user:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;