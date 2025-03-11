// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './uploads/'); // Cambia la ruta según tus necesidades
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}_${file.originalname}`);
//   },
// });

// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     const filetypes = /jpeg|jpg|png/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);

//     if (extname && mimetype) {
//       cb(null, true);
//     } else {
//       cb(new Error('Solo se permiten imágenes'));
//     }
//   },
// });

// export default upload;

