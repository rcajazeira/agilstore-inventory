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

      // Método para exibir em formato de tabela
    toTableRow() {
        return {
            id: this.id,
            name: this.name,
            category: this.category,
            quantity: this.quantity,
            price: `R$ ${this.price.toFixed(2)}`
        };
    }
}

// Classe para gerenciar produtos
class ProductManager {
    constructor() {
        this.products = [];
        this.nextId = 1;
    }

// Exporta a classe
module.exports = Product;

