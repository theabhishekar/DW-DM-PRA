import sqlite3 from 'sqlite3';
import { getYear, getMonth, getDate, getQuarter } from 'date-fns';

const db = new sqlite3.Database('sales_dw.db');

// Sample data
const products = [
  { product_id: 1, product_name: 'Laptop', category: 'Electronics' },
  { product_id: 2, product_name: 'Smartphone', category: 'Electronics' },
  { product_id: 3, product_name: 'Coffee Maker', category: 'Appliances' },
  { product_id: 4, product_name: 'Headphones', category: 'Electronics' }
];

const stores = [
  { store_id: 1, store_location: 'Downtown' }
];

db.serialize(() => {
  // Load dimension data
  const insertProduct = db.prepare('INSERT OR IGNORE INTO dim_product (product_id, product_name, category) VALUES (?, ?, ?)');
  products.forEach(product => {
    insertProduct.run(product.product_id, product.product_name, product.category);
  });
  insertProduct.finalize();

  const insertStore = db.prepare('INSERT OR IGNORE INTO dim_store (store_id, store_location) VALUES (?, ?)');
  stores.forEach(store => {
    insertStore.run(store.store_id, store.store_location);
  });
  insertStore.finalize();

  // Generate dates for 2023
  const insertDate = db.prepare('INSERT OR IGNORE INTO dim_date (date_id, full_date, year, quarter, month, day) VALUES (?, ?, ?, ?, ?, ?)');
  const startDate = new Date('2023-01-01');
  for (let i = 0; i < 365; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    const dateId = parseInt(currentDate.toISOString().slice(0,10).replace(/-/g, ''));
    insertDate.run(
      dateId,
      currentDate.toISOString().slice(0,10),
      getYear(currentDate),
      getQuarter(currentDate),
      getMonth(currentDate) + 1,
      getDate(currentDate)
    );
  }
  insertDate.finalize();

  // Generate sample sales data
  db.all('SELECT date_id FROM dim_date', [], (err, dates) => {
    if (err) {
      console.error('Error getting dates:', err);
      return;
    }

    const insertSale = db.prepare('INSERT INTO fact_sales (date_id, product_id, store_id, quantity, total_price) VALUES (?, ?, ?, ?, ?)');
    const productIds = products.map(p => p.product_id);
    
    dates.forEach(({ date_id }) => {
      const numberOfSales = Math.floor(Math.random() * 5) + 1;
      
      for (let i = 0; i < numberOfSales; i++) {
        const product_id = productIds[Math.floor(Math.random() * productIds.length)];
        const quantity = Math.floor(Math.random() * 5) + 1;
        const price_per_unit = Math.floor(Math.random() * 1000) + 100;
        const total_price = quantity * price_per_unit;
        
        insertSale.run(date_id, product_id, 1, quantity, total_price);
      }
    });
    
    insertSale.finalize(() => {
      console.log('Sample data loaded successfully!');
      db.close();
    });
  });
});