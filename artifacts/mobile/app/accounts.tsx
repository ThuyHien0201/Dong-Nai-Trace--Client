import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, Alert, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

/* ─── Mock Data ─────────────────────────────────────────────── */
interface Account {
  id: string; name: string; email: string; role: string; status: 'active' | 'locked';
  lastLogin: string; createdAt: string; permissions: string[];
}

const ROLES = ['Tất cả', 'Quản trị tỉnh', 'Quản trị huyện', 'Kiểm duyệt viên', 'Nhân viên xem'];
const PERMISSIONS_LIST = [
  'Xem danh sách doanh nghiệp', 'Thêm/Sửa doanh nghiệp', 'Phê duyệt doanh nghiệp',
  'Xem sản phẩm', 'Thêm/Sửa sản phẩm', 'Phê duyệt sản phẩm',
  'Xem báo cáo', 'Xuất dữ liệu', 'Quản lý tài khoản',
  'Cấu hình hệ thống', 'Đồng bộ dữ liệu', 'Quản lý nội dung',
];

const ACCOUNTS: Account[] = [
  { id: 'AC001', name: 'Nguyễn Văn Thành', email: 'nvthanh@dongnai.gov.vn', role: 'Quản trị tỉnh', status: 'active', lastLogin: '2024-08-06 08:30', createdAt: '2024-01-01', permissions: PERMISSIONS_LIST },
  { id: 'AC002', name: 'Trần Thị Minh Anh', email: 'ttmanh@dongnai.gov.vn', role: 'Quản trị huyện', status: 'active', lastLogin: '2024-08-05 14:20', createdAt: '2024-02-15', permissions: PERMISSIONS_LIST.slice(0, 8) },
  { id: 'AC003', name: 'Lê Công Duyệt', email: 'lcduyệt@dongnai.gov.vn', role: 'Kiểm duyệt viên', status: 'active', lastLogin: '2024-08-06 09:15', createdAt: '2024-03-01', permissions: PERMISSIONS_LIST.slice(0, 6) },
  { id: 'AC004', name: 'Phạm Thị Hoa', email: 'pthoa@dongnai.gov.vn', role: 'Kiểm duyệt viên', status: 'active', lastLogin: '2024-08-04 16:45', createdAt: '2024-03-15', permissions: PERMISSIONS_LIST.slice(0, 6) },
  { id: 'AC005', name: 'Võ Văn Bình', email: 'vvbinh@dongnai.gov.vn', role: 'Nhân viên xem', status: 'locked', lastLogin: '2024-07-20 11:00', createdAt: '2024-04-01', permissions: PERMISSIONS_LIST.slice(0, 2) },
  { id: 'AC006', name: 'Đặng Minh Tú', email: 'dmtu@dongnai.gov.vn', role: 'Quản trị huyện', status: 'active', lastLogin: '2024-08-06 07:50', createdAt: '2024-05-10', permissions: PERMISSIONS_LIST.slice(0, 9) },
];

const ROLE_COLOR: Record<string, { bg: string; text: string }> = {
  'Quản trị tỉnh': { bg: '#edf0ff', text: '#2740BA' },
  'Quản trị huyện': { bg: '#f4f0ff', text: '#7c3aed' },
  'Kiểm duyệt viên': { bg: '#e8f5ed', text: '#1f7a45' },
  'Nhân viên xem': { bg: '#f0f2f8', text: '#6b7694' },
};

export default function AccountsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('Tất cả');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showPermMatrix, setShowPermMatrix] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState(ROLES[1]);
  const [newPass, setNewPass] = useState('');

  const filtered = useMemo(() => {
    return ACCOUNTS.filter(a => {
      if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.email.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedRole !== 'Tất cả' && a.role !== selectedRole) return false;
      return true;
    });
  }, [search, selectedRole]);

  const handleAdd = () => {
    if (!newName.trim() || !newEmail.trim()) { Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.'); return; }
    Alert.alert('Thành công', `Tài khoản ${newName} đã được tạo.`);
    setShowAdd(false); setNewName(''); setNewEmail(''); setNewPass('');
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Feather name="arrow-left" size={20} color="#1d2944" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Quản lý tài khoản</Text>
          <Text style={s.subtitle}>{ACCOUNTS.length} tài khoản hệ thống</Text>
        </View>
        <View style={s.headerBtns}>
          <TouchableOpacity style={s.matrixBtn} onPress={() => setShowPermMatrix(true)}>
            <Feather name="grid" size={14} color="#6b7694" />
          </TouchableOpacity>
          <TouchableOpacity style={s.addBtn} onPress={() => setShowAdd(true)}>
            <Feather name="user-plus" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={s.searchRow}>
        <Feather name="search" size={15} color="#a8b2c8" style={{ marginRight: 8 }} />
        <TextInput style={s.searchInput} value={search} onChangeText={setSearch} placeholder="Tìm tên, email..." placeholderTextColor="#a8b2c8" />
        {!!search && <TouchableOpacity onPress={() => setSearch('')}><Feather name="x" size={15} color="#a8b2c8" /></TouchableOpacity>}
      </View>

      {/* Role filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips} style={{ maxHeight: 44, flexGrow: 0 }}>
        {ROLES.map(r => (
          <TouchableOpacity key={r} style={[s.chip, selectedRole === r && s.chipActive]} onPress={() => setSelectedRole(r)}>
            <Text style={[s.chipText, selectedRole === r && s.chipTextActive]}>{r}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={a => a.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: acc }) => {
          const rc = ROLE_COLOR[acc.role] || { bg: '#f0f2f8', text: '#6b7694' };
          return (
            <TouchableOpacity style={s.card} onPress={() => setSelectedAccount(acc)} activeOpacity={0.85}>
              <View style={s.cardHeader}>
                <View style={s.avatar}>
                  <Text style={s.avatarText}>{acc.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.cardName}>{acc.name}</Text>
                  <Text style={s.cardEmail}>{acc.email}</Text>
                </View>
                <View style={[s.statusDot, { backgroundColor: acc.status === 'active' ? '#1f7a45' : '#c0392b' }]} />
              </View>
              <View style={s.cardMeta}>
                <View style={[s.roleBadge, { backgroundColor: rc.bg }]}>
                  <Text style={[s.roleText, { color: rc.text }]}>{acc.role}</Text>
                </View>
                <Text style={s.lastLogin}>Đăng nhập: {acc.lastLogin}</Text>
              </View>
              <View style={s.cardActions}>
                <TouchableOpacity style={s.actionBtn} onPress={() => setSelectedAccount(acc)}>
                  <Feather name="edit-2" size={13} color="#2740BA" />
                  <Text style={s.actionText}>Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.actionBtn} onPress={() => Alert.alert('Đặt lại mật khẩu', `Bạn có muốn đặt lại mật khẩu cho ${acc.name}?`, [{ text: 'Hủy' }, { text: 'Xác nhận', onPress: () => Alert.alert('Thành công', 'Mật khẩu đã được đặt lại.') }])}>
                  <Feather name="key" size={13} color="#E8650A" />
                  <Text style={[s.actionText, { color: '#E8650A' }]}>Reset MK</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.actionBtn, { backgroundColor: '#fef0f0' }]} onPress={() => Alert.alert(acc.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa', `Bạn có chắc muốn ${acc.status === 'active' ? 'khóa' : 'mở khóa'} ${acc.name}?`, [{ text: 'Hủy' }, { text: 'Xác nhận', style: 'destructive' }])}>
                  <Feather name={acc.status === 'active' ? 'lock' : 'unlock'} size={13} color="#c0392b" />
                  <Text style={[s.actionText, { color: '#c0392b' }]}>{acc.status === 'active' ? 'Khóa' : 'Mở'}</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Feather name="users" size={36} color="#d9dce9" />
            <Text style={{ fontSize: 13, color: '#6b7694', marginTop: 10 }}>Không tìm thấy tài khoản</Text>
          </View>
        }
      />

      {/* Add Account Modal */}
      <Modal visible={showAdd} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f7fb' }} edges={['top']}>
          <View style={m.header}>
            <TouchableOpacity onPress={() => setShowAdd(false)}><Feather name="x" size={22} color="#1d2944" /></TouchableOpacity>
            <Text style={m.title}>Thêm tài khoản mới</Text>
            <TouchableOpacity style={m.saveBtn} onPress={handleAdd}><Text style={m.saveBtnText}>Tạo</Text></TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            {([
              { label: 'Họ và tên *', value: newName, setter: setNewName, placeholder: 'Nguyễn Văn A' },
              { label: 'Email *', value: newEmail, setter: setNewEmail, placeholder: 'email@dongnai.gov.vn' },
              { label: 'Mật khẩu tạm thời', value: newPass, setter: setNewPass, placeholder: 'Ít nhất 8 ký tự', secure: true },
            ] as any[]).map((f, i) => (
              <View key={i} style={{ marginBottom: 16 }}>
                <Text style={m.fieldLabel}>{f.label}</Text>
                <TextInput
                  style={m.fieldInput}
                  value={f.value}
                  onChangeText={f.setter}
                  placeholder={f.placeholder}
                  placeholderTextColor="#a8b2c8"
                  secureTextEntry={f.secure}
                  autoCapitalize="none"
                />
              </View>
            ))}
            <Text style={m.fieldLabel}>Vai trò</Text>
            <View style={m.roleGrid}>
              {ROLES.slice(1).map(r => {
                const rc = ROLE_COLOR[r] || { bg: '#f0f2f8', text: '#6b7694' };
                return (
                  <TouchableOpacity key={r} style={[m.roleChip, newRole === r && { borderColor: rc.text, backgroundColor: rc.bg }]} onPress={() => setNewRole(r)}>
                    <Text style={[m.roleChipText, newRole === r && { color: rc.text, fontWeight: '700' }]}>{r}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Permission Matrix Modal */}
      <Modal visible={showPermMatrix} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f7fb' }} edges={['top']}>
          <View style={m.header}>
            <TouchableOpacity onPress={() => setShowPermMatrix(false)}><Feather name="x" size={22} color="#1d2944" /></TouchableOpacity>
            <Text style={m.title}>Ma trận phân quyền</Text>
            <View style={{ width: 50 }} />
          </View>
          <ScrollView horizontal>
            <ScrollView>
              <View style={{ padding: 16 }}>
                {/* Header row */}
                <View style={pm.row}>
                  <Text style={[pm.cell, pm.headerCell, { width: 160 }]}>Quyền hạn</Text>
                  {['Tỉnh', 'Huyện', 'KDV', 'Xem'].map(r => (
                    <Text key={r} style={[pm.cell, pm.headerCell, pm.roleHeader]}>{r}</Text>
                  ))}
                </View>
                {PERMISSIONS_LIST.map((perm, i) => (
                  <View key={i} style={[pm.row, i % 2 === 0 && { backgroundColor: '#fafbff' }]}>
                    <Text style={[pm.cell, { width: 160 }]} numberOfLines={2}>{perm}</Text>
                    {[ACCOUNTS[0], ACCOUNTS[1], ACCOUNTS[2], ACCOUNTS[4]].map((acc, j) => (
                      <View key={j} style={[pm.cell, pm.checkCell]}>
                        {acc.permissions.includes(perm) ? (
                          <Feather name="check" size={14} color="#1f7a45" />
                        ) : (
                          <Feather name="minus" size={14} color="#d9dce9" />
                        )}
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Edit Account Modal */}
      {selectedAccount && (
        <Modal visible={!!selectedAccount} animationType="slide">
          <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f7fb' }} edges={['top']}>
            <View style={m.header}>
              <TouchableOpacity onPress={() => setSelectedAccount(null)}><Feather name="x" size={22} color="#1d2944" /></TouchableOpacity>
              <Text style={m.title}>Chi tiết tài khoản</Text>
              <TouchableOpacity style={m.saveBtn} onPress={() => { setSelectedAccount(null); Alert.alert('Đã lưu', 'Thông tin tài khoản đã được cập nhật.'); }}><Text style={m.saveBtnText}>Lưu</Text></TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
              <View style={m.accountCard}>
                <View style={m.avatar}>
                  <Text style={m.avatarText}>{selectedAccount.name.charAt(0)}</Text>
                </View>
                <Text style={m.accName}>{selectedAccount.name}</Text>
                <Text style={m.accEmail}>{selectedAccount.email}</Text>
              </View>
              {([
                { label: 'Mã tài khoản', value: selectedAccount.id },
                { label: 'Vai trò', value: selectedAccount.role },
                { label: 'Trạng thái', value: selectedAccount.status === 'active' ? 'Hoạt động' : 'Bị khóa' },
                { label: 'Ngày tạo', value: selectedAccount.createdAt },
                { label: 'Đăng nhập lần cuối', value: selectedAccount.lastLogin },
              ]).map((row, i) => (
                <View key={i} style={m.infoRow}>
                  <Text style={m.infoLabel}>{row.label}</Text>
                  <Text style={m.infoValue}>{row.value}</Text>
                </View>
              ))}
              <Text style={[m.fieldLabel, { marginTop: 16, marginBottom: 10 }]}>Quyền hạn ({selectedAccount.permissions.length}/{PERMISSIONS_LIST.length})</Text>
              {PERMISSIONS_LIST.map((perm, i) => (
                <View key={i} style={m.permRow}>
                  <Feather name={selectedAccount.permissions.includes(perm) ? 'check-circle' : 'circle'} size={14} color={selectedAccount.permissions.includes(perm) ? '#1f7a45' : '#d9dce9'} />
                  <Text style={[m.permText, !selectedAccount.permissions.includes(perm) && { color: '#a8b2c8' }]}>{perm}</Text>
                </View>
              ))}
            </ScrollView>
          </SafeAreaView>
        </Modal>
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
  headerBtns: { flexDirection: 'row', gap: 8 },
  matrixBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e4e8f0', alignItems: 'center', justifyContent: 'center' },
  addBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#2740BA', alignItems: 'center', justifyContent: 'center' },
  searchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e4e8f0', marginHorizontal: 12, marginBottom: 8, paddingHorizontal: 12, height: 42 },
  searchInput: { flex: 1, fontSize: 13, color: '#1d2944' },
  chips: { paddingHorizontal: 12, paddingVertical: 4, gap: 6 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e4e8f0' },
  chipActive: { backgroundColor: '#edf0ff', borderColor: '#2740BA' },
  chipText: { fontSize: 11, color: '#6b7694', fontWeight: '500' },
  chipTextActive: { color: '#2740BA', fontWeight: '700' },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#e4e8f0', shadowColor: '#1d2944', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  avatar: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#2740BA', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  cardName: { fontSize: 13, fontWeight: '700', color: '#1d2944' },
  cardEmail: { fontSize: 10, color: '#6b7694', marginTop: 2 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  roleBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  roleText: { fontSize: 10, fontWeight: '600' },
  lastLogin: { fontSize: 10, color: '#a8b2c8' },
  cardActions: { flexDirection: 'row', gap: 8, borderTopWidth: 1, borderTopColor: '#f0f2f8', paddingTop: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: '#edf0ff' },
  actionText: { fontSize: 11, fontWeight: '600', color: '#2740BA' },
});

const m = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#e4e8f0', backgroundColor: '#fff' },
  title: { fontSize: 15, fontWeight: '700', color: '#1d2944' },
  saveBtn: { backgroundColor: '#2740BA', paddingHorizontal: 16, paddingVertical: 7, borderRadius: 8 },
  saveBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  fieldLabel: { fontSize: 11, fontWeight: '700', color: '#34405a', marginBottom: 8 },
  fieldInput: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e4e8f0', paddingHorizontal: 14, paddingVertical: 12, fontSize: 13, color: '#1d2944' },
  roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  roleChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#e4e8f0', backgroundColor: '#fff' },
  roleChipText: { fontSize: 12, color: '#6b7694' },
  accountCard: { alignItems: 'center', padding: 20, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e4e8f0', marginBottom: 16 },
  avatar: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#2740BA', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  avatarText: { fontSize: 22, fontWeight: '700', color: '#fff' },
  accName: { fontSize: 15, fontWeight: '700', color: '#1d2944' },
  accEmail: { fontSize: 12, color: '#6b7694', marginTop: 4 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f2f8' },
  infoLabel: { fontSize: 11, color: '#6b7694' },
  infoValue: { fontSize: 12, fontWeight: '600', color: '#1d2944' },
  permRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f2f8' },
  permText: { fontSize: 12, color: '#1d2944' },
});

const pm = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  cell: { width: 70, paddingHorizontal: 8, paddingVertical: 10, fontSize: 11, color: '#1d2944' },
  headerCell: { fontWeight: '700', color: '#6b7694', backgroundColor: '#f5f7fb', fontSize: 10 },
  roleHeader: { textAlign: 'center' },
  checkCell: { alignItems: 'center', justifyContent: 'center' },
});
