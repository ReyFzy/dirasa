import prisma from '../config/db.js';

export const getAllOrders = async (req, res) => {
  const orders = await prisma.order.findMany({ include: { items: true, user: true } });
  res.json(orders);
};

export const createOrder = async (req, res) => {
  const { userId, items } = req.body; // items: [{productId, qty, price}]
  const total = items.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const order = await prisma.order.create({
    data: {
      userId,
      totalPrice: total,
      items: { create: items }
    }
  });
  res.status(201).json(order);
};

export const updateOrderStatus = async (req, res) => {
  console.log("Request masuk ke updateOrderStatus!");
  console.log("ID:", req.params.id);
  console.log("Status baru:", req.body.status);
  
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: req.body.status }
    });
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal update status database" });
  }
};

export const confirmOrderReceived = async (req, res) => {
  const { id } = req.params;
  
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status: 'SELESAI' }
    });
    res.json({ message: "Pesanan telah diterima oleh pembeli", data: order });
  } catch (error) {
    res.status(400).json({ error: "Gagal memperbarui status" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil riwayat" });
  }
};

export const checkout = async (req, res) => {
  try {
    const { items, totalPrice, note, tableNumber } = req.body; 
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Keranjang kosong" });
    }

    const order = await prisma.order.create({
      data: {
        userId,
        totalPrice,
        status: "ANTRE",
        note,           
        tableNumber,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            qty: item.qty,
            price: item.price,
          })),
        },
      },
    });

    res.status(201).json({ message: "Checkout Berhasil", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};