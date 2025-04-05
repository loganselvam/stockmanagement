import React, { useState } from "react";
import axios from "axios";

const ProductForm = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    quantity: "",
    price: "",
    category: "",
    sold:""
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://127.0.0.1:8000/api/products/", product, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      alert("Product registered successfully!");
      setProduct({ name: "", description: "", quantity: "", price: "", category: "" ,sold:""});
    } catch (error) {
      alert(error.response?.data?.error || "Failed to register product.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="grid grid-cols-5 gap-4 bg-white rounded-2xl shadow-xl w-full max-w-5xl p-6">
        
        <div className="col-span-2 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Register Product</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" value={product.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded-lg" />
            <textarea name="description" value={product.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded-lg" />
            <input type="number" name="quantity" value={product.quantity} onChange={handleChange} placeholder="Quantity" className="w-full p-2 border rounded-lg" />
            <input type="number" name="price" value={product.price} onChange={handleChange} placeholder="Price" className="w-full p-2 border rounded-lg" />
            <input type="number" name="sold" value={product.sold} onChange={handleChange} placeholder="Sold" className="w-full p-2 border rounded-lg" />
            <input type="text" name="category" value={product.category} onChange={handleChange} placeholder="Category" className="w-full p-2 border rounded-lg" />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700">
              Submit
            </button>
          </form>
        </div>

        {/* Right side: Image / Design (3fr) */}
        <div className="col-span-3 flex items-center justify-center bg-gradient-to-br from-blue-100 to-white rounded-xl">
          <img src="https://source.unsplash.com/400x300/?product" alt="Product" className="rounded-xl object-cover max-h-80 shadow-lg" />
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
