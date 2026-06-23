import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, MapPin, Phone, CreditCard, ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible";

export function CustomerDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null);

  // Dynamic customer lookup matching the active ID
  const customer = (() => {
    const saved = localStorage.getItem("customers");
    const customerList = saved ? JSON.parse(saved) : [
      { id: 1, name: "PT Maju Jaya", address: "Jl. Gatot Subroto No. 123, Surabaya", balance: 10000000, creditLimit: 15000000, outstanding: 5000000, type: "distributor", phone: "081234567890" },
      { id: 2, name: "Toko Sumber Rejeki", address: "Jl. Merdeka No. 45, Surabaya", balance: 8500000, creditLimit: 10000000, outstanding: 2500000, type: "retail", phone: "081298765432" },
      { id: 3, name: "UD Maju Bersama", address: "Jl. Ahmad Yani No. 123, Surabaya", balance: 12000000, creditLimit: 20000000, outstanding: 8200000, type: "wholesaler", phone: "081255554444" },
      { id: 4, name: "CV Cahaya Terang", address: "Jl. Basuki Rahmat No. 89, Surabaya", balance: 15000000, creditLimit: 25000000, outstanding: 12500000, type: "distributor", phone: "081266667777" },
      { id: 5, name: "Toko Sejahtera", address: "Jl. Diponegoro No. 67, Surabaya", balance: 5000000, creditLimit: 8000000, outstanding: 3400000, type: "retail", phone: "081211112222" }
    ];
    const found = customerList.find((c: any) => c.id.toString() === id);
    return found || {
      id: Number(id),
      name: "Toko Baru Terdaftar",
      address: "Alamat belum tercatat",
      balance: 0,
      creditLimit: 5000000,
      outstanding: 0,
      type: "retail",
      phone: "0812XXXXXXXX",
    };
  })();

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Generate dynamic invoices that match the customer's outstanding balance
  const invoices = customer.outstanding > 0 ? [
    {
      id: "INV-2026-001",
      date: "2026-06-15",
      total: customer.outstanding * 0.4 + 1000000,
      paid: 1000000,
      remaining: customer.outstanding * 0.4,
      status: "partial",
      dueDate: "2026-07-15",
      items: [
        { name: "Indomie Goreng", qty: 200, price: 2500 },
        { name: "Aqua 600ml", qty: 150, price: 3500 },
      ],
    },
    {
      id: "INV-2026-002",
      date: "2026-06-10",
      total: customer.outstanding * 0.6,
      paid: 0,
      remaining: customer.outstanding * 0.6,
      status: "unpaid",
      dueDate: "2026-07-10",
      items: [
        { name: "Teh Pucuk Harum", qty: 120, price: 4000 },
        { name: "Kopi Kapal Api", qty: 80, price: 8500 },
      ],
    }
  ] : [
    {
      id: "INV-2026-003",
      date: "2026-06-05",
      total: 3500000,
      paid: 3500000,
      remaining: 0,
      status: "paid",
      dueDate: "2026-07-05",
      items: [
        { name: "Indomie Goreng", qty: 800, price: 2500 },
        { name: "Aqua 600ml", qty: 420, price: 3500 },
      ],
    }
  ];

  // Dynamic payment history based on customer status
  const paymentHistory = customer.outstanding > 0 ? [
    {
      id: 1,
      date: "2026-06-18",
      amount: 1000000,
      invoiceId: "INV-2026-001",
      method: "Transfer",
    }
  ] : [
    {
      id: 1,
      date: "2026-06-05",
      amount: 3500000,
      invoiceId: "INV-2026-003",
      method: "Cash",
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">Paid</Badge>;
      case "partial":
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-0">Partial</Badge>;
      case "unpaid":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">Unpaid</Badge>;
      default:
        return <Badge variant="secondary" className="border-0">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-xs border-b border-gray-100 rounded-b-2xl mb-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-1 rounded-full hover:bg-gray-100 border-0 bg-transparent cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Customer Detail</h1>
        </div>
      </div>

      {/* Customer Info Card */}
      <div className="px-4 mb-4">
        <Card className="border-0 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-2">{customer.name}</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-2 text-xs">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 leading-tight">{customer.address}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600">{customer.phone}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-500 mb-0.5">Limit Kredit</p>
                <p className="text-sm font-bold text-gray-800">{formatCurrency(customer.creditLimit)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] text-gray-500 mb-0.5">Saldo Berjalan</p>
                <p className="text-sm font-bold text-gray-800">{formatCurrency(customer.balance)}</p>
              </div>
            </div>

            <div className={`rounded-xl p-3 ${customer.outstanding > 0 ? "bg-red-50" : "bg-green-50"}`}>
              <p className={`text-[10px] mb-0.5 ${customer.outstanding > 0 ? "text-red-600" : "text-green-600"}`}>
                Total Piutang (Outstanding)
              </p>
              <p className={`text-lg font-bold ${customer.outstanding > 0 ? "text-red-700" : "text-green-700"}`}>
                {formatCurrency(customer.outstanding)}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
              <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-0 text-[10px] uppercase font-bold px-2 py-0.5 rounded-lg">
                {customer.type}
              </Badge>
              <Badge className="bg-green-50 text-green-700 hover:bg-green-50 border-0 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-12 bg-gray-100 rounded-xl p-1 mb-4">
            <TabsTrigger value="overview" className="rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-gray-900 border-0">Overview</TabsTrigger>
            <TabsTrigger value="invoice" className="rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-gray-900 border-0">Invoice</TabsTrigger>
            <TabsTrigger value="payment" className="rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-gray-900 border-0">Payment</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 outline-none">
            <Card className="border-0 shadow-xs rounded-2xl bg-white">
              <CardContent className="p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Ringkasan Rekening</h3>
                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Faktur Tagihan</span>
                    <span className="font-semibold text-gray-800">{invoices.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Faktur Terbayar Lunas</span>
                    <span className="font-semibold text-green-600">
                      {invoices.filter(inv => inv.status === "paid").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Faktur Pending/Unpaid</span>
                    <span className="font-semibold text-orange-600">
                      {invoices.filter(inv => inv.status !== "paid").length}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="text-gray-600 font-bold">Total Sisa Piutang</span>
                    <span className="text-red-600 font-bold">{formatCurrency(customer.outstanding)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xs rounded-2xl bg-white">
              <CardContent className="p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Aktivitas Terakhir</h3>
                <div className="space-y-3.5">
                  {paymentHistory.map((pmt, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">Pembayaran diterima</p>
                        <p className="text-[10px] text-gray-500">{formatDate(pmt.date)}</p>
                      </div>
                      <span className="text-green-600 font-bold">+{formatCurrency(pmt.amount)}</span>
                    </div>
                  ))}
                  {invoices.map((inv, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">Invoice baru terbit ({inv.id})</p>
                        <p className="text-[10px] text-gray-500">{formatDate(inv.date)}</p>
                      </div>
                      <span className="text-gray-600 font-bold">{formatCurrency(inv.total)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoice Tab */}
          <TabsContent value="invoice" className="space-y-3 outline-none">
            {invoices.map((invoice) => (
              <Collapsible
                key={invoice.id}
                open={expandedInvoice === invoice.id}
                onOpenChange={(open) => setExpandedInvoice(open ? invoice.id : null)}
              >
                <Card className="border-0 shadow-xs rounded-2xl overflow-hidden bg-white">
                  <CollapsibleTrigger className="w-full text-left bg-transparent border-0 p-0 cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 mb-0.5">{invoice.id}</h4>
                          <p className="text-[10px] text-gray-500 font-medium">{formatDate(invoice.date)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(invoice.status)}
                          {expandedInvoice === invoice.id ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-gray-50">
                        <div>
                          <p className="text-[10px] text-gray-400 mb-0.5">Total Tagihan</p>
                          <p className="font-bold text-gray-800">{formatCurrency(invoice.total)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 mb-0.5">Terbayar</p>
                          <p className="font-bold text-green-600">{formatCurrency(invoice.paid)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 mb-0.5">Sisa Tagihan</p>
                          <p className="font-bold text-red-600">{formatCurrency(invoice.remaining)}</p>
                        </div>
                      </div>

                      {invoice.remaining > 0 && (
                        <div className="mt-3 text-[10px] font-medium bg-orange-50/50 text-orange-700 px-2 py-1 rounded-lg inline-block">
                          Jatuh Tempo: {formatDate(invoice.dueDate)}
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-3">
                      <h4 className="text-xs font-bold text-gray-700 mb-2">Rincian Barang</h4>
                      <div className="space-y-2">
                        {invoice.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-xs">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">{item.name}</p>
                              <p className="text-[10px] text-gray-500">
                                {item.qty} pcs x {formatCurrency(item.price)}
                              </p>
                            </div>
                            <p className="font-bold text-gray-800 align-bottom self-end">
                              {formatCurrency(item.qty * item.price)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </TabsContent>

          {/* Payment History Tab */}
          <TabsContent value="payment" className="space-y-3 outline-none">
            {paymentHistory.length > 0 ? (
              paymentHistory.map((payment) => (
                <Card key={payment.id} className="border-0 shadow-xs rounded-2xl bg-white">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2.5">
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 mb-0.5">Kuitansi Pembayaran #{payment.id}</h4>
                        <p className="text-[10px] text-gray-500">{formatDate(payment.date)}</p>
                      </div>
                      <p className="text-sm font-bold text-green-600">{formatCurrency(payment.amount)}</p>
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-2.5 border-t border-gray-50">
                      <span className="text-gray-500 font-medium">Faktur: {payment.invoiceId}</span>
                      <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-0 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {payment.method}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500 bg-white rounded-2xl shadow-xs">
                <CreditCard className="w-10 h-10 mx-auto text-gray-300 mb-1.5" />
                <p className="text-xs font-semibold">Belum ada riwayat pembayaran</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
