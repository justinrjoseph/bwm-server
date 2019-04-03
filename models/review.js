const mongoose = require('mongoose'),
      Joi = require('joi');

const Review = mongoose.model('Review', new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    validate: {
      validator: function(value) {
        return value >= 1 && value <= 5;
      },
      message: 'Rating must be number between 1 and 5'
    }
  },
  text: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rental: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rental'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}));

function validate(review) {
  const schema = {
    rating: Joi.number().required(),
    text: Joi.string()
  };

  return Joi.validate(review, schema);
}

module.exports = { Review, validate };