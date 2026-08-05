import { useState, useEffect } from "react";
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
import {
  useListPortalLots,
  useGetPortalLotDetail,
  usePushToPortal,
} from "@workspace/api-client-react";
import type { ListPortalLotsSyncStatus } from "@workspace/api-client-react";

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

// ─── TXNG Portal Sync Modal (Tab 2) ──────────────────────────────────────────

interface SyncModalProps {
  lotId: number;
  onClose: () => void;
  onSuccess: () => void;
}

function SyncModal({ lotId, onClose, onSuccess }: SyncModalProps) {
  const { data: detail, isLoading } = useGetPortalLotDetail(lotId);
  const pushMutation = usePushToPortal();

  const [province, setProvince] = useState("");
  const [productionZone, setProductionZone] = useState("");
  const [pushed, setPushed] = useState(false);
  const [pushedUrl, setPushedUrl] = useState<string | null>(null);

  // Per-step overrides: keyed by stepType
  const [stepOverrides, setStepOverrides] = useState<
    Record<
      string,
      {
        startTime: string;
        endTime: string;
        executor: string;
        locationCode: string;
        description: string;
        evidenceUrl: string;
      }
    >
  >({});

  useEffect(() => {
    if (detail) {
      setProvince(detail.province ?? "Đồng Nai");
      setProductionZone(detail.productionZone ?? "");
      // Pre-fill step overrides from API data
      const overrides: typeof stepOverrides = {};
      for (const s of detail.txngSteps) {
        overrides[s.stepType] = {
          startTime: toDatetimeLocal(s.startTime),
          endTime: toDatetimeLocal(s.endTime),
          executor: s.executor ?? "",
          locationCode: s.locationCode ?? "",
          description: s.description ?? "",
          evidenceUrl: s.evidenceUrl ?? "",
        };
      }
      setStepOverrides(overrides);
    }
  }, [detail?.id]);

  function setStepField(
    stepType: string,
    field: keyof (typeof stepOverrides)[string],
    value: string,
  ) {
    setStepOverrides((prev) => ({
      ...prev,
      [stepType]: { ...(prev[stepType] ?? {}), [field]: value } as (typeof stepOverrides)[string],
    }));
  }

  async function handleSave() {
    if (!detail) return;
    const overridesArr = detail.txngSteps.map((s) => {
      const ov = stepOverrides[s.stepType] ?? {};
      return {
        stepType: s.stepType,
        stepName: s.stepName,
        startTime: ov.startTime ? new Date(ov.startTime).toISOString() : null,
        endTime: ov.endTime ? new Date(ov.endTime).toISOString() : null,
        executor: ov.executor || null,
        locationCode: ov.locationCode || null,
        description: ov.description || null,
        evidenceUrl: ov.evidenceUrl || null,
      };
    });

    try {
      const result = await pushMutation.mutateAsync({
        lotId,
        data: { province, productionZone, stepOverrides: overridesArr },
      });
      setPushedUrl(result.portalUrl);
      setPushed(true);
      onSuccess();
    } catch {
      // error shown via mutation.isError
    }
  }

  const alreadySynced = detail?.syncStatus === "synced" || pushed;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-10 backdrop-blur-sm">
      <div className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <p className="text-[13px] font-bold uppercase tracking-wide text-gray-800">
            Đồng bộ lên cổng thông tin truy xuất nguồn gốc sản phẩm, hàng hóa quốc gia
          </p>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-[#2740BA]" />
            </div>
          ) : !detail ? (
            <p className="text-center text-gray-400">Không tìm thấy dữ liệu</p>
          ) : (
            <>
              {/* Portal link */}
              <div className="flex items-center gap-1.5 text-[12px]">
                <span className="text-gray-500">Link sau khi đưa lên cổng:</span>
                {alreadySynced ? (
                  <a
                    href={pushedUrl ?? detail.portalUrl ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-[#2740BA] underline"
                  >
                    Link
                  </a>
                ) : (
                  <span className="text-gray-400 italic">Chưa đồng bộ</span>
                )}
              </div>

              {/* Basic info grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-gray-600">
                    Mã GTIN <span className="text-red-500">*</span>
                  </label>
                  <input
                    readOnly
                    value={detail.gtin}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-[12px] font-mono text-gray-700"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-gray-600">
                    Số lô/mẻ <span className="text-red-500">*</span>
                  </label>
                  <input
                    readOnly
                    value={detail.lotCode}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-[12px] font-mono text-gray-700"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-[11px] font-semibold text-gray-600">
                    Tỉnh thành <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    placeholder="Chọn một tỉnh thành"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[12px] text-gray-700 outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-gray-600">
                    Vùng trồng/sản xuất <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={productionZone}
                    onChange={(e) => setProductionZone(e.target.value)}
                    placeholder="Chọn một vùng trồng"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[12px] text-gray-700 outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-gray-600">
                    Ngành hàng <span className="text-red-500">*</span>
                  </label>
                  <input
                    readOnly
                    value={detail.industryName}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-[12px] text-gray-700"
                  />
                </div>
              </div>

              {/* TXNG Steps */}
              {detail.txngSteps.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 p-5 text-center text-[12px] text-gray-400">
                  Chưa có công đoạn TXNG. Yêu cầu bắt buộc:{" "}
                  <span className="font-semibold text-orange-500">
                    {detail.requiredStepTypes.join(", ")}
                  </span>
                </div>
              ) : (
                detail.txngSteps.map((step) => {
                  const ov = stepOverrides[step.stepType];
                  return (
                    <div
                      key={step.stepType}
                      className="overflow-hidden rounded-xl border border-gray-200"
                    >
                      {/* Step header */}
                      <div className="border-b border-gray-200 bg-gray-50 px-5 py-3 text-center">
                        <p className="text-[14px] font-bold text-gray-800">{step.stepName}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 p-5">
                        {/* Start time */}
                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-gray-600">
                            Thời gian bắt đầu
                          </label>
                          <input
                            type="datetime-local"
                            value={ov?.startTime ?? ""}
                            onChange={(e) =>
                              setStepField(step.stepType, "startTime", e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[12px] text-gray-700 outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15"
                          />
                        </div>
                        {/* End time */}
                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-gray-600">
                            Thời gian kết thúc
                          </label>
                          <input
                            type="datetime-local"
                            value={ov?.endTime ?? ""}
                            onChange={(e) =>
                              setStepField(step.stepType, "endTime", e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[12px] text-gray-700 outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15"
                          />
                        </div>
                        {/* Executor */}
                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-gray-600">
                            Người thực hiện
                          </label>
                          <input
                            value={ov?.executor ?? ""}
                            onChange={(e) =>
                              setStepField(step.stepType, "executor", e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[12px] text-gray-700 outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15"
                          />
                        </div>
                        {/* Location code */}
                        <div>
                          <label className="mb-1 block text-[11px] font-semibold text-gray-600">
                            Mã truy vết địa điểm sản xuất{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            value={ov?.locationCode ?? ""}
                            onChange={(e) =>
                              setStepField(step.stepType, "locationCode", e.target.value)
                            }
                            placeholder="Chọn một mã truy vết địa điểm"
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[12px] text-gray-700 outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15"
                          />
                        </div>
                        {/* Description */}
                        <div className="col-span-2">
                          <label className="mb-1 block text-[11px] font-semibold text-gray-600">
                            Mô tả
                          </label>
                          <textarea
                            value={ov?.description ?? ""}
                            onChange={(e) =>
                              setStepField(step.stepType, "description", e.target.value)
                            }
                            rows={3}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[12px] text-gray-700 outline-none focus:border-[#2740BA] focus:ring-2 focus:ring-[#2740BA]/15"
                          />
                        </div>
                        {/* Evidence URL */}
                        <div className="col-span-2">
                          <label className="mb-1 block text-[11px] font-semibold text-gray-600">
                            Url ảnh minh chứng
                          </label>
                          <div className="flex items-start gap-3">
                            <input
                              value={ov?.evidenceUrl ?? ""}
                              onChange={(e) =>
                                setStepField(step.stepType, "evidenceUrl", e.target.value)
                              }
                              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[12px] font-mono text-gray-600 outline-none focus:border-[#2740BA]"
                            />
                            {isImageUrl(ov?.evidenceUrl) && (
                              <img
                                src={ov!.evidenceUrl}
                                alt=""
                                className="h-20 w-28 rounded-lg border border-gray-200 object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
          {pushMutation.isError && (
            <p className="mr-auto text-[11px] text-red-500">
              Đẩy thất bại — hồ sơ chưa hoàn thiện hoặc lỗi hệ thống.
            </p>
          )}
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-[12px] font-semibold text-gray-600 hover:bg-gray-50"
          >
            Hủy
          </button>
          {alreadySynced ? (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-5 py-2.5 text-[12px] font-bold text-green-700">
              <CheckCheck className="h-3.5 w-3.5" /> Đã đồng bộ thành công
            </div>
          ) : (
            <button
              onClick={handleSave}
              disabled={pushMutation.isPending || isLoading || !detail?.isComplete}
              title={!detail?.isComplete ? "Hồ sơ chưa hoàn thiện — cần đủ công đoạn TXNG" : undefined}
              className="flex items-center gap-2 rounded-lg bg-[#2a9d6e] px-5 py-2.5 text-[12px] font-bold text-white hover:bg-[#238a5e] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pushMutation.isPending ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Đang lưu...</>
              ) : (
                <>Lưu</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Mock lots (shown when API returns empty / no DB connected) ───────────────
/* eslint-disable @typescript-eslint/no-explicit-any */
const MOCK_SOLUTION_LOTS: any[] = [
  { id: 1, productName: "Bưởi Tân Triều", gtin: "8936001234561", lotCode: "LOT-2025-001", businessName: "Cơ sở Bưởi Tân Triều", activatedAt: "2025-04-20T08:00:00.000Z", imageUrl: "https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=80&h=80&fit=crop", syncStatus: "not_synced", portalUrl: null },
  { id: 2, productName: "Xoài cát Hòa Lộc", gtin: "8936001234562", lotCode: "LOT-2025-002", businessName: "HTX Xoài Hòa Lộc", activatedAt: "2025-04-18T09:30:00.000Z", imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=80&h=80&fit=crop", syncStatus: "not_synced", portalUrl: null },
  { id: 3, productName: "Sầu riêng Monthong", gtin: "8936001234563", lotCode: "LOT-2025-003", businessName: "Cty TNHH Nông sản Đồng Nai", activatedAt: "2025-04-15T10:00:00.000Z", imageUrl: "https://images.unsplash.com/photo-1600423115367-87ea7661688f?w=80&h=80&fit=crop", syncStatus: "synced", portalUrl: "https://txng.gov.vn/lot/003" },
  { id: 4, productName: "Tiêu đen Xuân Lộc", gtin: "8936001234564", lotCode: "LOT-2025-004", businessName: "HTX Tiêu Xuân Lộc", activatedAt: "2025-04-12T07:45:00.000Z", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop", syncStatus: "not_synced", portalUrl: null },
  { id: 5, productName: "Điều rang muối", gtin: "8936001234565", lotCode: "LOT-2025-005", businessName: "Cty CP Điều Đồng Nai", activatedAt: "2025-04-10T13:00:00.000Z", imageUrl: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=80&h=80&fit=crop", syncStatus: "synced", portalUrl: "https://txng.gov.vn/lot/005" },
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

  const { data, isLoading, refetch } = useListPortalLots({
    gtin: searchGtin || undefined,
    lotCode: searchLot || undefined,
    businessName: searchBusiness || undefined,
    productName: searchProduct || undefined,
    pageSize: 50,
  });

  const rawLots = data?.data ?? [];
  const lots = rawLots.length > 0 ? rawLots : (!isLoading ? MOCK_SOLUTION_LOTS : []);
  const total = data?.total ?? lots.length;

  async function handleSend(lotId: number) {
    setSendingLot(lotId);
    // Mock: simulate API call to solution provider
    await new Promise((r) => setTimeout(r, 900));
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
          Gửi thông tin doanh nghiệp và sản phẩm sang đơn vị giải pháp để họ bổ sung dữ liệu quá trình TXNG qua API
        </p>
      </div>

      {/* Search bar */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { placeholder: "Lô thương phẩm", value: searchLot, set: setSearchLot },
          { placeholder: "Tên doanh nghiệp", value: searchBusiness, set: setSearchBusiness },
          { placeholder: "Tên thương phẩm", value: searchProduct, set: setSearchProduct },
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
          onClick={() => refetch()}
          className="ml-auto rounded-xl border border-[#e4e8f0] p-2 text-slate-400 hover:border-[#2740BA] hover:text-[#2740BA]"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#e4e8f0] bg-white shadow-sm">
        <table className="min-w-full text-[12px]">
          <thead>
            <tr className="border-b border-[#e4e8f0] bg-[#f9fafb]">
              {["STT", "Hình ảnh", "GTIN / Thương phẩm", "Lô thương phẩm", "Doanh nghiệp", "Ngày kích hoạt", "Trạng thái", "Thao tác"].map(
                (h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f2f8]">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-[#2740BA]" />
                </td>
              </tr>
            ) : lots.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-slate-400">Không có dữ liệu</td>
              </tr>
            ) : (
              lots.map((lot, idx) => {
                const isSent = sentLots.has(lot.id);
                const isSending = sendingLot === lot.id;
                return (
                  <tr key={lot.id} className="hover:bg-[#f9fafb] transition-colors">
                    <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e4e8f0] bg-[#f9fafb]">
                        {lot.imageUrl ? (
                          <img src={lot.imageUrl} alt="" className="h-7 w-7 rounded-lg object-cover" />
                        ) : (
                          <Package className="h-4 w-4 text-slate-300" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-[#25304b]">{lot.productName}</p>
                      <p className="font-mono text-[10px] text-slate-400">GTIN: {lot.gtin}</p>
                    </td>
                    <td className="px-4 py-3.5 font-mono font-semibold text-[#2740BA]">{lot.lotCode}</td>
                    <td className="px-4 py-3.5 text-slate-500">{lot.businessName}</td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-slate-400">{fmtDate(lot.activatedAt)}</td>
                    <td className="px-4 py-3.5">
                      {isSent ? (
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
                      {!isSent ? (
                        <button
                          onClick={() => handleSend(lot.id)}
                          disabled={isSending}
                          className="flex items-center gap-1.5 rounded-lg border border-[#2740BA] px-3 py-1.5 text-[11px] font-semibold text-[#2740BA] hover:bg-[#edf0ff] disabled:opacity-60"
                        >
                          {isSending ? (
                            <><Loader2 className="h-3 w-3 animate-spin" /> Đang gửi...</>
                          ) : (
                            <><Send className="h-3 w-3" /> Đồng bộ</>
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
        {!isLoading && total > 0 && (
          <div className="border-t border-[#f0f2f8] px-4 py-3 text-[11px] text-slate-400">
            Tổng: <span className="font-semibold text-[#25304b]">{total}</span> lô thương phẩm
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Mock lots for Tab 2 (shown when API returns empty / no DB connected) ─────
/* eslint-disable @typescript-eslint/no-explicit-any */
const MOCK_TXNG_LOTS: any[] = [
  { id: 101, productName: "Bưởi Tân Triều", gtin: "8936001234561", lotCode: "LOT-2025-001", businessName: "Cơ sở Bưởi Tân Triều", activatedAt: "2025-04-20T08:00:00.000Z", imageUrl: "https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=80&h=80&fit=crop", syncStatus: "synced", isComplete: true, portalUrl: "https://txng.gov.vn/lot/001" },
  { id: 102, productName: "Sầu riêng Monthong", gtin: "8936001234563", lotCode: "LOT-2025-003", businessName: "Cty TNHH Nông sản Đồng Nai", activatedAt: "2025-04-15T10:00:00.000Z", imageUrl: "https://images.unsplash.com/photo-1600423115367-87ea7661688f?w=80&h=80&fit=crop", syncStatus: "synced", isComplete: true, portalUrl: "https://txng.gov.vn/lot/003" },
  { id: 103, productName: "Điều rang muối", gtin: "8936001234565", lotCode: "LOT-2025-005", businessName: "Cty CP Điều Đồng Nai", activatedAt: "2025-04-10T13:00:00.000Z", imageUrl: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=80&h=80&fit=crop", syncStatus: "synced", isComplete: true, portalUrl: "https://txng.gov.vn/lot/005" },
  { id: 104, productName: "Xoài cát Hòa Lộc", gtin: "8936001234562", lotCode: "LOT-2025-002", businessName: "HTX Xoài Hòa Lộc", activatedAt: "2025-04-18T09:30:00.000Z", imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=80&h=80&fit=crop", syncStatus: "not_synced", isComplete: true, portalUrl: null },
  { id: 105, productName: "Tiêu đen Xuân Lộc", gtin: "8936001234564", lotCode: "LOT-2025-004", businessName: "HTX Tiêu Xuân Lộc", activatedAt: "2025-04-12T07:45:00.000Z", imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&h=80&fit=crop", syncStatus: "not_synced", isComplete: true, portalUrl: null },
  { id: 106, productName: "Cà phê Robusta Định Quán", gtin: "8936001234566", lotCode: "LOT-2025-006", businessName: "Cty TNHH Cà phê DNT", activatedAt: "2025-04-08T11:00:00.000Z", imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=80&h=80&fit=crop", syncStatus: "not_synced", isComplete: false, portalUrl: null },
  { id: 107, productName: "Mật ong rừng Định Quán", gtin: "8936001234567", lotCode: "LOT-2025-007", businessName: "HTX Ong Mật Định Quán", activatedAt: "2025-04-05T08:20:00.000Z", imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=80&h=80&fit=crop", syncStatus: "not_synced", isComplete: false, portalUrl: null },
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
          <p className="text-[14px] font-bold text-[#1d2944]">Mã QR cổng TXNG</p>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-[#f1f3fa]">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col items-center gap-3">
          <img src={qrUrl} alt="QR" className="h-48 w-48 rounded-xl border border-[#e4e8f0] bg-white" />
          <p className="font-mono text-[12px] font-bold text-[#2a9d6e] text-center">{lot.lotCode}</p>
          <p className="text-[11px] text-slate-500 font-medium text-center">{lot.productName}</p>
          <p className="text-[11px] text-slate-400 text-center">{lot.businessName}</p>
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
            <p className="text-[10px] text-slate-400 text-center italic">Chưa đồng bộ lên cổng — QR sẽ hoạt động sau khi đồng bộ.</p>
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
  const [selectedLotId, setSelectedLotId] = useState<number | null>(null);
  const [qrLot, setQrLot] = useState<typeof MOCK_TXNG_LOTS[0] | null>(null);

  const { data, isLoading, refetch } = useListPortalLots({
    syncStatus: filterStatus as ListPortalLotsSyncStatus,
    gtin: searchGtin || undefined,
    lotCode: searchLot || undefined,
    businessName: searchBusiness || undefined,
    productName: searchProduct || undefined,
    pageSize: 50,
  });

  const rawLots = data?.data ?? [];
  const useMock = !isLoading && rawLots.length === 0;

  // Apply mock filtering
  const mockFiltered = MOCK_TXNG_LOTS.filter((l) => {
    const q = searchLot.toLowerCase() + searchBusiness.toLowerCase() + searchProduct.toLowerCase() + searchGtin.toLowerCase();
    if (q && !l.lotCode.toLowerCase().includes(q) && !l.businessName.toLowerCase().includes(q) && !l.productName.toLowerCase().includes(q) && !l.gtin.includes(q)) return false;
    if (filterStatus !== "all" && l.syncStatus !== filterStatus) return false;
    return true;
  });

  const lots = useMock ? mockFiltered : rawLots;
  const total = useMock ? mockFiltered.length : (data?.total ?? 0);
  const notSyncedCount = useMock ? MOCK_TXNG_LOTS.filter((l) => l.syncStatus === "not_synced").length : (data?.notSyncedCount ?? 0);
  const syncedCount = useMock ? MOCK_TXNG_LOTS.filter((l) => l.syncStatus === "synced").length : (data?.syncedCount ?? 0);

  const filterTabs: { id: FilterStatus; label: string; count: number; active: string; inactive: string }[] = [
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
          Xem xét hồ sơ hoàn thiện từ đơn vị giải pháp và đẩy lên cổng thông tin truy xuất nguồn gốc sản phẩm, hàng hóa quốc gia
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
          { placeholder: "Lô thương phẩm", value: searchLot, set: setSearchLot },
          { placeholder: "Tên doanh nghiệp", value: searchBusiness, set: setSearchBusiness },
          { placeholder: "Tên thương phẩm", value: searchProduct, set: setSearchProduct },
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
          onClick={() => refetch()}
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
              {["STT", "Hình ảnh", "GTIN / Thương phẩm", "Lô thương phẩm", "Doanh nghiệp", "Ngày kích hoạt", "Trạng thái đồng bộ VNTP", "Thao tác"].map(
                (h) => (
                  <th key={h} className="whitespace-nowrap px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f2f8]">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-[#2740BA]" />
                </td>
              </tr>
            ) : lots.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-slate-400">Không có dữ liệu phù hợp</td>
              </tr>
            ) : (
              lots.map((lot, idx) => (
                <tr key={lot.id} className="hover:bg-[#f9fafb] transition-colors">
                  <td className="px-4 py-3.5 text-slate-400">{idx + 1}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e4e8f0] bg-[#f9fafb]">
                      {lot.imageUrl ? (
                        <img src={lot.imageUrl} alt="" className="h-7 w-7 rounded-lg object-cover" />
                      ) : (
                        <Package className="h-4 w-4 text-slate-300" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-[#25304b]">{lot.productName}</p>
                    <p className="font-mono text-[10px] text-slate-400">GTIN: {lot.gtin}</p>
                  </td>
                  <td className="px-4 py-3.5 font-mono font-semibold text-[#2740BA]">{lot.lotCode}</td>
                  <td className="px-4 py-3.5 text-slate-500">{lot.businessName}</td>
                  <td className="whitespace-nowrap px-4 py-3.5 text-slate-400">{fmtDate(lot.activatedAt)}</td>
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
                    <div className="flex items-center gap-1.5">
                      {/* QR modal button */}
                      <button
                        onClick={() => setQrLot(lot)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-[#e6f7f7] hover:text-[#2a9d6e]"
                        title="Xem mã QR"
                      >
                        <QrCode className="h-3.5 w-3.5" />
                      </button>
                      {/* Sync/push icon */}
                      {lot.syncStatus === "synced" ? (
                        <button
                          onClick={() => setSelectedLotId(lot.id)}
                          className="rounded-lg p-1.5 text-[#1f7a45] hover:bg-[#e8f5ed]"
                          title="Xem trên cổng"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedLotId(lot.id)}
                          disabled={!lot.isComplete}
                          title={lot.isComplete ? "Đẩy lên cổng" : "Hồ sơ chưa hoàn thiện"}
                          className="rounded-lg p-1.5 text-[#2740BA] hover:bg-[#edf0ff] disabled:cursor-not-allowed disabled:text-slate-300"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* QR Modal */}
      {qrLot !== null && (
        <PortalQrModal
          lot={qrLot}
          onClose={() => setQrLot(null)}
        />
      )}

      {/* Sync / detail modal */}
      {selectedLotId !== null && (
        <SyncModal
          lotId={selectedLotId}
          onClose={() => setSelectedLotId(null)}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const PAGE_TABS = [
  { id: "solution", label: "Đồng bộ sang đơn vị giải pháp" },
  { id: "portal",   label: "Cổng thông tin TXNG QG" },
] as const;
type PageTab = (typeof PAGE_TABS)[number]["id"];

export default function Sync() {
  const [tab, setTab] = useState<PageTab>("solution");

  return (
    <DashboardShell title="Đồng bộ dữ liệu" subtitle="Đồng bộ hồ sơ sang đơn vị giải pháp và cổng thông tin TXNG quốc gia">
      {/* Page title */}
      <div className="mb-5">
        <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#E8650A]">Hệ thống</p>
        <h2 className="mt-1.5 text-[24px] font-bold tracking-[-0.05em] text-[#1d2944]">Đồng bộ dữ liệu</h2>
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
      {tab === "portal"   && <TxngPortalTab />}
    </DashboardShell>
  );
}
