import { useEffect, useState } from "react";
import { MapPin, Clock, X, Info } from "lucide-react";
import { UserCircle, ArrowRight } from "lucide-react";

function CalendarPage() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          "http://localhost:8081/api/calender/events",
          {
            method: "GET",
            credentials: "include",
          }
        );

        console.log("STATUS:", res.status);

        const text = await res.text();
        console.log("RAW RESPONSE:", text);

        if (!res.ok) {
          throw new Error(text || `HTTP ${res.status}`);
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch {
          data = [];
        }

        console.log("CALENDAR DATA:", data);

        setEvents(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        console.error("Calendar error:", err.message);
        setEvents([]);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen">

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800">
            Calendar
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Event schedule overview
          </p>
        </div>

        <button className="flex items-center gap-2 bg-white border px-5 py-2 rounded-xl">
          <UserCircle size={18} />
          Access Portal
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl border overflow-hidden">

        {/* Days */}
        <div className="grid grid-cols-7 border-b bg-slate-50">
          {daysOfWeek.map((day) => (
            <div key={day} className="py-3 text-center text-xs font-bold text-slate-400">
              {day}
            </div>
          ))}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-7 auto-rows-[120px]">
          {Array.from({ length: 30 }).map((_, i) => {
            const day = i + 1;
            const dayEvents = events.filter((e) => e.day === day);

            return (
              <div key={day} className="p-2 border">
                <div className="text-sm font-semibold">{day}</div>

                {dayEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="block w-full text-left text-xs bg-emerald-100 mt-1 p-1 rounded"
                  >
                    {event.title}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px]">

            <div className="flex justify-between">
              <h3 className="font-bold">{selectedEvent.title}</h3>
              <button onClick={() => setSelectedEvent(null)}>
                <X />
              </button>
            </div>

            <p className="text-sm mt-2">{selectedEvent.description}</p>

            <div className="mt-3 text-sm">
              <p><Clock size={14} /> {selectedEvent.time}</p>
              <p><MapPin size={14} /> {selectedEvent.location}</p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default CalendarPage;