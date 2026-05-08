const express = require('express');
const router = express.Router();
const User = require('../models/User');
const FoodDonation = require('../models/FoodDonation');
const mongoose = require('mongoose');
const { auth, adminOnly } = require('../middleware/auth');

// Note: FoodRequest is defined in requests.js, we should access it via mongoose.models
const FoodRequest = mongoose.models.FoodRequest;

// Get system stats
router.get('/stats', auth, adminOnly, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const donationsCount = await FoodDonation.countDocuments();
    
    const allDonations = await FoodDonation.find();
    let mealsSaved = 0;
    let wasteReducedKg = 0;
    
    allDonations.forEach(d => {
      d.foodItems.forEach(item => {
        if (item.unit === 'kg') wasteReducedKg += item.quantity;
        if (item.unit === 'plates' || item.unit === 'portions') mealsSaved += item.quantity;
        else mealsSaved += (item.quantity * 2); // rough estimate for others
      });
    });
    
    const activeDonations = allDonations.filter(d => d.status === 'available');
    
    res.json({ 
      success: true, 
      stats: { 
        users: usersCount, 
        donations: donationsCount,
        activeDonations: activeDonations.length,
        mealsSaved,
        wasteReducedKg
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

// Get all requests
router.get('/requests', auth, adminOnly, async (req, res) => {
  try {
    const requests = await FoodRequest.find().populate('ngoId', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Delete request
router.delete('/requests/:id', auth, adminOnly, async (req, res) => {
  try {
    await FoodRequest.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Request removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
