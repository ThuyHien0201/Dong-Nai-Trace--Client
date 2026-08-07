import React, { useMemo, useState } from 'react';
import {
  Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type TabId = 'national' | 'ministries' | 'solutions' | 'logs';
type ConnectionStatus = 'active' | 'error' | 'warning' | 'inactive';

type Connection = {
  id: string;
  name: string;
  org: string;
  endpoint: string;
  protocol: string;
  authType: string;
  status: ConnectionStatus;
  lastSync: string;
  recordsOut: number;
  recordsIn: number;
};

const TABS: { id: TabId; label: string; icon: React.ComponentProps<typeof Feather>['name'] }[] = [
  { id: 'national', label: 'Cổng TXNG Quốc gia', icon: 'globe' },
  { id: 'ministries', label: 'Bộ ban ngành', icon: 'link-2' },
  { id: 'solutions', label: 'Giải pháp bên thứ ba', icon: 'tool' },
  { id: 'logs', label: 'Nhật ký kết nối', icon: 'file-text' },
];

const CONNECTIONS: Record<'national' | 'ministries' | 'solutions', Connection[]> = {
  national: [
    {
      id: 'NAT-001',
      name: 'Cổng Truy xuất nguồn gốc Quốc gia',
      org: 'check.gov.vn — Cục Xúc tiến thương mại, Bộ Công Thương',
      endpoint: 'https://check.gov.vn/api/v1',
      protocol: 'REST / JSON',
      authType: 'OAuth 2.0',
      status: 'active',
      lastSync: '07/08/2026 08:42',
      recordsOut: 1842,
      recordsIn: 124,
    },
  ],
  ministries: [
    {
      id: 'MST-001',
      name: 'Bộ Nông nghiệp và Môi trường',
      org: 'Hệ thống cơ sở dữ liệu nông nghiệp quốc gia',
      endpoint: 'https://data.mard.gov.vn/trace',
      protocol: 'REST / JSON',
      authType: 'API Key',
      status: 'active',
      lastSync: '07/08/2026 08:30',
      recordsOut: 482,
      recordsIn: 32,
    },
    {
      id: 'MST-002',
      name: 'Cơ sở dữ liệu sản phẩm OCOP',
      org: 'Văn phòng Điều phối Nông thôn mới Trung ương',
      endpoint: 'https://ocop.gov.vn/connect',
      protocol: 'REST / JSON',
      authType: 'OAuth 2.0',
      status: 'warning',
      lastSync: '06/08/2026 16:15',
      recordsOut: 118,
      recordsIn: 8,
    },
  ],
  solutions: [
    {
      id: 'SOL-001',
      name: 'TraceMark Technology',
      org: 'Nền tảng giải pháp truy xuất nguồn gốc',
      endpoint: 'https://api.tracemark.vn/v2',
      protocol: 'REST / JSON',
      authType: 'API Key',
      status: 'active',
      lastSync: '07/08/2026 08:40',
      recordsOut: 1260,
      recordsIn: 64,
    },
    {
      id: 'SOL-002',
      name: 'Đơn vị kiểm nghiệm chất lượng',
      org: 'Kết nối chứng nhận và kết quả kiểm nghiệm',
      endpoint: 'https://lab.dongnai.vn/api',
      protocol: 'REST / JSON',
      authType: 'HMAC',
      status: 'inactive',
      lastSync: '05/08/2026 10:20',
      recordsOut: 36,
      recordsIn: 0,
    },
  ],
};

const LOGS = [
  { time: '07/08/2026 08:42', target: 'Cổng TXNG Quốc gia', direction: 'out', records: 1842, status: 'success', message: 'Đồng bộ sản phẩm thành công' },
  { time: '07/08/2026 08:30', target: 'Bộ Nông nghiệp và Môi trường', direction: 'in', records: 32, status: 'success', message: 'Nhận dữ liệu cập nhật' },
  { time: '06/08/2026 16:15', target: 'Cơ sở dữ liệu sản phẩm OCOP', direction: 'out', records: 118, status: 'partial', message: 'Hoàn thành một phần, còn 3 bản ghi lỗi' },
  { time: '06/08/2026 14:05', target: 'TraceMark Technology', direction: 'out', records: 1260, status: 'success', message: 'Đẩy dữ liệu truy xuất thành công' },
  { time: '05/08/2026 10:20', target: 'Đơn vị kiểm nghiệm chất lượng', direction: 'out', records: 36, status: 'error', message: 'Không thể kết nối endpoint' },
];

const STATUS_META: Record<ConnectionStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Đang hoạt động', color: '#1f7a45', bg: '#e8f5ed' },
  warning: { label: 'Cần kiểm tra', color: '#9a6116', bg: '#fff4d4' },
  error: { label: 'Lỗi kết nối', color: '#c0392b', bg: '#fef0f0' },
  inactive: { label: 'Chưa kích hoạt', color: '#6b7694', bg: '#f0f2f8' },
};

function ConnectionCard({ connection }: { connection: Connection }) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState(connection.status);
  const meta = STATUS_META[status];

  const testConnection = () => {
    setStatus('active');
    Alert.alert('Kết nối thành công', `${connection.name} đang phản hồi bình thường.`);
  };

  return (
    <View style={s.card}>
      <View style={s.cardTop}>
        <View style={[s.connectionIcon, { backgroundColor: meta.bg }]}>
          <Feather name={status === 'active' ? 'wifi' : 'wifi-off'} size={18} color={meta.color} />
        </View>
        <View style={s.cardInfo}>
          <Text style={s.cardTitle}>{connection.name}</Text>
          <Text style={s.cardOrg}>{connection.org}</Text>
        </View>
        <View style={[s.statusBadge, { backgroundColor: meta.bg }]}>
          <View style={[s.statusDot, { backgroundColor: meta.color }]} />
          <Text style={[s.statusText, { color: meta.color }]}>{meta.label}</Text>
        </View>
      </View>
      <View style={s.metrics}>
        <View><Text style={s.metricLabel}>Lần đồng bộ cuối</Text><Text style={s.metricValue}>{connection.lastSync}</Text></View>
        <View><Text style={s.metricLabel}>Đã gửi</Text><Text style={s.metricValue}>{connection.recordsOut.toLocaleString('vi-VN')}</Text></View>
        <View><Text style={s.metricLabel}>Đã nhận</Text><Text style={s.metricValue}>{connection.recordsIn.toLocaleString('vi-VN')}</Text></View>
      </View>
      {expanded && (
        <View style={s.details}>
          <View><Text style={s.metricLabel}>Endpoint</Text><Text style={s.mono}>{connection.endpoint}</Text></View>
          <View style={s.detailGrid}>
            <View><Text style={s.metricLabel}>Giao thức</Text><Text style={s.metricValue}>{connection.protocol}</Text></View>
            <View><Text style={s.metricLabel}>Xác thực</Text><Text style={s.metricValue}>{connection.authType}</Text></View>
            <View><Text style={s.metricLabel}>Timeout</Text><Text style={s.metricValue}>30 giây</Text></View>
            <View><Text style={s.metricLabel}>Retry</Text><Text style={s.metricValue}>3 lần / 5 phút</Text></View>
          </View>
        </View>
      )}
      <View style={s.cardActions}>
        <TouchableOpacity onPress={() => setExpanded(value => !value)} style={s.textAction}>
          <Text style={s.textActionLabel}>{expanded ? 'Thu gọn' : 'Chi tiết'}</Text>
          <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color="#6b7694" />
        </TouchableOpacity>
        <TouchableOpacity onPress={testConnection} style={s.outlineButton}>
          <Feather name="activity" size={13} color="#2740BA" />
          <Text style={s.outlineButtonText}>Test kết nối</Text>
        </TouchableOpacity>
        {status === 'active' && (
          <TouchableOpacity
            onPress={() => Alert.alert('Đã bắt đầu', `Đang đồng bộ dữ liệu với ${connection.name}.`)}
            style={s.primaryButton}
          >
            <Feather name="refresh-cw" size={13} color="#fff" />
            <Text style={s.primaryButtonText}>Đồng bộ</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function ConnectionsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('national');
  const connections = useMemo(() => activeTab === 'logs' ? [] : CONNECTIONS[activeTab], [activeTab]);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backButton}>
          <Feather name="arrow-left" size={20} color="#1d2944" />
        </TouchableOpacity>
        <View style={s.headerInfo}>
          <Text style={s.title}>Kết nối hệ thống</Text>
          <Text style={s.subtitle}>Cấu hình và theo dõi các kết nối tích hợp</Text>
        </View>
        <TouchableOpacity onPress={() => Alert.alert('Thêm kết nối', 'Tính năng cấu hình kết nối mới sẽ mở trong bước tiếp theo.')} style={s.headerButton}>
          <Feather name="plus" size={17} color="#2740BA" />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabScroll} contentContainerStyle={s.tabRow}>
        {TABS.map(tab => (
          <TouchableOpacity key={tab.id} onPress={() => setActiveTab(tab.id)} style={[s.tab, activeTab === tab.id && s.tabActive]}>
            <Feather name={tab.icon} size={14} color={activeTab === tab.id ? '#2740BA' : '#6b7694'} />
            <Text style={[s.tabText, activeTab === tab.id && s.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        {activeTab === 'logs' ? (
          <View style={s.logCard}>
            {LOGS.map((log, index) => (
              <View key={`${log.time}-${index}`} style={s.logRow}>
                <View style={[s.logIcon, { backgroundColor: log.status === 'error' ? '#fef0f0' : log.status === 'partial' ? '#fff4d4' : '#e8f5ed' }]}>
                  <Feather name={log.status === 'error' ? 'alert-circle' : 'check-circle'} size={15} color={log.status === 'error' ? '#c0392b' : log.status === 'partial' ? '#9a6116' : '#1f7a45'} />
                </View>
                <View style={s.logInfo}>
                  <Text style={s.logTarget}>{log.target}</Text>
                  <Text style={s.logMessage}>{log.message} · {log.records.toLocaleString('vi-VN')} bản ghi</Text>
                  <Text style={s.logTime}>{log.time} · {log.direction === 'out' ? 'Đẩy đi' : 'Nhận về'}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <>
            <View style={s.summary}>
              <View style={s.summaryIcon}><Feather name={TABS.find(tab => tab.id === activeTab)?.icon ?? 'link'} size={18} color="#2740BA" /></View>
              <View style={s.summaryText}>
                <Text style={s.summaryTitle}>{activeTab === 'national' ? 'Cổng Truy xuất nguồn gốc Quốc gia' : activeTab === 'ministries' ? 'Kết nối bộ, ban, ngành' : 'Đối tác giải pháp bên thứ ba'}</Text>
                <Text style={s.summarySub}>{connections.filter(connection => connection.status === 'active').length}/{connections.length} kết nối đang hoạt động</Text>
              </View>
            </View>
            {connections.map(connection => <ConnectionCard key={connection.id} connection={connection} />)}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fb' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e4e8f0' },
  backButton: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e4e8f0' },
  headerInfo: { flex: 1, minWidth: 0 },
  title: { fontSize: 18, fontWeight: '700', color: '#1d2944', letterSpacing: -0.5 },
  subtitle: { fontSize: 10, color: '#6b7694', marginTop: 2 },
  headerButton: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#edf0ff' },
  tabScroll: { flexGrow: 0, maxHeight: 52, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e4e8f0' },
  tabRow: { paddingHorizontal: 12, gap: 6, alignItems: 'center' },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 14, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: '#2740BA' },
  tabText: { fontSize: 10, color: '#6b7694', fontWeight: '600' },
  tabTextActive: { color: '#2740BA' },
  content: { padding: 16, paddingBottom: 32 },
  summary: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#edf0ff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#ccd4ff', marginBottom: 14 },
  summaryIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  summaryText: { flex: 1 },
  summaryTitle: { fontSize: 13, fontWeight: '700', color: '#1d2944' },
  summarySub: { fontSize: 11, color: '#6b7694', marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e4e8f0', marginBottom: 14, overflow: 'hidden' },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, gap: 10 },
  connectionIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1, minWidth: 0 },
  cardTitle: { fontSize: 13, fontWeight: '700', color: '#1d2944', lineHeight: 18 },
  cardOrg: { fontSize: 10, color: '#6b7694', lineHeight: 15, marginTop: 3 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 7, paddingVertical: 5, borderRadius: 20, maxWidth: 104 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 8, fontWeight: '700' },
  metrics: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, paddingHorizontal: 16, paddingBottom: 14 },
  metricLabel: { fontSize: 9, color: '#8896b0', marginBottom: 4 },
  metricValue: { fontSize: 10, color: '#25304b', fontWeight: '600' },
  details: { marginHorizontal: 16, marginBottom: 14, backgroundColor: '#f7f8fd', borderRadius: 12, padding: 12, gap: 12 },
  mono: { fontSize: 10, color: '#2740BA', fontFamily: 'monospace', marginTop: 4 },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: 7, borderTopWidth: 1, borderTopColor: '#f0f2f8', paddingHorizontal: 12, paddingVertical: 10 },
  textAction: { flexDirection: 'row', alignItems: 'center', gap: 3, marginRight: 'auto' },
  textActionLabel: { fontSize: 10, color: '#6b7694', fontWeight: '600' },
  outlineButton: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: '#dce2ee', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 7 },
  outlineButtonText: { fontSize: 9, color: '#2740BA', fontWeight: '700' },
  primaryButton: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#2740BA', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 8 },
  primaryButtonText: { fontSize: 9, color: '#fff', fontWeight: '700' },
  logCard: { backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 14, borderWidth: 1, borderColor: '#e4e8f0' },
  logRow: { flexDirection: 'row', gap: 10, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f0f2f8' },
  logIcon: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  logInfo: { flex: 1 },
  logTarget: { fontSize: 12, fontWeight: '700', color: '#1d2944' },
  logMessage: { fontSize: 10, color: '#34405a', marginTop: 3, lineHeight: 15 },
  logTime: { fontSize: 9, color: '#a8b2c8', marginTop: 3 },
});