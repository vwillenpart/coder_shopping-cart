import fs from 'fs';

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.lastID = 0;

        this.loadCarts();
    }

    newCart() {
        const newCart = {
            id: ++this.lastID,
            products: []
        }
        this.carts.push(newCart);
        this.saveCarts();
        return newCart;
    }

    async loadCarts() {
        try {
            const response = await fs.promises.readFile(this.path, "utf-8");
            this.carts = JSON.parse(response);
            if (this.carts.length > 0) {
                this.lastID = Math.max(...this.carts.map(cart => cart.id));
            }
        }
        catch (error) {
            console.error(error);
            await this.saveCarts();
            return [];
        }
    }

    async saveCarts(newCartsArray = this.carts) {

        try {
            fs.writeFile(this.path, JSON.stringify(newCartsArray, null, 2), (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                } else {
                    console.log('File written successfully');
                }
            });
        }
        catch (error) {
            console.error(error);
        }
    }

    async getCartbyID(id) {
        try {
            const cart = this.carts.find(cart => cart.id === id);
            return cart;
        }
        catch (error) {
            console.error(error);
        }
    }

    async addProductToCart(cartID, productID, quantity = 1) {
        const cart = await this.getCartbyID(cartID);
        const existingProduct = cart.products.find(product => product.id === productID);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        }
        else {
            cart.products.push({
                id: productID,
                quantity
            });
        }
        await this.saveCarts();
        return cart;
    }
}

export default CartManager;