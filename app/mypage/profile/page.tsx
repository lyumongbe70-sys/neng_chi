"use client";

import { useState } from "react";
import { User, Phone, MapPin, Lock, Save, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  const [name, setName] = useState("홍길동");
  const [email, setEmail] = useState("user@vitalcare.co.kr");
  const [phone, setPhone] = useState("010-1234-5678");
  const [address, setAddress] = useState("서울특별시 강남구 테헤란로 123 바이탈타워 10층");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("회원 정보가 성공적으로 변경되었습니다.");
  };

  return (
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
            className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-slate-700 block mb-1">이름</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">휴대폰 번호</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
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
            className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-600"
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
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
          >
            <Save className="w-4 h-4" />
            <span>수정 사항 저장</span>
          </button>
        </div>
      </form>
    </div>
  );
}
