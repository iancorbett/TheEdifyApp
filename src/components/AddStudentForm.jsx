import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AddStudentForm = () => {
    const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3005/api/addstudent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ⬅️ Send the token!
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Student added successfully!");
        setFormData({ first_name: "", last_name: "" });
      } else {
        setMessage(data.error || "Failed to add student.");
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred.");
    }
  };

  return (
    <section className="bg-white py-16 px-4 sm:px-6" id="add-student">
      <div className="max-w-md mx-auto bg-gray-50 p-8 rounded-xl shadow">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Add a Student
        </h2>
        {message && (
          <p className="text-center text-sm text-green-600 mb-4">{message}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Add Student
          </button>
        </form>
      </div>
    </section>
  );
};
