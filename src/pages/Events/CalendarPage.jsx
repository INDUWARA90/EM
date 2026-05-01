import { useState } from "react";
import { MapPin, Clock, X, Info } from "lucide-react";
import { UserCircle, ArrowRight } from "lucide-react";

function CalendarPage() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    { id: 1, title: "Tech Conference", day: 5, time: "10:00 AM", location: "Colombo", description: "A technology event for developers and students." },
    { id: 2, title: "Music Night", day: 12, time: "6:30 PM", location: "Galle", description: "Live music night with guest artists." },
    { id: 3, title: "Workshop", day: 12, time: "2:00 PM", location: "Matara", description: "Frontend workshop for beginners." },
    { id: 4, title: "Meetup", day: 20, time: "4:00 PM", location: "Kandy", description: "Community meetup for networking." },
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen">
      {/* Header Area */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Calendar</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            April 2026 — Track your upcoming schedules.
          </p>
        </div>

        <button
          onClick={() => window.location.href = '/login'} // Replace with your routing logic (e.g., navigate('/login'))
          className="group flex items-center justify-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-2xl shadow-sm hover:border-emerald-200 hover:bg-emerald-50 transition-all duration-300"
        >
          <div className="p-1 bg-slate-100 group-hover:bg-white rounded-lg transition-colors">
            <UserCircle size={18} className="text-slate-500 group-hover:text-emerald-600" />
          </div>
          <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-700">
            Access Portal
          </span>
          <ArrowRight size={14} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
          {daysOfWeek.map((day) => (
            <div key={day} className="py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-7 auto-rows-[120px]">
          {Array.from({ length: 30 }).map((_, i) => {
            const day = i + 1;
            const dayEvents = events.filter((e) => e.day === day);
            const isToday = day === 13; // Example: Highlighting current date

            return (
              <div
                key={day}
                className={`p-2 border-r border-b border-slate-50 flex flex-col group hover:bg-slate-50/30 transition-colors ${(i + 1) % 7 === 0 ? "border-r-0" : ""
                  }`}
              >
                <span className={`text-sm font-semibold mb-1 w-7 h-7 flex items-center justify-center rounded-full transition-colors ${isToday ? "bg-emerald-600 text-white" : "text-slate-400 group-hover:text-slate-800"
                  }`}>
                  {day}
                </span>

                <div className="space-y-1 overflow-y-auto custom-scrollbar">
                  {dayEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className="w-full text-left bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-1 rounded-md text-[10px] font-medium hover:bg-emerald-100 transition-all truncate"
                    >
                      {event.title}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- Details Modal --- */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
                  <Info size={24} />
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <h3 className="text-2xl font-bold text-slate-800 mb-2">{selectedEvent.title}</h3>

              <div className="space-y-4 my-6">
                <div className="flex items-center gap-3 text-slate-600">
                  <Clock size={18} className="text-emerald-500" />
                  <span className="text-sm font-medium">Day {selectedEvent.day} at {selectedEvent.time}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <MapPin size={18} className="text-emerald-500" />
                  <span className="text-sm font-medium">{selectedEvent.location}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedEvent(null)}
                className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarPage;