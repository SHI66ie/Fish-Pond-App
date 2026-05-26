const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all fish stock with their species and pond info
router.get('/', async (req, res) => {
  try {
    const fishStocks = await prisma.fishStock.findMany({
      include: {
        species: true,
        pond: true
      }
    });
    res.json(fishStocks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fish inventory' });
  }
});

// Update a specific fish stock (quick edit and detailed edit)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, averageWeight, notes, mortality } = req.body;
    
    // In a real system, you might create a separate Mortality record if you had a Mortality model.
    // Here we'll just update the quantity directly if mortality is provided
    let newQuantity = parseInt(quantity, 10);
    if (mortality) {
      newQuantity -= parseInt(mortality, 10);
      if (newQuantity < 0) newQuantity = 0;
    }

    const updatedStock = await prisma.fishStock.update({
      where: { id },
      data: {
        quantity: newQuantity,
        averageWeight: averageWeight ? parseFloat(averageWeight) : undefined,
        notes: notes !== undefined ? notes : undefined
      },
      include: {
        species: true
      }
    });

    res.json(updatedStock);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update fish stock' });
  }
});

module.exports = router;
