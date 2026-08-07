import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

type Palette = ReturnType<typeof useColors>;
type FeatherName = React.ComponentProps<typeof Feather>["name"];

type CategoryItem = {
  id: number;
  name: string;
  desc: string;
  active: boolean;
};

type RegionNode = {
  id: string;
  name: string;
  children?: RegionNode[];
};

const sectorData: CategoryItem[] = [
  { id: 1, name: "Nông sản", desc: "Rau củ quả, trái cây tươi", active: true },
  { id: 2, name: "Thực phẩm chế biến", desc: "Sản phẩm qua chế biến công nghiệp", active: true },
  { id: 3, name: "Thủy sản", desc: "Cá, tôm, hải sản", active: true },
  { id: 4, name: "OCOP", desc: "Sản phẩm đặc sản địa phương", active: true },
  { id: 5, name: "Dược liệu", desc: "Thảo dược, thuốc nam", active: false },
  { id: 6, name: "Chăn nuôi", desc: "Gia súc, gia cầm", active: true },
];

const unitData: CategoryItem[] = [
  { id: 1, name: "Kilôgam (kg)", desc: "Đơn vị đo khối lượng chuẩn", active: true },
  { id: 2, name: "Lọ", desc: "Đối với sản phẩm dạng lỏng đóng lọ", active: true },
  { id: 3, name: "Hộp", desc: "Sản phẩm đóng hộp", active: true },
  { id: 4, name: "Thùng", desc: "Đóng gói thùng carton", active: true },
  { id: 5, name: "Con", desc: "Dùng cho gia súc, gia cầm", active: true },
  { id: 6, name: "Tấn", desc: "Đơn vị lớn", active: false },
];

const certData: CategoryItem[] = [
  { id: 1, name: "VietGAP", desc: "Thực hành nông nghiệp tốt Việt Nam", active: true },
  { id: 2, name: "GlobalGAP", desc: "Tiêu chuẩn nông nghiệp quốc tế", active: true },
  { id: 3, name: "HACCP", desc: "Phân tích mối nguy và điểm kiểm soát tới hạn", active: true },
  { id: 4, name: "OCOP 3★", desc: "Sản phẩm OCOP đạt 3 sao", active: true },
  { id: 5, name: "OCOP 4★", desc: "Sản phẩm OCOP đạt 4 sao", active: true },
  { id: 6, name: "Organic", desc: "Chứng nhận hữu cơ", active: false },
];

const initialRegionTree: RegionNode[] = [
  {
    id: "r1",
    name: "Tỉnh Đồng Nai",
    children: [
      {
        id: "r1-1",
        name: "TP. Biên Hòa",
        children: [
          { id: "r1-1-1", name: "Phường Tân Phong" },
          { id: "r1-1-2", name: "Phường Long Bình" },
          { id: "r1-1-3", name: "Phường Trảng Dài" },
        ],
      },
      {
        id: "r1-2",
        name: "TP. Long Khánh",
        children: [
          { id: "r1-2-1", name: "Phường Xuân An" },
          { id: "r1-2-2", name: "Phường Bàu Sen" },
        ],
      },
      {
        id: "r1-3",
        name: "Huyện Xuân Lộc",
        children: [
          { id: "r1-3-1", name: "Thị trấn Gia Ray" },
          { id: "r1-3-2", name: "Xã Xuân Thành" },
        ],
      },
      { id: "r1-4", name: "Huyện Nhơn Trạch" },
      { id: "r1-5", name: "Huyện Long Thành" },
    ],
  },
];

const tabs: Array<{ id: Tab; label: string; icon: FeatherName }> = [
  { id: "sector", label: "Ngành hàng", icon: "tag" },
  { id: "unit", label: "Đơn vị tính", icon: "grid" },
  { id: "cert", label: "Chứng nhận", icon: "award" },
  { id: "region", label: "Địa bàn", icon: "map-pin" },
];

type Tab = "sector" | "unit" | "cert" | "region";
type FormState =
  | { mode: "add"; type: string; parentId: string | null }
  | { mode: "edit"; type: string; item: CategoryItem }
  | { mode: "edit-region"; type: string; node: RegionNode };

function nextNumberId(items: CategoryItem[]) {
  return Math.max(0, ...items.map((item) => item.id)) + 1;
}

function updateRegion(
  nodes: RegionNode[],
  id: string,
  updater: (node: RegionNode) => RegionNode,
): RegionNode[] {
  return nodes.map((node) => {
    if (node.id === id) return updater(node);
    if (!node.children) return node;
    return { ...node, children: updateRegion(node.children, id, updater) };
  });
}

function removeRegion(nodes: RegionNode[], id: string): RegionNode[] {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) =>
      node.children ? { ...node, children: removeRegion(node.children, id) } : node,
    );
}

function addRegion(
  nodes: RegionNode[],
  parentId: string | null,
  child: RegionNode,
): RegionNode[] {
  if (parentId === null) return [...nodes, child];
  return updateRegion(nodes, parentId, (node) => ({
    ...node,
    children: [...(node.children ?? []), child],
  }));
}

function StatusBadge({ active, colors }: { active: boolean; colors: Palette }) {
  return (
    <View
      style={[
        s.statusBadge,
        {
          backgroundColor: active ? colors.successLight : colors.lockedLight,
          borderColor: active ? colors.successBorder : colors.lockedBorder,
        },
      ]}
    >
      <Feather
        name={active ? "check" : "x"}
        size={11}
        color={active ? colors.success : colors.locked}
      />
      <Text
        style={[
          s.statusText,
          { color: active ? colors.success : colors.locked },
        ]}
      >
        {active ? "Hoạt động" : "Vô hiệu hóa"}
      </Text>
    </View>
  );
}

function ItemCard({
  item,
  tab,
  colors,
  onEdit,
  onDelete,
}: {
  item: CategoryItem;
  tab: Tab;
  colors: Palette;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const icon: FeatherName = tab === "sector" ? "tag" : tab === "unit" ? "grid" : "award";
  const iconColor = tab === "cert" ? colors.primary : tab === "unit" ? colors.accent : colors.success;
  return (
    <View style={[s.itemCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={s.itemHeader}>
        <View style={[s.itemIcon, { backgroundColor: tab === "cert" ? colors.primaryLight : tab === "unit" ? colors.accentLight : colors.successLight }]}>
          <Feather name={icon} size={17} color={iconColor} />
        </View>
        <View style={s.itemMain}>
          <Text style={[s.itemName, { color: colors.textPrimary }]}>{item.name}</Text>
          <Text style={[s.itemDescription, { color: colors.textMuted }]}>{item.desc}</Text>
        </View>
        <View style={s.itemActions}>
          <TouchableOpacity
            accessibilityLabel={`Sửa ${item.name}`}
            onPress={onEdit}
            style={[s.actionButton, { backgroundColor: colors.accentLight }]}
          >
            <Feather name="edit-2" size={14} color={colors.accent} />
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel={`Xóa ${item.name}`}
            onPress={onDelete}
            style={[s.actionButton, { backgroundColor: colors.errorLight }]}
          >
            <Feather name="trash-2" size={14} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={[s.itemFooter, { borderTopColor: colors.separator }]}>
        <StatusBadge active={item.active} colors={colors} />
      </View>
    </View>
  );
}

function RegionNodeRow({
  node,
  depth,
  colors,
  onAdd,
  onEdit,
  onDelete,
}: {
  node: RegionNode;
  depth: number;
  colors: Palette;
  onAdd: (parentId: string) => void;
  onEdit: (node: RegionNode) => void;
  onDelete: (node: RegionNode) => void;
}) {
  const [expanded, setExpanded] = useState(depth === 0);
  const hasChildren = Boolean(node.children?.length);
  const nodeColor = depth === 0 ? colors.primary : depth === 1 ? colors.accent : colors.textMuted;

  return (
    <View>
      <View
        style={[
          s.regionRow,
          {
            paddingLeft: 8 + depth * 17,
            borderBottomColor: colors.separator,
          },
        ]}
      >
        <TouchableOpacity
          accessibilityLabel={`${expanded ? "Thu gọn" : "Mở rộng"} ${node.name}`}
          onPress={() => hasChildren && setExpanded((value) => !value)}
          style={s.regionExpand}
          disabled={!hasChildren}
        >
          {hasChildren ? (
            <Feather
              name={expanded ? "chevron-down" : "chevron-right"}
              size={15}
              color={nodeColor}
            />
          ) : (
            <View style={[s.leafDot, { backgroundColor: colors.textPlaceholder }]} />
          )}
        </TouchableOpacity>
        <Feather name="map-pin" size={15} color={nodeColor} />
        <Text
          style={[
            s.regionName,
            {
              color: depth === 2 ? colors.textMuted : colors.textPrimary,
              fontWeight: depth === 0 ? "700" : depth === 1 ? "600" : "500",
            },
          ]}
        >
          {node.name}
        </Text>
        <View style={s.regionActions}>
          <TouchableOpacity
            accessibilityLabel={`Thêm địa bàn con cho ${node.name}`}
            onPress={() => onAdd(node.id)}
            style={s.regionAction}
          >
            <Feather name="plus" size={14} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel={`Sửa ${node.name}`}
            onPress={() => onEdit(node)}
            style={s.regionAction}
          >
            <Feather name="edit-2" size={13} color={colors.accent} />
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityLabel={`Xóa ${node.name}`}
            onPress={() => onDelete(node)}
            style={s.regionAction}
          >
            <Feather name="trash-2" size={13} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
      {expanded && hasChildren && (
        <View style={[s.regionChildren, { borderLeftColor: colors.border }]}>
          {node.children?.map((child) => (
            <RegionNodeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              colors={colors}
              onAdd={onAdd}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function FormModal({
  form,
  colors,
  onClose,
  onSaveItem,
  onSaveRegion,
}: {
  form: FormState;
  colors: Palette;
  onClose: () => void;
  onSaveItem: (name: string, desc: string, active: boolean) => void;
  onSaveRegion: (name: string) => void;
}) {
  const isRegion = form.type === "Địa bàn";
  const initialName =
    form.mode === "edit" ? form.item.name : form.mode === "edit-region" ? form.node.name : "";
  const initialDesc = form.mode === "edit" ? form.item.desc : "";
  const initialActive = form.mode === "edit" ? form.item.active : true;
  const [name, setName] = useState(initialName);
  const [desc, setDesc] = useState(initialDesc);
  const [active, setActive] = useState(initialActive);
  const isEdit = form.mode === "edit" || form.mode === "edit-region";

  const save = () => {
    if (!name.trim()) {
      Alert.alert("Thiếu thông tin", `Vui lòng nhập tên ${form.type.toLowerCase()}.`);
      return;
    }
    if (isRegion) onSaveRegion(name.trim());
    else onSaveItem(name.trim(), desc.trim(), active);
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={s.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={[s.modalCard, { backgroundColor: colors.card }]}>
          <View style={s.modalHeader}>
            <View style={s.modalHeading}>
              <Text style={[s.modalEyebrow, { color: colors.accent }]}>
                {isEdit ? "CẬP NHẬT" : "THÊM MỚI"}
              </Text>
              <Text style={[s.modalTitle, { color: colors.textPrimary }]}>
                {isEdit ? `Chỉnh sửa — ${form.type}` : `Thêm mới — ${form.type}`}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Đóng biểu mẫu">
              <Feather name="x" size={21} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={s.modalContent}
          >
            <Text style={[s.fieldLabel, { color: colors.textSecondary }]}>Tên</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={`Nhập tên ${form.type.toLowerCase()}...`}
              placeholderTextColor={colors.textPlaceholder}
              style={[s.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.textPrimary }]}
              autoFocus
            />
            {!isRegion && (
              <>
                <Text style={[s.fieldLabel, { color: colors.textSecondary }]}>Mô tả</Text>
                <TextInput
                  value={desc}
                  onChangeText={setDesc}
                  placeholder="Nhập mô tả..."
                  placeholderTextColor={colors.textPlaceholder}
                  style={[s.input, s.textarea, { backgroundColor: colors.input, borderColor: colors.border, color: colors.textPrimary }]}
                  multiline
                />
                <View style={[s.activeRow, { borderColor: colors.border, backgroundColor: colors.input }]}>
                  <View style={s.activeCopy}>
                    <Text style={[s.activeTitle, { color: colors.textSecondary }]}>Kích hoạt</Text>
                    <Text style={[s.activeHint, { color: colors.textMuted }]}>
                      {active ? "Mục này đang hiển thị trong hệ thống" : "Mục này đang bị vô hiệu hóa"}
                    </Text>
                  </View>
                  <Switch
                    value={active}
                    onValueChange={setActive}
                    trackColor={{ false: colors.lockedBorder, true: colors.primary }}
                    thumbColor={colors.card}
                  />
                </View>
              </>
            )}
          </ScrollView>
          <View style={s.modalFooter}>
            <TouchableOpacity
              onPress={onClose}
              style={[s.cancelButton, { borderColor: colors.border }]}
            >
              <Text style={[s.cancelText, { color: colors.textMuted }]}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={save}
              style={[s.saveButton, { backgroundColor: colors.accent }]}
            >
              <Feather name="check" size={15} color={colors.accentForeground} />
              <Text style={s.saveText}>{isEdit ? "Lưu thay đổi" : "Lưu lại"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function CategoriesScreen() {
  const router = useRouter();
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<Tab>("sector");
  const [sectors, setSectors] = useState<CategoryItem[]>(sectorData);
  const [units, setUnits] = useState<CategoryItem[]>(unitData);
  const [certs, setCerts] = useState<CategoryItem[]>(certData);
  const [regions, setRegions] = useState<RegionNode[]>(initialRegionTree);
  const [form, setForm] = useState<FormState | null>(null);

  const currentItems =
    activeTab === "sector" ? sectors : activeTab === "unit" ? units : certs;
  const typeName =
    tabs.find((tab) => tab.id === activeTab)?.label ?? "Danh mục";

  const openAdd = (parentId: string | null = null) => {
    setForm({
      mode: "add",
      type: activeTab === "region" ? "Địa bàn" : typeName,
      parentId,
    });
  };

  const openEditItem = (item: CategoryItem) => {
    setForm({ mode: "edit", type: typeName, item });
  };

  const deleteItem = (item: CategoryItem) => {
    Alert.alert(
      "Xóa danh mục",
      `Bạn có chắc muốn xóa "${item.name}"? Hành động này không thể hoàn tác.`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => {
            if (activeTab === "sector") setSectors((items) => items.filter((value) => value.id !== item.id));
            if (activeTab === "unit") setUnits((items) => items.filter((value) => value.id !== item.id));
            if (activeTab === "cert") setCerts((items) => items.filter((value) => value.id !== item.id));
          },
        },
      ],
    );
  };

  const saveItem = (name: string, desc: string, active: boolean) => {
    if (!form) return;
    if (form.mode === "edit") {
      const update = (items: CategoryItem[]) =>
        items.map((item) => (item.id === form.item.id ? { ...item, name, desc, active } : item));
      if (activeTab === "sector") setSectors(update);
      if (activeTab === "unit") setUnits(update);
      if (activeTab === "cert") setCerts(update);
    } else {
      const newItem = {
        id: nextNumberId(currentItems),
        name,
        desc,
        active,
      };
      if (activeTab === "sector") setSectors((items) => [...items, newItem]);
      if (activeTab === "unit") setUnits((items) => [...items, newItem]);
      if (activeTab === "cert") setCerts((items) => [...items, newItem]);
    }
    setForm(null);
  };

  const editRegion = (node: RegionNode) => {
    setForm({ mode: "edit-region", type: "Địa bàn", node });
  };

  const deleteRegion = (node: RegionNode) => {
    Alert.alert(
      "Xóa địa bàn",
      `Bạn có chắc muốn xóa "${node.name}"${node.children?.length ? " và toàn bộ địa bàn con" : ""}?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => setRegions((items) => removeRegion(items, node.id)),
        },
      ],
    );
  };

  const saveRegion = (name: string) => {
    if (!form) return;
    if (form.mode === "edit-region") {
      setRegions((items) => updateRegion(items, form.node.id, (node) => ({ ...node, name })));
    } else if (form.mode === "add") {
      const child: RegionNode = {
        id: `r-${Date.now()}`,
        name,
      };
      setRegions((items) => addRegion(items, form.parentId, child));
    }
    setForm(null);
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backButton} accessibilityLabel="Quay lại">
          <Feather name="arrow-left" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={s.headerCopy}>
          <Text style={[s.title, { color: colors.textPrimary }]}>Danh mục & địa bàn</Text>
          <Text style={[s.subtitle, { color: colors.textMuted }]}>Quản lý phân loại và đơn vị hành chính</Text>
        </View>
        <TouchableOpacity
          onPress={() => openAdd()}
          style={[s.headerAdd, { backgroundColor: colors.accent }]}
          accessibilityLabel={`Thêm ${activeTab === "region" ? "địa bàn" : "mục mới"}`}
        >
          <Feather name="plus" size={17} color={colors.accentForeground} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.tabsRow}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={[
              s.tab,
              { backgroundColor: colors.card, borderColor: colors.border },
              activeTab === tab.id && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
          >
            <Feather
              name={tab.icon}
              size={14}
              color={activeTab === tab.id ? colors.primaryForeground : colors.textMuted}
            />
            <Text
              style={[
                s.tabText,
                { color: activeTab === tab.id ? colors.primaryForeground : colors.textMuted },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={s.contentHeading}>
        <View>
          <Text style={[s.contentTitle, { color: colors.textPrimary }]}>
            {activeTab === "region" ? "Cây đơn vị hành chính" : typeName}
          </Text>
          <Text style={[s.contentHint, { color: colors.textMuted }]}>
            {activeTab === "region"
              ? "Quản lý tỉnh, thành phố, huyện và phường xã"
              : `${currentItems.length} mục trong hệ thống`}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => openAdd()}
          style={[s.inlineAdd, { backgroundColor: colors.accentLight }]}
          accessibilityLabel="Thêm mới"
        >
          <Feather name="plus" size={14} color={colors.accent} />
          <Text style={[s.inlineAddText, { color: colors.accent }]}>Thêm mới</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab !== "region" ? (
          currentItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              tab={activeTab}
              colors={colors}
              onEdit={() => openEditItem(item)}
              onDelete={() => deleteItem(item)}
            />
          ))
        ) : (
          <View style={[s.regionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {regions.map((node) => (
              <RegionNodeRow
                key={node.id}
                node={node}
                depth={0}
                colors={colors}
                onAdd={openAdd}
                onEdit={editRegion}
                onDelete={deleteRegion}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {form && (
        <FormModal
          form={form}
          colors={colors}
          onClose={() => setForm(null)}
          onSaveItem={saveItem}
          onSaveRegion={saveRegion}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 8 },
  backButton: { padding: 4 },
  headerCopy: { flex: 1 },
  title: { fontSize: 18, fontWeight: "700", letterSpacing: -0.5 },
  subtitle: { fontSize: 10, marginTop: 2 },
  headerAdd: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  tabsRow: { gap: 7, paddingHorizontal: 16, paddingVertical: 8 },
  tab: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderRadius: 10, paddingHorizontal: 11, paddingVertical: 8 },
  tabText: { fontSize: 10, fontWeight: "700" },
  contentHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 11, paddingBottom: 5 },
  contentTitle: { fontSize: 15, fontWeight: "700" },
  contentHint: { fontSize: 10, marginTop: 3 },
  inlineAdd: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 9, paddingHorizontal: 9, paddingVertical: 7 },
  inlineAddText: { fontSize: 10, fontWeight: "700" },
  listContent: { padding: 16, paddingTop: 8, paddingBottom: 35 },
  itemCard: { borderWidth: 1, borderRadius: 14, padding: 13, marginBottom: 10 },
  itemHeader: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  itemIcon: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  itemMain: { flex: 1, paddingTop: 1 },
  itemName: { fontSize: 13, fontWeight: "700" },
  itemDescription: { fontSize: 10, lineHeight: 15, marginTop: 3 },
  itemActions: { flexDirection: "row", gap: 5 },
  actionButton: { width: 29, height: 29, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  itemFooter: { flexDirection: "row", alignItems: "center", marginTop: 11, paddingTop: 9, borderTopWidth: 1 },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 4, borderWidth: 1, borderRadius: 7, paddingHorizontal: 7, paddingVertical: 4 },
  statusText: { fontSize: 9, fontWeight: "700" },
  regionCard: { borderWidth: 1, borderRadius: 14, overflow: "hidden" },
  regionRow: { minHeight: 48, flexDirection: "row", alignItems: "center", gap: 7, paddingRight: 7, borderBottomWidth: 1 },
  regionExpand: { width: 20, height: 30, alignItems: "center", justifyContent: "center" },
  leafDot: { width: 6, height: 6, borderRadius: 3 },
  regionName: { flex: 1, fontSize: 12 },
  regionActions: { flexDirection: "row", gap: 2 },
  regionAction: { width: 28, height: 28, alignItems: "center", justifyContent: "center", borderRadius: 7 },
  regionChildren: { marginLeft: 28, borderLeftWidth: 1 },
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(22,35,79,0.32)" },
  modalCard: { maxHeight: "88%", borderTopLeftRadius: 22, borderTopRightRadius: 22, paddingTop: 18 },
  modalHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 13, borderBottomWidth: 1, borderBottomColor: "#f0f2f8" },
  modalHeading: { flex: 1 },
  modalEyebrow: { fontSize: 9, fontWeight: "800", letterSpacing: 1.2 },
  modalTitle: { fontSize: 16, fontWeight: "700", marginTop: 3 },
  modalContent: { padding: 20, paddingBottom: 8 },
  fieldLabel: { fontSize: 11, fontWeight: "600", marginBottom: 6 },
  input: { minHeight: 44, borderWidth: 1, borderRadius: 11, paddingHorizontal: 12, paddingVertical: 10, fontSize: 12, marginBottom: 15 },
  textarea: { minHeight: 82, textAlignVertical: "top" },
  activeRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderRadius: 11, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 10 },
  activeCopy: { flex: 1, paddingRight: 10 },
  activeTitle: { fontSize: 12, fontWeight: "700" },
  activeHint: { fontSize: 10, marginTop: 3 },
  modalFooter: { flexDirection: "row", gap: 10, padding: 16, borderTopWidth: 1, borderTopColor: "#f0f2f8" },
  cancelButton: { flex: 1, minHeight: 43, alignItems: "center", justifyContent: "center", borderWidth: 1, borderRadius: 10 },
  cancelText: { fontSize: 12, fontWeight: "600" },
  saveButton: { flex: 1, minHeight: 43, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 10 },
  saveText: { fontSize: 12, fontWeight: "700", color: "#fff" },
});