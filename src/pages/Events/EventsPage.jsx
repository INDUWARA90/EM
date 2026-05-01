import React, { useState } from "react";
import EventForm from "../../components/events/EventForm";

function EventPage() {
  const roleMap = {
    Lecturer: "LC2001",
    Dean: "DID100",
    Head: "HD3001",
  };

  const getInitialState = () => ({
    eventName: "",
    eventDate: "",
    eventTime: "",
    eventPlace: "",
    description: "",
    approvers: [],
  });

  const [values, setValues] = useState(getInitialState());
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ SUBMIT WITH FETCH
  const handleSubmit = async (payload) => {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("eventName", payload.eventName);
      formData.append("eventDate", payload.eventDate);
      formData.append("eventTime", payload.eventTime);
      formData.append("placeName", payload.eventPlace || "");
      formData.append("description", payload.description);

      if (file) {
        formData.append("letterPdf", file);
      }

      payload.approvers.forEach((a, i) => {
        formData.append(`approvers[${i}].order`, String(a.order));
        formData.append(`approvers[${i}].name`, a.name);
      });

      const response = await fetch(
        "http://localhost:8081/api/letter/place",
        {
          method: "POST",
          credentials: "include", // 🔥 important if session login
          body: formData,
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Failed to create event");
      }

      const result = await response.json();

      alert(result?.message || "Event created successfully!");

      // RESET FORM
      setValues(getInitialState());
      setFile(null);

    } catch (err) {
      console.error("ERROR:", err.message);
      alert(err.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050b1a] p-6 space-y-8">

      <h1 className="text-2xl font-bold text-white">
        Create Event
      </h1>

      <EventForm
        values={values}
        setValues={setValues}
        file={file}
        setFile={setFile}
        roleMap={roleMap}
        onSubmit={handleSubmit}
      />

      {loading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
          <div className="bg-blue-600 px-6 py-3 rounded-full text-white font-bold animate-pulse">
            SUBMITTING...
          </div>
        </div>
      )}

    </div>
  );
}

export default EventPage;