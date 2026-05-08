const express = require('express');
const router = express.Router();
const FoodRequest = require('../models/FoodRequest');
const { auth } = require('../middleware/auth');

// GET all open requests (public)
router.get('/', async (req, res) => {
  try {
    const requests = await FoodRequest.find({ status: 'open' })
      .populate('ngoId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST create a request (authenticated NGO)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, peopleToFeed, urgency, location, date } = req.body;
    const request = new FoodRequest({
      ngoId: req.userId,
      title,
      description,
      peopleToFeed,
      urgency,
      location,
      date
    });
    await request.save();
    await request.populate('ngoId', 'name email');
    res.status(201).json({ success: true, request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to create request', error: err.message });
  }
});

// PATCH fulfill a request (donor claiming to fulfill)
router.patch('/:id/fulfill', auth, async (req, res) => {
  try {
    const request = await FoodRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    if (request.status !== 'open') {
      return res.status(400).json({ success: false, message: 'Request is no longer open' });
    }
    
    if (req.userType !== 'donor') {
      return res.status(403).json({ success: false, message: 'Only donors can fulfill food requests' });
    }
    request.status = 'fulfilled';
    request.fulfilledBy = req.userId;
    await request.save();
    res.json({ success: true, message: 'Request marked as fulfilled', request });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE cancel a request (NGO owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const request = await FoodRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Not found' });
    if (request.ngoId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    await FoodRequest.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Request deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET my requests (for NGO dashboard)
router.get('/my/requests', auth, async (req, res) => {
  try {
    const requests = await FoodRequest.find({ ngoId: req.userId })
      .populate('fulfilledBy', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
