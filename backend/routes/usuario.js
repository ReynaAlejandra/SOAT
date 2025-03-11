import express from 'express';
import { registerUsuario, loginUsuario, getUsuarios, getUsuarioById, updateUsuario, deleteUsuario } from '../controllers/usuarioController.js';
import { verifyToken } from '../auth/jwtAuth.js';
import { isAdmin } from '../middleware/authMiddleware.js';
import { registerValidation, validateRequest } from '../middleware/validationMiddleware.js'

const router = express.Router();

//rutas publicas
router.post('/login', loginUsuario);

//rutas protegidas
router.post('/register',verifyToken, isAdmin, registerValidation, validateRequest, registerUsuario);
router.get('/', verifyToken, getUsuarios)
router.get('/:id', verifyToken, getUsuarioById)
router.put('/:id', verifyToken, isAdmin, updateUsuario)
router.delete('/:id', verifyToken, isAdmin, deleteUsuario)

export default router;