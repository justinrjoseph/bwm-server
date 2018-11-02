const express = require('express'),
      rentals = require('../routes/rentals')

module.exports = (app) => {
  app.use(express.json())

  app.use('/api/rentals', rentals);
};