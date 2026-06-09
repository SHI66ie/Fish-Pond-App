const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get sensor logs for a specific pond
router.get('/pond/:pondId', async (req, res) => {
  try {
    const { pondId } = req.params;
    const { limit = 100 } = req.query; // default 100 records
    
    const logs = await prisma.waterSensorLog.findMany({
      where: { pondId },
      orderBy: { timestamp: 'desc' },
      take: parseInt(limit, 10)
    });
    
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sensor logs' });
  }
});

// Add a new sensor log reading
router.post('/', async (req, res) => {
  try {
    const { pondId, temperature, ph, dissolvedOxygen, ammonia } = req.body;
    
    const log = await prisma.waterSensorLog.create({
      data: {
        pondId,
        temperature: temperature !== undefined ? parseFloat(temperature) : null,
        ph: ph !== undefined ? parseFloat(ph) : null,
        dissolvedOxygen: dissolvedOxygen !== undefined ? parseFloat(dissolvedOxygen) : null,
        ammonia: ammonia !== undefined ? parseFloat(ammonia) : null,
      }
    });
    
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ error: 'Failed to log sensor data' });
  }
});

module.exports = router;
