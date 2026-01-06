import prisma from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_anda';

export const register = async (req, res) => {
  const { email, password, name, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, role: role || 'USER' }
    });
    res.status(201).json({ message: "User berhasil dibuat", user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(400).json({ error: "Email sudah terdaftar" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User tidak ditemukan" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Password salah" });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: "Login berhasil", token, role: user.role, userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    include: { favorites: true, orders: true }
  });
  res.json(user);
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data user", error: error.message });
    }
};

export const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body; 

    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { role }
        });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengubah role", error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        await prisma.user.delete({
            where: { id }
        });

        res.status(200).json({ message: "User berhasil dihapus" });
    } catch (error) {
        console.error("ERROR BE:", error); 

        if (error.code === 'P2003') {
            return res.status(400).json({ 
                message: "Gagal menghapus! User ini memiliki riwayat transaksi/order. Hapus data transaksi terlebih dahulu." 
            });
        }

        res.status(500).json({ message: "Internal Server Error", detail: error.message });
    }
};