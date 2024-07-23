import { Router } from "express";
const router = Router(); 

import CartsManager from "../managers/carts.js";

const manager = new CartsManager("./src/data/carts.json");

// Create a new cart 
// http://localhost:8080/api/carts
// with the following structure:
// * Id:Number/String 
// * products: Array of objects

router.post("/", async (req, res) => {
    try {
        const newCart = await manager.newCart();
        res.json(newCart);
    }
    catch (error) {
        console.log(error);
        res.status(400).send("Couldn't create new cart, please look at the console for more information");
    }
})

// List all products in a cart
// http://localhost:8080/api/carts/CART_ID

router.get("/:cid", async (req, res) => {
    let cartID = parseInt(req.params.cid);
    try {
        const cartItem = await manager.getCartbyID(cartID);
        res.send(cartItem.products);
    }
    catch (error) {
        console.log(error);
        res.status(400).send("Couldn't list products in a cart due to an error, please look at the console for more information"); 
    }
}
)

// Add a product to a cart by passing the cart ID, the product ID, and the quantity
// http://localhost:8080/api/carts/CART_ID/product/PRODUCT_ID
// if the quantity is not provided, it will default to 1
// if the product ID is already in the cart, it will increase the quantity by the quantity provided.

router.post("/:cid/product/:pid", async (req, res) => {
    let cartID = parseInt(req.params.cid);
    let productID = parseInt(req.params.pid);
    let quantity = req.body.quantity || 1;
    try {
        const cartItem = await manager.addProductToCart(cartID, productID, quantity);
        res.send(cartItem);
    }
    catch (error) {
        res.status(400).send("Couldn't add products due to an error, please look at the console for more information"); 
    }
})


export default router;