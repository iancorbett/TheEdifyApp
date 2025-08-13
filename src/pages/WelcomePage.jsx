import { FormInput } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { BackButton } from "../components/BackButton";

export const WelcomePage = () => {
  return (
    <section>
      <Navbar />
      <BackButton />
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Edify!</h1>

      <p className="text-lg mb-8">What would you like to do today?</p>

      <div className="space-y-4">
        <Link
          to="/addstudent"
          className="block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition border-2 shadow-md"
        >
          ➕ Add Student
        </Link>
        <Link
          to="/students"
          className="block bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition border-2 shadow-md"
        >
          📋 View Students
        </Link>
        <Link
          to="/formpage"
          className="block bg-yellow-500 text-white px-6 py-3 rounded hover:bg-yellow-600 transition border-2 shadow-md"
        >
            <span>
          <FormInput className="inline"/> Add Observation
          </span>
        </Link>
        {/* <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="block bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition"
        >
          🚪 Logout
        </button> */}
      </div>
    </div>
    </section>
  );
};
