import Usuario from '../models/Usuario.js';

export const isAdmin = async (req, res, next) => {
  const { user } = req;
  if (!user) {
    return res.status(401).json({ message: 'Usuario no autenticado' });
  }

  try {
    const usuario = await Usuario.findById(user.id);
    if (!usuario || usuario.rol !== 'administrador') {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};
