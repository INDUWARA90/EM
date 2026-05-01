import React, { useEffect, useState } from "react";
import { getCalendarEvents } from "../../api/eventService";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { Calendar as CalendarIcon, MapPin, Clock, X, Info, Sparkles } from "lucide-react";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getCalendarEvents();
        const list = Array.isArray(data) ? data : data?.data || [];
        const mapped = list.map((e) => ({
          id: e.calendarEventId,
          title: e.title,
          start: new Date(`${e.eventDate}T${e.eventTime}`),
          end: e.endTime ? new Date(`${e.eventDate}T${e.endTime}`) : new Date(new Date(`${e.eventDate}T${e.eventTime}`).getTime() + 60 * 60 * 1000),
          location: e.placeName,
          description: e.description,
        }));
        setEvents(mapped);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, []);

  // Updated Styling for Slate 900: Cyan/Indigo accents
  const eventPropGetter = () => ({
    className: "!bg-cyan-500/10 !border-l-2 !border-l-cyan-400 !border-y-0 !border-r-0 !text-cyan-100 !text-[11px] !font-medium !px-2 !py-1 !shadow-sm",
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6 md:p-10 selection:bg-cyan-500/30">
      
      {/* 🌌 BACKGROUND GLOWS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-cyan-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10 space-y-10">
        
        {/* 🛰️ HEADER */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-cyan-400">
              <Sparkles size={14} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Live Timeline</span>
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-white">
              Event <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Calendar</span>
            </h1>
          </div>
          
          <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 p-4 rounded-2xl flex items-center gap-6">
            <div className="text-right">
              <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest leading-none mb-1">System Pulse</p>
              <p className="text-white font-mono text-xl tabular-nums leading-none tracking-wider">
                {format(now, "HH:mm:ss")}
              </p>
            </div>
            <div className="h-8 w-[1px] bg-slate-700" />
            <div className="text-right">
              <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest leading-none mb-1">Active Now</p>
              <p className="text-white font-bold text-xl leading-none">{events.length}</p>
            </div>
          </div>
        </header>

        {/* 🗓️ CALENDAR GRID */}
        <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-800 rounded-[2rem] p-4 md:p-8 shadow-2xl">
          <style>{`
            .rbc-calendar { color: #94a3b8; font-family: inherit; }
            .rbc-header { padding: 16px !important; font-weight: 700 !important; text-transform: uppercase; font-size: 10px; letter-spacing: 0.1em; color: #475569; border-bottom: 1px solid #1e293b !important; }
            .rbc-month-view, .rbc-time-view { border: 1px solid #1e293b !important; background: transparent !important; border-radius: 1.5rem; overflow: hidden; }
            .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #1e293b !important; }
            .rbc-month-row + .rbc-month-row { border-top: 1px solid #1e293b !important; }
            .rbc-off-range-bg { background: rgba(15, 23, 42, 0.4) !important; }
            .rbc-today { background: rgba(34, 211, 238, 0.03) !important; }
            .rbc-toolbar button { color: #94a3b8 !important; border: 1px solid #1e293b !important; background: #0f172a !important; border-radius: 10px !important; text-transform: uppercase; font-size: 10px; font-weight: 700; padding: 8px 16px !important; margin: 2px !important; transition: all 0.2s; }
            .rbc-toolbar button:hover { background: #1e293b !important; color: white !important; }
            .rbc-toolbar button.rbc-active { background: #06b6d4 !important; color: #0f172a !important; border-color: #06b6d4 !important; }
            .rbc-toolbar-label { font-weight: 800; font-size: 1.4rem; color: white; letter-spacing: -0.02em; }
            .rbc-show-more { color: #06b6d4 !important; font-weight: bold; font-size: 10px; }
          `}</style>

          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 750 }}
            onSelectEvent={(event) => setSelected(event)}
            eventPropGetter={eventPropGetter}
          />
        </div>

        {/* 📌 DETAIL MODAL */}
        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setSelected(null)} />
            
            <div className="relative bg-slate-900 border border-slate-700 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl">
              <div className="h-1.5 bg-gradient-to-r from-cyan-500 to-indigo-500" />
              
              <div className="p-10 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="bg-cyan-500/10 text-cyan-400 p-4 rounded-2xl border border-cyan-500/20">
                    <Info size={28} />
                  </div>
                  <button onClick={() => setSelected(null)} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-500 hover:text-white">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-3">
                  <h3 className="text-3xl font-bold text-white tracking-tight leading-tight">
                    {selected.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {selected.description || "No specific details logged for this timeline event."}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-6 border-t border-slate-800">
                  <ModalDetail icon={<MapPin />} label="Target Venue" value={selected.location} />
                  <ModalDetail icon={<Clock />} label="Time Slot" value={format(selected.start, "PPP p")} />
                </div>

                <button
                  type="button"
                  className="w-full bg-white hover:bg-cyan-50 text-slate-900 font-bold py-5 rounded-2xl transition-all active:scale-[0.98] uppercase tracking-widest text-xs shadow-lg"
                  onClick={() => setSelected(null)}
                >
                  Dismiss Detail
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ModalDetail({ icon, label, value }) {
  return (
    <div className="flex items-center gap-5 p-4 rounded-2xl bg-slate-800/40 border border-slate-800 group transition-all hover:border-slate-700">
      <div className="text-cyan-400 transition-transform group-hover:scale-110 duration-300">
        {React.isValidElement(icon) ? React.cloneElement(icon, { size: 20 }) : icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1">{label}</p>
        <p className="text-slate-200 font-semibold">{value || "Unspecified"}</p>
      </div>
    </div>
  );
}

export default CalendarPage;