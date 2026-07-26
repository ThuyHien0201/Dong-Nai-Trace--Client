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
  Check,
  Clock,
  X,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Star,
  QrCode,
  Link2,
  Download,
  RefreshCw,
  Leaf,
  Truck,
  Package,
  FlaskConical,
  Sprout,
  Store,
  FileText,
  AlertCircle,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────
type ProductStatus =
  | "Chờ duyệt"
  | "Đã duyệt"
  | "Đã có truy xuất nguồn gốc"
  | "Từ chối";

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
  category: string;
  description: string;
  hasTrace: boolean;
}

// ─── Mock data ───────────────────────────────────────────────────────────────
const mockProducts: Product[] = [
  {
    id: "SP-001",
    name: "Bưởi Tân Triều",
    company: "Cơ sở Bưởi Tân Triều",
    sector: "OCOP",
    status: "Đã có truy xuất nguồn gốc",
    price: "45.000",
    unit: "kg",
    region: "Vĩnh Cửu",
    certifications: ["OCOP 4★", "VietGAP"],
    emoji: "🍊",
    category: "Trái cây",
    description:
      "Bưởi Tân Triều – đặc sản nổi tiếng vùng Vĩnh Cửu, được trồng theo quy trình VietGAP, không thuốc trừ sâu hóa học. Vỏ mỏng, múi ngọt thanh, mọng nước, đạt chuẩn OCOP 4 sao.",
    hasTrace: true,
  },
  {
    id: "SP-002",
    name: "Mật ong rừng Định Quán",
    company: "HTX Ong Mật Định Quán",
    sector: "Nông sản",
    status: "Chờ duyệt",
    price: "180.000",
    unit: "lọ",
    region: "Định Quán",
    certifications: ["OCOP 3★"],
    emoji: "🍯",
    category: "Thực phẩm",
    description:
      "Mật ong nguyên chất từ rừng nguyên sinh Định Quán, thu hoạch thủ công theo mùa, không pha trộn. Giàu enzyme tự nhiên, màu vàng hổ phách, hương thơm đặc trưng.",
    hasTrace: false,
  },
  {
    id: "SP-003",
    name: "Cá điêu hồng Nhơn Trạch",
    company: "Trại thủy sản NT",
    sector: "Thủy sản",
    status: "Đã duyệt",
    price: "75.000",
    unit: "kg",
    region: "Nhơn Trạch",
    certifications: ["VietGAP"],
    emoji: "🐟",
    category: "Thủy sản",
    description:
      "Cá điêu hồng nuôi ao lồng tại Nhơn Trạch, thức ăn công nghiệp đạt chuẩn, không sử dụng chất kháng sinh cấm. Thịt chắc, thơm ngon, đạt tiêu chuẩn VietGAP.",
    hasTrace: false,
  },
  {
    id: "SP-004",
    name: "Thanh long ruột đỏ",
    company: "Nông trại Long Thành",
    sector: "Nông sản",
    status: "Từ chối",
    price: "35.000",
    unit: "kg",
    region: "Long Thành",
    certifications: [],
    emoji: "🫐",
    category: "Trái cây",
    description:
      "Thanh long ruột đỏ trồng tại Long Thành, thu hoạch theo vụ. Đặc điểm: vỏ đỏ đẹp, ruột đỏ tươi, vị ngọt nhẹ.",
    hasTrace: false,
  },
  {
    id: "SP-005",
    name: "Sầu riêng Xuân Lộc",
    company: "HTX Xuân Lộc",
    sector: "OCOP",
    status: "Đã có truy xuất nguồn gốc",
    price: "120.000",
    unit: "kg",
    region: "Xuân Lộc",
    certifications: ["OCOP 4★", "GlobalGAP"],
    emoji: "🍈",
    category: "Trái cây",
    description:
      "Sầu riêng Ri6 và Musang King trồng tại Xuân Lộc, đất đỏ bazan giàu dinh dưỡng. Quy trình canh tác GlobalGAP, kiểm soát dư lượng thuốc BVTV chặt chẽ.",
    hasTrace: true,
  },
  {
    id: "SP-006",
    name: "Tôm thẻ chân trắng",
    company: "Trại tôm Long Khánh",
    sector: "Thủy sản",
    status: "Chờ duyệt",
    price: "210.000",
    unit: "kg",
    region: "Long Khánh",
    certifications: ["HACCP"],
    emoji: "🦐",
    category: "Thủy sản",
    description:
      "Tôm thẻ chân trắng nuôi ao HDPE công nghệ cao tại Long Khánh. Kiểm soát vi sinh, không kháng sinh, đạt tiêu chuẩn HACCP, phù hợp xuất khẩu.",
    hasTrace: false,
  },
  {
    id: "SP-007",
    name: "Cà phê Robusta Định Quán",
    company: "Công ty TNHH Cà phê DNT",
    sector: "Nông sản",
    status: "Đã duyệt",
    price: "95.000",
    unit: "kg",
    region: "Định Quán",
    certifications: ["4C", "Rainforest Alliance"],
    emoji: "☕",
    category: "Nông sản",
    description:
      "Cà phê Robusta trồng trên đất đỏ bazan Định Quán, độ cao 400–600m. Chứng nhận 4C và Rainforest Alliance, canh tác bền vững, không phá rừng.",
    hasTrace: false,
  },
  {
    id: "SP-008",
    name: "Tiêu đen Vĩnh Cửu",
    company: "HTX Tiêu Vĩnh Cửu",
    sector: "OCOP",
    status: "Đã có truy xuất nguồn gốc",
    price: "150.000",
    unit: "kg",
    region: "Vĩnh Cửu",
    certifications: ["OCOP 3★", "Organic"],
    emoji: "⚫",
    category: "Gia vị",
    description:
      "Tiêu đen hữu cơ vùng Vĩnh Cửu, trồng theo phương pháp canh tác hữu cơ, không phân bón hóa học. Hạt chắc, mùi thơm nồng, độ cay vừa phải.",
    hasTrace: true,
  },
];

const regions = ["Tất cả địa bàn", "Vĩnh Cửu", "Định Quán", "Nhơn Trạch", "Long Thành", "Xuân Lộc", "Long Khánh", "Biên Hòa", "Trảng Bom"];
const sectors = ["Tất cả ngành", "OCOP", "Nông sản", "Thủy sản", "Thực phẩm CB", "Dược liệu", "Chăn nuôi"];

// ─── Status config ───────────────────────────────────────────────────────────
const statusConfig: Record<ProductStatus, { cls: string; dotCls: string; icon: React.ReactNode }> = {
  "Chờ duyệt": {
    cls: "bg-[#fff4ed] text-[#E8650A] border border-[#fcd9bb]",
    dotCls: "bg-[#E8650A]",
    icon: <Clock className="h-2.5 w-2.5" />,
  },
  "Đã duyệt": {
    cls: "bg-[#e8f5ed] text-[#1f7a45] border border-[#b8e2c8]",
    dotCls: "bg-[#1f7a45]",
    icon: <Check className="h-2.5 w-2.5" />,
  },
  "Đã có truy xuất nguồn gốc": {
    cls: "bg-[#e6f7f7] text-[#0e7c7c] border border-[#9edad9]",
    dotCls: "bg-[#0e7c7c]",
    icon: <Link2 className="h-2.5 w-2.5" />,
  },
  "Từ chối": {
    cls: "bg-[#fef0f0] text-[#c0392b] border border-[#f5bcbc]",
    dotCls: "bg-[#c0392b]",
    icon: <X className="h-2.5 w-2.5" />,
  },
};

function StatusBadge({ status }: { status: ProductStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${cfg.cls}`}>
      {cfg.icon} {status}
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

// ─── Screen 1: Product card (grid) ──────────────────────────────────────────
function ProductCard({ product, onView }: { product: Product; onView: () => void }) {
  const cfg = statusConfig[product.status];
  return (
    <div className="flex flex-col rounded-2xl border border-[#e4e8f0] bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex h-36 items-center justify-center rounded-t-2xl bg-[#f7f8fd] text-6xl">
        {product.emoji}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-bold text-[13px] text-[#1d2944] leading-snug">{product.name}</p>
          <StatusBadge status={product.status} />
        </div>
        <p className="mt-0.5 text-[11px] text-slate-400">{product.company}</p>
        <p className="mt-0.5 text-[10px] text-slate-300">{product.region} · {product.sector}</p>
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
          <button
            onClick={onView}
            className="flex items-center gap-1.5 rounded-xl border border-[#2740BA] px-3 py-1.5 text-[10px] font-semibold text-[#2740BA] hover:bg-[#edf0ff] transition-colors"
          >
            <Eye className="h-3 w-3" /> Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 2: Basic info + approval ────────────────────────────────────────
function ProductDetail({
  product,
  onBack,
  initialTab,
}: {
  product: Product;
  onBack: () => void;
  initialTab?: "basic" | "trace";
}) {
  const [comment, setComment] = useState("");
  const [decision, setDecision] = useState<"approved" | "rejected" | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<"basic" | "trace">(
    product.status === "Đã có truy xuất nguồn gốc" ? (initialTab ?? "trace") : "basic"
  );

  const emojis = [product.emoji, "📦", "🏷️"];
  const isPending = product.status === "Chờ duyệt";
  const isTrace = product.status === "Đã có truy xuất nguồn gốc";
  const showTabs = isTrace || product.status === "Đã duyệt";

  const effectiveStatus =
    decision === "approved" ? "Đã duyệt" : decision === "rejected" ? "Từ chối" : product.status;

  // Timeline steps for traceability
  const traceSteps = [
    {
      icon: Sprout,
      label: "Gieo trồng / Nuôi trồng",
      date: "10/01/2025",
      desc: "Giống được kiểm định và gieo trồng tại vùng canh tác đã đăng ký.",
      color: "#1f7a45",
      done: true,
    },
    {
      icon: Leaf,
      label: "Chăm sóc",
      date: "15/02/2025",
      desc: "Bón phân hữu cơ, phun thuốc BVTV sinh học theo lịch khuyến cáo.",
      color: "#2e9fbf",
      done: true,
    },
    {
      icon: Package,
      label: "Thu hoạch",
      date: "20/04/2025",
      desc: "Thu hoạch đúng độ chín, không sử dụng chất bảo quản sau thu hoạch.",
      color: "#E8650A",
      done: true,
    },
    {
      icon: FlaskConical,
      label: "Sơ chế / Đóng gói",
      date: "22/04/2025",
      desc: "Phân loại, làm sạch và đóng gói tại kho sơ chế đạt chuẩn VSATTP.",
      color: "#7c3aed",
      done: true,
    },
    {
      icon: Truck,
      label: "Vận chuyển",
      date: "25/04/2025",
      desc: "Vận chuyển bằng xe lạnh đạt chuẩn, nhiệt độ 4–8°C, theo lộ trình đã khai báo.",
      color: "#2740BA",
      done: true,
    },
    {
      icon: Store,
      label: "Phân phối",
      date: "27/04/2025",
      desc: "Phân phối đến các điểm bán lẻ và siêu thị đối tác trong tỉnh.",
      color: "#0e7c7c",
      done: false,
    },
  ];

  const approvalTimeline = [
    { action: "Hồ sơ được tiếp nhận", actor: "Hệ thống", time: "12/04/2025 08:15", done: true, color: "#2740BA" },
    { action: "Xác minh thông tin doanh nghiệp", actor: "Admin · Nguyễn Hoàng", time: "12/04/2025 10:30", done: true, color: "#4f9a77" },
    ...(product.status === "Đã duyệt" ? [{ action: "Phê duyệt hồ sơ sản phẩm", actor: "Admin · Nguyễn Hoàng", time: "13/04/2025 09:05", done: true, color: "#1f7a45" }] : []),
    ...(product.status === "Từ chối" ? [{ action: "Từ chối hồ sơ sản phẩm", actor: "Admin · Minh Anh", time: "13/04/2025 11:20", done: true, color: "#c0392b" }] : []),
  ];

  return (
    <DashboardShell
      title={isPending ? "Phê duyệt sản phẩm" : "Chi tiết sản phẩm"}
      subtitle={product.name}
    >
      {/* Back */}
      <button
        onClick={onBack}
        className="mb-5 flex items-center gap-1.5 text-[12px] font-medium text-slate-500 hover:text-[#2740BA] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại danh sách sản phẩm
      </button>

      {/* Decision banner */}
      {decision && (
        <div className={`mb-5 flex items-center gap-3 rounded-2xl border p-4 ${decision === "approved" ? "border-[#b8e2c8] bg-[#e8f5ed] text-[#1f7a45]" : "border-[#f5bcbc] bg-[#fef0f0] text-[#c0392b]"}`}>
          {decision === "approved" ? <CheckCircle className="h-5 w-5 shrink-0" /> : <XCircle className="h-5 w-5 shrink-0" />}
          <p className="text-[13px] font-semibold">
            {decision === "approved" ? "Sản phẩm đã được phê duyệt thành công." : "Sản phẩm đã bị từ chối. Doanh nghiệp sẽ nhận được thông báo."}
          </p>
        </div>
      )}

      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#E8650A]">Sản phẩm</p>
          <h2 className="mt-1 text-[20px] font-bold tracking-[-0.04em] text-[#1d2944]">{product.name}</h2>
        </div>
        <StatusBadge status={effectiveStatus as ProductStatus} />
      </div>

      {/* Tabs (for approved/trace) */}
      {showTabs && (
        <div className="mb-5 flex gap-1 rounded-xl border border-[#e4e8f0] bg-[#f7f8fd] p-1">
          <button
            onClick={() => setActiveTab("basic")}
            className={`flex-1 rounded-lg py-2 text-[12px] font-semibold transition-colors ${activeTab === "basic" ? "bg-white text-[#2740BA] shadow-sm" : "text-slate-500 hover:text-[#2740BA]"}`}
          >
            Thông tin cơ bản
          </button>
          <button
            onClick={() => setActiveTab("trace")}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-[12px] font-semibold transition-colors ${activeTab === "trace" ? "bg-white text-[#0e7c7c] shadow-sm" : "text-slate-500 hover:text-[#0e7c7c]"}`}
          >
            <Link2 className="h-3 w-3" /> Truy xuất nguồn gốc
          </button>
        </div>
      )}

      {/* ── TAB: Thông tin cơ bản ─────────────────────────────────────────── */}
      {(!showTabs || activeTab === "basic") && (
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

            {/* Product info */}
            <div className="rounded-2xl border border-[#e4e8f0] bg-white p-6 shadow-sm">
              <p className="mb-4 text-[13px] font-bold text-[#1d2944]">Thông tin sản phẩm</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-[12px]">
                {[
                  ["Tên sản phẩm", product.name],
                  ["Danh mục", product.category],
                  ["Ngành hàng", product.sector],
                  ["Đơn vị tính", product.unit],
                  ["Khu vực", product.region],
                  ["Mã sản phẩm", product.id],
                  ["Doanh nghiệp", product.company],
                  ["Giá niêm yết", `${product.price}đ/${product.unit}`],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{k}</p>
                    <p className="mt-1 font-medium text-[#25304b]">{v}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Chứng nhận</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.certifications.length > 0 ? product.certifications.map((c) => (
                    <span key={c} className="flex items-center gap-1.5 rounded-lg bg-[#edf0ff] px-3 py-1 text-[11px] font-semibold text-[#2740BA]">
                      <Star className="h-3 w-3" /> {c}
                    </span>
                  )) : <p className="text-[12px] text-slate-400 italic">Chưa có chứng nhận</p>}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Mô tả sản phẩm</p>
                <p className="mt-2 text-[12px] leading-5 text-slate-500">{product.description}</p>
              </div>
            </div>

            {/* Approval history (non-pending) */}
            {!isPending && (
              <div className="rounded-2xl border border-[#e4e8f0] bg-white p-6 shadow-sm">
                <p className="mb-5 text-[13px] font-bold text-[#1d2944]">Lịch sử xử lý</p>
                <div className="space-y-0">
                  {approvalTimeline.map((item, i) => (
                    <div key={i} className="relative flex gap-4 pb-5 last:pb-0">
                      {i < approvalTimeline.length - 1 && (
                        <span className="absolute left-[11px] top-6 h-full w-px bg-[#e4e8f0]" />
                      )}
                      <div
                        className="relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                        style={{ background: item.color, boxShadow: `0 0 0 3px ${item.color}22` }}
                      >
                        <Check className="h-3 w-3 text-white" strokeWidth={3} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] font-semibold text-[#25304b]">{item.action}</p>
                        <p className="mt-0.5 text-[10px] text-slate-400">{item.actor} · {item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="space-y-5">
            {/* Pending: decision card */}
            {isPending && (
              <div className="rounded-2xl border border-[#e4e8f0] bg-white p-6 shadow-sm">
                <p className="mb-4 text-[13px] font-bold text-[#1d2944]">Quyết định phê duyệt</p>
                <div className="mb-4 rounded-xl border border-[#e4e8f0] bg-[#f9fafb] p-3">
                  <p className="text-[11px] font-semibold text-slate-500">Trạng thái hiện tại</p>
                  <StatusBadge status={product.status} />
                </div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-500">Ghi chú / Lý do</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder="Nhập ghi chú hoặc lý do từ chối..."
                  className="w-full resize-none rounded-xl border border-[#e4e8f0] bg-[#f9fafb] p-3 text-[12px] outline-none focus:border-[#2740BA] focus:bg-white focus:ring-2 focus:ring-[#2740BA]/15"
                />
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setDecision("approved")}
                    className={`flex items-center justify-center gap-2 rounded-xl py-3.5 text-[13px] font-bold transition-all ${decision === "approved" ? "bg-[#1f7a45] text-white" : "bg-[#2740BA] text-white hover:bg-[#1e33a0] shadow-[0_4px_14px_rgba(39,64,186,.25)]"}`}
                  >
                    <CheckCircle className="h-4 w-4" /> Phê duyệt
                  </button>
                  <button
                    onClick={() => setDecision("rejected")}
                    className={`flex items-center justify-center gap-2 rounded-xl border-2 py-3.5 text-[13px] font-bold transition-all ${decision === "rejected" ? "border-[#c0392b] bg-[#c0392b] text-white" : "border-[#e04040] bg-white text-[#c0392b] hover:bg-[#fef0f0]"}`}
                  >
                    <XCircle className="h-4 w-4" /> Từ chối
                  </button>
                </div>
              </div>
            )}

            {/* Approved: traceability link */}
            {product.status === "Đã duyệt" && (
              <div className="rounded-2xl border border-[#e4e8f0] bg-white p-6 shadow-sm">
                <p className="mb-3 text-[13px] font-bold text-[#1d2944]">Truy xuất nguồn gốc</p>
                <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-[#e4e8f0] bg-[#f9fafb] p-5 text-center">
                  <Link2 className="h-8 w-8 text-slate-300" />
                  <p className="text-[12px] font-medium text-slate-400">Chưa có dữ liệu truy xuất nguồn gốc</p>
                  <p className="text-[11px] text-slate-300">Sản phẩm đã được duyệt nhưng chưa có đơn vị giải pháp đẩy dữ liệu lên.</p>
                </div>
              </div>
            )}

            {/* QR preview (pending only) */}
            {isPending && (
              <div className="rounded-2xl border border-[#e4e8f0] bg-white p-6 shadow-sm">
                <p className="mb-3 text-[13px] font-bold text-[#1d2944]">Mã QR xem trước</p>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-[#f7f8fd]">
                    <QrCode className="h-12 w-12 text-[#2740BA] opacity-40" />
                  </div>
                  <p className="text-center text-[10px] text-slate-400">{product.id} · QR sẽ được cấp sau khi phê duyệt</p>
                </div>
              </div>
            )}

            {/* Status card (rejected) */}
            {product.status === "Từ chối" && (
              <div className="rounded-2xl border border-[#f5bcbc] bg-[#fef0f0] p-5 shadow-sm">
                <div className="flex items-center gap-2 text-[#c0392b]">
                  <XCircle className="h-5 w-5 shrink-0" />
                  <p className="text-[13px] font-bold">Hồ sơ bị từ chối</p>
                </div>
                <p className="mt-2 text-[12px] text-[#c0392b]/70">
                  Sản phẩm này đã bị từ chối. Doanh nghiệp cần cập nhật thông tin và đăng ký lại.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB: Truy xuất nguồn gốc ─────────────────────────────────────── */}
      {showTabs && activeTab === "trace" && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_340px]">
          {/* Left: timeline */}
          <div className="space-y-5">
            {/* Solution provider */}
            <div className="rounded-2xl border border-[#e4e8f0] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Đơn vị giải pháp</p>
                  <p className="mt-1 text-[14px] font-bold text-[#1d2944]">iTrace Việt Nam</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">Cập nhật lần cuối: 27/04/2025 · 14:32</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#edf0ff]">
                  <Link2 className="h-6 w-6 text-[#2740BA]" />
                </div>
              </div>
            </div>

            {/* Trace timeline */}
            <div className="rounded-2xl border border-[#e4e8f0] bg-white p-6 shadow-sm">
              <p className="mb-6 text-[13px] font-bold text-[#1d2944]">Quy trình truy xuất</p>
              <div className="space-y-0">
                {traceSteps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={i} className="relative flex gap-4 pb-7 last:pb-0">
                      {i < traceSteps.length - 1 && (
                        <span
                          className="absolute left-[18px] top-10 w-0.5"
                          style={{ height: "calc(100% - 16px)", background: step.done ? step.color + "40" : "#e4e8f0" }}
                        />
                      )}
                      <div
                        className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                        style={{
                          background: step.done ? step.color : "#f0f2f8",
                          boxShadow: step.done ? `0 0 0 4px ${step.color}18` : "none",
                        }}
                      >
                        <Icon className={`h-4 w-4 ${step.done ? "text-white" : "text-slate-400"}`} />
                      </div>
                      <div className="min-w-0 flex-1 pt-1">
                        <div className="flex items-center gap-2">
                          <p className="text-[13px] font-semibold text-[#25304b]">{step.label}</p>
                          {!step.done && (
                            <span className="rounded-full border border-[#e4e8f0] bg-[#f7f8fd] px-2 py-0.5 text-[9px] font-semibold text-slate-400">
                              Chờ cập nhật
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[10px] text-slate-400">{step.date}</p>
                        <p className="mt-1.5 rounded-xl bg-[#f7f8fd] p-3 text-[11px] leading-4.5 text-slate-500">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Certifications/documents */}
            <div className="rounded-2xl border border-[#e4e8f0] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[13px] font-bold text-[#1d2944]">Kết quả kiểm định / Chứng nhận lô hàng</p>
                <span className="rounded-full bg-[#edf0ff] px-2 py-0.5 text-[10px] font-bold text-[#2740BA]">3 file</span>
              </div>
              <div className="space-y-2">
                {[
                  { name: "Kết quả kiểm nghiệm lô hàng tháng 4/2025", type: "PDF", size: "1.8 MB", color: "#E8650A" },
                  { name: "Chứng nhận VietGAP – lô xuất tháng 4", type: "PDF", size: "0.9 MB", color: "#2740BA" },
                  { name: "Biên bản kiểm tra vùng trồng", type: "PDF", size: "2.3 MB", color: "#E8650A" },
                ].map((doc) => (
                  <div key={doc.name} className="group flex items-center gap-3 rounded-xl border border-[#e4e8f0] bg-[#f9fafb] p-3.5 transition-all hover:border-[#2740BA] hover:bg-[#f0f3ff]">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white text-[9px] font-bold" style={{ background: doc.color }}>
                      {doc.type}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-semibold text-[#25304b]">{doc.name}</p>
                      <p className="mt-0.5 text-[10px] text-slate-400">{doc.type} · {doc.size}</p>
                    </div>
                    <button className="flex items-center gap-1 rounded-lg border border-[#e4e8f0] bg-white px-2 py-1 text-[10px] font-semibold text-slate-500 transition-colors group-hover:border-[#2740BA] group-hover:text-[#2740BA]">
                      <Download className="h-3 w-3" /> Tải
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: QR + actions */}
          <div className="space-y-5">
            {/* QR */}
            <div className="rounded-2xl border border-[#e4e8f0] bg-white p-6 shadow-sm">
              <p className="mb-4 text-[13px] font-bold text-[#1d2944]">Mã QR truy xuất</p>
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-36 w-36 items-center justify-center rounded-2xl border-2 border-[#dce3ff] bg-[#f7f8fd]">
                  <QrCode className="h-20 w-20 text-[#2740BA]" />
                </div>
                <p className="font-mono text-[11px] font-bold text-[#25304b]">{product.id}-QR-2025</p>
                <p className="text-center text-[10px] text-slate-400">Quét để xem thông tin truy xuất công khai</p>
                <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#2740BA] py-2.5 text-[12px] font-semibold text-[#2740BA] hover:bg-[#edf0ff] transition-colors">
                  <Download className="h-3.5 w-3.5" /> Tải về QR Code
                </button>
              </div>
            </div>

            {/* Identifier */}
            <div className="rounded-2xl border border-[#e4e8f0] bg-white p-5 shadow-sm">
              <p className="mb-3 text-[13px] font-bold text-[#1d2944]">Mã định danh sản phẩm</p>
              <div className="flex items-center gap-2 rounded-xl border border-[#e4e8f0] bg-[#f7f8fd] px-3 py-2.5">
                <QrCode className="h-3.5 w-3.5 shrink-0 text-[#2740BA]" />
                <span className="flex-1 font-mono text-[12px] font-bold text-[#25304b] tracking-wide">{product.id}-DNT-2025</span>
              </div>
            </div>

            {/* Request update */}
            <button className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#e4e8f0] bg-white py-4 text-[12px] font-semibold text-slate-400 hover:border-[#E8650A] hover:text-[#E8650A] transition-colors">
              <AlertCircle className="h-4 w-4" />
              Yêu cầu cập nhật lại dữ liệu
            </button>

            {/* Summary card */}
            <div className="rounded-2xl border border-[#9edad9] bg-[#e6f7f7] p-5">
              <div className="flex items-center gap-2 text-[#0e7c7c]">
                <Link2 className="h-4 w-4 shrink-0" />
                <p className="text-[12px] font-bold">Truy xuất đầy đủ</p>
              </div>
              <p className="mt-1.5 text-[11px] text-[#0e7c7c]/70">
                5/6 mốc quy trình đã được xác nhận. Đang chờ cập nhật bước Phân phối.
              </p>
              <div className="mt-3 h-1.5 rounded-full bg-[#9edad9]">
                <div className="h-1.5 rounded-full bg-[#0e7c7c]" style={{ width: "83%" }} />
              </div>
              <p className="mt-1 text-right text-[10px] font-bold text-[#0e7c7c]">83%</p>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

// ─── Main export: Products list ──────────────────────────────────────────────
export default function Products() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [regionFilter, setRegionFilter] = useState("Tất cả địa bàn");
  const [sectorFilter, setSectorFilter] = useState("Tất cả ngành");
  const [selected, setSelected] = useState<Product | null>(null);
  const [selectedTab, setSelectedTab] = useState<"basic" | "trace">("basic");

  if (selected) {
    return (
      <ProductDetail
        product={selected}
        onBack={() => setSelected(null)}
        initialTab={selectedTab}
      />
    );
  }

  const allStatuses = ["Tất cả", "Chờ duyệt", "Đã duyệt", "Đã có truy xuất nguồn gốc", "Từ chối"];
  const statusCounts: Record<string, number> = { "Tất cả": mockProducts.length };
  (["Chờ duyệt", "Đã duyệt", "Đã có truy xuất nguồn gốc", "Từ chối"] as ProductStatus[]).forEach((s) => {
    statusCounts[s] = mockProducts.filter((p) => p.status === s).length;
  });

  const filtered = mockProducts.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) || p.company.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    const matchStatus = statusFilter === "Tất cả" || p.status === statusFilter;
    const matchRegion = regionFilter === "Tất cả địa bàn" || p.region === regionFilter;
    const matchSector = sectorFilter === "Tất cả ngành" || p.sector === sectorFilter;
    return matchSearch && matchStatus && matchRegion && matchSector;
  });

  function openDetail(product: Product, tab: "basic" | "trace" = "basic") {
    setSelectedTab(product.status === "Đã có truy xuất nguồn gốc" ? "trace" : tab);
    setSelected(product);
  }

  return (
    <DashboardShell title="Quản lý sản phẩm" subtitle="Danh sách và phê duyệt sản phẩm">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#E8650A]">Quản lý</p>
          <h2 className="mt-1.5 text-[24px] font-bold tracking-[-0.05em] text-[#1d2944]">Sản phẩm</h2>
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

      {/* Status tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {allStatuses.map((s) => {
          const active = statusFilter === s;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[11px] font-semibold transition-colors ${active ? "bg-[#2740BA] text-white shadow-[0_3px_10px_rgba(39,64,186,.2)]" : "border border-[#e4e8f0] bg-white text-slate-500 hover:border-[#2740BA] hover:text-[#2740BA]"}`}
            >
              {s}
              <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${active ? "bg-white/20 text-white" : "bg-[#f0f2f8] text-slate-500"}`}>
                {statusCounts[s] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#e4e8f0] bg-white px-4 py-3 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm tên, doanh nghiệp, mã sản phẩm..."
            className="h-9 w-full rounded-xl border border-[#e4e8f0] bg-[#f9fafb] pl-9 pr-4 text-[12px] outline-none focus:border-[#2740BA] focus:bg-white focus:ring-2 focus:ring-[#2740BA]/15"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
          <SelectFilter value={regionFilter} onChange={setRegionFilter} options={regions} />
          <SelectFilter value={sectorFilter} onChange={setSectorFilter} options={sectors} />
        </div>
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

      {/* Results count */}
      <p className="mt-3 text-[11px] text-slate-400">
        Hiển thị {filtered.length} sản phẩm
      </p>

      {/* Grid view */}
      {viewMode === "grid" && (
        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.length === 0 ? (
            <div className="col-span-full py-16 text-center text-[12px] text-slate-400">
              Không tìm thấy sản phẩm phù hợp bộ lọc.
            </div>
          ) : filtered.map((p) => (
            <ProductCard key={p.id} product={p} onView={() => openDetail(p)} />
          ))}
        </div>
      )}

      {/* List view */}
      {viewMode === "list" && (
        <div className="mt-2 overflow-hidden rounded-2xl border border-[#e4e8f0] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-[12px]">
              <thead>
                <tr className="border-b border-[#e4e8f0] bg-[#f9fafb]">
                  {["Sản phẩm", "Doanh nghiệp", "Ngành hàng", "Khu vực", "Giá", "Trạng thái", ""].map((h) => (
                    <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f2f8]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-[12px] text-slate-400">
                      Không tìm thấy sản phẩm phù hợp bộ lọc.
                    </td>
                  </tr>
                ) : filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[#f9fafb] transition-colors">
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
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        {p.status === "Chờ duyệt" && (
                          <button
                            onClick={() => openDetail(p, "basic")}
                            className="flex items-center gap-1 rounded-lg border border-[#2740BA] px-2.5 py-1 text-[10px] font-semibold text-[#2740BA] hover:bg-[#edf0ff] transition-colors"
                          >
                            <CheckCircle className="h-3 w-3" /> Duyệt
                          </button>
                        )}
                        <button
                          onClick={() => openDetail(p)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-[#edf0ff] hover:text-[#2740BA] transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
