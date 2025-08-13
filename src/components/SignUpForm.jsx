import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export const SignUpForm = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [formData, setFormData] = useState({
    role: "",
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    school_id: "",
  });

  const [message, setMessage] = useState(""); 

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await fetch("http://localhost:3005/api/schools");
        const data = await res.json();
        setSchools(data);
      } catch (err) {
        console.error("Failed to load schools:", err);
      }
    };

    fetchSchools();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can handle form submission here (e.g., send to API)
    console.log("Signup Data:", formData);
    
    try {
        const res = await fetch("http://localhost:3005/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        const data = await res.json();
  
        if (res.ok) {
          setMessage("Signup successful!");
          setFormData({ role: "", firstname: "", lastname: "", username: "", email: "", password: "", school_id: "", });
          navigate("/login");
        } else {
          setMessage(data.message || "Signup failed.");
        }
      } catch (err) {
        console.error(err);
        setMessage("An error occurred.");
      }
  };

  return (
    <section id="signup" className="bg-white py-16 px-4 sm:px-6">
      <div className="max-w-md mx-auto bg-gray-50 p-8 rounded-xl shadow">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Sign Up for EdApp
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
        <label>
            Role:
          <select name="role" value={formData.role} onChange={handleChange} required className="w-full px-4 py-2 border rounded">
            <option value="">-- Select Role --</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstname"
              required
              value={formData.firstname}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastname"
              required
              value={formData.lastname}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              School
            </label>
            <select
              name="school_id"
              value={formData.school_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">-- Select School --</option>
              {schools.map((school) => (
                <option key={school.school_id} value={school.school_id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Create Account
          </button>
          {message && (
        <p className="mt-4 text-center text-green-600 font-medium">
            {message}
        </p>
    )}
        </form>
      </div>
    </section>
  );
};
