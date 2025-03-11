import { body, validationResult } from 'express-validator';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
                                                                                          console.log('Errores de validación:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const registerValidation = [
  body('nombre').notEmpty().withMessage('Nombre es obligatorio'),
  body('apellidos').notEmpty().withMessage('Apellidos son obligatorios'),
  body('carnet').notEmpty().withMessage('Carnet es obligatorio').isString().withMessage('Carnet debe ser una cadena de números'),
  body('grado').notEmpty().withMessage('Grado es obligatorio'),
  body('usuario').notEmpty().withMessage('Nombre de usuario es obligatorio').isString().withMessage('Nombre de usuario debe ser una cadena de texto'),
  body('password')
    .notEmpty().withMessage('Contraseña es obligatoria')
    .isLength({ min: 8 }).withMessage('Contraseña debe tener al menos 8 caracteres')
    .matches(/[A-Z]/).withMessage('Contraseña debe tener al menos una letra mayúscula')
    .matches(/\d/).withMessage('Contraseña debe tener al menos un número'),
  body('rol').optional().isIn(['usuario', 'administrador']).withMessage('Rol debe ser "usuario" o "administrador"')
];

export const validarAccidente = (req, res, next) => {
  const { archivosAdjuntos } = req.body;

  if (archivosAdjuntos && archivosAdjuntos.length > 0) {
    archivosAdjuntos.forEach((archivo) => {
      if (!archivo.archivoBase64 || !archivo.archivoNombre) {
        return res.status(400).json({ mensaje: 'Todos los archivos adjuntos deben contener un archivoBase64 y un archivoNombre.' });
      }
    });
  }

  next();
};