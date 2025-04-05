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

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get("http://127.0.0.1:8000/api/stock/", {
                  headers: {
                    Authorization: `Token ${token}`,
                  },
                });

                const allproduct =res.data.products;
        const soldProducts =allproduct.filter((p) => p.sold != 0);
        
        console.log("soldProducts:",soldProducts);
        setProductNames(soldProducts.map((p) => p.name));
        setQuantities(soldProducts.map((p) => p.sold));
      } catch (error) {
        console.error("Error fetching sold products", error);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: productNames,
    datasets: [
      {
        label: "Quantity Sold",
        data: quantities,
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Sold Products Analysis" },
    },
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-center mb-4">Sold Product Chart</h2>
      <div className="bg-white rounded-xl p-4 shadow-xl max-w-4xl mx-auto">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default AnalysisPage;
