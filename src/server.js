import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('sales_dw.db');

app.get('/api/daily-sales', (req, res) => {
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
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.get('/api/monthly-sales', (req, res) => {
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
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.get('/api/product-performance', (req, res) => {
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
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});