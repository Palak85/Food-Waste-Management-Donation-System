const express = require('express');
const router = express.Router();
const FoodDonation = require('../models/FoodDonation');
const { auth } = require('../middleware/auth');

// GET all available donations (public)
router.get('/', async (req, res) => {
  try {
    const donations = await FoodDonation.find({ status: 'available' })
      .populate('donorId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, donations });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET single donation by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const donation = await FoodDonation.findById(req.params.id)
      .populate('donorId', 'name email phone');
    if (!donation) return res.status(404).json({ success: false, message: 'Donation not found' });
    res.json({ success: true, donation });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST create donation (donor only)
router.post('/', auth, async (req, res) => {
  try {
    const { foodItems, pickupLocation, availableTime, notes } = req.body;

    const donation = new FoodDonation({
      donorId: req.userId,
      foodItems,
      pickupLocation,
      availableTime,
      notes
    });

    await donation.save();
    await donation.populate('donorId', 'name email');
    res.status(201).json({ success: true, donation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create donation', error: err.message });
  }
});

// PATCH claim a donation (NGO only)
router.patch('/:id/claim', auth, async (req, res) => {
  try {
    const donation = await FoodDonation.findById(req.params.id);
    if (!donation) return res.status(404).json({ success: false, message: 'Donation not found' });
    if (donation.status !== 'available') {
      return res.status(400).json({ success: false, message: 'Donation is no longer available' });
    }

    donation.status = 'claimed';
    donation.claimedBy = req.userId;
    donation.claimedAt = new Date();
    await donation.save();
    res.json({ success: true, message: 'Donation claimed successfully', donation });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE cancel own donation (donor only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const donation = await FoodDonation.findById(req.params.id);
    if (!donation) return res.status(404).json({ success: false, message: 'Not found' });
    if (donation.donorId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await FoodDonation.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Donation removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET my donations (for donor dashboard)
router.get('/my/donations', auth, async (req, res) => {
  try {
    const donations = await FoodDonation.find({ donorId: req.userId })
      .populate('claimedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, donations });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
