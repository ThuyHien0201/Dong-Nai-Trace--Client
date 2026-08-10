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
  Star,
  QrCode,
  Link2,
  Download,
  Leaf,
  Truck,
  Package,
  FlaskConical,
  Sprout,
  Store,
  AlertCircle,
  ChevronDown,
  SlidersHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────
type ProductStatus =
  | "Chờ duyệt"
  | "Đã duyệt"


interface Product {
  id: string;
  name: string;
  company: string;
  sector: string;
  status: ProductStatus;
  unit: string;
  region: string;
  certifications: string[];
  imageUrl: string;
  images: string[];
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
    status: "Đã duyệt",
    unit: "kg",
    region: "Vĩnh Cửu",
    certifications: ["OCOP 4★", "VietGAP"],
    imageUrl: "https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=400&fit=crop",
    ],
    category: "Trái cây",
    description: "Bưởi Tân Triều – đặc sản nổi tiếng vùng Vĩnh Cửu, được trồng theo quy trình VietGAP, không thuốc trừ sâu hóa học. Vỏ mỏng, múi ngọt thanh, mọng nước, đạt chuẩn OCOP 4 sao.",
    hasTrace: true,
  },
  {
    id: "SP-002",
    name: "Mật ong rừng Định Quán",
    company: "HTX Ong Mật Định Quán",
    sector: "Nông sản",
    status: "Chờ duyệt",
    unit: "lọ",
    region: "Định Quán",
    certifications: ["OCOP 3★"],
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=600&h=400&fit=crop",
    ],
    category: "Thực phẩm",
    description: "Mật ong nguyên chất từ rừng nguyên sinh Định Quán, thu hoạch thủ công theo mùa, không pha trộn. Giàu enzyme tự nhiên, màu vàng hổ phách, hương thơm đặc trưng.",
    hasTrace: false,
  },
  {
    id: "SP-003",
    name: "Cá điêu hồng Nhơn Trạch",
    company: "Trại thủy sản NT",
    sector: "Thủy sản",
    status: "Đã duyệt",
    unit: "kg",
    region: "Nhơn Trạch",
    certifications: ["VietGAP"],
    imageUrl: "https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&h=400&fit=crop",
    ],
    category: "Thủy sản",
    description: "Cá điêu hồng nuôi ao lồng tại Nhơn Trạch, thức ăn công nghiệp đạt chuẩn, không sử dụng chất kháng sinh cấm. Thịt chắc, thơm ngon, đạt tiêu chuẩn VietGAP.",
    hasTrace: false,
  },
  {
    id: "SP-004",
    name: "Thanh long ruột đỏ",
    company: "Nông trại Long Thành",
    sector: "Nông sản",
    status: "Đã duyệt",
    unit: "kg",
    region: "Long Thành",
    certifications: [],
    imageUrl: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop",
    ],
    category: "Trái cây",
    description: "Thanh long ruột đỏ trồng tại Long Thành, thu hoạch theo vụ. Đặc điểm: vỏ đỏ đẹp, ruột đỏ tươi, vị ngọt nhẹ.",
    hasTrace: false,
  },
  {
    id: "SP-005",
    name: "Sầu riêng Xuân Lộc",
    company: "HTX Xuân Lộc",
    sector: "OCOP",
    status: "Đã duyệt",
    unit: "kg",
    region: "Xuân Lộc",
    certifications: ["OCOP 4★", "GlobalGAP"],
    imageUrl: "https://images.unsplash.com/photo-1600423115367-87ea7661688f?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1600423115367-87ea7661688f?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=400&fit=crop",
    ],
    category: "Trái cây",
    description: "Sầu riêng Ri6 và Musang King trồng tại Xuân Lộc, đất đỏ bazan giàu dinh dưỡng. Quy trình canh tác GlobalGAP, kiểm soát dư lượng thuốc BVTV chặt chẽ.",
    hasTrace: true,
  },
  {
    id: "SP-006",
    name: "Tôm thẻ chân trắng",
    company: "Trại tôm Long Khánh",
    sector: "Thủy sản",
    status: "Chờ duyệt",
    unit: "kg",
    region: "Long Khánh",
    certifications: ["HACCP"],
    imageUrl: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
    ],
    category: "Thủy sản",
    description: "Tôm thẻ chân trắng nuôi ao HDPE công nghệ cao tại Long Khánh. Kiểm soát vi sinh, không kháng sinh, đạt tiêu chuẩn HACCP, phù hợp xuất khẩu.",
    hasTrace: false,
  },
  {
    id: "SP-007",
    name: "Cà phê Robusta Định Quán",
    company: "Công ty TNHH Cà phê DNT",
    sector: "Nông sản",
    status: "Đã duyệt",
    unit: "kg",
    region: "Định Quán",
    certifications: ["4C", "Rainforest Alliance"],
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=600&h=400&fit=crop",
    ],
    category: "Nông sản",
    description: "Cà phê Robusta trồng trên đất đỏ bazan Định Quán, độ cao 400–600m. Chứng nhận 4C và Rainforest Alliance, canh tác bền vững, không phá rừng.",
    hasTrace: false,
  },
  {
    id: "SP-008",
    name: "Tiêu đen Vĩnh Cửu",
    company: "HTX Tiêu Vĩnh Cửu",
    sector: "OCOP",
    status: "Đã duyệt",
    unit: "kg",
    region: "Vĩnh Cửu",
    certifications: ["OCOP 3★", "Organic"],
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop",
    ],
    category: "Gia vị",
    description: "Tiêu đen hữu cơ vùng Vĩnh Cửu, trồng theo phương pháp canh tác hữu cơ, không phân bón hóa học. Hạt chắc, mùi thơm nồng, độ cay vừa phải.",
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
  
};

function StatusBadge({ status }: { status: ProductStatus }) {
  const cfg = statusConfig[status];
  
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

// ─── QR Modal ────────────────────────────────────────────────────────────────
function QrModal({ productId, name, onClose }: { productId: string; name: string; onClose: () => void }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`https://trace.dongnai.gov.vn/sp/${productId}`)}&color=0e7c7c&bgcolor=ffffff&margin=10`;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-xs rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[14px] font-bold text-[#1d2944]">Mã QR sản phẩm</p>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-[#f1f3fa]">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col items-center gap-3">
          <img src={qrUrl} alt={`QR ${productId}`} className="h-52 w-52 rounded-xl border border-[#e4e8f0] bg-white" />
          <p className="font-mono text-[13px] font-bold text-[#0e7c7c]">{productId}-DNT-2025</p>
          <p className="text-[11px] text-slate-500 font-medium text-center">{name}</p>
          <p className="text-[10px] text-slate-400 text-center">Quét mã QR để xem thông tin truy xuất công khai</p>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#0e7c7c] py-2.5 text-[12px] font-semibold text-[#0e7c7c] hover:bg-[#e6f7f7] transition-colors">
            <Download className="h-3.5 w-3.5" /> Tải về QR Code
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 1: Product card (grid) ──────────────────────────────────────────
function ProductCard({ product, onView }: { product: Product; onView: () => void }) {
  return (
    <div className="flex flex-col rounded-2xl border border-[#e4e8f0] bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative h-40 overflow-hidden bg-[#f7f8fd]">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
       
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="font-bold text-[13px] text-[#1d2944] leading-snug">{product.name}</p>
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

// ─── Screen 2: Product detail ────────────────────────────────────────────────
function ProductDetail({
  product,
  onBack,
  initialTab,
}: {
  product: Product;
  onBack: () => void;
  initialTab?: "basic" | "trace";
}) {
  const [imgIdx, setImgIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<"basic" | "trace">(initialTab ?? "basic");
  const [qrOpen, setQrOpen] = useState(false);

  const showTabs = product.status === "Đã duyệt";

  // Timeline steps for traceability
  const traceSteps = [
    {
      icon: Sprout,
      label: "Gieo trồng / Nuôi trồng",
      date: "10/01/2025",
      desc: "Giống được kiểm định và gieo trồng tại vùng canh tác đã đăng ký.",
      color: "#1f7a45",
      done: true,
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800",

    },
    {
      icon: Leaf,
      label: "Chăm sóc",
      date: "08/07/2024",
      desc: "Tưới nước, bón phân hữu cơ theo lịch, kiểm tra sâu bệnh định kỳ.",
      color: "#2e9fbf",
      done: true,
      image: "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=800",
    },
    {
      icon: Package,
      label: "Thu hoạch",
      date: "20/04/2025",
      desc: "Thu hoạch đúng độ chín, không sử dụng chất bảo quản sau thu hoạch.",
      color: "#E8650A",
      done: true,
      image: "https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=800"
    },
    {
      icon: FlaskConical,
      label: "Sơ chế / Đóng gói",
      date: "22/04/2025",
      desc: "Phân loại, làm sạch và đóng gói tại kho sơ chế đạt chuẩn VSATTP.",
      color: "#7c3aed",
      done: true,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800"
    },
    {
      icon: Truck,
      label: "Vận chuyển",
      date: "25/04/2025",
      desc: "Vận chuyển bằng xe lạnh đạt chuẩn.",
      color: "#2740BA",
      done: true,
      image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800"
    },
    {
      icon: Store,
      label: "Phân phối",
      date: "27/04/2025",
      desc: "Phân phối đến các điểm bán lẻ.",
      color: "#0e7c7c",
      done: false,
      image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=800"
    }
  ];
  const approvalTimeline = [
    { action: "Hồ sơ được tiếp nhận", actor: "Hệ thống", time: "12/04/2025 08:15", done: true, color: "#2740BA" },
    { action: "Xác minh thông tin doanh nghiệp", actor: "Admin · Nguyễn Hoàng", time: "12/04/2025 10:30", done: true, color: "#4f9a77" },
    ...(product.status === "Đã duyệt" 
      ? [{ action: "Phê duyệt hồ sơ sản phẩm", actor: "Admin · Nguyễn Hoàng", time: "13/04/2025 09:05", done: true, color: "#1f7a45" }]
      : []),
  ];

  return (
    <DashboardShell title="Chi tiết sản phẩm" subtitle={product.name}>
      {qrOpen && <QrModal productId={product.id} name={product.name} onClose={() => setQrOpen(false)} />}

      {/* Back */}
      <button
        onClick={onBack}
        className="mb-5 flex items-center gap-1.5 text-[12px] font-medium text-slate-500 hover:text-[#2740BA] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại danh sách sản phẩm
      </button>

      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#E8650A]">Sản phẩm</p>
          <h2 className="mt-1 text-[20px] font-bold tracking-[-0.04em] text-[#1d2944]">{product.name}</h2>
        </div>
        
      </div>

      {/* Tabs */}
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

      {/* ── TAB: Thông tin cơ bản ──────────────────────────────────────────── */}
      {(!showTabs || activeTab === "basic") && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
          {/* Left */}
          <div className="space-y-5">
            {/* Image carousel */}
            <div className="rounded-2xl border border-[#e4e8f0] bg-white p-5 shadow-sm">
              <div className="relative h-56 overflow-hidden rounded-xl bg-[#f7f8fd]">
                <img
                  src={product.images[imgIdx]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                <button
                  onClick={() => setImgIdx((i) => (i - 1 + product.images.length) % product.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-md text-slate-600 hover:bg-white hover:text-[#2740BA]"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setImgIdx((i) => (i + 1) % product.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-md text-slate-600 hover:bg-white hover:text-[#2740BA]"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 flex justify-center gap-1.5">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`h-1.5 rounded-full transition-all ${i === imgIdx ? "w-5 bg-[#2740BA]" : "w-1.5 bg-[#d1d8f0]"}`}
                  />
                ))}
              </div>
              {/* Thumbnail strip */}
              <div className="mt-3 flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`h-14 w-14 overflow-hidden rounded-lg border-2 transition-all ${i === imgIdx ? "border-[#2740BA]" : "border-[#e4e8f0]"}`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
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
                  ["Đơn vị", `${product.unit}`]
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

           
          </div>

          {/* Right */}
          <div className="space-y-5">
            {/* Status + actions card */}
            <div className="rounded-2xl border border-[#e4e8f0] bg-white p-6 shadow-sm">
              <p className="mb-3 text-[13px] font-bold text-[#1d2944]">Trạng thái</p>
             

              {/* QR code button for approved/traced */}
              {(product.status === "Đã duyệt") && (
                <button
                  onClick={() => setQrOpen(true)}
                  className="mt-4 mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[#dce3ff] bg-[#f0f2ff] py-3 text-[12px] font-semibold text-[#2740BA] transition hover:bg-[#e4e8ff]"
                >
                  <QrCode className="h-4 w-4" /> Xem mã QR sản phẩm
                </button>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 rounded-xl border border-[#e4e8f0] bg-white py-3 text-[12px] font-semibold text-slate-600 transition hover:border-[#2740BA] hover:text-[#2740BA]">
                  <Pencil className="h-3.5 w-3.5" /> Chỉnh sửa
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-[#e04040] bg-white py-3 text-[12px] font-semibold text-[#c0392b] transition hover:bg-[#fef0f0]">
                  <Trash2 className="h-3.5 w-3.5" /> Xóa
                </button>
              </div>
            </div>

            

            {/* Traceability placeholder (approved but no trace data) */}
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
          </div>
        </div>
      )}

      {/* ── TAB: Truy xuất nguồn gốc ──────────────────────────────────────── */}
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
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-14 w-14 rounded-xl object-cover border border-[#e4e8f0]"
                />
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
                        style={{ background: step.done ? step.color : "#f0f2f8", boxShadow: step.done ? `0 0 0 4px ${step.color}18` : "none" }}
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
                        <p className="mt-1.5 rounded-xl bg-[#f7f8fd] p-3 text-[11px] leading-4.5 text-slate-500">{step.desc}</p>
                        {step.image && (
                            <div className="mt-3">
                              <img
                                src={step.image}
                                alt={step.label}
                                className="h-48 w-full rounded-xl border border-[#e4e8f0] object-cover"
                              />
                            </div>
                        )}
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
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`https://trace.dongnai.gov.vn/sp/${product.id}`)}&color=0e7c7c&bgcolor=ffffff&margin=8`}
                  alt="QR Code"
                  className="h-36 w-36 rounded-2xl border-2 border-[#9edad9]"
                />
                <p className="font-mono text-[11px] font-bold text-[#25304b]">{product.id}-QR-2025</p>
                <p className="text-center text-[10px] text-slate-400">Quét để xem thông tin truy xuất công khai</p>
                <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#2740BA] py-2.5 text-[12px] font-semibold text-[#2740BA] hover:bg-[#edf0ff] transition-colors">
                  <Download className="h-3.5 w-3.5" /> Tải về QR Code
                </button>
              </div>
            </div>

            {/* Edit/Delete */}
            <div className="rounded-2xl border border-[#e4e8f0] bg-white p-5 shadow-sm">
              <p className="mb-3 text-[13px] font-bold text-[#1d2944]">Thao tác</p>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 rounded-xl border border-[#e4e8f0] bg-white py-3 text-[12px] font-semibold text-slate-600 transition hover:border-[#2740BA] hover:text-[#2740BA]">
                  <Pencil className="h-3.5 w-3.5" /> Chỉnh sửa
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-[#e04040] bg-white py-3 text-[12px] font-semibold text-[#c0392b] transition hover:bg-[#fef0f0]">
                  <Trash2 className="h-3.5 w-3.5" /> Xóa
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

            
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

// ─── Main export: Products list ──────────────────────────────────────────────
export default function Products() {
  // ── All hooks at the top ──────────────────────────────────────────────────
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [regionFilter, setRegionFilter] = useState("Tất cả địa bàn");
  const [sectorFilter, setSectorFilter] = useState("Tất cả ngành");
  const [selected, setSelected] = useState<Product | null>(null);
  const [selectedTab, setSelectedTab] = useState<"basic" | "trace">("basic");
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ── Early return (after all hooks) ───────────────────────────────────────
  if (selected) {
    return (
      <ProductDetail
        product={selected}
        onBack={() => setSelected(null)}
        initialTab={selectedTab}
      />
    );
  }

  const allStatuses = ["Tất cả", "Chờ duyệt", "Đã duyệt"];
  const statusCounts: Record<string, number> = { "Tất cả": mockProducts.length };
  (["Chờ duyệt", "Đã duyệt"] as ProductStatus[]).forEach((s) => {
    statusCounts[s] = mockProducts.filter((p) => p.status === s).length;
  });

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const filtered = products.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) || p.company.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    const matchStatus = statusFilter === "Tất cả" || p.status === statusFilter;
    const matchRegion = regionFilter === "Tất cả địa bàn" || p.region === regionFilter;
    const matchSector = sectorFilter === "Tất cả ngành" || p.sector === sectorFilter;
    return matchSearch && matchStatus && matchRegion && matchSector;
  });

  function openDetail(product: Product, tab: "basic" | "trace" = "basic") {
    setSelectedTab(product.status === "Đã duyệt" ? "trace" : tab);
    setSelected(product);
  }

  return (
    <DashboardShell title="Quản lý sản phẩm" subtitle="Danh sách sản phẩm">
      {/* Header */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-semibold text-slate-800">
              Xác nhận xóa
            </h3>

            <p className="mb-6 text-slate-600">
              Bạn có chắc chắn muốn xóa sản phẩm này không?
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
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#E8650A]">Quản lý</p>
          <h2 className="mt-1.5 text-[24px] font-bold tracking-[-0.05em] text-[#1d2944]">Sản phẩm</h2>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 rounded-xl border border-[#e4e8f0] bg-white px-3.5 py-2.5 text-[12px] font-semibold text-slate-600 hover:border-[#2740BA] hover:text-[#2740BA] transition-colors">
            <FileDown className="h-4 w-4" /> Xuất dữ liệu
          </button>
          
        </div>
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
                  {["Sản phẩm", "Doanh nghiệp", "Ngành hàng", "Khu vực", "Đơn vị", "Thao tác"].map((h) => (
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
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="h-10 w-10 rounded-lg object-cover border border-[#e4e8f0]"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                        <div>
                          <p className="font-semibold text-[#25304b]">{p.name}</p>
                          <p className="text-[10px] text-slate-400">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">{p.company}</td>
                    <td className="px-4 py-3.5 text-slate-500">{p.sector}</td>
                    <td className="px-4 py-3.5 text-slate-500">{p.region}</td>
                    <td className="px-4 py-3.5 font-semibold text-[#E8650A]">{p.unit}</td>
                    
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openDetail(p)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-[#edf0ff] hover:text-[#2740BA] transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-[#fff4ed] hover:text-[#E8650A] transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(p.id);
                            setShowDeleteModal(true);
                          }}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-[#fef0f0] hover:text-[#c0392b] transition-colors"
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
        </div>
      )}
    </DashboardShell>
  );
}
