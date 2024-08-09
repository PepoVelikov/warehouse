const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const { name, password, email } = req.body;
  console.log('Received registration request:', { name, password, email });
  try {
    let user = await User.findOne({ name });
    if (user) {
      console.log('User already exists');
      return res.status(400).json({ message: 'User already exists' });
    }
    user = new User({ name, password, email });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    console.log('User registered successfully:', user);
    const payload = { user: { id: user.id }};
    jwt.sign(payload, 'yourJWTSecret', { expireIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).send('Server error');
  }
});

router.post('/login', async (req, res) => {
  const { name, password } = req.body;
  try {
    let user = await User.findOne({ name });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    const payload = { user: { id: user.id }};
    jwt.sign(payload, 'yourJWTSecret', { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
    });

module.exports = router;