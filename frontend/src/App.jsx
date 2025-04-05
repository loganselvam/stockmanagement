import { useState,useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css'
import LoginPage from './components/loginPage';
import ProductForm from './components/productPage'; 
import HomePage from "./components/home";
import StockView from './components/stockPage'
import AnalysisPage from './components/analysisPage'
function App()  {

 

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/product" element={<ProductForm />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/stock" element={<StockView />} />
        <Route path="/analysis" element={<AnalysisPage />} />
      </Routes>
    </Router>
  );
}

export default App
