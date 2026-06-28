import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, Search, UserCheck, DollarSign, CreditCard, Calendar, CheckCircle2, X } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";
import confetti from "canvas-confetti";

type CustomerItem = {
  id: number;
  name: string;
  address: string;
  phone: string;
  outstanding: number;
};

type InvoiceItem = {
  id: string;
  date: string;
  total: number;
  paid: number;
  remaining: number;
  dueDate: string;
};

export function Pelunasan() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State Management
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<Record<string, boolean>>({});
  const [paymentMethod, setPaymentMethod] = useState<string>("transfer");
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [referenceNumber, setReferenceNumber] = useState<string>("");

  // Modals state
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");

  // Load stateful customers from localStorage
  const [customers] = useState<CustomerItem[]>(() => {
    const saved = localStorage.getItem("customers");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((c: any) => ({
          id: c.id,
          name: c.name,
          address: c.address,
          phone: c.phone || "0812XXXXXXXX",
          outstanding: c.outstanding || 0,
        }));
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { id: 1, name: "PT Maju Jaya", address: "Jl. Gatot Subroto No. 123, Surabaya", phone: "081234567890", outstanding: 5000000 },
      { id: 2, name: "Toko Sumber Rejeki", address: "Jl. Merdeka No. 45, Surabaya", phone: "081298765432", outstanding: 2500000 },
      { id: 3, name: "UD Maju Bersama", address: "Jl. Ahmad Yani No. 123, Surabaya", phone: "081255554444", outstanding: 8200000 },
      { id: 4, name: "CV Cahaya Terang", address: "Jl. Basuki Rahmat No. 89, Surabaya", phone: "081266667777", outstanding: 12500000 },
      { id: 5, name: "Toko Sejahtera", address: "Jl. Diponegoro No. 67, Surabaya", phone: "081211112222", outstanding: 3400000 },
    ];
  });

  const customerIdParam = searchParams.get("customerId");

  useEffect(() => {
    if (customerIdParam) {
      const customer = customers.find(c => c.id.toString() === customerIdParam);
      if (customer) {
        setSelectedCustomer(customer);
      }
    }
  }, [customerIdParam, customers]);

  // Filtered customer list
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(customerSearchQuery.toLowerCase())
  );

  // Generate mock invoices matching the customer's outstanding debt
  const activeInvoices: InvoiceItem[] = selectedCustomer && selectedCustomer.outstanding > 0 ? [
    {
      id: "INV-2026-001",
      date: "2026-06-15",
      total: selectedCustomer.outstanding * 0.4 + 1000000,
      paid: 1000000,
      remaining: selectedCustomer.outstanding * 0.4,
      dueDate: "2026-07-15",
    },
    {
      id: "INV-2026-002",
      date: "2026-06-10",
      total: selectedCustomer.outstanding * 0.6,
      paid: 0,
      remaining: selectedCustomer.outstanding * 0.6,
      dueDate: "2026-07-10",
    }
  ] : [];

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  const handleToggleInvoice = (invoiceId: string, remaining: number) => {
    setSelectedInvoices(prev => {
      const updated = { ...prev, [invoiceId]: !prev[invoiceId] };
      // Recalculate auto-payment amount based on selected invoices
      let totalAmount = 0;
      activeInvoices.forEach(inv => {
        if (updated[inv.id]) {
          totalAmount += inv.remaining;
        }
      });
      setPaymentAmount(totalAmount);
      return updated;
    });
  };

  const handleSavePelunasan = () => {
    if (!selectedCustomer) {
      toast.error("Pilih customer terlebih dahulu!");
      return;
    }

    if (paymentAmount <= 0) {
      toast.error("Jumlah bayar harus lebih besar dari Rp 0!");
      return;
    }

    // Deduct the outstanding amount in local state
    const saved = localStorage.getItem("customers");
    if (saved) {
      try {
        const parsed: CustomerItem[] = JSON.parse(saved);
        const updatedList = parsed.map(c => {
          if (c.id === selectedCustomer.id) {
            return {
              ...c,
              outstanding: Math.max(0, c.outstanding - paymentAmount)
            };
          }
          return c;
        });
        localStorage.setItem("customers", JSON.stringify(updatedList));
      } catch (e) {
        console.error(e);
      }
    }

    toast.success(`Pelunasan senilai ${formatCurrency(paymentAmount)} berhasil diproses!`);
    setSearchParams({ status: "success" });
  };

  const statusParam = searchParams.get("status");
  if (statusParam === "success" || statusParam === "failed") {
    const isSuccess = statusParam === "success";
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative pb-20">
        <div className="bg-white px-4 py-4 shadow-xs border-b border-gray-100 rounded-b-2xl flex-shrink-0 mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-gray-900 mx-auto">Status Setoran Pelunasan</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-10 flex flex-col justify-center">
          <Card className="border-0 shadow-sm rounded-2xl bg-white p-6 space-y-6 text-center">
            {isSuccess ? (
              <>
                <div className="inline-block px-4 py-2 bg-green-50 text-green-700 font-bold rounded-xl border border-green-200 uppercase tracking-wide text-xs">
                  STATUS SETORAN: BERHASIL
                </div>
                <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                  Setoran pelunasan piutang senilai {formatCurrency(paymentAmount)} telah berhasil dicatat dan disinkronisasi ke sistem pusat.
                </p>
              </>
            ) : (
              <>
                <div className="inline-block px-4 py-2 bg-red-50 text-red-700 font-bold rounded-xl border border-red-200 uppercase tracking-wide text-xs">
                  STATUS SETORAN: GAGAL
                </div>
                <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                  Gagal memproses setoran pelunasan piutang. Silakan periksa koneksi jaringan atau coba lagi.
                </p>
              </>
            )}

            <div className="flex flex-col gap-2.5 pt-4">
              <Button
                onClick={() => {
                  navigate("/transaction");
                }}
                className="w-full bg-[#45C55D] hover:bg-[#38A34A] text-white font-bold h-11 rounded-xl border-0 shadow-xs cursor-pointer"
              >
                Lihat Daftar Transaksi
              </Button>
              {!isSuccess && (
                <Button
                  variant="outline"
                  onClick={() => setSearchParams({})}
                  className="w-full border border-gray-200 text-gray-700 font-semibold h-11 rounded-xl cursor-pointer"
                >
                  Coba Lagi
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (searchParams.get("select-customer") === "true") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative pb-20">
        <div className="bg-white px-4 py-4 shadow-xs border-b border-gray-100 rounded-b-2xl flex-shrink-0 mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-1 rounded-full hover:bg-gray-100 border-0 bg-transparent cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Pencarian Customer Outlet</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          <Card className="border-0 shadow-sm rounded-2xl bg-white p-5 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <Input
                placeholder="Cari outlet berdasarkan nama/alamat..."
                value={customerSearchQuery}
                onChange={(e) => setCustomerSearchQuery(e.target.value)}
                className="pl-9 h-10 rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-[#45C55D]"
              />
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCustomer(c);
                      setSelectedInvoices({});
                      setPaymentAmount(0);
                      setSearchParams({});
                    }}
                    className="p-3.5 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left bg-white"
                  >
                    <h4 className="text-xs font-bold text-gray-900 mb-0.5">{c.name}</h4>
                    <p className="text-[10px] text-gray-500 leading-tight mb-1">{c.address}</p>
                    <div className="flex justify-between items-center text-[9px] font-semibold text-gray-400 pt-1.5 border-t border-gray-50">
                      <span>Telp: {c.phone}</span>
                      <span className="text-red-500 font-bold">Piutang: {formatCurrency(c.outstanding)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400 text-xs">
                  Tidak ada customer ditemukan
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative pb-32">
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-xs border-b border-gray-100 rounded-b-2xl flex-shrink-0">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-1 rounded-full hover:bg-gray-100 border-0 bg-transparent cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Pelunasan Piutang</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* SECTION 1: HEADER NOTA */}
        <Card className="border-0 shadow-xs rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-4 space-y-3.5">
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase">Header Pelunasan</h3>

            {/* Customer Picker */}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1.5 block">Nama Pelanggan (Customer)</label>
              {selectedCustomer ? (
                <div 
                  onClick={() => setSearchParams({ "select-customer": "true" })}
                  className="border border-dashed border-emerald-200 rounded-xl p-3 bg-gray-50/50 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                >
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-600" />
                      {selectedCustomer.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-1 max-w-[90%]">{selectedCustomer.address}</p>
                    <p className="text-[10px] font-bold text-red-600 mt-0.5">Total Piutang: {formatCurrency(selectedCustomer.outstanding)}</p>
                  </div>
                  <Badge className="bg-[#45C55D] text-white border-0 text-[10px] rounded-lg">Ubah</Badge>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchParams({ "select-customer": "true" })}
                  className="w-full border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-xl py-4 px-3 text-center text-xs font-bold text-gray-500 flex flex-col items-center justify-center gap-1.5 bg-gray-50/50 cursor-pointer"
                >
                  <Search className="w-5 h-5 text-gray-400" />
                  Pilih Customer Outlet &rarr;
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: RINCIAN INVOICE / OUTSTANDING */}
        {selectedCustomer && (
          <Card className="border-0 shadow-xs rounded-2xl bg-white overflow-hidden">
            <CardContent className="p-4 space-y-3">
              <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase pb-2 border-b border-gray-100">
                Faktur Outstanding Pelanggan
              </h3>

              {activeInvoices.length === 0 ? (
                <div className="text-center py-6 text-gray-500 text-xs">
                  <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  Pelanggan tidak memiliki piutang (Lunas).
                </div>
              ) : (
                <div className="space-y-3">
                  {activeInvoices.map((inv) => {
                    const isSelected = !!selectedInvoices[inv.id];
                    return (
                      <div
                        key={inv.id}
                        onClick={() => handleToggleInvoice(inv.id, inv.remaining)}
                        className={`border rounded-xl p-3 cursor-pointer transition-all flex justify-between items-start gap-2 ${
                          isSelected ? "border-[#45C55D] bg-emerald-50/20" : "border-gray-100 bg-gray-50/30"
                        }`}
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              checked={isSelected} 
                              readOnly 
                              className="rounded text-[#45C55D] focus:ring-[#45C55D] pointer-events-none"
                            />
                            <h4 className="text-xs font-bold text-gray-900 leading-none">{inv.id}</h4>
                          </div>
                          <p className="text-[9px] text-gray-400 font-mono">
                            Tanggal: {new Date(inv.date).toLocaleDateString("id-ID")} &bull; Tempo: {new Date(inv.dueDate).toLocaleDateString("id-ID")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-red-600">{formatCurrency(inv.remaining)}</p>
                          <p className="text-[9px] text-gray-400">Total: {formatCurrency(inv.total)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* SECTION 3: FORM PEMBAYARAN */}
        {selectedCustomer && activeInvoices.length > 0 && (
          <Card className="border-0 shadow-xs rounded-2xl bg-white overflow-hidden">
            <CardContent className="p-4 space-y-3.5">
              <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase pb-2 border-b border-gray-100">
                Informasi Setoran Pembayaran
              </h3>

              {/* Payment Method */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 block">Metode Pembayaran</label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white">
                    <SelectValue placeholder="Pilih Metode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transfer">Transfer Bank (Giro / VA)</SelectItem>
                    <SelectItem value="cash">Uang Tunai (Cash)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Payment Amount */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 block">Jumlah Uang Diterima (Rp)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <Input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="pl-11 h-11 rounded-xl border-gray-200 font-bold focus-visible:ring-1 focus-visible:ring-[#45C55D]"
                    placeholder="Contoh: 2500000"
                    required
                  />
                </div>
              </div>

              {/* Reference Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 block">No. Referensi / Bukti Setoran</label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <Input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="pl-11 h-11 rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-[#45C55D]"
                    placeholder="Contoh: TX-2026-88192"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* STICKY FOOTER SUMMARY */}
      {selectedCustomer && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center bg-gray-50 rounded-xl p-3 text-xs">
              <div>
                <p className="text-[9px] text-gray-500 font-bold uppercase block">TOTAL SETORAN</p>
                <p className="text-base font-black text-emerald-600">{formatCurrency(paymentAmount)}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-gray-500 font-bold uppercase block">SISA PIUTANG TOKO</p>
                <p className="text-sm font-bold text-red-600">
                  {formatCurrency(Math.max(0, selectedCustomer.outstanding - paymentAmount))}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1 h-10 rounded-xl border-gray-200 text-gray-600 font-semibold cursor-pointer"
              >
                Batal
              </Button>
              <Button
                onClick={handleSavePelunasan}
                disabled={paymentAmount <= 0}
                className="flex-1 bg-[#45C55D] hover:bg-[#38A34A] text-white font-bold h-10 rounded-xl border-0 shadow-xs cursor-pointer"
              >
                Simpan Setoran
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
