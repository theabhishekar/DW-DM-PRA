import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function App() {
  const { data: dailySales } = useQuery({
    queryKey: ['dailySales'],
    queryFn: () => fetch('/api/daily-sales').then(res => res.json())
  });

  const { data: monthlySales } = useQuery({
    queryKey: ['monthlySales'],
    queryFn: () => fetch('/api/monthly-sales').then(res => res.json())
  });

  const { data: productPerformance } = useQuery({
    queryKey: ['productPerformance'],
    queryFn: () => fetch('/api/product-performance').then(res => res.json())
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Sales Data Warehouse Analytics</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Daily Sales (Last 10 Days)</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="full_date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="daily_total" fill="#8884d8" name="Daily Total" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Monthly Sales by Category</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="monthly_total" fill="#82ca9d" name="Monthly Total" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Product Performance</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product_name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_revenue" fill="#ffc658" name="Total Revenue" />
                <Bar dataKey="total_quantity" fill="#ff7300" name="Total Quantity" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;