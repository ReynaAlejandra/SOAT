import Usuario from '../models/Usuario.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../auth/jwtAuth.js';

// Crear nuevo usuario
export const registerUsuario = async (req, res) => {
                                                                                          console.log('Cuerpo de la solicitud de registro:', req.body);
  const { nombre, apellidos, carnet, grado, usuario, password, rol } = req.body;

  try {
    const existingUser = await Usuario.findOne({ usuario });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUsuario = new Usuario({ 
      nombre, 
      apellidos, 
      carnet, 
      grado, 
      rol,
      usuario, 
      password: hashedPassword 
    });

    await newUsuario.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error('Error al registrar el usuario:', err);
    res.status(500).json({ message: 'Error del servidor', details: err.message });
  }
};

// Inicio de sesión
export const loginUsuario = async (req, res) => {
  const { usuario, password } = req.body;
  console.log('Intento de incio de sesión para usuario: ${usuario}');

  try {
    const user = await Usuario.findOne({ usuario });
    if (!user) {
      console.error('Usuario incorrecto')
      return res.status(401).json({ message: 'Usuario incorrecto' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.error('Contraseña incorrecta')
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = generateToken(user)
    console.log('Inicio de sesión exitoso');
    const userData = {
      usuario: user.usuario,
      nombre: user.nombre,
      apellidos: user.apellidos,
      grado: user.grado,
      rol: user.rol
    }
    res.status(200).json({ message: 'Inicio de sesión exitoso', token, userId: user._id, userData });
  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    res.status(500).json({ message: 'Error del servidor', details: err.message });
  }
};

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

// Obtener datos del usuario por ID
export const getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

// Actualizar usuario
export const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellidos, carnet, grado, usuario, rol } = req.body;

  try {
    const updatedUsuario = await Usuario.findByIdAndUpdate(id, { nombre, apellidos, carnet, grado, usuario, rol }, { new: true });
    
    if (!updatedUsuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario actualizado exitosamente', usuario: updatedUsuario });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error del servidor', details: error.message });
  }
};

// Eliminar usuario por ID
export const deleteUsuario = async (req, res) => {
  const userId = req.params.id;

  try {
    const usuario = await Usuario.findByIdAndDelete(userId);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};