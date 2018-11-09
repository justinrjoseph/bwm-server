const { User } = require('../models/user'),
      Rental = require('../models/rental');

class Seeder {
  static async seedDb() {
    await this.cleanDb();

    await this.generateUsers();

    this.generateRentals();
  }

  static async cleanDb() {
    await User.deleteMany();
    await Rental.deleteMany();

    console.log('Databased cleaned.');
  }

  static async generateUsers() {
    await User.collection.insertOne({
      name: 'Test User',
      email: 'test@gmail.com',
      password: 'asdf1234'
    });

    console.log('Test user inserted into DB.');
  }

  static async generateRentals() {
    const user = await User.findOne();

    await Rental.collection.insertMany([
      {
        image: "https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg",
        title: "Nice view on ocean",
        street: "Main Street",
        city: "San Francisco",
        category: "condo",
        bedrooms: 4,
        shared: true,
        description: "Very nice apartment in center of the city.",
        dailyRate: 43,
        user: user._id
      },
      {
        image: "https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg",
        title: "Modern apartment in center",
        street: "Time Square",
        city: "New York",
        category: "apartment",
        bedrooms: 1,
        shared: false,
        description: "Very nice apartment in center of the city.",
        dailyRate: 11,
        user: user._id
      },
      {
        image: "https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg",
        title: "Old house in nature",
        street: "Banicka 1",
        city: "Spisska Nova Ves",
        category: "house",
        bedrooms: 5,
        shared: true,
        description: "Very nice apartment in center of the city.",
        dailyRate: 23,
        user: user._id
      }
    ]);

    const rentals = await Rental.find();

    rentals.forEach((rental) => user.rentals = [...user.rentals, rental]);

    await user.save();

    console.log('Test rentals inserted into DB.');
  }
}

module.exports = Seeder;