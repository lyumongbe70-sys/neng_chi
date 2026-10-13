"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Truck,
  CreditCard,
  MapPin,
  CheckCircle2,
  Clock,
  ChevronLeft,
  Receipt,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  Share2,
  Trash2,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { deleteOrder } from "@/lib/services/orderService";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderDetail {
  id: string;
  orderNumber: string;
  date: string;
  createdAt?: string;
  status: "PAYMENT_PENDING" | "PAID" | "PREPARING" | "SHIPPING" | "DELIVERED";
  statusText: string;
  product?: string;
  productName?: string;
  items?: OrderItem[];
  totalAmount?: number;
  discountAmount?: number;
  usedPoints?: number;
  amount: number;
  finalAmount?: number;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  deliveryNote?: string;
  paymentMethod?: string;
  carrier?: string;
  trackingNumber?: string;
  tracking?: string;
  shippingCompany?: string;
}

export default function OrderDetailClient() {
  const params = useParams();
  const router = useRouter();
  const orderId = (params?.id as string) || "";

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    const loadOrderData = async () => {
      setIsLoading(true);

      // 1. Supabase orders / Order 테이블 조회
      try {
        const supabase = createClient();
        let { data, error } = await supabase
          .from("orders")
          .select("*")
          .or(`order_number.eq.${orderId},id.eq.${orderId}`)
          .maybeSingle();

        if (error || !data) {
          const res = await supabase
            .from("Order")
            .select("*")
            .or(`order_number.eq.${orderId},id.eq.${orderId}`)
            .maybeSingle();
          if (res.data) data = res.data;
        }

        if (data) {
          setOrder({
            id: String(data.id || data.order_number),
            orderNumber: data.order_number || data.id,
            date: data.created_at ? data.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
            status: data.status || "PAID",
            statusText:
              data.status === "DELIVERED"
                ? "배송완료"
                : data.status === "SHIPPING"
                ? "배송중"
                : data.status === "PREPARING"
                ? "배송준비"
                : "결제완료",
            productName: data.product_name || `주문 상품 (${data.recipient_name || "고객"} 님)`,
            product: data.product_name,
            amount: Number(data.final_amount || data.total_amount || 0),
            totalAmount: Number(data.total_amount || data.final_amount || 0),
            discountAmount: Number(data.discount_amount || 0),
            usedPoints: Number(data.used_points || 0),
            recipientName: data.recipient_name || "고객",
            recipientPhone: data.recipient_phone || "010-1234-5678",
            shippingAddress: data.shipping_address || "서울특별시 강남구 테헤란로 123 바이탈타워 10층",
            deliveryNote: data.delivery_note || "문 앞에 놓아주세요",
            paymentMethod: data.payment_method || "KAKAOPAY",
            carrier: data.carrier || "우체국택배",
            trackingNumber: data.tracking_number || "",
          });
          setIsLoading(false);
          return;
        }
      } catch (err) {}

      // 2. 로컬 스토리지 검색
      if (typeof window !== "undefined") {
        try {
          const userOrders: OrderDetail[] = JSON.parse(
            localStorage.getItem("vitalcare_user_orders") || "[]"
          );
          let found = userOrders.find(
            (o) => o.id === orderId || o.orderNumber === orderId
          );

          if (!found) {
            const adminOrders: any[] = JSON.parse(
              localStorage.getItem("vitalcare_admin_orders") || "[]"
            );
            const foundAdmin = adminOrders.find((o) => o.id === orderId);
            if (foundAdmin) {
              found = {
                id: foundAdmin.id,
                orderNumber: foundAdmin.id,
                date: new Date().toISOString().split("T")[0],
                status: foundAdmin.status || "PAID",
                statusText: foundAdmin.statusText || "결제완료",
                productName: foundAdmin.product,
                product: foundAdmin.product,
                amount: foundAdmin.amount,
                recipientName: foundAdmin.customer || "고객",
                recipientPhone: "010-1234-5678",
                shippingAddress: "서울특별시 강남구 테헤란로 123 바이탈타워 10층",
                paymentMethod: "KAKAOPAY",
                carrier: foundAdmin.carrier || "우체국택배",
                trackingNumber: foundAdmin.tracking || "",
              };
            }
          }

          if (found) {
            setOrder(found);
          } else {
            setOrder({
              id: orderId,
              orderNumber: orderId,
              date: new Date().toISOString().split("T")[0],
              status: "PAID",
              statusText: "결제완료",
              productName: "바이탈 올인원 고함량 활력 멀티비타민 & 미네랄",
              product: "바이탈 올인원 고함량 활력 멀티비타민 & 미네랄",
              items: [
                {
                  id: "item-1",
                  name: "바이탈 올인원 고함량 활력 멀티비타민 & 미네랄",
                  price: 31900,
                  quantity: 1,
                },
              ],
              totalAmount: 34000,
              discountAmount: 5100,
              usedPoints: 0,
              amount: 31900,
              finalAmount: 31900,
              recipientName: "홍길동",
              recipientPhone: "010-1234-5678",
              shippingAddress: "서울특별시 강남구 테헤란로 123 바이탈타워 10층",
              deliveryNote: "문 앞에 놓아주세요 (배송 후 문자 부탁드립니다)",
              paymentMethod: "KAKAOPAY",
              carrier: "우체국택배",
              trackingNumber: "",
            });
          }
        } catch (e) {
          console.error("Order load error:", e);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadOrderData();
  }, [orderId]);

  const handleDeleteThisOrder = async () => {
    if (!order) return;
    const isConfirmed = window.confirm(
      `주문번호 [${order.orderNumber}] 내역을 삭제하시겠습니까?\n삭제하시면 Order 테이블과 주문 목록에서 즉시 영구 삭제됩니다.`
    );
    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      const res = await deleteOrder(order.orderNumber, order.id);
      if (res.success) {
        alert(`주문번호 [${order.orderNumber}] 내역이 Order 테이블 및 목록에서 삭제되었습니다.`);
        router.push("/mypage");
      } else {
        alert("주문 삭제에 실패했습니다: " + res.error);
      }
    } catch (err: any) {
      alert("주문 삭제 중 오류 발생: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-xs text-slate-400">
        주문 상세 정보를 불러오는 중입니다...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
        <Package className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">주문 내역을 찾을 수 없습니다.</h2>
        <p className="text-xs text-slate-500">주문번호를 다시 확인해 주세요.</p>
        <Link
          href="/mypage"
          className="inline-block px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
        >
          마이페이지 주문목록으로
        </Link>
      </div>
    );
  }

  const paymentMethodLabel = (method?: string) => {
    switch (method) {
      case "KAKAOPAY":
        return "카카오페이 간편결제";
      case "TOSSPAY":
        return "토스페이 간편결제";
      case "CARD":
        return "신용/체크카드 결제";
      case "BANK_TRANSFER":
        return "실시간 계좌이체";
      default:
        return "간편결제 (카카오페이)";
    }
  };

  const statusBadgeColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "SHIPPING":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "PREPARING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* 상단 브레드크럼 및 뒤로가기 */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>이전 화면으로 돌아가기</span>
        </button>

        <span className="text-xs text-slate-400 font-mono">
          주문일시: {order.date}
        </span>
      </div>

      {/* 헤더 섹션: 주문번호 & 진행 상태 */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="text-xs text-slate-400 font-medium">주문 상세 번호</div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-0.5">
              {order.orderNumber || order.id}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadgeColor(
                order.status
              )}`}
            >
              {order.statusText}
            </span>
          </div>
        </div>

        {/* 5단계 배송 트래킹 진행바 */}
        <div className="pt-2">
          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            {[
              { label: "입금대기", active: order.status === "PAYMENT_PENDING" },
              {
                label: "결제완료",
                active: ["PAID", "PREPARING", "SHIPPING", "DELIVERED"].includes(
                  order.status
                ),
              },
              {
                label: "배송준비",
                active: ["PREPARING", "SHIPPING", "DELIVERED"].includes(order.status),
              },
              {
                label: "배송중",
                active: ["SHIPPING", "DELIVERED"].includes(order.status),
              },
              { label: "배송완료", active: order.status === "DELIVERED" },
            ].map((step, idx) => (
              <div key={idx} className="space-y-1.5">
                <div
                  className={`h-2 rounded-full transition-colors ${
                    step.active ? "bg-emerald-600" : "bg-slate-100"
                  }`}
                />
                <span
                  className={`text-[11px] font-bold ${
                    step.active ? "text-emerald-700" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2열 메인 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 좌측 7열: 1. 주문 상품 상세 내용 */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>주문 상품 상세내용</span>
            </h2>

            {order.items && order.items.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-4 first:pt-1 last:pb-1 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-snug">
                        {item.name}
                      </h3>
                      <div className="text-xs text-slate-500 mt-1">
                        수량: <span className="font-bold text-slate-700">{item.quantity}개</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-sm text-slate-900">
                        {(item.price * item.quantity).toLocaleString()}원
                      </div>
                      <div className="text-[11px] text-slate-400">
                        (개당 {item.price.toLocaleString()}원)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-3 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {order.productName || order.product || "바이탈 올인원 건강기능식품"}
                  </h3>
                  <div className="text-xs text-slate-500 mt-1">수량: 1개</div>
                </div>
                <div className="text-right font-extrabold text-sm text-slate-900">
                  {order.amount.toLocaleString()}원
                </div>
              </div>
            )}
          </div>

          {/* 2. 배송 상세내용 */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>배송 상세내용</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-medium">받는 분</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {order.recipientName}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-medium">연락처</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {order.recipientPhone}
                </span>
              </div>

              <div className="flex justify-between items-start py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-medium shrink-0">배송지 주소</span>
                <span className="font-bold text-slate-800 text-right max-w-xs leading-relaxed flex items-start gap-1 justify-end">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  {order.shippingAddress}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400 font-medium">배송 요청사항</span>
                <span className="font-medium text-slate-600 text-right">
                  {order.deliveryNote || "문 앞에 놓아주세요"}
                </span>
              </div>

              <div className="flex justify-between py-1.5">
                <span className="text-slate-400 font-medium">택배사 / 송장번호</span>
                <span className="font-bold text-emerald-700">
                  {order.carrier || "우체국택배"}&nbsp;
                  {order.trackingNumber || order.tracking ? (
                    <span className="font-mono underline">({order.trackingNumber || order.tracking})</span>
                  ) : (
                    "(상품 준비 후 송장이 등록됩니다)"
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 우측 5열: 3. 결제 상세내용 */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>결제 상세내용</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 text-slate-600">
                <span>총 주문 상품 금액</span>
                <span className="font-bold text-slate-800">
                  {((order.totalAmount || order.amount) + (order.discountAmount || 0)).toLocaleString()}원
                </span>
              </div>

              {order.discountAmount && order.discountAmount > 0 ? (
                <div className="flex justify-between py-1 text-rose-600">
                  <span>쿠폰 할인 혜택</span>
                  <span className="font-bold">
                    -{order.discountAmount.toLocaleString()}원
                  </span>
                </div>
              ) : null}

              {order.usedPoints && order.usedPoints > 0 ? (
                <div className="flex justify-between py-1 text-amber-600">
                  <span>포인트 사용</span>
                  <span className="font-bold">
                    -{order.usedPoints.toLocaleString()}P
                  </span>
                </div>
              ) : null}

              <div className="flex justify-between py-1 text-slate-600">
                <span>배송비</span>
                <span className="font-bold text-emerald-700">
                  무료배송
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-sm font-black text-slate-900">최종 결제 금액</span>
                <span className="text-xl font-black text-emerald-700">
                  {order.amount.toLocaleString()}원
                </span>
              </div>

              <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-500">
                  <span>결제 수단</span>
                  <span className="font-bold text-slate-800">
                    {paymentMethodLabel(order.paymentMethod)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>결제 상태</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    결제 완료
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <Link
                href="/mypage"
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>마이페이지 주문목록 전체보기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={handleDeleteThisOrder}
                disabled={isDeleting}
                className="w-full py-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>삭제 처리 중...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>이 주문 내역 삭제 (Order 테이블에서 삭제)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 안심 보증 카드 */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-900 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">100% 정품 보증 & 안심 배송</p>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                바이탈케어는 식약처 인증 시설에서 제조된 정품만을 우체국 안심 택배로 안전하게 발송합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
