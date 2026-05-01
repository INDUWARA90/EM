import React, { useEffect, useState } from "react";
import EventForm from "../../components/events/EventForm";
import { getPlaces, createEvent as createEventAPI } from "../../api/eventService";

function EventPage() {

  const roleMap = {
    Lecturer: "LC2001",
    Dean: "DID100",
    Head: "HD3001",
  };

  // =========================
  // INITIAL STATE
  // =========================
  const getInitialState = () => ({
    eventName: "",
    eventDate: "",
    eventTime: "",
    eventEndTime: "",   // ✅ NEW FIELD ADDED
    eventPlace: "",
    description: "",
    approvers: [],
  });

  const [values, setValues] = useState(getInitialState());
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // =========================
  // FETCH PLACES STATE
  // =========================
  const [places, setPlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [placesError, setPlacesError] = useState(null);

  // =========================
  // LOAD PLACES
  // =========================
  const fetchPlaces = async () => {
    setPlacesLoading(true);
    setPlacesError(null);

    try {
      const data = await getPlaces();
      setPlaces(data || []);

    } catch (err) {
      console.error("Places error:", err);
      setPlacesError(err.message || "Failed to load places");
    } finally {
      setPlacesLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  // =========================
  // SUBMIT EVENT
  // =========================
  const handleSubmit = async (payload) => {
    setLoading(true);

    try {
      const formData = new FormData();

      // =========================
      // MAIN FIELDS
      // =========================
      formData.append("eventName", payload.eventName || "");
      formData.append("eventDate", payload.eventDate || "");
      formData.append("eventTime", payload.eventTime || "");
      formData.append("eventEndTime", payload.eventEndTime || ""); // ✅ NEW FIELD
      formData.append("placeName", payload.eventPlace || "");
      formData.append("description", payload.description || "");

      // =========================
      // FILE
      // =========================
      if (file) {
        formData.append("letterPdf", file);
      }

      // =========================
      // APPROVERS
      // =========================
      (payload.approvers || []).forEach((a, i) => {
        formData.append(`approvers[${i}].order`, String(a.order ?? ""));
        formData.append(`approvers[${i}].name`, String(a.name ?? ""));
      });

      // =========================
      // DEBUG LOG
      // =========================
      console.log("🚀 EVENT REQUEST:");
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      // =========================
      // API CALL
      // =========================
      const text = await createEventAPI(formData);
      console.log("📩 RESPONSE:", text);

      alert(text || "Event created successfully!");

      // RESET FORM
      setValues(getInitialState());
      setFile(null);

    } catch (err) {
      console.error("❌ ERROR:", err);
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050b1a] p-6 space-y-8">

      {/* LOADING PLACES */}
      {placesLoading && (
        <p className="text-white">Loading places...</p>
      )}

      {/* ERROR PLACES */}
      {placesError && (
        <p className="text-red-400">{placesError}</p>
      )}

      {/* FORM */}
      <EventForm
        values={values}
        setValues={setValues}
        file={file}
        setFile={setFile}
        roleMap={roleMap}
        places={places}
        onSubmit={handleSubmit}
      />

      {/* LOADING OVERLAY */}
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