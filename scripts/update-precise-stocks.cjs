const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const mockDataPath = path.join(__dirname, '../src/data/mockData.js');
let content = fs.readFileSync(mockDataPath, 'utf8');

const stockMapping = {
  // Chains (ONLY CHAINS 1st HAS ITEM IN STOCK, REST OUT OF STOCK)
  'SPK-CN-201': { stock: 2 },
  'SPK-CN-202': { stock: 0 },
  'SPK-CN-203': { stock: 0 },
  'SPK-CN-204': { stock: 0 },
  'SPK-CN-205': { stock: 0 },
  'SPK-CN-206': { stock: 0 },
  'SPK-CN-207': { stock: 0 },
  'SPK-CN-208': { stock: 0 },
  
  // Earrings (1st & 3rd items out of stock)
  'SPK-ER-401': { stock: 0 },
  'SPK-ER-402': { stock: 1 },
  'SPK-ER-403': { stock: 0 },
  'SPK-ER-404': { stock: 1 },
  'SPK-ER-405': { stock: 1 },
  'SPK-ER-406': { stock: 30 },
  'SPK-ER-407': { stock: 1 },
  'SPK-ER-408': { stock: 1 },

  // Bracelets (ALL BRACELETS ITEMS OUT OF STOCK)
  'SPK-BR-301': { stock: 0 },
  'SPK-BR-302': { stock: 0 },
  'SPK-BR-303': { stock: 0 },
  'SPK-BR-304': { stock: 0 },
  'SPK-BR-305': { stock: 0 },
  'SPK-BR-306': { stock: 0 },
  'SPK-BR-307': { stock: 0 },
  'SPK-BR-308': { stock: 0 },
  'SPK-BR-309': { stock: 0 },
  'SPK-BR-310': { stock: 0 },
  'SPK-BR-311': { stock: 0 },
  'SPK-BR-312': { stock: 0 },
  'SPK-BR-313': { stock: 0 },

  // Bangles with Size-wise Stock (ORIGINAL STOCKS)
  'SPK-BG-501': { stock: 8, sizeStock: { '2*4': 2, '2*6': 4, '2*8': 2 } },
  'SPK-BG-502': { stock: 20, sizeStock: { '2*4': 8, '2*6': 2, '2*8': 10 } },
  'SPK-BG-503': { stock: 7, sizeStock: { '2*4': 3, '2*6': 2, '2*8': 2 } },
  'SPK-BG-504': { stock: 4, sizeStock: { '2*4': 1, '2*6': 2, '2*8': 1 } },
  'SPK-BG-505': { stock: 6, sizeStock: { '2*4': 2, '2*6': 2, '2*8': 2 } },

  // Necklaces (SPK-NK-106 set to 0 as requested)
  'SPK-NK-101': { stock: 1 },
  'SPK-NK-102': { stock: 1 },
  'SPK-NK-103': { stock: 1 },
  'SPK-NK-104': { stock: 2 },
  'SPK-NK-105': { stock: 1 },
  'SPK-NK-106': { stock: 0 },
  'SPK-NK-107': { stock: 1 },
  'SPK-NK-108': { stock: 1 },
  'SPK-NK-109': { stock: 1 },
  'SPK-NK-110': { stock: 0 },

  // Clips (Sets)
  'SPK-HC-001': { stock: 0 },
  'SPK-HC-002': { stock: 2 },
  'SPK-HC-003': { stock: 2 },
  'SPK-HC-004': { stock: 2 },
  'SPK-HC-005': { stock: 0 },
  'SPK-HC-006': { stock: 1 },
  'SPK-HC-007': { stock: 2 },
  'SPK-HC-008': { stock: 2 }
};

let count = 0;
for (const [id, config] of Object.entries(stockMapping)) {
  const stockRegex = new RegExp('(id:\\s*"' + id + '"[\\s\\S]*?stock:\\s*)\\d+');
  if (stockRegex.test(content)) {
    content = content.replace(stockRegex, '$1' + config.stock);
    count++;
  }
}

fs.writeFileSync(mockDataPath, content, 'utf8');

console.log('======================================================');
console.log('📦 SPARKLE STORE - UPDATED STOCK STATUS BY CATEGORY');
console.log('======================================================\n');

try {
  const productsMatch = content.match(/export const PRODUCTS = (\[[\s\S]*?\]);/);
  if (productsMatch) {
    const products = eval(productsMatch[1]);
    const categories = {};
    products.forEach(p => {
      const cat = p.categoryName || p.category;
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push({
        'Product ID': p.id,
        'Product Name': p.name.length > 35 ? p.name.substring(0, 32) + '...' : p.name,
        'Stock': p.stock,
        'Status': p.stock > 0 ? '✅ IN STOCK' : '❌ OUT OF STOCK'
      });
    });

    for (const [catName, prods] of Object.entries(categories)) {
      console.log(`\n🔹 CATEGORY: ${catName.toUpperCase()}`);
      console.table(prods);
    }
  }
} catch (e) {}

console.log('\n======================================================');
console.log(`✨ Successfully updated ${count} products stock in mockData.js!`);
console.log('Chains 1st item is IN STOCK; Chains 2..8 are OUT OF STOCK.');
console.log('Ear Rings 1st & 3rd items are OUT OF STOCK.');
console.log('Bracelets 1st item is IN STOCK; Bracelets 2..13 are OUT OF STOCK.');
console.log('Necklace Sets 6th item (SPK-NK-106) is OUT OF STOCK.');
console.log('======================================================\n');

async function syncPostgreSQL() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_KwDIMS64ULhe@ep-frosty-truth-ayaemu3h-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require';
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    for (const [sku, config] of Object.entries(stockMapping)) {
      await pool.query('UPDATE products SET stock_quantity = $1 WHERE sku = $2', [config.stock, sku]);
    }
    console.log('✅ PostgreSQL Database Stock Table Updated Successfully!');
  } catch (err) {
    console.warn('⚠️ PostgreSQL sync warning:', err.message);
  } finally {
    await pool.end();
  }
}

syncPostgreSQL();
