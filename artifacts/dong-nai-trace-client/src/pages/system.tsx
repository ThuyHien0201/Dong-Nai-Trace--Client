import { useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  ScrollText,
  ShieldCheck,
  Settings,
  HardDrive,
  Check,
  AlertTriangle,
  Download,
  RotateCcw,
  Plus,
  Save,
  ChevronDown,
} from "lucide-react";

const TABS = [
  { id: "audit", label: "Nhật ký hệ thống", icon: ScrollText },
  { id: "config", label: "Cấu hình hệ thống", icon: Settings },
  { id: "backup", label: "Sao lưu & phục hồi", icon: HardDrive },
] as const;
type TabId = (typeof TABS)[number]["id"];

// --- Audit Log ---
interface AuditEntry {
  user: string;
  action: string;
  target: string;
  time: string;
  ip: string;
  severity: "critical" | "warning" | "normal";
}

const auditData: AuditEntry[] = [
  { user: "Nguyễn Minh Anh", action: "Phê duyệt hồ sơ", target: "DN-002 HTX Xuân Lộc", time: "19/12/2024 09:42", ip: "192.168.1.45", severity: "normal" },
  { user: "Trần Hoàng Nam", action: "Khóa tài khoản", target: "Cơ sở bưởi Vĩnh Cửu", time: "19/12/2024 09:18", ip: "192.168.1.33", severity: "critical" },
  { user: "Hệ thống", action: "Cấp mã QR tự động", target: "SP-005 Sầu riêng", time: "19/12/2024 08:56", ip: "127.0.0.1", severity: "normal" },
  { user: "Lê Thị Hoa", action: "Xóa bài viết", target: "TT-004", time: "18/12/2024 17:30", ip: "192.168.1.12", severity: "warning" },
  { user: "Nguyễn Minh Anh", action: "Từ chối hồ sơ", target: "DN-004", time: "18/12/2024 15:00", ip: "192.168.1.45", severity: "warning" },
  { user: "Hệ thống", action: "Sao lưu tự động", target: "Toàn bộ CSDL", time: "18/12/2024 02:00", ip: "127.0.0.1", severity: "normal" },
];

const severityConfig = {
  critical: "bg-[#fef0f0] text-[#c0392b] border border-[#f5bcbc]",
  warning: "bg-[#fff4ed] text-[#E8650A] border border-[#fcd9bb]",
  normal: "bg-[#f2f3f7] text-[#6b7694] border border-[#d9dce9]",
};

function AuditTab() {
  return (
    <div>
      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3 rounded-2xl border border-[#e4e8f0] bg-white p-4 shadow-sm">
        {["Người thực hiện", "Loại hành động", "Khoảng thời gian"].map((label) => (
          <div key={label} className="relative">
            <select className="h-9 appearance-none rounded-xl border border-[#e4e8f0] bg-[#f9fafb] pl-3 pr-8 text-[12px] outline-none focus:border-[#2740BA]">
              <option>{label}</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>
        ))}
        <div className="ml-auto flex gap-2">
          {(["critical", "warning"] as const).map((s) => (
            <span key={s} className={`inline-flex cursor-pointer rounded-md px-2.5 py-1 text-[10px] font-semibold ${severityConfig[s]}`}>
              {s === "critical" ? "Nguy hiểm" : "Cảnh báo"}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e4e8f0] bg-white shadow-sm">
        <table className="min-w-full text-[12px]">
          <thead>
            <tr className="border-b border-[#e4e8f0] bg-[#f9fafb]">
              {["Người thực hiện", "Hành động", "Đối tượng", "Thời gian", "IP", "Mức độ"].map((h) => (
                <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {auditData.map((entry, i) => (
              <tr key={i} className="border-b border-[#f0f2f8] hover:bg-[#f9fafb] transition-colors">
                <td className="px-4 py-3.5">
                  <p className="font-semibold text-[#25304b]">{entry.user}</p>
                </td>
                <td className="px-4 py-3.5 text-slate-500">{entry.action}</td>
                <td className="px-4 py-3.5 text-slate-500">{entry.target}</td>
                <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">{entry.time}</td>
                <td className="px-4 py-3.5 font-mono text-[10px] text-slate-400">{entry.ip}</td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold ${severityConfig[entry.severity]}`}>
                    {entry.severity === "critical" ? "Nguy hiểm" : entry.severity === "warning" ? "Cảnh báo" : "Bình thường"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// --- System Config ---
const CONFIG_TABS = ["Chung", "Email", "QR Code", "API / Tích hợp"] as const;
type ConfigTab = (typeof CONFIG_TABS)[number];

function ConfigTab() {
  const [activeSection, setActiveSection] = useState<ConfigTab>("Chung");

  return (
    <div>
      <div className="flex gap-1 rounded-2xl border border-[#e4e8f0] bg-white p-1.5 shadow-sm w-fit mb-5">
        {CONFIG_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setActiveSection(t)}
            className={`rounded-xl px-4 py-2 text-[12px] font-semibold transition-colors ${activeSection === t ? "bg-[#2740BA] text-white shadow-sm" : "text-slate-500 hover:text-[#2740BA]"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-[#e4e8f0] bg-white p-6 shadow-sm">
        {activeSection === "Chung" && (
          <div className="space-y-5">
            <p className="text-[13px] font-bold text-[#1d2944] mb-4">Cài đặt chung</p>
            {[
              { label: "Tên hệ thống", placeholder: "Đồng Nai Trace", type: "text" },
              { label: "Tên đơn vị quản lý", placeholder: "Sở Khoa học và Công nghệ tỉnh Đồng Nai", type: "text" },
              { label: "Múi giờ", placeholder: "Asia/Ho_Chi_Minh (UTC+7)", type: "select" },
              { label: "Số bản ghi mỗi trang", placeholder: "20", type: "number" },
              { label: "Thông báo bảo trì", placeholder: "Để trống nếu không có thông báo", type: "textarea" },
            ].map((field) => (
              <div key={field.label}>
                <label className="mb-1 block text-[11px] font-medium text-slate-600">{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea rows={3} className="w-full resize-none rounded-xl border border-[#e4e8f0] bg-[#f9fafb] p-3 text-[12px] outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15" placeholder={field.placeholder} />
                ) : field.type === "select" ? (
                  <select className="h-10 w-full rounded-xl border border-[#e4e8f0] bg-[#f9fafb] px-3 text-[12px] outline-none focus:border-[#2740BA]">
                    <option>{field.placeholder}</option>
                  </select>
                ) : (
                  <input type={field.type} className="h-10 w-full rounded-xl border border-[#e4e8f0] bg-[#f9fafb] px-3 text-[12px] outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15" placeholder={field.placeholder} />
                )}
              </div>
            ))}
          </div>
        )}
        {activeSection === "Email" && (
          <div className="space-y-5">
            <p className="text-[13px] font-bold text-[#1d2944] mb-4">Cấu hình email</p>
            {[
              { label: "SMTP Host", placeholder: "smtp.gmail.com" },
              { label: "SMTP Port", placeholder: "587" },
              { label: "Email người gửi", placeholder: "noreply@dongnaitrace.vn" },
              { label: "Tên người gửi", placeholder: "Đồng Nai Trace" },
              { label: "Mật khẩu ứng dụng", placeholder: "••••••••••••" },
            ].map((f) => (
              <div key={f.label}>
                <label className="mb-1 block text-[11px] font-medium text-slate-600">{f.label}</label>
                <input className="h-10 w-full rounded-xl border border-[#e4e8f0] bg-[#f9fafb] px-3 text-[12px] outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15" placeholder={f.placeholder} type={f.placeholder.startsWith("•") ? "password" : "text"} />
              </div>
            ))}
          </div>
        )}
        {activeSection === "QR Code" && (
          <div className="space-y-5">
            <p className="text-[13px] font-bold text-[#1d2944] mb-4">Cấu hình mã QR</p>
            {[
              { label: "Kích thước QR (px)", placeholder: "256" },
              { label: "Màu nền", placeholder: "#FFFFFF" },
              { label: "Màu mã", placeholder: "#000000" },
              { label: "URL tiền tố truy xuất", placeholder: "https://trace.dongnai.gov.vn/verify/" },
              { label: "Thời hạn hiệu lực (ngày)", placeholder: "365" },
            ].map((f) => (
              <div key={f.label}>
                <label className="mb-1 block text-[11px] font-medium text-slate-600">{f.label}</label>
                <input className="h-10 w-full rounded-xl border border-[#e4e8f0] bg-[#f9fafb] px-3 text-[12px] outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15" placeholder={f.placeholder} />
              </div>
            ))}
          </div>
        )}
        {activeSection === "API / Tích hợp" && (
          <div className="space-y-5">
            <p className="text-[13px] font-bold text-[#1d2944] mb-4">Tích hợp & API key</p>
            {[
              { label: "API Key hệ thống", placeholder: "dk-xxxxxxxx-xxxx-xxxx" },
              { label: "Webhook URL thông báo", placeholder: "https://your-service.com/webhook" },
              { label: "Google Maps API Key", placeholder: "AIza..." },
              { label: "Token VNPT/Viettel SMS", placeholder: "Bearer xxx..." },
            ].map((f) => (
              <div key={f.label}>
                <label className="mb-1 block text-[11px] font-medium text-slate-600">{f.label}</label>
                <input className="h-10 w-full rounded-xl border border-[#e4e8f0] bg-[#f9fafb] px-3 text-[12px] font-mono outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15" placeholder={f.placeholder} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save button sticky at bottom */}
      <div className="mt-5 flex justify-end">
        <button className="flex items-center gap-2 rounded-xl bg-[#E8650A] px-6 py-3 text-[13px] font-bold text-white hover:bg-[#d95c08] transition-colors shadow-[0_4px_14px_rgba(232,101,10,.2)]">
          <Save className="h-4 w-4" /> Lưu cấu hình
        </button>
      </div>
    </div>
  );
}

// --- Backup ---
interface BackupEntry {
  id: string;
  createdAt: string;
  size: string;
  type: string;
  status: "Hoàn thành" | "Đang tạo";
}

const backups: BackupEntry[] = [
  { id: "BK-2024-1219", createdAt: "19/12/2024 02:00", size: "1.24 GB", type: "Tự động", status: "Hoàn thành" },
  { id: "BK-2024-1218", createdAt: "18/12/2024 02:00", size: "1.21 GB", type: "Tự động", status: "Hoàn thành" },
  { id: "BK-2024-1217", createdAt: "17/12/2024 02:00", size: "1.19 GB", type: "Tự động", status: "Hoàn thành" },
  { id: "BK-2024-1215-M", createdAt: "15/12/2024 10:30", size: "1.18 GB", type: "Thủ công", status: "Hoàn thành" },
];

function BackupTab() {
  const [confirming, setConfirming] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[13px] font-bold text-[#1d2944]">Lịch sử sao lưu</p>
          <p className="text-[11px] text-slate-400">Sao lưu tự động mỗi ngày lúc 02:00</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-[#2740BA] px-4 py-2.5 text-[12px] font-bold text-white hover:bg-[#1e33a0] transition-colors shadow-sm">
          <Plus className="h-4 w-4" /> Tạo bản sao lưu mới
        </button>
      </div>

      {confirming && (
        <div className="mb-4 flex items-center gap-4 rounded-2xl border-2 border-[#E8650A] bg-[#fff8f5] p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-[#E8650A]" />
          <div className="flex-1">
            <p className="text-[12px] font-bold text-[#1d2944]">Xác nhận khôi phục</p>
            <p className="text-[11px] text-slate-500">Thao tác này sẽ ghi đè toàn bộ dữ liệu hiện tại bằng bản sao lưu <strong>{confirming}</strong>. Không thể hoàn tác.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setConfirming(null)} className="rounded-xl border border-[#e4e8f0] px-3 py-2 text-[11px] font-semibold text-slate-500 hover:bg-[#f9fafb] transition-colors">
              Hủy
            </button>
            <button onClick={() => setConfirming(null)} className="rounded-xl bg-[#E8650A] px-3 py-2 text-[11px] font-bold text-white hover:bg-[#d95c08] transition-colors">
              Xác nhận khôi phục
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-[#e4e8f0] bg-white shadow-sm">
        <table className="min-w-full text-[12px]">
          <thead>
            <tr className="border-b border-[#e4e8f0] bg-[#f9fafb]">
              {["Mã bản sao lưu", "Ngày tạo", "Dung lượng", "Loại", "Trạng thái", "Thao tác"].map((h) => (
                <th key={h} className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {backups.map((b) => (
              <tr key={b.id} className="border-b border-[#f0f2f8] hover:bg-[#f9fafb] transition-colors">
                <td className="px-5 py-3.5 font-mono text-[11px] text-[#25304b]">{b.id}</td>
                <td className="px-5 py-3.5 text-slate-500">{b.createdAt}</td>
                <td className="px-5 py-3.5 text-slate-500">{b.size}</td>
                <td className="px-5 py-3.5">
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${b.type === "Thủ công" ? "bg-[#edf0ff] text-[#2740BA]" : "bg-[#f2f3f7] text-[#6b7694]"}`}>
                    {b.type}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold ${b.status === "Hoàn thành" ? "bg-[#e8f5ed] text-[#1f7a45] border border-[#b8e2c8]" : "bg-[#fff4ed] text-[#E8650A] border border-[#fcd9bb]"}`}>
                    {b.status === "Hoàn thành" ? <Check className="h-2.5 w-2.5" /> : null}
                    {b.status}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 rounded-lg border border-[#e4e8f0] px-2.5 py-1 text-[10px] font-medium text-slate-500 hover:border-[#2740BA] hover:text-[#2740BA] transition-colors">
                      <Download className="h-3 w-3" /> Tải về
                    </button>
                    <button
                      onClick={() => setConfirming(b.id)}
                      className="flex items-center gap-1 rounded-lg border border-[#E8650A] px-2.5 py-1 text-[10px] font-medium text-[#E8650A] hover:bg-[#fff4ed] transition-colors"
                    >
                      <RotateCcw className="h-3 w-3" /> Khôi phục
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function System() {
  const [activeTab, setActiveTab] = useState<TabId>("audit");

  return (
    <DashboardShell title="Hệ thống" subtitle="Nhật ký, cấu hình và sao lưu">
      <div className="mb-5">
        <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#E8650A]">Quản trị</p>
        <h2 className="mt-1.5 text-[24px] font-bold tracking-[-.05em] text-[#1d2944]">Quản trị hệ thống</h2>
      </div>

      <div className="flex flex-wrap gap-1 rounded-2xl border border-[#e4e8f0] bg-white p-1.5 shadow-sm w-fit mb-6">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-[12px] font-semibold transition-colors ${
              activeTab === id ? "bg-[#2740BA] text-white shadow-sm" : "text-slate-500 hover:text-[#2740BA]"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "audit" && <AuditTab />}
  
      {activeTab === "config" && <ConfigTab />}
      {activeTab === "backup" && <BackupTab />}
    </DashboardShell>
  );
}
