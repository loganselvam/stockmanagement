import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const AnalysisPage = () => {
  const [productNames, setProductNames] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [revenues, setRevenues] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get("https://stockmanagement-3htt.onrender.com/api/stock/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });

        const allproduct = res.data.products;
        const soldProducts = allproduct.filter((p) => p.sold !== 0);

        const names = soldProducts.map((p) => p.name);
        const soldQuantities = soldProducts.map((p) => p.sold);
        const availableStock = soldProducts.map((p) => p.quantity);
        const totalRevenue = soldProducts.map((p) => p.sold * p.price);

        setProductNames(names);
        setQuantities(soldQuantities);
        setStocks(availableStock);
        setRevenues(totalRevenue);
      } catch (error) {
        console.error("Error fetching sold products", error);
      }
    };

    fetchData();
  }, []);

  const chartConfigs = [
    {
      title: "Quantity Sold",
      data: quantities,
      bgColor: "rgba(59, 130, 246, 0.6)",
      borderColor: "rgba(59, 130, 246, 1)",
    },
    {
      title: "Available Stock",
      data: stocks,
      bgColor: "rgba(34, 197, 94, 0.6)",
      borderColor: "rgba(34, 197, 94, 1)",
    },
    {
      title: "Revenue Generated",
      data: revenues,
      bgColor: "rgba(234, 179, 8, 0.6)",
      borderColor: "rgba(234, 179, 8, 1)",
    },
  ];

  const generateChart = ({ title, data, bgColor, borderColor }) => ({
    labels: productNames,
    datasets: [
      {
        label: title,
        data,
        backgroundColor: bgColor,
        borderColor,
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  });

  const options = (title) => ({
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: title },
    },
  });

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen space-y-10">
  <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
    Product Analytics Dashboard
  </h2>

  <div className="flex flex-col items-center space-y-8">
    {chartConfigs.map((cfg, idx) => (
      <div
        key={idx}
        className="w-full max-w-[95%] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl bg-white rounded-2xl p-4 sm:p-6 shadow-lg"
      >
        <Bar data={generateChart(cfg)} options={options(cfg.title)} />
      </div>
    ))}
  </div>
</div>

  );
};

export default AnalysisPage;
