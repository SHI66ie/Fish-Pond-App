const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all post-harvest inventory
router.get('/', async (req, res) => {
  try {
    const inventory = await prisma.postHarvestInventory.findMany({
      include: {
        harvest: {
          include: {
            fishStock: {
              include: {
                species: true,
                pond: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// Add new product to inventory
router.post('/', async (req, res) => {
  try {
    const { harvestId, productType, quantityKg, lotNumber, pricePerKg } = req.body;
    const item = await prisma.postHarvestInventory.create({
      data: {
        harvestId: harvestId || null,
        productType,
        quantityKg: parseFloat(quantityKg),
        lotNumber,
        pricePerKg: pricePerKg ? parseFloat(pricePerKg) : null
      }
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add inventory item' });
  }
});

// Sell from inventory
router.post('/:id/sell', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantitySold } = req.body;
    
    const item = await prisma.postHarvestInventory.findUnique({ where: { id } });
    if (!item || item.quantityKg < quantitySold) {
      return res.status(400).json({ error: 'Insufficient quantity in inventory' });
    }

    const updatedItem = await prisma.postHarvestInventory.update({
      where: { id },
      data: { quantityKg: item.quantityKg - parseFloat(quantitySold) }
    });
    
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process sale' });
  }
});

module.exports = router;
