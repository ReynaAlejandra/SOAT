import mongoose from 'mongoose';

const victimaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        // required: true,
    },
    ci: {
        type: String,
        // required: true,
        unique: true,
    },
    // complemento: { 
    //     type:String, 
    //     required: false 
    // },
    edad: {
        type: String,
        // required: true,
    },
    domicilio: {
        type: String,
        // required: true,
    },
    fallecidoHerido: {
        type: String,
        // required: true,
    },
    tipoVictima: {
        type: String,
        // required: true,
    },
    vehiculoCorrespondeVictima: {
        type: String,
        // required: true,
    },
    auxiliado: {
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
    fechaNacimiento: {
        type: Date,
        // required: true,
    },
}, {
    timestamps: true,
});

const Victima = mongoose.model('Victima', victimaSchema);

export default Victima;
