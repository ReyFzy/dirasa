import { Router } from 'express';
import * as ctrl from '../controllers/favoriteController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', verifyToken, ctrl.getMyFavorites);
router.post('/toggle', verifyToken, ctrl.toggleFavorite);

export default router;