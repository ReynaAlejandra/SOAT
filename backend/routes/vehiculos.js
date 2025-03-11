import express from 'express';
import Vehiculo from '../models/Vehiculo.js';

const router = express.Router();

// guardar un vehículo
router.post('/', async (req, res) => {
  try {
    const vehiculo = new Vehiculo(req.body);
    const vehiculoGuardado = await vehiculo.save();
    res.status(201).json(vehiculoGuardado);
  } catch (error) {
    console.error('Error al guardar vehículo:', error);
    res.status(500).json({ message: 'Error al guardar vehículo' });
  }
});

export default router;
