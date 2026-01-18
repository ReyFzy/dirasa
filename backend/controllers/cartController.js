import prisma from '../config/db.js';

export const getMyCart = async (req, res) => {
  const { userId } = req.user?.id;
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true }
  });
  res.json(items);
};

export const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    
    const userId = req.user?.id; 

    if (!userId) {
      return res.status(401).json({ message: "User tidak terautentikasi" });
    }

    const existing = await prisma.cartItem.findFirst({
      where: { userId, productId }
    });

    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { qty: existing.qty + (qty || 1) }
      });
      return res.json(updated);
    }

    const newItem = await prisma.cartItem.create({
      data: { 
        qty: qty || 1,
        userId: userId, 
        productId: productId 
      }
    });
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  await prisma.cartItem.delete({ where: { id: req.params.id } });
  res.json({ message: "Item dihapus dari keranjang" });
};