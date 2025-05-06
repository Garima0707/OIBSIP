const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItem'); // Your Mongoose model

// POST /api/cart
router.post('/', async (req, res) => {
    try {
      const { userId, pizzaId, name, description, price, quantity, image } = req.body;
  
      const newItem = new CartItem({
        userId,
        pizzaId,
        name,
        description,
        price,
        quantity,
        image,
      });
  
      const savedItem = await newItem.save();
      res.status(201).json(savedItem);
  
    } catch (err) {
      console.error('Error saving cart item:', err);
      res.status(500).json({ message: 'Server error while adding to cart' });
    }
  });
  

//fetch cart items by userId
router.get('/', async (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ message: 'UserId is required' });
    }
  
    try {
      const items = await CartItem.find({ userId });
      res.json(items);
    } catch (err) {
      console.error('Error fetching cart items:', err);
      res.status(500).json({ message: 'Server error while fetching cart items' });
    }
  });
  

// DELETE - Remove item from cart
router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await CartItem.findByIdAndDelete(id);
      res.json({ message: 'Item removed from cart' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error while removing item' });
    }
  });
  
  // PATCH - Update quantity of an item in the cart
  router.patch('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
  
      const updatedItem = await CartItem.findByIdAndUpdate(id, { quantity }, { new: true });
      res.json(updatedItem);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error while updating item' });
    }
  });
  
module.exports = router;
