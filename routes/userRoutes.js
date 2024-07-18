const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const { name, password, email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    User = new User({ name, password, email });
    await user.save();
    const payload = { user: { id: user.id }};
    jwt.sign(payload, 'yourJWTSecret', { expireIn: 360000 }, (err, token) => {
      res.json({ token });
    });
  } catch (error) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
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