import { Request, Response } from "express";
import * as productService from "./product.service";

export const getProducts = async (req: Request, res: Response) => {
    try {
        const { search } = req.query;

        if (search && typeof search === 'string') {
            const products = await productService.searchProducts(search);
            res.json(products);
        } else {
            const products = await productService.getAllProducts();
            res.json(products);
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: "Failed to create product" });
    }
};

export const getProduct = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id || "");
        const product = await productService.getProductById(id);
        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch product" });
    }
};
