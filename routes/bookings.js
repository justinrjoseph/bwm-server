const express = require('express'),
      router = express.Router(),
      auth = require('../middleware/auth'),
      { bookingDatesValid } = require('../models/booking'),
      { User, Booking, Rental } = require('../models');

const rentalNotFoundMsg = 'Rental not found.'

router.get('/', async (req, res) => {
  const bookings = await Booking.find()
    .sort({ createdAt: 1 })
    .select({ __v: 0 });

  res.send(bookings);
});

router.get('/manage', auth, async (req, res) => {
  const user = res.locals.user;

  const bookings = await Booking.where({ user })
    .populate('rental');

  if ( !bookings ) return res.status(404).send('No bookings found.');

  res.send(bookings);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findById(id).select({ __v: 0 });

  if ( !booking ) return res.status(404).send(bookingNotFoundMsg);

  res.send(booking);
});

router.post('/', auth, async (req, res) => {
  const { start, end, days, guests, totalPrice, rental: rentalReq } = req.body;

  const user = res.locals.user;

  const booking = new Booking({
    start,
    end,
    days,
    guests,
    totalPrice,
    user
  });

  const rental = await Rental.findById(rentalReq._id)
    .select({ __v: 0 })
    .populate('bookings')
    .populate('user');

  if ( !rental ) return res.status(404).send(rentalNotFoundMsg);

  if ( rental.user._id.equals(user._id) ) {
    return res.status(403).send('You may not book your own rental.');
  }

  if ( bookingDatesValid(booking, rental) ) {
    booking.rental = rental;
    await booking.save();

    await Rental.updateOne({ _id: rental._id }, {
      $push: { bookings: booking }
    });

    await User.updateOne({ _id: user._id }, {
      $push: { bookings: booking }
    });

    const { start, end } = booking;

    res.send({ start, end });
  } else {
    res.status(400).send('Rental is already booked for those dates.')
  }
});

module.exports = router;;