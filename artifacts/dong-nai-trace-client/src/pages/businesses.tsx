import { useState, useMemo } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  Search,
  Plus,
  FileDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Pencil,
  Lock,
  Unlock,
  Check,
  X,
  Clock,
  Building2,
  FileText,
  ArrowLeft,
  QrCode,
  ChevronUp,
  ArrowUpDown,
  MoreHorizontal,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Trash2,
  Phone,
  MapPin,
  KeyRound,
  RefreshCw,
  Copy,
  UploadCloud,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────
type Status = "Hoạt động" | "Đã duyệt" | "Chờ duyệt" | "Yêu cầu bổ sung" | "Đã bổ sung" | "Đã khóa";
type ApprovalStatus = "Đã duyệt" | "Chờ duyệt" | "Yêu cầu bổ sung" | "Đã bổ sung";
type SortDir = "asc" | "desc" | null;
type SortKey = keyof Business | null;

interface Business {
  id: string;
  name: string;
  taxCode: string;
  region: string;
  sector: string;
  status: Status;
  registeredAt: string;
  representative: string;
  phone: string;
  businessCode: string | null;
  imageUrl: string;
}

// ─── Mock data ─────────────────────────────────────────────────────────────────
const initialBusinesses: Business[] = [
  { id: "DN-001", name: "Công ty TNHH Nông sản An Phú", taxCode: "3601234567", region: "Biên Hòa", sector: "Nông sản", status: "Hoạt động", registeredAt: "12/10/2024", representative: "Nguyễn Văn An", phone: "0901 234 567", businessCode: "DNT-2024-0001", imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=220&fit=crop" },
  { id: "DN-002", name: "HTX Nông nghiệp Xuân Lộc", taxCode: "3607654321", region: "Xuân Lộc", sector: "OCOP", status: "Hoạt động", registeredAt: "18/12/2024", representative: "Trần Thị Bình", phone: "0912 345 678", businessCode: null, imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=220&fit=crop" },
  { id: "DN-003", name: "Công ty CP Thực phẩm Đồng Nai", taxCode: "3601112233", region: "Long Khánh", sector: "Thực phẩm CB", status: "Hoạt động", registeredAt: "05/09/2024", representative: "Lê Hoàng Nam", phone: "0923 456 789", businessCode: "DNT-2024-0002", imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=220&fit=crop" },
  { id: "DN-004", name: "Trại nuôi thủy sản Nhơn Trạch", taxCode: "3608889900", region: "Nhơn Trạch", sector: "Thủy sản", status: "Hoạt động", registeredAt: "22/11/2024", representative: "Phạm Minh Cường", phone: "0934 567 890", businessCode: null, imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=220&fit=crop" },
  { id: "DN-005", name: "Trang trại hữu cơ Long Thành", taxCode: "3605556677", region: "Long Thành", sector: "Nông sản", status: "Đã khóa", registeredAt: "01/08/2024", representative: "Vũ Thị Dung", phone: "0945 678 901", businessCode: "DNT-2024-0003", imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=220&fit=crop" },
  { id: "DN-006", name: "Cơ sở chế biến Bưởi Tân Triều", taxCode: "3602223344", region: "Vĩnh Cửu", sector: "OCOP", status: "Hoạt động", registeredAt: "15/12/2024", representative: "Đỗ Văn Em", phone: "0956 789 012", businessCode: null, imageUrl: "https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=400&h=220&fit=crop" },
  { id: "DN-007", name: "Công ty TNHH Dược liệu Định Quán", taxCode: "3609990011", region: "Định Quán", sector: "Dược liệu", status: "Hoạt động", registeredAt: "30/07/2024", representative: "Bùi Thị Phương", phone: "0967 890 123", businessCode: "DNT-2024-0004", imageUrl: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=220&fit=crop" },
  { id: "DN-008", name: "HTX Chăn nuôi Tân Phú", taxCode: "3604445566", region: "Tân Phú", sector: "Chăn nuôi", status: "Hoạt động", registeredAt: "19/12/2024", representative: "Hoàng Văn Giang", phone: "0978 901 234", businessCode: null, imageUrl: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=220&fit=crop" },
  { id: "DN-009", name: "Công ty TNHH Xuất khẩu Xoài Đồng Nai", taxCode: "3603334455", region: "Cao Lãnh", sector: "Nông sản", status: "Hoạt động", registeredAt: "14/06/2024", representative: "Nguyễn Thị Hoa", phone: "0989 012 345", businessCode: "DNT-2024-0005", imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=220&fit=crop" },
  { id: "DN-010", name: "HTX Nông nghiệp Sạch Trảng Bom", taxCode: "3606667788", region: "Trảng Bom", sector: "Nông sản", status: "Hoạt động", registeredAt: "20/12/2024", representative: "Trần Văn Inh", phone: "0990 123 456", businessCode: null, imageUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=220&fit=crop" },
  { id: "DN-011", name: "Công ty CP Chế biến Cacao Việt", taxCode: "3600001122", region: "Biên Hòa", sector: "Thực phẩm CB", status: "Hoạt động", registeredAt: "28/05/2024", representative: "Lê Thị Kim", phone: "0901 234 567", businessCode: "DNT-2024-0006", imageUrl: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=220&fit=crop" },
  { id: "DN-012", name: "Trang trại hữu cơ Xuân Thành", taxCode: "3607778899", region: "Xuân Lộc", sector: "Nông sản", status: "Hoạt động", registeredAt: "08/11/2024", representative: "Phạm Văn Long", phone: "0912 345 678", businessCode: null, imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=220&fit=crop" },
  { id: "DN-013", name: "Cơ sở nuôi trồng Đông trùng Hạ thảo", taxCode: "3608881122", region: "Định Quán", sector: "Dược liệu", status: "Hoạt động", registeredAt: "17/04/2024", representative: "Vũ Hoàng Minh", phone: "0923 456 789", businessCode: "DNT-2024-0007", imageUrl: "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400&h=220&fit=crop" },
  { id: "DN-014", name: "HTX Thủy sản sạch Long Thành", taxCode: "3601113344", region: "Long Thành", sector: "Thủy sản", status: "Đã khóa", registeredAt: "03/03/2024", representative: "Đỗ Thị Nga", phone: "0934 567 890", businessCode: "DNT-2024-0008", imageUrl: "https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=400&h=220&fit=crop" },
  { id: "DN-015", name: "Công ty TNHH OCOP Nhơn Trạch", taxCode: "3604445678", region: "Nhơn Trạch", sector: "OCOP", status: "Hoạt động", registeredAt: "21/12/2024", representative: "Bùi Văn Oanh", phone: "0945 678 901", businessCode: null, imageUrl: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=400&h=220&fit=crop" },
];

const reviewStatuses: Status[] = ["Chờ duyệt", "Đã duyệt", "Yêu cầu bổ sung", "Đã bổ sung"];
const businessesWithReviewStatuses = initialBusinesses.map((business, index) => ({
  ...business,
  status: business.status === "Đã khóa" ? "Đã khóa" as Status : reviewStatuses[index % reviewStatuses.length],
}));

// ─── Constants ─────────────────────────────────────────────────────────────────
const STATUS_ALL = "Tất cả";
const statuses: Status[] = ["Đã duyệt", "Chờ duyệt", "Yêu cầu bổ sung", "Đã bổ sung", "Đã khóa"];
const regions = ["Tất cả địa bàn", "Biên Hòa", "Long Khánh", "Xuân Lộc", "Nhơn Trạch", "Long Thành", "Trảng Bom", "Định Quán", "Tân Phú", "Vĩnh Cửu", "Cao Lãnh"];
const sectors = ["Tất cả ngành", "Nông sản", "Thực phẩm CB", "Thủy sản", "OCOP", "Dược liệu", "Chăn nuôi"];
const PAGE_SIZE = 8;

const statusConfig: Record<Status, { cls: string; icon: typeof Check }> = {
  "Hoạt động": { cls: "bg-[#e8f5ed] text-[#1f7a45] border border-[#b8e2c8]", icon: Check },
  "Đã duyệt": { cls: "bg-[#e8f5ed] text-[#1f7a45] border border-[#b8e2c8]", icon: Check },
  "Chờ duyệt": { cls: "bg-[#fff8e8] text-[#a66b00] border border-[#f1d38c]", icon: Clock },
  "Yêu cầu bổ sung": { cls: "bg-[#fff4ed] text-[#C45A0A] border border-[#f4c49f]", icon: FileText },
  "Đã bổ sung": { cls: "bg-[#edf0ff] text-[#2740BA] border border-[#cbd5ff]", icon: FileText },
  "Đã khóa": { cls: "bg-[#f2f3f7] text-[#6b7694] border border-[#d9dce9]", icon: Lock },
};

// ─── Shared ─────────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Status }) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${cfg.cls}`}>
      <Icon className="h-2.5 w-2.5" strokeWidth={2.5} />
      {status}
    </span>
  );
}

function SelectFilter({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 appearance-none rounded-xl border border-[#e4e8f0] bg-[#f9fafb] pl-3 pr-8 text-[12px] font-medium text-[#25304b] outline-none transition focus:border-[#2740BA] focus:bg-white focus:ring-2 focus:ring-[#2740BA]/15"
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

// ─── QR Code modal ──────────────────────────────────────────────────────────────
function QrModal({ code, name, onClose }: { code: string; name: string; onClose: () => void }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`https://trace.dongnai.gov.vn/dn/${code}`)}&color=2740BA&bgcolor=ffffff&margin=10`;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-xs rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[14px] font-bold text-[#1d2944]">Mã QR định danh</p>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-[#f1f3fa]">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col items-center gap-3">
          <img src={qrUrl} alt={`QR ${code}`} className="h-52 w-52 rounded-xl border border-[#e4e8f0] bg-white" />
          <p className="font-mono text-[13px] font-bold text-[#2740BA]">{code}</p>
          <p className="text-[11px] text-slate-500 font-medium text-center">{name}</p>
          <p className="text-[10px] text-slate-400 text-center">Quét mã QR để xem thông tin truy xuất công khai</p>
        </div>
      </div>
    </div>
  );
}

// ─── Reset Password Modal ────────────────────────────────────────────────────────
function ResetPasswordModal({ business, onClose }: { business: Business; onClose: () => void }) {
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function generateRandom() {
    const DEFAULT_PASSWORD = "Aa@123456";
    setNewPwd(DEFAULT_PASSWORD);
    setConfirmPwd(DEFAULT_PASSWORD);
    setShowNew(true);
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPwd.length < 8) { setError("Mật khẩu tối thiểu 8 ký tự"); return; }
    if (newPwd !== confirmPwd) { setError("Mật khẩu xác nhận không khớp"); return; }
    setDone(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e4e8f0] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#fff4ed]">
              <KeyRound className="h-4 w-4 text-[#E8650A]" />
            </div>
            <p className="text-[14px] font-bold text-[#1d2944]">Đặt lại mật khẩu</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-[#f1f3fa]">
            <X className="h-4 w-4" />
          </button>
        </div>

        {done ? (
          <div className="px-6 py-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f5ed]">
              <Check className="h-7 w-7 text-[#1f7a45]" strokeWidth={2.5} />
            </div>
            <p className="text-[15px] font-bold text-[#1d2944]">Đặt lại thành công</p>
            <p className="mt-2 text-[12px] text-slate-500">
              Mật khẩu tài khoản doanh nghiệp <span className="font-semibold text-[#25304b]">{business.name}</span> đã được cập nhật.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-[#2740BA] py-3 text-[13px] font-bold text-white hover:bg-[#1e33a0] transition-colors"
            >
              Đóng
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div className="rounded-xl border border-[#e4e8f0] bg-[#f9fafb] px-4 py-3">
              <p className="text-[11px] text-slate-400">Tài khoản doanh nghiệp</p>
              <p className="mt-0.5 text-[13px] font-semibold text-[#25304b]">{business.name}</p>
              <p className="text-[11px] text-slate-400 font-mono">{business.id}</p>
            </div>

            {/* Generate random button */}
            <button
              type="button"
              onClick={generateRandom}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#c5cef9] bg-[#f0f3ff] py-2.5 text-[12px] font-semibold text-[#2740BA] hover:bg-[#e4e8ff] transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Đặt mật khẩu mặc định (Aa@123456)
            </button>

            {/* New password */}
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">
                Mật khẩu mới <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showNew ? "text" : "password"}
                  value={newPwd}
                  onChange={(e) => { setNewPwd(e.target.value); setError(""); }}
                  placeholder="Tối thiểu 8 ký tự"
                  className="h-11 w-full rounded-xl border border-[#e4e8f0] bg-[#f9fafb] pl-10 pr-10 text-[13px] outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPwd}
                  onChange={(e) => { setConfirmPwd(e.target.value); setError(""); }}
                  placeholder="Nhập lại mật khẩu"
                  className="h-11 w-full rounded-xl border border-[#e4e8f0] bg-[#f9fafb] pl-10 pr-10 text-[13px] outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-[11px] font-medium text-red-600">{error}</p>
            )}

            <div className="flex gap-3 border-t border-[#e4e8f0] pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-[#e4e8f0] py-3 text-[13px] font-semibold text-slate-600 hover:border-slate-400 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-[#E8650A] py-3 text-[13px] font-bold text-white hover:bg-[#d95c08] transition-colors shadow-[0_4px_14px_rgba(232,101,10,.2)]"
              >
                Đặt lại mật khẩu
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function ApprovalModal({
  business,
  approvalStatus,
  onClose,
  onApprove,
  onRequestDocuments,
}: {
  business: Business;
  approvalStatus: ApprovalStatus;
  onClose: () => void;
  onApprove: () => void;
  onRequestDocuments: () => void;
}) {
  const [completedAction, setCompletedAction] = useState<"Đã duyệt" | "Yêu cầu bổ sung" | null>(null);

  function finish(action: "Đã duyệt" | "Yêu cầu bổ sung") {
    if (action === "Đã duyệt") onApprove();
    else onRequestDocuments();
    setCompletedAction(action);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm">
      <div className="my-4 flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e4e8f0] px-5 py-4 sm:px-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#E8650A]">Xét duyệt hồ sơ</p>
            <h3 className="mt-1 text-[16px] font-bold text-[#1d2944]">{business.name}</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-[#f1f3fa]" aria-label="Đóng">
            <X className="h-4 w-4" />
          </button>
        </div>

        {completedAction ? (
          <div className="px-6 py-10 text-center">
            <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${completedAction === "Đã duyệt" ? "bg-[#e8f5ed]" : "bg-[#fff4ed]"}`}>
              {completedAction === "Đã duyệt" ? <Check className="h-7 w-7 text-[#1f7a45]" strokeWidth={2.5} /> : <FileText className="h-7 w-7 text-[#E8650A]" />}
            </div>
            <p className="text-[15px] font-bold text-[#1d2944]">
              {completedAction === "Đã duyệt" ? "Đã xác nhận duyệt" : "Đã yêu cầu bổ sung hồ sơ"}
            </p>
            <p className="mx-auto mt-2 max-w-md text-[12px] leading-5 text-slate-500">
              {completedAction === "Đã duyệt"
                ? `Hồ sơ của ${business.name} đã được duyệt trên danh sách doanh nghiệp.`
                : `Yêu cầu bổ sung hồ sơ đã được ghi nhận cho ${business.name}.`}
            </p>
            <button onClick={onClose} className="mt-6 w-full rounded-xl bg-[#2740BA] py-3 text-[13px] font-bold text-white hover:bg-[#1e33a0]">
              Đóng
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#e4e8f0] bg-[#f9fafb] p-3.5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Mã hồ sơ</p>
                  <p className="mt-1 font-mono text-[12px] font-bold text-[#2740BA]">{business.id}</p>
                </div>
                <StatusBadge status={business.status} />
              </div>

              <div>
                <p className="mb-3 text-[13px] font-bold text-[#1d2944]">Thông tin doanh nghiệp</p>
                <div className="grid grid-cols-1 gap-x-3 gap-y-3 rounded-xl border border-[#e4e8f0] p-4 text-[12px] sm:grid-cols-2">
                  {[
                    ["Tên doanh nghiệp / tổ chức", business.name],
                    ["Mã số thuế", business.taxCode],
                    ["Loại hình", "Doanh nghiệp"],
                    ["Ngành nghề", business.sector],
                    ["Địa chỉ", `${business.region}, Đồng Nai`],
                    ["Huyện / Thị xã", business.region],
                    ["Số điện thoại", business.phone],
                    ["Email", "lienhe@dntrace.vn"],
                    ["GCP", "—"],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="mb-1 text-[10px] font-semibold text-slate-500">{label}</p>
                      <div className="min-h-9 rounded-lg border border-[#dfe3ec] bg-white px-3 py-2 font-medium text-[#25304b]">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-[13px] font-bold text-[#1d2944]">Thông tin người đại diện</p>
                <div className="grid grid-cols-1 gap-x-3 gap-y-3 rounded-xl border border-[#e4e8f0] p-4 text-[12px] sm:grid-cols-2">
                  {[
                    ["Họ và tên người đại diện", business.representative],
                    ["Số điện thoại liên hệ", business.phone],
                    ["Email đăng nhập", "lienhe@dntrace.vn"],
                    ["CCCD / CMND", "Chưa cập nhật"],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="mb-1 text-[10px] font-semibold text-slate-500">{label}</p>
                      <div className="min-h-9 rounded-lg border border-[#dfe3ec] bg-white px-3 py-2 font-medium text-[#25304b]">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-[13px] font-bold text-[#1d2944]">Hồ sơ và hình ảnh</p>
                <div className="space-y-2">
                  {[
                    ["Giấy phép kinh doanh (bản scan)", "Kéo thả hoặc bấm để tải lên (PDF, JPG, PNG)"],
                    ["Giấy chứng nhận (nếu có)", "OCOP · Tải giấy chứng nhận (PDF, JPG, PNG)"],
                    ["Hình ảnh doanh nghiệp", "Tải lên hình ảnh trụ sở, nhà xưởng hoặc vùng sản xuất (JPG, PNG)"],
                    ["Giấy ủy quyền (nếu có)", "Tải lên giấy ủy quyền (PDF, JPG)"],
                  ].map(([label, hint]) => (
                    <div key={label}>
                      <p className="mb-1 text-[10px] font-semibold text-slate-500">{label}</p>
                      <div className="flex min-h-16 items-center justify-center gap-2 rounded-xl border border-dashed border-[#cfd5e1] bg-[#f9fafb] px-3 py-3 text-center text-[11px] text-slate-400">
                        <UploadCloud className="h-5 w-5 shrink-0 text-slate-300" />
                        <span>{hint}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[13px] font-bold text-[#1d2944]">Tài liệu đã tải lên</p>
                  <span className="text-[11px] text-slate-400">{business.businessCode ? "4 file" : "Chưa đủ hồ sơ"}</span>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {["Giấy đăng ký kinh doanh", "CMND/CCCD người đại diện", "Giấy chứng nhận ATTP", "Hồ sơ năng lực sản xuất"].map((document) => (
                    <div key={document} className="flex items-center gap-2.5 rounded-xl border border-[#e4e8f0] bg-[#f9fafb] p-3">
                      <FileText className="h-4 w-4 shrink-0 text-[#2740BA]" />
                      <span className="truncate text-[11px] font-medium text-[#25304b]">{document}</span>
                      <Eye className="ml-auto h-3.5 w-3.5 shrink-0 text-slate-300" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-[#e4e8f0] bg-[#f9fafb] p-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                onClick={() => finish("Yêu cầu bổ sung")}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#f4c49f] bg-white px-4 py-3 text-[12px] font-bold text-[#C45A0A] hover:bg-[#fff4ed]"
              >
                <FileText className="h-4 w-4" /> Yêu cầu bổ sung hồ sơ
              </button>
              <button
                onClick={() => finish("Đã duyệt")}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#1f7a45] px-5 py-3 text-[12px] font-bold text-white hover:bg-[#176238]"
              >
                <Check className="h-4 w-4" /> Xác nhận
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Business Detail screen ─────────────────────────────────────────────────────
function BusinessDetail({
  business,
  onBack,
  onUpdate,
}: {
  business: Business;
  onBack: () => void;
  onUpdate: (id: string, updates: Partial<Business>) => void;
}) {
  const [qrOpen, setQrOpen] = useState(false);
  const [resetPwdOpen, setResetPwdOpen] = useState(false);
  const [approvalOpen, setApprovalOpen] = useState(false);

  

  return (
    <>
      {qrOpen && business.businessCode && (
        <QrModal
          code={business.businessCode}
          name={business.name}
          onClose={() => setQrOpen(false)}
        />
      )}
      {resetPwdOpen && (
        <ResetPasswordModal business={business} onClose={() => setResetPwdOpen(false)} />
      )}
      {approvalOpen && (
        <ApprovalModal
          business={business}
          approvalStatus={business.status === "Đã bổ sung" ? "Đã bổ sung" : "Chờ duyệt"}
          onClose={() => setApprovalOpen(false)}
          onApprove={() => onUpdate(business.id, { status: "Đã duyệt" })}
          onRequestDocuments={() => onUpdate(business.id, { status: "Yêu cầu bổ sung" })}
        />
      )}

      <DashboardShell title="Chi tiết doanh nghiệp" subtitle={business.name}>
        {/* Back */}
        <button
          onClick={onBack}
          className="mb-5 flex items-center gap-1.5 text-[12px] font-medium text-slate-500 transition-colors hover:text-[#2740BA]"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại danh sách doanh nghiệp
        </button>

        {/* Page header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#E8650A]">Hồ sơ doanh nghiệp</p>
            <h2 className="mt-1 text-[20px] font-bold tracking-[-0.04em] text-[#1d2944]">{business.name}</h2>
          </div>
          <StatusBadge status={business.status} />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_380px]">
          {/* ── LEFT ──────────────────────────────────────────────────── */}
          <div className="space-y-5">
            {/* Cover image */}
            <div className="overflow-hidden rounded-2xl border border-[#e4e8f0] shadow-[0_2px_12px_rgba(38,55,105,.04)]">
              <img
                src={business.imageUrl}
                alt={business.name}
                className="h-48 w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>

            {/* Business info */}
            <div className="rounded-2xl border border-[#e4e8f0] bg-white p-6 shadow-[0_2px_12px_rgba(38,55,105,.04)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#edf0ff]">
                  <Building2 className="h-5 w-5 text-[#2740BA]" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#1d2944]">{business.name}</p>
                  <p className="text-[11px] text-slate-400">MST: {business.taxCode}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-[12px] sm:grid-cols-3">
                {[
                  ["Địa bàn", business.region],
                  ["Ngành hàng", business.sector],
                  ["Ngày đăng ký", business.registeredAt],
                  ["Loại hình", "TNHH / HTX"],
                  ["Số lượng sản phẩm", "12"],
                  ["Người đại diện", business.representative],
                  ["SĐT liên hệ", business.phone],
                  ["Email", "lienhe@dntrace.vn"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{k}</p>
                    <p className="mt-1 font-medium text-[#25304b]">{v}</p>
                  </div>
                ))}
              </div>

              {/* Issued code (if approved) */}
              {business.status === "Đã duyệt" && business.businessCode && (
                <div className="mt-5 rounded-xl border border-[#b8e2c8] bg-[#e8f5ed] p-3.5">
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#1f7a45]">Mã định danh tổ chức</p>
                  <div className="flex items-center gap-2">
                    <QrCode className="h-3.5 w-3.5 text-[#1f7a45]" />
                    <span className="font-mono text-[13px] font-bold tracking-wider text-[#1f7a45]">
                      {business.businessCode}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Documents */}
            <div className="rounded-2xl border border-[#e4e8f0] bg-white p-6 shadow-[0_2px_12px_rgba(38,55,105,.04)]">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[13px] font-bold text-[#1d2944]">Tài liệu đính kèm</p>
                <span className="rounded-full bg-[#edf0ff] px-2 py-0.5 text-[10px] font-bold text-[#2740BA]">4 file</span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { name: "Giấy đăng ký kinh doanh", size: "1.2 MB", type: "PDF", color: "#E8650A" },
                  { name: "CMND/CCCD người đại diện", size: "0.8 MB", type: "JPG", color: "#2740BA" },
                  { name: "Giấy chứng nhận ATTP", size: "2.1 MB", type: "PDF", color: "#E8650A" },
                  { name: "Hồ sơ năng lực sản xuất", size: "3.4 MB", type: "PDF", color: "#E8650A" },
                ].map((doc) => (
                  <div
                    key={doc.name}
                    className="group flex cursor-pointer items-center gap-3 rounded-xl border border-[#e4e8f0] bg-[#f9fafb] p-3.5 transition-all hover:border-[#2740BA] hover:bg-[#f0f3ff] hover:shadow-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white text-[9px] font-bold" style={{ background: doc.color }}>
                      {doc.type}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-semibold text-[#25304b]">{doc.name}</p>
                      <p className="mt-0.5 text-[10px] text-slate-400">{doc.type} · {doc.size}</p>
                    </div>
                    <Eye className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-colors group-hover:text-[#2740BA]" />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex h-36 items-center justify-center rounded-xl border-2 border-dashed border-[#e4e8f0] bg-[#f9fafb] text-slate-400">
                <div className="text-center">
                  <FileText className="mx-auto h-7 w-7 opacity-40" />
                  <p className="mt-2 text-[11px]">Nhấp vào tài liệu để xem trước</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT ────────────────────────────────────────────────── */}
          <div className="space-y-5">
            {/* Status + Actions card */}
            <div className="rounded-2xl border border-[#e4e8f0] bg-white p-6 shadow-[0_2px_12px_rgba(38,55,105,.04)]">
              <p className="mb-4 text-[13px] font-bold text-[#1d2944]">Trạng thái & Thao tác</p>

              <div className="mb-4">
                <StatusBadge status={business.status} />
              </div>

              {/* QR code button (approved only) */}
              {business.status === "Đã duyệt" && business.businessCode && (
                <button
                  onClick={() => setQrOpen(true)}
                  className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#dce3ff] bg-[#f0f2ff] py-3 text-[12px] font-semibold text-[#2740BA] transition hover:bg-[#e4e8ff]"
                >
                  <QrCode className="h-4 w-4" /> Xem mã QR định danh
                </button>
              )}

              {/* Contact info */}
              <div className="mb-4 space-y-2 rounded-xl border border-[#e4e8f0] bg-[#f9fafb] p-3.5">
                <div className="flex items-center gap-2 text-[12px] text-slate-500">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-[#2740BA]" />
                  <span>{business.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-slate-500">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#E8650A]" />
                  <span>{business.region}, Đồng Nai</span>
                </div>
              </div>

              {/* Edit / Delete actions */}
              <div className="grid grid-cols-2 gap-3">
                {(business.status === "Chờ duyệt" || business.status === "Đã bổ sung") && (
                  <button
                    onClick={() => setApprovalOpen(true)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#1f7a45] py-3 text-[12px] font-bold text-white transition hover:bg-[#176238]"
                  >
                    <Check className="h-3.5 w-3.5" /> Duyệt
                  </button>
                )}
                <button className="flex items-center justify-center gap-2 rounded-xl border border-[#e4e8f0] bg-white py-3 text-[12px] font-semibold text-slate-600 transition hover:border-[#2740BA] hover:text-[#2740BA]">
                  <Pencil className="h-3.5 w-3.5" /> Chỉnh sửa
                </button>
                <button
                  onClick={() => onUpdate(business.id, { status: business.status === "Đã khóa" ? "Đã duyệt" : "Đã khóa" })}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[#e4e8f0] bg-white py-3 text-[12px] font-semibold text-slate-600 transition hover:border-[#E8650A] hover:text-[#E8650A]"
                >
                  {business.status === "Đã khóa" ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                  {business.status === "Đã khóa" ? "Mở khóa" : "Khóa"}
                </button>
              </div>

              {/* Reset password */}
              <button
                onClick={() => setResetPwdOpen(true)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#e4e8f0] bg-white py-3 text-[12px] font-semibold text-slate-600 transition hover:border-[#E8650A] hover:bg-[#fff8f5] hover:text-[#E8650A]"
              >
                <KeyRound className="h-3.5 w-3.5" /> Đặt lại mật khẩu
              </button>
            </div>

     
          </div>
        </div>
      </DashboardShell>
    </>
  );
}

// ─── Business list ──────────────────────────────────────────────────────────────
export default function Businesses() {
  const [businesses, setBusinesses] = useState<Business[]>(businessesWithReviewStatuses);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(STATUS_ALL);
  const [regionFilter, setRegionFilter] = useState("Tất cả địa bàn");
  const [sectorFilter, setSectorFilter] = useState("Tất cả ngành");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("registeredAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [viewing, setViewing] = useState<Business | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [resetPwdBusiness, setResetPwdBusiness] = useState<Business | null>(null);
  const [approvalBusiness, setApprovalBusiness] = useState<Business | null>(null);
  const [approvalStatuses, setApprovalStatuses] = useState<Record<string, ApprovalStatus>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const viewingBusiness = viewing ? (businesses.find((b) => b.id === viewing.id) ?? viewing) : null;

  const filtered = useMemo(() => {
    let list = businesses.filter((b) => {
      const q = search.toLowerCase();
      return (
        (b.name.toLowerCase().includes(q) || b.taxCode.includes(q) || b.id.toLowerCase().includes(q)) &&
        (statusFilter === STATUS_ALL || b.status === statusFilter) &&
        (regionFilter === "Tất cả địa bàn" || b.region === regionFilter) &&
        (sectorFilter === "Tất cả ngành" || b.sector === sectorFilter)
      );
    });

    if (sortKey && sortDir) {
      list = [...list].sort((a, b) => {
        const av = a[sortKey] ?? "";
        const bv = b[sortKey] ?? "";
        return sortDir === "asc"
          ? String(av).localeCompare(String(bv), "vi")
          : String(bv).localeCompare(String(av), "vi");
      });
    }

    return list;
  }, [businesses, search, statusFilter, regionFilter, sectorFilter, sortKey, sortDir]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { "Tất cả": businesses.length };
    statuses.forEach((s) => { counts[s] = businesses.filter((b) => b.status === s).length; });
    return counts;
  }, [businesses]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageIds = paginated.map((b) => b.id);
  const allPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.includes(id));

  function handleUpdate(id: string, updates: Partial<Business>) {
    setBusinesses((prev) => prev.map((b) => b.id === id ? { ...b, ...updates } : b));
  }

  function handleApproval(id: string, status: ApprovalStatus) {
    setApprovalStatuses((prev) => ({ ...prev, [id]: status }));
    if (status === "Đã duyệt" || status === "Đã bổ sung") handleUpdate(id, { status });
  }

  function handleDelete(id: string) {
    setBusinesses((prev) => prev.filter((b) => b.id !== id));
    if (viewing?.id === id) setViewing(null);
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      const next = sortDir === "asc" ? "desc" : sortDir === "desc" ? null : "asc";
      setSortDir(next);
      if (next === null) setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  function toggleSelect(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  function toggleAll() {
    const ids = paginated.map((b) => b.id);
    const allSel = ids.every((id) => selected.includes(id));
    setSelected((prev) =>
      allSel ? prev.filter((id) => !ids.includes(id)) : [...new Set([...prev, ...ids])]
    );
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ArrowUpDown className="ml-1 inline h-3 w-3 text-slate-300" />;
    if (sortDir === "asc") return <ChevronUp className="ml-1 inline h-3 w-3 text-[#2740BA]" />;
    if (sortDir === "desc") return <ChevronDown className="ml-1 inline h-3 w-3 text-[#2740BA]" />;
    return <ArrowUpDown className="ml-1 inline h-3 w-3 text-slate-300" />;
  }

  if (viewingBusiness) {
    return (
      <BusinessDetail
        business={viewingBusiness}
        onBack={() => setViewing(null)}
        onUpdate={handleUpdate}
      />
    );
  }

  return (
    <DashboardShell title="Quản lý doanh nghiệp" subtitle="Danh sách doanh nghiệp">
      {approvalBusiness && (
        <ApprovalModal
          business={approvalBusiness}
          approvalStatus={approvalStatuses[approvalBusiness.id] ?? (approvalBusiness.status === "Đã bổ sung" ? "Đã bổ sung" : "Chờ duyệt")}
          onClose={() => setApprovalBusiness(null)}
          onApprove={() => handleApproval(approvalBusiness.id, "Đã duyệt")}
          onRequestDocuments={() => handleApproval(approvalBusiness.id, "Yêu cầu bổ sung")}
        />
      )}
      {resetPwdBusiness && (
        <ResetPasswordModal business={resetPwdBusiness} onClose={() => setResetPwdBusiness(null)} />
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-semibold text-slate-800">
              Xác nhận xóa
            </h3>

            <p className="mb-6 text-slate-600">
              Bạn có chắc chắn muốn xóa doanh nghiệp này không?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteId(null);
                }}
                className="rounded-lg border border-slate-300 px-4 py-2"
              >
                Hủy
              </button>

              <button
                onClick={() => {
                  if (deleteId) {
                    handleDelete(deleteId);
                  }
                  setShowDeleteModal(false);
                  setDeleteId(null);
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Page header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#E8650A]">Quản lý</p>
          <h2 className="mt-1.5 text-[24px] font-bold tracking-[-0.05em] text-[#1d2944]">Doanh nghiệp</h2>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 rounded-xl border border-[#e4e8f0] bg-white px-3.5 py-2.5 text-[12px] font-semibold text-slate-600 transition-colors hover:border-[#2740BA] hover:text-[#2740BA]">
            <FileDown className="h-4 w-4" /> Xuất Excel
          </button>
        </div>
      </div>

      {/* Status tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {[STATUS_ALL, ...statuses].map((s) => {
          const active = statusFilter === s;
          return (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[12px] font-semibold transition-colors ${active ? "bg-[#2740BA] text-white shadow-[0_3px_10px_rgba(39,64,186,.2)]" : "border border-[#e4e8f0] bg-white text-slate-500 hover:border-[#2740BA] hover:text-[#2740BA]"}`}
            >
              {s}
              <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${active ? "bg-white/20 text-white" : "bg-[#f0f2f8] text-slate-500"}`}>
                {statusCounts[s] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bulk action bar */}
      {selected.length > 0 && (
        <div className="mb-3 flex items-center gap-3 rounded-xl border border-[#dce3ff] bg-[#edf0ff] px-4 py-2.5">
          <span className="text-[12px] font-bold text-[#2740BA]">Đã chọn {selected.length} doanh nghiệp</span>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-[#e4e8f0] bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-colors hover:border-[#c0392b] hover:text-[#c0392b]">
              <Lock className="h-3 w-3" /> Khóa tài khoản
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-[#e4e8f0] bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-colors hover:border-[#1f7a45] hover:text-[#1f7a45]">
              <Unlock className="h-3 w-3" /> Mở khóa
            </button>
          </div>
          <button onClick={() => setSelected([])} className="ml-auto text-[11px] text-slate-400 hover:text-slate-600">
            Bỏ chọn tất cả
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#e4e8f0] bg-white px-4 py-3 shadow-[0_2px_12px_rgba(38,55,105,.04)]">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Tìm tên, mã số thuế, mã DN..."
            className="h-9 w-full rounded-xl border border-[#e4e8f0] bg-[#f9fafb] pl-9 pr-4 text-[12px] text-[#25304b] outline-none transition focus:border-[#2740BA] focus:bg-white focus:ring-2 focus:ring-[#2740BA]/15"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
          <SelectFilter value={regionFilter} onChange={(v) => { setRegionFilter(v); setPage(1); }} options={regions} />
          <SelectFilter value={sectorFilter} onChange={(v) => { setSectorFilter(v); setPage(1); }} options={sectors} />
        </div>
        <div className="ml-auto flex overflow-hidden rounded-lg border border-[#e4e8f0]">
          {(["list", "grid"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className={`flex h-8 w-8 items-center justify-center transition-colors ${viewMode === m ? "bg-[#2740BA] text-white" : "bg-white text-slate-400 hover:text-[#2740BA]"}`}
            >
              {m === "list" ? <List className="h-3.5 w-3.5" /> : <LayoutGrid className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="mt-3 text-[11px] text-slate-400">
        Hiển thị {filtered.length} doanh nghiệp
      </p>

      {/* Grid view */}
      {viewMode === "grid" && (
        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {paginated.length === 0 ? (
            <div className="col-span-full py-16 text-center text-[12px] text-slate-400">
              Không tìm thấy doanh nghiệp nào phù hợp bộ lọc.
            </div>
          ) : paginated.map((b) => (
            <div
              key={b.id}
              className="group relative flex flex-col gap-0 rounded-2xl border border-[#e4e8f0] bg-white shadow-[0_2px_12px_rgba(38,55,105,.04)] transition-shadow hover:shadow-[0_6px_20px_rgba(38,55,105,.1)] overflow-hidden"
            >
              <div className="relative h-36 overflow-hidden bg-[#f7f8fd]">
                <img
                  src={b.imageUrl}
                  alt={b.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).src = ""; }}
                />
                <div className="absolute top-2 right-2">
                  <StatusBadge status={b.status} />
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="font-semibold leading-snug text-[#1d2944]">{b.name}</p>
                <p className="font-mono text-[10px] text-slate-400">{b.id} · MST: {b.taxCode}</p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                  <div><span className="text-slate-400">Địa bàn: </span><span className="font-medium text-[#25304b]">{b.region}</span></div>
                  <div><span className="text-slate-400">Ngành: </span><span className="font-medium text-[#25304b]">{b.sector}</span></div>
                </div>
                {b.businessCode && (
                  <div className="flex items-center gap-1">
                    <QrCode className="h-3 w-3 text-[#2740BA]" />
                    <span className="font-mono text-[10px] font-semibold text-[#2740BA]">{b.businessCode}</span>
                  </div>
                )}
                <div className="mt-auto flex items-center gap-1 border-t border-[#f0f2f8] pt-3">
                   {(b.status === "Chờ duyệt" || b.status === "Đã bổ sung") && (
                     <button
                       onClick={() => setApprovalBusiness(b)}
                       className="flex items-center gap-1 rounded-lg bg-[#e8f5ed] px-2 py-1.5 text-[10px] font-bold text-[#1f7a45] transition-colors hover:bg-[#d5eddd]"
                       title="Duyệt doanh nghiệp"
                     >
                       <Check className="h-3.5 w-3.5" /> Duyệt
                     </button>
                   )}
                  <button
                    onClick={() => setViewing(b)}
                    className="ml-auto rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-[#edf0ff] hover:text-[#2740BA]"
                    title="Xem chi tiết"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-[#fff4ed] hover:text-[#E8650A]" title="Chỉnh sửa">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setResetPwdBusiness(b)}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-[#fff8f5] hover:text-[#E8650A]"
                    title="Đặt lại mật khẩu"
                  >
                    <KeyRound className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteId(b.id);
                      setShowDeleteModal(true);
                    }}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-[#fef0f0] hover:text-[#c0392b]"
                    title="Xóa"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      {viewMode === "list" && (
      <div className="mt-2 overflow-x-auto rounded-2xl border border-[#e4e8f0] bg-white shadow-[0_2px_12px_rgba(38,55,105,.04)]">
        <div>
          <table className="min-w-full text-[12px]">
            <thead>
              <tr className="border-b border-[#e4e8f0] bg-[#f7f8fd]">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    onChange={toggleAll}
                    className="rounded border-slate-300 accent-[#2740BA]"
                  />
                </th>
                {([
                  { label: "Tên doanh nghiệp", key: "name" as SortKey },
                  { label: "Mã số thuế", key: "taxCode" as SortKey },
                  { label: "Địa bàn", key: "region" as SortKey },
                  { label: "Ngành hàng", key: "sector" as SortKey },
                  { label: "Mã định danh", key: null },
 
                  { label: "Ngày đăng ký", key: "registeredAt" as SortKey },
                  {label: "Trạng thái",key: "status" as SortKey},
                  { label: "Thao tác", key: null },
                ] as { label: string; key: SortKey }[]).map(({ label, key }) => (
                  <th
                    key={label}
                    onClick={key ? () => handleSort(key) : undefined}
                    className={`whitespace-nowrap px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400 ${key ? "cursor-pointer select-none hover:text-[#2740BA]" : ""}`}
                  >
                    {label}
                    {key && <SortIcon col={key} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f2f8]">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-[12px] text-slate-400">
                    Không tìm thấy doanh nghiệp nào phù hợp bộ lọc.
                  </td>
                </tr>
              ) : paginated.map((b) => (
                <tr
                  key={b.id}
                  className={`transition-colors hover:bg-[#f7f8fd] ${selected.includes(b.id) ? "bg-[#f0f3ff]" : ""}`}
                >
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={selected.includes(b.id)}
                      onChange={() => toggleSelect(b.id)}
                      className="rounded border-slate-300 accent-[#2740BA]"
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={b.imageUrl}
                        alt={b.name}
                        className="h-9 w-9 rounded-lg object-cover border border-[#e4e8f0]"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      <div>
                        <p className="font-semibold text-[#25304b]">{b.name}</p>
                        <p className="mt-0.5 font-mono text-[10px] text-slate-400">{b.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 font-mono text-slate-500">{b.taxCode}</td>
                  <td className="px-4 py-3.5 text-slate-500">{b.region}</td>
                  <td className="px-4 py-3.5 text-slate-500">{b.sector}</td>
                  <td className="whitespace-nowrap px-4 py-3.5">
                    {b.businessCode ? (
                      <span className="font-mono text-[11px] font-semibold text-[#2740BA]">
                        {b.businessCode}
                      </span>
                    ) : (
                      <span className="text-slate-300 select-none">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-slate-500">{b.registeredAt}</td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-slate-500">{b.status}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setViewing(b)}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-[#edf0ff] hover:text-[#2740BA]"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      {(b.status === "Chờ duyệt" || b.status === "Đã bổ sung") && (
                        <button
                          onClick={() => setApprovalBusiness(b)}
                          className="flex items-center gap-1 rounded-lg bg-[#e8f5ed] px-2 py-1.5 text-[10px] font-bold text-[#1f7a45] transition-colors hover:bg-[#d5eddd]"
                          title="Duyệt doanh nghiệp"
                        >
                          <Check className="h-3.5 w-3.5" /> Duyệt
                        </button>
                      )}
                      <button
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-[#fff4ed] hover:text-[#E8650A]"
                        title="Chỉnh sửa"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setResetPwdBusiness(b)}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-[#fff8f5] hover:text-[#E8650A]"
                        title="Đặt lại mật khẩu"
                      >
                        <KeyRound className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleUpdate(b.id, { status: b.status === "Đã khóa" ? "Đã duyệt" : "Đã khóa" })}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-[#f0f2f8] hover:text-slate-600"
                        title={b.status === "Đã khóa" ? "Mở khóa" : "Khóa"}
                      >
                        {b.status === "Đã khóa" ? <Unlock className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(b.id);
                          setShowDeleteModal(true);
                        }}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-[#fef0f0] hover:text-[#c0392b]"
                        title="Xóa"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#f0f2f8] px-5 py-3">
          <p className="text-[11px] text-slate-400">
            {filtered.length > 0
              ? `Hiển thị ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} trong tổng số ${filtered.length} doanh nghiệp`
              : "Không có kết quả"}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e4e8f0] text-slate-400 transition-colors hover:border-[#2740BA] hover:text-[#2740BA] disabled:opacity-40 disabled:hover:border-[#e4e8f0] disabled:hover:text-slate-400"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-[12px] font-semibold transition-colors ${page === p ? "bg-[#2740BA] text-white shadow-[0_2px_8px_rgba(39,64,186,.22)]" : "border border-[#e4e8f0] text-slate-500 hover:border-[#2740BA] hover:text-[#2740BA]"}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e4e8f0] text-slate-400 transition-colors hover:border-[#2740BA] hover:text-[#2740BA] disabled:opacity-40 disabled:hover:border-[#e4e8f0] disabled:hover:text-slate-400"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      )}
    </DashboardShell>
  );
}
