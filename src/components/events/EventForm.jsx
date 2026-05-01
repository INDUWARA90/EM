import { useEffect, useRef, useState } from "react";
import ApproversSection from "./ApproversSection";

function EventForm({ values, setValues, file, setFile, roleMap, onSubmit }) {
  const [places, setPlaces] = useState([]);
  const [loadingApprovers, setLoadingApprovers] = useState(false);
  const [placeMessage, setPlaceMessage] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [responsiblePersonData, setResponsiblePersonData] = useState(null);

  const fileInputRef = useRef(null);

  // =============================
  // 🔥 LOAD PLACES (GET)
  // =============================
useEffect(() => {
  const fetchPlaces = async () => {
    try {
      const res = await fetch("http://localhost:8081/api/places");

      const data = await res.json();

      console.log("PLACES:", data);

      setPlaces(data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchPlaces();
}, []);

  // =============================
  // RESET FORM SIDE EFFECTS
  // =============================
  useEffect(() => {
    if (values.eventName === "") {
      setPlaceMessage("");
      setResponsiblePersonData(null);
      setShowMessageModal(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [values.eventName]);

  const closeMessageModal = () => setShowMessageModal(false);

  // =============================
  // HANDLE CHANGE
  // =============================
  const handleChange = async (e) => {
    const { name, value } = e.target;

    let updatedValues = { ...values, [name]: value };

    if (name !== "eventPlace") {
      setValues(updatedValues);
      return;
    }

    // reset
    setPlaceMessage("");
    setShowMessageModal(false);
    setResponsiblePersonData(null);

    if (!value) {
      setValues({
        ...updatedValues,
        eventPlace: "",
        approvers: [],
      });
      return;
    }

    try {
      setLoadingApprovers(true);

      const res = await fetch(
        `http://localhost:8081/api/places/responsible-person?placeName=${encodeURIComponent(value)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = {};
      }

      console.log("RESPONSIBLE:", data);

      if (data?.responsiblePersonName) {
        setPlaceMessage(data.message || "");
        setResponsiblePersonData(data);
        setShowMessageModal(true);

        const existingApprovers = updatedValues.approvers || [];

        updatedValues = {
          ...updatedValues,
          eventPlace: value,
          approvers: [
            {
              order: 1,
              role: data.responsiblePersonName,
              name: data.responsiblePersonRegNumber,
            },
            ...existingApprovers.map((a) => ({
              ...a,
              order: a.order + 1,
            })),
          ],
        };
      }

    } catch (err) {
      console.error("Responsible person load error:", err);
    } finally {
      setLoadingApprovers(false);
    }

    setValues(updatedValues);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <>
      {/* ================= MODAL ================= */}
      {showMessageModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-[#0f172a] p-6 rounded-xl w-[350px] text-white">

            <h3 className="text-blue-400 font-bold mb-2">
              Approval Path Set
            </h3>

            <p className="text-sm mb-4">{placeMessage}</p>

            <p className="text-xs text-slate-400 mb-4">
              Person:{" "}
              <span className="text-blue-400 font-semibold">
                {responsiblePersonData?.responsiblePersonName}
              </span>
            </p>

            <button
              onClick={closeMessageModal}
              className="w-full bg-blue-600 py-2 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-[#0f172a] p-6 rounded-xl space-y-5 text-white"
      >

        {/* Event Name */}
        <input
          name="eventName"
          value={values.eventName}
          onChange={handleChange}
          placeholder="Event Name"
          className="w-full p-3 bg-white/5 rounded"
          required
        />

        {/* Date / Time / Place */}
        <div className="grid grid-cols-3 gap-4">

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

          <select
            name="eventPlace"
            value={values.eventPlace || ""}
            onChange={handleChange}
            className="p-3 bg-[#1e293b] rounded"
            required
          >
            <option value="">Select Place</option>

            {places.map((place, i) => (
              <option
                key={place.placeId || i}
                value={place.placeName || place.name}
              >
                {place.placeName || place.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-3 bg-white/5 rounded"
          required
        />

        {/* File */}
        <input
          type="file"
          ref={fileInputRef}
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full p-3 bg-white/5 rounded"
          required={!file}
        />

        {/* Approvers */}
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

        {/* Submit */}
        <button className="w-full bg-blue-600 py-3 rounded font-bold">
          Submit Event
        </button>
      </form>
    </>
  );
}

export default EventForm;