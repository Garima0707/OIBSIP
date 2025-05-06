// routes/adminInventoryRoutes.js
const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

// Get current inventory
router.get('/', async (req, res) => {
  try {
    const inventory = await Inventory.findOne();
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update inventory after order
router.post('/update', async (req, res) => {
  const { usedBase, usedSauce, usedCheese, usedVeggies, usedMeat } = req.body;
  try {
    let inventory = await Inventory.findOne();
    if (!inventory) {
      inventory = new Inventory();
    }

    inventory.base -= usedBase;
    inventory.sauce -= usedSauce;
    inventory.cheese -= usedCheese;
    inventory.veggies -= usedVeggies;
    inventory.meat -= usedMeat;

    await inventory.save();
    res.json({ message: 'Inventory updated', inventory });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to update inventory
router.put('/update-inventory', async (req, res) => {
    const { base, sauce, cheese, veggies, meat } = req.body;
  
    try {
      const updatedInventory = await Inventory.findOneAndUpdate(
        {}, // update the first document (in this case we have one inventory document)
        {
          $inc: {
            base: -base, // subtract base from available stock
            sauce: -sauce,
            cheese: -cheese,
            veggies: -veggies,
            meat: -meat,
          }
        },
        { new: true }
      );
  
      res.status(200).json(updatedInventory);
    } catch (err) {
      console.error("Error updating inventory:", err);
      res.status(500).json({ message: "Failed to update inventory" });
    }
  });
  
module.exports = router;
