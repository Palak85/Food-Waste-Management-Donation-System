const mongoose = require('mongoose');

const foodRequestSchema = new mongoose.Schema({
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  peopleToFeed: { type: Number, required: true },
  urgency: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  location: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['open', 'fulfilled', 'cancelled'], default: 'open' },
  fulfilledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

module.exports = mongoose.models.FoodRequest || mongoose.model('FoodRequest', foodRequestSchema);
