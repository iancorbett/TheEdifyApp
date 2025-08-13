import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { BackButton } from "../components/BackButton";

export const ObservationData = () => {
  const { studentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [summaries, setSummaries] = useState({
    academic: "",
    social_emotional: "",
    behavioral: "",
  });

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/observations/summary/${studentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch summary");

        const data = await res.json();
        setSummaries(data.summaries);
      } catch (err) {
        console.error("Error fetching AI summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [studentId]);

  return (
    <section>
      <Navbar />
      <BackButton />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">🧠 Observation Summaries</h1>

        {loading ? (
          <p>Loading AI-generated summaries...</p>
        ) : (
          <div className="space-y-6">
            <SummaryCard title="📘 Academic Summary" content={summaries.academic} />
            <SummaryCard title="😊 Social/Emotional Summary" content={summaries.social_emotional} />
            <SummaryCard title="🚨 Behavioral Summary" content={summaries.behavioral} />
          </div>
        )}
      </div>
    </section>
  );
};

const SummaryCard = ({ title, content }) => (
  <div className="bg-white p-5 rounded shadow border border-gray-200">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <p className="text-gray-700 whitespace-pre-line">{content || "No observations yet."}</p>
  </div>
);

export default ObservationData;