import mongoose from 'mongoose';

const conductorSchema = new mongoose.Schema({
    ci: {
        type: String,
        // required: true,
        unique: true,
    },
    // complemento: { 
    //     type:String, 
    //     required: false 
    // },
    nombre: {
        type: String,
        // required: true,
    },
    apellidoPaterno: {
        type: String,
        // required: true,
    },
    apellidoMaterno: {
        type: String,
        // required: true,
    },
    edad: {
        type: String,
        // required: true,
    },
    domicilio: {
        type: String,
        // required: true,
    },
    licencia: {
        type: String,
        // required: true,
    },
    categoria: {
        type: String,
        // required: true,
    },
    alcoholemia: {
        type: String,
        // required: true,
    },
    alcoholemiaHora: {
        type: String,
        // required: true
    },
    vehiculoCorresponeConductor: {
        type: String,
        // required: true,
    },
    fechaNacimiento: {
        type: Date,
        // required: true,
    },
    
    
    
    licDesde: { type:Date },
    licHasta: { type:Date },



}, {
    timestamps: true,
});

const Conductor = mongoose.model('Conductor', conductorSchema);

export default Conductor;
