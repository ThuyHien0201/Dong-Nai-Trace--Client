import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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

type ProviderFormValue = Omit<Provider, "id">;

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

const EMPTY_FORM: ProviderFormValue = {
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

type FieldName = keyof ProviderFormValue;

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  label: React.ReactNode;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: "default" | "email-address" | "phone-pad";
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#a8b2c8"
        keyboardType={keyboardType}
        style={styles.input}
        autoCapitalize="none"
      />
    </View>
  );
}

function UploadField({
  label,
  value,
  required,
  onUpload,
  image,
}: {
  label: string;
  value: string;
  required?: boolean;
  onUpload: () => void;
  image?: boolean;
}) {
  return (
    <View style={styles.uploadSection}>
      <Text style={styles.fieldLabel}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TouchableOpacity style={styles.uploadBox} onPress={onUpload} activeOpacity={0.75}>
        <View style={styles.uploadIcon}>
          <Feather name={image ? "image" : "file-text"} size={17} color="#2740BA" />
        </View>
        <View style={styles.uploadCopy}>
          <Text style={styles.uploadName} numberOfLines={1}>{value || (image ? "Chọn ảnh đại diện" : "Chọn tệp PDF/DOCX")}</Text>
          <Text style={styles.uploadHint}>{required ? "Bắt buộc" : "Không bắt buộc"} · Dữ liệu mẫu</Text>
        </View>
        <Feather name="upload" size={16} color="#2740BA" />
      </TouchableOpacity>
    </View>
  );
}

function ProviderModal({
  provider,
  onClose,
  onSave,
}: {
  provider: Provider | null;
  onClose: () => void;
  onSave: (value: ProviderFormValue) => void;
}) {
  const insets = useSafeAreaInsets();
  const topInset = Platform.OS === "web" ? 67 : insets.top;
  const [form, setForm] = useState<ProviderFormValue>(provider ?? EMPTY_FORM);
  const [error, setError] = useState("");
  const setField = (field: FieldName, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };
  const mockUpload = (field: FieldName, filename: string) => setField(field, filename);
  const submit = () => {
    const required: FieldName[] = ["name", "taxCode", "representative", "phone", "email", "organization", "connectedCertificate"];
    if (required.some((field) => !form[field].trim())) {
      setError("Vui lòng nhập đủ thông tin bắt buộc và tải giấy chứng nhận kết nối.");
      return;
    }
    onSave(form);
  };

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.modalSafe} edges={["bottom"]}>
        <View style={[styles.modalHeader, { paddingTop: topInset + 10 }]}>
          <TouchableOpacity onPress={onClose} style={styles.headerIcon} accessibilityLabel="Đóng">
            <Feather name="x" size={21} color="#1d2944" />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.eyebrow}>HỒ SƠ ĐƠN VỊ</Text>
            <Text style={styles.modalTitle} numberOfLines={1}>{provider ? "Chỉnh sửa đơn vị" : "Thêm đơn vị cung cấp giải pháp"}</Text>
          </View>
          <TouchableOpacity onPress={submit} style={styles.headerSave} accessibilityLabel="Lưu đơn vị">
            <Text style={styles.headerSaveText}>Lưu</Text>
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <UploadField
            label="Hình ảnh"
            value={form.image}
            image
            onUpload={() => mockUpload("image", "anh-dai-dien-don-vi.jpg")}
          />
          <FormField label={<>Tên đơn vị <Text style={styles.required}>*</Text></>} value={form.name} onChangeText={(value) => setField("name", value)} placeholder="Nhập tên đơn vị" />
          <FormField label={<>Mã số thuế <Text style={styles.required}>*</Text></>} value={form.taxCode} onChangeText={(value) => setField("taxCode", value)} placeholder="Nhập mã số thuế" keyboardType="phone-pad" />
          <FormField label={<>Người đại diện <Text style={styles.required}>*</Text></>} value={form.representative} onChangeText={(value) => setField("representative", value)} placeholder="Họ tên người đại diện" />
          <FormField label={<>Tổ chức <Text style={styles.required}>*</Text></>} value={form.organization} onChangeText={(value) => setField("organization", value)} placeholder="Ví dụ: Công ty TNHH" />
          <Text style={styles.sectionTitle}>THÔNG TIN LIÊN HỆ</Text>
          <FormField label={<>Số điện thoại <Text style={styles.required}>*</Text></>} value={form.phone} onChangeText={(value) => setField("phone", value)} placeholder="Nhập số điện thoại" keyboardType="phone-pad" />
          <FormField label={<>Email <Text style={styles.required}>*</Text></>} value={form.email} onChangeText={(value) => setField("email", value)} placeholder="Nhập email liên hệ" keyboardType="email-address" />
          <Text style={styles.sectionTitle}>HỒ SƠ ĐÍNH KÈM</Text>
          <UploadField label="Giấy phép kinh doanh" value={form.businessLicense} onUpload={() => mockUpload("businessLicense", "GiayPhepKinhDoanh_Mau.pdf")} />
          <UploadField label="Giấy chứng nhận đã kết nối thành công cổng TXNG quốc gia" required value={form.connectedCertificate} onUpload={() => mockUpload("connectedCertificate", "ChungNhanKetNoiCongTXNG_Mau.pdf")} />
          <UploadField label="Hồ sơ năng lực" value={form.capabilityProfile} onUpload={() => mockUpload("capabilityProfile", "HoSoNangLuc_Mau.pdf")} />
          {!!error && <Text style={styles.errorText}>{error}</Text>}
          <TouchableOpacity style={styles.saveButton} onPress={submit}>
            <Feather name="check-circle" size={16} color="#fff" />
            <Text style={styles.saveButtonText}>Lưu đơn vị</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

export default function SolutionProvidersScreen() {
  const router = useRouter();
  const [providers, setProviders] = useState<Provider[]>(INITIAL_PROVIDERS);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Provider | null | undefined>(undefined);
  const visible = useMemo(
    () => providers.filter((provider) => `${provider.name} ${provider.taxCode} ${provider.representative}`.toLowerCase().includes(query.toLowerCase())),
    [providers, query],
  );
  const save = (value: ProviderFormValue) => {
    setProviders((current) => editing
      ? current.map((item) => item.id === editing.id ? { ...value, id: editing.id } : item)
      : [...current, { ...value, id: Date.now() }]);
    setEditing(undefined);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.pageHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon} accessibilityLabel="Quay lại">
          <Feather name="arrow-left" size={20} color="#1d2944" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.pageTitle}>Đơn vị cung cấp giải pháp</Text>
          <Text style={styles.pageSubtitle}>Quản lý hồ sơ kết nối TXNG</Text>
        </View>
        <TouchableOpacity onPress={() => setEditing(null)} style={styles.addButton} accessibilityLabel="Thêm đơn vị">
          <Feather name="plus" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.searchWrap}>
        <Feather name="search" size={15} color="#a8b2c8" />
        <TextInput value={query} onChangeText={setQuery} placeholder="Tìm tên, mã số thuế..." placeholderTextColor="#a8b2c8" style={styles.searchInput} />
        <Text style={styles.countText}>{visible.length}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {visible.map((provider) => (
          <View key={provider.id} style={styles.providerCard}>
            <View style={styles.providerTop}>
              {provider.image ? <Image source={{ uri: provider.image }} style={styles.providerImage} /> : <View style={styles.providerFallback}><Feather name="briefcase" size={20} color="#2740BA" /></View>}
              <View style={styles.providerInfo}>
                <Text style={styles.providerName} numberOfLines={2}>{provider.name}</Text>
                <Text style={styles.providerMeta}>MST: {provider.taxCode}</Text>
                <Text style={styles.providerMeta}>{provider.organization}</Text>
              </View>
              <View style={styles.actionRow}>
                <TouchableOpacity onPress={() => setEditing(provider)} style={styles.iconAction} accessibilityLabel="Sửa đơn vị">
                  <Feather name="edit-2" size={15} color="#2740BA" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Alert.alert("Xóa đơn vị", `Bạn có chắc muốn xóa ${provider.name}?`, [{ text: "Hủy", style: "cancel" }, { text: "Xóa", style: "destructive", onPress: () => setProviders((current) => current.filter((item) => item.id !== provider.id)) }])} style={[styles.iconAction, styles.deleteAction]} accessibilityLabel="Xóa đơn vị">
                  <Feather name="trash-2" size={15} color="#c0392b" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.contactRow}>
              <Feather name="user" size={13} color="#6b7694" /><Text style={styles.contactText}>{provider.representative}</Text>
              <Feather name="phone" size={13} color="#6b7694" /><Text style={styles.contactText}>{provider.phone}</Text>
            </View>
            <Text style={styles.emailText}>{provider.email}</Text>
            <View style={styles.certificateRow}>
              <Feather name="check-circle" size={14} color="#1f7a45" />
              <View style={styles.certificateCopy}>
                <Text style={styles.certificateTitle}>Đã có giấy chứng nhận kết nối</Text>
                <Text style={styles.certificateFile} numberOfLines={1}>{provider.connectedCertificate}</Text>
              </View>
            </View>
          </View>
        ))}
        {!visible.length && <View style={styles.emptyState}><Feather name="briefcase" size={32} color="#c8cfdd" /><Text style={styles.emptyText}>Không có đơn vị phù hợp</Text></View>}
      </ScrollView>
      {editing !== undefined && <ProviderModal provider={editing} onClose={() => setEditing(undefined)} onSave={save} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f7fb" },
  modalSafe: { flex: 1, backgroundColor: "#f5f7fb" },
  pageHeader: { flexDirection: "row", alignItems: "center", gap: 9, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e4e8f0" },
  modalHeader: { flexDirection: "row", alignItems: "center", gap: 9, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e4e8f0" },
  headerIcon: { padding: 5 },
  headerTitleWrap: { flex: 1, minWidth: 0 },
  pageTitle: { fontSize: 17, fontWeight: "700", color: "#1d2944" },
  pageSubtitle: { fontSize: 10, color: "#6b7694", marginTop: 2 },
  eyebrow: { fontSize: 9, fontWeight: "800", letterSpacing: 1.2, color: "#E8650A" },
  modalTitle: { fontSize: 15, fontWeight: "700", color: "#1d2944", marginTop: 2 },
  headerSave: { backgroundColor: "#2740BA", borderRadius: 9, paddingHorizontal: 13, paddingVertical: 8 },
  headerSaveText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  addButton: { width: 36, height: 36, alignItems: "center", justifyContent: "center", backgroundColor: "#E8650A", borderRadius: 10 },
  searchWrap: { flexDirection: "row", alignItems: "center", gap: 8, margin: 14, paddingHorizontal: 11, height: 40, borderWidth: 1, borderColor: "#e4e8f0", borderRadius: 10, backgroundColor: "#fff" },
  searchInput: { flex: 1, color: "#25304b", fontSize: 11, padding: 0 },
  countText: { color: "#6b7694", fontSize: 10, fontWeight: "700" },
  listContent: { paddingHorizontal: 14, paddingBottom: 32 },
  providerCard: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e4e8f0", borderRadius: 15, padding: 13, marginBottom: 11, shadowColor: "#1d2944", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 7, elevation: 2 },
  providerTop: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  providerImage: { width: 52, height: 52, borderRadius: 12 },
  providerFallback: { width: 52, height: 52, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#edf0ff" },
  providerInfo: { flex: 1, minWidth: 0 },
  providerName: { fontSize: 13, lineHeight: 17, fontWeight: "700", color: "#1d2944" },
  providerMeta: { fontSize: 10, color: "#6b7694", marginTop: 3 },
  actionRow: { flexDirection: "row", gap: 5 },
  iconAction: { width: 31, height: 31, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#e4e8f0", borderRadius: 8 },
  deleteAction: { borderColor: "#f5bcbc" },
  contactRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 5, borderTopWidth: 1, borderTopColor: "#f0f2f8", marginTop: 11, paddingTop: 10 },
  contactText: { fontSize: 10, color: "#25304b", marginRight: 7 },
  emailText: { fontSize: 10, color: "#6b7694", marginTop: 6, marginLeft: 18 },
  certificateRow: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 11, padding: 9, borderRadius: 10, backgroundColor: "#e8f5ed" },
  certificateCopy: { flex: 1 },
  certificateTitle: { fontSize: 10, fontWeight: "700", color: "#1f7a45" },
  certificateFile: { fontSize: 9, color: "#6b7694", marginTop: 2 },
  emptyState: { alignItems: "center", justifyContent: "center", paddingTop: 80 },
  emptyText: { color: "#6b7694", fontSize: 12, marginTop: 10 },
  formContent: { padding: 16, paddingBottom: 38 },
  field: { marginBottom: 13 },
  fieldLabel: { color: "#6b7694", fontSize: 10, fontWeight: "700", marginBottom: 5 },
  required: { color: "#E8650A" },
  input: { minHeight: 40, paddingHorizontal: 11, paddingVertical: 9, borderWidth: 1, borderColor: "#e4e8f0", borderRadius: 10, backgroundColor: "#fff", color: "#25304b", fontSize: 12 },
  sectionTitle: { color: "#a8b2c8", fontSize: 9, fontWeight: "800", letterSpacing: 1.1, marginTop: 8, marginBottom: 11 },
  uploadSection: { marginBottom: 13 },
  uploadBox: { flexDirection: "row", alignItems: "center", gap: 9, padding: 10, borderWidth: 1, borderStyle: "dashed", borderColor: "#c5cef9", borderRadius: 11, backgroundColor: "#f8f9ff" },
  uploadIcon: { width: 32, height: 32, alignItems: "center", justifyContent: "center", borderRadius: 8, backgroundColor: "#edf0ff" },
  uploadCopy: { flex: 1, minWidth: 0 },
  uploadName: { color: "#25304b", fontSize: 10, fontWeight: "700" },
  uploadHint: { color: "#a8b2c8", fontSize: 9, marginTop: 2 },
  errorText: { padding: 10, borderRadius: 10, backgroundColor: "#fef0f0", borderWidth: 1, borderColor: "#f5bcbc", color: "#c0392b", fontSize: 11, lineHeight: 16, marginTop: 2 },
  saveButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, minHeight: 42, marginTop: 16, borderRadius: 10, backgroundColor: "#2740BA" },
  saveButtonText: { color: "#fff", fontSize: 12, fontWeight: "700" },
});