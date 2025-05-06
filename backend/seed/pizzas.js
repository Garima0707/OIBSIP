const mongoose = require("mongoose");
const Pizza = require("../models/Pizza");
require("dotenv").config();

const pizzas = [
  {
    name: "Margherita",
    description: "Classic delight with 100% real mozzarella cheese",
    price: 199,
    category: "veg",
    image: "margeritaPizza.png",
  },
  {
    name: "Farmhouse",
    description: "Loaded with onion, capsicum, tomato & grilled mushroom",
    price: 249,
    category: "veg",
    image: "https://via.placeholder.com/300x200?text=Margherita",
  },
  {
    name: "Peppy Paneer",
    description: "Paneer, capsicum, and red paprika in spicy style",
    price: 279,
    category: "veg",
    image: "https://via.placeholder.com/300x200?text=Margherita",
  },
  {
    name: "Chicken Golden Delight",
    description: "Double chicken with cheese overload",
    price: 299,
    category: "non-veg",
    image: "https://via.placeholder.com/300x200?text=Margherita",
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    await Pizza.deleteMany({});
    await Pizza.insertMany(pizzas);
    console.log("🍕 Pizza data inserted");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("MongoDB Error:", err);
  });
