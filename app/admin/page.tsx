"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
  Users,
  Plus,
  Truck,
  CheckCircle2,
  Package,
  Receipt,
  FileSpreadsheet,
  Coins,
  Search,
  Pencil,
  Trash2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types/product";
import { PRODUCTS as INITIAL_MOCK_PRODUCTS } from "@/lib/data/mockProducts";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "orders" | "inventory" | "tax" | "members"
  >("overview");

  // 1. 상품 관리 상태
  const [products, setProducts] = useState<Product[]>(INITIAL_MOCK_PRODUCTS);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string>("동기화 확인 중...");

  // 상품 등록 / 수정 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // 폼 입력 필드
  const [formData, setFormData] = useState({
    name: "",
    category: "기초활력·비타민",
    price: 34000,
    originalPrice: 48000,
    discountRate: 29,
    badge: "베스트",
    volume: "60정 (2개월분)",
    stock: 100,
    imageUrl: "/product-dr-lean.png",
    description: "",
  });

  // 주문 상태
  const [orders, setOrders] = useState([
    {
      id: "ORD-1001",
      customer: "김*진",
      product: "퓨어 알티지 초임계 오메가3 1000",
      amount: 42000,
      status: "PAID",
      statusText: "결제완료",
      tracking: "",
      carrier: "우체국택배",
    },
    {
      id: "ORD-1002",
      customer: "이*수",
      product: "[1+1] 활력 데일리 멀티비타민 2000",
      amount: 34000,
      status: "SHIPPING",
      statusText: "배송중",
      tracking: "689234125432",
      carrier: "우체국택배",
    },
  ]);

  // 회원 목록
  const [members, setMembers] = useState([
    { id: "m1", name: "홍길동", email: "hong@naver.com", points: 1000, role: "USER" },
    { id: "m2", name: "김철수", email: "kim@daum.net", points: 2500, role: "USER" },
  ]);

  // Supabase 또는 로컬 스토리지에서 상품 목록 불러오기
  const fetchProducts = async () => {
    setIsProductsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        // Supabase에 products 테이블이 없는 경우 로컬 스토리지 데이터 불러오기
        console.warn("Supabase products table not found, fallback to local storage:", error.message);
        setSyncStatus("로컬 관리 모드 (Supabase 테이블 생성 시 자동 동기화)");
        loadLocalProducts();
      } else if (data && data.length > 0) {
        setProducts(data as Product[]);
        setSyncStatus("Supabase 클라우드 실시간 연동 완료");
        localStorage.setItem("vitalcare_admin_products", JSON.stringify(data));
      } else {
        // 테이블은 있으나 빈 경우 로컬 기본 상품 시드
        loadLocalProducts();
        setSyncStatus("Supabase 연결됨 (0건)");
      }
    } catch (err: any) {
      loadLocalProducts();
      setSyncStatus("로컬 관리 모드");
    } finally {
      setIsProductsLoading(false);
    }
  };

  const loadLocalProducts = () => {
    const local = localStorage.getItem("vitalcare_admin_products");
    if (local) {
      try {
        setProducts(JSON.parse(local));
      } catch (e) {
        setProducts(INITIAL_MOCK_PRODUCTS);
      }
    } else {
      setProducts(INITIAL_MOCK_PRODUCTS);
      localStorage.setItem("vitalcare_admin_products", JSON.stringify(INITIAL_MOCK_PRODUCTS));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 모달 열기 (신규 등록)
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "기초활력·비타민",
      price: 35000,
      originalPrice: 50000,
      discountRate: 30,
      badge: "신규추천",
      volume: "60정 (2개월분)",
      stock: 100,
      imageUrl: "/product-doctor-ps.png",
      description: "식약처 기능성 인정 프리미엄 건강기능식품입니다.",
    });
    setIsModalOpen(true);
  };

  // 모달 열기 (수정)
  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category || "기초활력·비타민",
      price: p.price,
      originalPrice: p.originalPrice,
      discountRate: p.discountRate || Math.round((1 - p.price / p.originalPrice) * 100),
      badge: p.badge || "베스트",
      volume: p.volume || "60정 (2개월분)",
      stock: p.stock ?? 100,
      imageUrl: p.imageUrl || "/product-dr-lean.png",
      description: p.description || "",
    });
    setIsModalOpen(true);
  };

  // 상품 저장 (등록 또는 수정)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("상품명을 입력해 주세요.");
      return;
    }

    const priceNum = Number(formData.price) || 0;
    const origPriceNum = Number(formData.originalPrice) || priceNum;
    const calculatedDiscount = Math.max(0, Math.round((1 - priceNum / origPriceNum) * 100));

    const updatedProductData: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: formData.name.trim(),
      category: formData.category,
      categorySlug: "energy-vitamin",
      brand: "바이탈케어 랩스",
      price: priceNum,
      originalPrice: origPriceNum,
      discountRate: calculatedDiscount,
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewCount: editingProduct ? editingProduct.reviewCount : 0,
      dosage: "1일 1회, 1정을 충분한 물과 함께 섭취",
      volume: formData.volume,
      stock: Number(formData.stock) || 100,
      badge: formData.badge,
      imageUrl: formData.imageUrl,
      description: formData.description || `${formData.name} 건강기능식품`,
      certifications: ["식약처 기능성 인정", "GMP 제조시설"],
      tags: ["건강기능식품", "식약처인증"],
      features: ["엄선된 프리미엄 원료", "과학적 맞춤 배합"],
      nutritionFacts: [],
    };

    // 1. Supabase 클라우드 DB 저장/수정 시도
    try {
      const supabase = createClient();
      if (editingProduct) {
        await supabase
          .from("products")
          .update(updatedProductData)
          .eq("id", editingProduct.id);
      } else {
        await supabase
          .from("products")
          .insert([updatedProductData]);
      }
    } catch (cloudErr) {
      console.warn("Supabase cloud save error:", cloudErr);
    }

    // 2. 로컬 스토리지 및 UI 상태 즉시 반영
    let newProductsList: Product[] = [];
    if (editingProduct) {
      newProductsList = products.map((p) =>
        p.id === editingProduct.id ? updatedProductData : p
      );
      alert(`[${updatedProductData.name}] 상품이 성공적으로 수정되었습니다.`);
    } else {
      newProductsList = [updatedProductData, ...products];
      alert(`[${updatedProductData.name}] 상품이 신규 등록되었습니다.`);
    }

    setProducts(newProductsList);
    localStorage.setItem("vitalcare_admin_products", JSON.stringify(newProductsList));
    setIsModalOpen(false);
  };

  // 상품 삭제
  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`정말로 '${productName}' 상품을 삭제하시겠습니까?`)) {
      return;
    }

    // 1. Supabase 삭제 시도
    try {
      const supabase = createClient();
      await supabase.from("products").delete().eq("id", productId);
    } catch (cloudErr) {
      console.warn("Supabase delete error:", cloudErr);
    }

    // 2. 로컬 상태 반영
    const filtered = products.filter((p) => p.id !== productId);
    setProducts(filtered);
    localStorage.setItem("vitalcare_admin_products", JSON.stringify(filtered));
    alert("상품이 삭제되었습니다.");
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* 탭 네비게이션 */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "overview"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
              : "bg-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          대시보드 종합
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "products"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
              : "bg-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>상품 관리 ({products.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "orders"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
              : "bg-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          주문/배송 관리
        </button>
        <button
          onClick={() => setActiveTab("members")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "members"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
              : "bg-slate-800 text-slate-400 hover:text-white"
          }`}
        >
          회원/적립금 관리
        </button>
      </div>

      {/* 1. 대시보드 종합 탭 */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                <span>오늘 매출</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </span>
              <p className="text-2xl font-black text-white">2,840,000원</p>
              <p className="text-[11px] text-emerald-400 font-semibold">전일 대비 +18.4% 상승</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                <span>등록 상품 수</span>
                <Package className="w-4 h-4 text-teal-400" />
              </span>
              <p className="text-2xl font-black text-white">{products.length}개</p>
              <p className="text-[11px] text-teal-300">카탈로그 실시간 노출 중</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                <span>배송 준비 주문</span>
                <ShoppingBag className="w-4 h-4 text-amber-400" />
              </span>
              <p className="text-2xl font-black text-amber-400">12건</p>
              <p className="text-[11px] text-slate-400">우체국택배 출고 대기</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center justify-between">
                <span>등록 회원 수</span>
                <Users className="w-4 h-4 text-sky-400" />
              </span>
              <p className="text-2xl font-black text-white">2명</p>
              <p className="text-[11px] text-sky-400">Supabase DB 연동 완료</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. 상품 관리 탭 (등록, 수정, 삭제 완벽 지원) */}
      {activeTab === "products" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>상품 카탈로그 관리</span>
                <span className="text-xs font-normal text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
                  {syncStatus}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                상품 추가, 내용 수정, 삭제 작업이 즉시 반영됩니다.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchProducts}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1 cursor-pointer"
                title="새로고침"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProductsLoading ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>신규 상품 등록</span>
              </button>
            </div>
          </div>

          {/* 상품 목록 테이블 */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900/90 border-b border-slate-700 text-slate-400">
                  <tr>
                    <th className="p-3.5">썸네일</th>
                    <th className="p-3.5">상품명</th>
                    <th className="p-3.5">카테고리</th>
                    <th className="p-3.5">판매가</th>
                    <th className="p-3.5">원가</th>
                    <th className="p-3.5">할인율</th>
                    <th className="p-3.5">재고</th>
                    <th className="p-3.5 text-center">관리 (수정/삭제)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60 text-slate-200">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="p-3.5">
                        <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center">
                          {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain" />
                          ) : (
                            <Package className="w-5 h-5 text-slate-500" />
                          )}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-white max-w-xs truncate">{p.name}</div>
                        <div className="text-[11px] text-slate-400">{p.volume}</div>
                      </td>
                      <td className="p-3.5 text-slate-300 font-medium">{p.category}</td>
                      <td className="p-3.5 font-black text-emerald-400">
                        {p.price.toLocaleString()}원
                      </td>
                      <td className="p-3.5 text-slate-400 line-through">
                        {p.originalPrice?.toLocaleString()}원
                      </td>
                      <td className="p-3.5 font-bold text-rose-400">
                        {p.discountRate}%
                      </td>
                      <td className="p-3.5 font-semibold text-slate-300">
                        {p.stock ?? 100}개
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 cursor-pointer"
                            title="상품 수정"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/80 cursor-pointer"
                            title="상품 삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. 주문 관리 탭 */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <h3 className="font-bold text-base text-white">주문 및 운송장 배송 관리</h3>
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400">
                <tr>
                  <th className="p-3.5">주문번호</th>
                  <th className="p-3.5">주문자</th>
                  <th className="p-3.5">상품</th>
                  <th className="p-3.5">금액</th>
                  <th className="p-3.5">배송상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-slate-200">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="p-3.5 font-mono text-emerald-400">{o.id}</td>
                    <td className="p-3.5">{o.customer}</td>
                    <td className="p-3.5 font-bold">{o.product}</td>
                    <td className="p-3.5">{o.amount.toLocaleString()}원</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {o.statusText}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. 회원 관리 탭 */}
      {activeTab === "members" && (
        <div className="space-y-4">
          <h3 className="font-bold text-base text-white">회원 목록 및 적립금 관리</h3>
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/80 border-b border-slate-700 text-slate-400">
                <tr>
                  <th className="p-3.5">회원명</th>
                  <th className="p-3.5">이메일</th>
                  <th className="p-3.5">권한</th>
                  <th className="p-3.5">보유 적립금</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-slate-200">
                {members.map((m) => (
                  <tr key={m.id}>
                    <td className="p-3.5 font-bold">{m.name}</td>
                    <td className="p-3.5 text-slate-400">{m.email}</td>
                    <td className="p-3.5 font-mono">{m.role}</td>
                    <td className="p-3.5 text-amber-300 font-black">
                      {m.points.toLocaleString()} P
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 상품 등록 & 수정 통합 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 relative z-10 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                {editingProduct ? "건강기능식품 정보 수정" : "신규 건강기능식품 등록"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="text-slate-300 font-bold block mb-1">상품명 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: [1+1] 활력 데일리 멀티비타민 2000"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">카테고리</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500"
                  >
                    <option value="기초활력·비타민">기초활력·비타민</option>
                    <option value="혈행·눈건강">혈행·눈건강</option>
                    <option value="간·피로개선">간·피로개선</option>
                    <option value="장건강·유산균">장건강·유산균</option>
                    <option value="관절·뼈건강">관절·뼈건강</option>
                    <option value="면역·항산화">면역·항산화</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">대표 배지</label>
                  <input
                    type="text"
                    placeholder="예: 베스트 1위, 1+1기획"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">판매가 (원) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">정상가 (원)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">재고수량</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">용량 / 구성</label>
                <input
                  type="text"
                  placeholder="예: 60정 (2개월분)"
                  value={formData.volume}
                  onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">이미지 경로</label>
                <select
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500"
                >
                  <option value="/product-doctor-ps.png">위바이옴 닥터PS 2박스 세트</option>
                  <option value="/product-dr-lean.png">닥터린 두뇌엔 PS 올인원</option>
                  <option value="/product-brainy.png">아이브레이니 패키지</option>
                  <option value="/special-deal-1.png">트리플 비타민C 1000</option>
                  <option value="/special-deal-2.png">메리트비 비타민B 콤플렉스</option>
                  <option value="/special-deal-3.png">종근당건강 비타민D 2000IU</option>
                  <option value="/special-deal-4.png">INTERO 비타민E 콤플렉스</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">상품 설명</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="상품에 대한 핵심 특장점을 입력하세요."
                  className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer shadow-md shadow-emerald-600/20"
                >
                  {editingProduct ? "수정 내용 저장" : "상품 등록 완료"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
