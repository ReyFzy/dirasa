import { Router } from 'express';
import * as ctrl from '../controllers/orderController.js';
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', verifyToken, isAdmin, ctrl.getAllOrders); // Admin: Lihat semua
router.get('/my-orders', verifyToken, ctrl.getMyOrders); // User: Lihat pesanan sendiri
router.post('/checkout', verifyToken, ctrl.checkout); // User: Proses checkout
router.patch('/:id/received', verifyToken, ctrl.confirmOrderReceived); // User: Tandai SELESAI
router.patch('/status/:id', verifyToken, isAdmin, ctrl.updateOrderStatus); // Admin: Ubah ke DIANTAR

export default router;