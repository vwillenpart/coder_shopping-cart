import fs from 'fs';
class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.lastID = 0;

        this.loadProducts();
    }

    async addProduct(product) {
        const {title, description, code, price, stock, thumbnails} = product;

        if ( !title || !description || !price || !code || !stock ) {
            console.log("All fields are required"); 
            return; 
        }
        if ( this.products.some( item => item.code === code ) ) {
            console.log("Product code must be unique"); 
            return; 
        }
        const newId = this.products.reduce((maxId, item) => item && item.id > maxId ? item.id : maxId, 0) + 1;

        const newProduct = {
            id: ++this.lastID,
            title,
            description,
            price,
            thumbnails,
            code, 
            stock
        }

        this.products.push(newProduct);
        this.saveProducts();
        return newProduct;
    }

    async loadProducts() {
        try {
            const response = await fs.promises.readFile(this.path, "utf-8");
            this.products = JSON.parse(response);
            if (this.products.length > 0) {
                this.lastID = Math.max(...this.products.map(product => product.id));
            }
            return this.products;
        }
        catch (error) {
            console.error(error);
            await this.saveProducts();
            return [];
        }
    }

    async saveProducts(newProductsArray = this.products) {
        try {
            fs.writeFile(this.path, JSON.stringify(newProductsArray, null, 2), (err) => {
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

    async getProducts() {
        return this.products;
    }

    async getProductById(productID) {
        try {
            const existingProducts = await this.loadProducts(); 
            const productItem = existingProducts.find(item => item.id === productID); 
            if (!productItem) {
                console.log(`Product with ID: ${productID} not found.`); 
                return null; 
            } else {
                console.log(`Product with ID: ${productID} found.`); 
                return productItem; 
            }
        } catch (error) {
            console.log("Error", error); 
        }
    }

    async updateProduct(productID, updatedProduct) {
        try {
            const existingProducts = await this.loadProducts(); 
            const productIndex = existingProducts.findIndex(product => product.id == productID);
            if(productIndex !== -1) {
                existingProducts[productIndex] = {...existingProducts[productIndex], ...updatedProduct}; 
                await this.saveProducts(existingProducts); 
                console.log(`Product with ID: ${productID} updated successfully.`); 
            } else {
                console.log(`Product with ID: ${productID} not found.`); 
            }
        } catch (error) {
            console.log("Error updating product: ", error); 
        }
    }

    async deleteProduct(productID) {
        try {
            const existingProducts = await this.loadProducts(); 
            const productIndex = existingProducts.findIndex(product => product.id == productID);

            if(productIndex !== -1) {
                existingProducts.splice(index, 1); 
                await this.saveProducts(existingProducts); 
                console.log(`Product with ID: ${productID} deleted successfully.`); 
            } else {
                console.log(`Product with ID: ${productID} not found.`); 
            }
        } catch (error) {
            console.log("Error deleting product; ", error); 
        }
    }
}

export default ProductManager; 