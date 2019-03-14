const express = require('express'),
      router = express.Router(),
      { Rental } = require('../models');

const rentalNotFoundMsg = 'Rental not found.'

router.get('/', async (req, res) => {
  const rentals = await Rental.find()
    .sort({ createdAt: 1 })
    .select({ __v: 0 })
    .select('-bookings');

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

module.exports = router;;