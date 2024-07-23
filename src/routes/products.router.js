import { Router } from "express";

const router = Router(); 

import ProductManager from "../managers/products.js";

const manager = new ProductManager("./src/data/products.json");

// List all products 
// http://localhost:8080/api/products

router.get("/", async (req, res) => {
    const limit = req.query.limit;
    try {
        const products = await manager.getProducts();
        if (limit) {
            res.send(products.slice(0, limit));
        } else {
            res.send(products);
        }
    } catch (error) {
        res.status(404);
    }
})

// Get product by ID
// http://localhost:8080/api/products/ID

router.get("/:pid", async (req, res) => {
    let productID = parseInt(req.params.pid); 
    try {
        const productItem = await manager.getProductById(productID);
        res.send(productItem);
    }
    catch (error) {
        console.log(error);
        res.status(404).send(`Couldn't get product by ID ${productID} due to an error, please look at the console for more information`);
    }
})

// Add new product
// http://localhost:8080/api/products
// with the following structure:
//
// * id: Number/String
// * title:String,
// * description:String
// * code:String
// * price:Number
// * status:Boolean
// * stock:Number
// * category:String
// * thumbnails:Array of Strings

router.post("/", async (req, res) => {
    const newProduct = req.body;
    try {
        await manager.addProduct(newProduct);
        res.status(201).send(`New product added ${newProduct.title}`);
    }
    catch (error) {
        console.log(error);
        res.status(400).send("Couldn't add product due to an error, please look at the console for more information");   
    }
})

// Update product by ID
// http://localhost:8080/api/products/ID

router.put("/:pid", async (req, res) => {
    let productID = parseInt(req.params.pid); 
    let updatedProduct = req.body; 
    try {
        await manager.updateProduct(productID, updatedProduct);
        res.send(updatedProduct);
    }
    catch (error) {
        console.log(error);
        res.status(400).send("Couldn't update product due to an error, please look at the console for more information");   
    }
})

// Delete product by ID
// http://localhost:8080/api/products/ID

router.delete("/:pid", async (req, res) => {
    let productID = parseInt(req.params.pid); 
    try {
        await manager.deleteProduct(productID);
        return res.send(`Product with ID: ${productID} deleted successfully.`); 
    }
    catch (error) {
        console.log(error);
        res.status(400).send("Couldn't delete product due to an error, please look at the console for more information");   
    }
})

export default router;