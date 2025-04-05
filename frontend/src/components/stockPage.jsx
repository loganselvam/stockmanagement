import React, { useEffect, useState } from "react";
import axios from "axios";

const StockView = () => {
  const [products, setProducts] = useState([]);
  const [soldItems, setSoldItems] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://127.0.0.1:8000/api/stock/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
  
        const allProducts = res.data.products; // ✅ Correctly access 'products'
        const revenue = res.data.total_revenue; // ✅ Correctly access 'total_revenue'
        console.log(allProducts)
        // Separate sold and unsold
        const sold = allProducts.filter((p) => p.sold != 0);
        const unsold = allProducts
        console.log("sold:",allProducts)
        
        setProducts(unsold);
        setSoldItems(sold);
        setTotalRevenue(revenue);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };
  
    fetchStockData();
  }, []);
  

  return (
    <div className="space-y-8">
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Available Stock</h2>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Quantity</th>
              <th className="py-2">Price</th>
              <th className="py-2">Category</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="py-2">{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Sold Products</h2>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Sold</th>
              <th className="py-2">Price</th>
              <th className="py-2">Category</th>
            </tr>
          </thead>
          <tbody>
            {soldItems.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="py-2">{item.name}</td>
                <td>{item.sold}</td>
                <td>{item.price}</td>
                <td>{item.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-green-100 text-green-800 p-4 rounded-xl shadow font-semibold text-lg">
        Total Revenue Generated: ₹ {totalRevenue.toFixed(2)}
      </div>
    </div>
  );
};

export default StockView;
