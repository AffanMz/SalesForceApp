import { ArrowLeft, Package, TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate, useParams } from "react-router";

export function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock product data
  const product = {
    name: "Indomie Goreng Original",
    code: "IDM-001",
    category: "Food & Beverage",
    price: "Rp 2.500",
    stock: 1250,
    status: "available",
    unit: "pcs",
    warehouse: "Warehouse A",
    minStock: 100,
    lastRestocked: "20 Jun 2026",
  };

  const salesHistory = [
    { date: "23 Jun 2026", quantity: 150, revenue: "Rp 375.000" },
    { date: "22 Jun 2026", quantity: 200, revenue: "Rp 500.000" },
    { date: "21 Jun 2026", quantity: 180, revenue: "Rp 450.000" },
    { date: "20 Jun 2026", quantity: 120, revenue: "Rp 300.000" },
  ];

  const stockMovement = [
    { date: "23 Jun 2026", type: "Out", quantity: -150, note: "Sales Order #123" },
    { date: "22 Jun 2026", type: "Out", quantity: -200, note: "Sales Order #122" },
    { date: "20 Jun 2026", type: "In", quantity: +500, note: "Restock from supplier" },
    { date: "19 Jun 2026", type: "Out", quantity: -180, note: "Sales Order #121" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-4">
      {/* Header */}
      <div className="bg-white px-4 py-4 shadow-xs border-b border-gray-100 rounded-b-2xl mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1 rounded-full hover:bg-gray-100 border-0 bg-transparent cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Product Detail</h1>
        </div>
      </div>

      {/* Product Image & Info */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          {/* Product Image Placeholder */}
          <div className="w-full h-48 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
            <Package className="w-20 h-20 text-gray-400" />
          </div>

          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">{product.name}</h2>
              <p className="text-sm text-gray-500">{product.code}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                product.status === "available"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              Available
            </span>
          </div>

          <p className="text-2xl font-bold text-[#45C55D] mb-4">{product.price}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Category</p>
              <p className="font-semibold text-gray-800">{product.category}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Unit</p>
              <p className="font-semibold text-gray-800">{product.unit}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Warehouse</p>
              <p className="font-semibold text-gray-800">{product.warehouse}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Min Stock</p>
              <p className="font-semibold text-gray-800">{product.minStock}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Info */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3">Stock Information</h3>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-500 mb-1">Current Stock</p>
              <p className="text-3xl font-bold text-[#45C55D]">{product.stock}</p>
            </div>
            <div className="w-20 h-20 rounded-full border-4 border-[#45C55D] flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-bold text-[#45C55D]">95%</p>
                <p className="text-xs text-gray-500">OK</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Last restocked: <span className="font-semibold">{product.lastRestocked}</span>
          </p>
        </div>
      </div>

      {/* Sales History */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3">Sales History</h3>
          <div className="space-y-3">
            {salesHistory.map((sale, index) => (
              <div key={index} className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{sale.date}</p>
                  <p className="text-xs text-gray-500">Quantity: {sale.quantity} {product.unit}</p>
                </div>
                <p className="font-bold text-[#45C55D]">{sale.revenue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stock Movement */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-3">Stock Movement</h3>
          <div className="space-y-3">
            {stockMovement.map((movement, index) => (
              <div
                key={index}
                className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    movement.type === "In" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {movement.type === "In" ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{movement.note}</p>
                      <p className="text-xs text-gray-500">{movement.date}</p>
                    </div>
                    <p
                      className={`font-bold ${
                        movement.type === "In" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {movement.quantity > 0 ? "+" : ""}
                      {movement.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
