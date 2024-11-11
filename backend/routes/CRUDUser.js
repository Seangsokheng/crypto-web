import express from'express';
import user from '../controllers/userController.js';
const router = express.Router();
import multer from 'multer';
import path from 'path';


// Set storage for uploaded files
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Save files to "uploads" directory
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Create a unique filename
//     }
// });

// const upload = multer({ storage: storage });
router.get('/user',user.viewUser);
router.patch('/updateuser', user.updateUser);
router.post('/deleteuser', user.deleteUser);

export default router;