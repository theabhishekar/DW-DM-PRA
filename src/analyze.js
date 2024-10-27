import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('sales_dw.db');

db.serialize(() => {
  // Daily Sales Report
  console.log('\nTop 10 Daily Sales:');
  db.all(`
    SELECT 
      d.full_date,
      SUM(f.total_price) as daily_total
    FROM fact_sales f
    JOIN dim_date d ON f.date_id = d.date_id
    GROUP BY d.full_date
    ORDER BY d.full_date DESC
    LIMIT 10
  `, (err, rows) => {
    if (err) {
      console.error('Error getting daily sales:', err);
    } else {
      console.table(rows);
    }
  });

  // Monthly Sales by Category
  console.log('\nTop 10 Monthly Category Sales:');
  db.all(`
    SELECT 
      d.year,
      d.month,
      p.category,
      SUM(f.total_price) as monthly_total
    FROM fact_sales f
    JOIN dim_date d ON f.date_id = d.date_id
    JOIN dim_product p ON f.product_id = p.product_id
    GROUP BY d.year, d.month, p.category
    ORDER BY d.year DESC, d.month DESC, monthly_total DESC
    LIMIT 10
  `, (err, rows) => {
    if (err) {
      console.error('Error getting monthly sales:', err);
    } else {
      console.table(rows);
    }
  });

  // Product Performance
  console.log('\nProduct Performance:');
  db.all(`
    SELECT 
      p.product_name,
      SUM(f.quantity) as total_quantity,
      SUM(f.total_price) as total_revenue
    FROM fact_sales f
    JOIN dim_product p ON f.product_id = p.product_id
    GROUP BY p.product_id
    ORDER BY total_revenue DESC
  `, (err, rows) => {
    if (err) {
      console.error('Error getting product performance:', err);
    } else {
      console.table(rows);
      db.close();
    }
  });
});