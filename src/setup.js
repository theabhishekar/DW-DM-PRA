import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('sales_dw.db');

db.serialize(() => {
  // Create dimension tables
  db.run(`
    CREATE TABLE IF NOT EXISTS dim_date (
      date_id INTEGER PRIMARY KEY,
      full_date DATE,
      year INTEGER,
      quarter INTEGER,
      month INTEGER,
      day INTEGER
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS dim_product (
      product_id INTEGER PRIMARY KEY,
      product_name TEXT,
      category TEXT
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS dim_store (
      store_id INTEGER PRIMARY KEY,
      store_location TEXT
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS fact_sales (
      sale_id INTEGER PRIMARY KEY AUTOINCREMENT,
      date_id INTEGER,
      product_id INTEGER,
      store_id INTEGER,
      quantity INTEGER,
      total_price DECIMAL(10,2),
      FOREIGN KEY (date_id) REFERENCES dim_date(date_id),
      FOREIGN KEY (product_id) REFERENCES dim_product(product_id),
      FOREIGN KEY (store_id) REFERENCES dim_store(store_id)
    );
  `, (err) => {
    if (err) {
      console.error('Error creating schema:', err);
    } else {
      console.log('Data warehouse schema created successfully!');
    }
    db.close();
  });
});