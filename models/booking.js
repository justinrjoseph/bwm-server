const mongoose = require('mongoose'),
      moment = require('moment');

const Booking = mongoose.model('Booking', new mongoose.Schema({
  start: {
    type: Date,
    required: true
  },
  end: {
    type: Date,
    required: true
  },
  days: Number,
  guests: Number,
  totalPrice: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rental: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rental'
  }
}));

function bookingDatesValid(requestedBooking, rental) {
  if ( rental.bookings && rental.bookings.length ) {
    return rental.bookings.every((booking) => {
      const requestedStart = moment(requestedBooking.start);
      const requestedEnd = moment(requestedBooking.end);

      const actualStart = moment(booking.start);
      const actualEnd = moment(booking.end);

      return ( actualStart < requestedStart && actualEnd < requestedEnd ) ||
             ( requestedEnd < actualEnd && requestedEnd < actualStart );
    });
  } else {
    return true;
  }
}

module.exports = { Booking, bookingDatesValid };

