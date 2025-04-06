import React, { useState } from "react";
import ProductForm from "./productPage";
import StockView from "./stockPage";
import AnalysisPage from "./analysisPage";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [activeMenu, setActiveMenu] = useState("product");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

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

  const handleLogoutConfirm = () => {
    localStorage.removeItem("token");
    setShowLogoutModal(false);
    navigate("/logout");
  };

  return (
    <div className="min-h-screen bg-gray-100">
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
        <button
          className="font-medium hover:text-white p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          onClick={() => setShowLogoutModal(true)}
        >
          Logout
        </button>
      </nav>

      <div className="p-6">{renderContent()}</div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center w-80">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="mb-6 text-gray-600">Are you sure you want to logout?</p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={handleLogoutConfirm}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
