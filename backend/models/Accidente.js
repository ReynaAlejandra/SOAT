import { yearsToQuarters } from 'date-fns';
import mongoose from 'mongoose';

const { Schema } = mongoose

const HechosSchema = new Schema({
  casoNumero: { type:String },
  denunciante: { type:String },
  diaHoraFecha: { type:String },
  naturaleza: { type:String },
  departamento: { type:String },
  estacionPolicial: { type:String },
  lugar: { type:String },
})
const VictimaSchema = new Schema({
  auxiliado: { type:String },
  nombre: { type:String },
  ci: { type:String },
  fallecidoHerido: { type:String },
  tipoVictima: { type:String },
  vehiculoCorrespondeVictima: { type:String },
  edad: { type:String },
  domicilio: { type:String },
  // complemento: { type:String, required: false },
})
const VehiculoSchema = new Schema({
  color: { type:String },
  empresa: { type:String },
  marca: { type:String },
  placa: { type:String },
  tipoUso: { type:String },
  modelo: { type:String },
  clase: { type:String }
})
const ConductorSchema = new Schema({
  categoria: { type:String },
  ci: { type:String },
  // complemento: { type:String, required: false },
  domicilio: { type:String },
  edad: { type:Number },
  licencia: { type:String },
  nombre: { type:String },
  alcoholemia: { type:String },
  licDesde: { type:Date },
  licHasta: { type:Date },
  alcoholemiaHora: { type: String },
  vehiculoCorrespondeConductor: { type:String }
})

// const ArchivoAdjuntoCertificadoSchema = new mongoose.Schema({
//   archivoDescripcion: { type: String, required: false },
//   archivoDirectorio: { type: String },
//   archivoExtension: { type: String },
//   archivoLongitud: { type: Number },
//   archivoNombre: { type: String, required: true },
//   archivoTipoContenido: { type: String },
// });

// const ArchivoAdjuntoAnversoSchema = new mongoose.Schema({
//   archivoDescripcion: { type: String, required: false },
//   archivoDirectorio: { type: String },
//   archivoExtension: { type: String },
//   archivoLongitud: { type: Number },
//   archivoNombre: { type: String, required: true },
//   archivoTipoContenido: { type: String },
// });

// const ArchivoAdjuntoReversoSchema = new mongoose.Schema({
//   archivoDescripcion: { type: String, required: false },
//   archivoDirectorio: { type: String },
//   archivoExtension: { type: String },
//   archivoLongitud: { type: Number },
//   archivoNombre: { type: String, required: true },
//   archivoTipoContenido: { type: String },
// });

const AccidenteSchema = new Schema({
  hechos: [HechosSchema],
  vehiculos: [VehiculoSchema],
  conductores: [ConductorSchema],
  victimas: [VictimaSchema],
  detalle: { type: String },
  usuario: { type: String },
  fechaRegistro: { type: Date, default: Date.now },
  comentarios: { type: String },
  // archivosAdjuntosCertificado: [ArchivoAdjuntoCertificadoSchema],
  // archivosAdjuntosAnverso: [ArchivoAdjuntoAnversoSchema],
  // archivosAdjuntosReverso: [ArchivoAdjuntoReversoSchema],
},
{ collection: 'accidentes' });

const Accidente = mongoose.model('Accidente', AccidenteSchema);

export default Accidente;