const config = require('config'),
      jwt = require('jsonwebtoken'),
      { User } = require('../models/user');

module.exports = async (req, res, next) => {
  const token = req.headers['Authorization'].split(' ')[1];

  if ( !token ) return res.status(401).send('Access denied. No token provided.');

  try {
    let user = jwt.verify(token, config.get('jwtPrivateKey'));

    user = await User.findById(user._id);

    if ( !user ) return res.status(401).send('Access denied.');

    res.locals.user = user;

    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};