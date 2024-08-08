const socket = io();

socket.on("products", (products) => {
    console.log(products);
    renderProducts(products);
});

const renderProducts = (products) => {
    const productsContainer = document.querySelector("#real-time-products");
    productsContainer.innerHTML = "";
    products.forEach((product) => {
        const productElement = document.createElement("div");
        productElement.innerHTML = `
            <h3>${product.title}</h3>
            <p>
                <i>${product.description}</i>
                <br />
                <b>$ ${product.price}</b>
            </p>
            <button onclick="deleteProduct(${product.id})">Delete</button>
            <hr>
        `;
        productsContainer.appendChild(productElement);
    });
}

const deleteProduct = (productId) => {
    socket.emit('deleteProduct', productId);
}