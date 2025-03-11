import mongoose from 'mongoose';

const { Schema } = mongoose

const UsuarioSchema = new Schema({
  nombre: { 
    type: String, 
    required: true 
  },
  apellidos: { 
    type: String, 
    required: true 
  },
  carnet: { 
    type: String, 
    required: true, 
    unique: true 
  },
  grado: { 
    type: String, 
    required: true 
  },
  rol: {
    type: String,
    enum: ['usuario', 'administrador'],
    default: 'usuario'
  },
  usuario: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  }
}, { timestamps: true } );

const Usuario = mongoose.model('Usuario', UsuarioSchema);

export default Usuario;