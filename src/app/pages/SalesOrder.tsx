import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  Search,
  Plus,
  Minus,
  Trash2,
  Check,
  ShoppingCart,
  UserCheck,
  FolderOpen,
  PlusCircle,
  Percent,
  Calculator,
  Gift,
  Tag,
  AlertCircle,
  HelpCircle,
  X
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { toast } from "sonner";
import confetti from "canvas-confetti";

type OrderItem = {
  id: number;
  productName: string;
  productCode: string;
  quantity: number;
  price: number;
  discountPct: number;
  discountRp: number;
  bonus: number;
  category: string;
  subtotal: number;
};

type CustomerItem = {
  id: number;
  name: string;
  address: string;
  phone: string;
  outstanding: number;
};

type ProductItem = {
  id: number;
  name: string;
  code: string;
  price: number;
  stock: number;
  category: string;
};

export function SalesOrder() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isReturMode = searchParams.get("type") === "retur";

  // Dynamic Theme Colors
  const themeColor = isReturMode ? "orange" : "emerald";
  const themeColorHex = isReturMode ? "#f97316" : "#45C55D";
  const themeTextClass = isReturMode ? "text-orange-600" : "text-emerald-600";
  const themeBgClass = isReturMode ? "bg-orange-500" : "bg-[#45C55D]";
  const themeBgHoverClass = isReturMode ? "hover:bg-orange-600" : "hover:bg-[#38A34A]";
  const themeBorderClass = isReturMode ? "border-orange-200" : "border-emerald-200";

  // State Management
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // Active inputs inside product form
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [qtyInput, setQtyInput] = useState(1);
  const [discountPctInput, setDiscountPctInput] = useState(0);
  const [discountRpInput, setDiscountRpInput] = useState(0);
  const [bonusInput, setBonusInput] = useState(0);

  // Search filter query
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [productSearchQuery, setProductSearchQuery] = useState("");

  const addItemId = searchParams.get("add-item");

  useEffect(() => {
    if (addItemId) {
      const product = products.find(p => p.id.toString() === addItemId);
      if (product) {
        setSelectedProduct(product);
      }
    } else {
      setSelectedProduct(null);
    }
  }, [addItemId]);

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

  const products: ProductItem[] = [
    { id: 1, name: "Indomie Goreng", code: "IMG-001", price: 2500, stock: 1500, category: "makanan" },
    { id: 2, name: "Aqua 600ml", code: "AQA-600", price: 3500, stock: 2000, category: "minuman" },
    { id: 3, name: "Teh Pucuk Harum", code: "TPH-350", price: 4000, stock: 1200, category: "minuman" },
    { id: 4, name: "Kopi Kapal Api", code: "KKA-165", price: 8500, stock: 800, category: "kopi" },
  ];

  const categories = [
    { id: "makanan", name: "Makanan (Food)" },
    { id: "minuman", name: "Minuman (Beverage)" },
    { id: "kopi", name: "Kopi (Coffee)" }
  ];

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  // Filtered customer list
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(customerSearchQuery.toLowerCase())
  );

  // Filtered product list based on locked category
  const filteredProducts = products.filter(
    (p) =>
      p.category === selectedCategory &&
      (p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(productSearchQuery.toLowerCase()))
  );

  const handleOpenItemForm = (product: ProductItem) => {
    setSelectedProduct(product);
    setQtyInput(1);
    setDiscountPctInput(0);
    setDiscountRpInput(0);
    setBonusInput(0);
    setSearchParams({ type: isReturMode ? "retur" : "so", "add-item": product.id.toString() });
  };

  const handleAddItemToList = () => {
    if (!selectedProduct) return;

    if (qtyInput <= 0) {
      toast.error("Jumlah Qty harus lebih besar dari 0!");
      return;
    }

    if (qtyInput > selectedProduct.stock && !isReturMode) {
      toast.error(`Stok tidak mencukupi! Sisa stok: ${selectedProduct.stock}`);
      return;
    }

    // Subtotal = (Qty * Price) - (Qty * Price * Disc%) - (Disc Rp)
    const gross = qtyInput * selectedProduct.price;
    const discountPctVal = gross * (discountPctInput / 100);
    const calculatedSubtotal = Math.max(0, gross - discountPctVal - discountRpInput);

    const newItem: OrderItem = {
      id: selectedProduct.id,
      productName: selectedProduct.name,
      productCode: selectedProduct.code,
      quantity: qtyInput,
      price: selectedProduct.price,
      discountPct: discountPctInput,
      discountRp: discountRpInput,
      bonus: bonusInput,
      category: selectedProduct.category,
      subtotal: calculatedSubtotal,
    };

    // Remove existing if duplicate
    const filtered = orderItems.filter((item) => item.id !== selectedProduct.id);
    setOrderItems([...filtered, newItem]);
    setSearchParams({ type: isReturMode ? "retur" : "so" });
    setSelectedProduct(null);
    toast.success(`Berhasil menambahkan "${selectedProduct.name}" ke daftar.`);
  };

  const handleRemoveItem = (id: number) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
    toast.success("Barang dihapus dari daftar.");
  };

  // Calculations for Summary Nota
  // DPP = Subtotal / 1.11, PPN (11%) = DPP * 0.11
  const calculateTotalDPP = () => {
    const totalSubtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
    return Math.round(totalSubtotal / 1.11);
  };

  const calculatePPN = (dpp: number) => {
    return Math.round(dpp * 0.11);
  };

  const calculateGrandTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const totalDPP = calculateTotalDPP();
  const totalPPN = calculatePPN(totalDPP);
  const grandTotal = calculateGrandTotal();

  const handleSaveNota = () => {
    if (orderItems.length === 0) {
      toast.error("Daftar barang masih kosong!");
      return;
    }

    toast.success(isReturMode ? "Nota Retur berhasil disimpan!" : "Sales Order berhasil dibuat!");
    setSearchParams({ type: isReturMode ? "retur" : "so", status: "success" });
  };

  const statusParam = searchParams.get("status");
  if (statusParam === "success" || statusParam === "failed") {
    const isSuccess = statusParam === "success";
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative pb-20">
        <div className="bg-white px-4 py-4 shadow-xs border-b border-gray-100 rounded-b-2xl flex-shrink-0 mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-gray-900 mx-auto">
              Status Pembuatan Nota
            </h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-10 flex flex-col justify-center">
          <Card className="border-0 shadow-sm rounded-2xl bg-white p-6 space-y-6 text-center">
            {isSuccess ? (
              <>
                <div className="inline-block px-4 py-2 bg-green-50 text-green-700 font-bold rounded-xl border border-green-200 uppercase tracking-wide text-xs">
                  STATUS TRANSAKSI: BERHASIL
                </div>
                <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                  {isReturMode ? "Nota Retur barang" : "Sales Order (SO)"} telah berhasil disimpan dan disinkronisasi dengan sistem ERP pusat.
                </p>
              </>
            ) : (
              <>
                <div className="inline-block px-4 py-2 bg-red-50 text-red-700 font-bold rounded-xl border border-red-200 uppercase tracking-wide text-xs">
                  STATUS TRANSAKSI: GAGAL
                </div>
                <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                  Gagal menyimpan transaksi. Harap periksa koneksi jaringan Anda atau coba lagi.
                </p>
              </>
            )}

            <div className="flex flex-col gap-2.5 pt-4">
              <Button
                onClick={() => {
                  navigate("/transaction");
                }}
                className={`w-full ${themeBgClass} ${themeBgHoverClass} text-white font-bold h-11 rounded-xl border-0 shadow-xs cursor-pointer`}
              >
                Lihat Daftar Transaksi
              </Button>
              {!isSuccess && (
                <Button
                  variant="outline"
                  onClick={() => setSearchParams({ type: isReturMode ? "retur" : "so" })}
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
                      setSearchParams({ type: isReturMode ? "retur" : "so" });
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

  if (searchParams.get("select-product") === "true") {
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
            <h1 className="text-lg font-bold text-gray-900">
              Pilih Barang: <span className="capitalize text-emerald-600 font-black">{selectedCategory}</span>
            </h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          <Card className="border-0 shadow-sm rounded-2xl bg-white p-5 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <Input
                placeholder="Cari berdasarkan nama/kode barang..."
                value={productSearchQuery}
                onChange={(e) => setProductSearchQuery(e.target.value)}
                className="pl-9 h-10 rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-[#45C55D]"
              />
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleOpenItemForm(p)}
                    className="p-3.5 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left flex justify-between items-center bg-white"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 mb-0.5">{p.name}</h4>
                      <p className="text-[9px] text-gray-400 font-mono">Code: {p.code}</p>
                      <p className={`text-[10px] font-bold mt-1 ${themeTextClass}`}>{formatCurrency(p.price)}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${p.stock > 100 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                        Stok: {p.stock}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400 text-xs">
                  Tidak ada barang untuk kategori ini.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (addItemId && selectedProduct) {
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
            <h1 className="text-lg font-bold text-gray-900">
              Parameter: {selectedProduct.name}
            </h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          <Card className="border-0 shadow-sm rounded-2xl bg-white p-5 space-y-4">
            {/* Info Product */}
            <div className="bg-gray-50 rounded-xl p-3 flex justify-between text-xs border border-gray-100">
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Harga Satuan</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">{formatCurrency(selectedProduct.price)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Tersedia</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">{selectedProduct.stock} pcs</p>
              </div>
            </div>

            {/* Qty Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 block">Jumlah Beli (Qty)</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQtyInput((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 bg-gray-100 border-0 hover:bg-gray-200 rounded-xl flex items-center justify-center cursor-pointer text-lg text-gray-700"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <Input
                  type="number"
                  value={qtyInput}
                  onChange={(e) => setQtyInput(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="h-10 text-center rounded-xl font-bold flex-1 border-gray-200 focus-visible:ring-1 focus-visible:ring-[#45C55D]"
                />
                <button
                  type="button"
                  onClick={() => setQtyInput((q) => q + 1)}
                  className="w-10 h-10 bg-gray-100 border-0 hover:bg-gray-200 rounded-xl flex items-center justify-center cursor-pointer text-lg text-gray-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Discounts Block */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5 text-gray-400" /> Diskon (%)
                </label>
                <Input
                  type="number"
                  value={discountPctInput}
                  onChange={(e) => setDiscountPctInput(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                  placeholder="0"
                  className="h-10 rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-[#45C55D]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600 flex items-center gap-1">
                  <Calculator className="w-3.5 h-3.5 text-gray-400" /> Diskon (Rp)
                </label>
                <Input
                  type="number"
                  value={discountRpInput}
                  onChange={(e) => setDiscountRpInput(Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="0"
                  className="h-10 rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-[#45C55D]"
                />
              </div>
            </div>

            {/* Bonus Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-600 flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-gray-400" /> Bonus (Qty Item)
              </label>
              <Input
                type="number"
                value={bonusInput}
                onChange={(e) => setBonusInput(Math.max(0, parseInt(e.target.value, 10) || 0))}
                placeholder="0"
                className="h-10 rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-[#45C55D]"
              />
            </div>

            {/* Real-time Subtotal Preview */}
            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Estimasi Subtotal</span>
                <span className={`text-base font-black ${themeTextClass}`}>
                  {formatCurrency(
                    Math.max(
                      0,
                      qtyInput * selectedProduct.price -
                        qtyInput * selectedProduct.price * (discountPctInput / 100) -
                        discountRpInput
                    )
                  )}
                </span>
              </div>

              <Button
                onClick={handleAddItemToList}
                className={`bg-[#45C55D] hover:bg-[#38A34A] text-white font-bold h-10 px-6 rounded-xl border-0 shadow-xs cursor-pointer`}
              >
                Tambahkan Barang
              </Button>
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
          <h1 className="text-lg font-bold text-gray-900">
            {isReturMode ? "Buat Retur Barang" : "Buat Sales Order (SO)"}
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* SECTION 1: HEADER NOTA (METADATA) */}
        <Card className="border-0 shadow-xs rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-4 space-y-3.5">
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase">Header Nota</h3>

            {/* Customer Picker */}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1.5 block">Nama Pelanggan (Customer)</label>
              {selectedCustomer ? (
                <div 
                  onClick={() => setSearchParams({ type: isReturMode ? "retur" : "so", "select-customer": "true" })}
                  className={`border border-dashed ${themeBorderClass} rounded-xl p-3 bg-gray-50/50 cursor-pointer hover:bg-gray-50 flex justify-between items-center`}
                >
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      <UserCheck className={`w-4 h-4 ${themeTextClass}`} />
                      {selectedCustomer.name}
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-1 max-w-[90%]">{selectedCustomer.address}</p>
                    <p className="text-[10px] font-semibold text-red-600 mt-0.5">Piutang: {formatCurrency(selectedCustomer.outstanding)}</p>
                  </div>
                  <Badge className={`${themeBgClass} text-white border-0 text-[10px] rounded-lg`}>Ubah</Badge>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchParams({ type: isReturMode ? "retur" : "so", "select-customer": "true" })}
                  className="w-full border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-xl py-4 px-3 text-center text-xs font-bold text-gray-500 flex flex-col items-center justify-center gap-1.5 bg-gray-50/50 cursor-pointer"
                >
                  <Search className="w-5 h-5 text-gray-400" />
                  Pilih Customer Outlet &rarr;
                </button>
              )}
            </div>

            {/* Category Selector */}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1.5 block">Kategori Barang (Kunci Nota)</label>
              <div className="relative">
                <Select
                  value={selectedCategory}
                  onValueChange={(val) => {
                    if (orderItems.length > 0) {
                      toast.warning("Hapus semua barang terlebih dahulu untuk mengganti kategori!");
                      return;
                    }
                    setSelectedCategory(val);
                  }}
                  disabled={orderItems.length > 0}
                >
                  <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white">
                    <SelectValue placeholder="Pilih Kategori Barang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori (Kunci)</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {orderItems.length > 0 && (
                <p className="text-[9px] text-gray-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-orange-500" />
                  Kategori terkunci karena sudah ada barang di rincian.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: RINCIAN BARANG (DETAILS) */}
        <Card className="border-0 shadow-xs rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase">Detail Barang</h3>
              {selectedCustomer && selectedCategory !== "all" && (
                <Button
                  onClick={() => {
                    setProductSearchQuery("");
                    setSearchParams({ type: isReturMode ? "retur" : "so", "select-product": "true" });
                  }}
                  className={`${themeBgClass} ${themeBgHoverClass} text-white font-bold rounded-xl h-8 text-xs border-0 px-3 cursor-pointer flex items-center gap-1 shadow-xs`}
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Add Item
                </Button>
              )}
            </div>

            {/* Empty State */}
            {orderItems.length === 0 ? (
              <div className="text-center py-10 text-gray-400 space-y-2 flex flex-col items-center">
                <ShoppingCart className="w-12 h-12 text-gray-300" />
                <p className="text-xs font-bold text-gray-500">Daftar barang belanja masih kosong</p>
                {!selectedCustomer || selectedCategory === "all" ? (
                  <p className="text-[10px] text-gray-400 max-w-[220px] mx-auto leading-relaxed">
                    Harap lengkapi <strong>Header Nota</strong> (Pilih Customer & Kategori) di atas untuk mengisi rincian barang.
                  </p>
                ) : (
                  <p className="text-[10px] text-gray-400 max-w-[200px] mx-auto">
                    Klik tombol <strong>Add Item</strong> di atas untuk menambah barang belanja.
                  </p>
                )}
              </div>
            ) : (
              /* Items List */
              <div className="space-y-3">
                {orderItems.map((item) => (
                  <div 
                    key={item.id}
                    className="border border-gray-100 rounded-xl p-3 bg-gray-50/50 flex justify-between items-start gap-2 hover:border-gray-200 transition-colors"
                  >
                    <div className="flex-1 space-y-1">
                      <h4 className="text-xs font-bold text-gray-900 leading-tight">{item.productName}</h4>
                      <p className="text-[9px] text-gray-400 font-mono">Code: {item.productCode} &bull; {formatCurrency(item.price)}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 rounded border-gray-200 text-gray-600 bg-white">
                          Qty: <strong>{item.quantity}</strong>
                        </Badge>
                        {(item.discountPct > 0 || item.discountRp > 0) && (
                          <Badge variant="outline" className="text-[9px] px-1.5 py-0 rounded border-red-100 text-red-600 bg-red-50/30">
                            <Tag className="w-2.5 h-2.5 mr-0.5 inline-block" />
                            Disc: {item.discountPct > 0 ? `${item.discountPct}%` : ""} {item.discountRp > 0 ? formatCurrency(item.discountRp) : ""}
                          </Badge>
                        )}
                        {item.bonus > 0 && (
                          <Badge variant="outline" className="text-[9px] px-1.5 py-0 rounded border-blue-100 text-blue-600 bg-blue-50/30">
                            <Gift className="w-2.5 h-2.5 mr-0.5 inline-block" />
                            Bonus: <strong>{item.bonus}</strong>
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex flex-col justify-between h-full items-end self-stretch">
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 bg-transparent border-0 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <p className="text-xs font-bold text-gray-800 mt-2">{formatCurrency(item.subtotal)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* SUMMARY NOTA & SAVE BUTTON (STICKY FOOTER) */}
      {selectedCustomer && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <div className="p-4 space-y-3">
            {/* Split Summary Info */}
            <div className="grid grid-cols-3 gap-2 bg-gray-50 rounded-xl p-2.5 text-center text-xs">
              <div className="border-r border-gray-200/60">
                <p className="text-[9px] text-gray-500 mb-0.5 font-semibold">TOTAL DPP</p>
                <p className="font-bold text-gray-800">{formatCurrency(totalDPP)}</p>
              </div>
              <div className="border-r border-gray-200/60">
                <p className="text-[9px] text-gray-500 mb-0.5 font-semibold">PPN (11%)</p>
                <p className="font-bold text-gray-800">{formatCurrency(totalPPN)}</p>
              </div>
              <div>
                <p className={`text-[9px] ${themeTextClass} mb-0.5 font-bold`}>SETELAH PPN</p>
                <p className="font-bold text-gray-900">{formatCurrency(grandTotal)}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  if (orderItems.length > 0) {
                    if (window.confirm("Batalkan pembuatan nota? Semua draf akan hilang.")) {
                      navigate(-1);
                    }
                  } else {
                    navigate(-1);
                  }
                }}
                className="flex-1 h-10 rounded-xl border-gray-200 text-gray-600 font-semibold cursor-pointer"
              >
                Batal
              </Button>
              <Button
                onClick={handleSaveNota}
                disabled={orderItems.length === 0}
                className={`flex-1 ${themeBgClass} ${themeBgHoverClass} text-white font-bold h-10 rounded-xl border-0 shadow-xs cursor-pointer flex items-center justify-center`}
              >
                Simpan Nota
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
