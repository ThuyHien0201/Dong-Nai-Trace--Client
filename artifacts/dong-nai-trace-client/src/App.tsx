import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import skhcnLogo from "@assets/Logo-SKHCN-2026_1785046021867.png";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MapPin,
  ShieldCheck,
  ArrowUpRight,
  CircleCheck,
  AlertCircle,
  Loader2,
  HelpCircle,
  LayoutDashboard,
  Building2,
  Package,
  FileCheck2,
  QrCode,
  BarChart3,
  UsersRound,
  Search,
  Bell,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock3,
  CheckCircle2,
  UserPlus,
  ScanLine,
  MoreHorizontal,
  SlidersHorizontal,
} from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Analytics from "@/pages/analytics";
import Businesses from "@/pages/businesses";
import Products from "@/pages/products";
import Categories from "@/pages/categories";
import CMS from "@/pages/cms";
import Support from "@/pages/support";
import System from "@/pages/system";
import { DashboardShell } from "@/components/dashboard-shell";
import { Route, Switch, Router as WouterRouter, useLocation } from "wouter";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const queryClient = new QueryClient();

type FormStatus = "idle" | "loading" | "success";

function TraceMark({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 ${compact ? "gap-2.5" : ""}`}
      data-testid="brand-logo"
    >
      <div
        className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_8px_18px_rgba(39,64,186,.16)] ${compact ? "h-10 w-10" : "h-[52px] w-[52px]"}`}
      >
        <img
          src={skhcnLogo}
          alt="Logo Sở Khoa học và Công nghệ tỉnh Đồng Nai"
          className="h-full w-full object-contain"
        />
      </div>
      <div className="leading-none">
        <div
          className={`font-bold tracking-[-.04em] text-[#2740BA] ${compact ? "text-[17px]" : "text-[20px]"}`}
        >
          Đồng Nai <span className="text-[#E8650A]">Trace</span>
        </div>
        <div
          className={`mt-1 font-mono uppercase tracking-[.16em] text-slate-500 ${compact ? "text-[8px]" : "text-[9px]"}`}
        >
          Trace with confidence
        </div>
      </div>
    </div>
  );
}



function PortalOverview() {
  return (
    <section
      className="relative hidden min-h-[100dvh] flex-col overflow-hidden bg-[#152978] px-10 py-10 text-white lg:flex xl:px-16"
      aria-label="Giới thiệu Đồng Nai Trace"
    >
     
      <div className="relative z-10 flex items-start justify-between">
        <TraceMark />
        
      </div>
      <div className="relative z-10 mt-auto max-w-[560px] pb-9 pt-20">
        <div className="mb-7 flex items-center gap-3 text-[#ffb265]">
          <span className="h-px w-9 bg-[#ffb265]" />
          
        </div>
        <h1 className="max-w-[520px] text-balance text-[clamp(2.6rem,4.2vw,4.65rem)] font-bold leading-[1.06] tracking-[-.055em]">
          Mỗi sản phẩm,
          <br />
          <span className="text-[#ffb265]">một câu chuyện.</span>
         
        </h1>
        
      </div>
      <div className="relative z-10 flex items-end justify-between border-t border-white/15 pt-5">
        <div className="flex items-center gap-2 text-blue-100/70">
          <MapPin className="h-4 w-4 text-[#ffad5e]" strokeWidth={1.5} />
          <span className="text-xs">Đồng Nai, Việt Nam</span>
        </div>
       
      </div>
    </section>
  );
}

function MobileBrand() {
  return (
    <div className="relative overflow-hidden bg-[#152978] px-6 pb-7 pt-7 text-white lg:hidden">
      <div className="absolute -right-20 -top-24 h-60 w-60 rounded-full bg-[#314ac6]/50 blur-3xl" />
      <div className="relative z-10 flex items-center justify-between">
        <TraceMark compact />
      </div>
      <div className="relative z-10 mt-7 flex items-end justify-between gap-4">
        <div>
          <h1 className="mt-2 text-[25px] font-bold leading-tight tracking-[-.045em]">
            Mỗi sản phẩm là một câu chuyện
          </h1>
        </div>
        <div className="relative h-20 w-20 shrink-0 opacity-75">
          <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true">
            <path
              d="M3 62C22 48 23 35 36 30s19-1 26-13 12-9 17-14"
              fill="none"
              stroke="#ffad5e"
              strokeWidth="2"
              strokeDasharray="1 7"
              strokeLinecap="round"
            />
            <circle cx="23" cy="47" r="3" fill="#fff" />
            <circle cx="55" cy="22" r="3" fill="#fff" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const [, setLocation] = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setForgotSent(false);
    if (!identifier.trim() || !password.trim()) {
      setStatus("idle");
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }
    if (identifier.trim().length < 3 || password.length < 6) {
      setStatus("idle");
      setError(
        "Thông tin đăng nhập chưa đúng định dạng. Vui lòng kiểm tra lại.",
      );
      return;
    }
    setError("");
    setStatus("loading");
    window.setTimeout(() => {
      setStatus("success");
      window.setTimeout(() => setLocation("/dashboard"), 650);
    }, 850);
  };

  const handleForgotPassword = () => {
    setForgotSent(true);
    setError("");
  };

  return (
    <section
      className="flex min-h-[calc(100dvh-0px)] flex-1 items-center justify-center bg-[#f5f7fb] px-5 py-10 sm:px-10 lg:px-14 xl:px-24"
      aria-label="Đăng nhập"
    >
      <div className="w-full max-w-[475px] animate-rise-in">
        <div className="mb-9 lg:hidden">
          <MobileBrand />
        </div>
        <div className="mb-8 hidden items-start justify-between lg:flex">
          <div>
            <h2 className="mt-3 text-3xl font-bold tracking-[-.045em] text-[#17213a]">
              Đăng nhập
            </h2>
          </div>
          <div className="mt-1 rounded-full bg-[#e9edff] p-2.5 text-[#2740BA]">
            <ShieldCheck className="h-5 w-5" strokeWidth={1.7} />
          </div>
        </div>
        <div className="rounded-[24px] border border-[#e0e5ef] bg-white p-6 shadow-[0_18px_60px_rgba(30,50,100,.08)] sm:p-9">
          <div className="mb-7 lg:hidden">
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#E8650A]">
              Khu vực truy cập
            </p>
            <h2 className="mt-2 text-[26px] font-bold tracking-[-.045em] text-[#17213a]">
              Chào mừng trở lại.
            </h2>
            <p className="mt-1.5 text-[13px] leading-5 text-slate-500">
              Đăng nhập để tiếp tục quản lý dữ liệu truy xuất.
            </p>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="identifier"
                  className="mb-2 block text-[12px] font-semibold text-[#34405a]"
                >
                  Tên đăng nhập hoặc email
                </label>
                <div
                  className={`group relative flex items-center rounded-xl border bg-[#f9faff] transition-colors focus-within:border-[#2740BA] focus-within:ring-4 focus-within:ring-[#2740BA]/10 ${error && !identifier ? "border-[#d85b5b]" : "border-[#dfe4ee]"}`}
                >
                  <Mail
                    className="pointer-events-none ml-3.5 h-[17px] w-[17px] text-slate-400 transition-colors group-focus-within:text-[#2740BA]"
                    strokeWidth={1.7}
                  />
                  <input
                    id="identifier"
                    data-testid="input-identifier"
                    type="text"
                    value={identifier}
                    onChange={(event) => {
                      setIdentifier(event.target.value);
                      if (error) setError("");
                    }}
                    autoComplete="username"
                    placeholder="Ví dụ: nguyenvana hoặc email@donai.gov.vn"
                    className="h-[50px] w-full bg-transparent px-3 text-[13px] text-[#1e2b45] outline-none placeholder:text-slate-400"
                    aria-describedby={error ? "login-error" : undefined}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-[12px] font-semibold text-[#34405a]"
                >
                  Mật khẩu
                </label>
                <div
                  className={`group relative flex items-center rounded-xl border bg-[#f9faff] transition-colors focus-within:border-[#2740BA] focus-within:ring-4 focus-within:ring-[#2740BA]/10 ${error && !password ? "border-[#d85b5b]" : "border-[#dfe4ee]"}`}
                >
                  <LockKeyhole
                    className="pointer-events-none ml-3.5 h-[17px] w-[17px] text-slate-400 transition-colors group-focus-within:text-[#2740BA]"
                    strokeWidth={1.7}
                  />
                  <input
                    id="password"
                    data-testid="input-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      if (error) setError("");
                    }}
                    autoComplete="current-password"
                    placeholder="Nhập mật khẩu"
                    className="h-[50px] w-full bg-transparent px-3 text-[13px] text-[#1e2b45] outline-none placeholder:text-slate-400"
                    aria-describedby={error ? "login-error" : undefined}
                  />
                  <button
                    type="button"
                    data-testid="button-toggle-password"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="mr-2 rounded-lg p-2 text-slate-400 transition-colors hover:bg-[#e9edff] hover:text-[#2740BA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2740BA]"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <EyeOff className="h-[17px] w-[17px]" strokeWidth={1.7} />
                    ) : (
                      <Eye className="h-[17px] w-[17px]" strokeWidth={1.7} />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-[12px] text-slate-600">
                <input
                  type="checkbox"
                  data-testid="checkbox-remember-login"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="peer sr-only"
                />
                <span
                  className={`flex h-[17px] w-[17px] items-center justify-center rounded-[4px] border transition-colors ${remember ? "border-[#2740BA] bg-[#2740BA]" : "border-[#c8cfdd] bg-white"}`}
                >
                  {remember && (
                    <CircleCheck
                      className="h-3.5 w-3.5 text-white"
                      strokeWidth={2.5}
                    />
                  )}
                </span>
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <button
                type="button"
                data-testid="button-forgot-password"
                onClick={handleForgotPassword}
                className="rounded-md text-[12px] font-semibold text-[#2740BA] underline-offset-4 transition-colors hover:text-[#E8650A] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2740BA]"
              >
                Quên mật khẩu?
              </button>
            </div>
            <div className="mt-6 min-h-[45px]" aria-live="polite">
              {error && (
                <div
                  id="login-error"
                  data-testid="status-login-error"
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-[#f2caca] bg-[#fff6f6] px-3.5 py-3 text-[12px] leading-5 text-[#b53d3d]"
                >
                  <AlertCircle
                    className="mt-0.5 h-4 w-4 shrink-0"
                    strokeWidth={1.8}
                  />
                  <span>{error}</span>
                </div>
              )}
              {forgotSent && !error && (
                <div
                  data-testid="status-forgot-confirmation"
                  role="status"
                  className="flex items-start gap-2.5 rounded-xl border border-[#c9ddf4] bg-[#f3f8ff] px-3.5 py-3 text-[12px] leading-5 text-[#2740BA]"
                >
                  <HelpCircle
                    className="mt-0.5 h-4 w-4 shrink-0"
                    strokeWidth={1.8}
                  />
                  <span>
                    Vui lòng liên hệ quản trị viên đơn vị để cấp lại mật khẩu.
                  </span>
                </div>
              )}
              {status === "success" && (
                <div
                  data-testid="status-login-success"
                  role="status"
                  className="flex items-start gap-2.5 rounded-xl border border-[#c7e6d5] bg-[#f2fbf6] px-3.5 py-3 text-[12px] leading-5 text-[#207a47]"
                >
                  <CircleCheck
                    className="mt-0.5 h-4 w-4 shrink-0"
                    strokeWidth={1.8}
                  />
                  <span>
                    Thông tin hợp lệ. Đang mở không gian làm việc của bạn.
                  </span>
                </div>
              )}
            </div>
            <button
              type="submit"
              data-testid="button-submit-login"
              disabled={status === "loading"}
              className="group mt-1 flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#E8650A] text-[13px] font-bold text-white shadow-[0_9px_20px_rgba(232,101,10,.2)] transition-[transform,background-color,box-shadow] hover:bg-[#d95c08] hover:shadow-[0_12px_24px_rgba(232,101,10,.28)] active:translate-y-px disabled:cursor-wait disabled:opacity-80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E8650A]/25"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang xác thực...
                </>
              ) : status === "success" ? (
                <>
                  Đã xác thực <CircleCheck className="h-4 w-4" />
                </>
              ) : (
                <>
                  Đăng nhập{" "}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
          <div className="mt-7 flex items-center justify-center gap-2 text-center text-[11px] text-slate-400">
            <ShieldCheck
              className="h-3.5 w-3.5 text-[#2740BA]"
              strokeWidth={1.8}
            />
            <span>
              Dữ liệu của bạn được bảo vệ theo quy định an toàn thông tin.
            </span>
          </div>
        </div>
        <div className="mt-7 flex items-center justify-between gap-4 px-1 text-[10px] text-slate-400">
          <span>© 2024 Đồng Nai Trace</span>
          <span className="font-mono tracking-[.12em]">PHIÊN BẢN 1.0.0</span>
        </div>
      </div>
    </section>
  );
}

function Home() {
  return (
    <main className="flex min-h-[100dvh] flex-col lg:flex-row">
      <PortalOverview />
      <LoginForm />
    </main>
  );
}

type DashboardIcon = typeof LayoutDashboard;

const navigationItems: {
  label: string;
  icon: DashboardIcon;
  badge?: string;
}[] = [
  { label: "Tổng quan", icon: LayoutDashboard },
  { label: "Doanh nghiệp", icon: Building2 },
  { label: "Sản phẩm", icon: Package },

  { label: "Báo cáo & phân tích", icon: BarChart3 },
  { label: "Tài khoản", icon: UsersRound },
];

const trendData = [
  { month: "T1", truyXuat: 4200, dangKy: 1200 },
  { month: "T2", truyXuat: 5100, dangKy: 1450 },
  { month: "T3", truyXuat: 4780, dangKy: 1710 },
  { month: "T4", truyXuat: 6320, dangKy: 1920 },
  { month: "T5", truyXuat: 7140, dangKy: 2280 },
  { month: "T6", truyXuat: 6820, dangKy: 2510 },
  { month: "T7", truyXuat: 8230, dangKy: 2900 },
  { month: "T8", truyXuat: 9170, dangKy: 3270 },
  { month: "T9", truyXuat: 10480, dangKy: 3510 },
  { month: "T10", truyXuat: 11240, dangKy: 3880 },
  { month: "T11", truyXuat: 12890, dangKy: 4290 },
  { month: "T12", truyXuat: 14520, dangKy: 4760 },
];

const statusData = [
  { name: "Đã duyệt", value: 62, color: "#2740BA" },
  { name: "Chờ duyệt", value: 18, color: "#E8650A" },
  { name: "Từ chối", value: 12, color: "#A8B2C8" },
  { name: "Đã khóa", value: 8, color: "#D9DEE9" },
];

const activityItems = [
  {
    id: "dn-2048",
    icon: CheckCircle2,
    color: "#2740BA",
    title: "Đã duyệt hồ sơ doanh nghiệp",
    subject: "Công ty TNHH Nông sản An Phú",
    meta: "Nguyễn Minh Anh · 09:42",
  },
  {
    id: "qr-2047",
    icon: QrCode,
    color: "#E8650A",
  
    subject: "Sản phẩm OCOP - Bưởi Tân Triều",
    meta: "Trần Hoàng Nam · 09:18",
  },
  {
    id: "new-2046",
    icon: UserPlus,
    color: "#5B6AC9",
    title: "Doanh nghiệp đăng ký mới",
    subject: "HTX Nông nghiệp Xuân Lộc",
    meta: "Hệ thống · 08:56",
  },
  {
    id: "scan-2045",
    icon: ScanLine,
    color: "#4F9A77",
    title: "Lượt truy xuất đạt mốc mới",
    subject: "Khu vực Long Khánh · 2.480 lượt",
    meta: "Tự động · Hôm qua",
  },
];

function TraceSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState("Tổng quan");

  return (
    <>
      {open && (
        <button
          type="button"
          data-testid="button-close-sidebar-overlay"
          aria-label="Đóng menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-[#16234f]/25 backdrop-blur-[2px] lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col border-r border-[#e4e7ef] bg-white px-4 py-5 shadow-[8px_0_28px_rgba(34,50,98,.05)] transition-transform duration-300 lg:sticky lg:top-0 lg:z-20 lg:h-[100dvh] lg:translate-x-0 lg:shadow-none ${open ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Điều hướng chính"
      >
        <div className="flex items-center justify-between px-3">
          <TraceMark compact />
          <button
            type="button"
            data-testid="button-close-sidebar"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-[#f1f3fa] hover:text-[#2740BA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2740BA] lg:hidden"
            aria-label="Đóng menu điều hướng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mx-3 mt-8 rounded-xl border border-[#e4e8f4] bg-[#f7f8fd] px-3.5 py-3">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#2740BA]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4f9a77]" /> Cổng quản
            trị
          </div>
         
        </div>
        <nav
          className="dashboard-scrollbar mt-7 flex-1 space-y-1 overflow-y-auto"
          aria-label="Các mục quản trị"
        >

          {navigationItems.map(({ label, icon: Icon, badge }) => {
            const active = selected === label;
            return (
              <button
                type="button"
                data-testid={`button-nav-${label}`}
                key={label}
                onClick={() => setSelected(label)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[12px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2740BA] ${active ? "bg-[#edf0ff] text-[#2740BA]" : "text-slate-500 hover:bg-[#f7f8fc] hover:text-[#2740BA]"}`}
                aria-current={
                  active && label === "Tổng quan" ? "page" : undefined
                }
              >
                <Icon
                  className={`h-[18px] w-[18px] shrink-0 ${active ? "text-[#2740BA]" : "text-slate-400 group-hover:text-[#2740BA]"}`}
                  strokeWidth={active ? 2 : 1.7}
                />
                <span className="flex-1">{label}</span>
                {badge && (
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] ${active ? "bg-[#2740BA] text-white" : "bg-[#fff1e9] text-[#E8650A]"}`}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
          <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[.17em] text-slate-400">
            Hệ thống
          </p>
          <button
            type="button"
            data-testid="button-nav-settings"
            onClick={() => setSelected("Cài đặt")}
            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[12px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2740BA] ${selected === "Cài đặt" ? "bg-[#edf0ff] text-[#2740BA]" : "text-slate-500 hover:bg-[#f7f8fc] hover:text-[#2740BA]"}`}
          >
            <Settings
              className="h-[18px] w-[18px] text-slate-400 group-hover:text-[#2740BA]"
              strokeWidth={1.7}
            />
            <span>Cài đặt</span>
          </button>
        </nav>
        <div className="mt-5 rounded-2xl bg-[#152978] p-4 text-white">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[.16em] text-blue-100/65">
              Trạng thái hệ thống
            </span>
            <span className="h-2 w-2 rounded-full bg-[#7bd19f]" />
          </div>
          <p className="mt-2 text-[12px] font-semibold">Hoạt động ổn định</p>
          <div className="mt-3 h-1 rounded-full bg-white/15">
            <div className="h-full w-[94%] rounded-full bg-[#ffad5e]" />
          </div>
          <p className="mt-2 text-[10px] text-blue-100/65">
            Cập nhật lần cuối 2 phút trước
          </p>
        </div>
        <div className="mt-4 flex items-center gap-3 border-t border-[#edf0f5] px-2 pt-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dce3ff] text-[11px] font-bold text-[#2740BA]">
            NMA
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-bold text-[#25304b]">
              Nguyễn Minh Anh
            </p>
            <p className="mt-0.5 truncate text-[10px] text-slate-400">
              Quản trị viên
            </p>
          </div>
          <button
            type="button"
            data-testid="button-sidebar-logout"
            aria-label="Đăng xuất"
            onClick={() => {
              window.location.href = "/";
            }}
            className="rounded-lg p-2 text-slate-400 hover:bg-[#fff2ed] hover:text-[#E8650A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2740BA]"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>
    </>
  );
}

function DashboardHeader({ onMenu }: { onMenu: () => void }) {
  const [search, setSearch] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  return (
    <header className="relative flex h-[78px] shrink-0 items-center justify-between gap-4 border-b border-[#e5e8f0] bg-white px-5 sm:px-8 lg:px-10">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          data-testid="button-open-sidebar"
          onClick={onMenu}
          className="rounded-lg p-2 text-slate-500 hover:bg-[#f0f2f9] hover:text-[#2740BA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2740BA] lg:hidden"
          aria-label="Mở menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden min-w-0 sm:block">
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#E8650A]">
            Không gian quản trị
          </p>
          <h1 className="mt-1 truncate text-[18px] font-bold tracking-[-.04em] text-[#1d2944]">
            Tổng quan hệ thống
          </h1>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2.5 sm:gap-4">
        <label className="group hidden h-10 w-[260px] items-center gap-2.5 rounded-xl border border-[#e3e7f0] bg-[#fafbfe] px-3.5 focus-within:border-[#2740BA] focus-within:ring-4 focus-within:ring-[#2740BA]/10 md:flex">
          <Search
            className="h-4 w-4 shrink-0 text-slate-400 group-focus-within:text-[#2740BA]"
            strokeWidth={1.8}
          />
          <input
            data-testid="input-dashboard-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm kiếm hồ sơ, doanh nghiệp..."
            className="w-full bg-transparent text-[11px] text-[#25304b] outline-none placeholder:text-slate-400"
            aria-label="Tìm kiếm hồ sơ và doanh nghiệp"
          />
          {search && (
            <button
              type="button"
              data-testid="button-clear-search"
              aria-label="Xóa tìm kiếm"
              onClick={() => setSearch("")}
              className="text-[11px] text-slate-400 hover:text-[#2740BA]"
            >
              ×
            </button>
          )}
        </label>
        <div className="relative">
          <button
            type="button"
            data-testid="button-notifications"
            aria-label="Thông báo"
            aria-expanded={notificationsOpen}
            onClick={() => {
              setNotificationsOpen((value) => !value);
              setAccountOpen(false);
            }}
            className="relative rounded-xl border border-transparent p-2.5 text-slate-500 hover:border-[#e4e8f2] hover:bg-[#f7f8fc] hover:text-[#2740BA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2740BA]"
          >
            <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#E8650A] ring-2 ring-white" />
          </button>
          {notificationsOpen && (
            <div
              data-testid="panel-notifications"
              className="absolute right-0 top-12 z-50 w-[290px] rounded-2xl border border-[#e1e6f0] bg-white p-4 shadow-[0_16px_40px_rgba(32,48,99,.15)]"
            >
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-bold text-[#25304b]">
                  Thông báo
                </p>
                <span className="rounded-full bg-[#fff0e8] px-2 py-1 text-[9px] font-bold text-[#E8650A]">
                  3 mới
                </span>
              </div>
              <div className="mt-3 space-y-3">
                <div className="flex gap-2.5">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#E8650A]" />
                  <p className="text-[11px] leading-4 text-slate-600">
                    18 hồ sơ đang chờ bạn kiểm tra.
                    <span className="mt-0.5 block text-[10px] text-slate-400">
                      12 phút trước
                    </span>
                  </p>
                </div>
                <div className="flex gap-2.5">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#2740BA]" />
                  <p className="text-[11px] leading-4 text-slate-600">
                    Báo cáo truy xuất tháng 12 đã sẵn sàng.
                    <span className="mt-0.5 block text-[10px] text-slate-400">
                      1 giờ trước
                    </span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                data-testid="button-view-all-notifications"
                onClick={() => setNotificationsOpen(false)}
                className="mt-3 w-full border-t border-[#edf0f5] pt-3 text-left text-[10px] font-bold text-[#2740BA] hover:text-[#E8650A]"
              >
                Đánh dấu đã đọc
              </button>
            </div>
          )}
        </div>
        <div className="relative border-l border-[#e7eaf1] pl-3 sm:pl-4">
          <button
            type="button"
            data-testid="button-account-menu"
            aria-label="Mở menu tài khoản"
            aria-expanded={accountOpen}
            onClick={() => {
              setAccountOpen((value) => !value);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2 rounded-xl p-1.5 pr-1 text-left hover:bg-[#f7f8fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2740BA]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dce3ff] text-[10px] font-bold text-[#2740BA]">
              NMA
            </span>
            <span className="hidden text-[11px] font-bold text-[#25304b] xl:block">
              Nguyễn Minh Anh
            </span>
            <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 xl:block" />
          </button>
          {accountOpen && (
            <div
              data-testid="panel-account-menu"
              className="absolute right-0 top-12 z-50 w-[190px] rounded-2xl border border-[#e1e6f0] bg-white p-2 shadow-[0_16px_40px_rgba(32,48,99,.15)]"
            >
              <button
                type="button"
                data-testid="button-account-profile"
                onClick={() => setAccountOpen(false)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[11px] text-slate-600 hover:bg-[#f4f6fb]"
              >
                <UsersRound className="h-4 w-4 text-slate-400" /> Hồ sơ cá nhân
              </button>
              <button
                type="button"
                data-testid="button-account-settings"
                onClick={() => setAccountOpen(false)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[11px] text-slate-600 hover:bg-[#f4f6fb]"
              >
                <Settings className="h-4 w-4 text-slate-400" /> Cài đặt tài
                khoản
              </button>
              <button
                type="button"
                data-testid="button-account-logout"
                onClick={() => {
                  window.location.href = "/";
                }}
                className="mt-1 flex w-full items-center gap-2 border-t border-[#edf0f5] px-3 py-2.5 pt-3 text-left text-[11px] text-[#E8650A] hover:text-[#c95000]"
              >
                <LogOut className="h-4 w-4" /> Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function KpiCard({
  label,
  value,
  change,
  positive,
  icon: Icon,
  note,
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: DashboardIcon;
  note: string;
}) {
  return (
    <article
      data-testid={`card-kpi-${label}`}
      className="group rounded-2xl border border-[#e6e9f0] bg-white p-5 shadow-[0_5px_18px_rgba(38,55,105,.035)] transition-transform hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef1ff] text-[#2740BA]">
          <Icon className="h-[19px] w-[19px]" strokeWidth={1.8} />
        </div>
        <span
          className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${positive ? "bg-[#edf9f2] text-[#36845a]" : "bg-[#fff0ec] text-[#d35b3d]"}`}
        >
          {positive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {change}
        </span>
      </div>
      <p className="mt-5 text-[11px] font-semibold text-slate-500">{label}</p>
      <p
        data-testid={`value-kpi-${label}`}
        className="mt-1 text-[27px] font-bold tracking-[-.055em] text-[#1d2944]"
      >
        {value}
      </p>
      <p className="mt-1 text-[10px] text-slate-400">{note}</p>
    </article>
  );
}

function TrendsChart() {
  return (
    <article className="rounded-2xl border border-[#e6e9f0] bg-white p-5 shadow-[0_5px_18px_rgba(38,55,105,.035)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[14px] font-bold text-[#25304b]">
            Xu hướng hoạt động
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Lượt truy xuất và hồ sơ đăng ký trong năm 2024
          </p>
        </div>
        <button
          type="button"
          data-testid="button-trend-filter"
          className="flex items-center gap-2 rounded-lg border border-[#e4e8f0] px-2.5 py-2 text-[10px] font-semibold text-slate-500 hover:border-[#2740BA] hover:text-[#2740BA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2740BA]"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" /> 12 tháng{" "}
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>
      <div className="mt-5 h-[250px] w-full" data-testid="chart-trends">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={trendData}
            margin={{ top: 10, right: 8, left: -18, bottom: 0 }}
          >
            <CartesianGrid
              className="dashboard-chart-grid"
              vertical={false}
              strokeDasharray="3 4"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8992a7", fontSize: 10 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8992a7", fontSize: 10 }}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e6f0",
                boxShadow: "0 14px 32px rgba(28,44,94,.12)",
                fontSize: 11,
              }}
              labelStyle={{ color: "#25304b", fontWeight: 700 }}
              formatter={(value: number, name: string) => [
                value.toLocaleString("vi-VN"),
                name === "truyXuat" ? "Lượt truy xuất" : "Hồ sơ đăng ký",
              ]}
            />
            <Legend
              align="right"
              verticalAlign="top"
              height={32}
              iconType="circle"
              iconSize={7}
              formatter={(value) => (
                <span className="ml-1 text-[10px] text-slate-500">
                  {value === "truyXuat" ? "Lượt truy xuất" : "Hồ sơ đăng ký"}
                </span>
              )}
            />
            <Line
              type="monotone"
              dataKey="truyXuat"
              stroke="#2740BA"
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 4,
                fill: "#2740BA",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
            <Line
              type="monotone"
              dataKey="dangKy"
              stroke="#E8650A"
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 4,
                fill: "#E8650A",
                stroke: "#fff",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

function StatusChart() {
  return (
    <article className="rounded-2xl border border-[#e6e9f0] bg-white p-5 shadow-[0_5px_18px_rgba(38,55,105,.035)] sm:p-6">
      <div>
        <p className="text-[14px] font-bold text-[#25304b]">
          Trạng thái doanh nghiệp
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          Phân bổ hồ sơ trên hệ thống
        </p>
      </div>
      <div
        className="relative mt-3 h-[190px]"
        data-testid="chart-company-status"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={78}
              paddingAngle={3}
              stroke="none"
            >
              {statusData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e6f0",
                fontSize: 11,
              }}
              formatter={(value: number) => [`${value}%`, "Tỷ lệ"]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[25px] font-bold tracking-[-.05em] text-[#1d2944]">
            1.248
          </span>
          <span className="text-[10px] text-slate-400">doanh nghiệp</span>
        </div>
      </div>
      <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-3">
        {statusData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="flex-1 text-[10px] text-slate-500">
              {item.name}
            </span>
            <span className="text-[10px] font-bold text-[#25304b]">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

function ActivityPanel() {
  const [showAll, setShowAll] = useState(false);
  const rows = showAll
    ? [
        ...activityItems,
        {
          id: "verify-2044",
          icon: FileCheck2,
          color: "#7b87bc",
          title: "Cập nhật hồ sơ sản phẩm",
          subject: "Mật ong rừng U Minh",
          meta: "Lê Thu Hà · Hôm qua",
        },
      ]
    : activityItems.slice(0, 4);
  return (
    <article className="rounded-2xl border border-[#e6e9f0] bg-white p-5 shadow-[0_5px_18px_rgba(38,55,105,.035)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[14px] font-bold text-[#25304b]">
            Hoạt động gần đây
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Các cập nhật mới nhất trên cổng quản trị
          </p>
        </div>
        <button
          type="button"
          data-testid="button-activity-more"
          onClick={() => setShowAll((value) => !value)}
          className="rounded-lg p-2 text-slate-400 hover:bg-[#f2f4fa] hover:text-[#2740BA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2740BA]"
          aria-label={showAll ? "Thu gọn hoạt động" : "Xem thêm hoạt động"}
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-5 divide-y divide-[#edf0f5]">
        {rows.map(({ id, icon: Icon, color, title, subject, meta }) => (
          <div
            key={id}
            data-testid={`activity-${id}`}
            className="flex gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div
              className="relative mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${color}13`, color }}
            >
              <Icon className="h-4 w-4" strokeWidth={1.8} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-bold text-[#33405d]">
                {title}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-slate-500">
                {subject}
              </p>
              <div className="mt-1 flex items-center gap-1 text-[9px] text-slate-400">
                <Clock3 className="h-3 w-3" />
                {meta}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        data-testid="button-view-all-activity"
        onClick={() => setShowAll((value) => !value)}
        className="mt-5 w-full rounded-xl border border-[#e4e8f0] py-2.5 text-[10px] font-bold text-[#2740BA] transition-colors hover:border-[#2740BA] hover:bg-[#f3f5ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2740BA]"
      >
        {showAll ? "Thu gọn danh sách" : "Xem tất cả hoạt động"}
      </button>
    </article>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <DashboardShell title={title}>
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[#c4d0f5] bg-[#f7f8fd] text-slate-400">
        <p className="text-[14px] font-semibold">{title}</p>
        <p className="mt-1 text-[12px]">Đang phát triển</p>
      </div>
    </DashboardShell>
  );
}

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const kpis = [
    {
      label: "Tổng doanh nghiệp",
      value: "1.248",
      change: "+12,8%",
      positive: true,
      icon: Building2,
      note: "so với tháng trước",
    },
    {
      label: "Tổng sản phẩm",
      value: "8.642",
      change: "+8,4%",
      positive: true,
      icon: Package,
      note: "so với tháng trước",
    },
    {
      label: "Hồ sơ chờ duyệt",
      value: "18",
      change: "-5,2%",
      positive: true,
      icon: FileCheck2,
      note: "cần xử lý trong hôm nay",
    },
    
    {
      label: "Lượt truy xuất hôm nay",
      value: "2.486",
      change: "+18,3%",
      positive: true,
      icon: Activity,
      note: "cập nhật theo thời gian thực",
    },
    {
      label: "Tài khoản đang hoạt động",
      value: "324",
      change: "-2,1%",
      positive: false,
      icon: UsersRound,
      note: "trên tổng số 356 tài khoản",
    },
  ];
  return (
    <div className="dashboard-shell flex min-h-[100dvh] text-[#25304b]">
      <TraceSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader onMenu={() => setSidebarOpen(true)} />
        <main className="dashboard-scrollbar flex-1 overflow-y-auto px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#E8650A]">
                  Thứ Năm, 19 tháng 12, 2024
                </p>
                <h2 className="mt-2 text-[25px] font-bold tracking-[-.055em] text-[#1d2944] sm:text-[29px]">
                  Chào buổi sáng, Minh Anh.
                </h2>
                <p className="mt-2 text-[12px] text-slate-500">
                  Đây là tình hình vận hành của Đồng Nai Trace hôm nay.
                </p>
              </div>
              <div className="hidden items-center gap-2 rounded-xl border border-[#e5e8f0] bg-white px-3 py-2.5 text-[10px] text-slate-500 shadow-[0_4px_14px_rgba(38,55,105,.03)] sm:flex">
                <span className="h-2 w-2 rounded-full bg-[#4f9a77]" /> Dữ liệu
                cập nhật trực tiếp{" "}
                <span className="ml-1 text-slate-300">·</span> 09:45
              </div>
            </div>
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {kpis.map((kpi) => (
                <KpiCard key={kpi.label} {...kpi} />
              ))}
            </section>
            <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,.85fr)]">
              <TrendsChart />
              <StatusChart />
            </section>
            <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,.85fr)]">
              <ActivityPanel />
              <article className="flex flex-col justify-between rounded-2xl bg-[#152978] p-6 text-white shadow-[0_8px_24px_rgba(21,41,120,.13)]">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-white/10 p-2.5">
                      <ScanLine
                        className="h-5 w-5 text-[#ffad5e]"
                        strokeWidth={1.7}
                      />
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-[.17em] text-blue-100/55">
                      Bản tin hệ thống
                    </span>
                  </div>
                  <h3 className="mt-7 max-w-[230px] text-[21px] font-bold leading-[1.18] tracking-[-.045em]">
                    Minh bạch hơn,
                    <br />
                    <span className="text-[#ffad5e]">tin cậy hơn.</span>
                  </h3>
                  <p className="mt-3 max-w-[260px] text-[11px] leading-5 text-blue-100/65">
                    Theo dõi mọi bước đi của sản phẩm Đồng Nai trên một nền tảng
                    duy nhất.
                  </p>
                </div>
                <div className="mt-7 flex items-center justify-between border-t border-white/15 pt-4">
                  <span className="font-mono text-[9px] tracking-[.13em] text-blue-100/50">
                    DN.TRACE / 2024
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-[#ffad5e]">
                    Tin cậy từ nguồn gốc <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </article>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard/bao-cao" component={Analytics} />
      <Route path="/dashboard/doanh-nghiep" component={Businesses} />
      <Route path="/dashboard/san-pham" component={Products} />
      <Route path="/dashboard/danh-muc" component={Categories} />
      <Route path="/dashboard/tin-tuc" component={CMS} />
      <Route path="/dashboard/ho-tro" component={Support} />
      <Route path="/dashboard/he-thong" component={System} />
      <Route path="/dashboard/tai-khoan">
        {() => <PlaceholderPage title="Quản lý tài khoản" />}
      </Route>
      <Route path="/dashboard/cai-dat">
        {() => <PlaceholderPage title="Cài đặt" />}
      </Route>
      <Route path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
