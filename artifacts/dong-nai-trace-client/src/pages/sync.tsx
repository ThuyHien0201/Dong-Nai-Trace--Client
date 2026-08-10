import { useMemo, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  Search,
  X,
  ExternalLink,
  Upload,
  CheckCheck,
  Package,
  Loader2,
  RefreshCw,
  Clock,
  Send,
  CheckCircle2,
  QrCode,
  CalendarDays,
} from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toDatetimeLocal(iso: string | null | undefined) {
  if (!iso) return "";
  // "2026-07-27T10:11:00" format needed for datetime-local input
  return new Date(iso).toISOString().slice(0, 16);
}

function isImageUrl(url: string | null | undefined) {
  return !!url && /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(url);
}

// ─── Mock detail data for SyncModal ─────────────────────────────────────────

interface TxngStep {
  stepType: string;
  stepName: string;
  startTime: string;
  endTime: string;
  executor: string;
  locationCode: string;
  description: string;
  evidenceUrl: string;
}

interface LotDetail {
  id: number;
  productName: string;
  gtin: string;
  lotCode: string;
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  industry: string;
  category: string;
  region: string;
  certifications: string[];
  description: string;
  imageUrl: string;
  province: string;
  productionZone: string;
  txngSteps: TxngStep[];
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const MOCK_LOT_DETAILS: Record<number, LotDetail> = {
  104: {
    id: 104,
    productName: "Xoài cát Hòa Lộc",
    gtin: "8936001234562",
    lotCode: "LOT-2025-002",
    businessName: "HTX Xoài Hòa Lộc",
    businessAddress: "Ấp Hòa Lộc, xã Hòa Hưng, Cái Bè, Tiền Giang",
    businessPhone: "0274 382 1111",
    industry: "Nông sản",
    category: "Trái cây",
    region: "Cái Bè",
    certifications: ["VietGAP", "OCOP 4★"],
    description:
      "Xoài cát Hòa Lộc – giống xoài đặc sản, trái to, thịt vàng, ngọt thanh, ít xơ. Canh tác theo quy trình VietGAP, sử dụng phân hữu cơ vi sinh.",
    imageUrl:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=300&fit=crop",
    province: "Đồng Nai",
    productionZone: "Vùng trồng Hòa Lộc – Cái Bè",
    txngSteps: [
      {
        stepType: "planting",
        stepName: "Gieo trồng / Nuôi trồng",
        startTime: "2025-01-10T07:00",
        endTime: "2025-01-10T17:00",
        executor: "Tổ trưởng Nguyễn Văn Minh",
        locationCode: "LOC-VT-001",
        description:
          "Giống xoài cát Hòa Lộc ghép mắt, trồng theo hàng cách nhau 6m, bón lót phân hữu cơ trước khi trồng.",
        evidenceUrl:
          "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
      },
      {
        stepType: "care",
        stepName: "Chăm sóc",
        startTime: "2025-01-15T07:00",
        endTime: "2025-03-20T17:00",
        executor: "Kỹ sư Trần Thị Hoa",
        locationCode: "LOC-VT-001",
        description:
          "Bón phân NPK theo giai đoạn, tưới nước nhỏ giọt, phun thuốc BVTV sinh học định kỳ 15 ngày/lần.",
        evidenceUrl:
          "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=400&fit=crop",
      },
      {
        stepType: "harvest",
        stepName: "Thu hoạch",
        startTime: "2025-04-18T06:00",
        endTime: "2025-04-18T14:00",
        executor: "Đội thu hoạch HTX",
        locationCode: "LOC-VT-001",
        description:
          "Thu hái thủ công khi trái đạt độ chín 80–85%, dùng kéo chuyên dụng để tránh dập. Tỉ lệ loại A: 78%.",
        evidenceUrl:
          "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&h=400&fit=crop",
      },
      {
        stepType: "processing",
        stepName: "Sơ chế / Đóng gói",
        startTime: "2025-04-18T15:00",
        endTime: "2025-04-18T20:00",
        executor: "Xưởng sơ chế HTX",
        locationCode: "LOC-SC-002",
        description:
          "Rửa sạch bằng nước ozone, phân loại theo kích cỡ, đóng gói trong hộp carton 5kg có lót xốp, dán nhãn TXNG.",
        evidenceUrl: "",
      },
      {
        stepType: "transport",
        stepName: "Vận chuyển",
        startTime: "2025-04-19T05:00",
        endTime: "2025-04-19T10:00",
        executor: "Cty vận tải Hoàng Long",
        locationCode: "LOC-VT-003",
        description:
          "Vận chuyển bằng xe tải lạnh nhiệt độ 10–12°C, hành trình: Cái Bè → TP.HCM → Biên Hòa. Hàng nguyên vẹn, không dập vỡ.",
        evidenceUrl: "",
      },
      {
        stepType: "distribution",
        stepName: "Phân phối",
        startTime: "2025-04-19T11:00",
        endTime: "2025-04-19T16:00",
        executor: "Đại lý phân phối Đồng Nai",
        locationCode: "LOC-PP-004",
        description:
          "Phân phối đến các siêu thị CoopMart, Lotte Mart và 12 đại lý bán lẻ trên địa bàn tỉnh Đồng Nai.",
        evidenceUrl: "",
      },
    ],
  },
  105: {
    id: 105,
    productName: "Tiêu đen Xuân Lộc",
    gtin: "8936001234564",
    lotCode: "LOT-2025-004",
    businessName: "HTX Tiêu Xuân Lộc",
    businessAddress: "Xã Xuân Thành, huyện Xuân Lộc, Đồng Nai",
    businessPhone: "0251 388 5566",
    industry: "Gia vị",
    category: "Nông sản chế biến",
    region: "Xuân Lộc",
    certifications: ["4C", "Organic VN"],
    description:
      "Tiêu đen hữu cơ Xuân Lộc trồng trên đất đỏ bazan, không phân bón hóa học, thu hái thủ công khi chín 70–80%.",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    province: "Đồng Nai",
    productionZone: "Vùng trồng tiêu hữu cơ Xuân Thành",
    txngSteps: [
      {
        stepType: "planting",
        stepName: "Gieo trồng / Nuôi trồng",
        startTime: "2024-11-01T07:00",
        endTime: "2024-11-01T17:00",
        executor: "Nông dân Lê Văn Hùng",
        locationCode: "LOC-XL-001",
        description:
          "Trồng tiêu dây leo trên cọc gỗ, mật độ 1.000 cây/ha, bón lót phân hữu cơ trùn quế.",
        evidenceUrl:
          "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=600&h=400&fit=crop",
      },
      {
        stepType: "care",
        stepName: "Chăm sóc",
        startTime: "2024-11-05T07:00",
        endTime: "2025-03-31T17:00",
        executor: "Kỹ thuật viên HTX",
        locationCode: "LOC-XL-001",
        description:
          "Tưới nước bằng hệ thống nhỏ giọt, bổ sung phân vi sinh định kỳ, kiểm soát sâu bệnh bằng thuốc sinh học.",
        evidenceUrl: "",
      },
      {
        stepType: "harvest",
        stepName: "Thu hoạch",
        startTime: "2025-04-12T06:00",
        endTime: "2025-04-12T15:00",
        executor: "Tổ thu hoạch HTX",
        locationCode: "LOC-XL-001",
        description:
          "Hái thủ công từng chùm khi 70% hạt chuyển vàng, năng suất đạt 2,8 tấn/ha tươi.",
        evidenceUrl:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
      },
      {
        stepType: "processing",
        stepName: "Sơ chế / Đóng gói",
        startTime: "2025-04-13T07:00",
        endTime: "2025-04-13T18:00",
        executor: "Xưởng chế biến HTX",
        locationCode: "LOC-SC-002",
        description:
          "Phơi khô tự nhiên 5–7 ngày, sàng lọc loại bỏ hạt lép, đóng túi PE 500g dán nhãn mã vạch QR.",
        evidenceUrl: "",
      },
      {
        stepType: "transport",
        stepName: "Vận chuyển",
        startTime: "2025-04-14T05:00",
        endTime: "2025-04-14T09:00",
        executor: "Xe tải HTX",
        locationCode: "LOC-VT-003",
        description:
          "Vận chuyển trong điều kiện khô ráo, nhiệt độ phòng, xe có mái che tránh ẩm.",
        evidenceUrl: "",
      },
      {
        stepType: "distribution",
        stepName: "Phân phối",
        startTime: "2025-04-14T10:00",
        endTime: "2025-04-14T16:00",
        executor: "Công ty thương mại Đồng Nai",
        locationCode: "LOC-PP-004",
        description:
          "Phân phối tại 8 điểm bán hữu cơ, 2 sàn TMĐT và xuất lô 200kg sang thị trường Hà Nội.",
        evidenceUrl: "",
      },
    ],
  },
  106: {
    id: 106,
    productName: "Cà phê Robusta Định Quán",
    gtin: "8936001234566",
    lotCode: "LOT-2025-006",
    businessName: "Cty TNHH Cà phê DNT",
    businessAddress: "KCN Định Quán, huyện Định Quán, Đồng Nai",
    businessPhone: "0251 377 8899",
    industry: "Nông sản",
    category: "Thức uống",
    region: "Định Quán",
    certifications: ["4C", "Rainforest Alliance"],
    description:
      "Cà phê Robusta trồng trên đất đỏ bazan Định Quán, độ cao 400–600m, canh tác bền vững theo chứng nhận Rainforest Alliance.",
    imageUrl:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
    province: "Đồng Nai",
    productionZone: "Vùng cà phê Định Quán – Tân Phú",
    txngSteps: [
      {
        stepType: "planting",
        stepName: "Gieo trồng / Nuôi trồng",
        startTime: "2024-10-01T07:00",
        endTime: "2024-10-01T17:00",
        executor: "Kỹ sư Phạm Văn Tú",
        locationCode: "LOC-DQ-001",
        description:
          "Trồng cà phê ghép chồi năng suất cao, mật độ 1.100 cây/ha trên đất bazan tầng dày.",
        evidenceUrl: "",
      },
      {
        stepType: "care",
        stepName: "Chăm sóc",
        startTime: "2024-10-10T07:00",
        endTime: "2025-03-15T17:00",
        executor: "Đội kỹ thuật Cty DNT",
        locationCode: "LOC-DQ-001",
        description:
          "Tưới tiết kiệm nước theo cảm biến đất ẩm, bón phân NPK theo công thức cân bằng, không dùng thuốc cỏ hóa học.",
        evidenceUrl: "",
      },
      {
        stepType: "harvest",
        stepName: "Thu hoạch",
        startTime: "2025-04-08T06:00",
        endTime: "2025-04-09T15:00",
        executor: "Đội thu hoạch 50 người",
        locationCode: "LOC-DQ-001",
        description:
          "Hái chọn lọc tay, chỉ thu quả chín đỏ ≥ 95%, năng suất lô này: 4,2 tấn tươi.",
        evidenceUrl:
          "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=400&fit=crop",
      },
      {
        stepType: "processing",
        stepName: "Sơ chế / Đóng gói",
        startTime: "2025-04-09T16:00",
        endTime: "2025-04-11T18:00",
        executor: "Xưởng chế biến DNT",
        locationCode: "LOC-SC-002",
        description:
          "Xát vỏ ướt, lên men 36 giờ, sấy khô đến độ ẩm 12%, xay xát đánh bóng, đóng bao PP 60kg.",
        evidenceUrl: "",
      },
      {
        stepType: "transport",
        stepName: "Vận chuyển",
        startTime: "2025-04-12T05:00",
        endTime: "2025-04-12T10:00",
        executor: "Xe container Cty DNT",
        locationCode: "LOC-VT-003",
        description:
          "Container 20 feet, hàng xếp trên pallet gỗ, che phủ bằng bạt chống ẩm, kiểm soát nhiệt độ.",
        evidenceUrl: "",
      },
      {
        stepType: "distribution",
        stepName: "Phân phối",
        startTime: "2025-04-12T12:00",
        endTime: "2025-04-12T17:00",
        executor: "Công ty xuất nhập khẩu Đồng Nai",
        locationCode: "LOC-PP-004",
        description:
          "Giao 2 tấn cho nhà rang xay nội địa, 2,2 tấn xuất khẩu qua cảng Cái Mép sang thị trường EU.",
        evidenceUrl: "",
      },
    ],
  },
  107: {
    id: 107,
    productName: "Mật ong rừng Định Quán",
    gtin: "8936001234567",
    lotCode: "LOT-2025-007",
    businessName: "HTX Ong Mật Định Quán",
    businessAddress: "Ấp 3, xã Phú Vinh, huyện Định Quán, Đồng Nai",
    businessPhone: "0251 399 4422",
    industry: "Thực phẩm",
    category: "Mật ong",
    region: "Định Quán",
    certifications: ["OCOP 3★"],
    description:
      "Mật ong nguyên chất từ rừng nguyên sinh Định Quán, thu hoạch thủ công theo mùa hoa, không pha trộn, giàu enzyme tự nhiên.",
    imageUrl:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop",
    province: "Đồng Nai",
    productionZone: "Rừng phòng hộ Phú Vinh – Định Quán",
    txngSteps: [
      {
        stepType: "planting",
        stepName: "Nuôi ong / Đặt thùng",
        startTime: "2025-02-01T07:00",
        endTime: "2025-02-01T16:00",
        executor: "Trại nuôi HTX Ong Mật",
        locationCode: "LOC-DQ-010",
        description:
          "Đặt 80 thùng nuôi ong Ý tại vùng rừng tràm và keo, cách khu dân cư ≥ 2km, theo dõi đàn ong hàng ngày.",
        evidenceUrl:
          "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=400&fit=crop",
      },
      {
        stepType: "care",
        stepName: "Chăm sóc đàn ong",
        startTime: "2025-02-05T07:00",
        endTime: "2025-04-01T17:00",
        executor: "Kỹ thuật nuôi ong Lê Thanh Tú",
        locationCode: "LOC-DQ-010",
        description:
          "Kiểm tra sức khỏe đàn ong 2 lần/tuần, không dùng kháng sinh trong vòng 30 ngày trước khi khai thác.",
        evidenceUrl: "",
      },
      {
        stepType: "harvest",
        stepName: "Khai thác mật",
        startTime: "2025-04-05T06:00",
        endTime: "2025-04-05T14:00",
        executor: "Đội khai thác HTX",
        locationCode: "LOC-DQ-010",
        description:
          "Quay mật bằng máy ly tâm inox, lọc qua lưới 200 mesh, thu được 480kg mật thô, độ ẩm ≤ 20%.",
        evidenceUrl:
          "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=400&fit=crop",
      },
      {
        stepType: "processing",
        stepName: "Lọc & Đóng chai",
        startTime: "2025-04-05T15:00",
        endTime: "2025-04-06T12:00",
        executor: "Xưởng đóng gói HTX",
        locationCode: "LOC-SC-011",
        description:
          "Lọc tinh qua màng lọc 400 mesh, kiểm tra HMF, đóng chai thủy tinh 500ml và 1 lít, dán tem chống hàng giả.",
        evidenceUrl: "",
      },
      {
        stepType: "transport",
        stepName: "Vận chuyển",
        startTime: "2025-04-06T14:00",
        endTime: "2025-04-06T18:00",
        executor: "Xe giao hàng HTX",
        locationCode: "LOC-VT-003",
        description:
          "Vận chuyển ở nhiệt độ phòng, tránh ánh nắng trực tiếp, lô gồm 960 chai 500ml và 120 chai 1 lít.",
        evidenceUrl: "",
      },
      {
        stepType: "distribution",
        stepName: "Phân phối",
        startTime: "2025-04-07T08:00",
        endTime: "2025-04-07T17:00",
        executor: "Đại lý OCOP Đồng Nai",
        locationCode: "LOC-PP-004",
        description:
          "Phân phối tại Trung tâm OCOP tỉnh, 5 cửa hàng đặc sản và sàn thương mại điện tử Sendo, Shopee.",
        evidenceUrl: "",
      },
    ],
  },
};

// Fallback detail for any lot not in the map
function getMockDetail(lot: any): LotDetail {
  return (
    MOCK_LOT_DETAILS[lot.id as number] ?? {
      id: lot.id,
      productName: lot.productName,
      gtin: lot.gtin,
      lotCode: lot.lotCode,
      businessName: lot.businessName,
      businessAddress: "Đồng Nai, Việt Nam",
      businessPhone: "0251 000 0000",
      industry: "Nông sản",
      category: "Trái cây",
      region: "Đồng Nai",
      certifications: [],
      description:
        "Sản phẩm nông nghiệp đặc trưng tỉnh Đồng Nai, sản xuất theo quy trình chuẩn.",
      imageUrl: lot.imageUrl ?? "",
      province: "Đồng Nai",
      productionZone: "Vùng sản xuất Đồng Nai",
      txngSteps: [
        {
          stepType: "planting",
          stepName: "Gieo trồng / Nuôi trồng",
          startTime: "2025-01-10T07:00",
          endTime: "2025-01-10T17:00",
          executor: "",
          locationCode: "",
          description: "",
          evidenceUrl: "",
        },
        {
          stepType: "care",
          stepName: "Chăm sóc",
          startTime: "2025-02-01T07:00",
          endTime: "2025-03-31T17:00",
          executor: "",
          locationCode: "",
          description: "",
          evidenceUrl: "",
        },
        {
          stepType: "harvest",
          stepName: "Thu hoạch",
          startTime: "2025-04-01T06:00",
          endTime: "2025-04-01T15:00",
          executor: "",
          locationCode: "",
          description: "",
          evidenceUrl: "",
        },
        {
          stepType: "processing",
          stepName: "Sơ chế / Đóng gói",
          startTime: "2025-04-02T07:00",
          endTime: "2025-04-02T18:00",
          executor: "",
          locationCode: "",
          description: "",
          evidenceUrl: "",
        },
        {
          stepType: "transport",
          stepName: "Vận chuyển",
          startTime: "2025-04-03T06:00",
          endTime: "2025-04-03T12:00",
          executor: "",
          locationCode: "",
          description: "",
          evidenceUrl: "",
        },
        {
          stepType: "distribution",
          stepName: "Phân phối",
          startTime: "2025-04-03T13:00",
          endTime: "2025-04-03T18:00",
          executor: "",
          locationCode: "",
          description: "",
          evidenceUrl: "",
        },
      ],
    }
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ─── TXNG Portal Sync Modal (Tab 2) ──────────────────────────────────────────

interface SyncModalProps {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  lot: any;
  onClose: () => void;
  onSuccess: (lotId: number) => void;
}

function SyncModal({ lot, onClose, onSuccess }: SyncModalProps) {
  const detail = getMockDetail(lot);
  const [step, setStep] = useState<"basic" | "txng">("basic");
  const [pushed, setPushed] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [pushAttempts, setPushAttempts] = useState(0);

  // Editable fields for basic info
  const [province, setProvince] = useState(detail.province);
  const [productionZone, setProductionZone] = useState(detail.productionZone);

  // Editable TXNG steps
  const [steps, setSteps] = useState<TxngStep[]>(
    detail.txngSteps.map((s) => ({ ...s })),
  );

  function setStepField(idx: number, field: keyof TxngStep, value: string) {
    setSteps((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)),
    );
  }

  async function handlePush() {
    setPushing(true);
    setFailed(false);
    await new Promise((r) => setTimeout(r, 1200));
    setPushing(false);
    const nextAttempt = pushAttempts + 1;
    setPushAttempts(nextAttempt);
    if (nextAttempt === 1) {
      setFailed(true);
      return;
    }
    setPushed(true);
    onSuccess(lot.id);
  }

  const portalUrl = `https://txng.gov.vn/lot/${detail.lotCode.toLowerCase().replace("lot-", "")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-8 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#2740BA]">
              Cổng TXNG Quốc gia
            </p>
            <p className="mt-0.5 text-[14px] font-bold text-[#1d2944]">
              {detail.productName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step indicator */}
        {!pushed && (
          <div className="flex items-center gap-0 border-b border-[#f0f2f8] bg-[#f9fafb] px-6 py-3">
            {(["basic", "txng"] as const).map((s, i) => {
              const labels = ["Thông tin cơ bản", "Thông tin TXNG"];
              const active = step === s;
              const done = s === "basic" && step === "txng";
              return (
                <div key={s} className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${done ? "bg-[#2a9d6e] text-white" : active ? "bg-[#2740BA] text-white" : "bg-[#e4e8f0] text-slate-400"}`}
                    >
                      {done ? <CheckCheck className="h-3.5 w-3.5" /> : i + 1}
                    </div>
                    <span
                      className={`text-[12px] font-semibold ${active ? "text-[#2740BA]" : done ? "text-[#2a9d6e]" : "text-slate-400"}`}
                    >
                      {labels[i]}
                    </span>
                  </div>
                  {i === 0 && <div className="mx-4 h-px w-10 bg-[#e4e8f0]" />}
                </div>
              );
            })}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* ── SUCCESS STATE ── */}
          {pushed && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f5ed]">
                <CheckCheck className="h-8 w-8 text-[#2a9d6e]" />
              </div>
              <div>
                <p className="text-[18px] font-bold text-[#1d2944]">
                  Đồng bộ thành công!
                </p>
                <p className="mt-1 text-[12px] text-slate-500">
                  Hồ sơ đã được đẩy lên Cổng thông tin TXNG quốc gia.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-[#b8e2c8] bg-[#e8f5ed] px-4 py-2.5">
                <ExternalLink className="h-3.5 w-3.5 text-[#2a9d6e]" />
                <a
                  href={portalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[12px] font-semibold text-[#2a9d6e] underline"
                >
                  {portalUrl}
                </a>
              </div>
              <div className="mt-2">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(portalUrl)}&color=2a9d6e&bgcolor=ffffff&margin=8`}
                  alt="QR"
                  className="h-32 w-32 rounded-xl border border-[#b8e2c8]"
                />
              </div>
            </div>
          )}

          {!pushed && failed && (
            <div role="alert" className="flex flex-col items-center gap-4 rounded-2xl border border-[#f5bcbc] bg-[#fff6f6] px-6 py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#fef0f0]">
                <X className="h-8 w-8 text-[#c0392b]" />
              </div>
              <div>
                <p className="text-[18px] font-bold text-[#1d2944]">Đồng bộ không thành công</p>
                <p className="mt-1 max-w-sm text-[12px] leading-5 text-slate-500">
                  Không thể kết nối với Cổng thông tin TXNG quốc gia. Vui lòng kiểm tra lại và thử đồng bộ lại.
                </p>
              </div>
              <button type="button" onClick={handlePush} disabled={pushing} className="flex items-center gap-2 rounded-xl bg-[#2740BA] px-5 py-2.5 text-[12px] font-bold text-white hover:bg-[#1e33a0] disabled:opacity-70">
                {pushing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                {pushing ? "Đang thử lại..." : "Đồng bộ lại"}
              </button>
            </div>
          )}

          {/* ── STEP 1: Thông tin cơ bản ── */}
          {!pushed && !failed && step === "basic" && (
            <>
              {/* Product overview */}
              <div className="flex items-start gap-4 rounded-2xl border border-[#e4e8f0] bg-[#f9fafb] p-4">
                <img
                  src={detail.imageUrl}
                  alt={detail.productName}
                  className="h-20 w-20 rounded-xl border border-[#e4e8f0] object-cover shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-[#1d2944]">
                    {detail.productName}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {detail.businessName}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {detail.certifications.map((c) => (
                      <span
                        key={c}
                        className="rounded-md bg-[#edf0ff] px-2 py-0.5 text-[9px] font-bold text-[#2740BA]"
                      >
                        {c}
                      </span>
                    ))}
                    <span className="rounded-md bg-[#e8f5ed] px-2 py-0.5 text-[9px] font-bold text-[#2a9d6e]">
                      {detail.industry}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                    {detail.description}
                  </p>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["Mã GTIN", detail.gtin, true],
                  ["Số lô/mẻ", detail.lotCode, true],
                  ["Doanh nghiệp", detail.businessName, false],
                  ["Số điện thoại", detail.businessPhone, false],
                  ["Địa chỉ", detail.businessAddress, false],
                  ["Ngành hàng", detail.industry, false],
                  ["Danh mục", detail.category, false],
                  ["Khu vực", detail.region, false],
                ].map(([label, val, mono]) => (
                  <div
                    key={String(label)}
                    className={
                      String(label) === "Địa chỉ" ||
                      String(label) === "Doanh nghiệp"
                        ? "col-span-2"
                        : ""
                    }
                  >
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {String(label)}
                    </p>
                    <div
                      className={`rounded-lg border border-[#e4e8f0] bg-[#f9fafb] px-3 py-2 text-[12px] ${mono ? "font-mono" : ""} text-[#25304b]`}
                    >
                      {String(val)}
                    </div>
                  </div>
                ))}

                {/* Editable province */}
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Tỉnh thành <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full rounded-lg border border-[#e4e8f0] bg-white px-3 py-2 text-[12px] text-[#25304b] outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15"
                  />
                </div>

                {/* Editable production zone */}
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Vùng trồng / sản xuất{" "}
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={productionZone}
                    onChange={(e) => setProductionZone(e.target.value)}
                    className="w-full rounded-lg border border-[#e4e8f0] bg-white px-3 py-2 text-[12px] text-[#25304b] outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15"
                  />
                </div>
              </div>
            </>
          )}

          {/* ── STEP 2: Thông tin TXNG ── */}
          {!pushed && !failed && step === "txng" && (
            <div className="space-y-4">
              {steps.map((s, idx) => (
                <div
                  key={s.stepType}
                  className="overflow-hidden rounded-xl border border-[#e4e8f0]"
                >
                  <div className="flex items-center gap-2 border-b border-[#e4e8f0] bg-[#f9fafb] px-5 py-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2740BA] text-[9px] font-bold text-white">
                      {idx + 1}
                    </div>
                    <p className="text-[13px] font-bold text-[#1d2944]">
                      {s.stepName}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 p-5">
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Thời gian bắt đầu
                      </label>
                      <input
                        type="datetime-local"
                        value={s.startTime}
                        onChange={(e) =>
                          setStepField(idx, "startTime", e.target.value)
                        }
                        className="w-full rounded-lg border border-[#e4e8f0] bg-white px-3 py-2 text-[12px] text-[#25304b] outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Thời gian kết thúc
                      </label>
                      <input
                        type="datetime-local"
                        value={s.endTime}
                        onChange={(e) =>
                          setStepField(idx, "endTime", e.target.value)
                        }
                        className="w-full rounded-lg border border-[#e4e8f0] bg-white px-3 py-2 text-[12px] text-[#25304b] outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Người thực hiện
                      </label>
                      <input
                        value={s.executor}
                        onChange={(e) =>
                          setStepField(idx, "executor", e.target.value)
                        }
                        placeholder="Tên người / đơn vị thực hiện"
                        className="w-full rounded-lg border border-[#e4e8f0] bg-white px-3 py-2 text-[12px] text-[#25304b] outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Mã truy vết địa điểm{" "}
                        <span className="text-red-400">*</span>
                      </label>
                      <input
                        value={s.locationCode}
                        onChange={(e) =>
                          setStepField(idx, "locationCode", e.target.value)
                        }
                        placeholder="LOC-XXXX"
                        className="w-full rounded-lg border border-[#e4e8f0] bg-white px-3 py-2 text-[12px] font-mono text-[#25304b] outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Mô tả
                      </label>
                      <textarea
                        value={s.description}
                        onChange={(e) =>
                          setStepField(idx, "description", e.target.value)
                        }
                        rows={2}
                        className="w-full rounded-lg border border-[#e4e8f0] bg-white px-3 py-2 text-[12px] text-[#25304b] outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15 resize-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        URL ảnh minh chứng
                      </label>
                      <div className="flex items-start gap-3">
                        <input
                          value={s.evidenceUrl}
                          onChange={(e) =>
                            setStepField(idx, "evidenceUrl", e.target.value)
                          }
                          placeholder="https://..."
                          className="flex-1 rounded-lg border border-[#e4e8f0] bg-white px-3 py-2 text-[12px] font-mono text-[#25304b] outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15"
                        />
                        {isImageUrl(s.evidenceUrl) && (
                          <img
                            src={s.evidenceUrl}
                            alt=""
                            className="h-16 w-20 rounded-lg border border-[#e4e8f0] object-cover shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display =
                                "none";
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#f0f2f8] px-6 py-4">
          {failed ? (
            <button onClick={onClose} className="ml-auto rounded-lg border border-[#e4e8f0] px-6 py-2.5 text-[12px] font-semibold text-slate-600 hover:bg-[#f9fafb]">
              Đóng
            </button>
          ) : pushed ? (
            <button
              onClick={onClose}
              className="ml-auto rounded-lg bg-[#2a9d6e] px-6 py-2.5 text-[12px] font-bold text-white hover:bg-[#238a5e]"
            >
              Đóng
            </button>
          ) : failed ? (
            <button onClick={onClose} className="ml-auto rounded-lg border border-[#e4e8f0] px-6 py-2.5 text-[12px] font-semibold text-slate-600 hover:bg-[#f9fafb]">
              Đóng
            </button>
          ) : step === "basic" ? (
            <>
              <button
                onClick={onClose}
                className="rounded-lg border border-[#e4e8f0] px-5 py-2.5 text-[12px] font-semibold text-slate-600 hover:bg-[#f9fafb]"
              >
                Hủy
              </button>
              <button
                onClick={() => setStep("txng")}
                className="flex items-center gap-2 rounded-lg bg-[#2740BA] px-6 py-2.5 text-[12px] font-bold text-white hover:bg-[#1f32a3]"
              >
                Tiếp tục <Send className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep("basic")}
                className="flex items-center gap-2 rounded-lg border border-[#e4e8f0] px-5 py-2.5 text-[12px] font-semibold text-slate-600 hover:bg-[#f9fafb]"
              >
                <X className="h-3.5 w-3.5" /> Quay lại
              </button>
              <button
                onClick={handlePush}
                disabled={pushing}
                className="flex items-center gap-2 rounded-lg bg-[#2a9d6e] px-6 py-2.5 text-[12px] font-bold text-white hover:bg-[#238a5e] disabled:opacity-70"
              >
                {pushing ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Đang đẩy
                    lên...
                  </>
                ) : (
                  <>
                    <Upload className="h-3.5 w-3.5" /> Xác nhận đẩy lên Cổng
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Mock lots (shown when API returns empty / no DB connected) ───────────────
/* eslint-disable @typescript-eslint/no-explicit-any */
const MOCK_SOLUTION_LOTS: any[] = [
  {
    id: 1,
    productName: "Bưởi Tân Triều",
    gtin: "8936001234561",
    lotCode: "LOT-2025-001",
    businessName: "Cơ sở Bưởi Tân Triều",
    activatedAt: "2025-04-20T08:00:00.000Z",
    imageUrl:
      "https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=80&h=80&fit=crop",
    syncStatus: "not_synced",
    portalUrl: null,
  },
  {
    id: 2,
    productName: "Xoài cát Hòa Lộc",
    gtin: "8936001234562",
    lotCode: "LOT-2025-002",
    businessName: "HTX Xoài Hòa Lộc",
    activatedAt: "2025-04-18T09:30:00.000Z",
    imageUrl:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=80&h=80&fit=crop",
    syncStatus: "not_synced",
    portalUrl: null,
  },
  {
    id: 3,
    productName: "Sầu riêng Monthong",
    gtin: "8936001234563",
    lotCode: "LOT-2025-003",
    businessName: "Cty TNHH Nông sản Đồng Nai",
    activatedAt: "2025-04-15T10:00:00.000Z",
    imageUrl:
      "https://images.unsplash.com/photo-1600423115367-87ea7661688f?w=80&h=80&fit=crop",
    syncStatus: "synced",
    portalUrl:
      "https://dong-nai-trace--han640698.replit.app/portal/san-pham/sp001",
  },
  {
    id: 4,
    productName: "Tiêu đen Xuân Lộc",
    gtin: "8936001234564",
    lotCode: "LOT-2025-004",
    businessName: "HTX Tiêu Xuân Lộc",
    activatedAt: "2025-04-12T07:45:00.000Z",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop",
    syncStatus: "not_synced",
    portalUrl: null,
  },
  {
    id: 5,
    productName: "Điều rang muối",
    gtin: "8936001234565",
    lotCode: "LOT-2025-005",
    businessName: "Cty CP Điều Đồng Nai",
    activatedAt: "2025-04-10T13:00:00.000Z",
    imageUrl:
      "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=80&h=80&fit=crop",
    syncStatus: "synced",
    portalUrl:
      "https://dong-nai-trace--han640698.replit.app/portal/san-pham/sp001",
  },
];
/* eslint-enable @typescript-eslint/no-explicit-any */

// ─── Tab 1: Đồng bộ sang đơn vị giải pháp ────────────────────────────────────

function SolutionProviderTab() {
  const [searchGtin, setSearchGtin] = useState("");
  const [searchLot, setSearchLot] = useState("");
  const [searchBusiness, setSearchBusiness] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  // Track which lots have been "sent" to solution provider (mock)
  const [sentLots, setSentLots] = useState<Set<number>>(new Set());
  const [sendingLot, setSendingLot] = useState<number | null>(null);
  const [failedLots, setFailedLots] = useState<Set<number>>(new Set());
  const [sendAttempts, setSendAttempts] = useState<Record<number, number>>({});
  const [failureLot, setFailureLot] = useState<(typeof MOCK_SOLUTION_LOTS)[number] | null>(null);
  const lots = useMemo(() => MOCK_SOLUTION_LOTS.filter((lot) => {
    const matches = (value: string, query: string) =>
      !query || value.toLowerCase().includes(query.toLowerCase());
    return matches(lot.gtin, searchGtin) &&
      matches(lot.lotCode, searchLot) &&
      matches(lot.businessName, searchBusiness) &&
      matches(lot.productName, searchProduct);
  }), [searchGtin, searchLot, searchBusiness, searchProduct]);
  const total = lots.length;

  async function handleSend(lotId: number) {
    setSendingLot(lotId);
    await new Promise((r) => setTimeout(r, 900));
    const attempt = (sendAttempts[lotId] ?? 0) + 1;
    setSendAttempts((prev) => ({ ...prev, [lotId]: attempt }));
    if (attempt === 1) {
      setFailedLots((prev) => new Set(prev).add(lotId));
      setFailureLot(MOCK_SOLUTION_LOTS.find((lot) => lot.id === lotId) ?? null);
      setSendingLot(null);
      return;
    }
    setFailedLots((prev) => {
      const next = new Set(prev);
      next.delete(lotId);
      return next;
    });
    setSentLots((prev) => new Set(prev).add(lotId));
    setSendingLot(null);
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[15px] font-bold tracking-[-0.03em] text-[#1d2944]">
          Đồng bộ hồ sơ sang đơn vị cung cấp giải pháp
        </h3>
        <p className="mt-0.5 text-[11px] text-slate-400">
          Gửi thông tin doanh nghiệp và sản phẩm sang đơn vị giải pháp để họ bổ
          sung dữ liệu quá trình TXNG qua API
        </p>
      </div>

      {/* Search bar */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          {
            placeholder: "Tên doanh nghiệp",
            value: searchBusiness,
            set: setSearchBusiness,
          },
          {
            placeholder: "Tên thương phẩm",
            value: searchProduct,
            set: setSearchProduct,
          },
          { placeholder: "GTIN", value: searchGtin, set: setSearchGtin },
        ].map(({ placeholder, value, set }) => (
          <div key={placeholder} className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              value={value}
              onChange={(e) => set(e.target.value)}
              placeholder={placeholder}
              className="h-9 rounded-xl border border-[#e4e8f0] bg-[#f9fafb] pl-8 pr-3 text-[12px] text-[#25304b] outline-none focus:border-[#2740BA] focus:bg-white focus:ring-2 focus:ring-[#2740BA]/15"
            />
          </div>
        ))}
        <button
          onClick={() => {
            setSearchGtin("");
            setSearchLot("");
            setSearchBusiness("");
            setSearchProduct("");
          }}
          className="ml-auto rounded-xl border border-[#e4e8f0] p-2 text-slate-400 hover:border-[#2740BA] hover:text-[#2740BA]"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {failureLot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#16234f]/35 p-4 backdrop-blur-sm">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="sync-failure-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fef0f0]">
              <X className="h-7 w-7 text-[#c0392b]" />
            </div>
            <p id="sync-failure-title" className="mt-4 text-[18px] font-bold text-[#1d2944]">
              Đồng bộ không thành công
            </p>
            <p className="mt-1 text-[12px] leading-5 text-slate-500">
              Không thể đồng bộ <span className="font-semibold text-[#25304b]">{failureLot.productName}</span> sang đơn vị cung cấp giải pháp. Vui lòng thử lại.
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setFailureLot(null)}
                className="rounded-xl border border-[#e4e8f0] px-4 py-2.5 text-[12px] font-semibold text-slate-600"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  setFailureLot(null);
                  handleSend(failureLot.id);
                }}
                className="flex items-center gap-2 rounded-xl bg-[#2740BA] px-4 py-2.5 text-[12px] font-bold text-white hover:bg-[#1e33a0]"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Đồng bộ lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#e4e8f0] bg-white shadow-sm">
        <table className="min-w-full text-[12px]">
          <thead>
            <tr className="border-b border-[#e4e8f0] bg-[#f9fafb]">
              {[
                "STT",
                "Hình ảnh",
                "GTIN / Thương phẩm",
                "Doanh nghiệp",
                "Ngày kích hoạt",
                "Trạng thái",
                "Thao tác",
              ].map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f2f8]">
            {lots.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              lots.map((lot, idx) => {
                const isSent = sentLots.has(lot.id);
                const isFailed = failedLots.has(lot.id);
                const isSending = sendingLot === lot.id;
                return (
                  <tr
                    key={lot.id}
                    className="hover:bg-[#f9fafb] transition-colors"
                  >
                    <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e4e8f0] bg-[#f9fafb]">
                        {lot.imageUrl ? (
                          <img
                            src={lot.imageUrl}
                            alt=""
                            className="h-7 w-7 rounded-lg object-cover"
                          />
                        ) : (
                          <Package className="h-4 w-4 text-slate-300" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-[#25304b]">
                        {lot.productName}
                      </p>
                      <p className="font-mono text-[10px] text-slate-400">
                        GTIN: {lot.gtin}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">
                      {lot.businessName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-slate-400">
                      {fmtDate(lot.activatedAt)}
                    </td>
                    <td className="px-4 py-3.5">
                      {isFailed ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#f5bcbc] bg-[#fef0f0] px-2.5 py-0.5 text-[10px] font-bold text-[#c0392b]">
                          <X className="h-3 w-3" /> Đồng bộ lỗi
                        </span>
                      ) : isSent ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#b8e2c8] bg-[#e8f5ed] px-2.5 py-0.5 text-[10px] font-bold text-[#1f7a45]">
                          <CheckCircle2 className="h-3 w-3" /> Đã gửi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#d9dce9] bg-[#f2f3f7] px-2.5 py-0.5 text-[10px] font-bold text-slate-500">
                          <Clock className="h-3 w-3" /> Chưa gửi
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {!isSent || isFailed ? (
                        <button
                          onClick={() => handleSend(lot.id)}
                          disabled={isSending}
                          className="flex items-center gap-1.5 rounded-lg border border-[#2740BA] px-3 py-1.5 text-[11px] font-semibold text-[#2740BA] hover:bg-[#edf0ff] disabled:opacity-60"
                        >
                          {isSending ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin" /> Đang
                              gửi...
                            </>
                          ) : (
                            <>
                              {isFailed ? <RefreshCw className="h-3 w-3" /> : <Send className="h-3 w-3" />} {isFailed ? "Đồng bộ lại" : "Đồng bộ"}
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSend(lot.id)}
                          className="flex items-center gap-1.5 rounded-lg border border-[#e4e8f0] px-3 py-1.5 text-[11px] font-semibold text-slate-400 hover:border-[#2740BA] hover:text-[#2740BA]"
                        >
                          <RefreshCw className="h-3 w-3" /> Đồng bộ lại
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        {total > 0 && (
          <div className="border-t border-[#f0f2f8] px-4 py-3 text-[11px] text-slate-400">
            Tổng: <span className="font-semibold text-[#25304b]">{total}</span>{" "}
            lô thương phẩm
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Mock lots for Tab 2 (shown when API returns empty / no DB connected) ─────
/* eslint-disable @typescript-eslint/no-explicit-any */
const MOCK_TXNG_LOTS: any[] = [
  {
    id: 101,
    productName: "Bưởi Tân Triều",
    gtin: "8936001234561",
    lotCode: "LOT-2025-001",
    businessName: "Cơ sở Bưởi Tân Triều",
    activatedAt: "2025-04-20T08:00:00.000Z",
    imageUrl:
      "https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=80&h=80&fit=crop",
    syncStatus: "synced",
    isComplete: true,
    portalUrl: "https://dong-nai-trace--han640698.replit.app/portal/san-pham/sp001",
  },
  {
    id: 102,
    productName: "Sầu riêng Monthong",
    gtin: "8936001234563",
    lotCode: "LOT-2025-003",
    businessName: "Cty TNHH Nông sản Đồng Nai",
    activatedAt: "2025-04-15T10:00:00.000Z",
    imageUrl:
      "https://images.unsplash.com/photo-1600423115367-87ea7661688f?w=80&h=80&fit=crop",
    syncStatus: "synced",
    isComplete: true,
    portalUrl: "https://dong-nai-trace--han640698.replit.app/portal/san-pham/sp001",
  },
  {
    id: 103,
    productName: "Điều rang muối",
    gtin: "8936001234565",
    lotCode: "LOT-2025-005",
    businessName: "Cty CP Điều Đồng Nai",
    activatedAt: "2025-04-10T13:00:00.000Z",
    imageUrl:
      "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=80&h=80&fit=crop",
    syncStatus: "synced",
    isComplete: true,
    portalUrl: "https://dong-nai-trace--han640698.replit.app/portal/san-pham/sp001",
  },
  {
    id: 104,
    productName: "Xoài cát Hòa Lộc",
    gtin: "8936001234562",
    lotCode: "LOT-2025-002",
    businessName: "HTX Xoài Hòa Lộc",
    activatedAt: "2025-04-18T09:30:00.000Z",
    imageUrl:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=80&h=80&fit=crop",
    syncStatus: "not_synced",
    isComplete: true,
    portalUrl: null,
  },
  {
    id: 105,
    productName: "Tiêu đen Xuân Lộc",
    gtin: "8936001234564",
    lotCode: "LOT-2025-004",
    businessName: "HTX Tiêu Xuân Lộc",
    activatedAt: "2025-04-12T07:45:00.000Z",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop",
    syncStatus: "not_synced",
    isComplete: true,
    portalUrl: null,
  },
  {
    id: 106,
    productName: "Cà phê Robusta Định Quán",
    gtin: "8936001234566",
    lotCode: "LOT-2025-006",
    businessName: "Cty TNHH Cà phê DNT",
    activatedAt: "2025-04-08T11:00:00.000Z",
    imageUrl:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=80&h=80&fit=crop",
    syncStatus: "not_synced",
    isComplete: false,
    portalUrl: null,
  },
  {
    id: 107,
    productName: "Mật ong rừng Định Quán",
    gtin: "8936001234567",
    lotCode: "LOT-2025-007",
    businessName: "HTX Ong Mật Định Quán",
    activatedAt: "2025-04-05T08:20:00.000Z",
    imageUrl:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=80&h=80&fit=crop",
    syncStatus: "not_synced",
    isComplete: false,
    portalUrl: null,
  },
];
/* eslint-enable @typescript-eslint/no-explicit-any */

// ─── QR Modal for Tab 2 ──────────────────────────────────────────────────────
/* eslint-disable @typescript-eslint/no-explicit-any */
function PortalQrModal({ lot, onClose }: { lot: any; onClose: () => void }) {
  const qrData = lot.portalUrl ?? `https://txng.gov.vn/lot/${lot.id}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}&color=2a9d6e&bgcolor=ffffff&margin=10`;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-xs rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[14px] font-bold text-[#1d2944]">
            Mã QR cổng TXNG
          </p>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-[#f1f3fa]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col items-center gap-3">
          <img
            src={qrUrl}
            alt="QR"
            className="h-48 w-48 rounded-xl border border-[#e4e8f0] bg-white"
          />
          <p className="font-mono text-[12px] font-bold text-[#2a9d6e] text-center">
            {lot.lotCode}
          </p>
          <p className="text-[11px] text-slate-500 font-medium text-center">
            {lot.productName}
          </p>
          <p className="text-[11px] text-slate-400 text-center">
            {lot.businessName}
          </p>
          {lot.syncStatus === "synced" && lot.portalUrl && (
            <a
              href={lot.portalUrl}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#2a9d6e] py-2.5 text-[12px] font-semibold text-[#2a9d6e] hover:bg-[#e6f7f7] transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Xem trên cổng TXNG
            </a>
          )}
          {lot.syncStatus !== "synced" && (
            <p className="text-[10px] text-slate-400 text-center italic">
              Chưa đồng bộ lên cổng — QR sẽ hoạt động sau khi đồng bộ.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ─── Tab 2: Cổng thông tin TXNG QG ───────────────────────────────────────────

function TxngPortalTab() {
  type FilterStatus = "all" | "not_synced" | "synced";

  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchGtin, setSearchGtin] = useState("");
  const [searchLot, setSearchLot] = useState("");
  const [searchBusiness, setSearchBusiness] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [syncLot, setSyncLot] = useState<any | null>(null);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [qrLot, setQrLot] = useState<any | null>(null);
  // Track lots that have been synced in this session
  const [sessionSynced, setSessionSynced] = useState<Set<number>>(new Set());

  const [mockLots, setMockLots] = useState(MOCK_TXNG_LOTS);
  const mockFiltered = useMemo(() => MOCK_TXNG_LOTS.filter((l) => {
    const queries = [searchLot, searchBusiness, searchProduct, searchGtin]
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean);
    const searchable = `${l.lotCode} ${l.businessName} ${l.productName} ${l.gtin}`.toLowerCase();
    return (!queries.length || queries.every((query) => searchable.includes(query))) &&
      (filterStatus === "all" || l.syncStatus === filterStatus);
  }), [filterStatus, searchBusiness, searchGtin, searchLot, searchProduct]);
  const lots = mockFiltered.map((lot) => mockLots.find((item) => item.id === lot.id) ?? lot);
  const total = lots.length;
  const notSyncedCount = mockLots.filter((l) => l.syncStatus === "not_synced").length;
  const syncedCount = mockLots.filter((l) => l.syncStatus === "synced").length;

  const filterTabs: {
    id: FilterStatus;
    label: string;
    count: number;
    active: string;
    inactive: string;
  }[] = [
    {
      id: "all",
      label: "Tất cả",
      count: total,
      active: "bg-[#2a9d6e] text-white",
      inactive: "border border-[#2a9d6e] text-[#2a9d6e] hover:bg-green-50",
    },
    {
      id: "not_synced",
      label: "Chưa đồng bộ",
      count: notSyncedCount,
      active: "bg-[#E8650A] text-white",
      inactive: "border border-[#E8650A] text-[#E8650A] hover:bg-orange-50",
    },
    {
      id: "synced",
      label: "Đã đồng bộ",
      count: syncedCount,
      active: "bg-[#2740BA] text-white",
      inactive: "border border-[#2740BA] text-[#2740BA] hover:bg-blue-50",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[15px] font-bold tracking-[-0.03em] text-[#1d2944]">
          Đồng bộ dữ liệu cổng thông tin TXNG QG
        </h3>
        <p className="mt-0.5 text-[11px] text-slate-400">
          Xem xét hồ sơ hoàn thiện từ đơn vị giải pháp và đẩy lên cổng thông tin
          truy xuất nguồn gốc sản phẩm, hàng hóa quốc gia
        </p>
      </div>

      {/* Filter / search row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status badges */}
        {filterTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilterStatus(t.id)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[12px] font-bold transition-colors ${filterStatus === t.id ? t.active : t.inactive}`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Search inputs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          {
            placeholder: "Lô thương phẩm",
            value: searchLot,
            set: setSearchLot,
          },
          {
            placeholder: "Tên doanh nghiệp",
            value: searchBusiness,
            set: setSearchBusiness,
          },
          {
            placeholder: "Tên thương phẩm",
            value: searchProduct,
            set: setSearchProduct,
          },
          { placeholder: "GTIN", value: searchGtin, set: setSearchGtin },
        ].map(({ placeholder, value, set }) => (
          <div key={placeholder} className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              value={value}
              onChange={(e) => set(e.target.value)}
              placeholder={placeholder}
              className="h-9 rounded-xl border border-[#e4e8f0] bg-[#f9fafb] pl-8 pr-3 text-[12px] text-[#25304b] outline-none focus:border-[#2740BA] focus:bg-white focus:ring-2 focus:ring-[#2740BA]/15"
            />
          </div>
        ))}
        <button
          onClick={() => {
            setSearchGtin("");
            setSearchLot("");
            setSearchBusiness("");
            setSearchProduct("");
          }}
          className="ml-auto rounded-xl border border-[#e4e8f0] p-2 text-slate-400 hover:border-[#2740BA] hover:text-[#2740BA]"
          title="Làm mới"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#e4e8f0] bg-white shadow-sm">
        <table className="min-w-full text-[12px]">
          <thead>
            <tr className="border-b border-[#e4e8f0] bg-[#f9fafb]">
              {[
                "STT",
                "Hình ảnh",
                "GTIN / Thương phẩm",
                "Lô thương phẩm",
                "Doanh nghiệp",
                "Ngày kích hoạt",
                "Trạng thái đồng bộ VNTP",
                "Thao tác",
              ].map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f2f8]">
            {lots.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  Không có dữ liệu phù hợp
                </td>
              </tr>
            ) : (
              lots.map((lot, idx) => (
                <tr
                  key={lot.id}
                  className="hover:bg-[#f9fafb] transition-colors"
                >
                  <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e4e8f0] bg-[#f9fafb]">
                      {lot.imageUrl ? (
                        <img
                          src={lot.imageUrl}
                          alt=""
                          className="h-7 w-7 rounded-lg object-cover"
                        />
                      ) : (
                        <Package className="h-4 w-4 text-slate-300" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-[#25304b]">
                      {lot.productName}
                    </p>
                    <p className="font-mono text-[10px] text-slate-400">
                      GTIN: {lot.gtin}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">
                    {lot.businessName}
                  </td>
                  <td className="px-4 py-3.5 font-mono font-semibold text-[#2740BA]">
                    {lot.lotCode}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-slate-400">
                    {fmtDate(lot.activatedAt)}
                  </td>
                  <td className="px-4 py-3.5">
                    {lot.syncStatus === "synced" ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#b8e2c8] bg-[#e8f5ed] px-2.5 py-0.5 text-[10px] font-bold text-[#1f7a45]">
                        <CheckCheck className="h-3 w-3" /> Đã đồng bộ
                      </span>
                    ) : lot.isComplete ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#fcd9bb] bg-[#fff4ed] px-2.5 py-0.5 text-[10px] font-bold text-[#E8650A]">
                        <Upload className="h-3 w-3" /> Chưa đồng bộ
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#d9dce9] bg-[#f2f3f7] px-2.5 py-0.5 text-[10px] font-bold text-slate-500">
                        <Clock className="h-3 w-3" /> Thiếu dữ liệu TXNG
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    {(() => {
                      const isSynced =
                        lot.syncStatus === "synced" ||
                        sessionSynced.has(lot.id);
                      return (
                        <div className="flex items-center gap-1">
                          {/* QR icon — always shown for synced; also shown for not_synced */}
                          {isSynced && (
                            <button
                              onClick={() =>
                                setQrLot(
                                  isSynced
                                    ? {
                                        ...lot,
                                        syncStatus: "synced",
                                        portalUrl:
                                          lot.portalUrl ??
                                          `https://dong-nai-trace--han640698.replit.app/lot/${lot.lotCode.toLowerCase().replace("lot-", "")}`,
                                      }
                                    : lot,
                                )
                              }
                              title="Xem mã QR cổng TXNG"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2a9d6e] text-[#2a9d6e] hover:bg-[#e6f7f7] transition-colors"
                            >
                              <QrCode className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {/* Sync icon — only for not_synced */}
                          {!isSynced && (
                            <>
                              <button
                                onClick={() => setQrLot(lot)}
                                title="Xem mã QR"
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e4e8f0] text-slate-400 hover:border-[#2a9d6e] hover:text-[#2a9d6e] transition-colors"
                              >
                                <QrCode className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => setSyncLot(lot)}
                                disabled={!lot.isComplete}
                                title={
                                  lot.isComplete
                                    ? "Đồng bộ lên Cổng thông tin TXNG"
                                    : "Hồ sơ chưa hoàn thiện — cần đủ công đoạn TXNG"
                                }
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2740BA] text-[#2740BA] hover:bg-[#edf0ff] disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300 transition-colors"
                              >
                                <RefreshCw className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      );
                    })()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* QR Modal */}
      {qrLot !== null && (
        <PortalQrModal lot={qrLot} onClose={() => setQrLot(null)} />
      )}

      {/* Sync / detail modal */}
      {syncLot !== null && (
        <SyncModal
          lot={syncLot}
          onClose={() => setSyncLot(null)}
          onSuccess={(lotId) => {
            setSessionSynced((prev) => new Set(prev).add(lotId));
            setMockLots((prev) => prev.map((item) => item.id === lotId ? { ...item, syncStatus: "synced", portalUrl: `https://txng.gov.vn/lot/${lotId}` } : item));
            setSyncLot(null);
          }}
        />
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const PAGE_TABS = [
  { id: "solution", label: "Đồng bộ sang đơn vị giải pháp" },
  {
    id: "portal",
    label: "Cổng truy xuất nguồn gốc sản phẩm, hàng hóa Thành phố Đồng Nai",
  },
] as const;
type PageTab = (typeof PAGE_TABS)[number]["id"];

export default function Sync() {
  const [tab, setTab] = useState<PageTab>("solution");

  return (
    <DashboardShell
      title="Đồng bộ dữ liệu"
      subtitle="Đồng bộ hồ sơ sang đơn vị giải pháp và cổng thông tin TXNG quốc gia"
    >
      {/* Page title */}
      <div className="mb-5">
        <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#E8650A]">
          Hệ thống
        </p>
        <h2 className="mt-1.5 text-[24px] font-bold tracking-[-0.05em] text-[#1d2944]">
          Đồng bộ dữ liệu
        </h2>
      </div>

      {/* Top-level tabs */}
      <div className="mb-6 flex gap-0 overflow-hidden rounded-xl border border-[#e4e8f0] bg-white shadow-sm">
        {PAGE_TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 px-5 py-3 text-[12px] font-bold transition-colors ${
              tab === id
                ? "bg-[#2740BA] text-white"
                : "text-slate-500 hover:bg-[#f7f8fc] hover:text-[#2740BA]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "solution" && <SolutionProviderTab />}
      {tab === "portal" && <TxngPortalTab />}
    </DashboardShell>
  );
}
