const express = require('express'),
      router = express.Router(),
      auth = require('../middleware/auth'),
      validatePayload = require('../middleware/validatePayload'),
      { Rental, User } = require('../models'),
      { validate: rental } = require('../models/rental');

const noRentalsFoundMsg = 'No rentals found.';
const rentalNotFoundMsg = 'Rental not found.';

router.get('/', async (req, res) => {
  const { city } = req.query;

  const query = city ? { city: new RegExp(city, 'i') } : {};

  const rentals = await Rental.find(query)
      .sort({ createdAt: 1 })
      .select({ __v: 0, bookings: 0 })

  if ( !rentals.length ) {
    const msg = city
      ? `No rentals found for ${titlecase(city)}.`
      : noRentalsFoundMsg;

    return res.status(404).send(msg);
  }

  res.send(rentals);
});

router.get('/manage', auth, async (req, res) => {
  const user = res.locals.user;

  const rentals = await Rental.where({ user })
    .populate('bookings');

  if ( !rentals ) return res.status(404).send(noRentalsFoundMsg);

  res.send(rentals);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const rental = await Rental.findById(id)
    .select({ __v: 0 })
    .populate('user', 'name -_id')
    .populate('bookings', 'start end -_id');

  if ( !rental ) return res.status(404).send(rentalNotFoundMsg);

  res.send(rental);
});

router.post('/', [auth, validatePayload(rental)], async (req, res) => {
  const {
    image,
    title,
    street,
    city,
    category,
    bedrooms,
    shared,
    description,
    dailyRate
  } = req.body;

  const user = res.locals.user;

  const rental = new Rental({
    image,
    title,
    street,
    city,
    category,
    bedrooms,
    shared,
    description,
    dailyRate,
    user
  });

  await rental.save();

  await User.updateOne({ _id: user._id }, {
    $push: { rentals: rental }
  });

  res.send(rental);
});

router.delete('/:id', auth, async (req, res) => {
  const user = res.locals.user;

  const rental = await Rental.findById(req.params.id)
    .populate('user', '_id')
    .populate({
      path: 'bookings',
      select: 'start',
      match: { start: { $gt: new Date() } }
    });

  if ( !rental ) return res.status(404).send(rentalNotFoundMsg);

  if ( !user._id.equals(rental.user._id) ) {
    return res.status(403).send('You are not the owner of that rental.');
  }

  if ( rental.bookings.length ) {
    return res.status(400).send('Rental has active bookings.');
  }

  await rental.remove();

  const { _id } = rental;

  res.send({ _id });
});

function titlecase(string) {
  var splitString = string.toLowerCase().split(' ');

  for ( let i = 0; i < splitString.length; i++ ) {
    splitString[i] = `${splitString[i].charAt(0).toUpperCase()}${splitString[i].substring(1)}`;
  }

  return splitString.join(' ');
}

module.exports = router;;