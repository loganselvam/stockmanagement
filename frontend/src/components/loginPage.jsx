import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  // Login handler
  const handleLogin = async (e) => {
    
    e.preventDefault();
    try {
        const res = await axios.post("http://localhost:8000/api/login/", {
            username: loginData.username,
            password: loginData.password,
        });
        localStorage.setItem("token", res.data.token);
        navigate("/home");
        alert("Login successful!");
      // Navigate to home
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  // Register handler
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/register/", {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Login</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="block text-gray-700 font-medium">Username</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg"
              value={loginData.username}
              onChange={(e) =>
                setLoginData({ ...loginData, username: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded-lg"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          New user?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => setShowRegister(true)}
          >
            Register
          </span>
        </p>
      </div>

      {showRegister && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 relative">
            <button
              className="absolute top-3 right-3"
              onClick={() => setShowRegister(false)}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Register</h2>
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label className="block text-gray-700 font-medium">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Username</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={registerData.username}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, username: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-lg"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Password</label>
                <input
                  type="password"
                  className="w-full p-2 border rounded-lg"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, password: e.target.value })
                  }
                />
              </div>
              <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg">
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
