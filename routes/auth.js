const express = require('express'),
      router = express.Router(),
      validatePayload = require('../middleware/validatePayload'),
      { User, validateAuth: user } = require('../models/user');

const invalidCredsMsg = 'Invalid email or password.';

router.post('/', validatePayload(user), async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });

  if ( !user ) return res.status(400).send(invalidCredsMsg);

  if ( await user.invalidPassword(password) )
    return res.status(400).send(invalidCredsMsg);

  const token = user.generateJwt();

  res.send({ token });
});

module.exports = router;