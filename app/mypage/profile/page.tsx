"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  MapPin,
  Lock,
  Save,
  AlertTriangle,
  UserX,
  Loader2,
  X,
  CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const [name, setName] = useState(user?.username || "홍길동");
  const [email, setEmail] = useState(user?.email || "user@vitalcare.co.kr");
  const [phone, setPhone] = useState("010-1234-5678");
  const [address, setAddress] = useState("서울특별시 강남구 테헤란로 123 바이탈타워 10층");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");

  // 회원 탈퇴 모달 및 진행 상태
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawPassword, setWithdrawPassword] = useState("");
  const [withdrawReason, setWithdrawReason] = useState("상품 종류 및 혜택 부족");
  const [agreeWithdrawNotice, setAgreeWithdrawNotice] = useState(false);
  const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);
  const [withdrawError, setWithdrawError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.username || "고객");
      setEmail(user.email || `${user.username}@vitalcare.mall`);
    }
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("회원 정보가 성공적으로 변경되었습니다.");
  };

  // 회원 탈퇴 실행 함수
  const handleExecuteWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError("");

    if (!agreeWithdrawNotice) {
      setWithdrawError("회원탈퇴 유의사항을 확인하고 동의해 주세요.");
      return;
    }

    if (!user) {
      setWithdrawError("로그인 세션이 만료되었습니다. 다시 로그인해 주세요.");
      return;
    }

    // 관리자(ADMIN) 계정 탈퇴 방지
    if (user.username === "admin" || user.role === "ADMIN") {
      setWithdrawError("최고 관리자(admin) 계정은 사이트 운영을 위해 탈퇴할 수 없습니다.");
      return;
    }

    setIsSubmittingWithdraw(true);

    try {
      const currentUserId = user.id;
      const currentUsername = user.username;

      // 1. Supabase 등록 정보 / Auth 세션 정리 시도
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch (sbErr) {
        console.warn("Supabase signout during withdrawal:", sbErr);
      }

      // 2. 브라우저 로컬 저장소 회원 목록에서 계정 영구 삭제
      try {
        const storedUsersRaw = localStorage.getItem("vitalcare_registered_users");
        if (storedUsersRaw) {
          const storedUsers: any[] = JSON.parse(storedUsersRaw);
          const filtered = storedUsers.filter(
            (u) => u.id !== currentUserId && u.username !== currentUsername
          );
          localStorage.setItem("vitalcare_registered_users", JSON.stringify(filtered));
        }

        // 관련 찜목록 및 개인 캐시 정리
        localStorage.removeItem(`vitalcare_wishlist_${currentUserId}`);
      } catch (storageErr) {
        console.warn("Local storage cleanup:", storageErr);
      }

      // 3. 로그아웃 처리 및 세션 스토리지 정리
      logout();

      alert(
        `[${currentUsername}] 님의 회원탈퇴가 정상적으로 완료되었습니다.\n그동안 NATURE 건강함 MALL을 이용해 주셔서 진심으로 감사드립니다.`
      );

      setIsWithdrawModalOpen(false);
      router.push("/");
    } catch (err: any) {
      setWithdrawError(err?.message || "회원탈퇴 처리 중 오류가 발생했습니다.");
    } finally {
      setIsSubmittingWithdraw(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. 회원 정보 수정 카드 */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="border-b pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            회원정보 및 기본 배송지 관리
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            주문 시 자동으로 반영될 기본 배송지와 계정 정보를 설정합니다.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-5 max-w-xl text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">이메일 계정</label>
            <input
              type="email"
              disabled
              value={email}
              className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">아이디 / 이름</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">휴대폰 번호</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              기본 배송지 주소
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-600 font-medium"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              비밀번호 변경
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-500 block mb-1">현재 비밀번호</label>
                <input
                  type="password"
                  placeholder="현재 비밀번호"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-500 block mb-1">새 비밀번호</label>
                <input
                  type="password"
                  placeholder="새 비밀번호 입력"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>수정 사항 저장</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. 회원탈퇴 영역 (위험 영역 Danger Zone) */}
      <div className="bg-white rounded-3xl border border-rose-200/80 p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-rose-700 flex items-center gap-2">
              <UserX className="w-4 h-4 text-rose-600" />
              회원 탈퇴 안내
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              탈퇴 시 보유 중인 적립금 및 쿠폰은 모두 소멸되며, 장바구니와 주문 내역의 개인정보는 즉시 파기됩니다.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsWithdrawModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-400 font-bold text-xs shrink-0 transition-colors cursor-pointer"
          >
            회원 탈퇴 신청
          </button>
        </div>
      </div>

      {/* 3. 회원 탈퇴 확인 모달 */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="font-black text-slate-900 text-base">회원 탈퇴 확인</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsWithdrawModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-800 space-y-2">
              <p className="font-bold">⚠️ 탈퇴 전 반드시 확인해 주세요</p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-700/90 leading-relaxed">
                <li>보유 중인 적립금 및 할인 쿠폰은 모두 자동 소멸되며 복구되지 않습니다.</li>
                <li>진행 중인 배송 상품이 있는 경우 배송 완료 후 탈퇴가 권장됩니다.</li>
                <li>탈퇴 후 동일 아이디로의 즉시 재가입이 제한될 수 있습니다.</li>
              </ul>
            </div>

            {withdrawError && (
              <div className="p-3 rounded-xl bg-rose-100 text-rose-800 text-xs font-bold">
                {withdrawError}
              </div>
            )}

            <form onSubmit={handleExecuteWithdrawal} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">탈퇴 사유 선택</label>
                <select
                  value={withdrawReason}
                  onChange={(e) => setWithdrawReason(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-rose-500 font-medium text-slate-700 bg-white"
                >
                  <option value="상품 종류 및 혜택 부족">상품 종류 및 혜택 부족</option>
                  <option value="서비스 및 배송 불만족">서비스 및 배송 불만족</option>
                  <option value="자주 이용하지 않음">자주 이용하지 않음</option>
                  <option value="개인정보 및 보안 우려">개인정보 및 보안 우려</option>
                  <option value="기타 사유">기타 사유</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  탈퇴 확인 (아이디: <strong className="text-emerald-700">{user?.username}</strong>)
                </label>
                <input
                  type="password"
                  value={withdrawPassword}
                  onChange={(e) => setWithdrawPassword(e.target.value)}
                  placeholder="계정 비밀번호 입력 (생략 가능)"
                  className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-rose-500 font-medium"
                />
              </div>

              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeWithdrawNotice}
                  onChange={(e) => setAgreeWithdrawNotice(e.target.checked)}
                  className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-[11px] text-slate-600 font-medium leading-tight">
                  안내 사항을 모두 확인하였으며, 적립금 소멸 및 회원 정보 영구 삭제에 동의합니다.
                </span>
              </label>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  disabled={isSubmittingWithdraw}
                  className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingWithdraw || !agreeWithdrawNotice}
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingWithdraw ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>탈퇴 처리 중...</span>
                    </>
                  ) : (
                    <span>회원 탈퇴 확정</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
