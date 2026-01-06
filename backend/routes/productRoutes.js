import { Router } from 'express';
import * as ctrl from '../controllers/productController.js';
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js';
import { uploadProductImage } from '../middlewares/uploadMiddleware.js';

const router = Router();

router.get('/', ctrl.getAllProducts);
router.get('/:id', ctrl.getProductById);
router.post('/', uploadProductImage.single('image'), verifyToken, isAdmin, ctrl.createProduct); // Admin
router.put('/:id', uploadProductImage.single('image'), verifyToken, isAdmin, ctrl.updateProduct); // Admin
router.delete('/:id', verifyToken, isAdmin, ctrl.deleteProduct); // Admin

export default router;