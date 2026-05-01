import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, Ticket, ChevronRight } from "lucide-react";

function Sidebar() {
  const location = useLocation();
  const [user, setUser] = useState(null);

  // ✅ Load user from localStorage instead of API
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Invalid user in localStorage", err);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const roles = user?.roles || [];
  const isSecretary = roles.includes("ROLE_SECRETARY");

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Events", path: "/dashboard/events", icon: <Ticket size={20} /> },
    { name: "Calendar", path: "/dashboard/calendar", icon: <Calendar size={20} /> },
    { name: "Letter Box", path: "/dashboard/my-letters", icon: <Calendar size={20} /> },
  ];

  if (!isSecretary) {
    menuItems.push(
      { name: "To Be Approved", path: "/dashboard/to-approve", icon: <Calendar size={20} /> },
      { name: "Approved By Me", path: "/dashboard/approved-by-me", icon: <Calendar size={20} /> },
      { name: "Rejected By Me", path: "/dashboard/rejected-by-me", icon: <Calendar size={20} /> }
    );
  }

  return (
    <div className="w-64 bg-slate-900 min-h-screen flex flex-col border-r border-slate-800">

      <div className="p-6 mb-4">
        <h2 className="text-xl font-bold text-white">
          Event Planning
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-semibold text-sm">{item.name}</span>
              </div>

              {isActive && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 mt-auto">
        <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl">

          <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold uppercase">
            {user?.username?.charAt(0) || "U"}
          </div>

          <div className="flex flex-col">
            <span className="text-white text-sm font-semibold">
              {user?.username || "Unknown User"}
            </span>
            <span className="text-slate-400 text-xs">
              {user?.regNumber || "N/A"}
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Sidebar;