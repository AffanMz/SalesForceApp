import { useNavigate } from "react-router";
import { Store, MapPin, FileText, RotateCcw, DollarSign, ChevronRight } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";

export function Transaction() {
  const navigate = useNavigate();

  const transactionMenus = [
    {
      id: 1,
      icon: Store,
      label: "New Order Outlet",
      description: "Register a new customer outlet",
      color: "bg-blue-500",
      path: "/customer/new",
    },
    {
      id: 2,
      icon: MapPin,
      label: "Presence / Call Plan",
      description: "Check-in to customer location",
      color: "bg-green-500",
      path: "/",
    },
    {
      id: 3,
      icon: FileText,
      label: "Sales Order",
      description: "Manage sales orders",
      color: "bg-purple-500",
      path: "/sales-order?type=so",
    },
    {
      id: 4,
      icon: RotateCcw,
      label: "Retur",
      description: "Process product returns",
      color: "bg-orange-500",
      path: "/sales-order?type=retur",
    },
    {
      id: 5,
      icon: DollarSign,
      label: "Pelunasan",
      description: "Customer payment collection",
      color: "bg-emerald-500",
      path: "/pelunasan",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-5 border-b border-gray-100 rounded-b-2xl shadow-xs mb-4">
        <h1 className="text-lg font-bold text-gray-900">Transaction</h1>
        <p className="text-xs text-gray-500 mt-1">Kelola seluruh transaksi harian Anda</p>
      </div>

      {/* Transaction Menu Grid */}
      <div className="px-4 pb-5">
        <div className="space-y-3">
          {transactionMenus.map((menu) => {
            const Icon = menu.icon;
            return (
              <Card
                key={menu.id}
                className="border-0 shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
                onClick={() => navigate(menu.path)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 ${menu.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-0.5">{menu.label}</h3>
                      <p className="text-xs text-gray-500">{menu.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
