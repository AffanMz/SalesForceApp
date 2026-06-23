import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Search, Filter, MapPin, ChevronRight, Plus, X } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";

type CustomerItem = {
  id: number;
  name: string;
  address: string;
  balance: number;
  creditLimit: number;
  outstanding: number;
  type: string;
  phone: string;
};

export function Customer() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    area: "all",
    route: "all",
    customerType: "all",
    paymentStatus: "all",
    creditLimit: "all",
    outstanding: "all",
  });

  // Stateful customers loaded from/saved to localStorage for cross-page persistence
  const [customers, setCustomers] = useState<CustomerItem[]>(() => {
    const saved = localStorage.getItem("customers");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 1,
        name: "PT Maju Jaya",
        address: "Jl. Gatot Subroto No. 123, Surabaya",
        balance: 10000000,
        creditLimit: 15000000,
        outstanding: 5000000,
        type: "distributor",
        phone: "081234567890",
      },
      {
        id: 2,
        name: "Toko Sumber Rejeki",
        address: "Jl. Merdeka No. 45, Surabaya",
        balance: 8500000,
        creditLimit: 10000000,
        outstanding: 2500000,
        type: "retail",
        phone: "081298765432",
      },
      {
        id: 3,
        name: "UD Maju Bersama",
        address: "Jl. Ahmad Yani No. 123, Surabaya",
        balance: 12000000,
        creditLimit: 20000000,
        outstanding: 8200000,
        type: "wholesaler",
        phone: "081255554444",
      },
      {
        id: 4,
        name: "CV Cahaya Terang",
        address: "Jl. Basuki Rahmat No. 89, Surabaya",
        balance: 15000000,
        creditLimit: 25000000,
        outstanding: 12500000,
        type: "distributor",
        phone: "081266667777",
      },
      {
        id: 5,
        name: "Toko Sejahtera",
        address: "Jl. Diponegoro No. 67, Surabaya",
        balance: 5000000,
        creditLimit: 8000000,
        outstanding: 3400000,
        type: "retail",
        phone: "081211112222",
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("customers", JSON.stringify(customers));
  }, [customers]);

  // Handle URL Trigger ?action=new-outlet
  const isNewOutletAction = searchParams.get("action") === "new-outlet";

  useEffect(() => {
    if (isNewOutletAction) {
      navigate("/customer/new", { replace: true });
    }
  }, [isNewOutletAction, navigate]);

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  const getUtilizationColor = (outstanding: number, limit: number) => {
    const percentage = limit > 0 ? (outstanding / limit) * 100 : 0;
    if (percentage > 80) return "text-red-600 font-semibold";
    if (percentage > 60) return "text-orange-600 font-semibold";
    return "text-green-600 font-semibold";
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    // Apply filters
    if (filters.customerType !== "all" && customer.type !== filters.customerType) return false;
    
    if (filters.creditLimit !== "all") {
      const limit = customer.creditLimit;
      if (filters.creditLimit === "low" && limit >= 10000000) return false;
      if (filters.creditLimit === "medium" && (limit < 10000000 || limit > 20000000)) return false;
      if (filters.creditLimit === "high" && limit <= 20000000) return false;
    }

    if (filters.outstanding !== "all") {
      const debt = customer.outstanding;
      if (filters.outstanding === "low" && debt >= 5000000) return false;
      if (filters.outstanding === "medium" && (debt < 5000000 || debt > 10000000)) return false;
      if (filters.outstanding === "high" && debt <= 10000000) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white px-4 py-5 shadow-xs border-b border-gray-100 rounded-b-2xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-bold text-gray-900">Customer</h1>
          <Button
            onClick={() => navigate("/customer/new")}
            className="bg-[#45C55D] hover:bg-[#38A34A] text-white rounded-xl h-10 border-0 cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Outlet Baru
          </Button>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari nama atau alamat outlet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9.5 h-10 rounded-xl bg-gray-50 border-0 focus-visible:ring-1 focus-visible:ring-[#45C55D] placeholder:text-gray-400 text-sm"
            />
          </div>

          {/* Filter Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-gray-200 hover:bg-gray-50 cursor-pointer">
                <Filter className="w-4 h-4 text-gray-600" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-[2.5rem] max-h-[85vh] overflow-y-auto bg-white border-0 shadow-2xl p-6">
              <SheetHeader className="pb-4 border-b border-gray-100 flex flex-row items-center justify-between">
                <SheetTitle className="text-lg font-bold text-gray-900">Filter Outlet</SheetTitle>
              </SheetHeader>
              <div className="py-4 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Customer Type</label>
                  <Select 
                    value={filters.customerType} 
                    onValueChange={(value) => setFilters({ ...filters, customerType: value })}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-gray-200">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Tipe</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="wholesaler">Wholesaler</SelectItem>
                      <SelectItem value="distributor">Distributor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Kredit Limit</label>
                  <Select 
                    value={filters.creditLimit} 
                    onValueChange={(value) => setFilters({ ...filters, creditLimit: value })}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-gray-200">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Limit</SelectItem>
                      <SelectItem value="low">Under 10M</SelectItem>
                      <SelectItem value="medium">10M - 20M</SelectItem>
                      <SelectItem value="high">Above 20M</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Total Piutang</label>
                  <Select 
                    value={filters.outstanding} 
                    onValueChange={(value) => setFilters({ ...filters, outstanding: value })}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-gray-200">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Piutang</SelectItem>
                      <SelectItem value="low">Di bawah 5M</SelectItem>
                      <SelectItem value="medium">5M - 10M</SelectItem>
                      <SelectItem value="high">Di atas 10M</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 h-10 rounded-xl border-gray-200 cursor-pointer"
                    onClick={() => setFilters({
                      area: "all",
                      route: "all",
                      customerType: "all",
                      paymentStatus: "all",
                      creditLimit: "all",
                      outstanding: "all",
                    })}
                  >
                    Reset Filter
                  </Button>
                  <Button 
                    className="flex-1 bg-[#45C55D] hover:bg-[#38A34A] text-white border-0 h-10 rounded-xl cursor-pointer"
                  >
                    Terapkan Filter
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Customer List */}
      <div className="px-4 py-5 space-y-3">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <Card
              key={customer.id}
              className="border-0 shadow-xs rounded-2xl cursor-pointer hover:shadow-md transition-shadow bg-white"
              onClick={() => navigate(`/customer/${customer.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <h3 className="text-base font-bold text-gray-900">{customer.name}</h3>
                      <Badge className="bg-gray-100 hover:bg-gray-100 text-gray-600 border-0 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded">
                        {customer.type}
                      </Badge>
                    </div>
                    <div className="flex items-start gap-1.5 text-xs text-gray-500">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 text-gray-400 flex-shrink-0" />
                      <span className="leading-tight">{customer.address}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                </div>

                <div className="space-y-2 mt-3.5 pt-3.5 border-t border-gray-100 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Saldo Berjalan</span>
                    <span className="font-bold text-gray-800 text-sm">{formatCurrency(customer.balance)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Limit Kredit</span>
                    <span className="font-bold text-gray-800 text-sm">{formatCurrency(customer.creditLimit)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Piutang (Outstanding)</span>
                    <div className="flex items-center gap-1.5">
                      {customer.creditLimit > 0 && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            (customer.outstanding / customer.creditLimit) * 100 > 80
                              ? "bg-red-50 text-red-700"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          {Math.round((customer.outstanding / customer.creditLimit) * 100)}% Terpakai
                        </span>
                      )}
                      <span className={`text-sm ${getUtilizationColor(customer.outstanding, customer.creditLimit)}`}>
                        {formatCurrency(customer.outstanding)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-16 text-gray-500 bg-white rounded-2xl shadow-xs">
            <MapPin className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-semibold">Tidak ada outlet ditemukan</p>
            <p className="text-xs text-gray-400 mt-1">Coba kata kunci pencarian lain.</p>
          </div>
        )}
      </div>
    </div>
  );
}
