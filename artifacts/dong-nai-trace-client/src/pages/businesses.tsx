import { useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  Search,
  Plus,
  FileDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Lock,
  Unlock,
  Check,
  X,
  Clock,
  Building2,
  FileText,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from "lucide-react";

type Status = "Đã duyệt" | "Chờ duyệt" | "Từ chối" | "Đã khóa";

interface Business {
  id: string;
  name: string;
  taxCode: string;
  region: string;
  sector: string;
  status: Status;
  registeredAt: string;
}

const mockBusinesses: Business[] = [
  { id: "DN-001", name: "Công ty TNHH Nông sản An Phú", taxCode: "3601234567", region: "Biên Hòa", sector: "Nông sản", status: "Đã duyệt", registeredAt: "12/10/2024" },
  { id: "DN-002", name: "HTX Nông nghiệp Xuân Lộc", taxCode: "3607654321", region: "Xuân Lộc", sector: "OCOP", status: "Chờ duyệt", registeredAt: "18/12/2024" },
  { id: "DN-003", name: "Công ty CP Thực phẩm Đồng Nai", taxCode: "3601112233", region: "Long Khánh", sector: "Thực phẩm CB", status: "Đã duyệt", registeredAt: "05/09/2024" },
  { id: "DN-004", name: "Trại nuôi thủy sản Nhơn Trạch", taxCode: "3608889900", region: "Nhơn Trạch", sector: "Thủy sản", status: "Từ chối", registeredAt: "22/11/2024" },
  { id: "DN-005", name: "Trang trại hữu cơ Long Thành", taxCode: "3605556677", region: "Long Thành", sector: "Nông sản", status: "Đã khóa", registeredAt: "01/08/2024" },
  { id: "DN-006", name: "Cơ sở chế biến Bưởi Tân Triều", taxCode: "3602223344", region: "Vĩnh Cửu", sector: "OCOP", status: "Chờ duyệt", registeredAt: "15/12/2024" },
  { id: "DN-007", name: "Công ty TNHH Dược liệu Định Quán", taxCode: "3609990011", region: "Định Quán", sector: "Dược liệu", status: "Đã duyệt", registeredAt: "30/07/2024" },
  { id: "DN-008", name: "HTX Chăn nuôi Tân Phú", taxCode: "3604445566", region: "Tân Phú", sector: "Chăn nuôi", status: "Chờ duyệt", registeredAt: "19/12/2024" },
];

const statusConfig: Record<Status, { label: string; cls: string }> = {
  "Đã duyệt": { label: "Đã duyệt", cls: "bg-[#e8f5ed] text-[#1f7a45] border border-[#b8e2c8]" },
  "Chờ duyệt": { label: "Chờ duyệt", cls: "bg-[#fff4ed] text-[#E8650A] border border-[#fcd9bb]" },
  "Từ chối": { label: "Từ chối", cls: "bg-[#fef0f0] text-[#c0392b] border border-[#f5bcbc]" },
  "Đã khóa": { label: "Đã khóa", cls: "bg-[#f2f3f7] text-[#6b7694] border border-[#d9dce9]" },
};

function StatusBadge({ status }: { status: Status }) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold ${cfg.cls}`}>
      {status === "Đã duyệt" && <Check className="h-2.5 w-2.5" />}
      {status === "Chờ duyệt" && <Clock className="h-2.5 w-2.5" />}
      {status === "Từ chối" && <X className="h-2.5 w-2.5" />}
      {status === "Đã khóa" && <Lock className="h-2.5 w-2.5" />}
      {cfg.label}
    </span>
  );
}

const timeline = [
  { action: "Hồ sơ tiếp nhận", actor: "Hệ thống", time: "18/12/2024 08:30", color: "#2740BA" },
  { action: "Chuyển cho nhân viên xét duyệt", actor: "Admin", time: "18/12/2024 09:00", color: "#4f9a77" },
  { action: "Đang chờ quyết định", actor: "Nguyễn Minh Anh", time: "18/12/2024 10:45", color: "#E8650A" },
];

function ApprovalDetail({ business, onBack }: { business: Business; onBack: () => void }) {
  const [comment, setComment] = useState("");
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(null);

  return (
    <DashboardShell title="Phê duyệt hồ sơ" subtitle={business.name}>
      <button
        onClick={onBack}
        className="mb-5 flex items-center gap-1.5 text-[12px] font-medium text-slate-500 hover:text-[#2740BA] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
      </button>

      {decision && (
        <div className={`mb-5 flex items-center gap-3 rounded-xl p-4 ${decision === "approved" ? "bg-[#e8f5ed] text-[#1f7a45]" : "bg-[#fef0f0] text-[#c0392b]"}`}>
          {decision === "approved" ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
          <p className="text-[13px] font-semibold">
            {decision === "approved" ? "Hồ sơ đã được phê duyệt thành công." : "Hồ sơ đã bị từ chối."}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_380px]">
        {/* Left: Business info */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#e4e8f0] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf0ff]">
                <Building2 className="h-5 w-5 text-[#2740BA]" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#1d2944]">{business.name}</p>
                <p className="text-[11px] text-slate-400">MST: {business.taxCode}</p>
              </div>
              <StatusBadge status={business.status} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-[12px]">
              {[
                ["Địa bàn", business.region],
                ["Ngành hàng", business.sector],
                ["Ngày đăng ký", business.registeredAt],
                ["Mã doanh nghiệp", business.id],
                ["Loại hình", "TNHH / HTX"],
                ["Quy mô", "Vừa và nhỏ"],
                ["Người đại diện", "Trần Văn Bình"],
                ["SĐT liên hệ", "0901 234 567"],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">{k}</p>
                  <p className="mt-0.5 font-medium text-[#25304b]">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="rounded-2xl border border-[#e4e8f0] bg-white p-6 shadow-sm">
            <p className="mb-4 text-[13px] font-bold text-[#1d2944]">Tài liệu đính kèm</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                "Giấy đăng ký kinh doanh",
                "CMND/CCCD người đại diện",
                "Giấy chứng nhận ATTP",
                "Hồ sơ năng lực sản xuất",
              ].map((doc) => (
                <div
                  key={doc}
                  className="flex items-center gap-3 rounded-xl border border-[#e4e8f0] bg-[#f9fafb] p-3 hover:border-[#2740BA] hover:bg-[#f0f3ff] transition-colors cursor-pointer"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#dce3ff]">
                    <FileText className="h-4 w-4 text-[#2740BA]" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-medium text-[#25304b]">{doc}</p>
                    <p className="text-[10px] text-slate-400">PDF · 1.2 MB</p>
                  </div>
                  <Eye className="ml-auto h-3.5 w-3.5 shrink-0 text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Action area */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#e4e8f0] bg-white p-6 shadow-sm">
            <p className="mb-4 text-[13px] font-bold text-[#1d2944]">Quyết định xét duyệt</p>
            <label className="mb-1 block text-[11px] font-medium text-slate-600">
              Nhận xét / Lý do
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
              placeholder="Nhập nhận xét hoặc lý do từ chối..."
              className="w-full resize-none rounded-xl border border-[#e4e8f0] bg-[#f9fafb] p-3 text-[12px] outline-none transition focus:border-[#2740BA] focus:bg-white focus:ring-2 focus:ring-[#2740BA]/15"
            />
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setDecision("approved")}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2740BA] py-3 text-[13px] font-bold text-white hover:bg-[#1e33a0] transition-colors"
              >
                <CheckCircle className="h-4 w-4" /> Phê duyệt
              </button>
              <button
                onClick={() => setDecision("rejected")}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#e04040] bg-white py-3 text-[13px] font-bold text-[#c0392b] hover:bg-[#fef0f0] transition-colors"
              >
                <XCircle className="h-4 w-4" /> Từ chối
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-2xl border border-[#e4e8f0] bg-white p-6 shadow-sm">
            <p className="mb-4 text-[13px] font-bold text-[#1d2944]">Lịch sử xử lý</p>
            <div className="space-y-4">
              {timeline.map((item, i) => (
                <div key={i} className="relative flex gap-3 pl-5">
                  <span
                    className="absolute left-0 top-1 h-3 w-3 rounded-full border-2 border-white ring-2"
                    style={{ background: item.color, ringColor: item.color }}
                  />
                  {i < timeline.length - 1 && (
                    <span className="absolute left-[5px] top-4 h-full w-px bg-[#e4e8f0]" />
                  )}
                  <div>
                    <p className="text-[11px] font-semibold text-[#25304b]">{item.action}</p>
                    <p className="text-[10px] text-slate-400">
                      {item.actor} · {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

export default function Businesses() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [approving, setApproving] = useState<Business | null>(null);

  if (approving) {
    return <ApprovalDetail business={approving} onBack={() => setApproving(null)} />;
  }

  const filtered = mockBusinesses.filter((b) => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.taxCode.includes(search);
    const matchStatus = statusFilter === "Tất cả" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    setSelected((prev) => (prev.length === filtered.length ? [] : filtered.map((b) => b.id)));
  };

  return (
    <DashboardShell title="Quản lý doanh nghiệp" subtitle="Danh sách và phê duyệt hồ sơ">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#E8650A]">
            Quản lý
          </p>
          <h2 className="mt-1.5 text-[24px] font-bold tracking-[-.05em] text-[#1d2944]">
            Doanh nghiệp
          </h2>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 rounded-xl border border-[#e4e8f0] bg-white px-3.5 py-2.5 text-[12px] font-semibold text-slate-600 hover:border-[#2740BA] hover:text-[#2740BA] transition-colors">
            <FileDown className="h-4 w-4" /> Xuất Excel
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-[#E8650A] px-4 py-2.5 text-[12px] font-bold text-white hover:bg-[#d95c08] transition-colors shadow-[0_4px_14px_rgba(232,101,10,.2)]">
            <Plus className="h-4 w-4" /> Thêm doanh nghiệp
          </button>
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.length > 0 && (
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-[#edf0ff] px-4 py-2.5">
          <span className="text-[12px] font-semibold text-[#2740BA]">Đã chọn {selected.length} dòng</span>
          <button className="flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-[#2740BA] border border-[#e4e8f0] transition-colors">
            <Lock className="h-3 w-3" /> Khóa
          </button>
          <button className="flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:text-[#4f9a77] border border-[#e4e8f0] transition-colors">
            <Unlock className="h-3 w-3" /> Mở khóa
          </button>
          <button onClick={() => setSelected([])} className="ml-auto text-[11px] text-slate-400 hover:text-slate-600">
            Bỏ chọn
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#e4e8f0] bg-white p-4 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm tên doanh nghiệp, mã số thuế..."
            className="h-9 w-full rounded-xl border border-[#e4e8f0] bg-[#f9fafb] pl-9 pr-4 text-[12px] outline-none focus:border-[#2740BA] focus:bg-white focus:ring-2 focus:ring-[#2740BA]/15"
          />
        </div>
        {["Tất cả", "Đã duyệt", "Chờ duyệt", "Từ chối", "Đã khóa"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors ${
              statusFilter === s
                ? "bg-[#2740BA] text-white"
                : "border border-[#e4e8f0] bg-white text-slate-500 hover:border-[#2740BA] hover:text-[#2740BA]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-[#e4e8f0] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-[12px]">
            <thead>
              <tr className="border-b border-[#e4e8f0] bg-[#f9fafb]">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selected.length === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="rounded border-slate-300 text-[#2740BA]"
                  />
                </th>
                {["Tên doanh nghiệp", "Mã số thuế", "Địa bàn", "Ngành hàng", "Trạng thái", "Ngày đăng ký", "Thao tác"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr
                  key={b.id}
                  className={`border-b border-[#f0f2f8] transition-colors hover:bg-[#f9fafb] ${selected.includes(b.id) ? "bg-[#f5f7ff]" : ""}`}
                >
                  <td className="px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={selected.includes(b.id)}
                      onChange={() => toggleSelect(b.id)}
                      className="rounded border-slate-300 text-[#2740BA]"
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-[#25304b]">{b.name}</p>
                    <p className="text-[10px] text-slate-400">{b.id}</p>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">{b.taxCode}</td>
                  <td className="px-4 py-3.5 text-slate-500">{b.region}</td>
                  <td className="px-4 py-3.5 text-slate-500">{b.sector}</td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">{b.registeredAt}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setApproving(b)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-[#edf0ff] hover:text-[#2740BA] transition-colors"
                        title="Xem / Phê duyệt"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded-lg p-1.5 text-slate-400 hover:bg-[#fff4ed] hover:text-[#E8650A] transition-colors" title="Chỉnh sửa">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded-lg p-1.5 text-slate-400 hover:bg-[#f0f2f8] hover:text-slate-600 transition-colors" title="Khóa">
                        <Lock className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-[#f0f2f8] px-4 py-3">
          <p className="text-[11px] text-slate-400">
            Hiển thị {filtered.length} / {mockBusinesses.length} doanh nghiệp
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e4e8f0] text-slate-400 hover:border-[#2740BA] hover:text-[#2740BA] transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-[12px] font-semibold transition-colors ${
                  page === p ? "bg-[#2740BA] text-white" : "border border-[#e4e8f0] text-slate-500 hover:border-[#2740BA] hover:text-[#2740BA]"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(3, p + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e4e8f0] text-slate-400 hover:border-[#2740BA] hover:text-[#2740BA] transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
