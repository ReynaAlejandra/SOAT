import express from 'express';
import Conductor from '../models/Conductor.js';

const router = express.Router();

// guardar un conductor
router.post('/', async (req, res) => {
  try {
    const conductor = new Conductor(req.body);
    const conductorGuardado = await conductor.save();
    res.status(201).json(conductorGuardado);
  } catch (error) {
    console.error('Error al guardar conductor:', error);
    res.status(500).json({ message: 'Error al guardar conductor' });
  }
});

export default router;
