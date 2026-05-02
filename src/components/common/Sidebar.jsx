import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  MapPin, 
  PlusCircle, 
  CalendarDays, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  Clock,
  LogOut
} from "lucide-react";

import { logoutUser } from "../../api/endpoints";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const roles = user?.roles || [];

  // Logic: Hide for Secretary
  const hiddenRoles = ["ROLE_SECRETARY"];
  const showApprovalMenu = !roles.some((role) => hiddenRoles.includes(role));

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Facility Resources",
      path: "/dashboard/places",
      icon: <MapPin size={18} />,
    },
    {
      name: "Create Event",
      path: "/dashboard/events",
      icon: <PlusCircle size={18} />,
    },
    {
      name: "Schedule",
      path: "/dashboard/calendar",
      icon: <CalendarDays size={18} />,
    },
    {
      name: "Letter Box",
      path: "/dashboard/my-letters",
      icon: <Mail size={18} />,
    },
  ];

  const approvalItems = [
    {
      name: "To Be Approved",
      path: "/dashboard/to-approve",
      icon: <Clock size={18} />,
    },
    {
      name: "Approved By Me",
      path: "/dashboard/approved-by-me",
      icon: <CheckCircle2 size={18} />,
    },
    {
      name: "Rejected By Me",
      path: "/dashboard/rejected-by-me",
      icon: <XCircle size={18} />,
    }
  ];

  // ✅ LOGOUT FUNCTION
  const handleLogout = async () => {
    try {
      await logoutUser(); // API call
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // clear frontend state
      localStorage.removeItem("user");
      localStorage.removeItem("token"); // if used
      setUser(null);

      // redirect to login
      navigate("/login");
    }
  };

  return (
    <div className="w-72 bg-slate-900 min-h-screen flex flex-col border-r border-slate-800/50">
      
      {/* Brand Header */}
      <div className="p-8 mb-4">
        <h2 className="text-xl font-black text-white tracking-tight uppercase italic">
          Event<span className="text-emerald-500">Flow</span>
        </h2>
        <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase mt-1">
          Management System
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">
          Main Menu
        </p>

        {menuItems.map((item) => (
          <SidebarLink key={item.path} item={item} active={location.pathname === item.path} />
        ))}

        {showApprovalMenu && (
          <div className="mt-8 pt-4 border-t border-slate-800/50">
            <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">
              Review & Approvals
            </p>
            {approvalItems.map((item) => (
              <SidebarLink key={item.path} item={item} active={location.pathname === item.path} />
            ))}
          </div>
        )}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-slate-800 mt-auto bg-slate-950/30">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/40 border border-white/5">
          
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg">
            {user?.username?.charAt(0) || "U"}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-bold truncate">
              {user?.username || "Guest User"}
            </p>
            <p className="text-slate-500 text-[10px] font-medium truncate uppercase tracking-tighter">
              {user?.regNumber || "ID Unknown"}
            </p>
          </div>

          {/* ✅ LOGOUT BUTTON */}
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-red-400 transition-colors"
          >
            <LogOut size={16} />
          </button>

        </div>
      </div>
    </div>
  );
}

// Sidebar Link Component
const SidebarLink = ({ item, active }) => (
  <Link
    to={item.path}
    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
      active
        ? "bg-emerald-600/10 text-emerald-500 border border-emerald-500/20"
        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
    }`}
  >
    <div className="flex items-center gap-3">
      <span className={`${active ? "text-emerald-500" : "text-slate-500 group-hover:text-slate-300"} transition-colors`}>
        {item.icon}
      </span>
      <span className="text-sm font-bold tracking-tight">
        {item.name}
      </span>
    </div>

    {active && (
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
    )}
  </Link>
);

export default Sidebar;