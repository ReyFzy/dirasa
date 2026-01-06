import { Router } from 'express';
import * as ctrl from '../controllers/categoryController.js';
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', ctrl.getAllCategories);
router.post('/', verifyToken, isAdmin, ctrl.createCategory);
router.delete('/:id', verifyToken, isAdmin, ctrl.deleteCategory);

export default router;