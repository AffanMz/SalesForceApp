import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { KeyRound, User, Lock, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export function Login() {
  const navigate = useNavigate();
  const [salesCode, setSalesCode] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!salesCode.trim() || !password.trim()) {
      toast.error("Harap isi Kode Sales dan Password!");
      return;
    }

    setIsLoading(true);

    // Simulate authentication check
    setTimeout(() => {
      setIsLoading(false);
      // Accept any code starting with SA- or standard SA-001, and password as validation
      const codeUpper = salesCode.trim().toUpperCase();
      if ((codeUpper.startsWith("SA-") || codeUpper === "SALES") && password.length >= 4) {
        localStorage.setItem("salesCode", codeUpper);
        toast.success("Login berhasil! Selamat bekerja.");
        navigate("/", { replace: true });
      } else {
        toast.error("Kode Sales atau Password salah! (Gunakan: SA-001 / password)");
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 max-w-md mx-auto">
      {/* Upper Logo / Branding */}
      <div className="text-center mb-6 flex flex-col items-center">
        <div className="w-16 h-16 bg-gradient-to-br from-[#45C55D] to-[#2b9348] rounded-2xl flex items-center justify-center shadow-lg text-white mb-3">
          <TrendingUp className="w-9 h-9" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">SalesForce PWA</h1>
        <p className="text-xs text-gray-500 mt-1">Sistem Informasi Kunjungan & Order Lapangan</p>
      </div>

      {/* Login Card */}
      <Card className="w-full border-0 shadow-lg rounded-3xl bg-white overflow-hidden">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Masuk Akun</h2>
              <p className="text-xs text-gray-400">Masukkan kode sales dan password Anda</p>
            </div>

            {/* Sales ID Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 block">ID Sales (Kode Sales)</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Contoh: SA-001"
                  value={salesCode}
                  onChange={(e) => setSalesCode(e.target.value)}
                  disabled={isLoading}
                  className="pl-11 h-12 rounded-2xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-[#45C55D] uppercase"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="pl-11 h-12 rounded-2xl border-gray-200 bg-gray-50/50 focus-visible:ring-1 focus-visible:ring-[#45C55D]"
                  required
                />
              </div>
            </div>

            {/* Helper Hint */}
            <div className="bg-emerald-50 text-[#2b9348] text-[10px] rounded-xl p-3 flex items-start gap-2 border border-emerald-100">
              <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Petunjuk Demo:</strong> Masukkan ID Sales <code>SA-001</code> dan password <code>password</code>.
              </span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#45C55D] hover:bg-[#38A34A] text-white font-bold h-12 rounded-2xl border-0 shadow-xs cursor-pointer flex items-center justify-center transition-all"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi...</span>
                </div>
              ) : (
                <span>Masuk Sekarang</span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="text-center mt-6 text-[10px] text-gray-400 font-medium">
        SalesForce Mobile App v0.0.1 &bull; PWA Standalone Ready
      </div>
    </div>
  );
}
