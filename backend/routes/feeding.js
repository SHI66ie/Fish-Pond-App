const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get recent feedings
router.get('/', async (req, res) => {
  try {
    const feedings = await prisma.feeding.findMany({
      orderBy: { fedAt: 'desc' },
      take: 10,
      include: {
        fishStock: {
          include: { species: true }
        }
      }
    });
    res.json(feedings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feeding schedule' });
  }
});

// Add a new feeding record
router.post('/', async (req, res) => {
  try {
    const { fishStockId, feedType, quantity, cost, notes } = req.body;
    const feeding = await prisma.feeding.create({
      data: {
        fishStockId,
        feedType,
        quantity: parseFloat(quantity),
        cost: cost ? parseFloat(cost) : null,
        notes
      }
    });
    res.status(201).json(feeding);
  } catch (error) {
    res.status(500).json({ error: 'Failed to log feeding' });
  }
});

module.exports = router;
