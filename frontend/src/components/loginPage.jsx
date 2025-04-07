import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import App from "../App";

const LoginPage = () => {
  const API = process.env.REACT_APP_API_BASE_URL;
  console.log("API:",API)
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://stockmanagement-vnwu.onrender.com/api/login/", {
        username: loginData.username,
        password: loginData.password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/home");
      alert("Login successful!");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://stockmanagement-vnwu.onrender.com/api/register/", {
        name: registerData.name,
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
      });
      alert("Registration successful!");
      setShowRegister(false);
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Welcome to Our Store
          </h2>
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Username</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Login
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            New here?{" "}
            <span
              className="text-blue-500 font-medium cursor-pointer hover:underline"
              onClick={() => setShowRegister(true)}
            >
              Register
            </span>
          </p>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2">
        <img
          src="src\assets\4016257.jpg"
          alt="Login Illustration"
          className="w-full h-full object-fit"
        />
      </div>

      {showRegister && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowRegister(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              Create an Account
            </h2>
            <form className="space-y-4" onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 border rounded-lg"
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({ ...registerData, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Username"
                className="w-full p-3 border rounded-lg"
                value={registerData.username}
                onChange={(e) =>
                  setRegisterData({ ...registerData, username: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border rounded-lg"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 border rounded-lg"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
              />
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
