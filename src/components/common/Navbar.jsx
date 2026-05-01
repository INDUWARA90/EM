import { LogOut, LayoutDashboard, Calendar, Ticket, UserCircle } from 'lucide-react';

function Navbar() {
  // Usually, you'd use a routing library like react-router-dom here
  const navLinks = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, active: true },
    { name: 'Events', icon: <Ticket size={18} />, active: false },
    { name: 'Calendar', icon: <Calendar size={18} />, active: false },
  ];

  return (
    <nav className="bg-white border-b border-slate-100 px-6 py-3 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <div className="w-5 h-5 border-2 border-white rounded-sm rotate-45" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">
            Event<span className="text-emerald-600">Sync</span>
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-slate-50 p-1 rounded-xl">
          {navLinks.map((link) => (
            <button
              key={link.name}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                link.active 
                  ? "bg-white text-emerald-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {link.icon}
              {link.name}
            </button>
          ))}
        </div>

        {/* Profile & Logout */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-right">
            <p className="text-xs font-bold text-slate-800 leading-none">Admin User</p>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Super Admin</p>
          </div>
          
          <div className="h-8  bg-slate-100 mx-1 hidden sm:block" />

          <button className="group flex items-center justify-center p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
            <LogOut size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;