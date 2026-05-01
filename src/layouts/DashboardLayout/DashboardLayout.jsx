import { Outlet } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";

function DashboardLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className=" bg-gray-100 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
