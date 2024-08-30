const express = require('express');
const router = express.Router();
const Partner = require('../models/partner');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const partners = await Partner.find().sort({ partnerNumber: 1 });
    res.json(partners);
  } catch (err) {
    res.status(500).json({ message : err.message });
  }
});

router.post('/', auth, async (req, res) => {
  console.log('Received POST request for adding partner');
  console.log('Request body:', req.body);
  
  try {
    const lastPartner = await Partner.findOne().sort({ partnerNumber: -1 });
    let newPartnerNumber = 1;
    if (lastPartner) {
      newPartnerNumber = lastPartner.partnerNumber + 1;
    }

    const partner = new Partner({
      partnerNumber: newPartnerNumber,
      name: req.body.name,
      bulstat: req.body.bulstat,
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email
    });
    console.log('New partner created:', partner);

    const savedPartner = await partner.save();
    console.log('Partner saved to database:', savedPartner);
    res.status(201).json(savedPartner);
  } catch (err) {
    console.log('Error saving partner:', err.message);
    res.status(500).json({ message : err.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { name, bulstat, address, phone, email } = req.body;
  const partnerFields = {};
  if (name) partnerFields.name = name;
  if (bulstat) partnerFields.bulstat = bulstat;
  if (address) partnerFields.address = address;
  if (phone) partnerFields.phone = phone;
  if (email) partnerFields.email = email;

  try {
    let partner = await Partner.findById(req.params.id);

    if (!partner) return res.status(404).json({ msg: 'Partner not found' });

    partner = await Partner.findByIdAndUpdate(
      req.params.id, 
      { $set: partnerFields }, 
      { new: true }
    );

    res.json(partner);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}); 

router.delete('/:id', auth, async (req, res) => {
  try {
    let partner = await Partner.findById(req.params.id);

    if (!partner) return res.status(404).json({ msg: 'Partner not found' });

    await Partner.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Partner removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;