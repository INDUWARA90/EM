import { useEffect, useRef, useState } from "react";
import ApproversSection from "./ApproversSection";
import { getPlaces, getResponsiblePerson } from "../../api/eventService";

function EventForm({ values, setValues, file, setFile, roleMap, onSubmit }) {

  const [places, setPlaces] = useState([]);
  const [loadingApprovers, setLoadingApprovers] = useState(false);
  const fileInputRef = useRef(null);

  // =========================
  // LOAD PLACES
  // =========================
  useEffect(() => {
    const loadPlaces = async () => {
      try {
        const res = await getPlaces();
        setPlaces(res?.data || res || []);
      } catch (err) {
        console.error("Places load error:", err);
      }
    };

    loadPlaces();
  }, []);

  // =========================
  // RESET FILE INPUT
  // =========================
  useEffect(() => {
    if (!values.eventName && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [values.eventName]);
  const handleChange = async (e) => {
    const { name, value } = e.target;

    // =========================
    // NORMAL FIELDS
    // =========================
    if (name !== "eventPlace") {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));
      return;
    }

    // =========================
    // PLACE FIELD
    // =========================
    const placeValue = value || null;

    // 🔥 CASE 1: NO LOCATION SELECTED → CLEAR PIPELINE
    if (!placeValue) {
      setValues((prev) => ({
        ...prev,
        eventPlace: null,
        approvers: [], // ✅ CLEAR APPROVAL PIPELINE
      }));
      return;
    }

    // =========================
    // UPDATE PLACE FIRST
    // =========================
    setValues((prev) => ({
      ...prev,
      eventPlace: placeValue,
    }));

    // =========================
    // LOAD RESPONSIBLE PERSON
    // =========================
    setLoadingApprovers(true);

    try {
      const data = await getResponsiblePerson(placeValue);

      if (data?.responsiblePersonName) {

        setValues((prev) => {
          const existing = prev.approvers || [];

          return {
            ...prev,
            approvers: [
              {
                order: 1,
                role: data.responsiblePersonName,
                name: data.responsiblePersonRegNumber,
              },
              ...existing.map((a) => ({
                ...a,
                order: a.order + 1,
              })),
            ],
          };
        });
      }

    } catch (err) {
      console.error("Responsible person error:", err);
    } finally {
      setLoadingApprovers(false);
    }
  };

  // =========================
  // SUBMIT
  // =========================
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

        <input
          type="time"
          name="eventEndTime"
          value={values.eventEndTime}
          onChange={handleChange}
          className="p-3 bg-white/5 rounded"
          required
        />

        {/* PLACE SELECT (NULL SAFE) */}
        <select
          name="eventPlace"
          value={values.eventPlace || ""}
          onChange={handleChange}
          className="p-3 bg-[#1e293b] rounded"
        >
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
        {loadingApprovers && (
          <p className="text-blue-400">Loading approvers...</p>
        )}

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