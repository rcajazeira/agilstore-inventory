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

      // 1. ADICIONAR PRODUTO
    addProduct(name, category, quantity, price) {
        const id = this.nextId++;
        const product = new Product(id, name, category, quantity, price);
        this.products.push(product);
        return product;
    }

    // 2. LISTAR TODOS OS PRODUTOS
    getAllProducts() {
        return this.products;
    }

     // 3. BUSCAR PRODUTO POR ID
    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    // 4. BUSCAR PRODUTO POR NOME (parcial)
    searchProductByName(searchTerm) {
        return this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

     // 5. ATUALIZAR PRODUTO
    updateProduct(id, updates) {
        const product = this.getProductById(id);
        if (!product) return null;

        // Atualiza apenas os campos fornecidos
        if (updates.name) product.name = updates.name;
        if (updates.category) product.category = updates.category;
        if (updates.quantity) product.quantity = parseInt(updates.quantity);
        if (updates.price) product.price = parseFloat(updates.price);

        return product;
    }

     // 6. EXCLUIR PRODUTO
    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index === -1) return false;
        
        this.products.splice(index, 1);
        return true;
    }

       // 7. LISTAR POR CATEGORIA
    getProductsByCategory(category) {
        return this.products.filter(product => 
            product.category.toLowerCase() === category.toLowerCase()
        );
    }

     // 8. ORDENAR PRODUTOS
    sortProducts(by = 'name', order = 'asc') {
        const sorted = [...this.products];
        
        sorted.sort((a, b) => {
            let aValue, bValue;
            
            switch(by) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'quantity':
                    aValue = a.quantity;
                    bValue = b.quantity;
                    break;
                case 'price':
                    aValue = a.price;
                    bValue = b.price;
                    break;
                default:
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
            }
            
            if (order === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
        
        return sorted;
    }
}

// Exporta ambas as classes
module.exports = { Product, ProductManager };