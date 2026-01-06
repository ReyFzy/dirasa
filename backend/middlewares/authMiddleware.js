import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: "Token diperlukan" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_anda');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token tidak valid" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ message: "Akses ditolak: Hanya Admin" });
  next();
};