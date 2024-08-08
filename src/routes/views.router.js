import { Router } from "express";

const router = Router(); 

import ProductManager from "../managers/products.js";

const productManager = new ProductManager("./src/data/products.json");

router.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(404);
    }
})

router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
});

export default router;