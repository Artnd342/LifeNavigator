const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all errands
router.get('/', async (req, res) => {
  const errands = await prisma.errand.findMany();
  res.json(errands);
});

// POST a new errand
router.post('/', async (req, res) => {
  const { title, estimated_time } = req.body;
  const newErrand = await prisma.errand.create({
    data: { title, estimated_time },
  });
  res.json(newErrand);
});

// DELETE an errand
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  await prisma.errand.delete({ where: { id } });
  res.sendStatus(204);
});

// TOGGLE or UPDATE errand (optional)
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, estimated_time, completed } = req.body;
  const updatedErrand = await prisma.errand.update({
    where: { id },
    data: { title, estimated_time, completed },
  });
  res.json(updatedErrand);
});

module.exports = router;

