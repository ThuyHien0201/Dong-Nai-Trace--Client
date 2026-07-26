import { useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  Search,
  Plus,
  FileDown,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Lock,
  Check,
  Clock,
  X,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Tag,
  ChevronDown,
  Star,
} from "lucide-react";

type ProductStatus = "Đã duyệt" | "Chờ duyệt" | "Từ chối";

interface Product {
  id: string;
  name: string;
  company: string;
  sector: string;
  status: ProductStatus;
  price: string;
  unit: string;
  region: string;
  certifications: string[];
  emoji: string;
}

const mockProducts: Product[] = [
  { id: "SP-001", name: "Bưởi Tân Triều", company: "Cơ sở Bưởi Tân Triều", sector: "OCOP", status: "Đã duyệt", price: "45.000", unit: "kg", region: "Vĩnh Cửu", certifications: ["OCOP 4★", "VietGAP"], emoji: "🍊" },
  { id: "SP-002", name: "Mật ong rừng Định Quán", company: "HTX Ong Mật Định Quán", sector: "Nông sản", status: "Chờ duyệt", price: "180.000", unit: "lọ", region: "Định Quán", certifications: ["OCOP 3★"], emoji: "🍯" },
  { id: "SP-003", name: "Cá điêu hồng Nhơn Trạch", company: "Trại thủy sản NT", sector: "Thủy sản", status: "Đã duyệt", price: "75.000", unit: "kg", region: "Nhơn Trạch", certifications: ["VietGAP"], emoji: "🐟" },
  { id: "SP-004", name: "Thanh long ruột đỏ", company: "Nông trại Long Thành", sector: "Nông sản", status: "Từ chối", price: "35.000", unit: "kg", region: "Long Thành", certifications: [], emoji: "🫐" },
  { id: "SP-005", name: "Sầu riêng Xuân Lộc", company: "HTX Xuân Lộc", sector: "OCOP", status: "Đã duyệt", price: "120.000", unit: "kg", region: "Xuân Lộc", certifications: ["OCOP 4★", "GlobalGAP"], emoji: "🍈" },
  { id: "SP-006", name: "Tôm thẻ chân trắng", company: "Trại tôm Long Khánh", sector: "Thủy sản", status: "Chờ duyệt", price: "210.000", unit: "kg", region: "Long Khánh", certifications: ["HACCP"], emoji: "🦐" },
];

const statusConfig: Record<ProductStatus, { cls: string; icon: React.ReactNode }> = {
  "Đã duyệt": {
    cls: "bg-[#e8f5ed] text-[#1f7a45] border border-[#b8e2c8]",
    icon: <Check className="h-2.5 w-2.5" />,
  },
  "Chờ duyệt": {
    cls: "bg-[#fff4ed] text-[#E8650A] border border-[#fcd9bb]",
    icon: <Clock className="h-2.5 w-2.5" />,
  },
  "Từ chối": {
    cls: "bg-[#fef0f0] text-[#c0392b] border border-[#f5bcbc]",
    icon: <X className="h-2.5 w-2.5" />,
  },
};

function ProductCard({ product, onApprove }: { product: Product; onApprove: () => void }) {
  const cfg = statusConfig[product.status];
  return (
    <div className="flex flex-col rounded-2xl border border-[#e4e8f0] bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-3 flex h-32 items-center justify-center rounded-xl bg-[#f7f8fd] text-5xl">
        {product.emoji}
      </div>
      <div className="flex items-start justify-between gap-2">
        <p className="font-bold text-[13px] text-[#1d2944]">{product.name}</p>
        <span className={`inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold ${cfg.cls}`}>
          {cfg.icon} {product.status}
        </span>
      </div>
      <p className="mt-0.5 text-[11px] text-slate-400">{product.company}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {product.certifications.map((c) => (
          <span key={c} className="rounded-md bg-[#edf0ff] px-2 py-0.5 text-[9px] font-semibold text-[#2740BA]">
            {c}
          </span>
        ))}
      </div>
      <div className="mt-auto pt-3 flex items-center justify-between border-t border-[#f0f2f8]">
        <div>
          <p className="text-[13px] font-bold text-[#E8650A]">{product.price}đ</p>
          <p className="text-[10px] text-slate-400">/{product.unit}</p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onApprove}
            className="rounded-lg px-2.5 py-1.5 text-[10px] font-semibold text-[#2740BA] border border-[#2740BA] hover:bg-[#edf0ff] transition-colors"
          >
            Chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}

function ApprovalDetail({ product, onBack }: { product: Product; onBack: () => void }) {
  const [comment, setComment] = useState("");
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const emojis = [product.emoji, "📦", "🏷️"];

  return (
    <DashboardShell title="Phê duyệt sản phẩm" subtitle={product.name}>
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
            {decision === "approved" ? "Sản phẩm đã được phê duyệt." : "Sản phẩm đã bị từ chối."}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        {/* Left */}
        <div className="space-y-5">
          {/* Image carousel */}
          <div className="rounded-2xl border border-[#e4e8f0] bg-white p-5 shadow-sm">
            <div className="relative flex h-52 items-center justify-center rounded-xl bg-[#f7f8fd] text-8xl">
              {emojis[imgIdx]}
              <button
                onClick={() => setImgIdx((i) => (i - 1 + emojis.length) % emojis.length)}
                className="absolute left-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md text-slate-500 hover:text-[#2740BA]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setImgIdx((i) => (i + 1) % emojis.length)}
                className="absolute right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md text-slate-500 hover:text-[#2740BA]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 flex justify-center gap-1.5">
              {emojis.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${i === imgIdx ? "w-5 bg-[#2740BA]" : "w-1.5 bg-[#d1d8f0]"}`}
                />
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="rounded-2xl border border-[#e4e8f0] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[16px] font-bold text-[#1d2944]">{product.name}</p>
                <p className="mt-0.5 text-[12px] text-slate-400">{product.company} · {product.region}</p>
              </div>
              <div className="text-right">
                <p className="text-[18px] font-bold text-[#E8650A]">{product.price}đ</p>
                <p className="text-[11px] text-slate-400">/{product.unit}</p>
              </div>
            </div>
            <p className="text-[12px] leading-5 text-slate-500">
              Sản phẩm đặc sản vùng {product.region}, được trồng và chế biến theo quy trình nghiêm ngặt, đảm bảo an toàn thực phẩm và truy xuất nguồn gốc rõ ràng từ vùng nguyên liệu đến tay người tiêu dùng.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-[11px]">
              {[["Ngành hàng", product.sector], ["Mã sản phẩm", product.id], ["Khu vực", product.region]].map(([k, v]) => (
                <div key={k}>
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">{k}</p>
                  <p className="mt-0.5 font-medium text-[#25304b]">{v}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {product.certifications.map((c) => (
                <span key={c} className="flex items-center gap-1.5 rounded-lg bg-[#edf0ff] px-3 py-1 text-[11px] font-semibold text-[#2740BA]">
                  <Star className="h-3 w-3" /> {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: action */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-[#e4e8f0] bg-white p-6 shadow-sm">
            <p className="mb-4 text-[13px] font-bold text-[#1d2944]">Quyết định phê duyệt</p>
            <div className="mb-4 rounded-xl border border-[#e4e8f0] bg-[#f9fafb] p-3">
              <p className="text-[11px] font-semibold text-slate-500">Trạng thái hiện tại</p>
              <span className={`mt-1 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold ${statusConfig[product.status].cls}`}>
                {statusConfig[product.status].icon} {product.status}
              </span>
            </div>
            <label className="mb-1 block text-[11px] font-medium text-slate-600">Ghi chú / Lý do</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Nhập ghi chú hoặc lý do từ chối..."
              className="w-full resize-none rounded-xl border border-[#e4e8f0] bg-[#f9fafb] p-3 text-[12px] outline-none focus:border-[#2740BA] focus:bg-white focus:ring-2 focus:ring-[#2740BA]/15"
            />
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setDecision("approved")}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2740BA] py-3 text-[12px] font-bold text-white hover:bg-[#1e33a0] transition-colors"
              >
                <CheckCircle className="h-4 w-4" /> Phê duyệt
              </button>
              <button
                onClick={() => setDecision("rejected")}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#e04040] bg-white py-3 text-[12px] font-bold text-[#c0392b] hover:bg-[#fef0f0] transition-colors"
              >
                <XCircle className="h-4 w-4" /> Từ chối
              </button>
            </div>
          </div>

          {/* QR preview */}
          <div className="rounded-2xl border border-[#e4e8f0] bg-white p-6 shadow-sm">
            <p className="mb-3 text-[13px] font-bold text-[#1d2944]">Mã QR xem trước</p>
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-[#f7f8fd] text-4xl">
                <Tag className="h-12 w-12 text-[#2740BA]" />
              </div>
              <p className="text-center text-[10px] text-slate-400">{product.id} · Mã QR sẽ được cấp sau khi phê duyệt</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

export default function Products() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [approving, setApproving] = useState<Product | null>(null);

  if (approving) {
    return <ApprovalDetail product={approving} onBack={() => setApproving(null)} />;
  }

  const filtered = mockProducts.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Tất cả" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardShell title="Quản lý sản phẩm" subtitle="Danh sách và phê duyệt sản phẩm">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#E8650A]">Quản lý</p>
          <h2 className="mt-1.5 text-[24px] font-bold tracking-[-.05em] text-[#1d2944]">Sản phẩm</h2>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 rounded-xl border border-[#e4e8f0] bg-white px-3.5 py-2.5 text-[12px] font-semibold text-slate-600 hover:border-[#2740BA] hover:text-[#2740BA] transition-colors">
            <FileDown className="h-4 w-4" /> Xuất dữ liệu
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-[#E8650A] px-4 py-2.5 text-[12px] font-bold text-white hover:bg-[#d95c08] transition-colors shadow-[0_4px_14px_rgba(232,101,10,.2)]">
            <Plus className="h-4 w-4" /> Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#e4e8f0] bg-white p-4 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm tên sản phẩm..."
            className="h-9 w-full rounded-xl border border-[#e4e8f0] bg-[#f9fafb] pl-9 pr-4 text-[12px] outline-none focus:border-[#2740BA] focus:bg-white focus:ring-2 focus:ring-[#2740BA]/15"
          />
        </div>
        {["Tất cả", "Đã duyệt", "Chờ duyệt", "Từ chối"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors ${
              statusFilter === s ? "bg-[#2740BA] text-white" : "border border-[#e4e8f0] text-slate-500 hover:border-[#2740BA] hover:text-[#2740BA]"
            }`}
          >
            {s}
          </button>
        ))}
        <div className="ml-auto flex rounded-lg border border-[#e4e8f0] overflow-hidden">
          {(["grid", "list"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setViewMode(m)}
              className={`flex h-8 w-8 items-center justify-center transition-colors ${viewMode === m ? "bg-[#2740BA] text-white" : "bg-white text-slate-400 hover:text-[#2740BA]"}`}
            >
              {m === "grid" ? <LayoutGrid className="h-3.5 w-3.5" /> : <List className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Grid view */}
      {viewMode === "grid" && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onApprove={() => setApproving(p)} />
          ))}
        </div>
      )}

      {/* List view */}
      {viewMode === "list" && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-[#e4e8f0] bg-white shadow-sm">
          <table className="min-w-full text-[12px]">
            <thead>
              <tr className="border-b border-[#e4e8f0] bg-[#f9fafb]">
                {["Sản phẩm", "Doanh nghiệp", "Ngành hàng", "Khu vực", "Giá", "Trạng thái", ""].map((h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-[#f0f2f8] hover:bg-[#f9fafb] transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{p.emoji}</span>
                      <div>
                        <p className="font-semibold text-[#25304b]">{p.name}</p>
                        <p className="text-[10px] text-slate-400">{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">{p.company}</td>
                  <td className="px-4 py-3.5 text-slate-500">{p.sector}</td>
                  <td className="px-4 py-3.5 text-slate-500">{p.region}</td>
                  <td className="px-4 py-3.5 font-semibold text-[#E8650A]">{p.price}đ/{p.unit}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold ${statusConfig[p.status].cls}`}>
                      {statusConfig[p.status].icon} {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => setApproving(p)} className="rounded-lg p-1.5 text-slate-400 hover:bg-[#edf0ff] hover:text-[#2740BA] transition-colors">
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  );
}
