import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput,
  ScrollView, Modal, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

/* ─── Types & Mock Data ──────────────────────────────────────── */
interface Product {
  id: string;
  name: string;
  code: string;
  business: string;
  category: string;
  unit: string;
  status: 'active' | 'pending' | 'rejected';
  images: string[];
  description: string;
  origin: string;
  certifications: string[];
  harvestDate: string;
  expiryDate: string;
  traceSteps: TraceStep[];
  qrScans: number;
}

interface TraceStep {
  step: number;
  title: string;
  location: string;
  date: string;
  icon: string;
  color: string;
  details: string;
}

const CATEGORIES = ['Tất cả', 'Nông sản', 'Thủy sản', 'Đồ uống', 'Chế biến', 'Dược liệu'];
const STATUSES_LABEL: Record<string, string> = { active: 'Hoạt động', pending: 'Chờ xét duyệt', rejected: 'Từ chối' };
const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  active: { bg: '#e8f5ed', text: '#1f7a45' },
  pending: { bg: '#fff4d4', text: '#9a6116' },
  rejected: { bg: '#fef0f0', text: '#c0392b' },
};

const TRACE_TEMPLATE: TraceStep[] = [
  { step: 1, title: 'Canh tác / Nuôi trồng', location: 'Trang trại Bình Phước', date: '2024-06-01', icon: 'sun', color: '#1f7a45', details: 'Sử dụng quy trình canh tác VietGAP, không sử dụng hóa chất cấm.' },
  { step: 2, title: 'Thu hoạch', location: 'Trang trại Bình Phước', date: '2024-06-15', icon: 'scissors', color: '#E8650A', details: 'Thu hoạch đúng thời điểm, đạt tiêu chuẩn độ chín tối ưu.' },
  { step: 3, title: 'Sơ chế & Đóng gói', location: 'Nhà máy Biên Hòa', date: '2024-06-16', icon: 'package', color: '#2740BA', details: 'Sơ chế đạt tiêu chuẩn HACCP, đóng gói hút chân không.' },
  { step: 4, title: 'Kiểm định chất lượng', location: 'Trung tâm kiểm nghiệm', date: '2024-06-17', icon: 'check-square', color: '#7c3aed', details: 'Kiểm nghiệm đạt chuẩn TCVN 5603:2023, không phát hiện dư lượng thuốc BVTV.' },
  { step: 5, title: 'Vận chuyển', location: 'Trung tâm logistics', date: '2024-06-18', icon: 'truck', color: '#0891b2', details: 'Vận chuyển bằng xe lạnh, nhiệt độ duy trì 2-8°C.' },
  { step: 6, title: 'Phân phối', location: 'Siêu thị & Đại lý', date: '2024-06-19', icon: 'shopping-bag', color: '#E8650A', details: 'Phân phối đến hơn 50 điểm bán lẻ tại tỉnh Đồng Nai.' },
];

const PRODUCTS: Product[] = [
  { id: 'P001', name: 'Bưởi Tân Triều', code: 'BVTRIEO-2024-001', business: 'HTX Nông nghiệp Tân Triều', category: 'Nông sản', unit: 'Kg', status: 'active', images: [], description: 'Bưởi Tân Triều nổi tiếng với vị ngọt thanh, nhiều nước, ít hạt. Được trồng theo quy trình VietGAP tại vùng trồng đặc sản Tân Triều, Vĩnh Cửu.', origin: 'Xã Tân Triều, Vĩnh Cửu, Đồng Nai', certifications: ['VietGAP', 'GlobalGAP'], harvestDate: '2024-06-15', expiryDate: '2024-07-15', traceSteps: TRACE_TEMPLATE, qrScans: 1247 },
  { id: 'P002', name: 'Nước khoáng Vĩnh Hảo 500ml', code: 'VHKN-2024-001', business: 'Công ty CP Thực phẩm Vĩnh Hảo', category: 'Đồ uống', unit: 'Chai', status: 'active', images: [], description: 'Nước khoáng thiên nhiên Vĩnh Hảo được khai thác từ nguồn mạch ngầm sâu dưới lòng đất, giàu khoáng chất vi lượng.', origin: 'Bình Thuận (nhà máy), phân phối Đồng Nai', certifications: ['ISO 22000', 'HACCP'], harvestDate: '2024-08-01', expiryDate: '2026-08-01', traceSteps: TRACE_TEMPLATE, qrScans: 4532 },
  { id: 'P003', name: 'Cá tra phi lê đông lạnh', code: 'CTPL-2024-001', business: 'Trại nuôi thủy sản Bình Sơn', category: 'Thủy sản', unit: 'Kg', status: 'active', images: [], description: 'Cá tra nuôi ao sạch theo tiêu chuẩn ASC, phi lê tươi đông lạnh IQF. Không tồn dư kháng sinh, đạt tiêu chuẩn xuất khẩu.', origin: 'Nhơn Trạch, Đồng Nai', certifications: ['ASC'], harvestDate: '2024-07-20', expiryDate: '2025-01-20', traceSteps: TRACE_TEMPLATE, qrScans: 890 },
  { id: 'P004', name: 'Tinh bột sắn biến tính', code: 'TBSB-2024-001', business: 'Công ty CP Chế biến Đồng Nai', category: 'Chế biến', unit: 'Tấn', status: 'active', images: [], description: 'Tinh bột sắn biến tính dùng trong công nghiệp thực phẩm và giấy. Độ ẩm < 13%, độ trắng > 90%.', origin: 'KCN Tam Phước, Biên Hòa', certifications: ['ISO 22000', 'BRC'], harvestDate: '2024-08-05', expiryDate: '2025-08-05', traceSteps: TRACE_TEMPLATE, qrScans: 231 },
  { id: 'P005', name: 'Sầu riêng Ri6 nguyên trái', code: 'SRRI6-2024-001', business: 'HTX Nông nghiệp Tân Triều', category: 'Nông sản', unit: 'Kg', status: 'pending', images: [], description: 'Sầu riêng Ri6 trồng tại vùng đặc sản Xuân Lộc, cơm vàng, hạt lép, mùi thơm đặc trưng.', origin: 'Xuân Lộc, Đồng Nai', certifications: [], harvestDate: '2024-08-10', expiryDate: '2024-08-17', traceSteps: TRACE_TEMPLATE, qrScans: 0 },
  { id: 'P006', name: 'Trà dược liệu Hà thủ ô', code: 'TDLHTO-2024-001', business: 'HTX Dược liệu Xuân Lộc', category: 'Dược liệu', unit: 'Gói', status: 'rejected', images: [], description: 'Trà thảo dược từ Hà thủ ô đỏ, hỗ trợ bổ huyết, đen tóc, tăng cường sức khỏe.', origin: 'Xuân Lộc, Đồng Nai', certifications: ['GACP'], harvestDate: '2024-05-01', expiryDate: '2025-05-01', traceSteps: TRACE_TEMPLATE, qrScans: 0 },
];

/* ─── Product Card ─────────────────────────────────────────── */
function ProductCard({ product, onPress }: { product: Product; onPress: () => void }) {
  const sc = STATUS_COLOR[product.status];
  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.85}>
      <View style={s.cardImgWrap}>
        <View style={s.cardImgPlaceholder}>
          <Feather name="image" size={28} color="#c8cfdd" />
        </View>
        <View style={[s.statusBadge, { backgroundColor: sc.bg }]}>
          <Text style={[s.statusText, { color: sc.text }]}>{STATUSES_LABEL[product.status]}</Text>
        </View>
      </View>
      <View style={s.cardBody}>
        <Text style={s.cardName} numberOfLines={2}>{product.name}</Text>
        <Text style={s.cardCode}>{product.code}</Text>
        <Text style={s.cardBiz} numberOfLines={1}>{product.business}</Text>
        <View style={s.cardMeta}>
          <View style={s.metaChip}>
            <Feather name="layers" size={10} color="#6b7694" />
            <Text style={s.metaText}>{product.category}</Text>
          </View>
          <View style={s.metaChip}>
            <Feather name="scan" size={10} color="#6b7694" />
            <Text style={s.metaText}>{product.qrScans.toLocaleString('vi-VN')}</Text>
          </View>
        </View>
        {product.certifications.length > 0 && (
          <View style={s.certs}>
            {product.certifications.map(c => (
              <View key={c} style={s.certBadge}>
                <Text style={s.certText}>{c}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

/* ─── Product Detail ─────────────────────────────────────────── */
function ProductDetail({ product, onBack }: { product: Product; onBack: () => void }) {
  const [tab, setTab] = useState<'basic' | 'trace'>('basic');
  const [showQR, setShowQR] = useState(false);
  const sc = STATUS_COLOR[product.status];

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f7fb' }}>
      {/* Header */}
      <View style={pd.header}>
        <TouchableOpacity style={pd.backBtn} onPress={onBack}>
          <Feather name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>
        <View style={pd.imgPlaceholder}>
          <Feather name="image" size={48} color="rgba(255,255,255,0.3)" />
        </View>
        <View style={pd.headerMeta}>
          <Text style={pd.headerName}>{product.name}</Text>
          <Text style={pd.headerCode}>{product.code}</Text>
          <View style={pd.headerActions}>
            <View style={[pd.badge, { backgroundColor: sc.bg }]}>
              <Text style={[pd.badgeText, { color: sc.text }]}>{STATUSES_LABEL[product.status]}</Text>
            </View>
            <TouchableOpacity style={pd.qrBtn} onPress={() => setShowQR(true)}>
              <Feather name="maximize" size={13} color="#fff" />
              <Text style={pd.qrBtnText}>QR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={pd.tabs}>
        {([['basic', 'Thông tin cơ bản'], ['trace', 'Truy xuất nguồn gốc']] as const).map(([k, l]) => (
          <TouchableOpacity key={k} style={[pd.tab, tab === k && pd.tabActive]} onPress={() => setTab(k)}>
            <Text style={[pd.tabText, tab === k && pd.tabTextActive]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {tab === 'basic' && (
          <View>
            {[
              { label: 'Tên sản phẩm', value: product.name, icon: 'tag' },
              { label: 'Mã sản phẩm', value: product.code, icon: 'hash' },
              { label: 'Danh mục', value: product.category, icon: 'layers' },
              { label: 'Đơn vị tính', value: product.unit, icon: 'grid' },
              { label: 'Doanh nghiệp', value: product.business, icon: 'briefcase' },
              { label: 'Nguồn gốc', value: product.origin, icon: 'map-pin' },
              { label: 'Ngày thu hoạch', value: product.harvestDate, icon: 'calendar' },
              { label: 'Hạn sử dụng', value: product.expiryDate, icon: 'clock' },
              { label: 'Lượt quét QR', value: product.qrScans.toLocaleString('vi-VN'), icon: 'scan' },
            ].map(row => (
              <View key={row.label} style={pd.infoRow}>
                <Feather name={row.icon as any} size={13} color="#6b7694" style={{ marginRight: 10, marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  <Text style={pd.infoLabel}>{row.label}</Text>
                  <Text style={pd.infoValue}>{row.value}</Text>
                </View>
              </View>
            ))}
            {product.certifications.length > 0 && (
              <View style={pd.certBlock}>
                <Text style={pd.certBlockTitle}>Chứng nhận chất lượng</Text>
                {product.certifications.map(c => (
                  <View key={c} style={pd.certRow}>
                    <Feather name="award" size={14} color="#2740BA" />
                    <Text style={pd.certText}>{c}</Text>
                  </View>
                ))}
              </View>
            )}
            <View style={pd.descBlock}>
              <Text style={pd.descTitle}>Mô tả</Text>
              <Text style={pd.descText}>{product.description}</Text>
            </View>
          </View>
        )}

        {tab === 'trace' && (
          <View>
            <View style={pd.traceInfo}>
              <Feather name="info" size={13} color="#2740BA" />
              <Text style={pd.traceInfoText}>Hành trình đầy đủ 6 bước của sản phẩm từ sản xuất đến tiêu thụ</Text>
            </View>
            {product.traceSteps.map((step, i) => (
              <View key={i} style={pd.traceRow}>
                <View style={pd.traceLeft}>
                  <View style={[pd.traceCircle, { backgroundColor: step.color + '20', borderColor: step.color }]}>
                    <Feather name={step.icon as any} size={14} color={step.color} />
                  </View>
                  {i < product.traceSteps.length - 1 && <View style={pd.traceLine} />}
                </View>
                <View style={pd.traceContent}>
                  <View style={pd.traceHeader}>
                    <View style={[pd.traceNum, { backgroundColor: step.color }]}>
                      <Text style={pd.traceNumText}>{step.step}</Text>
                    </View>
                    <Text style={pd.traceTitle}>{step.title}</Text>
                  </View>
                  <Text style={pd.traceDate}>{step.date}</Text>
                  <Text style={pd.traceLoc}>{step.location}</Text>
                  <Text style={pd.traceDetails}>{step.details}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* QR Modal */}
      <Modal visible={showQR} transparent animationType="fade">
        <TouchableOpacity style={qrs.overlay} onPress={() => setShowQR(false)} activeOpacity={1}>
          <View style={qrs.modal}>
            <View style={qrs.qrBox}>
              <Feather name="maximize" size={56} color="#2740BA" />
              <Text style={qrs.qrCode}>{product.code}</Text>
            </View>
            <Text style={qrs.qrLabel}>{product.name}</Text>
            <Text style={qrs.qrSub}>Quét để xem thông tin truy xuất</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

/* ─── Main Screen ────────────────────────────────────────────── */
export default function ProductsScreen() {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('Tất cả');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    return PRODUCTS.filter(p => {
      const q = search.toLowerCase();
      if (q && !p.name.toLowerCase().includes(q) && !p.code.toLowerCase().includes(q)) return false;
      if (selectedCat !== 'Tất cả' && p.category !== selectedCat) return false;
      return true;
    });
  }, [search, selectedCat]);

  if (selected) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ProductDetail product={selected} onBack={() => setSelected(null)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <View>
          <Text style={s.title}>Sản phẩm</Text>
          <Text style={s.subtitle}>{PRODUCTS.length} sản phẩm đã đăng ký</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {(['list', 'grid'] as const).map(m => (
            <TouchableOpacity key={m} style={[s.modeBtn, viewMode === m && s.modeBtnActive]} onPress={() => setViewMode(m)}>
              <Feather name={m === 'list' ? 'list' : 'grid'} size={15} color={viewMode === m ? '#2740BA' : '#6b7694'} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={s.searchRow}>
        <Feather name="search" size={15} color="#a8b2c8" style={{ marginRight: 8 }} />
        <TextInput style={s.searchInput} value={search} onChangeText={setSearch} placeholder="Tìm sản phẩm…" placeholderTextColor="#a8b2c8" />
        {!!search && <TouchableOpacity onPress={() => setSearch('')}><Feather name="x" size={15} color="#a8b2c8" /></TouchableOpacity>}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips} style={{ maxHeight: 44, flexGrow: 0 }}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity key={cat} style={[s.chip, selectedCat === cat && s.chipActive]} onPress={() => setSelectedCat(cat)}>
            <Text style={[s.chipText, selectedCat === cat && s.chipTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={s.resultsRow}>
        <Text style={s.resultsText}>{filtered.length} kết quả</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={p => p.id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode}
        renderItem={({ item }) => (
          <View style={viewMode === 'grid' ? { flex: 1, margin: 4, marginHorizontal: 4 } : { marginHorizontal: 12, marginBottom: 10 }}>
            <ProductCard product={item} onPress={() => setSelected(item)} />
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: viewMode === 'grid' ? 8 : 0, paddingBottom: 16, paddingTop: 4 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 48 }}>
            <Feather name="package" size={40} color="#d9dce9" />
            <Text style={{ fontSize: 14, color: '#6b7694', marginTop: 12 }}>Không tìm thấy sản phẩm</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

/* ─── Styles ──────────────────────────────────────────────────── */
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fb' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#1d2944', letterSpacing: -0.5 },
  subtitle: { fontSize: 11, color: '#6b7694', marginTop: 2 },
  modeBtn: { padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#e4e8f0', backgroundColor: '#fff' },
  modeBtnActive: { borderColor: '#2740BA', backgroundColor: '#edf0ff' },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12,
    borderWidth: 1, borderColor: '#e4e8f0', marginHorizontal: 12, marginBottom: 8, paddingHorizontal: 12, height: 42,
  },
  searchInput: { flex: 1, fontSize: 13, color: '#1d2944' },
  chips: { paddingHorizontal: 12, paddingVertical: 4, gap: 6 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e4e8f0' },
  chipActive: { backgroundColor: '#edf0ff', borderColor: '#2740BA' },
  chipText: { fontSize: 11, color: '#6b7694', fontWeight: '500' },
  chipTextActive: { color: '#2740BA', fontWeight: '700' },
  resultsRow: { paddingHorizontal: 16, paddingVertical: 6 },
  resultsText: { fontSize: 11, color: '#6b7694' },

  card: {
    backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#e4e8f0',
    shadowColor: '#1d2944', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    overflow: 'hidden',
  },
  cardImgWrap: { height: 100, backgroundColor: '#f5f7fb', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  cardImgPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  statusBadge: { position: 'absolute', top: 8, right: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 20 },
  statusText: { fontSize: 9, fontWeight: '700' },
  cardBody: { padding: 10 },
  cardName: { fontSize: 12, fontWeight: '700', color: '#1d2944', lineHeight: 16 },
  cardCode: { fontSize: 9, color: '#6b7694', marginTop: 2 },
  cardBiz: { fontSize: 10, color: '#6b7694', marginTop: 3 },
  cardMeta: { flexDirection: 'row', gap: 8, marginTop: 6 },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 9, color: '#6b7694' },
  certs: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 },
  certBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 20, backgroundColor: '#edf0ff' },
  certText: { fontSize: 9, color: '#2740BA', fontWeight: '600' },
});

const pd = StyleSheet.create({
  header: { backgroundColor: '#1e3171', padding: 16, paddingBottom: 20 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  imgPlaceholder: { height: 100, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  headerMeta: {},
  headerName: { fontSize: 16, fontWeight: '700', color: '#fff', lineHeight: 22 },
  headerCode: { fontSize: 11, color: 'rgba(219,234,254,0.7)', marginTop: 4, marginBottom: 10 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  qrBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  qrBtnText: { fontSize: 12, color: '#fff', fontWeight: '600' },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e4e8f0' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#2740BA' },
  tabText: { fontSize: 12, color: '#6b7694', fontWeight: '500' },
  tabTextActive: { color: '#2740BA', fontWeight: '700' },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f2f8' },
  infoLabel: { fontSize: 10, color: '#6b7694', marginBottom: 2 },
  infoValue: { fontSize: 13, color: '#1d2944', fontWeight: '500' },
  certBlock: { marginTop: 12, backgroundColor: '#edf0ff', borderRadius: 12, padding: 12 },
  certBlockTitle: { fontSize: 11, fontWeight: '700', color: '#2740BA', marginBottom: 8 },
  certRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  certText: { fontSize: 12, color: '#2740BA', fontWeight: '500' },
  descBlock: { marginTop: 12, backgroundColor: '#f9fafb', borderRadius: 12, padding: 12 },
  descTitle: { fontSize: 11, fontWeight: '700', color: '#6b7694', marginBottom: 6 },
  descText: { fontSize: 12, color: '#34405a', lineHeight: 18 },
  traceInfo: { flexDirection: 'row', gap: 8, backgroundColor: '#f3f8ff', borderRadius: 10, padding: 10, marginBottom: 16, borderWidth: 1, borderColor: '#c9ddf4' },
  traceInfoText: { flex: 1, fontSize: 11, color: '#2740BA', lineHeight: 16 },
  traceRow: { flexDirection: 'row', marginBottom: 4 },
  traceLeft: { alignItems: 'center', marginRight: 12, width: 36 },
  traceCircle: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  traceLine: { width: 2, flex: 1, backgroundColor: '#e4e8f0', marginVertical: 4, minHeight: 24 },
  traceContent: { flex: 1, paddingBottom: 16 },
  traceHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  traceNum: { width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  traceNumText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  traceTitle: { fontSize: 13, fontWeight: '700', color: '#1d2944' },
  traceDate: { fontSize: 10, color: '#6b7694', marginBottom: 2 },
  traceLoc: { fontSize: 11, color: '#2740BA', marginBottom: 4 },
  traceDetails: { fontSize: 11, color: '#6b7694', lineHeight: 16, backgroundColor: '#f9fafb', borderRadius: 8, padding: 8 },
});

const qrs = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center', width: 260 },
  qrBox: { width: 160, height: 160, borderRadius: 12, backgroundColor: '#f5f7fb', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#e4e8f0', borderStyle: 'dashed', marginBottom: 12 },
  qrCode: { fontSize: 9, color: '#2740BA', marginTop: 8, fontWeight: '600', textAlign: 'center' },
  qrLabel: { fontSize: 13, fontWeight: '700', color: '#1d2944', textAlign: 'center' },
  qrSub: { fontSize: 11, color: '#6b7694', marginTop: 4, textAlign: 'center' },
});
