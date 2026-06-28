import { Outlet, useLocation, Link, Navigate } from "react-router";
import { Home, FileText, Users, Package, User } from "lucide-react";

export function Layout() {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem("salesCode");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }


  const navItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/transaction", icon: FileText, label: "Transaction" },
    { path: "/customer", icon: Users, label: "Customer" },
    { path: "/stock", icon: Package, label: "Stock" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const showBottomNav = ["/", "/transaction", "/customer", "/stock", "/profile"].includes(location.pathname);

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50">
      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto ${showBottomNav ? "pb-20" : "pb-4"}`}>
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto z-50">
          <div className="flex justify-around items-center h-16 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center justify-center gap-1 min-w-[60px] flex-1"
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      active ? "text-[#45C55D]" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-xs transition-colors ${
                      active ? "text-[#45C55D]" : "text-gray-500"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
