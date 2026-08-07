import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput,
  ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useListPortalLots } from '@workspace/api-client-react';

/* ─── Mock Lots when API unavailable ───────────────────────── */
const MOCK_LOTS = [
  { id: 'LOT001', name: 'Lô bưởi Tân Triều T8/2024', business: 'HTX Nông nghiệp Tân Triều', product: 'Bưởi Tân Triều', quantity: '500 kg', date: '2024-08-01', status: 'pending', txngSteps: ['Sản xuất', 'Thu hoạch', 'Đóng gói', 'Vận chuyển'] },
  { id: 'LOT002', name: 'Lô cá tra phi lê tháng 7', business: 'Trại nuôi thủy sản Bình Sơn', product: 'Cá tra phi lê', quantity: '2 tấn', date: '2024-07-28', status: 'synced', txngSteps: ['Nuôi trồng', 'Thu hoạch', 'Sơ chế', 'Cấp đông', 'Xuất kho'] },
  { id: 'LOT003', name: 'Lô nước khoáng Vĩnh Hảo Q3', business: 'Công ty CP Thực phẩm Vĩnh Hảo', product: 'Nước khoáng 500ml', quantity: '10.000 chai', date: '2024-07-25', status: 'pending', txngSteps: ['Khai thác', 'Lọc', 'Đóng chai', 'KCS', 'Xuất kho'] },
  { id: 'LOT004', name: 'Lô tinh bột sắn biến tính T7', business: 'Công ty CP Chế biến Đồng Nai', product: 'Tinh bột sắn', quantity: '5 tấn', date: '2024-07-20', status: 'failed', txngSteps: ['Sản xuất', 'Kiểm định', 'Đóng gói'] },
  { id: 'LOT005', name: 'Lô sầu riêng Ri6 T8/2024', business: 'HTX Nông nghiệp Tân Triều', product: 'Sầu riêng Ri6', quantity: '300 kg', date: '2024-08-05', status: 'pending', txngSteps: ['Canh tác', 'Thu hoạch', 'Phân loại', 'Đóng gói'] },
];

const STATUS_META: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  pending: { label: 'Chờ đồng bộ', color: '#E8650A', bg: '#fff4ed', icon: 'clock' },
  synced: { label: 'Đã đồng bộ', color: '#1f7a45', bg: '#e8f5ed', icon: 'check-circle' },
  failed: { label: 'Thất bại', color: '#c0392b', bg: '#fef0f0', icon: 'alert-circle' },
};

interface Lot { id: string; name: string; business: string; product: string; quantity: string; date: string; status: string; txngSteps: string[] }

type ModalStep = 'basic' | 'txng' | null;

export default function SyncScreen() {
  const router = useRouter();
  const { data: apiLots, isLoading, error } = useListPortalLots();
  const lots: Lot[] = apiLots?.data?.length
    ? apiLots.data.map((lot) => ({
        id: String(lot.id),
        name: lot.lotCode,
        business: lot.businessName,
        product: lot.productName,
        quantity: '—',
        date: lot.activatedAt?.slice(0, 10) ?? '—',
        status: lot.syncStatus === 'synced' ? 'synced' : 'pending',
        txngSteps: [],
      }))
    : MOCK_LOTS;

  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [modalStep, setModalStep] = useState<ModalStep>(null);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [syncingAll, setSyncingAll] = useState(false);

  // Step 1: Basic info editing
  const [editName, setEditName] = useState('');
  const [editQty, setEditQty] = useState('');
  // Step 2: TXNG steps
  const [txngSteps, setTxngSteps] = useState<string[]>([]);
  const [newStep, setNewStep] = useState('');

  const openModal = (lot: Lot) => {
    setSelectedLot(lot);
    setEditName(lot.name);
    setEditQty(lot.quantity);
    setTxngSteps([...lot.txngSteps]);
    setModalStep('basic');
  };

  const handleSync = (lot: Lot) => {
    setSyncing(lot.id);
    setTimeout(() => {
      setSyncing(null);
      Alert.alert('Đồng bộ thành công', `Lô "${lot.name}" đã được đẩy lên Cổng truy xuất quốc gia.`);
    }, 1800);
  };

  const handleSyncAll = () => {
    const pending = lots.filter(l => l.status === 'pending');
    if (!pending.length) { Alert.alert('Thông báo', 'Không có lô hàng nào cần đồng bộ.'); return; }
    setSyncingAll(true);
    setTimeout(() => {
      setSyncingAll(false);
      Alert.alert('Hoàn tất', `Đã đồng bộ ${pending.length} lô hàng lên cổng quốc gia.`);
    }, 2400);
  };

  const pendingCount = lots.filter(l => l.status === 'pending').length;
  const syncedCount = lots.filter(l => l.status === 'synced').length;
  const failedCount = lots.filter(l => l.status === 'failed').length;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Feather name="arrow-left" size={20} color="#1d2944" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Đồng bộ dữ liệu</Text>
          <Text style={s.subtitle}>Cổng truy xuất nguồn gốc quốc gia</Text>
        </View>
        <TouchableOpacity style={s.syncAllBtn} onPress={handleSyncAll} disabled={syncingAll}>
          {syncingAll ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Feather name="refresh-cw" size={14} color="#fff" />
              <Text style={s.syncAllText}>Đồng bộ tất cả</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Status summary */}
      <View style={s.summaryRow}>
        {[
          { label: 'Chờ đồng bộ', count: pendingCount, color: '#E8650A', bg: '#fff4ed' },
          { label: 'Đã đồng bộ', count: syncedCount, color: '#1f7a45', bg: '#e8f5ed' },
          { label: 'Thất bại', count: failedCount, color: '#c0392b', bg: '#fef0f0' },
        ].map((stat, i) => (
          <View key={i} style={[s.statCard, { backgroundColor: stat.bg }]}>
            <Text style={[s.statCount, { color: stat.color }]}>{stat.count}</Text>
            <Text style={[s.statLabel, { color: stat.color }]}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* API status */}
      <View style={s.apiStatus}>
        <Feather name={error ? 'wifi-off' : 'wifi'} size={12} color={error ? '#a8b2c8' : '#1f7a45'} />
        <Text style={[s.apiStatusText, { color: error ? '#a8b2c8' : '#1f7a45' }]}>
          {error ? 'API không kết nối được — hiển thị dữ liệu mẫu' : isLoading ? 'Đang tải từ API...' : 'Kết nối API: Bình thường'}
        </Text>
        {isLoading && <ActivityIndicator size="small" color="#2740BA" style={{ marginLeft: 4 }} />}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {lots.map((lot) => {
          const sm = STATUS_META[lot.status] || STATUS_META.pending;
          const isSyncing = syncing === lot.id;
          return (
            <View key={lot.id} style={s.lotCard}>
              <View style={s.lotHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={s.lotName}>{lot.name}</Text>
                  <Text style={s.lotBiz}>{lot.business}</Text>
                </View>
                <View style={[s.statusBadge, { backgroundColor: sm.bg }]}>
                  <Feather name={sm.icon as any} size={10} color={sm.color} />
                  <Text style={[s.statusText, { color: sm.color }]}>{sm.label}</Text>
                </View>
              </View>
              <View style={s.lotMeta}>
                {[
                  { icon: 'package', text: lot.product },
                  { icon: 'hash', text: lot.quantity },
                  { icon: 'calendar', text: lot.date },
                ].map((m, i) => (
                  <View key={i} style={s.metaItem}>
                    <Feather name={m.icon as any} size={11} color="#6b7694" />
                    <Text style={s.metaText}>{m.text}</Text>
                  </View>
                ))}
              </View>
              {/* TXNG steps mini */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.stepRow}>
                {lot.txngSteps.map((step, i) => (
                  <React.Fragment key={i}>
                    <View style={s.step}>
                      <View style={s.stepNum}><Text style={s.stepNumText}>{i + 1}</Text></View>
                      <Text style={s.stepText}>{step}</Text>
                    </View>
                    {i < lot.txngSteps.length - 1 && <Feather name="chevron-right" size={12} color="#c8cfdd" />}
                  </React.Fragment>
                ))}
              </ScrollView>
              <View style={s.lotActions}>
                <TouchableOpacity style={s.editBtn} onPress={() => openModal(lot)}>
                  <Feather name="edit-2" size={13} color="#2740BA" />
                  <Text style={s.editBtnText}>Chỉnh sửa</Text>
                </TouchableOpacity>
                {lot.status !== 'synced' && (
                  <TouchableOpacity
                    style={[s.syncBtn, (isSyncing || syncingAll) && { opacity: 0.7 }]}
                    onPress={() => handleSync(lot)}
                    disabled={isSyncing || syncingAll}
                  >
                    {isSyncing ? <ActivityIndicator size="small" color="#fff" /> : <Feather name="upload-cloud" size={13} color="#fff" />}
                    <Text style={s.syncBtnText}>{isSyncing ? 'Đang đẩy...' : 'Đẩy lên cổng'}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Sync Modal — 2 step wizard */}
      <Modal visible={modalStep !== null} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f7fb' }} edges={['top']}>
          {/* Wizard header */}
          <View style={wz.header}>
            <TouchableOpacity onPress={() => setModalStep(null)}>
              <Feather name="x" size={22} color="#1d2944" />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={wz.title}>Chỉnh sửa lô hàng</Text>
              <View style={wz.steps}>
                {[1, 2].map(n => (
                  <View key={n} style={[wz.stepDot, (modalStep === 'basic' && n === 1) || (modalStep === 'txng' && n === 2) ? wz.stepDotActive : {}]}>
                    <Text style={[(modalStep === 'basic' && n === 1) || (modalStep === 'txng' && n === 2) ? wz.stepNumActive : wz.stepNum]}>{n}</Text>
                  </View>
                ))}
              </View>
            </View>
            <TouchableOpacity
              style={wz.nextBtn}
              onPress={() => {
                if (modalStep === 'basic') setModalStep('txng');
                else { setModalStep(null); Alert.alert('Đã lưu', 'Thông tin lô hàng đã được cập nhật.'); }
              }}
            >
              <Text style={wz.nextText}>{modalStep === 'basic' ? 'Tiếp' : 'Lưu'}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ padding: 20 }}>
            {modalStep === 'basic' ? (
              <View>
                <Text style={wz.stepTitle}>Bước 1: Thông tin cơ bản</Text>
                <Text style={wz.fieldLabel}>Tên lô hàng</Text>
                <TextInput style={wz.fieldInput} value={editName} onChangeText={setEditName} placeholderTextColor="#a8b2c8" />
                <Text style={wz.fieldLabel}>Số lượng</Text>
                <TextInput style={wz.fieldInput} value={editQty} onChangeText={setEditQty} placeholderTextColor="#a8b2c8" />
                {selectedLot && (
                  <>
                    <Text style={wz.fieldLabel}>Doanh nghiệp</Text>
                    <View style={wz.readonlyField}><Text style={wz.readonlyText}>{selectedLot.business}</Text></View>
                    <Text style={wz.fieldLabel}>Sản phẩm</Text>
                    <View style={wz.readonlyField}><Text style={wz.readonlyText}>{selectedLot.product}</Text></View>
                    <Text style={wz.fieldLabel}>Ngày tạo</Text>
                    <View style={wz.readonlyField}><Text style={wz.readonlyText}>{selectedLot.date}</Text></View>
                  </>
                )}
              </View>
            ) : (
              <View>
                <Text style={wz.stepTitle}>Bước 2: Các bước TXNG</Text>
                <Text style={wz.stepSub}>Điều chỉnh quy trình truy xuất nguồn gốc của lô hàng</Text>
                {txngSteps.map((step, i) => (
                  <View key={i} style={wz.txngRow}>
                    <View style={wz.txngNum}><Text style={wz.txngNumText}>{i + 1}</Text></View>
                    <TextInput
                      style={wz.txngInput}
                      value={step}
                      onChangeText={v => { const next = [...txngSteps]; next[i] = v; setTxngSteps(next); }}
                    />
                    <TouchableOpacity onPress={() => setTxngSteps(txngSteps.filter((_, j) => j !== i))}>
                      <Feather name="trash-2" size={15} color="#c0392b" />
                    </TouchableOpacity>
                  </View>
                ))}
                <View style={wz.addStepRow}>
                  <TextInput
                    style={wz.addStepInput}
                    value={newStep}
                    onChangeText={setNewStep}
                    placeholder="Thêm bước mới..."
                    placeholderTextColor="#a8b2c8"
                  />
                  <TouchableOpacity
                    style={wz.addStepBtn}
                    onPress={() => { if (newStep.trim()) { setTxngSteps([...txngSteps, newStep.trim()]); setNewStep(''); } }}
                  >
                    <Feather name="plus" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
                <View style={wz.syncPreview}>
                  <Feather name="upload-cloud" size={14} color="#2740BA" />
                  <Text style={wz.syncPreviewText}>
                    Sau khi lưu, nhấn "Đẩy lên cổng" để đồng bộ lô hàng này với {txngSteps.length} bước TXNG lên Cổng truy xuất quốc gia.
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fb' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  backBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: '700', color: '#1d2944', letterSpacing: -0.5 },
  subtitle: { fontSize: 11, color: '#6b7694', marginTop: 1 },
  syncAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#2740BA', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, height: 36 },
  syncAllText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  summaryRow: { flexDirection: 'row', paddingHorizontal: 12, gap: 8, marginBottom: 6 },
  statCard: { flex: 1, borderRadius: 12, padding: 12, alignItems: 'center' },
  statCount: { fontSize: 20, fontWeight: '700' },
  statLabel: { fontSize: 9, fontWeight: '600', textAlign: 'center', marginTop: 2 },
  apiStatus: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, marginBottom: 8 },
  apiStatusText: { fontSize: 11 },
  lotCard: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#e4e8f0', shadowColor: '#1d2944', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  lotHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  lotName: { fontSize: 13, fontWeight: '700', color: '#1d2944', lineHeight: 18 },
  lotBiz: { fontSize: 10, color: '#6b7694', marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20, marginLeft: 8 },
  statusText: { fontSize: 10, fontWeight: '600' },
  lotMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, color: '#6b7694' },
  stepRow: { gap: 4, paddingBottom: 10, alignItems: 'center' },
  step: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stepNum: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#2740BA', alignItems: 'center', justifyContent: 'center' },
  stepNumText: { fontSize: 9, fontWeight: '700', color: '#fff' },
  stepText: { fontSize: 10, color: '#34405a', maxWidth: 80 },
  lotActions: { flexDirection: 'row', gap: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f0f2f8' },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#edf0ff' },
  editBtnText: { fontSize: 12, fontWeight: '600', color: '#2740BA' },
  syncBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: 8, backgroundColor: '#E8650A' },
  syncBtnText: { fontSize: 12, fontWeight: '700', color: '#fff' },
});

const wz = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#e4e8f0', backgroundColor: '#fff' },
  title: { fontSize: 14, fontWeight: '700', color: '#1d2944', marginBottom: 6 },
  steps: { flexDirection: 'row', gap: 8 },
  stepDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#f0f2f8', alignItems: 'center', justifyContent: 'center' },
  stepDotActive: { backgroundColor: '#2740BA' },
  stepNum: { fontSize: 11, fontWeight: '700', color: '#a8b2c8' },
  stepNumActive: { fontSize: 11, fontWeight: '700', color: '#fff' },
  nextBtn: { backgroundColor: '#2740BA', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  nextText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  stepTitle: { fontSize: 14, fontWeight: '700', color: '#1d2944', marginBottom: 4 },
  stepSub: { fontSize: 11, color: '#6b7694', marginBottom: 16, lineHeight: 16 },
  fieldLabel: { fontSize: 11, fontWeight: '700', color: '#34405a', marginBottom: 8 },
  fieldInput: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e4e8f0', paddingHorizontal: 14, paddingVertical: 12, fontSize: 13, color: '#1d2944', marginBottom: 16 },
  readonlyField: { backgroundColor: '#f5f7fb', borderRadius: 12, borderWidth: 1, borderColor: '#e4e8f0', paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16 },
  readonlyText: { fontSize: 13, color: '#6b7694' },
  txngRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  txngNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#2740BA', alignItems: 'center', justifyContent: 'center' },
  txngNumText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  txngInput: { flex: 1, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#e4e8f0', paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: '#1d2944' },
  addStepRow: { flexDirection: 'row', gap: 8, marginTop: 4, marginBottom: 16 },
  addStepInput: { flex: 1, backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#e4e8f0', paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: '#1d2944' },
  addStepBtn: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#2740BA', alignItems: 'center', justifyContent: 'center' },
  syncPreview: { flexDirection: 'row', gap: 8, backgroundColor: '#f3f8ff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#c9ddf4' },
  syncPreviewText: { flex: 1, fontSize: 11, color: '#2740BA', lineHeight: 16 },
});
