import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { BackButton } from "../components/BackButton";

export const ObservationsPage = () => {
  const { studentId } = useParams();
  const location = useLocation();
  const [observations, setObservations] = useState([]);

  const queryParams = new URLSearchParams(location.search);
  const selectedType = queryParams.get("type"); // academic, social/emotional, behavioral

  useEffect(() => {
    const fetchObservations = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:3005/api/observations/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      // If a filter is selected, apply it
      if (selectedType) {
        const filtered = data.filter(obs => {
          const typeNormalized = obs.observation_type.replace(/_/g, "").toLowerCase();
          const selectedNormalized = selectedType.replace(/[^a-z]/gi, "").toLowerCase();
          return typeNormalized === selectedNormalized;
        });
      
        setObservations(filtered);
      } else {
        setObservations(data);
      }
    };

    fetchObservations();
  }, [studentId, selectedType]);

  return (
    <section>
      <Navbar />
      <BackButton />
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 capitalize">
        {selectedType ? `${selectedType} Observations` : "All Observations"}
      </h1>

      {observations.length === 0 ? (
        <p>No observations found.</p>
      ) : (
        <ul className="space-y-4">
          {observations.map(obs => (
            <li key={obs.observation_id} className="bg-white p-4 rounded shadow">
              <p className="font-semibold">{obs.observation_type}</p>
              <p>{obs.observation_text}</p>
              <p className="text-sm text-gray-500 mt-1">
              Submitted by{" "}
             {obs.teacher_first_name
          ? `👩‍🏫 ${obs.teacher_first_name} ${obs.teacher_last_name}`
          : `🧑‍💼 ${obs.admin_first_name} ${obs.admin_last_name}`}{" "}
            on {new Date(obs.created_at).toLocaleDateString()}
          </p>
            </li>
          ))}
        </ul>
      )}
    </div>
    </section>
  );
};

export default ObservationsPage;
