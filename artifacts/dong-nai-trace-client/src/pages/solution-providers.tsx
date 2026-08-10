import { useMemo, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  Building2,
  CheckCircle2,
  FileText,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";

type Provider = {
  id: number;
  image: string;
  name: string;
  taxCode: string;
  representative: string;
  phone: string;
  email: string;
  businessLicense: string;
  organization: string;
  connectedCertificate: string;
  capabilityProfile: string;
};

const INITIAL_PROVIDERS: Provider[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=160&h=160&fit=crop",
    name: "Công ty TNHH TraceMark Việt Nam",
    taxCode: "0316458120",
    representative: "Nguyễn Hoàng Nam",
    phone: "028 7300 2288",
    email: "contact@tracemark.vn",
    businessLicense: "GPKD_TraceMark.pdf",
    organization: "Công ty TNHH",
    connectedCertificate: "CN_KetNoi_TraceMark.pdf",
    capabilityProfile: "HoSoNangLuc_TraceMark.pdf",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=160&h=160&fit=crop",
    name: "Công ty CP Công nghệ GreenTrace",
    taxCode: "0109854217",
    representative: "Trần Minh Hương",
    phone: "024 3765 9120",
    email: "hello@greentrace.vn",
    businessLicense: "GiayPhep_GreenTrace.pdf",
    organization: "Công ty cổ phần",
    connectedCertificate: "ChungNhan_GreenTrace.pdf",
    capabilityProfile: "",
  },
];

const EMPTY_FORM: Omit<Provider, "id"> = {
  image: "",
  name: "",
  taxCode: "",
  representative: "",
  phone: "",
  email: "",
  businessLicense: "",
  organization: "",
  connectedCertificate: "",
  capabilityProfile: "",
};

function ProviderForm({
  provider,
  onClose,
  onSave,
}: {
  provider: Provider | null;
  onClose: () => void;
  onSave: (value: Omit<Provider, "id">) => void;
}) {
  const [form, setForm] = useState<Omit<Provider, "id">>(provider ?? EMPTY_FORM);
  const [error, setError] = useState("");
  const setField = (field: keyof Omit<Provider, "id">, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const upload = (field: keyof Omit<Provider, "id">, file?: File) => {
    if (file) setField(field, file.name);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.taxCode.trim() || !form.representative.trim() ||
      !form.phone.trim() || !form.email.trim() || !form.organization.trim() ||
      !form.connectedCertificate) {
      setError("Vui lòng nhập đủ thông tin bắt buộc và tải giấy chứng nhận kết nối.");
      return;
    }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#16234f]/35 p-4 py-8 backdrop-blur-sm">
      <form onSubmit={submit} className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#edf0f5] px-6 py-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#E8650A]">Hồ sơ đơn vị</p>
            <h3 className="mt-1 text-[18px] font-bold text-[#1d2944]">{provider ? "Chỉnh sửa đơn vị" : "Thêm đơn vị cung cấp giải pháp"}</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-[#f1f3fa]" aria-label="Đóng">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-5 px-6 py-5 md:grid-cols-[150px_1fr]">
          <div>
            <label className="mb-2 block text-[11px] font-bold text-[#34405a]">Hình ảnh</label>
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#c5cef9] bg-[#f6f8ff]">
              {form.image ? <img src={form.image} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-8 w-8 text-[#a8b2c8]" />}
            </div>
            <label className="mt-2 flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#e4e8f0] px-2 py-2 text-[10px] font-semibold text-[#2740BA] hover:bg-[#edf0ff]">
              <Upload className="h-3.5 w-3.5" /> Chọn ảnh
              <input type="file" accept="image/*" className="hidden" onChange={(event) => upload("image", event.target.files?.[0])} />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["name", "Tên đơn vị", "Nhập tên đơn vị", true],
              ["taxCode", "Mã số thuế", "Nhập mã số thuế", true],
              ["representative", "Người đại diện", "Nhập họ tên người đại diện", true],
              ["organization", "Tổ chức", "Ví dụ: Công ty TNHH", true],
              ["phone", "Số điện thoại", "Nhập số điện thoại", true],
              ["email", "Email", "Nhập email liên hệ", true],
            ].map(([field, label, placeholder, required]) => (
              <label key={field as string} className="text-[11px] font-bold text-[#34405a]">
                {label as string} {required && <span className="text-[#E8650A]">*</span>}
                <input value={form[field as keyof typeof form]} onChange={(event) => setField(field as keyof typeof form, event.target.value)} placeholder={placeholder as string} className="mt-1.5 h-10 w-full rounded-xl border border-[#e4e8f0] bg-[#f9fafb] px-3 text-[12px] font-normal text-[#25304b] outline-none focus:border-[#2740BA] focus:bg-white focus:ring-2 focus:ring-[#2740BA]/15" />
              </label>
            ))}
          </div>
        </div>
        <div className="grid gap-4 border-t border-[#edf0f5] px-6 py-5 sm:grid-cols-2">
          {[
            ["businessLicense", "Giấy phép kinh doanh", false],
            ["connectedCertificate", "Giấy chứng nhận đã kết nối cổng TXNG quốc gia", true],
            ["capabilityProfile", "Hồ sơ năng lực", false],
          ].map(([field, label, required]) => (
            <div key={field as string} className="sm:col-span-2">
              <label className="mb-1.5 block text-[11px] font-bold text-[#34405a]">{label as string} {required && <span className="text-[#E8650A]">*</span>}</label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#c5cef9] bg-[#f8f9ff] px-3 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#edf0ff] text-[#2740BA]"><FileText className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-semibold text-[#25304b]">{form[field as keyof typeof form] || "Chọn tệp PDF/DOCX"}</p>
                  <p className="text-[10px] text-slate-400">{required ? "Bắt buộc" : "Không bắt buộc"}</p>
                </div>
                <Upload className="h-4 w-4 text-[#2740BA]" />
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(event) => upload(field as keyof typeof form, event.target.files?.[0])} />
              </label>
            </div>
          ))}
          {error && <p role="alert" className="sm:col-span-2 rounded-xl border border-[#f5bcbc] bg-[#fef0f0] px-3 py-2.5 text-[11px] text-[#c0392b]">{error}</p>}
        </div>
        <div className="flex justify-end gap-2 border-t border-[#edf0f5] px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-xl border border-[#e4e8f0] px-5 py-2.5 text-[12px] font-semibold text-slate-600">Hủy</button>
          <button type="submit" className="flex items-center gap-2 rounded-xl bg-[#2740BA] px-5 py-2.5 text-[12px] font-bold text-white hover:bg-[#1e33a0]"><CheckCircle2 className="h-3.5 w-3.5" /> Lưu đơn vị</button>
        </div>
      </form>
    </div>
  );
}

export default function SolutionProviders() {
  const [providers, setProviders] = useState(INITIAL_PROVIDERS);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Provider | null | undefined>(undefined);
  const visible = useMemo(() => providers.filter((provider) =>
    `${provider.name} ${provider.taxCode} ${provider.representative}`.toLowerCase().includes(query.toLowerCase())), [providers, query]);

  return (
    <DashboardShell title="Đơn vị cung cấp giải pháp" subtitle="Quản lý hồ sơ các đơn vị kết nối hệ thống truy xuất nguồn gốc">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#E8650A]">Quản trị</p>
          <h2 className="mt-1.5 text-[24px] font-bold tracking-[-0.05em] text-[#1d2944]">Đơn vị cung cấp giải pháp</h2>
          <p className="mt-1 text-[12px] text-slate-400">Danh sách đơn vị được phép kết nối và cung cấp nền tảng TXNG.</p>
        </div>
        <button onClick={() => setEditing(null)} className="flex items-center gap-2 rounded-xl bg-[#E8650A] px-4 py-2.5 text-[12px] font-bold text-white shadow-[0_8px_18px_rgba(232,101,10,.18)] hover:bg-[#d95c08]"><Plus className="h-4 w-4" /> Thêm đơn vị</button>
      </div>
      <div className="mb-4 flex items-center gap-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tên, mã số thuế, người đại diện..." className="h-10 w-full rounded-xl border border-[#e4e8f0] bg-white pl-9 pr-3 text-[12px] outline-none focus:border-[#2740BA]" />
        </div>
        <span className="text-[11px] text-slate-400">{visible.length} đơn vị</span>
      </div>
      <div className="overflow-hidden rounded-2xl border border-[#e4e8f0] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-[12px]">
            <thead><tr className="border-b border-[#e4e8f0] bg-[#f9fafb]">{["Đơn vị", "Mã số thuế", "Người đại diện", "Liên hệ", "Hồ sơ kết nối", "Thao tác"].map((heading) => <th key={heading} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">{heading}</th>)}</tr></thead>
            <tbody className="divide-y divide-[#f0f2f8]">
              {visible.map((provider) => <tr key={provider.id} className="hover:bg-[#fbfcff]">
                <td className="px-4 py-4"><div className="flex items-center gap-3"><img src={provider.image || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=80&h=80&fit=crop"} alt="" className="h-10 w-10 rounded-xl object-cover" /><div><p className="font-semibold text-[#25304b]">{provider.name}</p><p className="mt-0.5 text-[10px] text-slate-400">{provider.organization}</p></div></div></td>
                <td className="px-4 py-4 font-mono text-[11px] text-[#2740BA]">{provider.taxCode}</td>
                <td className="px-4 py-4 text-slate-600">{provider.representative}</td>
                <td className="px-4 py-4"><p className="text-slate-600">{provider.phone}</p><p className="mt-0.5 text-[10px] text-slate-400">{provider.email}</p></td>
                <td className="px-4 py-4"><span className="inline-flex items-center gap-1 rounded-full bg-[#e8f5ed] px-2.5 py-1 text-[10px] font-bold text-[#1f7a45]"><CheckCircle2 className="h-3 w-3" /> Đã đủ chứng nhận</span><p className="mt-1 max-w-[180px] truncate text-[10px] text-slate-400">{provider.connectedCertificate}</p></td>
                <td className="px-4 py-4"><div className="flex items-center gap-1.5"><button onClick={() => setEditing(provider)} className="rounded-lg border border-[#e4e8f0] p-2 text-[#2740BA] hover:bg-[#edf0ff]" aria-label="Sửa"><Pencil className="h-3.5 w-3.5" /></button><button onClick={() => { if (window.confirm(`Xóa ${provider.name}?`)) setProviders((current) => current.filter((item) => item.id !== provider.id)); }} className="rounded-lg border border-[#f5bcbc] p-2 text-[#c0392b] hover:bg-[#fef0f0]" aria-label="Xóa"><Trash2 className="h-3.5 w-3.5" /></button></div></td>
              </tr>)}
              {!visible.length && <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">Không có đơn vị phù hợp.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {editing !== undefined && <ProviderForm provider={editing} onClose={() => setEditing(undefined)} onSave={(value) => { setProviders((current) => editing ? current.map((item) => item.id === editing.id ? { ...value, id: editing.id } : item) : [...current, { ...value, id: Date.now() }]); setEditing(undefined); }} />}
    </DashboardShell>
  );
}