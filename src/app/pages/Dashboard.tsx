import { useState, useEffect } from "react";
import {
  Bell,
  ChevronRight,
  MapPin,
  Plus,
  DollarSign,
  FileText,
  Users,
  TrendingUp,
  Camera,
  CheckCircle2,
  AlertCircle,
  Map,
  Sparkles,
  Info,
  Calendar,
  X,
  ArrowLeft
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { useNavigate, useSearchParams } from "react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Progress } from "../components/ui/progress";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import confetti from "canvas-confetti";

type CallPlan = {
  id: number;
  name: string;
  address: string;
  status: "scheduled" | "visited" | "pending";
  distance: string;
  outstanding: number;
  phone: string;
};

export function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Load call plans and active index from localStorage to make it stateful and persistent
  const [callPlans, setCallPlans] = useState<CallPlan[]>(() => {
    const saved = localStorage.getItem("callPlans");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 2,
        name: "Toko Sumber Rejeki",
        address: "Jl. Merdeka No. 45, Surabaya",
        status: "scheduled",
        distance: "2.3 km",
        outstanding: 5500000,
        phone: "081298765432",
      },
      {
        id: 3,
        name: "UD Maju Bersama",
        address: "Jl. Ahmad Yani No. 123, Surabaya",
        status: "scheduled",
        distance: "4.1 km",
        outstanding: 8200000,
        phone: "081255554444",
      },
      {
        id: 5,
        name: "Toko Sejahtera",
        address: "Jl. Diponegoro No. 67, Surabaya",
        status: "scheduled",
        distance: "1.8 km",
        outstanding: 3400000,
        phone: "081211112222",
      },
    ];
  });

  const [activePlanIndex, setActivePlanIndex] = useState<number>(() => {
    const saved = localStorage.getItem("activePlanIndex");
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem("callPlans", JSON.stringify(callPlans));
  }, [callPlans]);

  useEffect(() => {
    localStorage.setItem("activePlanIndex", activePlanIndex.toString());
  }, [activePlanIndex]);

  // Reset function to clear visits and start over
  const resetCallPlans = () => {
    const resetPlans = callPlans.map(plan => ({ ...plan, status: "scheduled" as const }));
    setCallPlans(resetPlans);
    setActivePlanIndex(0);
  };

  // Outstanding customers list
  const [outstandingCustomers] = useState([
    {
      id: 4,
      name: "CV Cahaya Terang",
      amount: 12500000,
      invoices: 3,
      oldestDate: "2026-05-15",
    },
    {
      id: 2,
      name: "Toko Sumber Rejeki",
      amount: 2500000,
      invoices: 1,
      oldestDate: "2026-06-10",
    },
  ]);

  const quickActions = [
    { icon: Plus, label: "Sales Order", color: "bg-blue-500", path: "/sales-order?type=so" },
    { icon: FileText, label: "Retur", color: "bg-orange-500", path: "/sales-order?type=retur" },
    { icon: DollarSign, label: "Pelunasan", color: "bg-emerald-500", path: "/pelunasan" },
    { icon: Users, label: "New Outlet", color: "bg-purple-500", path: "/customer/new" },
  ];

  // Modals state
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [checkInStep, setCheckInStep] = useState(1); // 1: GPS, 2: Camera, 3: Success
  const [gpsVerified, setGpsVerified] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isTargetPickerOpen, setIsTargetPickerOpen] = useState(false);

  const currentPlan = callPlans[activePlanIndex];

  const handleSkipPlan = () => {
    // Find the next incomplete plan
    let nextIndex = activePlanIndex;
    for (let i = 1; i <= callPlans.length; i++) {
      const idx = (activePlanIndex + i) % callPlans.length;
      if (callPlans[idx].status !== "visited") {
        nextIndex = idx;
        break;
      }
    }
    if (nextIndex === activePlanIndex) {
      toast.warning("Semua rencana kunjungan sudah dikunjungi!");
      return;
    }
    setActivePlanIndex(nextIndex);
    toast.info(`Beralih ke: ${callPlans[nextIndex].name}`);
  };

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  // Simulated GPS Verification
  const startGpsVerification = () => {
    setGpsVerified(false);
    setCheckInStep(1);
    setSearchParams({ "check-in": "true" });
    setTimeout(() => {
      setGpsVerified(true);
      setTimeout(() => {
        setCheckInStep(2);
      }, 1000);
    }, 1500);
  };

  const handleTakePhoto = () => {
    setPhotoTaken(true);
    // Flash shutter animation
    const flash = document.getElementById("camera-flash");
    if (flash) {
      flash.classList.remove("opacity-0");
      flash.classList.add("opacity-100");
      setTimeout(() => {
        flash.classList.remove("opacity-100");
        flash.classList.add("opacity-0");
      }, 150);
    }
  };

  const submitPresence = () => {
    // 1. Mark current plan as visited
    const updatedPlans = [...callPlans];
    updatedPlans[activePlanIndex] = {
      ...updatedPlans[activePlanIndex],
      status: "visited",
    };
    setCallPlans(updatedPlans);

    // 2. Transition to Step 3 (Success Screen)
    setCheckInStep(3);
  };

  // Recharts Chart Data (Mock performance metrics)
  const chartData = [
    { name: "W1", sales: 22000000 },
    { name: "W2", sales: 34000000 },
    { name: "W3", sales: 28000000 },
    { name: "W4", sales: 41500000 },
  ];

  if (searchParams.get("check-in") === "true") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative pb-20">
        <div className="bg-white px-4 py-4 shadow-xs border-b border-gray-100 rounded-b-2xl flex-shrink-0 mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSearchParams({});
                setPhotoTaken(false);
                setGpsVerified(false);
                setCheckInStep(1);
              }}
              className="p-1 rounded-full hover:bg-gray-100 border-0 bg-transparent cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Check-In Presensi Sales</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          <Card className="border-0 shadow-sm rounded-2xl bg-white p-5 relative overflow-hidden">
            <div id="camera-flash" className="absolute inset-0 bg-white opacity-0 transition-opacity duration-150 pointer-events-none z-30" />

            {checkInStep === 1 && (
              <div className="text-center py-6 flex flex-col items-center">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center animate-bounce mb-4">
                  <MapPin className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">Memverifikasi GPS Anda...</h4>
                <p className="text-xs text-gray-500 max-w-xs mb-4">
                  Harap tunggu, kami mendeteksi koordinat Anda dengan outlet <span className="font-semibold">{currentPlan?.name}</span>.
                </p>
                <div className="w-full bg-gray-100 rounded-full h-1.5 max-w-[200px] overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full animate-[progress_1.5s_ease-in-out_infinite]" style={{ width: "60%" }} />
                </div>
                {gpsVerified && (
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                    GPS Terverifikasi (Radius 12 meter)
                  </div>
                )}
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchParams({ "check-in": "true", status: "failed" });
                    setCheckInStep(3);
                  }}
                  className="mt-6 text-xs text-red-500 hover:text-red-700 bg-transparent border-0 cursor-pointer"
                >
                  Simulasikan Gagal GPS
                </Button>
              </div>
            )}

            {checkInStep === 2 && (
               <div className="space-y-4">
                 <div className="text-center">
                   <h4 className="text-sm font-bold text-gray-900 mb-1">Ambil Foto Selfie Depan Toko</h4>
                   <p className="text-xs text-gray-500 mb-3">Ambil foto selfie/depan toko {currentPlan?.name} sebagai bukti kunjungan fisik.</p>
                 </div>

                 <div className="relative aspect-video rounded-xl bg-gray-900 overflow-hidden flex items-center justify-center border border-gray-200">
                   {photoTaken ? (
                     <div className="w-full h-full relative">
                       <svg viewBox="0 0 400 225" className="w-full h-full object-cover">
                         <rect width="400" height="225" fill="#e0f2fe" />
                         <rect x="80" y="80" width="240" height="145" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
                         <path d="M70 80 L330 80 L310 50 L90 50 Z" fill="#ef4444" />
                         <text x="200" y="120" fill="#334155" fontSize="14" fontWeight="bold" textAnchor="middle">{currentPlan?.name}</text>
                         <rect x="10" y="195" width="200" height="22" rx="4" fill="black" opacity="0.6" />
                         <text x="15" y="210" fill="#22c55e" fontSize="9" fontWeight="mono">GPS OK: -7.2575, 112.7521</text>
                       </svg>
                     </div>
                   ) : (
                     <div className="text-center text-gray-400 space-y-2 p-4">
                       <Camera className="w-12 h-12 mx-auto animate-pulse text-gray-500" />
                       <p className="text-xs font-semibold">CAMERA ACTIVE</p>
                       <div className="border border-white/20 rounded p-1.5 text-[10px] bg-black/30 font-mono text-green-400">
                         GPS HUD: 7°15'27.0"S 112°45'07.6"E
                       </div>
                     </div>
                   )}
                 </div>

                 <div className="flex gap-3">
                   {!photoTaken ? (
                     <Button
                       onClick={handleTakePhoto}
                       className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl h-10 border-0 cursor-pointer flex items-center justify-center gap-1.5"
                     >
                       <Camera className="w-4 h-4" />
                       Ambil Foto
                     </Button>
                   ) : (
                     <>
                       <Button
                         variant="outline"
                         onClick={() => setPhotoTaken(false)}
                         className="flex-1 border border-gray-200 text-gray-700 font-semibold rounded-xl h-10 cursor-pointer"
                       >
                         Ulangi Foto
                       </Button>
                       <Button
                         onClick={submitPresence}
                         className="flex-1 bg-[#45C55D] hover:bg-[#38A34A] text-white font-semibold rounded-xl h-10 border-0 cursor-pointer flex items-center justify-center gap-1.5"
                       >
                         Submit Presensi
                       </Button>
                     </>
                   )}
                 </div>
               </div>
             )}

             {checkInStep === 3 && (
               <div className="text-center py-8 space-y-4 flex flex-col items-center">
                 {searchParams.get("status") === "failed" ? (
                   <>
                     <div className="px-4 py-2 bg-red-50 text-red-700 font-bold rounded-xl border border-red-200 uppercase tracking-wide text-xs">
                       STATUS PRESENSI: GAGAL
                     </div>
                     <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                       Presensi gagal dilakukan. Alasan: Koordinat GPS perangkat Anda berada di luar radius 100 meter dari lokasi outlet.
                     </p>
                     <Button
                       onClick={() => {
                         setSearchParams({ "check-in": "true" });
                         setCheckInStep(1);
                         setPhotoTaken(false);
                         setGpsVerified(false);
                       }}
                       className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl h-10 border-0 cursor-pointer"
                     >
                       Ulangi Presensi
                     </Button>
                   </>
                 ) : (
                   <>
                     <div className="px-4 py-2 bg-green-50 text-green-700 font-bold rounded-xl border border-green-200 uppercase tracking-wide text-xs">
                       STATUS PRESENSI: BERHASIL
                     </div>
                     <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
                       Presensi kunjungan sales ke outlet <strong>{currentPlan?.name}</strong> telah berhasil direkam ke sistem.
                     </p>
                     <Button
                       onClick={() => {
                         setSearchParams({});
                         setPhotoTaken(false);
                         setGpsVerified(false);
                         setCheckInStep(1);
                         // Move to next customer
                         setActivePlanIndex((prev) => prev + 1);
                       }}
                       className="w-full bg-[#45C55D] hover:bg-[#38A34A] text-white font-bold rounded-xl h-10 border-0 cursor-pointer"
                     >
                       Lanjut ke Rencana Berikutnya
                     </Button>
                   </>
                 )}
               </div>
             )}
           </Card>
         </div>
       </div>
     );
   }

  if (searchParams.get("analytics") === "true") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative pb-20">
        <div className="bg-white px-4 py-4 shadow-xs border-b border-gray-100 rounded-b-2xl flex-shrink-0 mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchParams({})}
              className="p-1 rounded-full hover:bg-gray-100 border-0 bg-transparent cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Detail Kinerja Sales Andi</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          <Card className="border-0 shadow-sm rounded-2xl bg-white p-5 space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-1 font-semibold">Omzet Realisasi vs Target</p>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-lg font-bold text-gray-900">Rp 125.500.000</span>
                <span className="text-xs text-gray-500">Target: Rp 150.000.000</span>
              </div>
              <Progress value={83.6} className="h-2 bg-gray-100 rounded-full" />
              <p className="text-[10px] text-green-600 mt-1 font-semibold">&uarr; Kurang Rp 24.500.000 lagi untuk mencapai target</p>
            </div>

            {/* Performance Chart */}
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-gray-700 mb-2">Grafik Penjualan Mingguan (Juni 2026)</p>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#45C55D" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#45C55D" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis 
                      stroke="#9ca3af" 
                      fontSize={8} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                    />
                    <Tooltip 
                      formatter={(value: any) => [formatCurrency(value), "Penjualan"]}
                      contentStyle={{ background: "#1f2937", border: "none", borderRadius: "8px", color: "#fff", fontSize: "11px" }}
                    />
                    <Area type="monotone" dataKey="sales" stroke="#45C55D" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-gray-500 mb-1 font-semibold">Rata-rata Order</p>
                <p className="text-sm font-bold text-gray-800">Rp 506.048</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                <p className="text-gray-500 mb-1 font-semibold">Efektivitas Kunjungan</p>
                <p className="text-sm font-bold text-green-600">92% (High)</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (searchParams.get("select-target") === "true") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative pb-20">
        <div className="bg-white px-4 py-4 shadow-xs border-b border-gray-100 rounded-b-2xl flex-shrink-0 mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchParams({})}
              className="p-1 rounded-full hover:bg-gray-100 border-0 bg-transparent cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Pilih Target Kunjungan Baru</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-3">
          <p className="text-xs text-gray-500 font-medium">Pilih salah satu rencana kunjungan untuk dijadikan target aktif saat ini:</p>
          <div className="space-y-2.5">
            {callPlans.map((plan, index) => {
              const isCurrent = index === activePlanIndex;
              const isVisited = plan.status === "visited";
              
              return (
                <div
                  key={plan.id}
                  onClick={() => {
                    if (isVisited) return;
                    setActivePlanIndex(index);
                    setSearchParams({});
                    toast.info(`Target aktif diubah ke: ${plan.name}`);
                  }}
                  className={`border rounded-xl p-3.5 flex justify-between items-center transition-all ${
                    isVisited 
                      ? "bg-gray-50/70 border-gray-100 opacity-60 cursor-not-allowed" 
                      : isCurrent
                        ? "bg-emerald-50/20 border-[#45C55D] cursor-pointer ring-1 ring-[#45C55D]/30"
                        : "bg-white border-gray-100 hover:bg-gray-50 cursor-pointer"
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{plan.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{plan.address}</p>
                  </div>

                  <div className="text-right flex-shrink-0 ml-3">
                    {isVisited ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 text-[9px] rounded-lg">
                        Visited
                      </Badge>
                    ) : isCurrent ? (
                      <Badge className="bg-[#45C55D] text-white border-0 text-[9px] rounded-lg">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="border-0 text-[9px] rounded-lg">
                        Scheduled
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white px-4 pt-5 pb-6 border-b border-gray-100 rounded-b-2xl shadow-xs">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900 mb-0.5">Hello, Sales Andi</h1>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              Senin, 23 Juni 2026
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <button className="relative p-1.5 rounded-full hover:bg-gray-100 transition-colors">
              <Bell className="w-5.5 h-5.5 text-gray-600" />
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                3
              </span>
            </button>
            <Avatar className="w-10 h-10 border border-gray-200">
              <AvatarFallback className="bg-[#45C55D] text-white text-sm font-semibold">SA</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Main Summary Card */}
      <div className="px-4 -mt-4 mb-5">
        <Card className="border-0 bg-gradient-to-br from-[#45C55D] via-[#3ebd53] to-[#2b9348] text-white shadow-md rounded-2xl overflow-hidden relative">
          <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-bl-full pointer-events-none" />
          <CardContent className="p-5">
            <p className="text-xs opacity-90 mb-1 font-medium tracking-wide uppercase">Omzet Bulan Ini</p>
            <h2 className="text-3xl font-bold mb-4">Rp 125.500.000</h2>
            <div className="grid grid-cols-3 gap-3 mb-4 text-center bg-black/10 rounded-xl p-3">
              <div>
                <p className="text-[10px] opacity-80">Total Faktur</p>
                <p className="text-base font-semibold mt-0.5">248</p>
              </div>
              <div className="border-x border-white/10">
                <p className="text-[10px] opacity-80">Customer</p>
                <p className="text-base font-semibold mt-0.5">86</p>
              </div>
              <div>
                <p className="text-[10px] opacity-80">Target</p>
                <p className="text-base font-semibold mt-0.5">83.6%</p>
              </div>
            </div>
            <Button
              onClick={() => setSearchParams({ analytics: "true" })}
              className="w-full bg-white text-[#2b9348] hover:bg-gray-50 active:scale-[0.98] transition-all font-semibold rounded-xl h-10 shadow-xs border-0 cursor-pointer"
            >
              Lihat Detail Analisis
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Today's Call Plan (Single Sequential Customer Card) */}
      <div className="px-4 mb-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-gray-700 tracking-wide uppercase">Target Kunjungan Hari Ini</h3>
          {activePlanIndex < callPlans.length && (
            <Badge className="bg-[#45C55D]/10 text-[#45C55D] border-0 rounded-full px-2.5 py-0.5 text-xs font-semibold">
              Visit {activePlanIndex + 1} of {callPlans.length}
            </Badge>
          )}
        </div>

        {activePlanIndex < callPlans.length ? (
          <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-white border-l-4 border-l-[#45C55D] transition-all duration-300 hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="text-base font-bold text-gray-900 mb-1">{currentPlan.name}</h4>
                  <div className="flex items-start gap-1 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 text-gray-400 flex-shrink-0" />
                    <span>{currentPlan.address}</span>
                  </div>
                </div>
                <Badge className="bg-orange-500/10 text-orange-600 border-0 rounded-lg text-xs font-semibold px-2 py-0.5 flex-shrink-0">
                  Active Target
                </Badge>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Jarak Lokasi:</span>
                  <span className="font-semibold text-gray-800 flex items-center gap-1">
                    <Map className="w-3 h-3 text-[#45C55D]" /> {currentPlan.distance}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Piutang Toko:</span>
                  <span className="font-semibold text-red-600">{formatCurrency(currentPlan.outstanding)}</span>
                </div>
              </div>

              {/* Progress Slider Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                  <span>Progress Kunjungan</span>
                  <span>{Math.round((activePlanIndex / callPlans.length) * 100)}%</span>
                </div>
                <Progress value={(activePlanIndex / callPlans.length) * 100} className="h-1.5 bg-gray-100 rounded-full" />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={startGpsVerification}
                  className="flex-1 bg-[#45C55D] hover:bg-[#38A34A] active:scale-[0.98] transition-all text-white font-semibold rounded-xl h-10 border-0 shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Camera className="w-4 h-4" />
                  Presence / Check-In
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(`/customer/${currentPlan.id}`)}
                  className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl h-10 cursor-pointer"
                >
                  Detail Toko
                </Button>
              </div>

              {/* Dynamic Target Switching Controls */}
              <div className="flex justify-between mt-3.5 pt-3.5 border-t border-gray-100 text-xs font-semibold text-gray-500">
                <button 
                  onClick={() => setSearchParams({ "select-target": "true" })}
                  className="hover:text-[#45C55D] cursor-pointer bg-transparent border-0 flex items-center gap-1 text-gray-500 transition-colors"
                >
                  <Map className="w-3.5 h-3.5 text-gray-400" /> Pilih Toko Lain
                </button>
                <button 
                  onClick={handleSkipPlan}
                  className="hover:text-[#45C55D] cursor-pointer bg-transparent border-0 flex items-center gap-1 text-gray-500 transition-colors"
                >
                  Lewati Toko &rarr;
                </button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Finished State Card */
          <Card className="border-0 shadow-sm rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white text-center p-6 relative">
            <div className="absolute top-2 right-2">
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
            <CardContent className="p-0 flex flex-col items-center">
              <div className="px-4 py-2 bg-green-500/20 text-[#45C55D] font-bold rounded-xl border border-green-500/30 mb-4 uppercase tracking-wide text-xs">
                STATUS KUNJUNGAN: BERHASIL
              </div>
              <h4 className="text-lg font-bold mb-1">Semua Rencana Kunjungan Selesai!</h4>
              <p className="text-xs text-gray-300 max-w-xs mb-4">
                Hebat! Anda telah menyelesaikan 3 kunjungan outlet hari ini. Data laporan presensi terkirim secara otomatis.
              </p>
              <div className="flex gap-3 w-full">
                <Button
                  onClick={resetCallPlans}
                  className="flex-1 bg-[#45C55D] hover:bg-[#38A34A] border-0 text-white font-semibold rounded-xl h-10 cursor-pointer shadow-xs"
                >
                  Simulasikan Lagi
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/transaction")}
                  className="flex-1 border border-gray-700 hover:bg-gray-800 text-gray-300 font-semibold rounded-xl h-10 cursor-pointer"
                >
                  Lihat Transaksi
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-5">
        <h3 className="text-sm font-semibold text-gray-700 tracking-wide uppercase mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card
                key={index}
                className="border-0 shadow-xs rounded-2xl cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
                onClick={() => {
                  let path = action.path;
                  if (currentPlan && (action.label === "Sales Order" || action.label === "Retur" || action.label === "Pelunasan")) {
                    const separator = path.includes("?") ? "&" : "?";
                    path = `${path}${separator}customerId=${currentPlan.id}`;
                  }
                  navigate(path);
                }}
              >
                <CardContent className="p-3.5 flex items-center gap-3">
                  <div className={`w-11 h-11 ${action.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs`}>
                    <Icon className="w-5.5 h-5.5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-800 leading-tight">{action.label}</span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Customer Outstanding Bills */}
      <div className="px-4 mb-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-gray-700 tracking-wide uppercase">Piutang Kritis Customer</h3>
          <button className="text-xs font-semibold text-[#45C55D] cursor-pointer" onClick={() => navigate("/customer")}>
            Lihat Semua
          </button>
        </div>
        <div className="space-y-3">
          {outstandingCustomers.map((customer) => (
            <Card key={customer.id} className="border-0 shadow-xs rounded-2xl hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900 mb-0.5">{customer.name}</h4>
                  <div className="flex items-center gap-3 text-[10px] text-gray-500 font-medium">
                    <span className="bg-red-50 text-red-600 rounded px-1.5 py-0.5">{customer.invoices} tagihan</span>
                    <span>Oldest: {new Date(customer.oldestDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600">{formatCurrency(customer.amount)}</p>
                  <button 
                    onClick={() => navigate(`/customer/${customer.id}`)}
                    className="text-[10px] font-bold text-gray-400 hover:text-[#45C55D] mt-1 block w-full text-right"
                  >
                    Bayar &rarr;
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
}
