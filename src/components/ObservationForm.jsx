import React, { useEffect, useState } from "react";




export const ObservationForm = () => {
  const [students, setStudents] = useState([]);
  const [step, setStep] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [observationType, setObservationType] = useState("");
  const [behaviorDesc, setBehaviorDesc] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
  
    try {
      const res = await fetch("http://localhost:3005/api/observations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          student_id: selectedStudent,
          observation_type: observationType,
          observation_text: behaviorDesc,
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        console.log("Observation saved:", data);
        setSubmitted(true);
        setStep(1);
        setSelectedStudent("");
        setObservationType("");
        setBehaviorDesc("");
      } else {
        alert(data.error || "Failed to save observation.");
      }
    } catch (err) {
      console.error("Error saving observation:", err);
      alert("Server error");
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem("token");
  
      try {
        const res = await fetch("http://localhost:3005/api/students", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();
  
        const formatted = data.map((s) => ({
          id: s.id || s.student_id, // depends on your DB column name
          name: `${s.first_name} ${s.last_name}`,
        }));
  
        setStudents(formatted);
      } catch (err) {
        console.error("Error loading students:", err);
      }
    };
  
    fetchStudents();
  }, []);

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 border border-gray-300 rounded-2xl shadow-lg bg-white text-center">
        <h2 className="text-2xl font-bold mb-4 text-green-600">✅ Observation Submitted!</h2>
        <button
          className="px-6 py-2 mt-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          onClick={() => {
            setStep(1);
            setSelectedStudent("");
            setObservationType("");
            setBehaviorDesc("");
            setSubmitted(false);
          }}
        >
          Add Another Observation
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto mt-10 p-8 border border-gray-300 rounded-2xl shadow-md bg-white"
    >
      <h1 className="text-2xl font-semibold mb-6 text-center text-indigo-700">
        Step {step} of 3
      </h1>

      {step === 1 && (
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-700 font-medium">Select Student:</span>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
            >
              <option value="">-- Choose a student --</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </label>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleNext}
              disabled={!selectedStudent}
              className={`px-5 py-2 rounded-md ${
                selectedStudent
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-700 font-medium">Observation Type:</span>
            <select
              value={observationType}
              onChange={(e) => setObservationType(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
            >
              <option value="">-- Choose type --</option>
              <option value="behavioral">Behavioral</option>
              <option value="academic">Academic</option>
              <option value="social_emotional">Social/Emotional</option>
            </select>
          </label>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!observationType}
              className={`px-5 py-2 rounded-md ${
                observationType
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-700 font-medium">Describe Behavior:</span>
            <textarea
              value={behaviorDesc}
              onChange={(e) => setBehaviorDesc(e.target.value)}
              required
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
            />
          </label>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!behaviorDesc.trim()}
              className={`px-5 py-2 rounded-md ${
                behaviorDesc.trim()
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </form>
  );
};
