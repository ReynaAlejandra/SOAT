import Accidente from '../models/Accidente.js';
import fs from 'fs';
import path from 'path';

//crear nuevo accidente
export const createAccidente = async (req, res) => {
  console.log('Solicitud recibida en createAccidente:', req.method, req.url, req.body);
  
  const { hechos, vehiculos, conductores, detalle, victimas, usuario, fechaRegistro, comentarios, } = req.body;
  console.log('Datos recibidos:', req.body);

  try {

    const newAccidente = new Accidente({ 
      hechos: Array.isArray(hechos) ? hechos : [hechos], 
      vehiculos: Array.isArray(vehiculos) ? vehiculos : [vehiculos], 
      conductores: Array.isArray(conductores) ? conductores : [conductores], 
      detalle, 
      victimas: Array.isArray(victimas) ? victimas : [victimas], 
      usuario, 
      fechaRegistro,
      comentarios,
      // archivosAdjuntosCertificado: req.files.archivosAdjuntosCertificado
      // ? req.files.archivosAdjuntosCertificado.map(file => ({
      //     archivoDescripcion: 'Certificado de accidente',
      //     archivoDirectorio: file.path,
      //     archivoExtension: path.extname(file.originalname),
      //     archivoLongitud: file.size,
      //     archivoNombre: file.filename,
      //     archivoTipoContenido: file.mimetype,
      //   }))
      // : [],
      // archivosAdjuntosAnverso: req.files.archivosAdjuntosAnverso
      //   ? req.files.archivosAdjuntosAnverso.map(file => ({
      //     archivoDescripcion: 'Licencia de Conducir Anverso',
      //     archivoDirectorio: file.path,
      //     archivoExtension: path.extname(file.originalname),
      //     archivoLongitud: file.size,
      //     archivoNombre: file.filename,
      //     archivoTipoContenido: file.mimetype,
      //   }))
      // : [],
      // archivosAdjuntosReverso: req.files.archivosAdjuntosReverso
      //   ? req.files.archivosAdjuntosReverso.map(file => ({
      //     archivoDescripcion: 'Licencia de Conducir Reverso',
      //     archivoDirectorio: file.path,
      //     archivoExtension: path.extname(file.originalname),
      //     archivoLongitud: file.size,
      //     archivoNombre: file.filename,
      //     archivoTipoContenido: file.mimetype,
      //   }))
      // : [],
    });

    console.log('Nuevo accidente:', newAccidente);
    
    await newAccidente.save();
    
    // console.log('Nuevo accidente creado (no guardado aún):', newAccidente)
    console.log('Accidente guardado en la base de datos') 

    res.status(201).json(newAccidente);
  } catch (err) {
    console.error('Error al crear accidente:', err)
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

//obtener todos los accidentes
export const getAccidentes = async (req, res) => {
  try {
    const accidentes = await Accidente.find();
    res.status(200).json(accidentes);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Obtener formulario por _id
export const getFormularioById = async (req, res) => {
  try {
    const formulario = await Accidente.findById(req.params.id);
    if (!formulario) {
      return res.status(404).json({ message: 'Formulario no encontrado' });
    }
    res.json(formulario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el formulario' });
  }
};

// Actualizar formulario por ID
export const updateFormularioById = async (req, res) => {
  const { hechos, vehiculos, conductores, detalle, victimas, usuario, fechaRegistro, comentarios } = req.body;
  const { id } = req.params;

  try {
    const updatedFormulario = await Accidente.findByIdAndUpdate(id, {
      hechos,
      vehiculos,
      conductores,
      detalle,
      victimas,
      usuario,
      fechaRegistro,
      comentarios,
    }, { new: true });

    if (!updatedFormulario) {
      return res.status(404).json({ error: 'Formulario no encontrado' });
    }

    res.json(updatedFormulario);
  } catch (error) {
    console.error('Error actualizando formulario:', error);
    res.status(500).json({ error: 'Error de servidor', details: error.message });
  }
};

// Actualizar accidente
export const actualizarAccidente = async (req, res) => {
  try {
    const { id } = req.params;
    const { archivosAdjuntos, ...otrosDatos } = req.body;

    // Valida y procesa los archivos adjuntos
    const archivos = archivosAdjuntos.map((archivo) => {
      if (!archivo.archivoBase64 || !archivo.archivoNombre) {
        throw new Error('Archivo adjunto inválido.');
      }
      return archivo;
    });

    const accidenteActualizado = await Accidente.findByIdAndUpdate(
      id,
      { ...otrosDatos, archivosAdjuntos: archivos },
      { new: true }
    );

    if (!accidenteActualizado) {
      return res.status(404).json({ mensaje: 'Accidente no encontrado.' });
    }

    res.json({ mensaje: 'Accidente actualizado con éxito.', accidente: accidenteActualizado });
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};