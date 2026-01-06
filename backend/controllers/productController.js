import prisma from '../config/db.js';
import fs from 'fs';
import path from 'path';

export const getAllProducts = async (req, res) => {
    const products = await prisma.product.findMany({ include: { category: true } });
    res.json(products);
};

export const getProductById = async (req, res) => {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    res.json(product);
};

export const createProduct = async (req, res) => {
    try {
        const { name, price, description, stock, categoryId } = req.body;
        
        const imageName = req.file ? req.file.filename : null;

        const newProduct = await prisma.product.create({
            data: {
                name,
                price: parseFloat(price),
                description,
                stock: parseInt(stock), 
                categoryId,
                image: imageName, 
            },
            include: {
                category: true
            }
        });

        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal membuat produk", error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, stock, categoryId } = req.body;
        
        const oldProduct = await prisma.product.findUnique({ where: { id } });
        if (!oldProduct) return res.status(404).json({ message: "Produk tidak ditemukan" });

        let imageName = oldProduct.image; 

        if (req.file) {
            imageName = req.file.filename;

            if (oldProduct.image) {
                const oldPath = path.join(process.cwd(), 'public/uploads/products', oldProduct.image);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: {
                name,
                price: parseFloat(price),
                description,
                stock: parseInt(stock),
                categoryId,
                image: imageName
            }
        });

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: "Product deleted" });
};