const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all harvests
router.get('/', async (req, res) => {
  try {
    const harvests = await prisma.harvest.findMany({
      include: {
        fishStock: {
          include: {
            species: true,
            pond: true
          }
        }
      },
      orderBy: { harvestDate: 'desc' }
    });
    res.json(harvests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch harvests' });
  }
});

// Log a new harvest
router.post('/', async (req, res) => {
  try {
    const { fishStockId, totalWeightKg, fishCount, qualityNotes } = req.body;
    
    // Create the harvest record
    const harvest = await prisma.harvest.create({
      data: {
        fishStockId,
        totalWeightKg: parseFloat(totalWeightKg),
        fishCount: parseInt(fishCount, 10),
        qualityNotes
      }
    });

    // Optionally: Update the fishStock quantity here
    // For now we assume the stock count gets reduced or archived
    const stock = await prisma.fishStock.findUnique({ where: { id: fishStockId } });
    if (stock) {
      const newQuantity = Math.max(0, stock.quantity - parseInt(fishCount, 10));
      await prisma.fishStock.update({
        where: { id: fishStockId },
        data: { quantity: newQuantity }
      });
    }

    res.status(201).json(harvest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to log harvest' });
  }
});

module.exports = router;
