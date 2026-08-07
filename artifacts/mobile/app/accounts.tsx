import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

type Role = "Quản trị viên" | "Biên tập viên" | "Người xem";
type AccountStatus = "Đang hoạt động" | "Tạm khóa";
type Account = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  status: AccountStatus;
  createdAt: string;
  lastLogin: string;
  avatar: string;
  permissions?: string[];
};
type Palette = ReturnType<typeof useColors>;

const ACCESS_MODULES = [
  "Tổng quan",
  "Tài khoản",
  "Doanh nghiệp",
  "Đồng bộ dữ liệu",
  "Sản phẩm",
  "Danh mục & địa bàn",
  "Báo cáo & phân tích",
  "Tin tức & banner",
  "Hỗ trợ & thông báo",
  "Hệ thống",
  "Cài đặt",
] as const;

const initialAccounts: Account[] = [
  {
    id: "ACC-001",
    name: "Nguyễn Minh Anh",
    username: "minhanh.nv",
    email: "minhanh@dongnai.gov.vn",
    role: "Quản trị viên",
    status: "Đang hoạt động",
    createdAt: "01/01/2024",
    lastLogin: "Hôm nay, 09:42",
    avatar: "NMA",
  },
  {
    id: "ACC-002",
    name: "Trần Hoàng Nam",
    username: "hoangnam.th",
    email: "hoangnam@dongnai.gov.vn",
    role: "Biên tập viên",
    status: "Đang hoạt động",
    createdAt: "15/03/2024",
    lastLogin: "Hôm nay, 08:15",
    avatar: "THN",
  },
  {
    id: "ACC-003",
    name: "Lê Thị Bích",
    username: "bich.lt",
    email: "bich.lt@dongnai.gov.vn",
    role: "Người xem",
    status: "Đang hoạt động",
    createdAt: "20/04/2024",
    lastLogin: "Hôm qua, 14:30",
    avatar: "LTB",
  },
  {
    id: "ACC-004",
    name: "Phạm Quốc Tuấn",
    username: "tuan.pq",
    email: "tuan.pq@dongnai.gov.vn",
    role: "Biên tập viên",
    status: "Đang hoạt động",
    createdAt: "05/05/2024",
    lastLogin: "2 ngày trước",
    avatar: "PQT",
  },
  {
    id: "ACC-005",
    name: "Vũ Thị Hương",
    username: "huong.vt",
    email: "huong.vt@dongnai.gov.vn",
    role: "Người xem",
    status: "Tạm khóa",
    createdAt: "10/06/2024",
    lastLogin: "07/07/2024",
    avatar: "VTH",
  },
  {
    id: "ACC-006",
    name: "Đỗ Văn Khải",
    username: "khai.dv",
    email: "khai.dv@skhcn.dongnai.gov.vn",
    role: "Biên tập viên",
    status: "Đang hoạt động",
    createdAt: "22/07/2024",
    lastLogin: "Hôm nay, 07:55",
    avatar: "DVK",
  },
  {
    id: "ACC-007",
    name: "Bùi Thị Lan",
    username: "lan.bt",
    email: "lan.bt@skhcn.dongnai.gov.vn",
    role: "Người xem",
    status: "Đang hoạt động",
    createdAt: "18/09/2024",
    lastLogin: "3 ngày trước",
    avatar: "BTL",
  },
];

const roles: Role[] = ["Quản trị viên", "Biên tập viên", "Người xem"];
const statusOptions: Array<"Tất cả" | AccountStatus> = [
  "Tất cả",
  "Đang hoạt động",
  "Tạm khóa",
];
const roleMeta: Record<
  Role,
  {
    icon: React.ComponentProps<typeof Feather>["name"];
    color: string;
    background: string;
    description: string;
  }
> = {
  "Quản trị viên": {
    icon: "user-check",
    color: "#2740BA",
    background: "#edf0ff",
    description: "Toàn quyền quản lý hệ thống",
  },
  "Biên tập viên": {
    icon: "edit-3",
    color: "#E8650A",
    background: "#fff4ed",
    description: "Xem và chỉnh sửa dữ liệu",
  },
  "Người xem": {
    icon: "eye",
    color: "#6b7694",
    background: "#f2f3f7",
    description: "Chỉ xem dữ liệu",
  },
};

function initials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

function RoleBadge({ role, colors }: { role: string; colors: Palette }) {
  const meta = roleMeta[role as Role] ?? {
    icon: "shield",
    color: colors.primary,
    background: colors.primaryLight,
  };
  return (
    <View style={[styles.roleBadge, { backgroundColor: meta.background }]}>
      <Feather name={meta.icon} size={11} color={meta.color} />
      <Text style={[styles.roleBadgeText, { color: meta.color }]}>{role}</Text>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  secureTextEntry,
  error,
  colors,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  secureTextEntry?: boolean;
  error?: string;
  colors: Palette;
}) {
  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
        {label} <Text style={{ color: colors.error }}>*</Text>
      </Text>
      <View
        style={[
          styles.inputRow,
          {
            borderColor: error ? colors.error : colors.border,
            backgroundColor: error ? colors.errorLight : colors.input,
          },
        ]}
      >
        <Feather
          name={icon}
          size={15}
          color={colors.textPlaceholder}
          style={styles.inputIcon}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textPlaceholder}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          style={[styles.input, { color: colors.textPrimary }]}
        />
      </View>
      {!!error && (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
}

function AccountModal({
  account,
  colors,
  onClose,
  onSave,
}: {
  account: Account | null;
  colors: Palette;
  onClose: () => void;
  onSave: (
    data: Omit<Account, "id" | "createdAt" | "lastLogin" | "avatar">,
  ) => void;
}) {
  const isEdit = !!account;
  const [name, setName] = useState(account?.name ?? "");
  const [username, setUsername] = useState(account?.username ?? "");
  const [email, setEmail] = useState(account?.email ?? "");
  const [role, setRole] = useState(account?.role ?? "");
  const [permissions, setPermissions] = useState<string[]>(
    account?.permissions ?? [],
  );
  const [status, setStatus] = useState<AccountStatus>(
    account?.status ?? "Đang hoạt động",
  );
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Vui lòng nhập họ tên";
    if (!username.trim()) next.username = "Vui lòng nhập tên đăng nhập";
    if (!email.trim()) next.email = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Email không hợp lệ";
    if (!role.trim()) next.role = "Vui lòng chọn vai trò";
    if (!isEdit && !password.trim()) next.password = "Vui lòng nhập mật khẩu";
    else if (!isEdit && password.length < 6)
      next.password = "Mật khẩu tối thiểu 6 ký tự";
    return next;
  };

  const submit = () => {
    const nextErrors = validate();
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    onSave({
      name: name.trim(),
      username: username.trim(),
      email: email.trim(),
      role,
      status,
      permissions,
    });
  };

  const togglePermission = (module: string) => {
    setPermissions((current) =>
      current.includes(module)
        ? current.filter((item) => item !== module)
        : [...current, module],
    );
  };

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <SafeAreaView
        style={[styles.modalSafe, { backgroundColor: colors.background }]}
        edges={["top", "bottom"]}
      >
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View
            style={[
              styles.modalHeader,
              {
                backgroundColor: colors.card,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <TouchableOpacity
              onPress={onClose}
              style={styles.modalHeaderAction}
              accessibilityLabel="Đóng"
            >
              <Feather name="x" size={21} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text
              style={[styles.modalTitle, { color: colors.textPrimary }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {isEdit ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
            </Text>
            <TouchableOpacity
              onPress={submit}
              style={[styles.modalHeaderSave, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.modalSaveText}>{isEdit ? "Lưu" : "Tạo"}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.modalContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Field
              label="Họ và tên"
              value={name}
              onChangeText={setName}
              placeholder="Nguyễn Văn A"
              icon="user"
              error={errors.name}
              colors={colors}
            />
            <Field
              label="Tên đăng nhập"
              value={username}
              onChangeText={setUsername}
              placeholder="vana.nguyen"
              icon="user"
              error={errors.username}
              colors={colors}
            />
            <Field
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="email@dongnai.gov.vn"
              icon="mail"
              error={errors.email}
              colors={colors}
            />
            {!isEdit && (
              <Field
                label="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                placeholder="Tối thiểu 6 ký tự"
                icon="key"
                secureTextEntry
                error={errors.password}
                colors={colors}
              />
            )}

            <View style={styles.field}>
              <Text
                style={[styles.fieldLabel, { color: colors.textSecondary }]}
              >
                Vai trò <Text style={{ color: colors.error }}>*</Text>
              </Text>
              <View style={styles.roleOptions}>
                {roles.map((item) => {
                  const meta = roleMeta[item];
                  const selected = role === item;
                  return (
                    <TouchableOpacity
                      key={item}
                      onPress={() => {
                        setRole(item);
                        setErrors((current) => ({ ...current, role: "" }));
                      }}
                      style={[
                        styles.roleOption,
                        {
                          borderColor: selected ? meta.color : colors.border,
                          backgroundColor: selected
                            ? meta.background
                            : colors.card,
                        },
                      ]}
                    >
                      <Feather
                        name={meta.icon}
                        size={14}
                        color={selected ? meta.color : colors.textMuted}
                      />
                      <Text
                        style={[
                          styles.roleOptionText,
                          {
                            color: selected ? meta.color : colors.textMuted,
                            fontWeight: selected ? "700" : "500",
                          },
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {!!errors.role && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {errors.role}
                </Text>
              )}
            </View>

            <View style={styles.field}>
              <Text
                style={[styles.fieldLabel, { color: colors.textSecondary }]}
              >
                Phân quyền truy cập
              </Text>
              <View
                style={[
                  styles.permissionsBox,
                  { borderColor: colors.border, backgroundColor: colors.input },
                ]}
              >
                {ACCESS_MODULES.map((module) => {
                  const checked = permissions.includes(module);
                  return (
                    <TouchableOpacity
                      key={module}
                      style={styles.permissionItem}
                      onPress={() => togglePermission(module)}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          {
                            borderColor: checked
                              ? colors.primary
                              : colors.textPlaceholder,
                            backgroundColor: checked
                              ? colors.primary
                              : colors.card,
                          },
                        ]}
                      >
                        {checked && (
                          <Feather
                            name="check"
                            size={11}
                            color={colors.primaryForeground}
                          />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.permissionText,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {module}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text style={[styles.helperText, { color: colors.textMuted }]}>
                {permissions.length}/{ACCESS_MODULES.length} module được chọn
              </Text>
            </View>

            <View
              style={[
                styles.statusCard,
                { borderColor: colors.border, backgroundColor: colors.input },
              ]}
            >
              <View style={styles.flex}>
                <Text
                  style={[styles.statusTitle, { color: colors.textSecondary }]}
                >
                  Trạng thái tài khoản
                </Text>
                <Text
                  style={[
                    styles.statusDescription,
                    { color: colors.textMuted },
                  ]}
                >
                  {status === "Đang hoạt động"
                    ? "Có thể đăng nhập và sử dụng hệ thống"
                    : "Bị tạm khóa, không thể đăng nhập"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  setStatus((current) =>
                    current === "Đang hoạt động"
                      ? "Tạm khóa"
                      : "Đang hoạt động",
                  )
                }
                style={[
                  styles.switch,
                  {
                    backgroundColor:
                      status === "Đang hoạt động"
                        ? colors.primary
                        : colors.textPlaceholder,
                  },
                ]}
                accessibilityLabel="Đổi trạng thái tài khoản"
                hitSlop={8}
              >
                <View
                  style={[
                    styles.switchKnob,
                    {
                      transform: [
                        { translateX: status === "Đang hoạt động" ? 20 : 2 },
                      ],
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

function DeleteConfirm({
  account,
  colors,
  onClose,
  onConfirm,
}: {
  account: Account;
  colors: Palette;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.deleteCard, { backgroundColor: colors.card }]}>
          <View
            style={[styles.deleteIcon, { backgroundColor: colors.errorLight }]}
          >
            <Feather name="trash-2" size={25} color={colors.error} />
          </View>
          <Text style={[styles.deleteTitle, { color: colors.textPrimary }]}>
            Xóa tài khoản
          </Text>
          <Text style={[styles.deleteText, { color: colors.textMuted }]}>
            Bạn có chắc muốn xóa tài khoản{" "}
            <Text style={{ color: colors.textPrimary, fontWeight: "700" }}>
              {account.name}
            </Text>
            ? Hành động này không thể hoàn tác.
          </Text>
          <View style={styles.deleteActions}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.deleteButton, { borderColor: colors.border }]}
            >
              <Text
                style={[styles.deleteCancelText, { color: colors.textMuted }]}
              >
                Hủy
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              style={[
                styles.deleteButton,
                { backgroundColor: colors.error, borderColor: colors.error },
              ]}
            >
              <Text style={styles.deleteConfirmText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function AccountsScreen() {
  const router = useRouter();
  const colors = useColors();
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Tất cả");
  const [statusFilter, setStatusFilter] = useState<"Tất cả" | AccountStatus>(
    "Tất cả",
  );
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Account | null>(null);
  const [deleting, setDeleting] = useState<Account | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return accounts.filter((account) => {
      const matchesSearch =
        !query ||
        account.name.toLowerCase().includes(query) ||
        account.username.toLowerCase().includes(query) ||
        account.email.toLowerCase().includes(query);
      const matchesRole =
        roleFilter === "Tất cả" || account.role === roleFilter;
      const matchesStatus =
        statusFilter === "Tất cả" || account.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [accounts, roleFilter, search, statusFilter]);

  const roleCounts = useMemo(
    () => ({
      "Tất cả": accounts.length,
      "Quản trị viên": accounts.filter(
        (account) => account.role === "Quản trị viên",
      ).length,
      "Biên tập viên": accounts.filter(
        (account) => account.role === "Biên tập viên",
      ).length,
      "Người xem": accounts.filter((account) => account.role === "Người xem")
        .length,
    }),
    [accounts],
  );

  const openAdd = () => {
    setEditing(null);
    setModal("add");
  };

  const openEdit = (account: Account) => {
    setEditing(account);
    setModal("edit");
  };

  const closeAccountModal = () => {
    setModal(null);
    setEditing(null);
  };

  const saveAccount = (
    data: Omit<Account, "id" | "createdAt" | "lastLogin" | "avatar">,
  ) => {
    if (modal === "edit" && editing) {
      setAccounts((current) =>
        current.map((account) =>
          account.id === editing.id ? { ...account, ...data } : account,
        ),
      );
      closeAccountModal();
      Alert.alert("Đã lưu", "Thông tin tài khoản đã được cập nhật.");
      return;
    }
    const newAccount: Account = {
      ...data,
      id: `ACC-${String(accounts.length + 1).padStart(3, "0")}`,
      avatar: initials(data.name),
      createdAt: new Date().toLocaleDateString("vi-VN"),
      lastLogin: "Chưa đăng nhập",
    };
    setAccounts((current) => [newAccount, ...current]);
    closeAccountModal();
    Alert.alert("Thành công", `Tài khoản ${data.name} đã được tạo.`);
  };

  const deleteAccount = () => {
    if (!deleting) return;
    setAccounts((current) =>
      current.filter((account) => account.id !== deleting.id),
    );
    setDeleting(null);
    Alert.alert("Đã xóa", "Tài khoản đã được xóa khỏi danh sách.");
  };

  const toggleStatus = (account: Account) => {
    const nextStatus: AccountStatus =
      account.status === "Đang hoạt động" ? "Tạm khóa" : "Đang hoạt động";
    Alert.alert(
      nextStatus === "Tạm khóa" ? "Khóa tài khoản" : "Mở khóa tài khoản",
      `Bạn có chắc muốn ${nextStatus === "Tạm khóa" ? "khóa" : "mở khóa"} ${account.name}?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: nextStatus === "Tạm khóa" ? "Khóa" : "Mở khóa",
          style: nextStatus === "Tạm khóa" ? "destructive" : "default",
          onPress: () => {
            setAccounts((current) =>
              current.map((item) =>
                item.id === account.id ? { ...item, status: nextStatus } : item,
              ),
            );
            Alert.alert(
              "Đã cập nhật",
              `Tài khoản đã được ${nextStatus === "Tạm khóa" ? "tạm khóa" : "mở khóa"}.`,
            );
          },
        },
      ],
    );
  };

  const resetPassword = (account: Account) => {
    Alert.alert(
      "Đặt lại mật khẩu",
      `Bạn có muốn đặt lại mật khẩu cho ${account.name}?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận",
          onPress: () => Alert.alert("Thành công", "Mật khẩu đã được đặt lại."),
        },
      ],
    );
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconButton}
          accessibilityLabel="Quay lại"
        >
          <Feather name="arrow-left" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={[styles.flex, styles.headerTitleBlock]}>
          <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1} ellipsizeMode="tail">
            Quản lý tài khoản
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]} numberOfLines={1} ellipsizeMode="tail">
            {accounts.length} tài khoản hệ thống
          </Text>
        </View>
        <TouchableOpacity
          onPress={openAdd}
          style={[styles.addButton, { backgroundColor: colors.accent }]}
          accessibilityLabel="Thêm tài khoản"
        >
          <Feather name="user-plus" size={16} color={colors.accentForeground} />
        </TouchableOpacity>
      </View>

      <>
          <View
            style={[
              styles.searchRow,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Feather name="search" size={15} color={colors.textPlaceholder} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Tìm tên, username, email..."
              placeholderTextColor={colors.textPlaceholder}
              style={[styles.searchInput, { color: colors.textPrimary }]}
              autoCapitalize="none"
            />
            {!!search && (
              <TouchableOpacity
                onPress={() => setSearch("")}
                accessibilityLabel="Xóa tìm kiếm"
              >
                <Feather name="x" size={15} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalTabScroll}
            contentContainerStyle={styles.filterRow}
            nestedScrollEnabled
          >
            {["Tất cả", ...roles].map((role) => {
              const selected = roleFilter === role;
              return (
                <TouchableOpacity
                  key={role}
                  onPress={() => setRoleFilter(role)}
                  style={[
                    styles.filterChip,
                    {
                      borderColor: selected ? colors.primary : colors.border,
                      backgroundColor: selected ? colors.primary : colors.card,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      {
                        color: selected
                          ? colors.primaryForeground
                          : colors.textMuted,
                      },
                    ]}
                  >
                    {role}
                  </Text>
                  <Text
                    style={[
                      styles.countText,
                      {
                        color: selected
                          ? colors.primaryForeground
                          : colors.textMuted,
                      },
                    ]}
                  >
                    {roleCounts[role as keyof typeof roleCounts]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalTabScroll}
            contentContainerStyle={styles.statusRow}
            nestedScrollEnabled
          >
            {statusOptions.map((status) => {
              const selected = statusFilter === status;
              return (
                <TouchableOpacity
                  key={status}
                  onPress={() => setStatusFilter(status)}
                  style={[
                    styles.statusChip,
                    {
                      borderColor: selected ? colors.primary : colors.border,
                      backgroundColor: selected
                        ? colors.primaryLight
                        : colors.card,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusChipText,
                      { color: selected ? colors.primary : colors.textMuted },
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <ScrollView
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {filtered.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="users" size={36} color={colors.lockedBorder} />
                <Text style={[styles.emptyTitle, { color: colors.textMuted }]}>
                  Không tìm thấy tài khoản phù hợp
                </Text>
              </View>
            ) : (
              filtered.map((account) => {
                const active = account.status === "Đang hoạt động";
                return (
                  <View
                    key={account.id}
                    style={[
                      styles.accountCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <View style={styles.accountHeader}>
                      <View
                        style={[
                          styles.avatar,
                          { backgroundColor: colors.primaryLight },
                        ]}
                      >
                        <Text
                          style={[styles.avatarText, { color: colors.primary }]}
                        >
                          {account.avatar}
                        </Text>
                      </View>
                      <View style={styles.flex}>
                        <Text
                          style={[
                            styles.accountName,
                            { color: colors.textPrimary },
                          ]}
                        >
                          {account.name}
                        </Text>
                        <Text
                          style={[
                            styles.accountEmail,
                            { color: colors.textMuted },
                          ]}
                        >
                          {account.email}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.statusDot,
                          {
                            backgroundColor: active
                              ? colors.success
                              : colors.textMuted,
                          },
                        ]}
                      />
                    </View>
                    <View style={styles.accountDetails}>
                      <View style={styles.detailLine}>
                        <Feather
                          name="at-sign"
                          size={12}
                          color={colors.textPlaceholder}
                        />
                        <Text
                          style={[
                            styles.detailText,
                            { color: colors.textMuted },
                          ]}
                        >
                          {account.username}
                        </Text>
                      </View>
                      <RoleBadge role={account.role} colors={colors} />
                    </View>
                    <View style={styles.accountDetails}>
                      <View style={styles.detailLine}>
                        <Feather
                          name={active ? "check-circle" : "lock"}
                          size={12}
                          color={active ? colors.success : colors.textMuted}
                        />
                        <Text
                          style={[
                            styles.detailText,
                            {
                              color: active ? colors.success : colors.textMuted,
                            },
                          ]}
                        >
                          {active ? "Hoạt động" : "Tạm khóa"}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.lastLogin,
                          { color: colors.textPlaceholder },
                        ]}
                      >
                        Đăng nhập: {account.lastLogin}
                      </Text>
                    </View>
                    <View style={styles.accountDetails}>
                      <View style={styles.detailLine}>
                        <Feather
                          name="calendar"
                          size={12}
                          color={colors.textPlaceholder}
                        />
                        <Text
                          style={[
                            styles.detailText,
                            { color: colors.textMuted },
                          ]}
                        >
                          Ngày tạo: {account.createdAt}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.accountActions,
                        { borderTopColor: colors.separator },
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => openEdit(account)}
                        style={[
                          styles.actionButton,
                          { backgroundColor: colors.primaryLight },
                        ]}
                        accessibilityLabel={`Sửa ${account.name}`}
                      >
                        <Feather
                          name="edit-2"
                          size={13}
                          color={colors.primary}
                        />
                        <Text
                          style={[styles.actionText, { color: colors.primary }]}
                        >
                          Sửa
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => resetPassword(account)}
                        style={[
                          styles.actionButton,
                          { backgroundColor: colors.warningLight },
                        ]}
                        accessibilityLabel={`Đặt lại mật khẩu cho ${account.name}`}
                      >
                        <Feather name="key" size={13} color={colors.accent} />
                        <Text
                          style={[styles.actionText, { color: colors.accent }]}
                        >
                          Reset
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => toggleStatus(account)}
                        style={[
                          styles.actionButton,
                          {
                            backgroundColor: active
                              ? colors.errorLight
                              : colors.lockedLight,
                          },
                        ]}
                        accessibilityLabel={`${active ? "Khóa" : "Mở khóa"} ${account.name}`}
                      >
                        <Feather
                          name={active ? "lock" : "unlock"}
                          size={13}
                          color={active ? colors.error : colors.textMuted}
                        />
                        <Text
                          style={[
                            styles.actionText,
                            { color: active ? colors.error : colors.textMuted },
                          ]}
                        >
                          {active ? "Khóa" : "Mở"}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setDeleting(account)}
                        style={[
                          styles.actionButton,
                          { backgroundColor: colors.errorLight },
                        ]}
                        accessibilityLabel={`Xóa ${account.name}`}
                      >
                        <Feather
                          name="trash-2"
                          size={13}
                          color={colors.error}
                        />
                        <Text
                          style={[styles.actionText, { color: colors.error }]}
                        >
                          Xóa
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
            <Text style={[styles.resultText, { color: colors.textMuted }]}>
              Hiển thị {filtered.length} / {filtered.length} tài khoản
            </Text>
          </ScrollView>
      </>

      {modal && (
        <AccountModal
          key={`${modal}-${editing?.id ?? "new"}`}
          account={modal === "edit" ? editing : null}
          colors={colors}
          onClose={closeAccountModal}
          onSave={saveAccount}
        />
      )}
      {deleting && (
        <DeleteConfirm
          account={deleting}
          colors={colors}
          onClose={() => setDeleting(null)}
          onConfirm={deleteAccount}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerTitleBlock: { minWidth: 0 },
  iconButton: { padding: 5 },
  modalHeaderAction: { width: 34, height: 34, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  title: { fontSize: 18, fontWeight: "700", letterSpacing: -0.4 },
  subtitle: { fontSize: 11, marginTop: 2 },
  addButton: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  tabs: { flexDirection: "row", borderBottomWidth: 1 },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabText: { fontSize: 12, fontWeight: "600" },
  horizontalTabScroll: { flexGrow: 0, width: "100%", maxHeight: 48 },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 44,
    marginHorizontal: 12,
    marginTop: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 12, paddingVertical: 0 },
  filterRow: { gap: 6, paddingHorizontal: 12, paddingVertical: 10 },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  filterText: { fontSize: 10, fontWeight: "600" },
  countText: { fontSize: 9, fontWeight: "700" },
  statusRow: { gap: 6, paddingHorizontal: 12, paddingBottom: 6 },
  statusChip: {
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusChipText: { fontSize: 10, fontWeight: "600" },
  listContent: { padding: 12, paddingBottom: 32 },
  accountCard: {
    borderRadius: 15,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#1d2944",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  accountHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 13, fontWeight: "700" },
  accountName: { fontSize: 13, fontWeight: "700" },
  accountEmail: { fontSize: 10, marginTop: 3 },
  statusDot: { width: 9, height: 9, borderRadius: 5 },
  accountDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  detailLine: { flexDirection: "row", alignItems: "center", gap: 5 },
  detailText: { fontSize: 10 },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  roleBadgeText: { fontSize: 10, fontWeight: "700" },
  lastLogin: { fontSize: 9, maxWidth: "68%" },
  accountActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    borderTopWidth: 1,
    marginTop: 12,
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  actionText: { fontSize: 11, fontWeight: "700" },
  resultText: { fontSize: 10, marginTop: 2, marginLeft: 2 },
  emptyState: { alignItems: "center", paddingVertical: 70 },
  emptyTitle: { fontSize: 13, marginTop: 10 },
  modalSafe: { flex: 1 },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
  },
  modalTitle: { flex: 1, minWidth: 0, textAlign: "center", fontSize: 15, fontWeight: "700" },
  modalHeaderSave: { minWidth: 48, alignItems: "center", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 7, flexShrink: 0 },
  modalSaveText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  modalContent: { padding: 18, paddingBottom: 40 },
  field: { marginBottom: 16 },
  fieldLabel: { fontSize: 11, fontWeight: "700", marginBottom: 7 },
  inputRow: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 11,
  },
  inputIcon: { marginLeft: 12 },
  input: { flex: 1, height: "100%", paddingHorizontal: 10, fontSize: 12 },
  errorText: { fontSize: 10, marginTop: 5 },
  roleOptions: { gap: 7 },
  roleOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  roleOptionText: { fontSize: 12 },
  permissionsBox: {
    borderWidth: 1,
    borderRadius: 11,
    padding: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  permissionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    width: "47%",
  },
  checkbox: {
    width: 17,
    height: 17,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  permissionText: { flex: 1, fontSize: 10, lineHeight: 14 },
  helperText: { fontSize: 10, marginTop: 6 },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 13,
    marginTop: 1,
  },
  statusTitle: { fontSize: 12, fontWeight: "700" },
  statusDescription: { fontSize: 10, marginTop: 3, paddingRight: 10 },
  switch: { width: 44, height: 24, borderRadius: 12, justifyContent: "center" },
  switchKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#1d2944",
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 24, 48, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  deleteCard: {
    width: "100%",
    borderRadius: 18,
    padding: 22,
    alignItems: "center",
  },
  deleteIcon: {
    width: 56,
    height: 56,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  deleteTitle: { fontSize: 16, fontWeight: "700" },
  deleteText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 8,
  },
  deleteActions: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    marginTop: 18,
  },
  deleteButton: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 11,
    paddingVertical: 11,
  },
  deleteCancelText: { fontSize: 12, fontWeight: "700" },
  deleteConfirmText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  matrixContent: { padding: 12, paddingBottom: 32 },
  matrixIntro: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  matrixTitle: { fontSize: 13, fontWeight: "700" },
  matrixSubtitle: { fontSize: 10, marginTop: 3 },
  matrixCard: { borderWidth: 1, borderRadius: 14, overflow: "hidden" },
  matrixRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 64,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  matrixFeature: { flex: 1, fontSize: 11, lineHeight: 15, paddingRight: 8 },
  matrixChecks: { flexDirection: "row", gap: 7 },
  matrixCheck: { width: 34, alignItems: "center", gap: 4 },
  matrixRole: { fontSize: 8, fontWeight: "700" },
  matrixCircle: {
    width: 21,
    height: 21,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
});
