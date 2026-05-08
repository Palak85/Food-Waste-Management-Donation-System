const mongoose = require('mongoose');

const foodDonationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodItems: [{
    itemName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: ['kg', 'liters', 'plates', 'pieces', 'portions'],
      required: true
    },
    category: {
      type: String,
      enum: ['cooked', 'raw', 'packaged', 'beverage'],
      required: true
    },
    foodType: {
      type: String,
      enum: ['Veg', 'Non-Veg', 'Both'],
      default: 'Veg'
    },
    cookingTime: Date,
    description: String,
    image: String,
    expiryTime: Date
  }],
  pickupLocation: {
    address: {
      type: String,
      required: true
    },
    city: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: [Number] // [longitude, latitude]
    }
  },
  availableTime: {
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['available', 'claimed', 'accepted', 'picked_up', 'delivered', 'expired', 'cancelled'],
    default: 'available'
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  claimedAt: Date,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

foodDonationSchema.index({ 'pickupLocation.coordinates': '2dsphere' });
foodDonationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('FoodDonation', foodDonationSchema);
