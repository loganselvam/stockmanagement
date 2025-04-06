import React, { useEffect, useState } from "react";
import axios from "axios";

const StockView = () => {
  const [products, setProducts] = useState([]);
  const [soldItems, setSoldItems] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
    sold: "",
  });
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("");

  const fetchStockData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://stockmanagement-vnwu.onrender.com/api/stock/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const allProducts = res.data.products;
      const revenue = res.data.total_revenue;

      const sold = allProducts.filter((p) => p.sold !== 0);

      setProducts(allProducts);
      setSoldItems(sold);
      setTotalRevenue(revenue);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };
  const handleExportCSV = () => {
    const headers = ["Name", "Price", "Quantity", "Category", "Sold"];
    const rows = products.map(product =>
      [product.name, product.price, product.quantity, product.category, product.sold]
    );
  
    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map(e => e.join(",")).join("\n");
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  useEffect(() => {
    fetchStockData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`https://stockmanagement-vnwu.onrender.com/api/delete/${id}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        alert("Product deleted successfully.");
        fetchStockData();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
      sold: product.sold,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://stockmanagement-vnwu.onrender.com/api/update/${editingProduct.id}/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setEditingProduct(null);
      setFormData({
        name: "",
        price: "",
        quantity: "",
        category: "",
        sold: "",
      });
      fetchStockData();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Available Stock */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Available Stock</h2>
        <div className="flex justify-end mb-4">
          <button
            onClick={handleExportCSV}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Export CSV
          </button>
        </div>
        

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="w-full sm:w-auto">
            <label className="mr-2 font-medium">Filter by Category:</label>
            <input
              type="text"
              placeholder="e.g. Electronics"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full sm:w-64 px-3 py-1 border rounded"
            />
          </div>

          <div className="w-full sm:w-auto">
            <label className="mr-2 font-medium">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-64 px-3 py-1 border rounded"
            >
              <option value="">-- Select --</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="quantity">Quantity</option>
            </select>
          </div>
        </div>


        <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Quantity</th>
              <th className="py-2">Price</th>
              <th className="py-2">Category</th>
              <th className="py-2">Update</th>
              <th className="py-2">Delete</th>
            </tr>
          </thead>
          <tbody>
          {products
              .filter((product) =>
                filterCategory ? product.category.toLowerCase().includes(filterCategory.toLowerCase()) : true
              )
              .sort((a, b) => {
                if (sortBy === "name") return a.name.localeCompare(b.name);
                if (sortBy === "price") return a.price - b.price;
                if (sortBy === "quantity") return a.quantity - b.quantity;
                return 0;
              })
              .map((product) => (
              <tr key={product.id} className="border-t">
                <td className="py-2">{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td className="py-2">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Update
                  </button>
                </td>
                <td className="py-2">
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Sold Products */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Sold Products</h2>
        <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
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
      </div>

      {/* Total Revenue */}
      <div className="bg-green-100 text-green-800 p-4 rounded-xl shadow font-semibold text-lg">
        Total Revenue Generated: ₹ {totalRevenue.toFixed(2)}
      </div>

      {/* Update Modal */}
      {editingProduct && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-lg font-semibold mb-4 text-center">
        Updating: <span className="text-blue-600">{editingProduct.name}</span>
      </h2>
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded"
        />

        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded"
        />

        <label className="block text-sm font-medium text-gray-700">Quantity</label>
        <input
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded"
        />

        <label className="block text-sm font-medium text-gray-700">Category</label>
        <input
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded"
        />

        <label className="block text-sm font-medium text-gray-700">Sold</label>
        <input
          name="sold"
          type="number"
          value={formData.sold}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => setEditingProduct(null)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdateSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Update
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default StockView;
