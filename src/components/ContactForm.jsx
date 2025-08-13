import React, { useState } from "react";
import emailjs from "emailjs-com";


export const ContactForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs
      .send(
        "service_jwqz8d7",       
        "template_yh3i14a",      
        formData,
        "ZWNUTZBCywEwpHXTq"        
      )
      .then(() => {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      })
      .catch((err) => {
        console.error("EmailJS Error:", err);
        setStatus("Failed to send message. Please try again.");
      });
  };

  return (
    <div id="contact" className="max-w-xl mx-auto bg-white shadow-md p-8 rounded-2xl mt-12 border-2">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">📬 Contact Us</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Message</label>
          <textarea
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
        >
          Send Message
        </button>

        {status && <p className="text-green-600 text-center mt-4">{status}</p>}
      </form>
    </div>
  );
};
