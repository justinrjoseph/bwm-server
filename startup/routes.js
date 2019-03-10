const express = require('express'),
      auth = require('../routes/auth'),
      users = require('../routes/users'),
      rentals = require('../routes/rentals'),
      bookings = require('../routes/bookings');

module.exports = (app) => {
  app.use(express.json())

  app.use('/api/auth', auth);
  app.use('/api/users', users);
  app.use('/api/rentals', rentals);
  app.use('/api/bookings', bookings);
};