import React, { useState } from "react";
import ProductForm from "./productPage";
import StockView from "./stockPage";
import AnalysisPage from "./analysisPage";

const HomePage = () => {
  const [activeMenu, setActiveMenu] = useState("product");

  const renderContent = () => {
    switch (activeMenu) {
      case "product":
        return <ProductForm />;
      case "stock":
        return <StockView />;
      case "analysis":
        return <AnalysisPage />;
      default:
        return <ProductForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-end space-x-6">
        <button
          className={`font-medium hover:text-blue-500 ${
            activeMenu === "product" ? "text-blue-600" : "text-gray-700"
          }`}
          onClick={() => setActiveMenu("product")}
        >
          Product
        </button>
        <button
          className={`font-medium hover:text-blue-500 ${
            activeMenu === "stock" ? "text-blue-600" : "text-gray-700"
          }`}
          onClick={() => setActiveMenu("stock")}
        >
          Stock
        </button>
        <button
          className={`font-medium hover:text-blue-500 ${
            activeMenu === "analysis" ? "text-blue-600" : "text-gray-700"
          }`}
          onClick={() => setActiveMenu("analysis")}
        >
          Analysis
        </button>
      </nav>

      {/* Content below Navbar */}
      <div className="p-6">{renderContent()}</div>
    </div>
  );
};

export default HomePage;
