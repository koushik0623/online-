const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, '../src/data/mockData.js');
let content = fs.readFileSync(mockDataPath, 'utf8');

const stockMapping = {
  // Chains
  'SPK-CN-201': { stock: 2 },
  'SPK-CN-202': { stock: 0 },
  'SPK-CN-203': { stock: 0 },
  'SPK-CN-204': { stock: 0 },
  'SPK-CN-205': { stock: 0 },
  'SPK-CN-206': { stock: 0 },
  'SPK-CN-207': { stock: 0 },
  'SPK-CN-208': { stock: 0 },

  // Earrings
  'SPK-ER-401': { stock: 1 },
  'SPK-ER-402': { stock: 1 },
  'SPK-ER-403': { stock: 6 },
  'SPK-ER-404': { stock: 1 },
  'SPK-ER-405': { stock: 1 },
  'SPK-ER-406': { stock: 30 },
  'SPK-ER-407': { stock: 1 },
  'SPK-ER-408': { stock: 1 },

  // Bracelets
  'SPK-BR-301': { stock: 1 },
  'SPK-BR-302': { stock: 1 },
  'SPK-BR-303': { stock: 3 },
  'SPK-BR-304': { stock: 4 },
  'SPK-BR-305': { stock: 5 },
  'SPK-BR-306': { stock: 5 },
  'SPK-BR-307': { stock: 5 },
  'SPK-BR-308': { stock: 1 },
  'SPK-BR-309': { stock: 1 },
  'SPK-BR-310': { stock: 1 },
  'SPK-BR-311': { stock: 1 },
  'SPK-BR-312': { stock: 1 },
  'SPK-BR-313': { stock: 1 },

  // Bangles with Size-wise Stock
  'SPK-BG-501': { stock: 8, sizeStock: { '2*4': 2, '2*6': 4, '2*8': 2 } },
  'SPK-BG-502': { stock: 20, sizeStock: { '2*4': 8, '2*6': 2, '2*8': 10 } },
  'SPK-BG-503': { stock: 7, sizeStock: { '2*4': 3, '2*6': 2, '2*8': 2 } },
  'SPK-BG-504': { stock: 4, sizeStock: { '2*4': 1, '2*6': 2, '2*8': 1 } },
  'SPK-BG-505': { stock: 6, sizeStock: { '2*4': 2, '2*6': 2, '2*8': 2 } },

  // Necklaces
  'SPK-NK-101': { stock: 1 },
  'SPK-NK-102': { stock: 1 },
  'SPK-NK-103': { stock: 1 },
  'SPK-NK-104': { stock: 2 },
  'SPK-NK-105': { stock: 1 },
  'SPK-NK-106': { stock: 1 },
  'SPK-NK-107': { stock: 1 },
  'SPK-NK-108': { stock: 1 },
  'SPK-NK-109': { stock: 1 },
  'SPK-NK-110': { stock: 0 },

  // Clips (Sets)
  'SPK-HC-001': { stock: 0 },
  'SPK-HC-002': { stock: 2 },
  'SPK-HC-003': { stock: 2 },
  'SPK-HC-004': { stock: 2 },
  'SPK-HC-005': { stock: 3 },
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
console.log(`Successfully updated ${count} products stock limits in mockData.js!`);
