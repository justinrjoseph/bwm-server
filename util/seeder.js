const Rental = require('../models/rental');

class Seeder {
  static seedDb() {
    const rentals = [
      {
        image: "https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg",
        title: "Nice view on ocean",
        street: "Main Street",
        city: "San Francisco",
        category: "condo",
        bedrooms: 4,
        shared: true,
        description: "Very nice apartment in center of the city.",
        dailyRate: 43
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
        dailyRate: 11
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
        dailyRate: 23
    }];

    rentals.forEach((rental) => new Rental(rental).save());

    console.log('Test rentals inserted into DB.');
  }
}

module.exports = Seeder;