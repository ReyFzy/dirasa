import prisma from '../config/db.js';

export const getAllCategories = async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
};

export const createCategory = async (req, res) => {
  const category = await prisma.category.create({ data: { name: req.body.name } });
  res.status(201).json(category);
};

export const deleteCategory = async (req, res) => {
  await prisma.category.delete({ where: { id: req.params.id } });
  res.json({ message: "Category deleted" });
};