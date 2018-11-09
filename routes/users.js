const express = require('express'),
      router = express.Router(),
      validatePayload = require('../middleware/validatePayload'),
      { User, validateCreate: user } = require('../models/user');

router.post('/', validatePayload(user), async (req, res) => {
  const { name, email, password, passwordConfirmation } = req.body;

  let user = await User.findOne({ email });

  if ( user ) return res.status(400).send('User already registered');

  if ( password !== passwordConfirmation )
    return res.status(400).send('Password must match Confirmation.');

  user = new User({ name, email, password });

  await user.save();

  const { _id } = user;

  const token = user.generateJwt();

  res.header('x-auth-token', token).send({ _id, name, email });
});

module.exports = router;