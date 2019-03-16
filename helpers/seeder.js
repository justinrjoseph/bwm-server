const { User, Rental, Booking } = require('../models'),
      seedData = require('./data.json');

class Seeder {
  static async seedDb() {
    await this.cleanDb();

    await this.generateUsers();

    this.generateRentals();
  }

  static async cleanDb() {
    await User.deleteMany();
    await Rental.deleteMany();
    await Booking.deleteMany();

    console.log('Database cleaned.');
  }

  static async generateUsers() {
    await User.collection.insertMany(seedData.users);

    console.log('Test users inserted into DB.');
  }

  static async generateRentals() {
    const user1 = await User.findOne({ name: 'Test User 1' });
    const user2 = await User.findOne({ name: 'Test User 2' });

    await Rental.collection.insertMany(seedData.rentals);

    const rentals = await Rental.find();

    rentals.forEach(async (rental) => {
      await Rental.updateOne({ _id: rental._id }, { user: user1 });

      user1.rentals = [...user1.rentals, rental];
    });

    await user1.save();
    await user2.save();

    console.log('Test rentals inserted into DB.');
  }
}

module.exports = Seeder;