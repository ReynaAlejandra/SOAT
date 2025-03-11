import express from 'express'
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import cors from 'cors'
import session from 'express-session';
import MongoStore from 'connect-mongo';
import morgan from 'morgan';
import axios from 'axios'
import multer from 'multer';
import path from 'path';

import Accidente from './models/Accidente.js';

import accidenteRoutes from './routes/accidente.js'
import usuarioRoutes from './routes/usuario.js'
import vehiculoRoutes from './routes/vehiculos.js'
import conductorRoutes from './routes/conductores.js'
import victimaRoutes from './routes/victimas.js'
// import authenticateJWT from './middleware/auth.js'

dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
// app.use(morgan('dev'))
app.use(morgan('combined'))
app.use(cors())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/accidentes')
//mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Configuración de Sesiones
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    secure: false, // Solo usar HTTPS en producción
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 día
  }
}));

// Almacenamiento local de datos
const localData = {
  conductores: [],
  victimas: [],
  vehiculos: [],
  // archivosAdjuntos: []
};

// Ruta para buscar un vehículo por su placa
app.post('/api/ConsultaVehiculo/ServicioMinGob', async (req, res) => {
  const { placa } = req.body;

  try {
    const response = await axios.post('https://srvweb.policiadnfr.gob.bo/api/ConsultaVehiculo/ServicioMinGob', null, {
      params: {
        contrasenia: 'd1u4EeXYnp8Xy5h2xWbTz4o0X8EfUhihOwF7Ejd9wrJYQNXkbzCVG7PU7AWndEMDJujblbUcQnO884pdlEMA==',
        usuario: 'MinGobDNFRServicio',
        token_key_MG: 'P7ehC5HPARluSshmhjb4rmfULceEqO0ku5QhT5iXs3YAMlEUiEbYd6CwQKKrb2RvoT4hHz1Hw6Pm8pRMbshjw==',
        placa: placa
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar vehículo', error: error.message });
  }
});

//Ruta para buscar conductores por ci
app.post('/segip_service', async (req, res) => {
  const { ced, com, nom, pat, mat, fnac } = req.body;

  // Configurar la solicitud a SEGIP
  if (!ced) {
    return res.status(400).json({ respuesta: 'Variables no definidas' });
  }

  try {
    const https = await import('https');
    const response = await axios.post('https://10.0.0.93/segip_service', {
      ced,
      com,
      nom,
      pat,
      mat,
      fnac
    }, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InNpZy1ycy0wIn0.eyJ1c2VyIjoic29hdCIsInNlcnZpY2UiOiJDZXJ0aWZpY2FkbyBkZSBBY2NpZGVudGVzIGRlIFRyw6Fuc2l0byBTT0FUIiwiaWF0IjoxNzE5NDA3NzI5LCJhdWQiOiJTZXJ2aWNpbyBkZSBJZGVudGlmaWNhY2lvbiBkZSBQZXJzb25hcyIsImlzcyI6Ik1pbmlzdGVyaW8gZGUgR29iaWVybm8ifQ.YmXEQ8LpgNQxsURar6wK6bumB0VJA4ZG6JtqDWjbaNoNGj5Qjs7LHBXeedjHb4BxFj6jgIlpp71r2cjFxlqfehnsVUqNLtqyCz6FmGsiImNJl_Gw-Ll_4Z86Dkjn0X3HGpsG69scUztEW4kC8U1LtlsUnJ7jb6O2cIblcmR1NUQ',
        'Content-Type': 'application/json',
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error al consultar el srvicio SEGIP:', error);
    res.status(500).json({ error: 'Error al consultar el servicio SEGIP', details: error.message });
  }
});

// Endpoint para conductores
app.post('/api/conductores', (req, res) => {
  const conductor = req.body;
  localData.conductores.push(conductor);
  res.status(201).json(conductor);
});

// Endpoint para víctimas
app.post('/api/victimas', (req, res) => {
  const victima = req.body;
  localData.victimas.push(victima);
  res.status(201).json(victima);
  res.send('Vehiculo guardado')
});

// Endpoint para vehículos
app.post('/api/vehiculos', (req, res) => {
  const vehiculo = req.body;
  localData.vehiculos.push(vehiculo);
  res.status(201).json(vehiculo);
});

// Endpoint para manejar el error PayloadTooLargeError
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 413 && 'body' in err) {
    res.status(413).json({ error: 'Payload Too Large' });
  }
});

// Endpoint para guardar un accidente
app.post('/api/accidentes', async (req, res) => {
  const datosFormulario = req.body;
  // console.log(datosFormulario);
  console.log('Datos recibidos:', datosFormulario);
  if (req.body.archivosAdjuntos) {
    console.log("Archivos adjuntos:", req.body.archivosAdjuntos);
  } else {
    console.log("No se recibieron archivos adjuntos");
  }

  try {
    const nuevoAccidente = new Accidente(datosFormulario);
    await nuevoAccidente.save();
    res.status(200).json({ mensaje: 'Formulario enviado exitosamente' });
  } catch (error) {
    console.error('Error al guardar el accidente:', error);
    res.status(500).json({ mensaje: 'Error al enviar el formulario' });
  }
});

//endpoint para obtener todos los accidentes
app.get('/api/accidentes', async (req, res) => {
  try {
    const accidentes = await Accidente.find();

    accidentes.forEach(accidente => {
      accidente.hechos.forEach(hecho => {
        console.log('Caso Numero:', hecho.casoNumero);
        console.log('Día, hora y fecha:', hecho.diaHoraFecha);
        console.log('Denunciante:', hecho.denunciante);
      })
      accidente.vehiculos.forEach(vehiculo => {
        console.log('Placas de los vehículos involucrados:', vehiculo.placa);
      })
      accidente.conductores.forEach(conductor => {
        console.log('CI de los conductores involucrados:', conductor.ci);
      })
    })

    res.json(accidentes);
  } catch (error) {
    console.error('Error al obtener accidentes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});









// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Carpeta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único para evitar conflictos
  }
});

// Filtros para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes.'), false);
  }
};

// Middleware de carga
const upload = multer({ storage, fileFilter });












// Usar rutas
app.use('/api/vehiculos', vehiculoRoutes)
app.use('/api/conductores', conductorRoutes)
app.use('/api/victimas', victimaRoutes)
app.use('/api/accidentes', accidenteRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 