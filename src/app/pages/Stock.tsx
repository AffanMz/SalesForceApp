import { useState } from "react";
import { Search, Filter, ChevronRight } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";

export function Stock() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [filters, setFilters] = useState({
    category: "all",
    warehouse: "all",
    stockStatus: "all",
  });

  const products = [
    {
      id: 1,
      name: "Indomie Goreng",
      code: "IMG-001",
      category: "Noodles",
      price: 2500,
      stock: 1500,
      warehouse: "Warehouse A",
      minStock: 500,
      status: "available",
    },
    {
      id: 2,
      name: "Aqua 600ml",
      code: "AQA-600",
      category: "Beverages",
      price: 3500,
      stock: 2000,
      warehouse: "Warehouse A",
      minStock: 800,
      status: "available",
    },
    {
      id: 3,
      name: "Teh Pucuk Harum",
      code: "TPH-350",
      category: "Beverages",
      price: 4000,
      stock: 350,
      warehouse: "Warehouse B",
      minStock: 500,
      status: "low",
    },
    {
      id: 4,
      name: "Kopi Kapal Api",
      code: "KKA-165",
      category: "Coffee",
      price: 8500,
      stock: 800,
      warehouse: "Warehouse A",
      minStock: 300,
      status: "available",
    },
    {
      id: 5,
      name: "Mie Sedaap Goreng",
      code: "MSG-001",
      category: "Noodles",
      price: 2600,
      stock: 0,
      warehouse: "Warehouse B",
      minStock: 500,
      status: "empty",
    },
    {
      id: 6,
      name: "Beras Premium 5kg",
      code: "BRP-005",
      category: "Rice",
      price: 65000,
      stock: 1200,
      warehouse: "Warehouse A",
      minStock: 200,
      status: "available",
    },
    {
      id: 7,
      name: "Minyak Goreng 1L",
      code: "MGT-001",
      category: "Cooking Oil",
      price: 18000,
      stock: 150,
      warehouse: "Warehouse B",
      minStock: 400,
      status: "low",
    },
    {
      id: 8,
      name: "Gula Pasir 1kg",
      code: "GPL-001",
      category: "Sugar",
      price: 15000,
      stock: 900,
      warehouse: "Warehouse A",
      minStock: 300,
      status: "available",
    },
  ];

  const formatCurrency = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  const getStockBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs">
            Available
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 text-xs">
            Low Stock
          </Badge>
        );
      case "empty":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 text-xs">
            Empty
          </Badge>
        );
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>;
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-5 border-b border-gray-100 rounded-b-2xl shadow-xs mb-4">
        <h1 className="text-lg font-bold text-gray-900 mb-4">Stock</h1>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari barang..."
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
            <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filter Products</SheetTitle>
              </SheetHeader>
              <div className="py-6 space-y-4">
                <div>
                  <label className="text-sm mb-2 block">Category</label>
                  <Select value={filters.category} onValueChange={(value) => setFilters({ ...filters, category: value })}>
                    <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="noodles">Noodles</SelectItem>
                      <SelectItem value="beverages">Beverages</SelectItem>
                      <SelectItem value="coffee">Coffee</SelectItem>
                      <SelectItem value="rice">Rice</SelectItem>
                      <SelectItem value="cooking-oil">Cooking Oil</SelectItem>
                      <SelectItem value="sugar">Sugar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm mb-2 block">Warehouse</label>
                  <Select value={filters.warehouse} onValueChange={(value) => setFilters({ ...filters, warehouse: value })}>
                    <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white">
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Warehouses</SelectItem>
                      <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                      <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm mb-2 block">Stock Status</label>
                  <Select value={filters.stockStatus} onValueChange={(value) => setFilters({ ...filters, stockStatus: value })}>
                    <SelectTrigger className="h-11 rounded-xl border-gray-200 bg-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="low">Low Stock</SelectItem>
                      <SelectItem value="empty">Empty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 h-10 rounded-xl border-gray-200 cursor-pointer"
                    onClick={() => setFilters({
                      category: "all",
                      warehouse: "all",
                      stockStatus: "all",
                    })}
                  >
                    Reset
                  </Button>
                  <Button className="flex-1 bg-[#45C55D] hover:bg-[#38A34A] text-white border-0 h-10 rounded-xl cursor-pointer">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Stock Summary */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-0 shadow-sm rounded-xl">
            <CardContent className="p-3">
              <p className="text-xs text-gray-500 mb-1">Available</p>
              <p className="text-lg text-green-600">5</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm rounded-xl">
            <CardContent className="p-3">
              <p className="text-xs text-gray-500 mb-1">Low Stock</p>
              <p className="text-lg text-orange-600">2</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm rounded-xl">
            <CardContent className="p-3">
              <p className="text-xs text-gray-500 mb-1">Empty</p>
              <p className="text-lg text-red-600">1</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product List */}
      <div className="px-4 pb-5 space-y-3">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className="border-0 shadow-sm rounded-2xl cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedProduct(product)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                {/* Product Image Placeholder */}
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4>{product.name}</h4>
                    {getStockBadge(product.status)}
                  </div>
                  <p className="text-xs text-gray-500 mb-2">Code: {product.code}</p>
                  <p className="text-sm text-[#45C55D]">{formatCurrency(product.price)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Stock</p>
                  <p className={`text-sm ${
                    product.status === "empty" ? "text-red-600" :
                    product.status === "low" ? "text-orange-600" :
                    "text-gray-900"
                  }`}>
                    {product.stock} units
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Warehouse</p>
                  <p className="text-sm">{product.warehouse}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product Detail Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle>Product Detail</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <div className="w-14 h-14 bg-gray-300 rounded-xl"></div>
                </div>
                <div className="flex-1">
                  <h3 className="mb-1">{selectedProduct.name}</h3>
                  <p className="text-sm text-gray-500">{selectedProduct.code}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Category</p>
                  <p className="text-sm">{selectedProduct.category}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Price</p>
                  <p className="text-sm">{formatCurrency(selectedProduct.price)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Current Stock</p>
                  <p className="text-lg">{selectedProduct.stock}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">Min Stock</p>
                  <p className="text-lg">{selectedProduct.minStock}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">Warehouse</p>
                <p className="text-sm">{selectedProduct.warehouse}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-2">Status</p>
                {getStockBadge(selectedProduct.status)}
              </div>

              <Button
                className="w-full bg-[#45C55D] hover:bg-[#38A34A] h-12 rounded-xl"
                onClick={() => setSelectedProduct(null)}
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
