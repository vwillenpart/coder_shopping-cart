import express from "express";

const app = express();

const PORT = 8080;

import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"

app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, ()=> {
    console.log(`Listening port :${PORT}`)
})