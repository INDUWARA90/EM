import React, { useEffect, useRef, useState } from "react";
import ApproversSection from "./ApproversSection";
import { getPlaces, getResponsiblePerson } from "../../../api/eventService";
import { Calendar, Clock, MapPin, AlignLeft, FileText, Send, Loader2, AlertCircle } from "lucide-react";

function EventForm({ values, setValues, setFile, roleMap, onSubmit }) {
  const [places, setPlaces] = useState([]);
  const [loadingApprovers, setLoadingApprovers] = useState(false);
  const fileInputRef = useRef(null);

  // Load Places on mount
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

  // Reset file input if eventName is cleared
  useEffect(() => {
    if (!values.eventName && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [values.eventName]);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    // 1. Handle non-venue inputs normally
    if (name !== "eventPlace") {
      setValues((prev) => ({ ...prev, [name]: value }));
      return;
    }

    // 2. Handle Venue Selection
    const placeValue = value === "" ? null : value;

    // IF USER SELECTS "SELECT..." OR "NO LOCATION"
    if (!placeValue) {
      setValues((prev) => ({
        ...prev,
        eventPlace: null,
        approvers: [], // 🔥 CRITICAL: Purges the pipeline if no location
      }));
      return;
    }

    // IF USER SELECTS A VALID LOCATION
    setValues((prev) => ({ ...prev, eventPlace: placeValue }));
    setLoadingApprovers(true);

    try {
      const data = await getResponsiblePerson(placeValue);
      if (data?.responsiblePersonName) {
        setValues((prev) => {
          // When changing locations, we clear existing automated approvers 
          // to ensure the new location's head is Step 1.
          return {
            ...prev,
            approvers: [
              {
                order: 1,
                role: data.responsiblePersonName,
                name: data.responsiblePersonRegNumber,
              },
            ],
          };
        });
      }
    } catch (err) {
      console.error("Responsible person error:", err);
      // Clear list on error to prevent unauthorized location approval
      setValues((prev) => ({ ...prev, approvers: [] }));
    } finally {
      setLoadingApprovers(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-8 rounded-[2rem] space-y-6 text-slate-200 shadow-2xl"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-700 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white leading-none">Draft Request</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">create you event approval</p>
          </div>
        </div>
      </div>

      {/* EVENT NAME */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Event Title</label>
        <input
          name="eventName"
          value={values.eventName}
          onChange={handleChange}
          placeholder="Enter event designation..."
          className="w-full p-4 bg-slate-900/50 border border-slate-700 rounded-2xl focus:outline-none focus:border-cyan-500/50 transition-all text-white"
          required
        />
      </div>

      {/* LOGISTICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FormField label="Date" icon={<Calendar size={14} />}>
          <input
            type="date"
            name="eventDate"
            value={values.eventDate}
            onChange={handleChange}
            className="w-full bg-transparent focus:outline-none text-white"
            required
          />
        </FormField>

        <FormField label="Start" icon={<Clock size={14} />}>
          <input
            type="time"
            name="eventTime"
            value={values.eventTime}
            onChange={handleChange}
            className="w-full bg-transparent focus:outline-none text-white"
            required
          />
        </FormField>

        <FormField label="End" icon={<Clock size={14} />}>
          <input
            type="time"
            name="eventEndTime"
            value={values.eventEndTime}
            onChange={handleChange}
            className="w-full bg-transparent focus:outline-none text-white"
            required
          />
        </FormField>

        <FormField label="Venue" icon={<MapPin size={14} />}>
          <select
            name="eventPlace"
            value={values.eventPlace || ""}
            onChange={handleChange}
            className="w-full bg-transparent focus:outline-none cursor-pointer appearance-none text-white"
          >
            <option value="" className="bg-slate-900 text-slate-400 italic">Without Location</option>
            {places.map((p) => (
              <option key={p.placeId} value={p.placeName} className="bg-slate-900 text-white">
                {p.placeName}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Description</label>
        <div className="relative">
          <AlignLeft className="absolute left-4 top-4 text-slate-500" size={18} />
          <textarea
            name="description"
            rows="3"
            value={values.description}
            onChange={handleChange}
            placeholder="Describe the scope of the event..."
            className="w-full p-4 pl-12 bg-slate-900/50 border border-slate-700 rounded-2xl focus:outline-none focus:border-cyan-500/50 transition-all text-white resize-none"
            required
          />
        </div>
      </div>

      {/* FILE UPLOAD */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Documentation (PDF)</label>
        <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/30 rounded-2xl p-4 transition-all bg-slate-900/20 group text-center">
          <input
            type="file"
            ref={fileInputRef}
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 text-slate-500 text-sm w-full"
          />
        </div>
      </div>

      {/* PIPELINE SECTION */}
      <div className="bg-slate-900/40 border border-slate-700/50 rounded-2xl overflow-hidden shadow-inner">
        <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/20">
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Approval Pipeline</span>
            
          </div>
          {loadingApprovers && (
            <div className="flex items-center gap-2 text-cyan-400 animate-pulse text-[10px] font-bold">
              <Loader2 size={12} className="animate-spin" /> SYNCHRONIZING
            </div>
          )}
        </div>
        <div className="p-4 min-h-[100px]">
          <ApproversSection
            approvers={values.approvers || []}
            setValues={setValues}
            roleMap={roleMap}
          />
        </div>
      </div>

      {/* SUBMIT */}
      <button 
        type="submit"
        className="w-full bg-white hover:bg-cyan-50 text-slate-900 py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/5 transition-all active:scale-[0.98]"
      >
        <Send size={18} />
        Send Request
      </button>
    </form>
  );
}

// Reusable Input Wrapper
function FormField({ label, icon, children }) {
  return (
    <div className="space-y-1.5 flex-1">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <div className="flex items-center gap-2 p-3 bg-slate-900/50 border border-slate-700 rounded-2xl focus-within:border-cyan-500/50 transition-all">
        <div className="text-slate-500 shrink-0">{icon}</div>
        <div className="text-sm w-full">{children}</div>
      </div>
    </div>
  );
}

export default EventForm;
