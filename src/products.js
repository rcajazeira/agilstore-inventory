// products.js
class Product {
    constructor(id, name, category, quantity, price) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.quantity = parseInt(quantity);
        this.price = parseFloat(price);
    }

    // Método para exibir informações formatadas do produto

    displayInfo() {
        return `ID: ${this.id} | ${this.name} (${this.category}) | Estoque: ${this.quantity} | Preço: R$ ${this.price.toFixed(2)}`;
    }

