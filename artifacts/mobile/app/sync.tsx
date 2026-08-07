import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  useListPortalLots,
  type ListPortalLotsSyncStatus,
} from "@workspace/api-client-react";

type FeatherName = React.ComponentProps<typeof Feather>["name"];
type PageTab = "solution" | "portal";
type FilterStatus = "all" | "not_synced" | "synced";

type Lot = {
  id: number;
  productName: string;
  gtin: string;
  lotCode: string;
  businessName: string;
  activatedAt: string;
  imageUrl?: string | null;
  syncStatus: "synced" | "not_synced";
  isComplete: boolean;
  portalUrl?: string | null;
};

type TxngStep = {
  stepType: string;
  stepName: string;
  startTime: string;
  endTime: string;
  executor: string;
  locationCode: string;
  description: string;
  evidenceUrl: string;
};

const MOCK_LOTS: Lot[] = [
  {
    id: 101,
    productName: "Bưởi Tân Triều",
    gtin: "8936001234561",
    lotCode: "LOT-2025-001",
    businessName: "Cơ sở Bưởi Tân Triều",
    activatedAt: "2025-04-20T08:00:00.000Z",
    imageUrl:
      "https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=160&h=160&fit=crop",
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
      "https://images.unsplash.com/photo-1600423115367-87ea7661688f?w=160&h=160&fit=crop",
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
      "https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=160&h=160&fit=crop",
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
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=160&h=160&fit=crop",
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
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=160&h=160&fit=crop",
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
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=160&h=160&fit=crop",
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
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=160&h=160&fit=crop",
    syncStatus: "not_synced",
    isComplete: false,
    portalUrl: null,
  },
];

const MOCK_STEPS: TxngStep[] = [
  {
    stepType: "planting",
    stepName: "Gieo trồng / Nuôi trồng",
    startTime: "2025-01-10T07:00",
    endTime: "2025-01-10T17:00",
    executor: "Đơn vị sản xuất",
    locationCode: "LOC-VT-001",
    description: "Ghi nhận công đoạn sản xuất ban đầu.",
    evidenceUrl: "",
  },
  {
    stepType: "care",
    stepName: "Chăm sóc",
    startTime: "2025-01-15T07:00",
    endTime: "2025-03-20T17:00",
    executor: "Đơn vị sản xuất",
    locationCode: "LOC-VT-001",
    description: "Theo dõi quá trình chăm sóc và kiểm soát chất lượng.",
    evidenceUrl: "",
  },
  {
    stepType: "harvest",
    stepName: "Thu hoạch",
    startTime: "2025-04-18T06:00",
    endTime: "2025-04-18T14:00",
    executor: "Đội thu hoạch",
    locationCode: "LOC-VT-001",
    description: "Ghi nhận thời điểm và đơn vị thực hiện thu hoạch.",
    evidenceUrl: "",
  },
  {
    stepType: "processing",
    stepName: "Sơ chế / Đóng gói",
    startTime: "2025-04-18T15:00",
    endTime: "2025-04-18T20:00",
    executor: "Xưởng sơ chế",
    locationCode: "LOC-SC-002",
    description: "Ghi nhận sơ chế, phân loại và đóng gói.",
    evidenceUrl: "",
  },
  {
    stepType: "transport",
    stepName: "Vận chuyển",
    startTime: "2025-04-19T05:00",
    endTime: "2025-04-19T10:00",
    executor: "Đơn vị vận tải",
    locationCode: "LOC-VT-003",
    description: "Theo dõi hành trình vận chuyển của lô hàng.",
    evidenceUrl: "",
  },
  {
    stepType: "distribution",
    stepName: "Phân phối",
    startTime: "2025-04-19T11:00",
    endTime: "2025-04-19T16:00",
    executor: "Đơn vị phân phối",
    locationCode: "LOC-PP-004",
    description: "Ghi nhận điểm và đơn vị tiếp nhận phân phối.",
    evidenceUrl: "",
  },
];

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function mockStepsForLot(lot: Lot) {
  return MOCK_STEPS.map((step) => ({
    ...step,
    executor: step.executor === "Đơn vị sản xuất" ? lot.businessName : step.executor,
  }));
}

function IconButton({
  icon,
  label,
  color = "#2740BA",
  onPress,
  disabled,
}: {
  icon: FeatherName;
  label: string;
  color?: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled}
      style={[s.iconButton, { borderColor: color }, disabled && s.disabled]}
    >
      <Feather name={icon} size={15} color={disabled ? "#c8cfdd" : color} />
    </TouchableOpacity>
  );
}

function StatusBadge({
  lot,
  sessionSynced,
}: {
  lot: Lot;
  sessionSynced: boolean;
}) {
  const synced = lot.syncStatus === "synced" || sessionSynced;
  const color = synced ? "#1f7a45" : lot.isComplete ? "#E8650A" : "#6b7694";
  const bg = synced ? "#e8f5ed" : lot.isComplete ? "#fff4ed" : "#f2f3f7";
  return (
    <View style={[s.statusBadge, { backgroundColor: bg }]}>
      <Feather
        name={synced ? "check-circle" : lot.isComplete ? "upload" : "clock"}
        size={11}
        color={color}
      />
      <Text style={[s.statusText, { color }]}>
        {synced ? "Đã đồng bộ" : lot.isComplete ? "Chưa đồng bộ" : "Thiếu dữ liệu TXNG"}
      </Text>
    </View>
  );
}

function SearchField({
  placeholder,
  value,
  onChangeText,
}: {
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <View style={s.searchField}>
      <Feather name="search" size={14} color="#a8b2c8" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#a8b2c8"
        style={s.searchInput}
        autoCapitalize="none"
      />
      {!!value && (
        <TouchableOpacity onPress={() => onChangeText("")} accessibilityLabel={`Xóa ${placeholder}`}>
          <Feather name="x" size={14} color="#6b7694" />
        </TouchableOpacity>
      )}
    </View>
  );
}

function QrModal({ lot, onClose }: { lot: Lot; onClose: () => void }) {
  const url =
    lot.portalUrl ??
    `https://txng.gov.vn/lot/${lot.lotCode.toLowerCase().replace("lot-", "")}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(url)}&color=2a9d6e&bgcolor=ffffff&margin=10`;
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.qrCard}>
          <View style={s.modalTitleRow}>
            <Text style={s.modalTitle}>Mã QR cổng TXNG</Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Đóng mã QR">
              <Feather name="x" size={20} color="#6b7694" />
            </TouchableOpacity>
          </View>
          <Image source={{ uri: qrUrl }} style={s.qrImage} />
          <Text style={s.qrLot}>{lot.lotCode}</Text>
          <Text style={s.qrProduct}>{lot.productName}</Text>
          <Text style={s.qrBusiness}>{lot.businessName}</Text>
          {lot.syncStatus === "synced" && lot.portalUrl ? (
            <TouchableOpacity
              style={s.portalLink}
              onPress={() => Alert.alert("Liên kết cổng TXNG", lot.portalUrl ?? "")}
            >
              <Feather name="external-link" size={14} color="#2a9d6e" />
              <Text style={s.portalLinkText}>Xem trên cổng TXNG</Text>
            </TouchableOpacity>
          ) : (
            <Text style={s.qrHint}>QR sẽ hoạt động sau khi đồng bộ lên cổng.</Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

function SyncModal({
  lot,
  onClose,
  onSuccess,
}: {
  lot: Lot;
  onClose: () => void;
  onSuccess: (id: number) => void;
}) {
  const [step, setStep] = useState<"basic" | "txng">("basic");
  const [pushed, setPushed] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [province, setProvince] = useState("Đồng Nai");
  const [productionZone, setProductionZone] = useState("Vùng sản xuất Đồng Nai");
  const [steps, setSteps] = useState<TxngStep[]>(() => mockStepsForLot(lot));

  const setStepField = (index: number, field: keyof TxngStep, value: string) => {
    setSteps((current) =>
      current.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const pushToPortal = () => {
    setPushing(true);
    setTimeout(() => {
      setPushing(false);
      setPushed(true);
      onSuccess(lot.id);
    }, 1000);
  };

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={s.modalSafe}>
        <View style={s.modalHeader}>
          <View style={s.modalHeaderText}>
            <Text style={s.eyebrow}>CỔNG TXNG QUỐC GIA</Text>
            <Text style={s.modalProduct} numberOfLines={1}>{lot.productName}</Text>
          </View>
          <TouchableOpacity onPress={onClose} accessibilityLabel="Đóng đồng bộ">
            <Feather name="x" size={22} color="#1d2944" />
          </TouchableOpacity>
        </View>
        {!pushed && (
          <View style={s.wizardBar}>
            {(["basic", "txng"] as const).map((item, index) => (
              <React.Fragment key={item}>
                <View style={s.wizardStep}>
                  <View style={[s.wizardDot, (step === item || (item === "basic" && step === "txng")) && s.wizardDotActive]}>
                    {item === "basic" && step === "txng" ? (
                      <Feather name="check" size={12} color="#fff" />
                    ) : (
                      <Text style={[s.wizardNumber, step === item && s.wizardNumberActive]}>{index + 1}</Text>
                    )}
                  </View>
                  <Text style={[s.wizardLabel, step === item && s.wizardLabelActive]}>
                    {item === "basic" ? "Thông tin cơ bản" : "Thông tin TXNG"}
                  </Text>
                </View>
                {index === 0 && <View style={s.wizardLine} />}
              </React.Fragment>
            ))}
          </View>
        )}
        <ScrollView contentContainerStyle={s.modalContent} keyboardShouldPersistTaps="handled">
          {pushed ? (
            <View style={s.successState}>
              <View style={s.successIcon}><Feather name="check" size={34} color="#2a9d6e" /></View>
              <Text style={s.successTitle}>Đồng bộ thành công!</Text>
              <Text style={s.successText}>Hồ sơ đã được đẩy lên Cổng thông tin TXNG quốc gia.</Text>
              <View style={s.successUrl}>
                <Feather name="external-link" size={14} color="#2a9d6e" />
                <Text style={s.successUrlText}>txng.gov.vn/lot/{lot.lotCode.replace("LOT-", "")}</Text>
              </View>
            </View>
          ) : step === "basic" ? (
            <View>
              <View style={s.productPreview}>
                {lot.imageUrl ? <Image source={{ uri: lot.imageUrl }} style={s.previewImage} /> : <View style={s.previewImageFallback}><Feather name="package" size={22} color="#a8b2c8" /></View>}
                <View style={s.previewText}>
                  <Text style={s.previewName}>{lot.productName}</Text>
                  <Text style={s.previewBusiness}>{lot.businessName}</Text>
                  <Text style={s.previewMeta}>GTIN: {lot.gtin}  ·  {lot.lotCode}</Text>
                </View>
              </View>
              <Text style={s.sectionLabel}>THÔNG TIN HỒ SƠ</Text>
              {[
                ["Doanh nghiệp", lot.businessName],
                ["Mã GTIN", lot.gtin],
                ["Số lô/mẻ", lot.lotCode],
                ["Ngày kích hoạt", formatDate(lot.activatedAt)],
              ].map(([label, value]) => (
                <View key={label} style={s.readonlyRow}>
                  <Text style={s.fieldLabel}>{label}</Text>
                  <Text style={s.readonlyValue}>{value}</Text>
                </View>
              ))}
              <Text style={s.sectionLabel}>THÔNG TIN CẦN BỔ SUNG</Text>
              <Text style={s.fieldLabel}>Tỉnh thành *</Text>
              <TextInput value={province} onChangeText={setProvince} style={s.input} />
              <Text style={s.fieldLabel}>Vùng trồng / sản xuất *</Text>
              <TextInput value={productionZone} onChangeText={setProductionZone} style={s.input} />
            </View>
          ) : (
            <View>
              <Text style={s.sectionTitle}>Các bước TXNG</Text>
              <Text style={s.sectionHint}>Điều chỉnh đầy đủ thông tin quá trình truy xuất nguồn gốc.</Text>
              {steps.map((item, index) => (
                <View key={item.stepType} style={s.txngCard}>
                  <View style={s.txngCardHeader}>
                    <View style={s.txngNumber}><Text style={s.txngNumberText}>{index + 1}</Text></View>
                    <Text style={s.txngName}>{item.stepName}</Text>
                  </View>
                  <View style={s.fieldPair}>
                    <View style={s.halfField}>
                      <Text style={s.fieldLabel}>Bắt đầu</Text>
                      <TextInput value={item.startTime} onChangeText={(v) => setStepField(index, "startTime", v)} style={s.smallInput} />
                    </View>
                    <View style={s.halfField}>
                      <Text style={s.fieldLabel}>Kết thúc</Text>
                      <TextInput value={item.endTime} onChangeText={(v) => setStepField(index, "endTime", v)} style={s.smallInput} />
                    </View>
                  </View>
                  <Text style={s.fieldLabel}>Người thực hiện</Text>
                  <TextInput value={item.executor} onChangeText={(v) => setStepField(index, "executor", v)} style={s.input} />
                  <Text style={s.fieldLabel}>Mã truy vết địa điểm *</Text>
                  <TextInput value={item.locationCode} onChangeText={(v) => setStepField(index, "locationCode", v)} style={[s.input, s.monoInput]} />
                  <Text style={s.fieldLabel}>Mô tả</Text>
                  <TextInput value={item.description} onChangeText={(v) => setStepField(index, "description", v)} style={[s.input, s.textarea]} multiline />
                  <Text style={s.fieldLabel}>URL ảnh minh chứng</Text>
                  <TextInput value={item.evidenceUrl} onChangeText={(v) => setStepField(index, "evidenceUrl", v)} placeholder="https://..." placeholderTextColor="#a8b2c8" style={[s.input, s.monoInput]} />
                </View>
              ))}
            </View>
          )}
        </ScrollView>
        <View style={s.modalFooter}>
          {pushed ? (
            <TouchableOpacity onPress={onClose} style={s.primaryButton}><Text style={s.primaryButtonText}>Đóng</Text></TouchableOpacity>
          ) : step === "basic" ? (
            <>
              <TouchableOpacity onPress={onClose} style={s.secondaryButton}><Text style={s.secondaryButtonText}>Hủy</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setStep("txng")} style={s.primaryButton}><Text style={s.primaryButtonText}>Tiếp tục</Text><Feather name="arrow-right" size={15} color="#fff" /></TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={() => setStep("basic")} style={s.secondaryButton}><Feather name="arrow-left" size={15} color="#6b7694" /><Text style={s.secondaryButtonText}>Quay lại</Text></TouchableOpacity>
              <TouchableOpacity onPress={pushToPortal} disabled={pushing} style={[s.successButton, pushing && s.disabled]}>
                {pushing ? <ActivityIndicator size="small" color="#fff" /> : <Feather name="upload" size={15} color="#fff" />}
                <Text style={s.primaryButtonText}>{pushing ? "Đang đẩy lên..." : "Xác nhận đẩy lên Cổng"}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function LotCard({
  lot,
  sessionSynced,
  solutionSent,
  onSync,
  onQr,
  onSend,
  sending,
  solution,
}: {
  lot: Lot;
  sessionSynced: boolean;
  solutionSent: boolean;
  onSync: () => void;
  onQr: () => void;
  onSend: () => void;
  sending: boolean;
  solution?: boolean;
}) {
  const synced = solution ? solutionSent : lot.syncStatus === "synced" || sessionSynced;
  return (
    <View style={s.lotCard}>
      <View style={s.lotHeader}>
        {lot.imageUrl ? <Image source={{ uri: lot.imageUrl }} style={s.lotImage} /> : <View style={s.lotImageFallback}><Feather name="package" size={20} color="#a8b2c8" /></View>}
        <View style={s.lotTitleBlock}>
          <Text style={s.lotName}>{lot.productName}</Text>
          <Text style={s.lotBusiness}>{lot.businessName}</Text>
          <Text style={s.lotCode}>GTIN: {lot.gtin}</Text>
        </View>
        {solution ? (
          <View style={[s.compactBadge, { backgroundColor: synced ? "#e8f5ed" : "#f2f3f7" }]}>
            <Text style={[s.compactBadgeText, { color: synced ? "#1f7a45" : "#6b7694" }]}>{synced ? "Đã gửi" : "Chưa gửi"}</Text>
          </View>
        ) : <StatusBadge lot={lot} sessionSynced={sessionSynced} />}
      </View>
      <View style={s.lotInfoRow}>
        {!solution && (
          <View style={s.lotInfo}><Feather name="hash" size={12} color="#6b7694" /><Text style={s.lotInfoText}>{lot.lotCode}</Text></View>
        )}
        <View style={s.lotInfo}><Feather name="calendar" size={12} color="#6b7694" /><Text style={s.lotInfoText}>{formatDate(lot.activatedAt)}</Text></View>
      </View>
      <View style={s.cardActions}>
        {!solution && <IconButton icon="grid" label="Xem mã QR" color={synced ? "#2a9d6e" : "#6b7694"} onPress={onQr} />}
        {solution ? (
          <TouchableOpacity style={s.cardPrimaryButton} onPress={onSend} disabled={sending}>
            {sending ? <ActivityIndicator size="small" color="#fff" /> : <Feather name={synced ? "refresh-cw" : "send"} size={14} color="#fff" />}
            <Text style={s.cardPrimaryText}>{sending ? "Đang gửi..." : synced ? "Đồng bộ lại" : "Đồng bộ"}</Text>
          </TouchableOpacity>
        ) : !synced ? (
          <TouchableOpacity style={[s.cardPrimaryButton, !lot.isComplete && s.inactiveButton]} onPress={onSync} disabled={!lot.isComplete}>
            <Feather name="refresh-cw" size={14} color={!lot.isComplete ? "#a8b2c8" : "#fff"} />
            <Text style={[s.cardPrimaryText, !lot.isComplete && s.inactiveButtonText]}>{lot.isComplete ? "Đồng bộ" : "Thiếu TXNG"}</Text>
          </TouchableOpacity>
        ) : (
          <View style={s.syncedAction}><Feather name="check-circle" size={14} color="#2a9d6e" /><Text style={s.syncedActionText}> Đã đồng bộ</Text></View>
        )}
      </View>
    </View>
  );
}

export default function SyncScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<PageTab>("solution");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [syncLot, setSyncLot] = useState<Lot | null>(null);
  const [qrLot, setQrLot] = useState<Lot | null>(null);
  const [sessionSynced, setSessionSynced] = useState<Set<number>>(new Set());
  const [sentLots, setSentLots] = useState<Set<number>>(new Set());
  const [sendingLot, setSendingLot] = useState<number | null>(null);
  const [syncingAll, setSyncingAll] = useState(false);

  const { data, isLoading, error, refetch } = useListPortalLots({
    syncStatus: filterStatus === "all" ? undefined : (filterStatus as ListPortalLotsSyncStatus),
    gtin: undefined,
    lotCode: undefined,
    businessName: undefined,
    productName: undefined,
    pageSize: 50,
  });

  const apiLots: Lot[] = (data?.data ?? []).map((lot) => ({
    id: lot.id,
    productName: lot.productName,
    gtin: lot.gtin,
    lotCode: lot.lotCode,
    businessName: lot.businessName,
    activatedAt: lot.activatedAt ?? "",
    imageUrl: lot.imageUrl,
    syncStatus: lot.syncStatus === "synced" ? "synced" : "not_synced",
    isComplete: lot.isComplete ?? true,
    portalUrl: lot.portalUrl,
  }));
  const sourceLots = apiLots.length > 0 ? apiLots : !isLoading ? MOCK_LOTS : [];
  const lots = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sourceLots.filter((lot) => {
      const matchesSearch =
        !query ||
        lot.lotCode.toLowerCase().includes(query) ||
        lot.businessName.toLowerCase().includes(query) ||
        lot.productName.toLowerCase().includes(query) ||
        lot.gtin.toLowerCase().includes(query);
      const synced = lot.syncStatus === "synced" || sessionSynced.has(lot.id);
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "synced" ? synced : !synced);
      return matchesSearch && matchesStatus;
    });
  }, [filterStatus, search, sessionSynced, sourceLots]);

  const allSourceLots = apiLots.length > 0 ? apiLots : MOCK_LOTS;
  const pendingLots = allSourceLots.filter((lot) => lot.syncStatus !== "synced" && !sessionSynced.has(lot.id));
  const syncedCount = allSourceLots.filter((lot) => lot.syncStatus === "synced" || sessionSynced.has(lot.id)).length;
  const sendLot = (id: number) => {
    setSendingLot(id);
    setTimeout(() => {
      setSentLots((current) => new Set(current).add(id));
      setSendingLot(null);
    }, 900);
  };
  const syncAll = () => {
    if (!pendingLots.length) {
      Alert.alert("Thông báo", "Không có lô hàng nào cần đồng bộ.");
      return;
    }
    setSyncingAll(true);
    setTimeout(() => {
      setSessionSynced((current) => new Set([...current, ...pendingLots.map((lot) => lot.id)]));
      setSyncingAll(false);
      Alert.alert("Hoàn tất", `Đã đồng bộ ${pendingLots.length} lô hàng lên cổng quốc gia.`);
    }, 1400);
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backButton} accessibilityLabel="Quay lại">
          <Feather name="arrow-left" size={20} color="#1d2944" />
        </TouchableOpacity>
        <View style={s.headerText}>
          <Text style={s.title} numberOfLines={1}>Đồng bộ dữ liệu</Text>
          <Text style={s.subtitle} numberOfLines={1}>Hồ sơ giải pháp & cổng truy xuất nguồn gốc</Text>
        </View>
        {tab === "portal" && (
          <TouchableOpacity style={s.syncAllButton} onPress={syncAll} disabled={syncingAll}>
            {syncingAll ? <ActivityIndicator size="small" color="#fff" /> : <><Feather name="refresh-cw" size={14} color="#fff" /><Text style={s.syncAllText}>Đồng bộ tất cả</Text></>}
          </TouchableOpacity>
        )}
      </View>
      <View style={s.tabContainer}>
        <TouchableOpacity
          onPress={() => setTab("solution")}
          style={[
            s.tab,
            tab === "solution" && s.activeTab,
          ]}
        >
          <Text
            style={[
              s.tabText,
              tab === "solution" && s.activeTabText,
            ]}
            numberOfLines={1}
          >
            Đơn vị giải pháp
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setTab("portal")}
          style={[
            s.tab,
            tab === "portal" && s.activeTab,
          ]}
        >
          <Text
            style={[
              s.tabText,
              tab === "portal" && s.activeTabText,
            ]}
            numberOfLines={1}
          >
            Cổng TXNG Đồng Nai
          </Text>
        </TouchableOpacity>
      </View>

      <View style={s.pageIntro}>
        <Text style={s.eyebrow}>HỆ THỐNG</Text>
        <Text style={s.pageTitle} numberOfLines={2}>{tab === "solution" ? "Đồng bộ sang đơn vị giải pháp" : "Cổng truy xuất nguồn gốc"}</Text>
        
      </View>
      <View style={s.apiStatus}>
        <Feather name={error ? "wifi-off" : "wifi"} size={12} color={error ? "#a8b2c8" : "#1f7a45"} />
        <Text style={[s.apiStatusText, { color: error ? "#a8b2c8" : "#1f7a45" }]}>
          {error ? "API không kết nối — đang hiển thị dữ liệu mẫu" : isLoading ? "Đang tải từ API..." : "Kết nối API: Bình thường"}
        </Text>
        {isLoading && <ActivityIndicator size="small" color="#2740BA" />}
      </View>

      {tab === "portal" && (
        <View style={s.filterRow}>
          {[
            ["all", "Tất cả", allSourceLots.length],
            ["not_synced", "Chưa đồng bộ", allSourceLots.filter((lot) => lot.syncStatus !== "synced" && !sessionSynced.has(lot.id)).length],
            ["synced", "Đã đồng bộ", syncedCount],
          ].map(([id, label, count]) => (
            <TouchableOpacity key={String(id)} onPress={() => setFilterStatus(id as FilterStatus)} style={[s.filterChip, filterStatus === id && s.filterChipActive]}>
              <Text numberOfLines={1} style={[s.filterChipText, filterStatus === id && s.filterChipTextActive]}>{label} ({count})</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <View style={s.searchRow}>
        <SearchField placeholder="Lô, doanh nghiệp, thương phẩm hoặc GTIN" value={search} onChangeText={setSearch} />
        <IconButton icon="refresh-cw" label="Làm mới dữ liệu" color="#6b7694" onPress={() => void refetch()} />
      </View>
      <ScrollView contentContainerStyle={s.listContent} showsVerticalScrollIndicator={false}>
        {lots.map((lot) => (
          <LotCard
            key={lot.id}
            lot={lot}
            sessionSynced={sessionSynced.has(lot.id)}
            solutionSent={sentLots.has(lot.id)}
            onQr={() => setQrLot(lot)}
            onSync={() => setSyncLot(lot)}
            onSend={() => sendLot(lot.id)}
            sending={sendingLot === lot.id}
            solution={tab === "solution"}
          />
        ))}
        {!isLoading && lots.length === 0 && (
          <View style={s.emptyState}><Feather name="package" size={34} color="#c8cfdd" /><Text style={s.emptyText}>Không có dữ liệu phù hợp</Text></View>
        )}
      </ScrollView>
      {qrLot && <QrModal lot={qrLot} onClose={() => setQrLot(null)} />}
      {syncLot && (
        <SyncModal
          lot={syncLot}
          onClose={() => setSyncLot(null)}
          onSuccess={(id) => setSessionSynced((current) => new Set(current).add(id))}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: "#F3F5F9",
    borderRadius: 12,
    padding: 4,
  },

  activeTabText: {
    color: "#FFFFFF",
  },
  safe: { flex: 1, backgroundColor: "#f5f7fb" },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 10, paddingBottom: 8, gap: 9 },
  backButton: { padding: 4 },
  headerText: { flex: 1, minWidth: 0 },
  title: { fontSize: 18, fontWeight: "700", color: "#1d2944", letterSpacing: -0.5, flexShrink: 1 },
  subtitle: { fontSize: 10, color: "#6b7694", marginTop: 2, flexShrink: 1 },
  syncAllButton: { flexShrink: 0, flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#2740BA", paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 },
  syncAllText: { fontSize: 10, fontWeight: "700", color: "#fff" },
  tabScroll: { flexGrow: 0, maxHeight: 52, borderBottomWidth: 1, borderBottomColor: "#e4e8f0" },
  tabs: { paddingHorizontal: 16, gap: 8, alignItems: "center" },
  tab: { minHeight: 36, paddingHorizontal: 13, paddingVertical: 9, borderRadius: 9, backgroundColor: "#fff", borderWidth: 1, borderColor: "#e4e8f0", flexShrink: 0 },
  activeTab: { backgroundColor: "#2740BA", borderColor: "#2740BA" },
  tabText: { fontSize: 11, fontWeight: "700", color: "#6b7694" },
 
  pageIntro: { paddingHorizontal: 16, paddingTop: 15, paddingBottom: 5 },
  eyebrow: { fontSize: 9, fontWeight: "800", letterSpacing: 1.3, color: "#E8650A" },
  pageTitle: { fontSize: 16, fontWeight: "700", color: "#1d2944", marginTop: 4, flexShrink: 1 },
  pageHint: { fontSize: 10, color: "#6b7694", lineHeight: 15, marginTop: 3 },
  apiStatus: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 16, paddingVertical: 6 },
  apiStatusText: { fontSize: 10, flex: 1 },
  filterRow: { flexDirection: "row", paddingHorizontal: 16, paddingVertical: 5, gap: 7 },
  filterChip: { flex: 1, minWidth: 0, alignItems: "center", justifyContent: "center", paddingHorizontal: 5, paddingVertical: 7, borderRadius: 18, borderWidth: 1, borderColor: "#d9dce9", backgroundColor: "#fff" },
  filterChipActive: { backgroundColor: "#2740BA", borderColor: "#2740BA" },
  filterChipText: { fontSize: 10, fontWeight: "700", color: "#6b7694", textAlign: "center", flexShrink: 1 },
  filterChipTextActive: { color: "#fff" },
  searchRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, gap: 7, marginTop: 3 },
  searchField: { flex: 1, height: 38, flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 11, borderWidth: 1, borderColor: "#e4e8f0", borderRadius: 10, backgroundColor: "#fff" },
  searchInput: { flex: 1, padding: 0, fontSize: 11, color: "#25304b" },
  iconButton: { width: 38, height: 38, alignItems: "center", justifyContent: "center", borderWidth: 1, borderRadius: 10, backgroundColor: "#fff" },
  disabled: { opacity: 0.6 },
  listContent: { padding: 16, paddingBottom: 35 },
  lotCard: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e4e8f0", borderRadius: 14, padding: 13, marginBottom: 11, shadowColor: "#1d2944", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 7, elevation: 2 },
  lotHeader: { flexDirection: "row", alignItems: "flex-start", gap: 9 },
  lotImage: { width: 46, height: 46, borderRadius: 10 },
  lotImageFallback: { width: 46, height: 46, borderRadius: 10, backgroundColor: "#f2f3f7", alignItems: "center", justifyContent: "center" },
  lotTitleBlock: { flex: 1 },
  lotName: { fontSize: 13, fontWeight: "700", color: "#1d2944", lineHeight: 17 },
  lotBusiness: { fontSize: 10, color: "#6b7694", marginTop: 2 },
  lotCode: { fontSize: 9, color: "#a8b2c8", fontFamily: "monospace", marginTop: 3 },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 7, paddingVertical: 5, borderRadius: 15, maxWidth: 125 },
  statusText: { fontSize: 9, fontWeight: "700", flexShrink: 1 },
  compactBadge: { borderRadius: 15, paddingHorizontal: 7, paddingVertical: 5 },
  compactBadgeText: { fontSize: 9, fontWeight: "700" },
  lotInfoRow: { flexDirection: "row", gap: 15, borderTopWidth: 1, borderTopColor: "#f0f2f8", marginTop: 11, paddingTop: 9 },
  lotInfo: { flexDirection: "row", alignItems: "center", gap: 4 },
  lotInfoText: { fontSize: 10, color: "#6b7694" },
  cardActions: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 11 },
  cardPrimaryButton: { flex: 1, minHeight: 37, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: "#2740BA", borderRadius: 9, paddingHorizontal: 10 },
  cardPrimaryText: { fontSize: 11, fontWeight: "700", color: "#fff" },
  inactiveButton: { backgroundColor: "#f2f3f7" },
  inactiveButtonText: { color: "#a8b2c8" },
  syncedAction: { flex: 1, minHeight: 37, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 9, backgroundColor: "#e8f5ed" },
  syncedActionText: { fontSize: 10, color: "#2a9d6e", fontWeight: "700" },
  emptyState: { alignItems: "center", paddingTop: 50, gap: 9 },
  emptyText: { fontSize: 12, color: "#a8b2c8" },
  overlay: { flex: 1, backgroundColor: "rgba(15,25,50,.42)", alignItems: "center", justifyContent: "center", padding: 20 },
  qrCard: { width: "100%", maxWidth: 360, backgroundColor: "#fff", borderRadius: 18, padding: 20, alignItems: "center" },
  modalTitleRow: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 15 },
  modalTitle: { fontSize: 15, fontWeight: "700", color: "#1d2944" },
  qrImage: { width: 190, height: 190, borderRadius: 10, borderWidth: 1, borderColor: "#e4e8f0" },
  qrLot: { fontFamily: "monospace", fontSize: 12, fontWeight: "700", color: "#2a9d6e", marginTop: 12 },
  qrProduct: { fontSize: 12, fontWeight: "600", color: "#34405a", marginTop: 4, textAlign: "center" },
  qrBusiness: { fontSize: 10, color: "#6b7694", marginTop: 3, textAlign: "center" },
  portalLink: { width: "100%", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 7, borderWidth: 1, borderColor: "#2a9d6e", borderRadius: 10, paddingVertical: 10, marginTop: 15 },
  portalLinkText: { fontSize: 11, fontWeight: "700", color: "#2a9d6e" },
  qrHint: { fontSize: 10, color: "#a8b2c8", textAlign: "center", fontStyle: "italic", marginTop: 15 },
  modalSafe: { flex: 1, backgroundColor: "#f5f7fb" },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 13, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e4e8f0" },
  modalHeaderText: { flex: 1, marginRight: 12 },
  modalProduct: { fontSize: 14, fontWeight: "700", color: "#1d2944", marginTop: 3 },
  wizardBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingVertical: 11, backgroundColor: "#fbfcfe", borderBottomWidth: 1, borderBottomColor: "#f0f2f8" },
  wizardStep: { flexDirection: "row", alignItems: "center", gap: 6 },
  wizardDot: { width: 23, height: 23, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#e4e8f0" },
  wizardDotActive: { backgroundColor: "#2740BA" },
  wizardNumber: { fontSize: 11, fontWeight: "700", color: "#a8b2c8" },
  wizardNumberActive: { color: "#fff" },
  wizardLabel: { fontSize: 10, color: "#a8b2c8", fontWeight: "600" },
  wizardLabelActive: { color: "#2740BA" },
  wizardLine: { width: 25, height: 1, backgroundColor: "#e4e8f0", marginHorizontal: 9 },
  modalContent: { padding: 16, paddingBottom: 30 },
  productPreview: { flexDirection: "row", gap: 10, backgroundColor: "#fff", borderWidth: 1, borderColor: "#e4e8f0", borderRadius: 13, padding: 10, marginBottom: 17 },
  previewImage: { width: 62, height: 62, borderRadius: 10 },
  previewImageFallback: { width: 62, height: 62, borderRadius: 10, backgroundColor: "#f2f3f7", alignItems: "center", justifyContent: "center" },
  previewText: { flex: 1, justifyContent: "center" },
  previewName: { fontSize: 13, fontWeight: "700", color: "#1d2944" },
  previewBusiness: { fontSize: 10, color: "#6b7694", marginTop: 3 },
  previewMeta: { fontFamily: "monospace", fontSize: 9, color: "#a8b2c8", marginTop: 6 },
  sectionLabel: { fontSize: 9, fontWeight: "800", letterSpacing: 1, color: "#a8b2c8", marginTop: 5, marginBottom: 9 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#1d2944" },
  sectionHint: { fontSize: 11, color: "#6b7694", marginTop: 3, marginBottom: 15 },
  readonlyRow: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e4e8f0", borderRadius: 10, padding: 10, marginBottom: 8 },
  fieldLabel: { fontSize: 10, fontWeight: "700", color: "#6b7694", marginBottom: 5 },
  readonlyValue: { fontSize: 12, color: "#25304b" },
  input: { minHeight: 40, backgroundColor: "#fff", borderWidth: 1, borderColor: "#e4e8f0", borderRadius: 10, paddingHorizontal: 11, paddingVertical: 9, color: "#25304b", fontSize: 12, marginBottom: 12 },
  smallInput: { minHeight: 38, backgroundColor: "#fff", borderWidth: 1, borderColor: "#e4e8f0", borderRadius: 9, paddingHorizontal: 9, paddingVertical: 8, color: "#25304b", fontSize: 10, marginBottom: 10 },
  monoInput: { fontFamily: "monospace" },
  textarea: { minHeight: 65, textAlignVertical: "top" },
  fieldPair: { flexDirection: "row", gap: 8 },
  halfField: { flex: 1 },
  txngCard: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e4e8f0", borderRadius: 12, padding: 11, marginBottom: 11 },
  txngCardHeader: { flexDirection: "row", alignItems: "center", gap: 7, borderBottomWidth: 1, borderBottomColor: "#f0f2f8", paddingBottom: 9, marginBottom: 10 },
  txngNumber: { width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: "#2740BA" },
  txngNumberText: { fontSize: 10, fontWeight: "700", color: "#fff" },
  txngName: { fontSize: 12, fontWeight: "700", color: "#1d2944" },
  modalFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 9, padding: 14, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#e4e8f0" },
  primaryButton: { minHeight: 40, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, backgroundColor: "#2740BA", borderRadius: 9, paddingHorizontal: 17 },
  primaryButtonText: { fontSize: 11, fontWeight: "700", color: "#fff" },
  secondaryButton: { minHeight: 40, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderWidth: 1, borderColor: "#e4e8f0", borderRadius: 9, paddingHorizontal: 15 },
  secondaryButtonText: { fontSize: 11, fontWeight: "700", color: "#6b7694" },
  successButton: { flex: 1, minHeight: 40, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, backgroundColor: "#2a9d6e", borderRadius: 9, paddingHorizontal: 12 },
  successState: { alignItems: "center", paddingTop: 55 },
  successIcon: { width: 72, height: 72, alignItems: "center", justifyContent: "center", borderRadius: 36, backgroundColor: "#e8f5ed" },
  successTitle: { fontSize: 18, fontWeight: "700", color: "#1d2944", marginTop: 16 },
  successText: { fontSize: 11, color: "#6b7694", textAlign: "center", marginTop: 6, lineHeight: 17 },
  successUrl: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#e8f5ed", borderWidth: 1, borderColor: "#b8e2c8", borderRadius: 10, paddingHorizontal: 11, paddingVertical: 9, marginTop: 18 },
  successUrlText: { fontSize: 10, color: "#2a9d6e", fontWeight: "600" },
});