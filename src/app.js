import express from 'express';
import exphbs from 'express-handlebars';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import ProductManager from "./managers/products.js";
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import viewsRouter from "./routes/views.router.js"

const app = express();
const PORT = 8080;

//Handlebars Config
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.set('views', "./src/views");


// Middleware
app.use(express.json());
app.use(express.static('./src/public'));
  
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

const httpServer = createServer(app);
const io = new SocketIOServer(httpServer);
const productManager = new ProductManager("./src/data/products.json");

io.on('connection', async (socket) => {
    console.log('a user connected');

    socket.emit("products", await productManager.getProducts());

    socket.on("deleteProduct", async (id) => {
        await productManager.deleteProduct(id);
        socket.emit("products", await productManager.getProducts());
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
