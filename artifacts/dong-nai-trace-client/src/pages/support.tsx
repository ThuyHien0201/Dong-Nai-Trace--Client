import { useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  Send,
  X,
  CheckCheck,
  Clock,
  Plus,
  Bell,
  LifeBuoy,
  Users,
  ChevronDown,
} from "lucide-react";

const TABS = [
  { id: "tickets", label: "Yêu cầu hỗ trợ", icon: LifeBuoy },
  { id: "notifications", label: "Thông báo", icon: Bell },
] as const;
type TabId = "tickets" | "notifications";

type TicketStatus = "Mới" | "Đang xử lý" | "Đã đóng";

interface Ticket {
  id: string;
  subject: string;
  company: string;
  status: TicketStatus;
  time: string;
  messages: { from: "user" | "admin"; text: string; time: string }[];
}

const tickets: Ticket[] = [
  {
    id: "TK-001",
    subject: "Không thể đăng nhập hệ thống",
    company: "HTX Xuân Lộc",
    status: "Mới",
    time: "09:15",
    messages: [
      { from: "user", text: "Kính chào, tôi không thể đăng nhập vào hệ thống từ sáng nay. Lỗi báo 'Tài khoản không tồn tại'.", time: "09:15" },
      { from: "user", text: "Tôi đã thử đặt lại mật khẩu nhưng không nhận được email.", time: "09:17" },
    ],
  },
  {
    id: "TK-002",
    subject: "Yêu cầu cập nhật thông tin doanh nghiệp",
    company: "Cơ sở Bưởi Tân Triều",
    status: "Đang xử lý",
    time: "Hôm qua",
    messages: [
      { from: "user", text: "Chúng tôi muốn cập nhật địa chỉ và số điện thoại liên hệ.", time: "Hôm qua 14:30" },
      { from: "admin", text: "Chào bạn, vui lòng cung cấp thông tin mới để chúng tôi cập nhật.", time: "Hôm qua 15:00" },
      { from: "user", text: "Địa chỉ mới: 45 Đường Tân Triều, Vĩnh Cửu, Đồng Nai. SĐT: 0901 888 999.", time: "Hôm qua 15:10" },
    ],
  },
  {
    id: "TK-003",
    subject: "Mã QR bị lỗi khi quét",
    company: "Trại tôm Long Khánh",
    status: "Đã đóng",
    time: "20/12",
    messages: [
      { from: "user", text: "Mã QR sản phẩm SP-006 không quét được bằng điện thoại.", time: "20/12 08:00" },
      { from: "admin", text: "Đã kiểm tra và cấp lại mã QR mới. Vui lòng thử lại.", time: "20/12 09:30" },
      { from: "user", text: "Đã hoạt động rồi, cảm ơn!", time: "20/12 09:45" },
    ],
  },
];

const statusConfig: Record<TicketStatus, string> = {
  "Mới": "bg-[#fff4ed] text-[#E8650A] border border-[#fcd9bb]",
  "Đang xử lý": "bg-[#edf0ff] text-[#2740BA] border border-[#c4d0f5]",
  "Đã đóng": "bg-[#f2f3f7] text-[#6b7694] border border-[#d9dce9]",
};

interface Notification {
  id: string;
  title: string;
  target: string;
  sentAt: string;
  status: "Đã gửi" | "Đang gửi";
}

const notifications: Notification[] = [
  { id: "TB-001", title: "Lịch bảo trì hệ thống 25/12", target: "Tất cả người dùng", sentAt: "19/12/2024 08:00", status: "Đã gửi" },
  { id: "TB-002", title: "Cập nhật tính năng mới", target: "Quản trị viên", sentAt: "15/12/2024 10:30", status: "Đã gửi" },
  { id: "TB-003", title: "Hạn nộp hồ sơ OCOP 2025", target: "Huyện Xuân Lộc", sentAt: "10/12/2024 09:00", status: "Đã gửi" },
];

function TicketsTab() {
  const [selectedId, setSelectedId] = useState<string>(tickets[0].id);
  const [reply, setReply] = useState("");
  const selected = tickets.find((t) => t.id === selectedId)!;

  return (
    <div className="flex gap-5 h-[600px]">
      {/* Ticket list */}
      <div className="w-72 shrink-0 overflow-y-auto rounded-2xl border border-[#e4e8f0] bg-white shadow-sm">
        <div className="border-b border-[#e4e8f0] p-3">
          <p className="text-[12px] font-bold text-[#1d2944]">Danh sách ticket</p>
        </div>
        {tickets.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedId(t.id)}
            className={`w-full border-b border-[#f0f2f8] p-3.5 text-left transition-colors hover:bg-[#f7f8fd] ${selectedId === t.id ? "bg-[#f0f3ff] border-l-2 border-l-[#2740BA]" : ""}`}
          >
            <div className="mb-1 flex items-start justify-between gap-2">
              <p className="text-[11px] font-semibold text-[#25304b] line-clamp-2 flex-1">{t.subject}</p>
              <span className="text-[10px] text-slate-400 shrink-0">{t.time}</span>
            </div>
            <p className="text-[10px] text-slate-400 mb-1.5">{t.company}</p>
            <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-semibold ${statusConfig[t.status]}`}>
              {t.status}
            </span>
          </button>
        ))}
      </div>

      {/* Chat view */}
      <div className="flex flex-1 flex-col rounded-2xl border border-[#e4e8f0] bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e4e8f0] px-5 py-3.5">
          <div>
            <p className="text-[13px] font-bold text-[#1d2944]">{selected.subject}</p>
            <p className="text-[11px] text-slate-400">{selected.company} · {selected.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold ${statusConfig[selected.status]}`}>
              {selected.status}
            </span>
            {selected.status !== "Đã đóng" && (
              <button className="rounded-lg border border-[#e4e8f0] px-3 py-1.5 text-[10px] font-semibold text-slate-500 hover:border-[#6b7694] hover:text-[#6b7694] transition-colors">
                <X className="h-3 w-3 inline mr-1" />Đóng ticket
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {selected.messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.from === "admin" ? "flex-row-reverse" : ""}`}>
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${msg.from === "admin" ? "bg-[#2740BA] text-white" : "bg-[#f0f2f8] text-[#6b7694]"}`}>
                {msg.from === "admin" ? "AD" : "DN"}
              </div>
              <div className={`max-w-[70%] rounded-2xl p-3 text-[12px] leading-5 ${msg.from === "admin" ? "bg-[#2740BA] text-white rounded-tr-sm" : "bg-[#f7f8fd] text-[#25304b] rounded-tl-sm"}`}>
                <p>{msg.text}</p>
                <p className={`mt-1 text-[10px] ${msg.from === "admin" ? "text-blue-200" : "text-slate-400"}`}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Reply input */}
        {selected.status !== "Đã đóng" && (
          <div className="border-t border-[#e4e8f0] p-4">
            <div className="flex gap-3">
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Nhập phản hồi..."
                className="flex-1 h-10 rounded-xl border border-[#e4e8f0] bg-[#f9fafb] px-4 text-[12px] outline-none focus:border-[#2740BA] focus:bg-white focus:ring-2 focus:ring-[#2740BA]/15"
                onKeyDown={(e) => e.key === "Enter" && setReply("")}
              />
              <button
                onClick={() => setReply("")}
                className="flex items-center gap-2 rounded-xl bg-[#E8650A] px-4 py-2 text-[12px] font-bold text-white hover:bg-[#d95c08] transition-colors"
              >
                <Send className="h-3.5 w-3.5" /> Gửi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-bold text-[#1d2944]">Thông báo đã gửi</p>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 rounded-xl bg-[#E8650A] px-4 py-2 text-[12px] font-bold text-white hover:bg-[#d95c08] transition-colors shadow-[0_4px_14px_rgba(232,101,10,.2)]"
        >
          <Plus className="h-4 w-4" /> Tạo thông báo mới
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-[#e4e8f0] bg-white p-6 shadow-sm">
          <p className="mb-4 text-[13px] font-bold text-[#1d2944]">Soạn thông báo mới</p>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600">Tiêu đề</label>
              <input className="h-10 w-full rounded-xl border border-[#e4e8f0] bg-[#f9fafb] px-3 text-[12px] outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15" placeholder="Nhập tiêu đề thông báo..." />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600">Nội dung</label>
              <textarea rows={3} className="w-full resize-none rounded-xl border border-[#e4e8f0] bg-[#f9fafb] p-3 text-[12px] outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15" placeholder="Nhập nội dung..." />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-slate-600">Đối tượng nhận</label>
              <div className="relative">
                <select className="h-10 w-full appearance-none rounded-xl border border-[#e4e8f0] bg-[#f9fafb] pl-3 pr-8 text-[12px] outline-none focus:border-[#2740BA]">
                  <option>Tất cả người dùng</option>
                  <option>Theo địa bàn</option>
                  <option>Theo doanh nghiệp cụ thể</option>
                  <option>Quản trị viên</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="rounded-xl border border-[#e4e8f0] px-5 py-2.5 text-[12px] font-semibold text-slate-500 hover:bg-[#f9fafb] transition-colors">
                Hủy
              </button>
              <button className="flex items-center gap-2 rounded-xl bg-[#E8650A] px-5 py-2.5 text-[12px] font-bold text-white hover:bg-[#d95c08] transition-colors shadow-[0_4px_14px_rgba(232,101,10,.2)]">
                <Send className="h-3.5 w-3.5" /> Gửi thông báo
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-[#e4e8f0] bg-white shadow-sm">
        <table className="min-w-full text-[12px]">
          <thead>
            <tr className="border-b border-[#e4e8f0] bg-[#f9fafb]">
              {["Tiêu đề", "Đối tượng nhận", "Thời gian gửi", "Trạng thái"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {notifications.map((n) => (
              <tr key={n.id} className="border-b border-[#f0f2f8] hover:bg-[#f9fafb] transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-[#25304b]">{n.title}</p>
                  <p className="text-[10px] text-slate-400">{n.id}</p>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    {n.target}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-slate-500">{n.sentAt}</td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1 rounded-md bg-[#e8f5ed] px-2 py-0.5 text-[10px] font-semibold text-[#1f7a45] border border-[#b8e2c8]">
                    <CheckCheck className="h-2.5 w-2.5" /> {n.status}
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

export default function Support() {
  const [activeTab, setActiveTab] = useState<TabId>("tickets");

  return (
    <DashboardShell title="Hỗ trợ & thông báo" subtitle="Quản lý yêu cầu hỗ trợ và gửi thông báo">
      <div className="mb-5">
        <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#E8650A]">Quản lý</p>
        <h2 className="mt-1.5 text-[24px] font-bold tracking-[-.05em] text-[#1d2944]">Hỗ trợ & thông báo</h2>
      </div>

      <div className="flex gap-1 rounded-2xl border border-[#e4e8f0] bg-white p-1.5 shadow-sm w-fit mb-6">
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

      {activeTab === "tickets" ? <TicketsTab /> : <NotificationsTab />}
    </DashboardShell>
  );
}
