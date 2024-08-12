const express = require('express');
const router = express.Router();
const Partner = require('../models/partner');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const partners = await Partner.find();
    res.json(partners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  const partner = new Partner({
    name: req.body.name,
    bulstat: req.body.bulstat,
    addres: req.body.address,
    phone: req.body.phone,
    email: req.body.email
  });
  try {
    const newPartner = await partner.save();
    res.status(201).json(newPartner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;