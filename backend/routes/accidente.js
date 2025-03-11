import express from 'express';
import { check } from 'express-validator';
import { createAccidente, getAccidentes, getFormularioById, updateFormularioById } from '../controllers/accidenteController.js';
import { validateRequest } from '../middleware/validationMiddleware.js'
import jsreport from 'jsreport-client';
import Accidente from '../models/Accidente.js';
import mongoose from 'mongoose';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
// import multer from 'multer';
// import upload from '../middleware/validationMiddleware.js';

const router = express.Router();

const client = jsreport('https://report.mingobierno.gob.bo/','mingob','sascuach2021$');

router.post(
    '/', 
    // upload.fields([
    // ]),
    [
        check('hechos').notEmpty().withMessage('Hechos es requerido'),
        check('vehiculos').isArray().withMessage('Vehículos debe ser un array'),
        check('conductores').isArray().withMessage('Conductores debe ser un array'),
        check('detalle').notEmpty().withMessage('Detalle es requerido'),
        check('victimas').isArray().withMessage('Víctimas debe ser un array'),
        check('usuario').notEmpty().withMessage('Usuario es requerido'),
        check('fechaRegistro').isISO8601().withMessage('Fecha de registro debe ser una fecha válida'),
    ],
    validateRequest,
    createAccidente
);
router.get('/', getAccidentes);
router.get('/formulario/:id', getFormularioById)
router.put('/formulario/:id', updateFormularioById)
router.put('/:id', updateFormularioById)

router.get('/reporte/:id', async (req, res) => {
    try {
        const accidente = await Accidente.findById(req.params.id);
        if (!accidente) {
            return res.status(404).json({ error: 'Accidente no encontrado' });
        }

        const formattedFechaRegistro = format(new Date(accidente.fechaRegistro), 'dd MMMM yyyy', { locale: es });
    
        client.render({
            template: { shortid: 'kq2nv7UyxU' },
            data: {
                hechos: accidente.hechos,
                vehiculos: accidente.vehiculos,
                conductores: accidente.conductores,
                victimas: accidente.victimas,
                detalle: accidente.detalle,
                usuario: accidente.usuario,
                fechaRegistro: formattedFechaRegistro,
                comentarios: accidente.comentarios,
                // archivosAdjuntos: accidente.archivosAdjuntos,
            },
            options: {
                preview: true
            }
        }).then(response => {
            response.pipe(res)
        }).catch (error => {
            console.error('Error al generar el reporte:', error);
            res.status(500).json({ error: 'Error de servidor', details: error.message });
        })
    } catch (error) {
        console.error('Error al generar el reporte:', error);
        res.status(500).json({ error: 'Error de servidor', details: error.message });
    }
});

export default router;