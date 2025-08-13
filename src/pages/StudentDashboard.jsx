import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { BackButton } from "../components/BackButton";
import { StudentIndicators } from "../components/StudentIndicators";
import { jwtDecode } from "jwt-decode";

export const StudentDashboard = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [observations, setObservations] = useState([]);
  const [role, setRole] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
        const decoded = jwtDecode(token);  
        setRole(decoded.role);
      }
  
    
    const fetchStudent = async () => {
      

      try {
        const res = await fetch(`http://localhost:3005/api/students/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setStudent(data);
      } catch (err) {
        console.error("Error fetching student:", err);
      }
    };

    const fetchObservations = async () => {
        const token = localStorage.getItem("token");
  
        try {
          const res = await fetch(`http://localhost:3005/api/observations/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await res.json();
          console.log("Observations data:", data); 
        setObservations(data);
      } catch (err) {
        console.error("Error fetching observations:", err);
      }
    };

    fetchStudent();
    fetchObservations();
  }, [id]);

  if (!student) return <p>Loading...</p>;

  return (
    <section>
      <Navbar />
      <BackButton />
      
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4"> {student.first_name} {student.last_name}</h1>
        <StudentIndicators />

        {role === "admin" && ( // ✅ Only admins can see this
          <Link
            to={`/observation-data/${id}`}
            className="inline-block mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            🔍 View AI Summary
          </Link>
        )}

        
      </div>
    </section>
  );
};