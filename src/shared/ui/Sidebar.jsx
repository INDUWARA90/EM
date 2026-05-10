import { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  House,
  MapPin,
  PlusCircle,
  CalendarDays,
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  LogOut,
  Building2,
  UserPlus,
} from "lucide-react";

import { logoutUser } from "../api/endpoints";
import { hasRole } from "../utils/roles";

const readStoredUser = () => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

function Sidebar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => readStoredUser());

  const roles = user?.roles || [];
  const isAdmin = hasRole(roles, "ROLE_ADMIN");
  const isSecretary = hasRole(roles, "ROLE_SECRETARY");
  const isApprover = !["ROLE_SECRETARY", "ROLE_ADMIN", "ROLE_USER"].some((role) =>
    hasRole(roles, role)
  );

  const sections = useMemo(() => {
    const baseSections = [
      {
        title: "Public",
        items: [
          {
            name: "Landing",
            path: "/",
            icon: <House size={18} />,
            end: true,
          },
        ],
      },
      {
        title: "Workspace",
        items: [
          {
            name: "Create Event",
            path: "/dashboard/events",
            icon: <PlusCircle size={18} />,
          },
          {
            name: "Letter Box",
            path: "/dashboard/my-letters",
            icon: <Mail size={18} />,
          },
          {
            name: "Schedule",
            path: "/dashboard/calendar",
            icon: <CalendarDays size={18} />,
          },
          {
            name: "Facility Resources",
            path: "/dashboard/places",
            icon: <MapPin size={18} />,
          },
        ],
      },
    ];

    if (isApprover) {
      baseSections.push({
        title: "Review & Approvals",
        items: [
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
          },
        ],
      });
    }

    const managementItems = [
      ...(isSecretary
        ? [
            {
              name: "My Club",
              path: "/dashboard/my-club",
              icon: <Building2 size={18} />,
            },
          ]
        : []),
      ...(isAdmin
        ? [
            {
              name: "Club Create",
              path: "/dashboard/club-create",
              icon: <Building2 size={18} />,
            },
            {
              name: "Create User",
              path: "/dashboard/users-create",
              icon: <UserPlus size={18} />,
            },
          ]
        : []),
    ];

    if (managementItems.length > 0) {
      baseSections.push({
        title: "Management",
        items: managementItems,
      });
    }

    return baseSections;
  }, [isAdmin, isApprover, isSecretary]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <div className="w-72 bg-slate-900 min-h-screen flex flex-col border-r border-slate-800/50">
      <div className="p-8 mb-4">
        <h2 className="text-xl font-black text-white tracking-tight uppercase italic">
          Event<span className="text-emerald-500">Flow</span>
        </h2>
        <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase mt-1">
          Management System
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-6 overflow-y-auto">
        {sections.map((section) => (
          <SidebarSection key={section.title} title={section.title} items={section.items} />
        ))}
      </nav>

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

          <button
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-red-400 transition-colors"
            aria-label="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

const SidebarSection = ({ title, items }) => (
  <div className="space-y-2">
    <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">{title}</p>
    <div className="space-y-1">
      {items.map((item) => (
        <SidebarLink key={item.path} item={item} />
      ))}
    </div>
  </div>
);

const SidebarLink = ({ item }) => (
  <NavLink
    to={item.path}
    end={item.end}
    className={({ isActive }) =>
      `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
        isActive
          ? "bg-emerald-600/10 text-emerald-500 border border-emerald-500/20"
          : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
      }`
    }
  >
    {({ isActive }) => (
      <>
        <div className="flex items-center gap-3">
          <span
            className={`${
              isActive ? "text-emerald-500" : "text-slate-500 group-hover:text-slate-300"
            } transition-colors`}
          >
            {item.icon}
          </span>
          <span className="text-sm font-bold tracking-tight">{item.name}</span>
        </div>

        {isActive && (
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
        )}
      </>
    )}
  </NavLink>
);

export default Sidebar;
