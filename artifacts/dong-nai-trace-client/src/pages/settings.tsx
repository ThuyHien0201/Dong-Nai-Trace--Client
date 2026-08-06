import { useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  User,
  Mail,
  Phone,
  Building2,
  KeyRound,
  Save,
  Eye,
  EyeOff,
  Bell,
  Check,
  Info,
} from "lucide-react";

// ─── Mock current user ──────────────────────────────────────────────────────────
const CURRENT_USER = {
  name: "Nguyễn Minh Anh",
  username: "minhanh.nv",
  email: "minhanh@dongnai.gov.vn",
  phone: "0901 234 567",
  department: "Sở Khoa học và Công nghệ tỉnh Đồng Nai",
  role: "Quản trị viên",
  avatar: "NMA",
};

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#e4e8f0] bg-white shadow-[0_2px_12px_rgba(38,55,105,.04)] overflow-hidden">
      <div className="border-b border-[#e4e8f0] bg-[#f9fafb] px-6 py-4">
        <p className="text-[13px] font-bold text-[#1d2944]">{title}</p>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  readOnly = false,
  hint,
  type = "text",
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  icon: React.ElementType;
  readOnly?: boolean;
  hint?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type={type}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`h-11 w-full rounded-xl border pl-10 pr-4 text-[13px] outline-none transition ${
            readOnly
              ? "cursor-not-allowed select-none border-[#e4e8f0] bg-[#f2f3f7] text-slate-400"
              : "border-[#e4e8f0] bg-[#f9fafb] text-[#25304b] focus:border-[#2740BA] focus:bg-white focus:ring-2 focus:ring-[#2740BA]/15"
          }`}
        />
        {readOnly && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#e4e8f0] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-400">
              Không chỉnh sửa
            </span>
          </div>
        )}
      </div>
      {hint && (
        <p className="mt-1.5 flex items-center gap-1 text-[11px] text-slate-400">
          <Info className="h-3 w-3 shrink-0" /> {hint}
        </p>
      )}
    </div>
  );
}

// ─── Profile section ────────────────────────────────────────────────────────────
function ProfileSection() {
  const [name, setName] = useState(CURRENT_USER.name);
  const [phone, setPhone] = useState(CURRENT_USER.phone);
  const [department, setDepartment] = useState(CURRENT_USER.department);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <SectionCard title="Thông tin tài khoản">
      {/* Avatar row */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2740BA] text-[20px] font-bold text-white shadow-[0_4px_14px_rgba(39,64,186,.25)]">
          {CURRENT_USER.avatar}
        </div>
        <div>
          <p className="text-[15px] font-bold text-[#1d2944]">{name || CURRENT_USER.name}</p>
          <p className="text-[12px] text-slate-400">{CURRENT_USER.role} · @{CURRENT_USER.username}</p>
        </div>
      </div>

      <div className="space-y-4">
        <InputField
          label="Họ và tên"
          value={name}
          onChange={setName}
          placeholder="Nhập họ tên"
          icon={User}
        />

        {/* Email — read-only */}
        <InputField
          label="Email đăng nhập"
          value={CURRENT_USER.email}
          icon={Mail}
          readOnly
          hint="Email được quản lý bởi hệ thống và không thể tự chỉnh sửa. Liên hệ quản trị viên nếu cần thay đổi."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            label="Số điện thoại"
            value={phone}
            onChange={setPhone}
            placeholder="0900 000 000"
            icon={Phone}
          />
          <InputField
            label="Tên đăng nhập"
            value={CURRENT_USER.username}
            icon={User}
            readOnly
            hint="Không thể chỉnh sửa."
          />
        </div>

        <InputField
          label="Đơn vị công tác"
          value={department}
          onChange={setDepartment}
          placeholder="Nhập đơn vị"
          icon={Building2}
        />
      </div>

      <div className="mt-5 flex justify-end">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold text-white transition-all ${
            saved
              ? "bg-[#1f7a45] shadow-[0_4px_14px_rgba(31,122,69,.25)]"
              : "bg-[#2740BA] shadow-[0_4px_14px_rgba(39,64,186,.25)] hover:bg-[#1e33a0]"
          }`}
        >
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? "Đã lưu" : "Lưu thay đổi"}
        </button>
      </div>
    </SectionCard>
  );
}

// ─── Change password section ────────────────────────────────────────────────────
function PasswordSection() {
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!currentPwd) { setError("Vui lòng nhập mật khẩu hiện tại"); return; }
    if (newPwd.length < 8) { setError("Mật khẩu mới tối thiểu 8 ký tự"); return; }
    if (newPwd !== confirmPwd) { setError("Mật khẩu xác nhận không khớp"); return; }
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    }, 3000);
  }

  const strength = newPwd.length === 0 ? 0 : newPwd.length < 8 ? 1 : newPwd.length < 12 ? 2 : 3;
  const strengthLabel = ["", "Yếu", "Trung bình", "Mạnh"][strength];
  const strengthColor = ["", "#c0392b", "#E8650A", "#1f7a45"][strength];

  function PwdField({
    label,
    value,
    onChange,
    show,
    onToggle,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    show: boolean;
    onToggle: () => void;
  }) {
    return (
      <div>
        <label className="mb-1.5 block text-[12px] font-semibold text-slate-600">{label}</label>
        <div className="relative">
          <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type={show ? "text" : "password"}
            value={value}
            onChange={(e) => { onChange(e.target.value); setError(""); }}
            placeholder="••••••••"
            className="h-11 w-full rounded-xl border border-[#e4e8f0] bg-[#f9fafb] pl-10 pr-10 text-[13px] text-[#25304b] outline-none focus:border-[#2740BA] focus:bg-white focus:ring-2 focus:ring-[#2740BA]/15"
          />
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <SectionCard title="Đổi mật khẩu">
      <form onSubmit={handleSubmit} className="space-y-4">
        <PwdField
          label="Mật khẩu hiện tại"
          value={currentPwd}
          onChange={setCurrentPwd}
          show={showCurrent}
          onToggle={() => setShowCurrent((v) => !v)}
        />
        <PwdField
          label="Mật khẩu mới"
          value={newPwd}
          onChange={setNewPwd}
          show={showNew}
          onToggle={() => setShowNew((v) => !v)}
        />

        {/* Strength indicator */}
        {newPwd.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex flex-1 gap-1">
              {[1, 2, 3].map((level) => (
                <div
                  key={level}
                  className="h-1.5 flex-1 rounded-full transition-colors"
                  style={{ background: strength >= level ? strengthColor : "#e4e8f0" }}
                />
              ))}
            </div>
            <span className="text-[11px] font-semibold" style={{ color: strengthColor }}>
              {strengthLabel}
            </span>
          </div>
        )}

        <PwdField
          label="Xác nhận mật khẩu mới"
          value={confirmPwd}
          onChange={setConfirmPwd}
          show={showConfirm}
          onToggle={() => setShowConfirm((v) => !v)}
        />

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-[11px] font-medium text-red-600">{error}</p>
        )}
        {done && (
          <p className="flex items-center gap-2 rounded-lg bg-[#e8f5ed] px-3 py-2 text-[11px] font-semibold text-[#1f7a45]">
            <Check className="h-3.5 w-3.5" /> Mật khẩu đã được cập nhật thành công
          </p>
        )}

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-[#E8650A] px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_4px_14px_rgba(232,101,10,.2)] hover:bg-[#d95c08] transition-colors"
          >
            <KeyRound className="h-4 w-4" /> Cập nhật mật khẩu
          </button>
        </div>
      </form>
    </SectionCard>
  );
}


// ─── Page ───────────────────────────────────────────────────────────────────────
export default function Settings() {
  return (
    <DashboardShell title="Cài đặt tài khoản" subtitle="Thông tin cá nhân và bảo mật">
      <div className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#E8650A]">Tài khoản</p>
        <h2 className="mt-1.5 text-[24px] font-bold tracking-[-0.05em] text-[#1d2944]">Cài đặt</h2>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <ProfileSection />
       
        </div>
        <div>
           <PasswordSection />
          
        </div>
      </div>
    </DashboardShell>
  );
}
