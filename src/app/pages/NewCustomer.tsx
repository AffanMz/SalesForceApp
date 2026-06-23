import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, UserPlus, MapPin, Phone, CreditCard, Layers } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
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

export function NewCustomer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    creditLimit: "",
    type: "retail",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.phone || !formData.creditLimit) {
      toast.error("Semua field wajib diisi!");
      return;
    }

    // Load active customers list
    const saved = localStorage.getItem("customers");
    let customersList: CustomerItem[] = [];
    if (saved) {
      try {
        customersList = JSON.parse(saved);
      } catch (err) {
        console.error(err);
      }
    }

    const nextId = customersList.reduce((max, c) => (c.id > max ? c.id : max), 0) + 1;
    const newCustomer: CustomerItem = {
      id: nextId,
      name: formData.name,
      address: formData.address,
      balance: 0,
      creditLimit: parseFloat(formData.creditLimit) || 0,
      outstanding: 0,
      type: formData.type,
      phone: formData.phone,
    };

    const updated = [newCustomer, ...customersList];
    localStorage.setItem("customers", JSON.stringify(updated));
    toast.success(`Outlet "${formData.name}" berhasil didaftarkan!`);

    navigate("/customer", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-xs border-b border-gray-100 rounded-b-2xl flex-shrink-0 mb-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-1 rounded-full hover:bg-gray-100 border-0 bg-transparent cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Registrasi Outlet Baru</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        <Card className="border-0 shadow-sm rounded-2xl bg-white overflow-hidden">
          <CardContent className="p-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100 mb-2">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <UserPlus className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Form Profil Outlet</h3>
                  <p className="text-[10px] text-gray-400">Pastikan alamat dan telepon sesuai berkas fisik</p>
                </div>
              </div>

              {/* Outlet Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 block">Nama Outlet</label>
                <div className="relative">
                  <Input
                    placeholder="Contoh: Toko Berkah Abadi"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-11 rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-[#45C55D]"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 block">Alamat Lengkap</label>
                <div className="relative">
                  <Input
                    placeholder="Contoh: Jl. Diponegoro No. 10, Surabaya"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="h-11 rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-[#45C55D]"
                    required
                  />
                </div>
              </div>

              {/* Phone and Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 block">Nomor Telepon</label>
                  <Input
                    placeholder="0812XXXXXXXX"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-11 rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-[#45C55D]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 block">Tipe Outlet</label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white">
                      <SelectValue placeholder="Pilih Tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="wholesaler">Wholesaler</SelectItem>
                      <SelectItem value="distributor">Distributor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Credit Limit */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 block">Limit Kredit Awal (Rp)</label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <Input
                    placeholder="Contoh: 10000000"
                    type="number"
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                    className="pl-11 h-11 rounded-xl border-gray-200 focus-visible:ring-1 focus-visible:ring-[#45C55D]"
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-10 rounded-xl border-gray-200 cursor-pointer"
                  onClick={() => navigate(-1)}
                >
                  Batal
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 bg-[#45C55D] hover:bg-[#38A34A] text-white border-0 h-10 rounded-xl cursor-pointer font-bold shadow-xs"
                >
                  Daftarkan Outlet
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
