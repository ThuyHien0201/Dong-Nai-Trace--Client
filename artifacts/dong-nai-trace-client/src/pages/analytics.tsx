import { useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FileDown,
  ChevronDown,
  TrendingUp,
  Building2,
  Package,
  ScanLine,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

// ─── Colour palette ───────────────────────────────────────────────────────────
const C = {
  blue: "#2740BA",
  orange: "#E8650A",
  green: "#3d9e6e",
  teal: "#2e9fbf",
  gray: "#A8B2C8",
  lightBlue: "#6d88e0",
  blueAlpha: "rgba(39,64,186,.08)",
};

// ─── Mock data ────────────────────────────────────────────────────────────────
const businessByRegion = [
  { region: "Biên Hòa", count: 312 },
  { region: "Long Khánh", count: 198 },
  { region: "Xuân Lộc", count: 145 },
  { region: "Nhơn Trạch", count: 121 },
  { region: "Long Thành", count: 118 },
  { region: "Trảng Bom", count: 98 },
  { region: "Định Quán", count: 87 },
  { region: "Tân Phú", count: 73 },
];

const productBySector = [
  { sector: "Nông sản", count: 2840 },
  { sector: "Thực phẩm CB", count: 1920 },
  { sector: "Thủy sản", count: 1140 },
  { sector: "OCOP", count: 980 },
  { sector: "Dược liệu", count: 620 },
  { sector: "Chăn nuôi", count: 480 },
];

const qrScansByTime = [
  { period: "T1", scans: 4200, registrations: 1200 },
  { period: "T2", scans: 5100, registrations: 1450 },
  { period: "T3", scans: 4780, registrations: 1710 },
  { period: "T4", scans: 6320, registrations: 1920 },
  { period: "T5", scans: 7140, registrations: 2280 },
  { period: "T6", scans: 6820, registrations: 2510 },
  { period: "T7", scans: 8230, registrations: 2900 },
  { period: "T8", scans: 9170, registrations: 3270 },
  { period: "T9", scans: 10480, registrations: 3510 },
  { period: "T10", scans: 11240, registrations: 3880 },
  { period: "T11", scans: 12890, registrations: 4290 },
  { period: "T12", scans: 14520, registrations: 4760 },
];

const certificationData = [
  { name: "VietGAP", value: 38, color: C.blue },
  { name: "OCOP", value: 27, color: C.orange },
  { name: "HACCP", value: 18, color: C.green },
  { name: "GlobalGAP", value: 10, color: C.teal },
  { name: "Khác", value: 7, color: C.gray },
];

const registrationByStatus = [
  { month: "T7", chouDuyet: 28, daDuyet: 45, tuChoi: 8 },
  { month: "T8", chouDuyet: 32, daDuyet: 52, tuChoi: 11 },
  { month: "T9", chouDuyet: 24, daDuyet: 61, tuChoi: 7 },
  { month: "T10", chouDuyet: 38, daDuyet: 58, tuChoi: 14 },
  { month: "T11", chouDuyet: 29, daDuyet: 71, tuChoi: 9 },
  { month: "T12", chouDuyet: 18, daDuyet: 84, tuChoi: 6 },
];

const kpiCards = [
  {
    label: "Doanh nghiệp",
    value: "1.152",
    delta: "+8.4%",
    positive: true,
    icon: Building2,
    color: C.blue,
    bg: "bg-[#edf0ff]",
  },
  {
    label: "Sản phẩm",
    value: "7.980",
    delta: "+12.1%",
    positive: true,
    icon: Package,
    color: C.orange,
    bg: "bg-[#fff3ea]",
  },
  {
    label: "Lượt quét QR",
    value: "96.890",
    delta: "+23.6%",
    positive: true,
    icon: ScanLine,
    color: C.green,
    bg: "bg-[#e8f7ef]",
  },
  {
    label: "Tỉ lệ phê duyệt",
    value: "81.3%",
    delta: "+2.5%",
    positive: true,
    icon: ShieldCheck,
    color: C.teal,
    bg: "bg-[#e4f5fa]",
  },
];

// ─── Cascading location data ──────────────────────────────────────────────────
const locationTree: Record<string, Record<string, string[]>> = {
  "Đồng Nai": {
    "Tất cả huyện": [],
    "Biên Hòa": ["Tất cả xã", "Tân Phong", "Long Bình", "Quang Vinh", "Trung Dũng"],
    "Long Khánh": ["Tất cả xã", "Xuân Lập", "Bảo Quang", "Xuân Thanh", "Nhân Nghĩa"],
    "Xuân Lộc": ["Tất cả xã", "Xuân Hòa", "Xuân Bắc", "Suối Cao", "Xuân Thành"],
    "Nhơn Trạch": ["Tất cả xã", "Phú Thạnh", "Long Thọ", "Đại Phước", "Phú Đông"],
    "Long Thành": ["Tất cả xã", "Long An", "Tam An", "Phước Thái", "Long Phước"],
    "Trảng Bom": ["Tất cả xã", "Hố Nai", "Đông Hòa", "Bình Minh", "Trung Hòa"],
  },
  "Tất cả tỉnh": {},
};

const sectors = ["Tất cả ngành", "Nông sản", "Thực phẩm CB", "Thủy sản", "OCOP", "Dược liệu", "Chăn nuôi"];
const periods = ["Ngày hôm nay", "Tuần này", "Tháng này", "Quý này", "Năm nay"];

// ─── Tooltip style ────────────────────────────────────────────────────────────
const tooltipStyle = {
  contentStyle: {
    fontSize: 11,
    borderRadius: 10,
    border: "1px solid #e4e8f0",
    boxShadow: "0 4px 16px rgba(30,50,100,.08)",
    padding: "8px 12px",
  },
  cursor: { fill: C.blueAlpha },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function SelectNative({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-9 appearance-none rounded-xl border border-[#e4e8f0] bg-[#f9fafb] pl-3 pr-8 text-[12px] font-medium text-[#25304b] outline-none transition focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

function FilterBar() {
  const [period, setPeriod] = useState("Năm nay");
  const [province, setProvince] = useState("Đồng Nai");
  const [district, setDistrict] = useState("Tất cả huyện");
  const [ward, setWard] = useState("Tất cả xã");
  const [sector, setSector] = useState("Tất cả ngành");

  const districts = province === "Đồng Nai" ? Object.keys(locationTree["Đồng Nai"]) : [];
  const wards =
    province === "Đồng Nai" && district !== "Tất cả huyện"
      ? locationTree["Đồng Nai"][district] ?? []
      : [];

  function handleProvinceChange(v: string) {
    setProvince(v);
    setDistrict("Tất cả huyện");
    setWard("Tất cả xã");
  }
  function handleDistrictChange(v: string) {
    setDistrict(v);
    setWard("Tất cả xã");
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#e4e8f0] bg-white px-5 py-3.5 shadow-[0_2px_12px_rgba(38,55,105,.04)]">
      {/* Time */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-400">
          Thời gian
        </span>
        <SelectNative value={period} onChange={setPeriod} options={periods} />
      </div>

      <span className="hidden h-5 w-px bg-[#e4e8f0] sm:block" />

      {/* Hierarchical location */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-400">
          Địa bàn
        </span>
        <SelectNative
          value={province}
          onChange={handleProvinceChange}
          options={["Đồng Nai", "Tất cả tỉnh"]}
        />
        {districts.length > 0 && (
          <SelectNative
            value={district}
            onChange={handleDistrictChange}
            options={districts}
          />
        )}
        {wards.length > 0 && (
          <SelectNative
            value={ward}
            onChange={setWard}
            options={wards}
          />
        )}
      </div>

      <span className="hidden h-5 w-px bg-[#e4e8f0] sm:block" />

      {/* Sector */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-400">
          Ngành hàng
        </span>
        <SelectNative value={sector} onChange={setSector} options={sectors} />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="flex items-center gap-1.5 rounded-xl border border-[#e4e8f0] px-3 py-2 text-[11px] font-medium text-slate-500 hover:border-[#2740BA] hover:text-[#2740BA] transition-colors">
          <RefreshCw className="h-3.5 w-3.5" /> Đặt lại
        </button>
        <button className="rounded-xl bg-[#2740BA] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#1e33a0] transition-colors shadow-[0_4px_12px_rgba(39,64,186,.18)]">
          Áp dụng
        </button>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  delta,
  positive,
  icon: Icon,
  color,
  bg,
}: (typeof kpiCards)[0]) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#e4e8f0] bg-white px-5 py-4 shadow-[0_2px_12px_rgba(38,55,105,.04)]">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bg}`}>
        <Icon className="h-5 w-5" style={{ color }} strokeWidth={1.8} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-slate-500">{label}</p>
        <p className="mt-0.5 text-[22px] font-bold leading-none tracking-[-0.04em] text-[#1d2944]">
          {value}
        </p>
      </div>
      <div
        className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${
          positive ? "bg-[#e7f7ee] text-[#2a8a55]" : "bg-[#fef0ee] text-[#c94040]"
        }`}
      >
        <TrendingUp className="h-3 w-3" />
        {delta}
      </div>
    </div>
  );
}

function ChartCard({
  title,
  children,
  className = "",
  span2 = false,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  span2?: boolean;
}) {
  return (
    <div
      className={`flex flex-col rounded-2xl border border-[#e4e8f0] bg-white p-5 shadow-[0_2px_12px_rgba(38,55,105,.04)] ${span2 ? "lg:col-span-2" : ""} ${className}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[13px] font-bold text-[#1d2944]">{title}</p>
        <div className="flex shrink-0 gap-1.5">
          <button className="flex items-center gap-1 rounded-lg border border-[#e4e8f0] px-2.5 py-1.5 text-[10px] font-semibold text-slate-500 transition-colors hover:border-[#2a8a55] hover:bg-[#e7f7ee] hover:text-[#2a8a55]">
            <FileDown className="h-3 w-3" />
            Excel
          </button>
          <button className="flex items-center gap-1 rounded-lg border border-[#e4e8f0] px-2.5 py-1.5 text-[10px] font-semibold text-slate-500 transition-colors hover:border-[#E8650A] hover:bg-[#fff3ea] hover:text-[#E8650A]">
            <FileDown className="h-3 w-3" />
            PDF
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

// ─── Custom tooltip label ─────────────────────────────────────────────────────
function CustomTooltipContent({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-[#e4e8f0] bg-white p-3 shadow-[0_4px_16px_rgba(30,50,100,.10)] text-[11px]">
      {label && <p className="mb-1.5 font-bold text-[#1d2944]">{label}</p>}
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-500">{p.name}:</span>
          <span className="font-semibold text-[#1d2944]">{p.value.toLocaleString("vi-VN")}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Analytics() {
  return (
    <DashboardShell title="Báo cáo & phân tích" subtitle="Thống kê tổng hợp toàn tỉnh">
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#E8650A]">
            Thống kê tổng hợp
          </p>
          <h2 className="mt-1.5 text-[24px] font-bold tracking-[-0.05em] text-[#1d2944]">
            Báo cáo &amp; phân tích
          </h2>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-[#E8650A] px-5 py-2.5 text-[12px] font-bold text-white shadow-[0_6px_18px_rgba(232,101,10,.25)] transition-colors hover:bg-[#d95c08] active:scale-95">
          <FileDown className="h-4 w-4" />
          Xuất báo cáo tổng hợp
        </button>
      </div>

      {/* Filter bar */}
      <FilterBar />

      {/* KPI row */}
      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpiCards.map((card) => (
          <KpiCard key={card.label} {...card} />
        ))}
      </div>

      {/* Charts grid — 2-column on lg+ */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* 1 — Bar: businesses by region */}
        <ChartCard title="Số lượng doanh nghiệp theo địa bàn">
          <ResponsiveContainer width="100%" height={248}>
            <BarChart
              data={businessByRegion}
              margin={{ top: 4, right: 4, left: -18, bottom: 0 }}
              barCategoryGap="30%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f8" vertical={false} />
              <XAxis
                dataKey="region"
                tick={{ fontSize: 10, fill: "#8896b0" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#8896b0" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltipContent />} />
              <Bar
                dataKey="count"
                name="Doanh nghiệp"
                fill={C.blue}
                radius={[5, 5, 0, 0]}
              >
                {businessByRegion.map((_, i) => (
                  <Cell
                    key={i}
                    fill={i === 0 ? C.blue : C.lightBlue}
                    opacity={i === 0 ? 1 : 0.72}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 2 — Bar: products by sector */}
        <ChartCard title="Số lượng sản phẩm theo ngành hàng">
          <ResponsiveContainer width="100%" height={248}>
            <BarChart
              data={productBySector}
              margin={{ top: 4, right: 4, left: -18, bottom: 0 }}
              barCategoryGap="30%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f8" vertical={false} />
              <XAxis
                dataKey="sector"
                tick={{ fontSize: 10, fill: "#8896b0" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#8896b0" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltipContent />} />
              <Bar
                dataKey="count"
                name="Sản phẩm"
                fill={C.orange}
                radius={[5, 5, 0, 0]}
                opacity={0.9}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 3 — Line: QR scans over time (full width) */}
        <ChartCard title="Lượt truy xuất / quét QR theo thời gian" span2>
          <ResponsiveContainer width="100%" height={248}>
            <LineChart
              data={qrScansByTime}
              margin={{ top: 4, right: 12, left: -18, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.blue} stopOpacity={0.12} />
                  <stop offset="95%" stopColor={C.blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f8" vertical={false} />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 10, fill: "#8896b0" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#8896b0" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltipContent />} />
              <Legend
                iconType="circle"
                iconSize={7}
                wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
              />
              <Line
                type="monotone"
                dataKey="scans"
                name="Lượt quét QR"
                stroke={C.blue}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0, fill: C.blue }}
              />
              <Line
                type="monotone"
                dataKey="registrations"
                name="Lượt đăng ký"
                stroke={C.orange}
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0, fill: C.orange }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 4 — Pie: certifications */}
        <ChartCard title="Tỉ lệ chứng nhận sản phẩm">
          <div className="flex items-center gap-2">
            <ResponsiveContainer width="52%" height={248}>
              <PieChart>
                <Pie
                  data={certificationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={95}
                  paddingAngle={2.5}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {certificationData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="white" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as (typeof certificationData)[0];
                    return (
                      <div className="rounded-xl border border-[#e4e8f0] bg-white p-3 shadow-lg text-[11px]">
                        <div className="flex items-center gap-2 font-bold text-[#1d2944]">
                          <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                          {d.name}
                        </div>
                        <p className="mt-1 text-slate-500">
                          Tỉ lệ:{" "}
                          <span className="font-semibold text-[#1d2944]">{d.value}%</span>
                        </p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-1 flex-col gap-3">
              {certificationData.map((item) => (
                <div key={item.name} className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: item.color }}
                  />
                  <span className="flex-1 text-[12px] text-slate-600">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#f0f2f8]">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${item.value}%`, background: item.color }}
                      />
                    </div>
                    <span className="w-8 text-right text-[11px] font-bold text-[#1d2944]">
                      {item.value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* 5 — Stacked bar: registration status (full width) */}
        <ChartCard title="Hồ sơ đăng ký theo trạng thái — 6 tháng gần nhất" span2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={registrationByStatus}
              margin={{ top: 4, right: 4, left: -18, bottom: 0 }}
              barCategoryGap="32%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f8" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: "#8896b0" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#8896b0" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltipContent />} />
              <Legend
                iconType="circle"
                iconSize={7}
                wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
              />
              <Bar
                dataKey="daDuyet"
                name="Đã duyệt"
                stackId="a"
                fill={C.blue}
              />
              <Bar
                dataKey="chouDuyet"
                name="Chờ duyệt"
                stackId="a"
                fill={C.orange}
              />
              <Bar
                dataKey="tuChoi"
                name="Từ chối"
                stackId="a"
                fill={C.gray}
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </DashboardShell>
  );
}
