import { User, Settings, RefreshCw, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function Profile() {
  const navigate = useNavigate();

  const menuItems = [
    { icon: User, label: "Account", description: "Manage your account settings", path: "#" },
    { icon: Settings, label: "Settings", description: "App preferences and configurations", path: "#" },
    { icon: RefreshCw, label: "Sync Data", description: "Synchronize with server", path: "#" },
    { icon: HelpCircle, label: "Help", description: "Get support and documentation", path: "#" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-5 border-b border-gray-100 rounded-b-2xl shadow-xs mb-4">
        <h1 className="text-lg font-bold text-gray-900">Profile</h1>
        <p className="text-xs text-gray-500 mt-1">Kelola data profil dan preferensi akun Anda</p>
      </div>

      {/* Profile Card */}
      <div className="px-4 mb-5">
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-[#45C55D] text-white text-2xl">SA</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl mb-1">Sales Andi</h2>
                <p className="text-sm text-gray-500 mb-2">Employee ID: EMP-2024-001</p>
                <Badge className="bg-[#45C55D] hover:bg-[#38A34A] text-xs">Active</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">Department</p>
                <p className="text-sm">Sales Team</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">Territory</p>
                <p className="text-sm">East Surabaya</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <div className="px-4 mb-5">
        <h3 className="text-base mb-3">This Month Performance</h3>
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Sales</p>
                <p className="text-lg text-[#45C55D]">Rp 125.5M</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Target</p>
                <p className="text-lg">83.6%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Customers</p>
                <p className="text-lg">86</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Visits</p>
                <p className="text-lg">142</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Items */}
      <div className="px-4 mb-5">
        <h3 className="text-base mb-3">Menu</h3>
        <div className="space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                key={index}
                className="border-0 shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-0.5">{item.label}</h4>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* App Info */}
      <div className="px-4 mb-5">
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">App Version</span>
              <span className="text-sm">1.0.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last Sync</span>
              <span className="text-sm">23 Jun 2026, 10:30</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logout Button */}
      <div className="px-4 mb-8">
        <Button
          variant="outline"
          onClick={() => {
            localStorage.removeItem("salesCode");
            toast.success("Berhasil keluar.");
            navigate("/login", { replace: true });
          }}
          className="w-full h-12 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
