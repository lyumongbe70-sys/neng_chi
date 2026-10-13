import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  variant?: "light" | "dark";
  className?: string;
  href?: string;
}

export default function Logo({
  size = "md",
  showText = true,
  variant = "light",
  className = "",
  href = "/",
}: LogoProps) {
  const iconDimensions = {
    sm: { width: 38, height: 26, boxSize: "w-9 h-7" },
    md: { width: 48, height: 33, boxSize: "w-12 h-9" },
    lg: { width: 64, height: 44, boxSize: "w-16 h-11" },
  }[size];

  const content = (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Pinterest 레퍼런스 기반 정품 자연 잎사귀/꽃봉오리 엠블럼 */}
      <div className="relative shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
        <Image
          src="/logo-symbol.png"
          alt="NATURE 건강함 로고"
          width={iconDimensions.width}
          height={iconDimensions.height}
          priority
          style={{ width: "auto", height: "auto" }}
          className="object-contain drop-shadow-xs"
        />
      </div>

      {showText && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight text-lg sm:text-2xl ${
                variant === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              NATURE <span className="text-emerald-600 font-extrabold">건강함</span>
            </span>
            <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 tracking-wider">
              MALL
            </span>
          </div>
          <span
            className={`text-[10px] sm:text-[11px] font-bold block -mt-0.5 tracking-wider ${
              variant === "dark" ? "text-emerald-400/80" : "text-slate-400"
            }`}
          >
            프리미엄 건강기능식품 전문몰
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
