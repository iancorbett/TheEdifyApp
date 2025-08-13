import React from "react";
import { Link, useParams } from "react-router-dom";

export const StudentIndicators = () => {
  const { id: studentId } = useParams(); // grab student ID from URL

  const indicators = [
    {
      label: "Academic",
      from: "from-green-400",
      to: "to-green-600",
      ring: "ring-green-300",
      route: "academic",
    },
    {
      label: "Social/Emotional",
      from: "from-yellow-300",
      to: "to-yellow-500",
      ring: "ring-yellow-300",
      route: "social-emotional",
    },
    {
      label: "Behavioral",
      from: "from-red-400",
      to: "to-red-600",
      ring: "ring-red-300",
      route: "behavioral",
    },
  ];

  return (
    <div className="w-full flex flex-col md:flex-row justify-around items-center gap-12 mt-10">
      {indicators.map((indicator) => (
        <Link
          key={indicator.label}
          to={`/observations/${studentId}?type=${indicator.label.toLowerCase()}`}
          className="flex flex-col items-center cursor-pointer group"
        >
          {/* Label */}
          <p className="mb-4 text-lg md:text-3xl font-semibold underline text-gray-800">
            {indicator.label}
          </p>

          {/* Outer ring + glow */}
          <div
            className={`w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-transparent ring-4 ${indicator.ring}
              flex items-center justify-center transition-transform transform group-hover:scale-105 group-hover:shadow-xl`}
          >
            {/* Inner circle with gradient */}
            <div
              className={`w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br ${indicator.from} ${indicator.to}
                shadow-md group-hover:shadow-lg transition-all duration-300`}
            />
          </div>
        </Link>
      ))}
    </div>
  );
};
