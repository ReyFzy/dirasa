import { Router } from 'express';
import * as ctrl from '../controllers/userController.js';
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js'

const router = Router();

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/', verifyToken, isAdmin, ctrl.getAllUsers); 
router.put('/role/:id', verifyToken, isAdmin, ctrl.updateUserRole);
router.delete('/:id',  verifyToken, isAdmin, ctrl.deleteUser);

export default router;