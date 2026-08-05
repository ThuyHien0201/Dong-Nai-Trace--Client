import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  ChevronDown,
  ArrowUpRight,
  Database,
  GitMerge,
  Activity,
  Filter,
  Play,
  Layers,
  PackageCheck,
  FileStack,
  Cpu,
  Search,
  X,
  ExternalLink,
  Upload,
  CheckCheck,
  Package,
  Loader2,
} from "lucide-react";
import {
  useListPortalLots,
  useGetPortalLotDetail,
  usePushToPortal,
} from "@workspace/api-client-react";
import type {
  PortalLotItem,
  PortalLotDetail,
  ListPortalLotsSyncStatus,
} from "@workspace/api-client-react";

// ─── Types ──────────────────────────────────────────────────────────────────
type SyncStatus = "success" | "error" | "partial" | "pending";
type Direction  = "in" | "out";

interface SyncEntry {
  id: string;
  source: string;
  type: string;
  direction: Direction;
  records: number;
  valid: number;
  failed: number;
  status: SyncStatus;
  stage: string;
  time: string;
}

interface ReconcileRow {
  field: string;
  client: string;
  source: string;
  match: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "queue",       label: "Hàng đợi đồng bộ",       icon: Layers      },
  { id: "reconcile",   label: "Đối chiếu dữ liệu",       icon: GitMerge    },
  { id: "monitor",     label: "Giám sát trạng thái",      icon: Activity    },
  { id: "push",        label: "Đẩy ra Portal & App",      icon: ArrowUpRight },
] as const;
type TabId = (typeof TABS)[number]["id"];

const statusCfg: Record<SyncStatus, { label: string; cls: string }> = {
  success: { label: "Thành công", cls: "bg-[#e8f5ed] text-[#1f7a45] border border-[#b8e2c8]"  },
  error:   { label: "Lỗi",        cls: "bg-[#fef0f0] text-[#c0392b] border border-[#f5bcbc]"  },
  partial: { label: "Một phần",   cls: "bg-[#fff4ed] text-[#E8650A] border border-[#fcd9bb]"  },
  pending: { label: "Đang xử lý", cls: "bg-[#f2f3f7] text-[#6b7694] border border-[#d9dce9]"  },
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const syncQueue: SyncEntry[] = [
  { id: "SY-001", source: "Checkee Platform",         type: "Nhật ký sản xuất",     direction: "in",  records: 1240, valid: 1238, failed: 2,  status: "success", stage: "Ghi nhận",  time: "10:15" },
  { id: "SY-002", source: "Portal Đồng Nai (UC-80)",  type: "Hồ sơ doanh nghiệp",  direction: "in",  records: 5,   valid: 5,    failed: 0,  status: "success", stage: "Ghi nhận",  time: "10:10" },
  { id: "SY-003", source: "iFarm Traceability",        type: "Lô hàng & mã QR",      direction: "in",  records: 380, valid: 375,  failed: 5,  status: "partial", stage: "Chuẩn hóa", time: "09:45" },
  { id: "SY-004", source: "Portal Đồng Nai (UC-80)",  type: "Khai báo sản phẩm",    direction: "in",  records: 12,  valid: 12,   failed: 0,  status: "success", stage: "Ghi nhận",  time: "09:30" },
  { id: "SY-005", source: "VinTrace Enterprise",       type: "Nhật ký vận chuyển",   direction: "in",  records: 0,   valid: 0,    failed: 0,  status: "error",   stage: "Tiếp nhận", time: "09:00" },
  { id: "SY-006", source: "Checkee Platform",         type: "Chứng nhận chất lượng", direction: "in",  records: 88,  valid: 88,   failed: 0,  status: "success", stage: "Ghi nhận",  time: "08:30" },
  { id: "SY-007", source: "Hệ thống nội bộ",          type: "Danh mục sản phẩm",    direction: "out", records: 520, valid: 520,  failed: 0,  status: "success", stage: "Ghi nhận",  time: "08:00" },
  { id: "SY-008", source: "iFarm Traceability",        type: "Nhật ký sản xuất",     direction: "in",  records: 210, valid: 205,  failed: 5,  status: "partial", stage: "Ánh xạ",    time: "07:30" },
];

const reconcileData: ReconcileRow[] = [
  { field: "Tên doanh nghiệp",   client: "Công ty TNHH Nông sản An Phú",        source: "Công ty TNHH Nông sản An Phú",        match: true  },
  { field: "Mã số thuế",         client: "3601234567",                           source: "3601234567",                           match: true  },
  { field: "Ngành hàng",         client: "Nông sản",                             source: "Nông nghiệp – Trồng trọt",             match: false },
  { field: "Địa chỉ",            client: "Biên Hòa, Đồng Nai",                  source: "Biên Hòa, Đồng Nai, Việt Nam",        match: true  },
  { field: "Người đại diện",     client: "Nguyễn Văn An",                        source: "Nguyễn Văn An",                        match: true  },
  { field: "Số sản phẩm khai báo", client: "14",                                source: "16",                                   match: false },
  { field: "Trạng thái hoạt động", client: "Đã duyệt",                          source: "active",                               match: true  },
];

const pushJobs = [
  { id: "PJ-001", target: "Portal Đồng Nai",     type: "Sản phẩm đã duyệt",    records: 520,  status: "success" as SyncStatus, time: "10:05" },
  { id: "PJ-002", target: "App Mobile",           type: "Thông tin doanh nghiệp", records: 125,  status: "success" as SyncStatus, time: "10:04" },
  { id: "PJ-003", target: "Portal Đồng Nai",     type: "Mã QR kích hoạt",       records: 1240, status: "success" as SyncStatus, time: "09:50" },
  { id: "PJ-004", target: "App Mobile",           type: "Nhật ký truy xuất",     records: 380,  status: "partial" as SyncStatus, time: "09:45" },
  { id: "PJ-005", target: "Portal Đồng Nai",     type: "Tin tức & banner",       records: 3,    status: "pending" as SyncStatus, time: "Đang chờ…" },
  { id: "PJ-006", target: "Cổng TXNG Quốc gia",  type: "Hồ sơ doanh nghiệp",   records: 1200, status: "success" as SyncStatus, time: "09:00" },
];

// ─── Queue Tab (UC-36,37,38,39,80,41) ────────────────────────────────────────
function QueueTab() {
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-[#e4e8f0] bg-white px-4 py-3 shadow-sm">
        <Filter className="h-3.5 w-3.5 text-slate-400" />
        {["Nguồn dữ liệu", "Loại dữ liệu", "Trạng thái", "Giai đoạn"].map((label) => (
          <div key={label} className="relative">
            <select className="h-9 appearance-none rounded-xl border border-[#e4e8f0] bg-[#f9fafb] pl-3 pr-8 text-[12px] outline-none focus:border-[#2740BA]">
              <option>{label}</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>
        ))}
        <button className="ml-auto flex items-center gap-1.5 rounded-xl bg-[#2740BA] px-3.5 py-2 text-[12px] font-bold text-white hover:bg-[#1e33a0]">
          <Play className="h-3.5 w-3.5" /> Chạy đồng bộ thủ công
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e4e8f0] bg-white shadow-sm">
        <table className="min-w-full text-[12px]">
          <thead>
            <tr className="border-b border-[#e4e8f0] bg-[#f9fafb]">
              {["Mã", "Nguồn / UC", "Loại dữ liệu", "Hướng", "Tổng bản ghi", "Hợp lệ", "Lỗi", "Giai đoạn", "Thời gian", "Trạng thái"].map((h) => (
                <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f2f8]">
            {syncQueue.map((row) => {
              const cfg = statusCfg[row.status];
              return (
                <tr key={row.id} className="hover:bg-[#f7f8fd]">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[10px] text-slate-400">{row.id}</td>
                  <td className="px-4 py-3 font-semibold text-[#25304b]">{row.source}</td>
                  <td className="px-4 py-3 text-slate-500">{row.type}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${row.direction === "in" ? "bg-[#e8f5ed] text-[#1f7a45]" : "bg-[#edf0ff] text-[#2740BA]"}`}>
                      {row.direction === "in" ? "← Nhận" : "→ Đẩy"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-[#25304b]">{row.records.toLocaleString()}</td>
                  <td className="px-4 py-3 text-[#1f7a45]">{row.valid.toLocaleString()}</td>
                  <td className="px-4 py-3 text-[#c0392b]">{row.failed > 0 ? row.failed : "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500">{row.stage}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-400">{row.time}</td>
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

// ─── Reconcile Tab (UC-43) ────────────────────────────────────────────────────
function ReconcileTab() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#e4e8f0] bg-white px-4 py-3 shadow-sm">
        <div className="relative">
          <select className="h-9 appearance-none rounded-xl border border-[#e4e8f0] bg-[#f9fafb] pl-3 pr-8 text-[12px] outline-none focus:border-[#2740BA]">
            <option>Chọn doanh nghiệp để đối chiếu</option>
            <option>Công ty TNHH Nông sản An Phú</option>
            <option>HTX Nông nghiệp Xuân Lộc</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
        <div className="relative">
          <select className="h-9 appearance-none rounded-xl border border-[#e4e8f0] bg-[#f9fafb] pl-3 pr-8 text-[12px] outline-none focus:border-[#2740BA]">
            <option>Nguồn so sánh: Checkee Platform</option>
            <option>Nguồn so sánh: iFarm</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
        <button className="flex items-center gap-1.5 rounded-xl bg-[#2740BA] px-3.5 py-2 text-[12px] font-bold text-white hover:bg-[#1e33a0]">
          <RefreshCw className="h-3.5 w-3.5" /> Đối chiếu ngay
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Trường khớp",       value: "5",  color: "text-[#1f7a45]", bg: "bg-[#e8f5ed]", icon: CheckCircle2 },
          { label: "Trường không khớp", value: "2",  color: "text-[#c0392b]", bg: "bg-[#fef0f0]", icon: AlertCircle  },
          { label: "Tổng trường kiểm",  value: "7",  color: "text-[#2740BA]", bg: "bg-[#edf0ff]", icon: Database      },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-2xl border border-[#e4e8f0] bg-white p-4 shadow-sm">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
              <s.icon className={`h-5 w-5 ${s.color}`} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400">{s.label}</p>
              <p className={`text-[22px] font-bold ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#e4e8f0] bg-white shadow-sm">
        <div className="border-b border-[#e4e8f0] bg-[#f9fafb] px-5 py-3">
          <p className="text-[12px] font-bold text-[#1d2944]">Công ty TNHH Nông sản An Phú — so với Checkee Platform</p>
        </div>
        <table className="min-w-full text-[12px]">
          <thead>
            <tr className="border-b border-[#e4e8f0] bg-[#f9fafb]">
              {["Trường dữ liệu", "Giá trị trên Client", "Giá trị từ nguồn", "Kết quả"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f2f8]">
            {reconcileData.map((row) => (
              <tr key={row.field} className={row.match ? "" : "bg-[#fff9f7]"}>
                <td className="px-5 py-3 font-semibold text-[#25304b]">{row.field}</td>
                <td className="px-5 py-3 text-slate-600">{row.client}</td>
                <td className="px-5 py-3 text-slate-600">{row.source}</td>
                <td className="px-5 py-3">
                  {row.match
                    ? <span className="flex items-center gap-1 text-[#1f7a45]"><CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} /> Khớp</span>
                    : <span className="flex items-center gap-1 font-semibold text-[#c0392b]"><AlertCircle className="h-3.5 w-3.5" strokeWidth={2} /> Không khớp</span>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-[#f0f2f8] px-5 py-3">
          <button className="text-[12px] font-semibold text-[#2740BA] hover:underline">Cập nhật Client theo nguồn →</button>
        </div>
      </div>
    </div>
  );
}

// ─── Monitor Tab (UC-44) ──────────────────────────────────────────────────────
function MonitorTab() {
  const pipeline = [
    { id: "UC-36", label: "Tiếp nhận API",       desc: "Nhận dữ liệu từ đối tác giải pháp", count: 1918, ok: 1918, icon: Download,    color: "#2740BA" },
    { id: "UC-37", label: "Kiểm tra cấu trúc",   desc: "Validate & ánh xạ trường dữ liệu",  count: 1918, ok: 1906, icon: FileStack,   color: "#4f9a77" },
    { id: "UC-38", label: "Chuẩn hóa danh mục",  desc: "Áp danh mục dùng chung",             count: 1906, ok: 1901, icon: PackageCheck, color: "#2e9fbf" },
    { id: "UC-39", label: "Ghi nhận trạng thái", desc: "Thành công / thất bại + lý do lỗi",  count: 1901, ok: 1898, icon: Cpu,          color: "#6b5ce7" },
  ];

  return (
    <div className="space-y-5">
      {/* Pipeline */}
      <div className="rounded-2xl border border-[#e4e8f0] bg-white p-6 shadow-sm">
        <p className="mb-5 font-bold text-[#1d2944]">Pipeline tiếp nhận & chuẩn hóa (hôm nay)</p>
        <div className="flex flex-col gap-0 sm:flex-row">
          {pipeline.map((step, i) => (
            <div key={step.id} className="flex flex-1 flex-col items-center sm:relative">
              {/* Connector line */}
              {i < pipeline.length - 1 && (
                <div className="absolute right-0 top-8 hidden h-px w-8 bg-[#e4e8f0] sm:block" style={{ right: "-16px", zIndex: 1 }} />
              )}
              <div className="flex w-full flex-col items-center rounded-2xl border border-[#e4e8f0] bg-[#f9fafb] p-4 mx-1">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: step.color + "18" }}>
                  <step.icon className="h-5 w-5" style={{ color: step.color }} strokeWidth={1.8} />
                </div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider" style={{ color: step.color }}>{step.id}</p>
                <p className="mt-1 text-center text-[11px] font-bold text-[#1d2944]">{step.label}</p>
                <p className="mt-0.5 text-center text-[10px] text-slate-400">{step.desc}</p>
                <div className="mt-3 w-full rounded-full bg-[#e4e8f0] h-1.5">
                  <div className="h-full rounded-full" style={{ width: `${Math.round(step.ok / step.count * 100)}%`, background: step.color }} />
                </div>
                <div className="mt-2 flex w-full items-center justify-between text-[10px]">
                  <span className="font-semibold" style={{ color: step.color }}>{step.ok.toLocaleString()} OK</span>
                  <span className="text-slate-400">{(step.count - step.ok)} lỗi</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error log */}
      <div className="rounded-2xl border border-[#e4e8f0] bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-bold text-[#1d2944]">Bản ghi lỗi gần nhất</p>
          <span className="rounded-full bg-[#fef0f0] px-2.5 py-0.5 text-[10px] font-bold text-[#c0392b]">20 lỗi hôm nay</span>
        </div>
        <div className="space-y-2">
          {[
            { uc: "UC-37", source: "VinTrace Enterprise",  msg: "Trường 'batch_id' không hợp lệ — giá trị null",                   time: "09:00" },
            { uc: "UC-38", source: "iFarm Traceability",   msg: "Không ánh xạ được ngành hàng 'Organic Farming' vào danh mục chuẩn", time: "09:45" },
            { uc: "UC-38", source: "iFarm Traceability",   msg: "Đơn vị tính 'thùng (24 chai)' chưa có trong danh mục",            time: "09:45" },
            { uc: "UC-37", source: "Checkee Platform",     msg: "Mã QR trùng lặp với bản ghi SY-001 — bỏ qua",                    time: "10:15" },
          ].map((e, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-[#f5bcbc] bg-[#fff8f8] px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#c0392b]" strokeWidth={1.8} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-[#fef0f0] px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#c0392b]">{e.uc}</span>
                  <span className="text-[11px] font-semibold text-[#c0392b]">{e.source}</span>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-500">{e.msg}</p>
              </div>
              <span className="shrink-0 text-[10px] text-slate-400">{e.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Push Tab (UC-84) ─────────────────────────────────────────────────────────
// ─── Portal Sync Modal ───────────────────────────────────────────────────────

function fmtDate(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isImageUrl(url: string | null | undefined) {
  if (!url) return false;
  return /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(url);
}

interface SyncModalProps {
  lotId: number;
  onClose: () => void;
  onSuccess: () => void;
}

function SyncModal({ lotId, onClose, onSuccess }: SyncModalProps) {
  const { data: detail, isLoading } = useGetPortalLotDetail(lotId);
  const pushMutation = usePushToPortal();

  const [province, setProvince] = useState<string>("");
  const [productionZone, setProductionZone] = useState<string>("");
  const [locationOverrides, setLocationOverrides] = useState<Record<string, string>>({});
  const [pushed, setPushed] = useState(false);
  const [pushedUrl, setPushedUrl] = useState<string | null>(null);

  // Pre-fill once detail loads
  useEffect(() => {
    if (detail) {
      setProvince(detail.province ?? "Đồng Nai");
      setProductionZone(detail.productionZone ?? "");
    }
  }, [detail?.id]);

  const handlePush = async () => {
    if (!detail) return;
    const stepOverrides = detail.txngSteps
      .filter((s) => locationOverrides[s.stepType])
      .map((s) => ({
        stepType: s.stepType,
        stepName: s.stepName,
        startTime: s.startTime ?? null,
        endTime: s.endTime ?? null,
        executor: s.executor ?? null,
        locationCode: locationOverrides[s.stepType] || s.locationCode || null,
        description: s.description ?? null,
        evidenceUrl: s.evidenceUrl ?? null,
      }));

    try {
      const result = await pushMutation.mutateAsync({
        lotId,
        data: { province, productionZone, stepOverrides },
      });
      setPushedUrl(result.portalUrl);
      setPushed(true);
      onSuccess();
    } catch {
      // error handled by mutation state
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e4e8f0] px-6 py-4">
          <p className="text-[13px] font-bold uppercase tracking-wide text-[#1d2944]">
            Đồng bộ lên cổng thông tin truy xuất nguồn gốc sản phẩm, hàng hóa quốc gia
          </p>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-[#f1f3f9] hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-[#2740BA]" />
            </div>
          ) : !detail ? (
            <p className="text-center text-slate-400">Không tìm thấy dữ liệu</p>
          ) : (
            <>
              {/* Portal link */}
              {(pushed || detail.syncStatus === "synced") && (
                <div className="flex items-center gap-2 rounded-xl border border-[#c9ddf4] bg-[#f3f8ff] px-4 py-2.5 text-[12px]">
                  <ExternalLink className="h-3.5 w-3.5 text-[#2740BA]" />
                  <span className="text-slate-500">Link sau khi đưa lên cổng:</span>
                  <a
                    href={pushedUrl ?? detail.portalUrl ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-[#2740BA] underline"
                  >
                    {pushedUrl ?? detail.portalUrl ?? "Link"}
                  </a>
                </div>
              )}

              {/* Basic info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Mã GTIN <span className="text-[#c0392b]">*</span>
                  </label>
                  <input
                    readOnly
                    value={detail.gtin}
                    className="w-full rounded-xl border border-[#e4e8f0] bg-[#f9fafb] px-3.5 py-2.5 text-[12px] font-mono text-[#25304b]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Số lô/mẻ <span className="text-[#c0392b]">*</span>
                  </label>
                  <input
                    readOnly
                    value={detail.lotCode}
                    className="w-full rounded-xl border border-[#e4e8f0] bg-[#f9fafb] px-3.5 py-2.5 text-[12px] font-mono text-[#25304b]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Tỉnh thành <span className="text-[#c0392b]">*</span>
                  </label>
                  <input
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full rounded-xl border border-[#e4e8f0] bg-white px-3.5 py-2.5 text-[12px] text-[#25304b] outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Ngành hàng <span className="text-[#c0392b]">*</span>
                  </label>
                  <input
                    readOnly
                    value={detail.industryName}
                    className="w-full rounded-xl border border-[#e4e8f0] bg-[#f9fafb] px-3.5 py-2.5 text-[12px] text-[#25304b]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    Vùng trồng/sản xuất <span className="text-[#c0392b]">*</span>
                  </label>
                  <input
                    value={productionZone}
                    onChange={(e) => setProductionZone(e.target.value)}
                    className="w-full rounded-xl border border-[#e4e8f0] bg-white px-3.5 py-2.5 text-[12px] text-[#25304b] outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15"
                    placeholder="Ví dụ: Vùng bưởi Tân Triều, Xuân Lộc..."
                  />
                </div>
              </div>

              {/* TXNG Steps */}
              {detail.txngSteps.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#e4e8f0] p-5 text-center text-[12px] text-slate-400">
                  Chưa có công đoạn TXNG nào được đơn vị cung cấp giải pháp đẩy lên.
                  <br />
                  Các công đoạn bắt buộc:{" "}
                  <span className="font-semibold text-[#E8650A]">
                    {detail.requiredStepTypes.join(", ")}
                  </span>
                </div>
              ) : (
                detail.txngSteps.map((step) => (
                  <div
                    key={step.stepType}
                    className="overflow-hidden rounded-2xl border border-[#e4e8f0]"
                  >
                    <div className="border-b border-[#e4e8f0] bg-[#f7f8fd] px-5 py-3">
                      <p className="text-[13px] font-bold text-[#1d2944]">{step.stepName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 p-5">
                      <div>
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Thời gian bắt đầu
                        </p>
                        <p className="text-[12px] text-[#25304b]">{fmtDate(step.startTime)}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Thời gian kết thúc
                        </p>
                        <p className="text-[12px] text-[#25304b]">{fmtDate(step.endTime)}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Người thực hiện
                        </p>
                        <p className="text-[12px] text-[#25304b]">{step.executor ?? "—"}</p>
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          Mã truy vết địa điểm sản xuất{" "}
                          <span className="text-[#c0392b]">*</span>
                        </label>
                        <input
                          value={
                            locationOverrides[step.stepType] !== undefined
                              ? locationOverrides[step.stepType]
                              : (step.locationCode ?? "")
                          }
                          onChange={(e) =>
                            setLocationOverrides((prev) => ({
                              ...prev,
                              [step.stepType]: e.target.value,
                            }))
                          }
                          placeholder="Nhập mã truy vết..."
                          className="w-full rounded-xl border border-[#e4e8f0] bg-white px-3 py-2 text-[12px] text-[#25304b] outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15"
                        />
                      </div>
                      {step.description && (
                        <div className="col-span-2">
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            Mô tả
                          </p>
                          <p className="text-[12px] text-[#25304b]">{step.description}</p>
                        </div>
                      )}
                      {step.evidenceUrl && (
                        <div className="col-span-2">
                          <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            URL ảnh minh chứng
                          </p>
                          <div className="flex items-start gap-3">
                            <input
                              readOnly
                              value={step.evidenceUrl}
                              className="flex-1 rounded-xl border border-[#e4e8f0] bg-[#f9fafb] px-3 py-2 text-[11px] font-mono text-slate-500"
                            />
                            {isImageUrl(step.evidenceUrl) && (
                              <img
                                src={step.evidenceUrl}
                                alt="minh chứng"
                                className="h-16 w-24 rounded-xl border border-[#e4e8f0] object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[#e4e8f0] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-[#e4e8f0] px-5 py-2.5 text-[12px] font-semibold text-slate-600 hover:border-slate-300 hover:bg-[#f9fafb]"
          >
            Hủy
          </button>
          {!pushed && detail?.syncStatus !== "synced" && (
            <button
              onClick={handlePush}
              disabled={
                pushMutation.isPending ||
                !detail?.isComplete ||
                isLoading
              }
              className="flex items-center gap-2 rounded-xl bg-[#2740BA] px-5 py-2.5 text-[12px] font-bold text-white shadow-sm hover:bg-[#1e339e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pushMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Đang đẩy lên...
                </>
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5" /> Lưu & đẩy lên cổng
                </>
              )}
            </button>
          )}
          {(pushed || detail?.syncStatus === "synced") && (
            <div className="flex items-center gap-2 rounded-xl bg-[#e8f5ed] px-5 py-2.5 text-[12px] font-bold text-[#1f7a45]">
              <CheckCheck className="h-3.5 w-3.5" /> Đã đồng bộ thành công
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Portal Sync Tab ─────────────────────────────────────────────────────────

function PushTab() {
  type FilterStatus = "all" | "not_synced" | "synced";

  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchGtin, setSearchGtin] = useState("");
  const [searchLot, setSearchLot] = useState("");
  const [searchBusiness, setSearchBusiness] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [selectedLotId, setSelectedLotId] = useState<number | null>(null);

  const { data, isLoading, refetch } = useListPortalLots({
    syncStatus: filterStatus as ListPortalLotsSyncStatus,
    gtin: searchGtin || undefined,
    lotCode: searchLot || undefined,
    businessName: searchBusiness || undefined,
    productName: searchProduct || undefined,
    pageSize: 50,
  });

  const lots = data?.data ?? [];
  const total = data?.total ?? 0;
  const notSyncedCount = data?.notSyncedCount ?? 0;
  const syncedCount = data?.syncedCount ?? 0;

  const tabs: { id: FilterStatus; label: string; count: number; cls: string }[] = [
    { id: "all",        label: "Tất cả",         count: total,          cls: filterStatus === "all"        ? "bg-[#2740BA] text-white" : "bg-[#edf0ff] text-[#2740BA] hover:bg-[#dde2ff]" },
    { id: "not_synced", label: "Chưa đồng bộ",   count: notSyncedCount, cls: filterStatus === "not_synced" ? "bg-[#E8650A] text-white" : "bg-[#fff4ed] text-[#E8650A] hover:bg-[#ffe8d5]" },
    { id: "synced",     label: "Đã đồng bộ",     count: syncedCount,    cls: filterStatus === "synced"     ? "bg-[#1f7a45] text-white" : "bg-[#e8f5ed] text-[#1f7a45] hover:bg-[#d5eddf]" },
  ];

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div>
        <h3 className="text-[15px] font-bold tracking-[-0.03em] text-[#1d2944]">
          Đồng bộ dữ liệu cổng thông tin TXNG QG
        </h3>
        <p className="mt-0.5 text-[11px] text-slate-400">
          Xem xét hồ sơ hoàn thiện và đẩy lên Cổng thông tin truy xuất nguồn gốc sản phẩm, hàng hóa quốc gia
        </p>
      </div>

      {/* Status filter badges */}
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilterStatus(t.id)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[12px] font-bold transition-colors ${t.cls}`}
          >
            {t.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                filterStatus === t.id
                  ? "bg-white/25 text-white"
                  : "bg-white/80 text-current"
              }`}
            >
              {t.count}
            </span>
          </button>
        ))}
        <button
          onClick={() => refetch()}
          className="ml-auto rounded-xl border border-[#e4e8f0] p-2 text-slate-400 hover:border-[#2740BA] hover:text-[#2740BA]"
          title="Làm mới"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Search bar */}
      <div className="flex flex-wrap gap-2">
        {[
          { placeholder: "Lô thương phẩm", value: searchLot, set: setSearchLot },
          { placeholder: "Tên doanh nghiệp", value: searchBusiness, set: setSearchBusiness },
          { placeholder: "Tên thương phẩm", value: searchProduct, set: setSearchProduct },
          { placeholder: "GTIN", value: searchGtin, set: setSearchGtin },
        ].map(({ placeholder, value, set }) => (
          <div key={placeholder} className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              value={value}
              onChange={(e) => set(e.target.value)}
              placeholder={placeholder}
              className="h-9 rounded-xl border border-[#e4e8f0] bg-[#f9fafb] pl-8 pr-3 text-[12px] text-[#25304b] outline-none transition focus:border-[#2740BA] focus:bg-white focus:ring-2 focus:ring-[#2740BA]/15"
            />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#e4e8f0] bg-white shadow-sm">
        <table className="min-w-full text-[12px]">
          <thead>
            <tr className="border-b border-[#e4e8f0] bg-[#f9fafb]">
              {["STT", "GTIN / Thương phẩm", "Lô thương phẩm", "Doanh nghiệp", "Ngày kích hoạt", "Trạng thái đồng bộ VNTP", "Thao tác"].map(
                (h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f2f8]">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-[#2740BA]" />
                </td>
              </tr>
            ) : lots.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                  Không có dữ liệu phù hợp
                </td>
              </tr>
            ) : (
              lots.map((lot, idx) => (
                <tr key={lot.id} className="hover:bg-[#f9fafb] transition-colors">
                  <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e4e8f0] bg-[#f9fafb]">
                        {lot.imageUrl ? (
                          <img
                            src={lot.imageUrl}
                            alt=""
                            className="h-7 w-7 rounded-lg object-cover"
                          />
                        ) : (
                          <Package className="h-4 w-4 text-slate-300" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-[#25304b]">{lot.productName}</p>
                        <p className="font-mono text-[10px] text-slate-400">GTIN: {lot.gtin}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-mono font-semibold text-[#2740BA]">
                    {lot.lotCode}
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">{lot.businessName}</td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-slate-400">
                    {fmtDate(lot.activatedAt)}
                  </td>
                  <td className="px-4 py-3.5">
                    {lot.syncStatus === "synced" ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#b8e2c8] bg-[#e8f5ed] px-2.5 py-0.5 text-[10px] font-bold text-[#1f7a45]">
                        <CheckCheck className="h-3 w-3" /> Đã đồng bộ
                      </span>
                    ) : lot.isComplete ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#fcd9bb] bg-[#fff4ed] px-2.5 py-0.5 text-[10px] font-bold text-[#E8650A]">
                        <Upload className="h-3 w-3" /> Chưa đồng bộ
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#d9dce9] bg-[#f2f3f7] px-2.5 py-0.5 text-[10px] font-bold text-[#6b7694]">
                        <Clock className="h-3 w-3" /> Thiếu dữ liệu TXNG
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {lot.syncStatus === "synced" ? (
                        <a
                          href={lot.portalUrl ?? "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg p-1.5 text-[#1f7a45] hover:bg-[#e8f5ed]"
                          title="Xem trên cổng"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <button
                          onClick={() => setSelectedLotId(lot.id)}
                          disabled={!lot.isComplete}
                          title={lot.isComplete ? "Đẩy lên cổng" : "Hồ sơ chưa hoàn thiện — cần đơn vị giải pháp đẩy dữ liệu TXNG"}
                          className="flex items-center gap-1 rounded-lg border border-[#2740BA] px-2.5 py-1 text-[10px] font-semibold text-[#2740BA] hover:bg-[#edf0ff] disabled:cursor-not-allowed disabled:border-[#d9dce9] disabled:text-slate-400"
                        >
                          <Upload className="h-3 w-3" /> Đẩy lên cổng
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedLotId !== null && (
        <SyncModal
          lotId={selectedLotId}
          onClose={() => setSelectedLotId(null)}
          onSuccess={() => {
            refetch();
          }}
        />
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Sync() {
  const [tab, setTab] = useState<TabId>("queue");

  const summaryStats = [
    { label: "Tổng bản ghi nhận hôm nay", value: "1.918", icon: Download,    color: "text-[#2740BA]", bg: "bg-[#edf0ff]" },
    { label: "Đồng bộ thành công",          value: "1.898", icon: CheckCircle2, color: "text-[#1f7a45]", bg: "bg-[#e8f5ed]" },
    { label: "Lỗi cần xử lý",              value: "20",    icon: AlertCircle,  color: "text-[#c0392b]", bg: "bg-[#fef0f0]" },
    { label: "Đang trong hàng đợi",         value: "3",     icon: Clock,        color: "text-[#E8650A]", bg: "bg-[#fff4ed]" },
  ];

  return (
    <DashboardShell title="Đồng bộ dữ liệu" subtitle="UC-36/37/38/39/80/43/44/84 — Tiếp nhận, chuẩn hóa và giám sát dữ liệu">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#E8650A]">Hệ thống</p>
          <h2 className="mt-1.5 text-[24px] font-bold tracking-[-0.05em] text-[#1d2944]">Đồng bộ dữ liệu</h2>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-[#E8650A] px-4 py-2.5 text-[12px] font-bold text-white shadow-[0_4px_14px_rgba(232,101,10,.22)] hover:bg-[#d95c08]">
          <RefreshCw className="h-4 w-4" /> Chạy pipeline ngay
        </button>
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

      {tab === "queue"     && <QueueTab />}
      {tab === "reconcile" && <ReconcileTab />}
      {tab === "monitor"   && <MonitorTab />}
      {tab === "push"      && <PushTab />}
    </DashboardShell>
  );
}
