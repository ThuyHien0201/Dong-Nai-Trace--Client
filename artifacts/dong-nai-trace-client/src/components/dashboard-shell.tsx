import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Building2,
  Package,
  BarChart3,
  UsersRound,
  Settings,
  X,
  LogOut,
  Search,
  Bell,
  Menu,
  ChevronDown,
  Tags,
  Newspaper,
  LifeBuoy,
  Server,
} from "lucide-react";
import skhcnLogo from "@assets/Logo-SKHCN-2026_1785046021867.png";

function TraceMark({ compact }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#2740BA]">
        <img src={skhcnLogo} alt="SKHCN Logo" className="h-7 w-7 object-contain" />
      </div>
      {!compact && (
        <div>
          <p className="text-[13px] font-bold tracking-[-0.03em] text-[#1d2944]">
            Đồng Nai <span className="text-[#2740BA]">Trace</span>
          </p>
          <p className="text-[9px] uppercase tracking-[.15em] text-slate-400">
            Trace with confidence
          </p>
        </div>
      )}
      {compact && (
        <div>
          <p className="text-[13px] font-bold tracking-[-0.03em] text-[#1d2944]">
            Đồng Nai <span className="text-[#2740BA]">Trace</span>
          </p>
          <p className="text-[9px] uppercase tracking-[.15em] text-slate-400">
            Trace with confidence
          </p>
        </div>
      )}
    </div>
  );
}

const workspaceNav = [
  { label: "Tổng quan", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Doanh nghiệp", icon: Building2, href: "/dashboard/doanh-nghiep" },
  { label: "Sản phẩm", icon: Package, href: "/dashboard/san-pham" },
  { label: "Báo cáo & phân tích", icon: BarChart3, href: "/dashboard/bao-cao" },
  { label: "Tài khoản", icon: UsersRound, href: "/dashboard/tai-khoan" },
];

const systemNav = [
  { label: "Danh mục & địa bàn", icon: Tags, href: "/dashboard/danh-muc" },
  { label: "Tin tức & banner", icon: Newspaper, href: "/dashboard/tin-tuc" },
  { label: "Hỗ trợ & thông báo", icon: LifeBuoy, href: "/dashboard/ho-tro" },
  { label: "Hệ thống", icon: Server, href: "/dashboard/he-thong" },
  { label: "Cài đặt", icon: Settings, href: "/dashboard/cai-dat" },
];

function TraceSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [location] = useLocation();

  const isActive = (href: string) => {
    if (href === "/dashboard") return location === "/dashboard";
    return location.startsWith(href);
  };

  const NavItem = ({
    label,
    icon: Icon,
    href,
    badge,
  }: {
    label: string;
    icon: typeof LayoutDashboard;
    href: string;
    badge?: string;
  }) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        onClick={onClose}
        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[12px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2740BA] ${
          active
            ? "bg-[#edf0ff] text-[#2740BA]"
            : "text-slate-500 hover:bg-[#f7f8fc] hover:text-[#2740BA]"
        }`}
        aria-current={active ? "page" : undefined}
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
      </Link>
    );
  };

  return (
    <>
      {open && (
        <button
          type="button"
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
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-[#f1f3fa] hover:text-[#2740BA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2740BA] lg:hidden"
            aria-label="Đóng menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="dashboard-scrollbar mt-7 flex-1 space-y-1 overflow-y-auto" aria-label="Các mục quản trị">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.17em] text-slate-400">
            Không gian làm việc
          </p>
          {workspaceNav.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}

          <p className="mb-3 mt-8 px-3 text-[10px] font-bold uppercase tracking-[.17em] text-slate-400">
            Hệ thống
          </p>
          {systemNav.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </nav>

        <div className="mt-4 flex items-center gap-3 border-t border-[#edf0f5] px-2 pt-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dce3ff] text-[11px] font-bold text-[#2740BA]">
            NMA
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-bold text-[#25304b]">Nguyễn Minh Anh</p>
            <p className="mt-0.5 truncate text-[10px] text-slate-400">Quản trị viên</p>
          </div>
          <button
            type="button"
            aria-label="Đăng xuất"
            onClick={() => { window.location.href = "/"; }}
            className="rounded-lg p-2 text-slate-400 hover:bg-[#fff2ed] hover:text-[#E8650A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2740BA]"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>
    </>
  );
}

function DashboardHeader({
  onMenu,
  title,
  subtitle,
}: {
  onMenu: () => void;
  title?: string;
  subtitle?: string;
}) {
  const [search, setSearch] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="relative flex h-[78px] shrink-0 items-center justify-between gap-4 border-b border-[#e5e8f0] bg-white px-5 sm:px-8 lg:px-10">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenu}
          className="rounded-lg p-2 text-slate-400 hover:bg-[#f1f3fa] hover:text-[#2740BA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2740BA] lg:hidden"
          aria-label="Mở menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        {title && (
          <div className="hidden sm:block">
            <p className="text-[15px] font-bold text-[#1d2944]">{title}</p>
            {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm nhanh..."
            className="h-9 w-52 rounded-xl border border-[#e5e8f0] bg-[#f9fafb] pl-9 pr-4 text-[12px] outline-none transition focus:border-[#2740BA] focus:bg-white focus:ring-2 focus:ring-[#2740BA]/15 xl:w-64"
          />
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-[#e5e8f0] bg-white text-slate-500 hover:border-[#2740BA] hover:text-[#2740BA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2740BA]"
            aria-label="Thông báo"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#E8650A]" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-11 z-50 w-72 rounded-2xl border border-[#e5e8f0] bg-white p-4 shadow-xl">
              <p className="text-[12px] font-bold text-[#1d2944]">Thông báo</p>
              {[
                { text: "Hồ sơ mới từ HTX Xuân Lộc", time: "2 phút trước", dot: "#E8650A" },
                { text: "Cấp thành công 12 mã QR", time: "15 phút trước", dot: "#2740BA" },
                { text: "Báo cáo tháng 12 đã sẵn sàng", time: "1 giờ trước", dot: "#4f9a77" },
              ].map((n, i) => (
                <div key={i} className="mt-3 flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: n.dot }} />
                  <div>
                    <p className="text-[11px] text-[#25304b]">{n.text}</p>
                    <p className="mt-0.5 text-[10px] text-slate-400">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-[#e5e8f0] bg-white px-2.5 py-1.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#dce3ff] text-[9px] font-bold text-[#2740BA]">
            NMA
          </div>
          <span className="hidden text-[11px] font-semibold text-[#25304b] sm:block">Minh Anh</span>
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </div>
      </div>
    </header>
  );
}

export function DashboardShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-shell flex min-h-[100dvh] text-[#25304b]">
      <TraceSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          onMenu={() => setSidebarOpen(true)}
          title={title}
          subtitle={subtitle}
        />
        <main className="dashboard-scrollbar flex-1 overflow-y-auto px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
          <div className="mx-auto max-w-[1440px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
