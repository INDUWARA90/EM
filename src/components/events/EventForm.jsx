import { useEffect, useRef, useState } from "react";
import ApproversSection from "./ApproversSection";

function EventForm({ values, setValues, file, setFile, roleMap, onSubmit }) {

  const [places, setPlaces] = useState([]);
  const fileInputRef = useRef(null);

  // 📍 LOAD PLACES
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const res = await fetch("http://localhost:8081/api/places", {
          credentials: "include",
        });

        const data = await res.json();
        setPlaces(data || []);

      } catch (err) {
        console.error("Places error:", err);
      }
    };

    fetchPlaces();
  }, []);

  // RESET FILE INPUT
  useEffect(() => {
    if (!values.eventName && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [values.eventName]);

  // INPUT HANDLER
  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues({
      ...values,
      [name]: name === "eventPlace" ? (value || null) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-[#0f172a] p-6 rounded-xl space-y-5 text-white"
    >

      {/* EVENT NAME */}
      <input
        name="eventName"
        value={values.eventName}
        onChange={handleChange}
        placeholder="Event Name"
        className="w-full p-3 bg-white/5 rounded"
        required
      />

      {/* GRID */}
      <div className="grid grid-cols-4 gap-3">

        <input
          type="date"
          name="eventDate"
          value={values.eventDate}
          onChange={handleChange}
          className="p-3 bg-white/5 rounded"
          required
        />

        <input
          type="time"
          name="eventTime"
          value={values.eventTime}
          onChange={handleChange}
          className="p-3 bg-white/5 rounded"
          required
        />

        {/* END TIME */}
        <input
          type="time"
          name="eventEndTime"
          value={values.eventEndTime}
          onChange={handleChange}
          className="p-3 bg-white/5 rounded"
          required
        />

        {/* PLACE DROPDOWN */}
        <select
          name="eventPlace"
          value={values.eventPlace || ""}
          onChange={handleChange}
          className="p-3 bg-[#1e293b] rounded"
        >
          {/* 🔥 IMPORTANT: NULL OPTION */}
          <option value="">No Location</option>

          {places.map((p) => (
            <option key={p.placeId} value={p.placeName}>
              {p.placeName}
            </option>
          ))}
        </select>

      </div>

      {/* DESCRIPTION */}
      <textarea
        name="description"
        value={values.description}
        onChange={handleChange}
        className="w-full p-3 bg-white/5 rounded"
        required
      />

      {/* FILE */}
      <input
        type="file"
        ref={fileInputRef}
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full p-3 bg-white/5 rounded"
      />

      {/* APPROVERS */}
      <div className="bg-white/5 p-4 rounded">
        <ApproversSection
          approvers={values.approvers || []}
          setValues={setValues}
          roleMap={roleMap}
        />
      </div>

      {/* SUBMIT */}
      <button className="w-full bg-blue-600 py-3 rounded font-bold">
        Submit Event
      </button>

    </form>
  );
}

export default EventForm;