import { Outlet, useLocation, useNavigate } from "react-router";
import { Home, FileText, Users, Package, User } from "lucide-react";

export function MobileLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/transaction", icon: FileText, label: "Transaction" },
    { path: "/customer", icon: Users, label: "Customer" },
    { path: "/stock", icon: Package, label: "Stock" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 shadow-lg">
        <nav className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center flex-1 gap-1 transition-colors"
              >
                <Icon
                  className={`w-6 h-6 ${
                    isActive ? "text-[#45C55D]" : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-xs ${
                    isActive
                      ? "text-[#45C55D] font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
