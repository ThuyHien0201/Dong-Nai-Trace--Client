import { useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  Globe,
  Link2,
  Plug,
  ScrollText,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Settings,
  Play,
  ChevronDown,
  ChevronRight,
  Shield,
  Database,
  Wifi,
  WifiOff,
  ArrowUpDown,
  Activity,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────
type ConnStatus = "active" | "error" | "warning" | "inactive";

interface Connection {
  id: string;
  name: string;
  org: string;
  endpoint: string;
  status: ConnStatus;
  lastSync: string;
  recordsOut: number;
  recordsIn: number;
  authType: string;
  protocol: string;
}

interface LogEntry {
  id: string;
  target: string;
  direction: "out" | "in";
  records: number;
  status: "success" | "error" | "partial";
  message: string;
  time: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────
const TABS = [
  { id: "national", label: "Cổng TXNG Quốc gia", icon: Globe },
  { id: "ministries", label: "Bộ ban ngành", icon: Link2 },
  { id: "solutions", label: "Giải pháp bên thứ ba", icon: Plug },
  { id: "logs", label: "Nhật ký kết nối", icon: ScrollText },
] as const;
type TabId = (typeof TABS)[number]["id"];

const statusConfig: Record<ConnStatus, { label: string; cls: string; dot: string; icon: typeof CheckCircle2 }> = {
  active:   { label: "Hoạt động",     cls: "bg-[#e8f5ed] text-[#1f7a45] border border-[#b8e2c8]", dot: "bg-[#4caf7d]", icon: CheckCircle2 },
  warning:  { label: "Cảnh báo",      cls: "bg-[#fff4ed] text-[#E8650A] border border-[#fcd9bb]", dot: "bg-[#E8650A]", icon: AlertCircle  },
  error:    { label: "Lỗi kết nối",   cls: "bg-[#fef0f0] text-[#c0392b] border border-[#f5bcbc]", dot: "bg-[#e05252]", icon: AlertCircle  },
  inactive: { label: "Chưa kết nối",  cls: "bg-[#f2f3f7] text-[#6b7694] border border-[#d9dce9]", dot: "bg-[#a8b2c8]", icon: Clock        },
};

// ─── Mock Data ───────────────────────────────────────────────────────────────
const ministryConnections: Connection[] = [
  {
    id: "MC-01", name: "Bộ Nông nghiệp & PTNT", org: "Cục Chất lượng, Chế biến và Phát triển thị trường",
    endpoint: "https://api.mard.gov.vn/txng/v1", status: "active",
    lastSync: "5 phút trước", recordsOut: 8420, recordsIn: 120,
    authType: "OAuth 2.0", protocol: "REST / JSON",
  },
  {
    id: "MC-02", name: "Bộ Y tế", org: "Cục An toàn thực phẩm (VFA)",
    endpoint: "https://api.vfa.gov.vn/trace/v2", status: "active",
    lastSync: "12 phút trước", recordsOut: 3210, recordsIn: 45,
    authType: "API Key", protocol: "REST / JSON",
  },
  {
    id: "MC-03", name: "Bộ Công Thương", org: "Cục Xuất nhập khẩu",
    endpoint: "https://api.moit.gov.vn/txng/v1", status: "warning",
    lastSync: "2 giờ trước", recordsOut: 1850, recordsIn: 0,
    authType: "OAuth 2.0", protocol: "REST / JSON",
  },
  {
    id: "MC-04", name: "Bộ Khoa học & Công nghệ", org: "Tổng cục Tiêu chuẩn Đo lường Chất lượng",
    endpoint: "https://api.most.gov.vn/standards/v1", status: "inactive",
    lastSync: "Chưa kết nối", recordsOut: 0, recordsIn: 0,
    authType: "Chưa cấu hình", protocol: "REST / JSON",
  },
  {
    id: "MC-05", name: "Sở Nông nghiệp & PTNT Đồng Nai", org: "Chi cục Trồng trọt và Bảo vệ thực vật",
    endpoint: "https://api.snnptnt.dongnai.gov.vn/v1", status: "active",
    lastSync: "1 phút trước", recordsOut: 520, recordsIn: 88,
    authType: "Bearer Token", protocol: "REST / JSON",
  },
];

const solutionConnections: Connection[] = [
  {
    id: "SC-01", name: "Checkee Platform", org: "Công ty CP Checkee Việt Nam",
    endpoint: "https://api.checkee.vn/dongnai/v2", status: "active",
    lastSync: "30 giây trước", recordsOut: 0, recordsIn: 14520,
    authType: "OAuth 2.0 + mTLS", protocol: "REST / JSON + Webhook",
  },
  {
    id: "SC-02", name: "iFarm Traceability", org: "Công ty TNHH iFarm Việt Nam",
    endpoint: "https://api.ifarm.vn/trace/v1", status: "active",
    lastSync: "8 phút trước", recordsOut: 0, recordsIn: 3280,
    authType: "API Key", protocol: "REST / JSON",
  },
  {
    id: "SC-03", name: "VinTrace Enterprise", org: "Tập đoàn VinGroup",
    endpoint: "https://api.vintrace.vn/enterprise/v1", status: "error",
    lastSync: "3 giờ trước", recordsOut: 0, recordsIn: 0,
    authType: "OAuth 2.0", protocol: "REST / JSON",
  },
  {
    id: "SC-04", name: "AgriChain Connect", org: "Công ty CP AgriChain",
    endpoint: "https://gateway.agrichain.vn/dongnai", status: "inactive",
    lastSync: "Chưa kết nối", recordsOut: 0, recordsIn: 0,
    authType: "Chưa cấu hình", protocol: "REST / JSON",
  },
];

const connectionLogs: LogEntry[] = [
  { id: "LOG-001", target: "Cổng TXNG Quốc gia",          direction: "out", records: 340,  status: "success", message: "Đẩy dữ liệu thành công — 340 bản ghi sản phẩm", time: "19/12/2024 10:15" },
  { id: "LOG-002", target: "Bộ Nông nghiệp & PTNT",       direction: "out", records: 120,  status: "success", message: "Đồng bộ danh mục ngành hàng hoàn tất",           time: "19/12/2024 09:48" },
  { id: "LOG-003", target: "Checkee Platform",             direction: "in",  records: 1240, status: "success", message: "Nhận dữ liệu lô hàng — pipeline UC-36 thành công", time: "19/12/2024 09:30" },
  { id: "LOG-004", target: "VinTrace Enterprise",          direction: "out", records: 0,    status: "error",   message: "Timeout kết nối — endpoint không phản hồi (503)", time: "19/12/2024 09:00" },
  { id: "LOG-005", target: "Bộ Công Thương",               direction: "out", records: 85,   status: "partial", message: "Đẩy một phần — 85/120 bản ghi, lỗi schema 35 bản", time: "19/12/2024 08:30" },
  { id: "LOG-006", target: "Cổng TXNG Quốc gia",          direction: "out", records: 520,  status: "success", message: "Đẩy lô sản phẩm đã duyệt — 520 bản ghi",          time: "18/12/2024 22:00" },
  { id: "LOG-007", target: "iFarm Traceability",           direction: "in",  records: 380,  status: "success", message: "Nhận nhật ký sản xuất — chuỗi cung ứng bưởi Tân Triều", time: "18/12/2024 18:45" },
  { id: "LOG-008", target: "Bộ Y tế (VFA)",               direction: "out", records: 210,  status: "success", message: "Đồng bộ chứng nhận ATTP — 210 sản phẩm",          time: "18/12/2024 16:00" },
];

// ─── Status Badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ConnStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${cfg.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Connection Card ─────────────────────────────────────────────────────────
function ConnectionCard({ conn, showIn = false }: { conn: Connection; showIn?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(conn.endpoint).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-2xl border border-[#e4e8f0] bg-white shadow-[0_2px_12px_rgba(38,55,105,.04)]">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${conn.status === "active" ? "bg-[#e8f5ed]" : conn.status === "error" ? "bg-[#fef0f0]" : conn.status === "warning" ? "bg-[#fff4ed]" : "bg-[#f2f3f7]"}`}>
              {conn.status === "active" ? <Wifi className={`h-5 w-5 text-[#1f7a45]`} strokeWidth={1.8} /> : <WifiOff className="h-5 w-5 text-slate-400" strokeWidth={1.8} />}
            </div>
            <div>
              <p className="font-semibold text-[#1d2944]">{conn.name}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">{conn.org}</p>
            </div>
          </div>
          <StatusBadge status={conn.status} />
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#e4e8f0] bg-[#f9fafb] px-3 py-2">
          <code className="flex-1 truncate font-mono text-[10px] text-slate-500">{conn.endpoint}</code>
          <button onClick={handleCopy} className="shrink-0 text-slate-400 hover:text-[#2740BA]">
            {copied ? <Check className="h-3.5 w-3.5 text-[#1f7a45]" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <a href="#" className="shrink-0 text-slate-400 hover:text-[#2740BA]">
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-[11px] sm:grid-cols-4">
          <div className="rounded-xl border border-[#e4e8f0] bg-[#f9fafb] p-2.5 text-center">
            <p className="text-slate-400">Đồng bộ cuối</p>
            <p className="mt-1 font-semibold text-[#25304b]">{conn.lastSync}</p>
          </div>
          <div className="rounded-xl border border-[#e4e8f0] bg-[#f9fafb] p-2.5 text-center">
            <p className="text-slate-400">Bản ghi đẩy ra</p>
            <p className="mt-1 font-semibold text-[#2740BA]">{conn.recordsOut.toLocaleString()}</p>
          </div>
          {showIn && (
            <div className="rounded-xl border border-[#e4e8f0] bg-[#f9fafb] p-2.5 text-center">
              <p className="text-slate-400">Bản ghi nhận về</p>
              <p className="mt-1 font-semibold text-[#4f9a77]">{conn.recordsIn.toLocaleString()}</p>
            </div>
          )}
          <div className="rounded-xl border border-[#e4e8f0] bg-[#f9fafb] p-2.5 text-center">
            <p className="text-slate-400">Xác thực</p>
            <p className="mt-1 truncate font-semibold text-[#25304b]">{conn.authType}</p>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 rounded-xl border border-[#e4e8f0] bg-[#f7f8fd] p-4 text-[11px]">
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-slate-400">Giao thức</p><p className="mt-1 font-medium text-[#25304b]">{conn.protocol}</p></div>
              <div><p className="text-slate-400">Mã kết nối</p><p className="mt-1 font-mono font-medium text-[#25304b]">{conn.id}</p></div>
              <div><p className="text-slate-400">Timeout</p><p className="mt-1 font-medium text-[#25304b]">30s</p></div>
              <div><p className="text-slate-400">Retry</p><p className="mt-1 font-medium text-[#25304b]">3 lần / 5 phút</p></div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-[#f0f2f8] px-5 py-3">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-[#2740BA]"
        >
          {expanded ? "Thu gọn" : "Chi tiết"} <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
        <div className="ml-auto flex gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-[#e4e8f0] bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 transition-colors hover:border-[#2740BA] hover:text-[#2740BA]">
            <Activity className="h-3 w-3" /> Test kết nối
          </button>
          {conn.status === "active" && (
            <button className="flex items-center gap-1.5 rounded-lg bg-[#2740BA] px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#1e33a0]">
              <RefreshCw className="h-3 w-3" /> Đồng bộ ngay
            </button>
          )}
          <button className="rounded-lg border border-[#e4e8f0] p-1.5 text-slate-400 transition-colors hover:border-[#2740BA] hover:text-[#2740BA]">
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── National Tab ─────────────────────────────────────────────────────────────
function NationalTab() {
  return (
    <div className="space-y-5">
      {/* Overview card */}
      <div className="rounded-2xl border border-[#2740BA]/20 bg-gradient-to-br from-[#eef0ff] to-[#f5f7ff] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#2740BA]" strokeWidth={1.8} />
              <h3 className="font-bold text-[#1d2944]">Cổng Truy xuất nguồn gốc Quốc gia</h3>
            </div>
            <p className="mt-1 text-[12px] text-slate-500">check.gov.vn — Cục Xúc tiến thương mại, Bộ Công Thương</p>
          </div>
          <StatusBadge status="active" />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Bản ghi đã đẩy (tháng này)", value: "48.520", color: "text-[#2740BA]" },
            { label: "Bản ghi nhận về", value: "1.240", color: "text-[#4f9a77]" },
            { label: "Tỷ lệ thành công", value: "99,2%", color: "text-[#1f7a45]" },
            { label: "Độ trễ trung bình", value: "1.4s", color: "text-[#25304b]" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white/70 p-3 text-center shadow-sm">
              <p className="text-[10px] text-slate-400">{s.label}</p>
              <p className={`mt-1 text-[20px] font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech config */}
      <div className="rounded-2xl border border-[#e4e8f0] bg-white p-6 shadow-[0_2px_12px_rgba(38,55,105,.04)]">
        <p className="mb-4 font-bold text-[#1d2944]">Cấu hình kỹ thuật (UC-79 / UC-85)</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Endpoint đẩy dữ liệu",       value: "https://api.check.gov.vn/txng/v2/push",       mono: true },
            { label: "Endpoint nhận phản hồi",      value: "https://api.check.gov.vn/txng/v2/feedback",   mono: true },
            { label: "Xác thực",                    value: "OAuth 2.0 Client Credentials",                 mono: false },
            { label: "Phương thức đẩy",             value: "Batch (mỗi 15 phút) + Realtime webhook",       mono: false },
            { label: "Chuẩn dữ liệu",               value: "GS1 EPCIS 2.0 / JSON-LD",                     mono: false },
            { label: "Mã định danh tỉnh",           value: "DONGNAI-TXNG-2024",                            mono: true },
          ].map((f) => (
            <div key={f.label}>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{f.label}</p>
              <p className={`mt-1 text-[12px] ${f.mono ? "font-mono text-[#2740BA]" : "font-medium text-[#25304b]"}`}>{f.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button className="flex items-center gap-2 rounded-xl bg-[#2740BA] px-4 py-2.5 text-[12px] font-bold text-white shadow-[0_4px_14px_rgba(39,64,186,.2)] hover:bg-[#1e33a0]">
            <Play className="h-3.5 w-3.5" /> Đồng bộ toàn bộ ngay
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-[#e4e8f0] bg-white px-4 py-2.5 text-[12px] font-semibold text-slate-600 hover:border-[#2740BA] hover:text-[#2740BA]">
            <Activity className="h-3.5 w-3.5" /> Test kết nối
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-[#e4e8f0] bg-white px-4 py-2.5 text-[12px] font-semibold text-slate-600 hover:border-[#2740BA] hover:text-[#2740BA]">
            <Settings className="h-3.5 w-3.5" /> Cấu hình nâng cao
          </button>
        </div>
      </div>

      {/* Data scope */}
      <div className="rounded-2xl border border-[#e4e8f0] bg-white p-6 shadow-[0_2px_12px_rgba(38,55,105,.04)]">
        <p className="mb-4 font-bold text-[#1d2944]">Phạm vi dữ liệu chia sẻ</p>
        <div className="space-y-3">
          {[
            { label: "Hồ sơ doanh nghiệp / HTX đã duyệt",   pushed: true,  received: false },
            { label: "Danh mục sản phẩm đã đăng ký",         pushed: true,  received: false },
            { label: "Mã truy xuất & QR đã kích hoạt",       pushed: true,  received: false },
            { label: "Nhật ký sản xuất & chuỗi cung ứng",    pushed: true,  received: false },
            { label: "Chứng nhận chất lượng (ATTP, OCOP)",    pushed: true,  received: false },
            { label: "Chuẩn danh mục Quốc gia",              pushed: false, received: true  },
            { label: "Mã định danh toàn quốc",               pushed: false, received: true  },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between rounded-xl border border-[#f0f2f8] px-4 py-2.5">
              <span className="text-[12px] font-medium text-[#25304b]">{row.label}</span>
              <div className="flex items-center gap-3">
                {row.pushed   && <span className="flex items-center gap-1 rounded-full bg-[#edf0ff] px-2.5 py-0.5 text-[10px] font-semibold text-[#2740BA]"><ArrowUpDown className="h-2.5 w-2.5" /> Đẩy ra</span>}
                {row.received && <span className="flex items-center gap-1 rounded-full bg-[#e8f5ed] px-2.5 py-0.5 text-[10px] font-semibold text-[#1f7a45]"><ArrowUpDown className="h-2.5 w-2.5" /> Nhận về</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Ministries Tab ───────────────────────────────────────────────────────────
function MinistriesTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-slate-500">{ministryConnections.filter(c => c.status === "active").length}/{ministryConnections.length} kết nối đang hoạt động</p>
        <button className="flex items-center gap-2 rounded-xl bg-[#2740BA] px-4 py-2 text-[12px] font-bold text-white hover:bg-[#1e33a0]">
          <Plug className="h-3.5 w-3.5" /> Thêm kết nối mới
        </button>
      </div>
      {ministryConnections.map((conn) => (
        <ConnectionCard key={conn.id} conn={conn} showIn />
      ))}
    </div>
  );
}

// ─── Solutions Tab ────────────────────────────────────────────────────────────
function SolutionsTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-slate-500">{solutionConnections.filter(c => c.status === "active").length}/{solutionConnections.length} đối tác đang kết nối</p>
        <button className="flex items-center gap-2 rounded-xl bg-[#2740BA] px-4 py-2 text-[12px] font-bold text-white hover:bg-[#1e33a0]">
          <Plug className="h-3.5 w-3.5" /> Thêm đối tác mới
        </button>
      </div>
      {solutionConnections.map((conn) => (
        <ConnectionCard key={conn.id} conn={conn} showIn />
      ))}
    </div>
  );
}

// ─── Logs Tab ─────────────────────────────────────────────────────────────────
function LogsTab() {
  const logStatusCfg = {
    success: { label: "Thành công", cls: "bg-[#e8f5ed] text-[#1f7a45] border-[#b8e2c8]" },
    error:   { label: "Lỗi",       cls: "bg-[#fef0f0] text-[#c0392b] border-[#f5bcbc]" },
    partial: { label: "Một phần",  cls: "bg-[#fff4ed] text-[#E8650A] border-[#fcd9bb]" },
  };
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-[#e4e8f0] bg-white px-4 py-3 shadow-sm">
        {["Đích kết nối", "Hướng", "Trạng thái", "Khoảng thời gian"].map((label) => (
          <div key={label} className="relative">
            <select className="h-9 appearance-none rounded-xl border border-[#e4e8f0] bg-[#f9fafb] pl-3 pr-8 text-[12px] outline-none focus:border-[#2740BA]">
              <option>{label}</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border border-[#e4e8f0] bg-white shadow-sm">
        <table className="min-w-full text-[12px]">
          <thead>
            <tr className="border-b border-[#e4e8f0] bg-[#f9fafb]">
              {["Mã", "Đích kết nối", "Hướng", "Số bản ghi", "Mô tả", "Thời gian", "Trạng thái"].map((h) => (
                <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f2f8]">
            {connectionLogs.map((log) => {
              const cfg = logStatusCfg[log.status];
              return (
                <tr key={log.id} className="hover:bg-[#f7f8fd]">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[10px] text-slate-400">{log.id}</td>
                  <td className="px-4 py-3 font-semibold text-[#25304b]">{log.target}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${log.direction === "out" ? "bg-[#edf0ff] text-[#2740BA]" : "bg-[#e8f5ed] text-[#1f7a45]"}`}>
                      <ArrowUpDown className="h-2.5 w-2.5" />
                      {log.direction === "out" ? "Đẩy ra" : "Nhận về"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#25304b]">{log.records.toLocaleString()}</td>
                  <td className="max-w-[280px] px-4 py-3 text-slate-500">{log.message}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-400">{log.time}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${cfg.cls}`}>{cfg.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Connections() {
  const [tab, setTab] = useState<TabId>("national");

  const summaryStats = [
    { label: "Kết nối đang hoạt động", value: "7", icon: Wifi,     color: "text-[#1f7a45]", bg: "bg-[#e8f5ed]" },
    { label: "Kết nối lỗi / cảnh báo", value: "2", icon: WifiOff,  color: "text-[#c0392b]", bg: "bg-[#fef0f0]" },
    { label: "Bản ghi đẩy ra (hôm nay)", value: "14.840", icon: ArrowUpDown, color: "text-[#2740BA]", bg: "bg-[#edf0ff]" },
    { label: "Bản ghi nhận về (hôm nay)", value: "18.200", icon: Database, color: "text-[#4f9a77]", bg: "bg-[#e8f5ed]" },
  ];

  return (
    <DashboardShell title="Kết nối & Liên thông" subtitle="UC-85 · UC-79 — Cổng TXNG Quốc gia, Bộ ban ngành và giải pháp bên thứ ba">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#E8650A]">Hệ thống</p>
          <h2 className="mt-1.5 text-[24px] font-bold tracking-[-0.05em] text-[#1d2944]">Kết nối & Liên thông</h2>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 rounded-xl border border-[#e4e8f0] bg-white px-3.5 py-2.5 text-[12px] font-semibold text-slate-600 hover:border-[#2740BA] hover:text-[#2740BA]">
            <Shield className="h-4 w-4" /> Kiểm tra bảo mật
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-[#E8650A] px-4 py-2.5 text-[12px] font-bold text-white shadow-[0_4px_14px_rgba(232,101,10,.22)] hover:bg-[#d95c08]">
            <RefreshCw className="h-4 w-4" /> Đồng bộ tất cả
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summaryStats.map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-2xl border border-[#e4e8f0] bg-white p-4 shadow-[0_2px_12px_rgba(38,55,105,.04)]">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.bg}`}>
              <s.icon className={`h-5 w-5 ${s.color}`} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400">{s.label}</p>
              <p className={`mt-0.5 text-[20px] font-bold ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-5 flex flex-wrap gap-1.5 rounded-2xl border border-[#e4e8f0] bg-white p-1.5 shadow-sm">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[12px] font-semibold transition-colors ${tab === id ? "bg-[#2740BA] text-white shadow-[0_2px_8px_rgba(39,64,186,.2)]" : "text-slate-500 hover:bg-[#f7f8fc] hover:text-[#2740BA]"}`}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={tab === id ? 2 : 1.7} />
            {label}
          </button>
        ))}
      </div>

      {tab === "national"    && <NationalTab />}
      {tab === "ministries"  && <MinistriesTab />}
      {tab === "solutions"   && <SolutionsTab />}
      {tab === "logs"        && <LogsTab />}
    </DashboardShell>
  );
}
