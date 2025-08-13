import React from "react";
import { Navbar } from "../components/Navbar";
import { BookOpen, BarChart, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "../components/Footer";
import { About } from "../components/About";
import { ContactForm } from "../components/ContactForm";

const features = [
  {
    title: "Intuitive Interface",
    description: "Simple oberservation entry that teachers view with ease.",
    icon: <BookOpen className="w-8 h-8 text-blue-600" />,
  },
  {
    title: "Proactive Intervention",
    description: "Catch trends in student data early in order to provide effective interventions.",
    icon: <BarChart className="w-8 h-8 text-blue-600" />,
  },
  {
    title: "Cohesive Data",
    description: "Data that goes beyond numbers to create a clear snapshot of your school.",
    icon: <Zap className="w-8 h-8 text-blue-600" />,
  },
];

export const HomePage = () => {
  return (
    <div className="min-h-screen w-full text-gray-800">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className="pt-28 pb-20 text-center px-4 sm:px-6">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Empower Faster Workflow with Edify
        </h1>
        <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto pt-2">
          Streamline your workflow with our data visualization.
        </p>
        <div className="mt-12">
            <Link to={"/signup"}>
          <button className="px-6 py-3 bg-black text-white text-lg rounded-md hover:bg-gray-800 transition mt-3">
            Get Started Now
          </button>
          </Link>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-4 px-4 sm:px-6 mb-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-2xl shadow hover:shadow-md transition border-2 border-black"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      <About />
      <ContactForm />

      <div className="text-center my-8">
  <button
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition mt-12"
  >
    ↑ Back to Top
  </button>
</div>


      <Footer />
    </div>
  );
};
