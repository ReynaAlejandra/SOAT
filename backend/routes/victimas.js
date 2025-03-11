import express from 'express';
import Victima from '../models/Victima.js';

const router = express.Router();

// guardar una víctima
router.post('/', async (req, res) => {
  try {
    const victima = new Victima(req.body);
    const victimaGuardada = await victima.save();
    res.status(201).json(victimaGuardada);
  } catch (error) {
    console.error('Error al guardar víctima:', error);
    res.status(500).json({ message: 'Error al guardar víctima' });
  }
});

export default router;
