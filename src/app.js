// src/app.js
const prompt = require('prompt-sync')();
const { ProductManager } = require('./products.js');
const { saveToJSON, loadFromJSON } = require('./database.js');

// Cores para terminal (opcional, mas fica mais bonito)
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    red: '\x1b[31m'
};

class AgilStoreApp {
    constructor() {
        this.productManager = new ProductManager();
        this.loadData();
    }

    // Carrega dados do JSON
    loadData() {
        const loadedProducts = loadFromJSON();
        if (loadedProducts && loadedProducts.length > 0) {
            this.productManager.products = loadedProducts;
            // Encontra o maior ID para continuar a numeração
            const maxId = Math.max(...loadedProducts.map(p => p.id));
            this.productManager.nextId = maxId + 1;
            console.log(`${colors.green}✓ Dados carregados: ${loadedProducts.length} produtos${colors.reset}`);
        }
    }

    // Salva dados no JSON
    saveData() {
        saveToJSON(this.productManager.products);
        console.log(`${colors.green}✓ Dados salvos com sucesso!${colors.reset}`);
    }

    // Limpa a tela do console
    clearScreen() {
        console.clear();
    }

    // Exibe o cabeçalho
    showHeader() {
        this.clearScreen();
        console.log(`${colors.cyan}===============================================${colors.reset}`);
        console.log(`${colors.bright}${colors.magenta}      AGILSTORE - GERENCIAMENTO DE INVENTÁRIO${colors.reset}`);
        console.log(`${colors.cyan}===============================================${colors.reset}\n`);
    }

    // Menu principal
    showMenu() {
        this.showHeader();
        console.log(`${colors.yellow}MENU PRINCIPAL:${colors.reset}`);
        console.log(`${colors.green}1.${colors.reset} Adicionar novo produto`);
        console.log(`${colors.green}2.${colors.reset} Listar todos os produtos`);
        console.log(`${colors.green}3.${colors.reset} Buscar produto`);
        console.log(`${colors.green}4.${colors.reset} Atualizar produto`);
        console.log(`${colors.green}5.${colors.reset} Excluir produto`);
        console.log(`${colors.green}6.${colors.reset} Filtrar por categoria`);
        console.log(`${colors.green}7.${colors.reset} Ordenar produtos`);
        console.log(`${colors.green}0.${colors.reset} Sair`);
        console.log(`${colors.cyan}-----------------------------------------------${colors.reset}`);
    }

    // Formata e exibe tabela de produtos
    displayProductsTable(products) {
        if (products.length === 0) {
            console.log(`${colors.yellow}Nenhum produto encontrado.${colors.reset}`);
            return;
        }

        console.log(`${colors.cyan}══════════════════════════════════════════════════════════════════════════════════════════════${colors.reset}`);
        console.log(`${colors.bright}ID   NOME                             CATEGORIA          ESTOQUE   PREÇO${colors.reset}`);
        console.log(`${colors.cyan}══════════════════════════════════════════════════════════════════════════════════════════════${colors.reset}`);

        products.forEach(product => {
            const idStr = product.id.toString().padEnd(4);
            const nameStr = (product.name.length > 30 ? product.name.substring(0, 27) + '...' : product.name).padEnd(32);
            const categoryStr = (product.category.length > 15 ? product.category.substring(0, 12) + '...' : product.category).padEnd(18);
            const quantityStr = product.quantity.toString().padEnd(8);
            const priceStr = `R$ ${product.price.toFixed(2)}`;

            console.log(`${colors.green}${idStr}${colors.reset} ${nameStr} ${categoryStr} ${quantityStr} ${colors.yellow}${priceStr}${colors.reset}`);
        });

        console.log(`${colors.cyan}══════════════════════════════════════════════════════════════════════════════════════════════${colors.reset}`);
        console.log(`Total: ${products.length} produto(s)\n`);
    }

    // 1. Adicionar produto
    addProduct() {
        this.showHeader();
        console.log(`${colors.yellow}ADICIONAR NOVO PRODUTO:${colors.reset}\n`);

        const name = prompt('Nome do produto: ').trim();
        if (!name) {
            console.log(`${colors.red}Nome é obrigatório!${colors.reset}`);
            prompt('Pressione Enter para continuar...');
            return;
        }

        const category = prompt('Categoria: ').trim() || 'Geral';
        const quantity = parseInt(prompt('Quantidade em estoque: ')) || 0;
        const price = parseFloat(prompt('Preço (R$): ').replace(',', '.')) || 0.0;

        const product = this.productManager.addProduct(name, category, quantity, price);
        
        console.log(`\n${colors.green}✓ Produto adicionado com sucesso!${colors.reset}`);
        console.log(`ID: ${colors.bright}${product.id}${colors.reset} | ${product.name} | Estoque: ${product.quantity} | Preço: R$ ${product.price.toFixed(2)}`);
        
        this.saveData();
        prompt('\nPressione Enter para continuar...');
    }

    // 2. Listar todos os produtos
    listProducts() {
        this.showHeader();
        console.log(`${colors.yellow}TODOS OS PRODUTOS CADASTRADOS:${colors.reset}\n`);
        
        const products = this.productManager.getAllProducts();
        this.displayProductsTable(products);
        
        prompt('Pressione Enter para continuar...');
    }

    // 3. Buscar produto
    searchProduct() {
        this.showHeader();
        console.log(`${colors.yellow}BUSCAR PRODUTO:${colors.reset}\n`);
        console.log(`${colors.green}1.${colors.reset} Buscar por ID`);
        console.log(`${colors.green}2.${colors.reset} Buscar por nome`);
        console.log(`${colors.green}0.${colors.reset} Voltar`);

        const option = prompt('\nEscolha uma opção: ');

        switch(option) {
            case '1':
                const id = parseInt(prompt('Digite o ID do produto: '));
                const productById = this.productManager.getProductById(id);
                
                if (productById) {
                    console.log(`\n${colors.green}✓ Produto encontrado:${colors.reset}`);
                    console.log(`${colors.cyan}--------------------------------${colors.reset}`);
                    console.log(`ID: ${productById.id}`);
                    console.log(`Nome: ${productById.name}`);
                    console.log(`Categoria: ${productById.category}`);
                    console.log(`Quantidade: ${productById.quantity}`);
                    console.log(`Preço: R$ ${productById.price.toFixed(2)}`);
                    console.log(`${colors.cyan}--------------------------------${colors.reset}`);
                } else {
                    console.log(`${colors.red}✗ Produto com ID ${id} não encontrado.${colors.reset}`);
                }
                break;

            case '2':
                const searchTerm = prompt('Digite parte do nome: ').trim();
                const products = this.productManager.searchProductByName(searchTerm);
                
                console.log(`\n${colors.green}Resultados para "${searchTerm}":${colors.reset}`);
                this.displayProductsTable(products);
                break;

            case '0':
                return;
        }

        prompt('\nPressione Enter para continuar...');
    }

    // 4. Atualizar produto
    updateProduct() {
        this.showHeader();
        console.log(`${colors.yellow}ATUALIZAR PRODUTO:${colors.reset}\n`);

        const id = parseInt(prompt('Digite o ID do produto a atualizar: '));
        const product = this.productManager.getProductById(id);

        if (!product) {
            console.log(`${colors.red}✗ Produto com ID ${id} não encontrado.${colors.reset}`);
            prompt('\nPressione Enter para continuar...');
            return;
        }

        console.log(`\n${colors.green}Produto encontrado:${colors.reset}`);
        console.log(`1. Nome: ${product.name}`);
        console.log(`2. Categoria: ${product.category}`);
        console.log(`3. Quantidade: ${product.quantity}`);
        console.log(`4. Preço: R$ ${product.price.toFixed(2)}`);
        console.log(`${colors.yellow}0. Cancelar${colors.reset}`);

        const field = prompt('\nQual campo deseja atualizar? (1-4): ');

        const updates = {};
        switch(field) {
            case '1':
                updates.name = prompt('Novo nome: ').trim();
                break;
            case '2':
                updates.category = prompt('Nova categoria: ').trim();
                break;
            case '3':
                updates.quantity = parseInt(prompt('Nova quantidade: '));
                break;
            case '4':
                updates.price = parseFloat(prompt('Novo preço (R$): ').replace(',', '.'));
                break;
            case '0':
                console.log(`${colors.yellow}Operação cancelada.${colors.reset}`);
                prompt('\nPressione Enter para continuar...');
                return;
            default:
                console.log(`${colors.red}Opção inválida!${colors.reset}`);
                prompt('\nPressione Enter para continuar...');
                return;
        }

        const updatedProduct = this.productManager.updateProduct(id, updates);
        
        if (updatedProduct) {
            console.log(`\n${colors.green}✓ Produto atualizado com sucesso!${colors.reset}`);
            console.log(`Novos dados: ${updatedProduct.displayInfo()}`);
            this.saveData();
        }

        prompt('\nPressione Enter para continuar...');
    }

    // 5. Excluir produto
    deleteProduct() {
        this.showHeader();
        console.log(`${colors.yellow}EXCLUIR PRODUTO:${colors.reset}\n`);

        const id = parseInt(prompt('Digite o ID do produto a excluir: '));
        const product = this.productManager.getProductById(id);

        if (!product) {
            console.log(`${colors.red}✗ Produto com ID ${id} não encontrado.${colors.reset}`);
            prompt('\nPressione Enter para continuar...');
            return;
        }

        console.log(`\n${colors.red}⚠️  ATENÇÃO: Você está prestes a excluir:${colors.reset}`);
        console.log(`${colors.cyan}--------------------------------${colors.reset}`);
        console.log(`ID: ${product.id}`);
        console.log(`Nome: ${product.name}`);
        console.log(`Categoria: ${product.category}`);
        console.log(`Estoque: ${product.quantity}`);
        console.log(`Preço: R$ ${product.price.toFixed(2)}`);
        console.log(`${colors.cyan}--------------------------------${colors.reset}`);

        const confirm = prompt('\nTem certeza? (s/n): ').toLowerCase();

        if (confirm === 's' || confirm === 'sim') {
            const success = this.productManager.deleteProduct(id);
            if (success) {
                console.log(`${colors.green}✓ Produto excluído com sucesso!${colors.reset}`);
                this.saveData();
            }
        } else {
            console.log(`${colors.yellow}Exclusão cancelada.${colors.reset}`);
        }

        prompt('\nPressione Enter para continuar...');
    }

    // 6. Filtrar por categoria
    filterByCategory() {
        this.showHeader();
        console.log(`${colors.yellow}FILTRAR POR CATEGORIA:${colors.reset}\n`);

        const categories = [...new Set(this.productManager.products.map(p => p.category))];
        
        if (categories.length === 0) {
            console.log(`${colors.yellow}Nenhuma categoria cadastrada.${colors.reset}`);
            prompt('\nPressione Enter para continuar...');
            return;
        }

        console.log(`${colors.green}Categorias disponíveis:${colors.reset}`);
        categories.forEach((cat, index) => {
            console.log(`${colors.green}${index + 1}.${colors.reset} ${cat}`);
        });

        const choice = prompt('\nEscolha uma categoria (número) ou digite o nome: ').trim();
        
        let selectedCategory;
        if (!isNaN(choice) && parseInt(choice) <= categories.length) {
            selectedCategory = categories[parseInt(choice) - 1];
        } else {
            selectedCategory = choice;
        }

        const filteredProducts = this.productManager.getProductsByCategory(selectedCategory);
        
        console.log(`\n${colors.green}Produtos na categoria "${selectedCategory}":${colors.reset}`);
        this.displayProductsTable(filteredProducts);
        
        prompt('\nPressione Enter para continuar...');
    }

    // 7. Ordenar produtos
    sortProducts() {
        this.showHeader();
        console.log(`${colors.yellow}ORDENAR PRODUTOS:${colors.reset}\n`);
        
        console.log(`${colors.green}Ordenar por:${colors.reset}`);
        console.log(`${colors.green}1.${colors.reset} Nome (A-Z)`);
        console.log(`${colors.green}2.${colors.reset} Nome (Z-A)`);
        console.log(`${colors.green}3.${colors.reset} Quantidade (menor para maior)`);
        console.log(`${colors.green}4.${colors.reset} Quantidade (maior para menor)`);
        console.log(`${colors.green}5.${colors.reset} Preço (menor para maior)`);
        console.log(`${colors.green}6.${colors.reset} Preço (maior para menor)`);
        console.log(`${colors.green}0.${colors.reset} Voltar`);

        const option = prompt('\nEscolha uma opção: ');

        let by, order;
        switch(option) {
            case '1': by = 'name'; order = 'asc'; break;
            case '2': by = 'name'; order = 'desc'; break;
            case '3': by = 'quantity'; order = 'asc'; break;
            case '4': by = 'quantity'; order = 'desc'; break;
            case '5': by = 'price'; order = 'asc'; break;
            case '6': by = 'price'; order = 'desc'; break;
            case '0': return;
            default:
                console.log(`${colors.red}Opção inválida!${colors.reset}`);
                prompt('\nPressione Enter para continuar...');
                return;
        }

        const sortedProducts = this.productManager.sortProducts(by, order);
        
        console.log(`\n${colors.green}Produtos ordenados:${colors.reset}`);
        this.displayProductsTable(sortedProducts);
        
        prompt('\nPressione Enter para continuar...');
    }

    // Executa a aplicação
    run() {
        let running = true;

        while (running) {
            this.showMenu();
            const choice = prompt('Escolha uma opção: ').trim();

            switch(choice) {
                case '1':
                    this.addProduct();
                    break;
                case '2':
                    this.listProducts();
                    break;
                case '3':
                    this.searchProduct();
                    break;
                case '4':
                    this.updateProduct();
                    break;
                case '5':
                    this.deleteProduct();
                    break;
                case '6':
                    this.filterByCategory();
                    break;
                case '7':
                    this.sortProducts();
                    break;
                case '0':
                    console.log(`\n${colors.green}Obrigado por usar o AgilStore Inventory!${colors.reset}`);
                    console.log(`${colors.cyan}===============================================${colors.reset}`);
                    running = false;
                    break;
                default:
                    console.log(`${colors.red}Opção inválida! Tente novamente.${colors.reset}`);
                    prompt('\nPressione Enter para continuar...');
            }
        }
    }
}

// Inicia a aplicação
if (require.main === module) {
    const app = new AgilStoreApp();
    app.run();
}

module.exports = AgilStoreApp;