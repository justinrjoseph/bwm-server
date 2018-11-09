const mongoose = require('mongoose'),
      config = require('config'),
      Seeder = require('../helpers/seeder');

module.exports = () => {
  mongoose.connect(config.get('db'), { useNewUrlParser: true, useCreateIndex: true })
    .then(() => {
      console.log('Connected to Mongo DB database.');

      // Seeder.seedDb();
    })
    .catch(() => console.error('There was a problem connecting to the database.'));
};