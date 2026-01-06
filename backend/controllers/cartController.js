import prisma from '../config/db.js';

export const getMyCart = async (req, res) => {
  const { userId } = req.params;
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true }
  });
  res.json(items);
};

export const addToCart = async (req, res) => {
  const { userId, productId, qty } = req.body;
  
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
    data: { userId, productId, qty: qty || 1 }
  });
  res.status(201).json(newItem);
};

export const removeFromCart = async (req, res) => {
  await prisma.cartItem.delete({ where: { id: req.params.id } });
  res.json({ message: "Item dihapus dari keranjang" });
};