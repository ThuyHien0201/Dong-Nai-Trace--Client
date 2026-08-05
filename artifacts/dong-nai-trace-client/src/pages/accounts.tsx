import { useState, useMemo } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Shield,
  Eye,
  FileEdit,
  UserCog,
  ChevronDown,
  Lock,
  Mail,
  User,
  KeyRound,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = "Quản trị viên" | "Biên tập viên" | "Người xem";
type AccountStatus = "Đang hoạt động" | "Tạm khóa";

interface Account {
  id: string;
  name: string;
  username: string;
  email: string;
  role: Role;
  status: AccountStatus;
  createdAt: string;
  lastLogin: string;
  avatar: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const initialAccounts: Account[] = [
  { id: "ACC-001", name: "Nguyễn Minh Anh", username: "minhanh.nv", email: "minhanh@dongnai.gov.vn", role: "Quản trị viên", status: "Đang hoạt động", createdAt: "01/01/2024", lastLogin: "Hôm nay, 09:42", avatar: "NMA" },
  { id: "ACC-002", name: "Trần Hoàng Nam", username: "hoangnam.th", email: "hoangnam@dongnai.gov.vn", role: "Biên tập viên", status: "Đang hoạt động", createdAt: "15/03/2024", lastLogin: "Hôm nay, 08:15", avatar: "THN" },
  { id: "ACC-003", name: "Lê Thị Bích", username: "bich.lt", email: "bich.lt@dongnai.gov.vn", role: "Người xem", status: "Đang hoạt động", createdAt: "20/04/2024", lastLogin: "Hôm qua, 14:30", avatar: "LTB" },
  { id: "ACC-004", name: "Phạm Quốc Tuấn", username: "tuan.pq", email: "tuan.pq@dongnai.gov.vn", role: "Biên tập viên", status: "Đang hoạt động", createdAt: "05/05/2024", lastLogin: "2 ngày trước", avatar: "PQT" },
  { id: "ACC-005", name: "Vũ Thị Hương", username: "huong.vt", email: "huong.vt@dongnai.gov.vn", role: "Người xem", status: "Tạm khóa", createdAt: "10/06/2024", lastLogin: "07/07/2024", avatar: "VTH" },
  { id: "ACC-006", name: "Đỗ Văn Khải", username: "khai.dv", email: "khai.dv@skhcn.dongnai.gov.vn", role: "Biên tập viên", status: "Đang hoạt động", createdAt: "22/07/2024", lastLogin: "Hôm nay, 07:55", avatar: "DVK" },
  { id: "ACC-007", name: "Bùi Thị Lan", username: "lan.bt", email: "lan.bt@skhcn.dongnai.gov.vn", role: "Người xem", status: "Đang hoạt động", createdAt: "18/09/2024", lastLogin: "3 ngày trước", avatar: "BTL" },
];

// ─── Role config ──────────────────────────────────────────────────────────────
const roleConfig: Record<Role, { cls: string; icon: typeof Shield; desc: string }> = {
  "Quản trị viên": {
    cls: "bg-[#edf0ff] text-[#2740BA] border border-[#c5cef9]",
    icon: UserCog,
    desc: "Toàn quyền: quản lý tài khoản, doanh nghiệp, sản phẩm, hệ thống",
  },
  "Biên tập viên": {
    cls: "bg-[#fff4ed] text-[#E8650A] border border-[#fcd9bb]",
    icon: FileEdit,
    desc: "Xem và chỉnh sửa doanh nghiệp, sản phẩm. Không quản lý tài khoản hoặc hệ thống",
  },
  "Người xem": {
    cls: "bg-[#f2f3f7] text-[#6b7694] border border-[#d9dce9]",
    icon: Eye,
    desc: "Chỉ xem dữ liệu. Không thể chỉnh sửa bất kỳ thông tin nào",
  },
};

const permissionMatrix: { feature: string; admin: boolean; editor: boolean; viewer: boolean }[] = [
  { feature: "Xem doanh nghiệp & sản phẩm", admin: true, editor: true, viewer: true },
  { feature: "Thêm / Sửa doanh nghiệp", admin: true, editor: true, viewer: false },
  { feature: "Thêm / Sửa sản phẩm", admin: true, editor: true, viewer: false },
  { feature: "Xóa doanh nghiệp / sản phẩm", admin: true, editor: false, viewer: false },
  { feature: "Đồng bộ dữ liệu", admin: true, editor: true, viewer: false },
  { feature: "Xem báo cáo & thống kê", admin: true, editor: true, viewer: true },
  { feature: "Quản lý danh mục & CMS", admin: true, editor: true, viewer: false },
  { feature: "Quản lý tài khoản", admin: true, editor: false, viewer: false },
  { feature: "Cài đặt hệ thống", admin: true, editor: false, viewer: false },
];

const roles: Role[] = ["Quản trị viên", "Biên tập viên", "Người xem"];
const PAGE_SIZE = 8;

function RoleBadge({ role }: { role: Role }) {
  const cfg = roleConfig[role];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${cfg.cls}`}>
      <Icon className="h-2.5 w-2.5" strokeWidth={2} />
      {role}
    </span>
  );
}

// ─── Add/Edit Modal ───────────────────────────────────────────────────────────
function AccountModal({
  account,
  onClose,
  onSave,
}: {
  account: Account | null;
  onClose: () => void;
  onSave: (data: Omit<Account, "id" | "createdAt" | "lastLogin" | "avatar">) => void;
}) {
  const isEdit = !!account;
  const [name, setName] = useState(account?.name ?? "");
  const [username, setUsername] = useState(account?.username ?? "");
  const [email, setEmail] = useState(account?.email ?? "");
  const [role, setRole] = useState<Role>(account?.role ?? "Người xem");
  const [status, setStatus] = useState<AccountStatus>(account?.status ?? "Đang hoạt động");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Vui lòng nhập họ tên";
    if (!username.trim()) errs.username = "Vui lòng nhập tên đăng nhập";
    if (!email.trim()) errs.email = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Email không hợp lệ";
    if (!isEdit && !password.trim()) errs.password = "Vui lòng nhập mật khẩu";
    else if (!isEdit && password.length < 6) errs.password = "Mật khẩu tối thiểu 6 ký tự";
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave({ name, username, email, role, status });
  }

  const inputCls = (field: string) =>
    `h-11 w-full rounded-xl border ${errors[field] ? "border-red-400 bg-red-50" : "border-[#e4e8f0] bg-[#f9fafb]"} pl-10 pr-4 text-[13px] text-[#25304b] outline-none transition focus:border-[#2740BA] focus:bg-white focus:ring-2 focus:ring-[#2740BA]/15`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#e4e8f0] px-6 py-4">
          <p className="text-[15px] font-bold text-[#1d2944]">
            {isEdit ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
          </p>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-[#f1f3fa] hover:text-[#2740BA]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">Họ và tên <span className="text-red-500">*</span></label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A" className={inputCls("name")} />
            </div>
            {errors.name && <p className="mt-1 text-[11px] text-red-500">{errors.name}</p>}
          </div>

          {/* Username + Email row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">Tên đăng nhập <span className="text-red-500">*</span></label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="vana.nguyen" className={inputCls("username")} />
              </div>
              {errors.username && <p className="mt-1 text-[11px] text-red-500">{errors.username}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">Email <span className="text-red-500">*</span></label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@dongnai.gov.vn" className={inputCls("email")} />
              </div>
              {errors.email && <p className="mt-1 text-[11px] text-red-500">{errors.email}</p>}
            </div>
          </div>

          {/* Password (only for add) */}
          {!isEdit && (
            <div>
              <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">Mật khẩu <span className="text-red-500">*</span></label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Tối thiểu 6 ký tự" className={inputCls("password")} />
              </div>
              {errors.password && <p className="mt-1 text-[11px] text-red-500">{errors.password}</p>}
            </div>
          )}

          {/* Role */}
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">Vai trò <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => {
                const cfg = roleConfig[r];
                const Icon = cfg.icon;
                const active = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-center transition-all ${active ? "border-[#2740BA] bg-[#edf0ff]" : "border-[#e4e8f0] bg-white hover:border-[#2740BA]/40"}`}
                  >
                    <Icon className={`h-5 w-5 ${active ? "text-[#2740BA]" : "text-slate-400"}`} strokeWidth={1.8} />
                    <span className={`text-[11px] font-semibold ${active ? "text-[#2740BA]" : "text-slate-500"}`}>{r}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] text-slate-400">{roleConfig[role].desc}</p>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between rounded-xl border border-[#e4e8f0] bg-[#f9fafb] px-4 py-3">
            <div>
              <p className="text-[12px] font-semibold text-[#25304b]">Trạng thái tài khoản</p>
              <p className="mt-0.5 text-[11px] text-slate-400">{status === "Đang hoạt động" ? "Tài khoản có thể đăng nhập và sử dụng hệ thống" : "Tài khoản bị tạm khóa, không thể đăng nhập"}</p>
            </div>
            <button
              type="button"
              onClick={() => setStatus(s => s === "Đang hoạt động" ? "Tạm khóa" : "Đang hoạt động")}
              className={`relative h-6 w-11 rounded-full transition-colors ${status === "Đang hoạt động" ? "bg-[#2740BA]" : "bg-slate-300"}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${status === "Đang hoạt động" ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 border-t border-[#e4e8f0] pt-4">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-[#e4e8f0] py-3 text-[13px] font-semibold text-slate-600 transition-colors hover:border-[#2740BA] hover:text-[#2740BA]">
              Hủy
            </button>
            <button type="submit" className="flex-1 rounded-xl bg-[#2740BA] py-3 text-[13px] font-bold text-white shadow-[0_4px_14px_rgba(39,64,186,.25)] transition-colors hover:bg-[#1e33a0]">
              {isEdit ? "Lưu thay đổi" : "Tạo tài khoản"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete confirm ───────────────────────────────────────────────────────────
function DeleteConfirm({ account, onClose, onConfirm }: { account: Account; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
          <Trash2 className="h-7 w-7 text-red-500" strokeWidth={1.8} />
        </div>
        <h3 className="text-center text-[16px] font-bold text-[#1d2944]">Xóa tài khoản</h3>
        <p className="mt-2 text-center text-[12px] text-slate-500">
          Bạn có chắc muốn xóa tài khoản <span className="font-semibold text-[#1d2944]">{account.name}</span>? Hành động này không thể hoàn tác.
        </p>
        <div className="mt-5 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-[#e4e8f0] py-3 text-[13px] font-semibold text-slate-600 hover:border-slate-400">Hủy</button>
          <button onClick={onConfirm} className="flex-1 rounded-xl bg-red-500 py-3 text-[13px] font-bold text-white hover:bg-red-600">Xóa</button>
        </div>
      </div>
    </div>
  );
}

// ─── Permission table ─────────────────────────────────────────────────────────
function PermissionTable() {
  return (
    <div className="rounded-2xl border border-[#e4e8f0] bg-white shadow-sm overflow-hidden">
      <div className="border-b border-[#e4e8f0] px-6 py-4">
        <p className="text-[14px] font-bold text-[#1d2944]">Phân quyền theo vai trò</p>
        <p className="mt-0.5 text-[11px] text-slate-400">Quyền hạn của từng vai trò trong hệ thống</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-[12px]">
          <thead>
            <tr className="border-b border-[#e4e8f0] bg-[#f9fafb]">
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">Chức năng</th>
              {roles.map((r) => {
                const cfg = roleConfig[r];
                const Icon = cfg.icon;
                return (
                  <th key={r} className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    <div className="flex flex-col items-center gap-1">
                      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                      {r}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f2f8]">
            {permissionMatrix.map((row) => (
              <tr key={row.feature} className="hover:bg-[#fafbfe]">
                <td className="px-5 py-3 text-slate-600">{row.feature}</td>
                {[row.admin, row.editor, row.viewer].map((allowed, i) => (
                  <td key={i} className="px-4 py-3 text-center">
                    {allowed ? (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#e8f5ed]">
                        <Check className="h-3 w-3 text-[#1f7a45]" strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#f2f3f7]">
                        <X className="h-3 w-3 text-slate-300" strokeWidth={3} />
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tất cả");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Account | null>(null);
  const [deleting, setDeleting] = useState<Account | null>(null);
  const [activeTab, setActiveTab] = useState<"accounts" | "permissions">("accounts");

  const filtered = useMemo(() => {
    return accounts.filter((a) => {
      const q = search.toLowerCase();
      const matchSearch = a.name.toLowerCase().includes(q) || a.username.toLowerCase().includes(q) || a.email.toLowerCase().includes(q);
      const matchRole = roleFilter === "Tất cả" || a.role === roleFilter;
      const matchStatus = statusFilter === "Tất cả" || a.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [accounts, search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSave(data: Omit<Account, "id" | "createdAt" | "lastLogin" | "avatar">) {
    if (modal === "edit" && editing) {
      setAccounts((prev) => prev.map((a) => a.id === editing.id ? { ...a, ...data } : a));
    } else {
      const initials = data.name.split(" ").map((w) => w[0]).join("").slice(0, 3).toUpperCase();
      const newAcc: Account = {
        ...data,
        id: `ACC-${String(accounts.length + 1).padStart(3, "0")}`,
        avatar: initials,
        createdAt: new Date().toLocaleDateString("vi-VN"),
        lastLogin: "Chưa đăng nhập",
      };
      setAccounts((prev) => [newAcc, ...prev]);
    }
    setModal(null);
    setEditing(null);
  }

  function handleDelete() {
    if (!deleting) return;
    setAccounts((prev) => prev.filter((a) => a.id !== deleting.id));
    setDeleting(null);
  }

  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = { "Tất cả": accounts.length };
    roles.forEach((r) => { counts[r] = accounts.filter((a) => a.role === r).length; });
    return counts;
  }, [accounts]);

  return (
    <DashboardShell title="Quản lý tài khoản" subtitle="Phân quyền và quản lý người dùng">
      {/* Modals */}
      {(modal === "add" || modal === "edit") && (
        <AccountModal
          account={modal === "edit" ? editing : null}
          onClose={() => { setModal(null); setEditing(null); }}
          onSave={handleSave}
        />
      )}
      {deleting && (
        <DeleteConfirm
          account={deleting}
          onClose={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}

      {/* Header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#E8650A]">Quản lý</p>
          <h2 className="mt-1.5 text-[24px] font-bold tracking-[-0.05em] text-[#1d2944]">Tài khoản</h2>
        </div>
        <button
          onClick={() => setModal("add")}
          className="flex items-center gap-2 rounded-xl bg-[#E8650A] px-4 py-2.5 text-[12px] font-bold text-white shadow-[0_4px_14px_rgba(232,101,10,.22)] hover:bg-[#d95c08]"
        >
          <Plus className="h-4 w-4" /> Thêm tài khoản
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex gap-1 rounded-xl border border-[#e4e8f0] bg-[#f7f8fd] p-1 w-fit">
        <button
          onClick={() => setActiveTab("accounts")}
          className={`rounded-lg px-5 py-2 text-[12px] font-semibold transition-colors ${activeTab === "accounts" ? "bg-white text-[#2740BA] shadow-sm" : "text-slate-500 hover:text-[#2740BA]"}`}
        >
          Danh sách tài khoản
        </button>
        <button
          onClick={() => setActiveTab("permissions")}
          className={`rounded-lg px-5 py-2 text-[12px] font-semibold transition-colors ${activeTab === "permissions" ? "bg-white text-[#2740BA] shadow-sm" : "text-slate-500 hover:text-[#2740BA]"}`}
        >
          <Shield className="mr-1.5 inline h-3 w-3" />
          Phân quyền
        </button>
      </div>

      {activeTab === "permissions" ? (
        <PermissionTable />
      ) : (
        <>
          {/* Role filter tabs */}
          <div className="mb-4 flex flex-wrap gap-2">
            {["Tất cả", ...roles].map((r) => {
              const active = roleFilter === r;
              return (
                <button
                  key={r}
                  onClick={() => { setRoleFilter(r); setPage(1); }}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[12px] font-semibold transition-colors ${active ? "bg-[#2740BA] text-white shadow-[0_3px_10px_rgba(39,64,186,.2)]" : "border border-[#e4e8f0] bg-white text-slate-500 hover:border-[#2740BA] hover:text-[#2740BA]"}`}
                >
                  {r}
                  <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${active ? "bg-white/20 text-white" : "bg-[#f0f2f8] text-slate-500"}`}>
                    {roleCounts[r] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search + status filter */}
          <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-[#e4e8f0] bg-white px-4 py-3 shadow-sm">
            <div className="relative min-w-[220px] flex-1">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Tìm tên, tên đăng nhập, email..."
                className="h-9 w-full rounded-xl border border-[#e4e8f0] bg-[#f9fafb] pl-9 pr-4 text-[12px] outline-none transition focus:border-[#2740BA] focus:bg-white focus:ring-2 focus:ring-[#2740BA]/15"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="h-9 appearance-none rounded-xl border border-[#e4e8f0] bg-[#f9fafb] pl-3 pr-8 text-[12px] outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15"
              >
                {["Tất cả", "Đang hoạt động", "Tạm khóa"].map((s) => <option key={s}>{s}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-[#e4e8f0] bg-white shadow-sm">
            <table className="min-w-full text-[12px]">
              <thead>
                <tr className="border-b border-[#e4e8f0] bg-[#f9fafb]">
                  {["Tài khoản", "Tên đăng nhập", "Vai trò", "Trạng thái", "Đăng nhập gần nhất", "Ngày tạo", "Thao tác"].map((h) => (
                    <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f8]">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-slate-400">Không tìm thấy tài khoản phù hợp</td>
                  </tr>
                ) : paginated.map((acc) => (
                  <tr key={acc.id} className="transition-colors hover:bg-[#f9fafb]">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dce3ff] text-[10px] font-bold text-[#2740BA]">
                          {acc.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-[#25304b]">{acc.name}</p>
                          <p className="text-[10px] text-slate-400">{acc.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-500">{acc.username}</td>
                    <td className="px-4 py-3.5"><RoleBadge role={acc.role} /></td>
                    <td className="px-4 py-3.5">
                      {acc.status === "Đang hoạt động" ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#b8e2c8] bg-[#e8f5ed] px-2.5 py-0.5 text-[10px] font-bold text-[#1f7a45]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#1f7a45]" /> Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#d9dce9] bg-[#f2f3f7] px-2.5 py-0.5 text-[10px] font-bold text-slate-500">
                          <Lock className="h-2.5 w-2.5" /> Tạm khóa
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-slate-400">{acc.lastLogin}</td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-slate-400">{acc.createdAt}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => { setEditing(acc); setModal("edit"); }}
                          title="Chỉnh sửa"
                          className="flex items-center gap-1 rounded-lg border border-[#e4e8f0] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 hover:border-[#2740BA] hover:text-[#2740BA]"
                        >
                          <Pencil className="h-3 w-3" /> Sửa
                        </button>
                        <button
                          onClick={() => setDeleting(acc)}
                          title="Xóa"
                          className="flex items-center gap-1 rounded-lg border border-[#e4e8f0] bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 hover:border-red-400 hover:text-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-[#f0f2f8] px-4 py-3">
                <p className="text-[11px] text-slate-400">
                  Trang {page}/{totalPages} · {filtered.length} tài khoản
                </p>
                <div className="flex gap-1">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border border-[#e4e8f0] px-3 py-1.5 text-[11px] font-semibold text-slate-500 disabled:opacity-40 hover:border-[#2740BA] hover:text-[#2740BA]">
                    Trước
                  </button>
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-lg border border-[#e4e8f0] px-3 py-1.5 text-[11px] font-semibold text-slate-500 disabled:opacity-40 hover:border-[#2740BA] hover:text-[#2740BA]">
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>

          <p className="mt-3 text-[11px] text-slate-400">
            Hiển thị {paginated.length} / {filtered.length} tài khoản
          </p>
        </>
      )}
    </DashboardShell>
  );
}
