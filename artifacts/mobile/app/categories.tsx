import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

/* ─── Mock Data ──────────────────────────────────────────────── */
const CATEGORIES_DATA = [
  { id: 'C1', name: 'Nông sản', code: 'NS', bizCount: 94, productCount: 412, color: '#1f7a45' },
  { id: 'C2', name: 'Thủy sản', code: 'TS', bizCount: 58, productCount: 187, color: '#0891b2' },
  { id: 'C3', name: 'Chế biến thực phẩm', code: 'CB', bizCount: 47, productCount: 631, color: '#E8650A' },
  { id: 'C4', name: 'Đồ uống', code: 'DU', bizCount: 32, productCount: 289, color: '#2740BA' },
  { id: 'C5', name: 'Dược liệu', code: 'DL', bizCount: 16, productCount: 98, color: '#7c3aed' },
];

const UNITS_DATA = [
  { id: 'U1', name: 'Kilogram', code: 'kg', type: 'Khối lượng' },
  { id: 'U2', name: 'Tấn', code: 'tấn', type: 'Khối lượng' },
  { id: 'U3', name: 'Lít', code: 'L', type: 'Thể tích' },
  { id: 'U4', name: 'Chai', code: 'chai', type: 'Đơn vị' },
  { id: 'U5', name: 'Thùng', code: 'thùng', type: 'Đơn vị' },
  { id: 'U6', name: 'Gói', code: 'gói', type: 'Đơn vị' },
  { id: 'U7', name: 'Hộp', code: 'hộp', type: 'Đơn vị' },
];

const CERTS_DATA = [
  { id: 'CT1', name: 'VietGAP', org: 'Bộ NN & PTNT', type: 'Nông nghiệp', count: 42 },
  { id: 'CT2', name: 'GlobalGAP', org: 'FoodPLUS GmbH', type: 'Quốc tế', count: 18 },
  { id: 'CT3', name: 'ISO 22000', org: 'ISO', type: 'An toàn thực phẩm', count: 31 },
  { id: 'CT4', name: 'HACCP', org: 'Codex', type: 'An toàn thực phẩm', count: 27 },
  { id: 'CT5', name: 'ASC', org: 'ASC', type: 'Thủy sản', count: 8 },
  { id: 'CT6', name: 'GACP', org: 'WHO', type: 'Dược liệu', count: 5 },
  { id: 'CT7', name: 'BRC', org: 'BRC', type: 'Thực phẩm', count: 12 },
];

const REGIONS_DATA = [
  {
    id: 'R1', name: 'TP Biên Hòa', type: 'Thành phố', bizCount: 89,
    districts: ['Phường Trảng Dài', 'Phường Tân Phong', 'Phường Bình Đa', 'Phường An Bình'],
  },
  {
    id: 'R2', name: 'Huyện Long Thành', type: 'Huyện', bizCount: 52,
    districts: ['TT Long Thành', 'Xã Tam An', 'Xã Phước Bình', 'Xã Tam Phước'],
  },
  {
    id: 'R3', name: 'Huyện Nhơn Trạch', type: 'Huyện', bizCount: 41,
    districts: ['TT Hiệp Phước', 'Xã Long Tân', 'Xã Phú Hội', 'Xã Vĩnh Thanh'],
  },
  {
    id: 'R4', name: 'Huyện Xuân Lộc', type: 'Huyện', bizCount: 38,
    districts: ['TT Gia Ray', 'Xã Xuân Tâm', 'Xã Bảo Hòa', 'Xã Xuân Hòa'],
  },
  {
    id: 'R5', name: 'Huyện Vĩnh Cửu', type: 'Huyện', bizCount: 27,
    districts: ['TT Vĩnh An', 'Xã Tân Triều', 'Xã Vĩnh Tân', 'Xã Bình Hòa'],
  },
];

const TABS = [
  { key: 'categories', label: 'Ngành hàng', icon: 'layers' },
  { key: 'units', label: 'Đơn vị tính', icon: 'grid' },
  { key: 'certs', label: 'Chứng nhận', icon: 'award' },
  { key: 'regions', label: 'Địa bàn', icon: 'map-pin' },
] as const;

type Tab = typeof TABS[number]['key'];

export default function CategoriesScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('categories');
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);

  const handleAdd = () => {
    if (!newName.trim()) { Alert.alert('Lỗi', 'Vui lòng nhập tên.'); return; }
    Alert.alert('Thành công', `Đã thêm "${newName}" vào danh mục.`);
    setNewName('');
    setShowAdd(false);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Feather name="arrow-left" size={20} color="#1d2944" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Danh mục & Địa bàn</Text>
          <Text style={s.subtitle}>Quản lý danh mục toàn hệ thống</Text>
        </View>
        <TouchableOpacity style={s.addBtn} onPress={() => setShowAdd(true)}>
          <Feather name="plus" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabsRow} style={{ maxHeight: 52, flexGrow: 0 }}>
        {TABS.map(t => (
          <TouchableOpacity key={t.key} style={[s.tab, activeTab === t.key && s.tabActive]} onPress={() => setActiveTab(t.key)}>
            <Feather name={t.icon} size={13} color={activeTab === t.key ? '#2740BA' : '#6b7694'} />
            <Text style={[s.tabText, activeTab === t.key && s.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Categories tab */}
        {activeTab === 'categories' && CATEGORIES_DATA.map((cat) => (
          <View key={cat.id} style={s.card}>
            <View style={s.cardHeader}>
              <View style={[s.catDot, { backgroundColor: cat.color + '20' }]}>
                <Feather name="layers" size={16} color={cat.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.cardTitle}>{cat.name}</Text>
                <Text style={s.cardSub}>Mã: {cat.code}</Text>
              </View>
              <View style={s.cardActions}>
                <TouchableOpacity style={s.iconAction}><Feather name="edit-2" size={13} color="#6b7694" /></TouchableOpacity>
                <TouchableOpacity style={[s.iconAction, { backgroundColor: '#fef0f0' }]}>
                  <Feather name="trash-2" size={13} color="#c0392b" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={s.statRow}>
              <View style={s.statItem}>
                <Feather name="briefcase" size={11} color="#6b7694" />
                <Text style={s.statText}>{cat.bizCount} doanh nghiệp</Text>
              </View>
              <View style={s.statItem}>
                <Feather name="package" size={11} color="#6b7694" />
                <Text style={s.statText}>{cat.productCount} sản phẩm</Text>
              </View>
            </View>
          </View>
        ))}

        {/* Units tab */}
        {activeTab === 'units' && (
          <View style={s.tableCard}>
            <View style={s.tableHeader}>
              <Text style={[s.th, { flex: 2 }]}>Tên đơn vị</Text>
              <Text style={[s.th, { flex: 1 }]}>Mã</Text>
              <Text style={[s.th, { flex: 1.5 }]}>Loại</Text>
              <Text style={[s.th, { width: 56 }]}>Thao tác</Text>
            </View>
            {UNITS_DATA.map((u, i) => (
              <View key={u.id} style={[s.tableRow, i % 2 === 0 && { backgroundColor: '#fafbff' }]}>
                <Text style={[s.td, { flex: 2 }]}>{u.name}</Text>
                <View style={[{ flex: 1 }]}>
                  <View style={s.codeBadge}><Text style={s.codeText}>{u.code}</Text></View>
                </View>
                <Text style={[s.td, { flex: 1.5 }]}>{u.type}</Text>
                <View style={[s.tableActions, { width: 56 }]}>
                  <TouchableOpacity><Feather name="edit-2" size={13} color="#2740BA" /></TouchableOpacity>
                  <TouchableOpacity><Feather name="trash-2" size={13} color="#c0392b" /></TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Certs tab */}
        {activeTab === 'certs' && CERTS_DATA.map(cert => (
          <View key={cert.id} style={s.card}>
            <View style={s.cardHeader}>
              <View style={[s.catDot, { backgroundColor: '#edf0ff' }]}>
                <Feather name="award" size={16} color="#2740BA" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.cardTitle}>{cert.name}</Text>
                <Text style={s.cardSub}>{cert.org} · {cert.type}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <View style={s.countBadge}><Text style={s.countText}>{cert.count} DN</Text></View>
                <View style={s.cardActions}>
                  <TouchableOpacity style={s.iconAction}><Feather name="edit-2" size={13} color="#6b7694" /></TouchableOpacity>
                  <TouchableOpacity style={[s.iconAction, { backgroundColor: '#fef0f0' }]}>
                    <Feather name="trash-2" size={13} color="#c0392b" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* Regions tab */}
        {activeTab === 'regions' && REGIONS_DATA.map(region => (
          <View key={region.id} style={s.card}>
            <TouchableOpacity style={s.regionHeader} onPress={() => setExpandedRegion(expandedRegion === region.id ? null : region.id)}>
              <View style={[s.catDot, { backgroundColor: '#fff4ed' }]}>
                <Feather name="map-pin" size={16} color="#E8650A" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.cardTitle}>{region.name}</Text>
                <Text style={s.cardSub}>{region.type} · {region.bizCount} doanh nghiệp</Text>
              </View>
              <Feather name={expandedRegion === region.id ? 'chevron-up' : 'chevron-down'} size={16} color="#6b7694" />
            </TouchableOpacity>
            {expandedRegion === region.id && (
              <View style={s.districtList}>
                {region.districts.map((d, i) => (
                  <View key={i} style={s.districtRow}>
                    <Feather name="corner-down-right" size={12} color="#a8b2c8" />
                    <Text style={s.districtText}>{d}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Add Modal */}
      <Modal visible={showAdd} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>Thêm mới</Text>
            <TextInput
              style={s.modalInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="Nhập tên..."
              placeholderTextColor="#a8b2c8"
              autoFocus
            />
            <View style={s.modalActions}>
              <TouchableOpacity style={s.modalCancel} onPress={() => setShowAdd(false)}>
                <Text style={s.modalCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.modalConfirm} onPress={handleAdd}>
                <Text style={s.modalConfirmText}>Thêm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fb' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  backBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: '700', color: '#1d2944', letterSpacing: -0.5 },
  subtitle: { fontSize: 11, color: '#6b7694', marginTop: 1 },
  addBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#2740BA', alignItems: 'center', justifyContent: 'center' },
  tabsRow: { paddingHorizontal: 12, paddingVertical: 6, gap: 8 },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: '#e4e8f0', backgroundColor: '#fff' },
  tabActive: { borderColor: '#2740BA', backgroundColor: '#edf0ff' },
  tabText: { fontSize: 11, color: '#6b7694', fontWeight: '500' },
  tabTextActive: { color: '#2740BA', fontWeight: '700' },
  card: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#e4e8f0',
    shadowColor: '#1d2944', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardTitle: { fontSize: 13, fontWeight: '700', color: '#1d2944' },
  cardSub: { fontSize: 10, color: '#6b7694', marginTop: 2 },
  catDot: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cardActions: { flexDirection: 'row', gap: 6 },
  iconAction: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#f5f7fb', alignItems: 'center', justifyContent: 'center' },
  statRow: { flexDirection: 'row', gap: 16, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f0f2f8' },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statText: { fontSize: 11, color: '#6b7694' },
  countBadge: { backgroundColor: '#edf0ff', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  countText: { fontSize: 10, color: '#2740BA', fontWeight: '700' },
  tableCard: {
    backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', marginBottom: 10,
    borderWidth: 1, borderColor: '#e4e8f0',
  },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f5f7fb', paddingHorizontal: 12, paddingVertical: 10 },
  th: { fontSize: 10, fontWeight: '700', color: '#6b7694', textTransform: 'uppercase' },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f0f2f8' },
  td: { fontSize: 12, color: '#1d2944' },
  codeBadge: { backgroundColor: '#f0f2f8', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  codeText: { fontSize: 10, fontWeight: '600', color: '#6b7694', fontFamily: 'Inter_400Regular' },
  tableActions: { flexDirection: 'row', gap: 8 },
  regionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  districtList: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f0f2f8', gap: 6 },
  districtRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingLeft: 4 },
  districtText: { fontSize: 12, color: '#6b7694' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalTitle: { fontSize: 16, fontWeight: '700', color: '#1d2944', marginBottom: 16 },
  modalInput: { borderRadius: 12, borderWidth: 1, borderColor: '#e4e8f0', backgroundColor: '#f9faff', height: 48, paddingHorizontal: 14, fontSize: 13, color: '#1d2944', marginBottom: 16 },
  modalActions: { flexDirection: 'row', gap: 12 },
  modalCancel: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e4e8f0', alignItems: 'center' },
  modalCancelText: { fontSize: 13, color: '#6b7694', fontWeight: '600' },
  modalConfirm: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#2740BA', alignItems: 'center' },
  modalConfirmText: { fontSize: 13, color: '#fff', fontWeight: '700' },
});
