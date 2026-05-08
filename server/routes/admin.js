const express = require('express');
const router = express.Router();
const User = require('../models/User');
const FoodDonation = require('../models/FoodDonation');
const { auth, adminOnly } = require('../middleware/auth');

// Get system stats
router.get('/stats', auth, adminOnly, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const donationsCount = await FoodDonation.countDocuments();
    
    // Total quantity (dummy logic, but functional for structure)
    const activeDonations = await FoodDonation.find({ status: 'available' });
    
    res.json({ 
      success: true, 
      stats: { 
        users: usersCount, 
        donations: donationsCount,
        activeDonations: activeDonations.length
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Get all users
router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Delete user
router.delete('/users/:id', auth, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Get all donations
router.get('/donations', auth, adminOnly, async (req, res) => {
  try {
    const donations = await FoodDonation.find().populate('donor', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, donations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Delete/Reject donation
router.delete('/donations/:id', auth, adminOnly, async (req, res) => {
  try {
    await FoodDonation.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Donation removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
