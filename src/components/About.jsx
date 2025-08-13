import React from "react";

export const About = () => {
  return (
    <section id="about" className="bg-gradient-to-r from-red-50 to-red-100 py-12 px-4 sm:px-6 border-2 border-black rounded-md shadow-xl">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
          About Edify
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
        Edify empowers educators to support every student’s growth through timely, clear, and actionable insights. Our intuitive platform streamlines 
        weekly observations, enabling schools to identify needs early and deliver effective interventions—all while saving teachers valuable time.
        </p>
      </div>
    </section>
  );
};
