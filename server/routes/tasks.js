const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('../middleware/auth');
const prisma = new PrismaClient();
const router = express.Router();

// 👇 Protect this route using the middleware
router.get('/', authenticateToken, async (req, res) => {
  const userId = req.user.userId; // Comes from token
  const tasks = await prisma.task.findMany({
    where: { userId }
  });
  res.json(tasks);
});
router.post('/', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { title, estimatedTime } = req.body;
  const task = await prisma.task.create({
    data: {
      title,
      estimatedTime,
      userId
    }
  });
  res.json(task);
});


module.exports = router;
