import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const toggleFavorite = async (req, res) => {
  try {
    const productId = req.body.productId;
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "User tidak terautentikasi" });
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: productId
        }
      }
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: {
          userId_productId: {
            userId: userId,
            productId: productId
          }
        }
      });
      return res.status(200).json({ message: "Dihapus dari favorit" });
    } else {
      await prisma.favorite.create({
        data: {
          userId: userId,
          productId: productId
        }
      });
      return res.status(201).json({ message: "Ditambahkan ke favorit" });
    }
  } catch (error) {
    console.error("Error toggleFavorite:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const getMyFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await prisma.favorite.findMany({
      where: { userId: userId },
      include: {
        product: true 
      }
    });
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};