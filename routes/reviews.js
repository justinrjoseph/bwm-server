const express = require('express'),
      router = express.Router(),
      auth = require('../middleware/auth'),
      validatePayload = require('../middleware/validatePayload'),
      { Booking, Review } = require('../models'),
      { validate: rental } = require('../models/review'),
      moment = require('moment');

router.get('/', async (req, res) => {
  const { rentalId } = req.query;

  const reviews = await Review.find({ rental: rentalId })
    .select({ __v: 0 })
    .populate('user');

  if ( !reviews ) return res.status(404).send('Rental reviews not found.');

  res.send(reviews);
});

router.post('/', [auth, validatePayload(rental)], async (req, res) => {
  const user = req.user;

  const { rating, text } = req.body;

  const { bookingId } = req.query;

  const booking = await Booking.findById(bookingId)
    .select({ __v: 0 })
    .populate({ path: 'rental', populate: { path: 'user '} })
    .populate('review')
    .populate('user');

  if ( !booking ) return res.status(404).send('Booking not found.');

  const { rental } = booking;

  if ( rental.user._id.equals(user._id) ) {
    return res.status(403).send('You may not review your own rental.');
  }

  const bookingUserId = booking.user._id;

  if ( !bookingUserId.equals(user._id) ) {
    return res.status(403).send('You are not the owner of that booking.');
  }

  const now = moment();
  const bookingEnd = moment(booking.end);

  if ( bookingEnd.isAfter(now) ) {
    return res.status(400).send('Rental may be reviewed after booking completed.');
  }

  if ( booking.review ) return res.status(400).send('Rental already reviewed.');

  const review = new Review({ rating, text, user, rental });

  try {
    await review.save();
  } catch(ex) {
    const { message: error } = ex.errors.rating;

    return res.status(400).send(error);
  }

  booking.review = review;
  await booking.save();

  res.send({ rating, text });
});

module.exports = router;