const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all ponds
router.get('/', async (req, res) => {
  try {
    const ponds = await prisma.pond.findMany({
      include: {
        fishStock: {
          include: {
            species: true
          }
        }
      }
    });
    res.json(ponds);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ponds' });
  }
});

// Get a single pond
router.get('/:id', async (req, res) => {
  try {
    const pond = await prisma.pond.findUnique({
      where: { id: req.params.id },
      include: {
        fishStock: {
          include: {
            species: true
          }
        },
        transactions: true
      }
    });
    if (!pond) return res.status(404).json({ error: 'Pond not found' });
    res.json(pond);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pond details' });
  }
});

// Create a new pond
router.post('/', async (req, res) => {
  try {
    const { name, location, size, depth, waterType, temperature, phLevel, oxygenLevel } = req.body;
    const newPond = await prisma.pond.create({
      data: {
        name,
        location,
        size: parseFloat(size),
        depth: parseFloat(depth),
        waterType,
        temperature: temperature !== undefined ? parseFloat(temperature) : null,
        phLevel: phLevel !== undefined ? parseFloat(phLevel) : null,
        oxygenLevel: oxygenLevel !== undefined ? parseFloat(oxygenLevel) : null
      }
    });
    res.status(201).json(newPond);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create pond' });
  }
});

// Update a pond
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, size, depth, waterType, temperature, phLevel, oxygenLevel } = req.body;
    const updatedPond = await prisma.pond.update({
      where: { id },
      data: {
        name,
        location,
        size: size !== undefined ? parseFloat(size) : undefined,
        depth: depth !== undefined ? parseFloat(depth) : undefined,
        waterType,
        temperature: temperature !== undefined ? parseFloat(temperature) : undefined,
        phLevel: phLevel !== undefined ? parseFloat(phLevel) : undefined,
        oxygenLevel: oxygenLevel !== undefined ? parseFloat(oxygenLevel) : undefined
      }
    });
    res.json(updatedPond);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update pond' });
  }
});

// Delete a pond
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.pond.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete pond' });
  }
});

module.exports = router;
