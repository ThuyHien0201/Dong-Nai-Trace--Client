import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

/* ─── Mock Data ─────────────────────────────────────────────── */
const AUDIT_LOGS = [
  { id: 1, action: 'APPROVE_BUSINESS', user: 'Trần Thị Minh Anh', target: 'HTX Tân Triều', time: '2024-08-06 08:45', ip: '192.168.1.20', result: 'success' },
  { id: 2, action: 'UPDATE_PRODUCT', user: 'Lê Công Duyệt', target: 'Bưởi Tân Triều', time: '2024-08-06 07:30', ip: '192.168.1.21', result: 'success' },
  { id: 3, action: 'LOGIN_FAILED', user: 'unknown', target: 'admin', time: '2024-08-05 23:14', ip: '203.x.x.1', result: 'fail' },
  { id: 4, action: 'SYNC_PORTAL', user: 'Nguyễn Văn Thành', target: 'LOT-001', time: '2024-08-05 17:00', ip: '192.168.1.10', result: 'success' },
  { id: 5, action: 'DELETE_ACCOUNT', user: 'Nguyễn Văn Thành', target: 'test@temp.vn', time: '2024-08-05 14:22', ip: '192.168.1.10', result: 'success' },
  { id: 6, action: 'BACKUP_DATA', user: 'System', target: 'Full backup', time: '2024-08-05 02:00', ip: 'localhost', result: 'success' },
  { id: 7, action: 'CONFIG_CHANGE', user: 'Nguyễn Văn Thành', target: 'QR_MAX_SCANS', time: '2024-08-04 11:35', ip: '192.168.1.10', result: 'success' },
];

interface Config {
  key: string; label: string; value: string; type: 'text' | 'number' | 'toggle';
  description: string; enabled?: boolean;
}

const CONFIGS: Config[] = [
  { key: 'QR_MAX_SCANS', label: 'Giới hạn quét QR / ngày', value: '500', type: 'number', description: 'Số lần quét tối đa mỗi QR code trong một ngày' },
  { key: 'SESSION_TIMEOUT', label: 'Thời gian phiên đăng nhập (phút)', value: '480', type: 'number', description: 'Tự động đăng xuất sau số phút không hoạt động' },
  { key: 'MAX_FILE_SIZE', label: 'Dung lượng file tối đa (MB)', value: '10', type: 'number', description: 'Giới hạn upload file hồ sơ, chứng nhận' },
  { key: 'APPROVAL_NOTIFY', label: 'Gửi email khi phê duyệt', value: '', type: 'toggle', description: 'Tự động gửi email thông báo khi phê duyệt doanh nghiệp', enabled: true },
  { key: 'AUTO_BACKUP', label: 'Tự động sao lưu hằng ngày', value: '', type: 'toggle', description: 'Sao lưu toàn bộ dữ liệu lúc 2:00 AM mỗi ngày', enabled: true },
  { key: 'MAINTENANCE_MODE', label: 'Chế độ bảo trì', value: '', type: 'toggle', description: 'Chặn tất cả người dùng trừ quản trị viên tỉnh', enabled: false },
  { key: 'API_RATE_LIMIT', label: 'Giới hạn API (req/min)', value: '100', type: 'number', description: 'Số request API tối đa mỗi phút mỗi IP' },
];

const ACTION_LABELS: Record<string, string> = {
  APPROVE_BUSINESS: 'Phê duyệt DN',
  UPDATE_PRODUCT: 'Cập nhật SP',
  LOGIN_FAILED: 'Đăng nhập thất bại',
  SYNC_PORTAL: 'Đồng bộ portal',
  DELETE_ACCOUNT: 'Xóa tài khoản',
  BACKUP_DATA: 'Sao lưu dữ liệu',
  CONFIG_CHANGE: 'Thay đổi cấu hình',
};

const TABS = [
  { key: 'audit', label: 'Nhật ký', icon: 'list' },
  { key: 'config', label: 'Cấu hình', icon: 'settings' },
  { key: 'backup', label: 'Sao lưu', icon: 'database' },
] as const;
type Tab = typeof TABS[number]['key'];
const CONFIG_SECTIONS = ['Chung', 'Email', 'QR Code', 'API / Tích hợp'] as const;
type ConfigSection = typeof CONFIG_SECTIONS[number];

export default function SystemScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('audit');
  const [activeConfigSection, setActiveConfigSection] = useState<ConfigSection>('Chung');
  const [configs, setConfigs] = useState<Config[]>(CONFIGS);
  const [backingUp, setBackingUp] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const handleToggle = (key: string) => {
    setConfigs(prev => prev.map(c => c.key === key ? { ...c, enabled: !c.enabled } : c));
  };

  const handleConfigChange = (key: string, value: string) => {
    setConfigs(prev => prev.map(c => c.key === key ? { ...c, value } : c));
  };

  const handleBackup = () => {
    setBackingUp(true);
    setTimeout(() => {
      setBackingUp(false);
      Alert.alert('Sao lưu thành công', 'File sao lưu đã được tạo: backup_20240806_093000.zip (245 MB)');
    }, 2000);
  };

  const handleRestore = () => {
    Alert.alert(
      'Khôi phục dữ liệu',
      'Hành động này sẽ thay thế toàn bộ dữ liệu hiện tại. Bạn có chắc chắn?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận khôi phục',
          style: 'destructive',
          onPress: () => {
            setRestoring(true);
            setTimeout(() => {
              setRestoring(false);
              Alert.alert('Khôi phục thành công', 'Hệ thống đã được khôi phục từ bản sao lưu gần nhất.');
            }, 3000);
          },
        },
      ],
    );
  };

  const BACKUPS = [
    { id: 'BK001', date: '2024-08-06 02:00', size: '245 MB', type: 'Tự động', status: 'success' },
    { id: 'BK002', date: '2024-08-05 02:00', size: '240 MB', type: 'Tự động', status: 'success' },
    { id: 'BK003', date: '2024-08-04 14:30', size: '238 MB', type: 'Thủ công', status: 'success' },
    { id: 'BK004', date: '2024-08-04 02:00', size: '237 MB', type: 'Tự động', status: 'success' },
    { id: 'BK005', date: '2024-08-03 02:00', size: '235 MB', type: 'Tự động', status: 'fail' },
  ];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Feather name="arrow-left" size={20} color="#1d2944" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Hệ thống</Text>
          <Text style={s.subtitle}>Nhật ký, cấu hình và sao lưu</Text>
        </View>
        {activeTab === 'config' && (
          <TouchableOpacity style={s.saveConfigBtn} onPress={() => Alert.alert('Đã lưu', 'Cấu hình hệ thống đã được cập nhật.')}>
            <Text style={s.saveConfigText}>Lưu</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabsRow} style={s.tabsScroll}>
        {TABS.map(t => (
          <TouchableOpacity key={t.key} style={[s.tab, activeTab === t.key && s.tabActive]} onPress={() => setActiveTab(t.key)}>
            <Feather name={t.icon as any} size={13} color={activeTab === t.key ? '#2740BA' : '#6b7694'} />
            <Text style={[s.tabText, activeTab === t.key && s.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Audit Log Tab */}
      {activeTab === 'audit' && (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
          <View style={s.auditInfo}>
            <Feather name="shield" size={13} color="#2740BA" />
            <Text style={s.auditInfoText}>{AUDIT_LOGS.length} sự kiện gần nhất được ghi lại</Text>
          </View>
          {AUDIT_LOGS.map(log => (
            <View key={log.id} style={s.logCard}>
              <View style={s.logHeader}>
                <View style={[s.logAction, { backgroundColor: log.result === 'fail' ? '#fef0f0' : '#edf0ff' }]}>
                  <Text style={[s.logActionText, { color: log.result === 'fail' ? '#c0392b' : '#2740BA' }]}>
                    {ACTION_LABELS[log.action] || log.action}
                  </Text>
                </View>
                <View style={[s.logResult, { backgroundColor: log.result === 'fail' ? '#fef0f0' : '#e8f5ed' }]}>
                  <Feather name={log.result === 'fail' ? 'x-circle' : 'check-circle'} size={11} color={log.result === 'fail' ? '#c0392b' : '#1f7a45'} />
                  <Text style={[s.logResultText, { color: log.result === 'fail' ? '#c0392b' : '#1f7a45' }]}>
                    {log.result === 'fail' ? 'Thất bại' : 'Thành công'}
                  </Text>
                </View>
              </View>
              <Text style={s.logTarget}>{log.target}</Text>
              <View style={s.logMeta}>
                <Feather name="user" size={10} color="#a8b2c8" />
                <Text style={s.logMetaText}>{log.user}</Text>
                <Feather name="clock" size={10} color="#a8b2c8" style={{ marginLeft: 10 }} />
                <Text style={s.logMetaText}>{log.time}</Text>
                <Feather name="monitor" size={10} color="#a8b2c8" style={{ marginLeft: 10 }} />
                <Text style={s.logMetaText}>{log.ip}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Config Tab */}
      {activeTab === 'config' && (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.configTabsRow} style={s.configTabsScroll}>
            {CONFIG_SECTIONS.map(section => (
              <TouchableOpacity
                key={section}
                style={[s.configTab, activeConfigSection === section && s.configTabActive]}
                onPress={() => setActiveConfigSection(section)}
              >
                <Text style={[s.configTabText, activeConfigSection === section && s.configTabTextActive]}>{section}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={s.configSectionCard}>
            <Text style={s.configSectionTitle}>Cấu hình {activeConfigSection.toLowerCase()}</Text>
            {activeConfigSection === 'Chung' && (
              <>
                {[
                  ['Tên hệ thống', configs.find(c => c.key === 'system_name')?.value ?? 'Đồng Nai Trace', 'text'],
                  ['Tên đơn vị quản lý', 'Sở Khoa học và Công nghệ tỉnh Đồng Nai', 'text'],
                  ['Múi giờ', 'Asia/Ho_Chi_Minh (UTC+7)', 'text'],
                  ['Số bản ghi mỗi trang', configs.find(c => c.key === 'page_size')?.value ?? '20', 'number'],
                  ['Thông báo bảo trì', 'Để trống nếu không có thông báo', 'textarea'],
                ].map(([label, value, type]) => (
                  <View key={label} style={s.configField}>
                    <Text style={s.configLabel}>{label}</Text>
                    <TextInput
                      style={[s.configInput, type === 'textarea' && s.configTextarea]}
                      value={value}
                      onChangeText={nextValue => {
                        if (label === 'Tên hệ thống') handleConfigChange('system_name', nextValue);
                        if (label === 'Số bản ghi mỗi trang') handleConfigChange('page_size', nextValue);
                      }}
                      placeholder={value}
                      placeholderTextColor="#a8b2c8"
                      keyboardType={type === 'number' ? 'numeric' : 'default'}
                      multiline={type === 'textarea'}
                      textAlignVertical={type === 'textarea' ? 'top' : 'center'}
                    />
                  </View>
                ))}
                {configs.filter(cfg => cfg.type === 'toggle').map(cfg => (
                  <View key={cfg.key} style={s.toggleConfigCard}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.configLabel}>{cfg.label}</Text>
                      <Text style={s.configDesc}>{cfg.description}</Text>
                    </View>
                    <Switch value={cfg.enabled} onValueChange={() => handleToggle(cfg.key)} trackColor={{ false: '#e4e8f0', true: '#2740BA' }} thumbColor="#fff" />
                  </View>
                ))}
              </>
            )}
            {activeConfigSection === 'Email' && [
              ['SMTP Host', 'smtp.gmail.com'], ['SMTP Port', '587'], ['Email người gửi', 'noreply@dongnaitrace.vn'], ['Tên người gửi', 'Đồng Nai Trace'], ['Mật khẩu ứng dụng', '••••••••••••'],
            ].map(([label, value]) => (
              <View key={label} style={s.configField}>
                <Text style={s.configLabel}>{label}</Text>
                <TextInput style={s.configInput} defaultValue={value} placeholderTextColor="#a8b2c8" secureTextEntry={label === 'Mật khẩu ứng dụng'} />
              </View>
            ))}
            {activeConfigSection === 'QR Code' && [
              ['Kích thước QR (px)', '256'], ['Màu nền', '#FFFFFF'], ['Màu mã', '#000000'], ['URL tiền tố truy xuất', 'https://trace.dongnai.gov.vn/verify/'], ['Thời hạn hiệu lực (ngày)', '365'],
            ].map(([label, value]) => (
              <View key={label} style={s.configField}>
                <Text style={s.configLabel}>{label}</Text>
                <TextInput style={s.configInput} defaultValue={value} placeholderTextColor="#a8b2c8" />
              </View>
            ))}
            {activeConfigSection === 'API / Tích hợp' && [
              ['API Key hệ thống', 'dk-xxxxxxxx-xxxx-xxxx'], ['Webhook URL thông báo', 'https://your-service.com/webhook'], ['Google Maps API Key', 'AIza...'], ['Token VNPT/Viettel SMS', 'Bearer xxx...'],
            ].map(([label, value]) => (
              <View key={label} style={s.configField}>
                <Text style={s.configLabel}>{label}</Text>
                <TextInput style={[s.configInput, s.monoInput]} defaultValue={value} placeholderTextColor="#a8b2c8" autoCapitalize="none" />
              </View>
            ))}
          </View>
          <TouchableOpacity style={s.saveConfigButton} onPress={() => Alert.alert('Đã lưu', 'Cấu hình hệ thống đã được cập nhật.')}>
            <Feather name="save" size={15} color="#fff" />
            <Text style={s.saveConfigButtonText}>Lưu cấu hình</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Backup Tab */}
      {activeTab === 'backup' && (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
          {/* Action buttons */}
          <View style={s.backupActions}>
            <TouchableOpacity style={[s.backupBtn, backingUp && { opacity: 0.7 }]} onPress={handleBackup} disabled={backingUp}>
              <Feather name="upload" size={15} color="#fff" />
              <Text style={s.backupBtnText}>{backingUp ? 'Đang sao lưu...' : 'Sao lưu ngay'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.restoreBtn, restoring && { opacity: 0.7 }]} onPress={handleRestore} disabled={restoring}>
              <Feather name="download" size={15} color="#c0392b" />
              <Text style={s.restoreBtnText}>{restoring ? 'Đang khôi phục...' : 'Khôi phục'}</Text>
            </TouchableOpacity>
          </View>
          {/* Stats */}
          <View style={s.storageCard}>
            <Text style={s.storageTitle}>Dung lượng lưu trữ</Text>
            <View style={s.storageBar}>
              <View style={[s.storageUsed, { flex: 0.65 }]} />
              <View style={{ flex: 0.35, backgroundColor: '#e4e8f0' }} />
            </View>
            <View style={s.storageStats}>
              <Text style={s.storageText}>Đã dùng: 1.2 GB</Text>
              <Text style={s.storageText}>Còn lại: 1.8 GB / 3 GB</Text>
            </View>
          </View>
          {/* Backup list */}
          <Text style={s.backupListTitle}>Lịch sử sao lưu</Text>
          {BACKUPS.map(bk => (
            <View key={bk.id} style={s.backupCard}>
              <View style={s.backupIcon}>
                <Feather name="archive" size={18} color={bk.status === 'fail' ? '#c0392b' : '#2740BA'} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={s.backupCardHeader}>
                  <Text style={s.backupDate}>{bk.date}</Text>
                  <View style={[s.backupTypeBadge, { backgroundColor: bk.type === 'Tự động' ? '#edf0ff' : '#fff4ed' }]}>
                    <Text style={[s.backupTypeText, { color: bk.type === 'Tự động' ? '#2740BA' : '#E8650A' }]}>{bk.type}</Text>
                  </View>
                </View>
                <View style={s.backupMeta}>
                  <Feather name="hard-drive" size={10} color="#a8b2c8" />
                  <Text style={s.backupSize}>{bk.size}</Text>
                  <View style={[s.backupStatus, { backgroundColor: bk.status === 'fail' ? '#fef0f0' : '#e8f5ed' }]}>
                    <Text style={[s.backupStatusText, { color: bk.status === 'fail' ? '#c0392b' : '#1f7a45' }]}>
                      {bk.status === 'fail' ? 'Thất bại' : 'Thành công'}
                    </Text>
                  </View>
                </View>
              </View>
              {bk.status === 'success' && (
                <TouchableOpacity style={s.backupDlBtn}>
                  <Feather name="download" size={15} color="#2740BA" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fb' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  backBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: '700', color: '#1d2944', letterSpacing: -0.5 },
  subtitle: { fontSize: 11, color: '#6b7694', marginTop: 1 },
  saveConfigBtn: { backgroundColor: '#2740BA', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  saveConfigText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  tabsRow: { paddingHorizontal: 12, paddingVertical: 6, gap: 8, alignItems: 'center' },
  tabsScroll: { height: 52, flexGrow: 0 },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: '#e4e8f0', backgroundColor: '#fff' },
  tabActive: { borderColor: '#2740BA', backgroundColor: '#edf0ff' },
  tabText: { fontSize: 12, color: '#6b7694', fontWeight: '500' },
  tabTextActive: { color: '#2740BA', fontWeight: '700' },
  auditInfo: { flexDirection: 'row', gap: 8, backgroundColor: '#f3f8ff', borderRadius: 10, padding: 10, marginBottom: 12, borderWidth: 1, borderColor: '#c9ddf4' },
  auditInfoText: { flex: 1, fontSize: 11, color: '#2740BA' },
  logCard: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#e4e8f0' },
  logHeader: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  logAction: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  logActionText: { fontSize: 10, fontWeight: '700' },
  logResult: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  logResultText: { fontSize: 10, fontWeight: '600' },
  logTarget: { fontSize: 12, fontWeight: '600', color: '#1d2944', marginBottom: 6 },
  logMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  logMetaText: { fontSize: 10, color: '#a8b2c8' },
  configCard: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#e4e8f0' },
  configHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  configLabel: { fontSize: 13, fontWeight: '600', color: '#1d2944', marginBottom: 2 },
  configDesc: { fontSize: 10, color: '#6b7694', lineHeight: 14 },
  configInput: { backgroundColor: '#f9fafb', borderRadius: 10, borderWidth: 1, borderColor: '#e4e8f0', paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: '#1d2944' },
  configTabsScroll: { height: 44, flexGrow: 0, marginBottom: 12 },
  configTabsRow: { gap: 7, alignItems: 'center' },
  configTab: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e4e8f0' },
  configTabActive: { backgroundColor: '#edf0ff', borderColor: '#2740BA' },
  configTabText: { fontSize: 10, fontWeight: '600', color: '#6b7694' },
  configTabTextActive: { color: '#2740BA', fontWeight: '700' },
  configSectionCard: { backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#e4e8f0' },
  configSectionTitle: { fontSize: 13, fontWeight: '700', color: '#1d2944', marginBottom: 14 },
  configField: { marginBottom: 13 },
  configTextarea: { minHeight: 76, paddingTop: 11 },
  monoInput: { fontFamily: 'monospace' },
  toggleConfigCard: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 12, marginTop: 2, borderTopWidth: 1, borderTopColor: '#f0f2f8' },
  saveConfigButton: { height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, backgroundColor: '#E8650A', marginTop: 14 },
  saveConfigButtonText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  backupActions: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  backupBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 48, borderRadius: 12, backgroundColor: '#2740BA' },
  backupBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  restoreBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 48, borderRadius: 12, borderWidth: 1.5, borderColor: '#c0392b', backgroundColor: '#fef0f0' },
  restoreBtnText: { fontSize: 13, fontWeight: '700', color: '#c0392b' },
  storageCard: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#e4e8f0' },
  storageTitle: { fontSize: 12, fontWeight: '700', color: '#1d2944', marginBottom: 10 },
  storageBar: { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  storageUsed: { backgroundColor: '#2740BA' },
  storageStats: { flexDirection: 'row', justifyContent: 'space-between' },
  storageText: { fontSize: 11, color: '#6b7694' },
  backupListTitle: { fontSize: 12, fontWeight: '700', color: '#6b7694', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  backupCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#e4e8f0' },
  backupIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#edf0ff', alignItems: 'center', justifyContent: 'center' },
  backupCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  backupDate: { fontSize: 12, fontWeight: '600', color: '#1d2944', flex: 1 },
  backupTypeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  backupTypeText: { fontSize: 9, fontWeight: '700' },
  backupMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  backupSize: { fontSize: 11, color: '#6b7694', flex: 1 },
  backupStatus: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  backupStatusText: { fontSize: 10, fontWeight: '600' },
  backupDlBtn: { padding: 8 },
});
