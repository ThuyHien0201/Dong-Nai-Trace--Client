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
import { FileDown, ChevronDown } from "lucide-react";

const COLORS = {
  blue: "#2740BA",
  orange: "#E8650A",
  green: "#4f9a77",
  teal: "#3b9fbb",
  gray: "#A8B2C8",
  lightBlue: "#6d88e0",
};

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
  { period: "T1", scans: 4200 },
  { period: "T2", scans: 5100 },
  { period: "T3", scans: 4780 },
  { period: "T4", scans: 6320 },
  { period: "T5", scans: 7140 },
  { period: "T6", scans: 6820 },
  { period: "T7", scans: 8230 },
  { period: "T8", scans: 9170 },
  { period: "T9", scans: 10480 },
  { period: "T10", scans: 11240 },
  { period: "T11", scans: 12890 },
  { period: "T12", scans: 14520 },
];

const certificationData = [
  { name: "VietGAP", value: 38, color: COLORS.blue },
  { name: "OCOP", value: 27, color: COLORS.orange },
  { name: "HACCP", value: 18, color: COLORS.green },
  { name: "GlobalGAP", value: 10, color: COLORS.teal },
  { name: "Khác", value: 7, color: COLORS.gray },
];

const registrationByStatus = [
  { month: "T7", chouDuyet: 28, daDuyet: 45, tuChoi: 8 },
  { month: "T8", chouDuyet: 32, daDuyet: 52, tuChoi: 11 },
  { month: "T9", chouDuyet: 24, daDuyet: 61, tuChoi: 7 },
  { month: "T10", chouDuyet: 38, daDuyet: 58, tuChoi: 14 },
  { month: "T11", chouDuyet: 29, daDuyet: 71, tuChoi: 9 },
  { month: "T12", chouDuyet: 18, daDuyet: 84, tuChoi: 6 },
];

function FilterBar() {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#e4e8f0] bg-white p-4 shadow-[0_2px_12px_rgba(38,55,105,.04)]">
      <Select label="Thời gian" options={["Tháng này", "Tuần này", "Ngày hôm nay", "Quý này", "Năm nay"]} />
      <Select label="Tỉnh/Thành phố" options={["Đồng Nai", "Tất cả"]} />
      <Select label="Huyện" options={["Tất cả huyện", "Biên Hòa", "Long Khánh", "Xuân Lộc"]} />
      <Select label="Ngành hàng" options={["Tất cả ngành", "Nông sản", "Thực phẩm CB", "Thủy sản", "OCOP"]} />
      <button className="ml-auto rounded-xl bg-[#2740BA] px-4 py-2 text-[12px] font-semibold text-white hover:bg-[#1e33a0] transition-colors">
        Áp dụng bộ lọc
      </button>
    </div>
  );
}

function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="relative">
      <select className="h-9 appearance-none rounded-xl border border-[#e4e8f0] bg-[#f9fafb] pl-3 pr-8 text-[12px] font-medium text-[#25304b] outline-none transition focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

function ChartCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col rounded-2xl border border-[#e4e8f0] bg-white p-5 shadow-[0_2px_12px_rgba(38,55,105,.04)] ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[13px] font-bold text-[#1d2944]">{title}</p>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-[#e4e8f0] px-2.5 py-1.5 text-[10px] font-medium text-slate-500 hover:border-[#2740BA] hover:text-[#2740BA] transition-colors">
            <FileDown className="h-3 w-3" /> Excel
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-[#e4e8f0] px-2.5 py-1.5 text-[10px] font-medium text-slate-500 hover:border-[#E8650A] hover:text-[#E8650A] transition-colors">
            <FileDown className="h-3 w-3" /> PDF
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function Analytics() {
  return (
    <DashboardShell title="Báo cáo & phân tích" subtitle="Thống kê tổng hợp toàn tỉnh">
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#E8650A]">
            Thống kê tổng hợp
          </p>
          <h2 className="mt-1.5 text-[24px] font-bold tracking-[-.05em] text-[#1d2944]">
            Báo cáo & phân tích
          </h2>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-[#E8650A] px-5 py-2.5 text-[12px] font-bold text-white shadow-[0_6px_18px_rgba(232,101,10,.22)] hover:bg-[#d95c08] transition-colors">
          <FileDown className="h-4 w-4" /> Xuất báo cáo tổng hợp
        </button>
      </div>

      {/* Filter bar */}
      <FilterBar />

      {/* Charts grid */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Bar: businesses by region */}
        <ChartCard title="Số lượng doanh nghiệp theo địa bàn">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={businessByRegion} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f8" />
              <XAxis dataKey="region" tick={{ fontSize: 10, fill: "#8896b0" }} />
              <YAxis tick={{ fontSize: 10, fill: "#8896b0" }} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 10, border: "1px solid #e4e8f0" }}
                cursor={{ fill: "#f0f2fb" }}
              />
              <Bar dataKey="count" name="Doanh nghiệp" fill={COLORS.blue} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Bar: products by sector */}
        <ChartCard title="Số lượng sản phẩm theo ngành hàng">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={productBySector} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f8" />
              <XAxis dataKey="sector" tick={{ fontSize: 10, fill: "#8896b0" }} />
              <YAxis tick={{ fontSize: 10, fill: "#8896b0" }} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 10, border: "1px solid #e4e8f0" }}
                cursor={{ fill: "#f0f2fb" }}
              />
              <Bar dataKey="count" name="Sản phẩm" fill={COLORS.orange} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Line: QR scans over time */}
        <ChartCard title="Lượt truy xuất / quét QR theo thời gian">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={qrScansByTime} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f8" />
              <XAxis dataKey="period" tick={{ fontSize: 10, fill: "#8896b0" }} />
              <YAxis tick={{ fontSize: 10, fill: "#8896b0" }} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 10, border: "1px solid #e4e8f0" }}
              />
              <Line
                type="monotone"
                dataKey="scans"
                name="Lượt quét"
                stroke={COLORS.blue}
                strokeWidth={2.5}
                dot={{ r: 3, fill: COLORS.blue }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Pie: certifications */}
        <ChartCard title="Tỉ lệ chứng nhận sản phẩm">
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="55%" height={240}>
              <PieChart>
                <Pie
                  data={certificationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {certificationData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ fontSize: 11, borderRadius: 10, border: "1px solid #e4e8f0" }}
                  formatter={(v: number) => [`${v}%`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2.5">
              {certificationData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: item.color }} />
                  <span className="text-[11px] text-slate-600">{item.name}</span>
                  <span className="ml-auto pl-4 text-[11px] font-bold text-[#1d2944]">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Stacked bar: registrations by status */}
      <div className="mt-5">
        <ChartCard title="Hồ sơ đăng ký theo trạng thái — 6 tháng gần nhất">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={registrationByStatus} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f8" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#8896b0" }} />
              <YAxis tick={{ fontSize: 10, fill: "#8896b0" }} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 10, border: "1px solid #e4e8f0" }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Bar dataKey="daDuyet" name="Đã duyệt" stackId="a" fill={COLORS.blue} />
              <Bar dataKey="chouDuyet" name="Chờ duyệt" stackId="a" fill={COLORS.orange} />
              <Bar dataKey="tuChoi" name="Từ chối" stackId="a" fill={COLORS.gray} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </DashboardShell>
  );
}
