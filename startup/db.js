const mongoose = require('mongoose'),
      config = require('config'),
      Seeder = require('../util/seeder');

module.exports = () => {
  mongoose.connect(config.get('db'), { useNewUrlParser: true })
    .then(() => {
      console.log('Connected to Mongo DB database.');

      // Seeder.seedDb();
    })
    .catch(() => console.error('There was a problem connecting to the database.'));
};