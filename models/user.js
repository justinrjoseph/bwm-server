const mongoose = require('mongoose'),
      Joi = require('joi'),
      jwt = require('jsonwebtoken'),
      bcrypt = require('bcrypt'),
      config = require('config');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    min: [4, 'Name must be at least four characters.'],
    max: [32, 'Name may not exceed 32 characters.']
  },
  email: {
    type: String,
    required: true,
    min: [7, 'Email must be at least seven characters.'],
    max: [255, 'Email may not exceed 255 characters.'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
  },
  password: {
    type: String,
    required: true,
    min: [8, 'Password must be at least eight characters.'],
    max: [1024, 'Password may not exceed 1024 characters.'],
  },
  rentals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rental'
  }],
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }]
});

userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.invalidPassword = async function(password) {
  return !(await bcrypt.compare(password, this.password));
}

userSchema.methods.generateJwt = function() {
  const secret = config.get('jwtPrivateKey');

  if ( this.name ) {
    return jwt.sign({
      _id: this._id,
      name: this.name,
      email: this.email
    }, secret, { expiresIn: '1h' });
  } else {
    return jwt.sign({
      _id: this._id,
      email: this.email
    }, secret, { expiresIn: '7d' });
  }
};

const User = mongoose.model('User', userSchema);

function validateCreate(user) {
  const schema = {
    name: Joi.string().min(4).max(32),
    email: Joi.string().required().min(7).max(255),
    password: Joi.string().required().min(8).max(255),
    passwordConfirmation: Joi.string().required().min(8).max(255)
  };

  return Joi.validate(user, schema);
}

function validateAuth(user) {
  const schema = {
    email: Joi.string().required().min(7).max(255),
    password: Joi.string().required().min(8).max(255),
  };

  return Joi.validate(user, schema);
}

module.exports = { User, validateCreate, validateAuth };
