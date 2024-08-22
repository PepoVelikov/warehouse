const express = require('express');
const router = express.Router();
const Partner = require('../models/partner');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const partners = await Partner.find();
    res.json(partners);
  } catch (err) {
    res.status(500).json('Server error');
  }
});

router.post('/', auth, async (req, res) => {
  const { name, bulstat, address, phone, email } = req.body;

  try {
    const newPartner = new Partner({
      name,
      bulstat,
      address,
      phone,
      email
    });

    const partner = await newPartner.save();
    res.status(201).json(partner);
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server error');
  }
});

module.exports = router;