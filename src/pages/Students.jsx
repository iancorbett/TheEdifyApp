import React, { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../components/BackButton";

export const Students = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://localhost:3005/api/students", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };

    fetchStudents();
  }, []);

  return (
    <section>

    <Navbar />
    <BackButton />

    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6"> Your Students</h1>

      {students.length === 0 ? (
        <p>No students added yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">#</th>
                <th className="py-2 px-4 border-b text-left">First Name</th>
                <th className="py-2 px-4 border-b text-left">Last Name</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.student_id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{student.first_name}</td>
                  <td className="py-2 px-4 border-b">{student.last_name}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => navigate(`/students/${student.student_id}`)}
                      className="text-blue-600 hover:underline"
                    >
                        View Dashboard
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </section>
  );
};