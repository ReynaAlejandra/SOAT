import mongoose from 'mongoose';

const vehiculoSchema = new mongoose.Schema({
    // tipo_vehiculo: {
    //     type: String,
    //     required: true,
    // },
    marca: {
        type: String,
        // required: true,
    },
    placa: {
        type: String,
        // required: true,
        unique: true,
    },
    color: {
        type: String,
        // required: true,
    },
    modelo: {
        type: String,
        // required: true,
    },
    clase: {
        type: String,
        // required: true,
    },
    año: {
        type: Number,
        // required: true,
    },
    propietario: {
        type: String,
        // required: true,
    },
    
    
    
    empresa: { type:String },
    tipoUso: { type:String }, 



}, {
    timestamps: true,
});

const Vehiculo = mongoose.model('Vehiculo', vehiculoSchema);

export default Vehiculo;
