// src/database.js
const fs = require('fs');
const path = require('path');

// Caminho para o arquivo JSON
const DATA_FILE = path.join(__dirname, '..', 'data', 'products.json');

// Função para salvar produtos no JSON
function saveToJSON(products) {
    try {
        // Garante que o diretório existe
        const dataDir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Converte os produtos para um formato simples
        const productsData = products.map(product => ({
            id: product.id,
            name: product.name,
            category: product.category,
            quantity: product.quantity,
            price: product.price
        }));

        // Escreve no arquivo
        fs.writeFileSync(DATA_FILE, JSON.stringify(productsData, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Erro ao salvar dados:', error.message);
        return false;
    }
}

// Função para carregar produtos do JSON
function loadFromJSON() {
    try {
        // Verifica se o arquivo existe
        if (!fs.existsSync(DATA_FILE)) {
            // Cria arquivo vazio se não existir
            fs.writeFileSync(DATA_FILE, '[]', 'utf8');
            return [];
        }

        // Lê o arquivo
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        const productsData = JSON.parse(data);

        // Importa a classe Product (cuidado com dependência circular)
        const { Product } = require('./products.js');

        // Converte os dados simples em objetos Product
        return productsData.map(data => new Product(
            data.id,
            data.name,
            data.category,
            data.quantity,
            data.price
        ));
    } catch (error) {
        console.error('Erro ao carregar dados:', error.message);
        
        // Se houver erro de parsing, cria backup e recomeça
        if (error instanceof SyntaxError) {
            console.log('Arquivo corrompido. Criando novo arquivo...');
            const backupFile = DATA_FILE + '.backup-' + Date.now();
            if (fs.existsSync(DATA_FILE)) {
                fs.copyFileSync(DATA_FILE, backupFile);
                console.log(`Backup criado: ${backupFile}`);
            }
            fs.writeFileSync(DATA_FILE, '[]', 'utf8');
            return [];
        }
        
        return [];
    }
}

// Exporta as funções
module.exports = { saveToJSON, loadFromJSON };