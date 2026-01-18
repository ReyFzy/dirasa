import { Router } from 'express';
import * as ctrl from '../controllers/cartController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', verifyToken, ctrl.getMyCart);
router.post('/', verifyToken, ctrl.addToCart);
router.delete('/:id', verifyToken, ctrl.removeFromCart);

export default router;