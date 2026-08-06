import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const STRENGTH_LEVELS = [
  { min: 0, label: '', color: '#e4e8f0' },
  { min: 1, label: 'Rất yếu', color: '#c0392b' },
  { min: 2, label: 'Yếu', color: '#E8650A' },
  { min: 3, label: 'Trung bình', color: '#f0a500' },
  { min: 4, label: 'Mạnh', color: '#1f7a45' },
  { min: 5, label: 'Rất mạnh', color: '#1f7a45' },
];

function getStrength(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

export default function SettingsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  // Profile
  const [fullName, setFullName] = useState('Nguyễn Văn Thành');
  const [email, setEmail] = useState('nvthanh@dongnai.gov.vn');
  const [phone, setPhone] = useState('0251.3890.100');
  const [department, setDepartment] = useState('Sở Nông nghiệp và PTNT');
  const [position, setPosition] = useState('Quản trị viên hệ thống');

  // Password
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const strength = getStrength(newPw);
  const strengthMeta = STRENGTH_LEVELS.slice().reverse().find(l => strength >= l.min) || STRENGTH_LEVELS[0];

  const handleSaveProfile = () => {
    if (!fullName.trim()) { Alert.alert('Lỗi', 'Vui lòng nhập họ và tên.'); return; }
    Alert.alert('Thành công', 'Thông tin hồ sơ đã được cập nhật.');
  };

  const handleChangePassword = () => {
    if (!currentPw || !newPw || !confirmPw) { Alert.alert('Lỗi', 'Vui lòng điền đầy đủ các trường mật khẩu.'); return; }
    if (newPw !== confirmPw) { Alert.alert('Lỗi', 'Mật khẩu mới và xác nhận không khớp.'); return; }
    if (strength < 3) { Alert.alert('Cảnh báo', 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.'); return; }
    Alert.alert('Thành công', 'Mật khẩu đã được thay đổi. Vui lòng đăng nhập lại.');
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Feather name="arrow-left" size={20} color="#1d2944" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Cài đặt cá nhân</Text>
          <Text style={s.subtitle}>Hồ sơ và bảo mật tài khoản</Text>
        </View>
      </View>

      {/* Avatar */}
      <View style={s.avatarSection}>
        <View style={s.avatar}>
          <Text style={s.avatarText}>NT</Text>
        </View>
        <TouchableOpacity style={s.changeAvatarBtn}>
          <Feather name="camera" size={14} color="#2740BA" />
          <Text style={s.changeAvatarText}>Đổi ảnh</Text>
        </TouchableOpacity>
        <Text style={s.avatarName}>{fullName}</Text>
        <View style={s.roleBadge}>
          <Feather name="shield" size={11} color="#2740BA" />
          <Text style={s.roleText}>Quản trị tỉnh</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={s.tabs}>
        {([['profile', 'Hồ sơ cá nhân'], ['password', 'Đổi mật khẩu']] as const).map(([k, l]) => (
          <TouchableOpacity key={k} style={[s.tab, activeTab === k && s.tabActive]} onPress={() => setActiveTab(k)}>
            <Feather name={k === 'profile' ? 'user' : 'lock'} size={13} color={activeTab === k ? '#2740BA' : '#6b7694'} />
            <Text style={[s.tabText, activeTab === k && s.tabTextActive]}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {activeTab === 'profile' ? (
          <View>
            {([
              { label: 'Họ và tên *', value: fullName, setter: setFullName, icon: 'user', placeholder: 'Nhập họ và tên' },
              { label: 'Địa chỉ email', value: email, setter: setEmail, icon: 'mail', placeholder: 'Nhập email', keyboard: 'email-address' },
              { label: 'Số điện thoại', value: phone, setter: setPhone, icon: 'phone', placeholder: 'Nhập số điện thoại', keyboard: 'phone-pad' },
              { label: 'Đơn vị công tác', value: department, setter: setDepartment, icon: 'briefcase', placeholder: 'Tên đơn vị' },
              { label: 'Chức vụ', value: position, setter: setPosition, icon: 'award', placeholder: 'Chức danh' },
            ] as any[]).map((field, i) => (
              <View key={i} style={{ marginBottom: 16 }}>
                <Text style={s.fieldLabel}>{field.label}</Text>
                <View style={s.inputRow}>
                  <Feather name={field.icon} size={15} color="#a8b2c8" style={{ marginLeft: 12 }} />
                  <TextInput
                    style={s.input}
                    value={field.value}
                    onChangeText={field.setter}
                    placeholder={field.placeholder}
                    placeholderTextColor="#a8b2c8"
                    keyboardType={field.keyboard}
                    autoCapitalize="none"
                  />
                </View>
              </View>
            ))}

            {/* Read-only fields */}
            <View style={s.readonlyCard}>
              <Text style={s.readonlyTitle}>Thông tin tài khoản</Text>
              {[
                { label: 'Mã tài khoản', value: 'AC001' },
                { label: 'Vai trò', value: 'Quản trị tỉnh' },
                { label: 'Ngày tạo tài khoản', value: '01/01/2024' },
                { label: 'Đăng nhập lần cuối', value: '06/08/2026 08:30' },
              ].map((row, i) => (
                <View key={i} style={s.readonlyRow}>
                  <Text style={s.readonlyLabel}>{row.label}</Text>
                  <Text style={s.readonlyValue}>{row.value}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={s.saveBtn} onPress={handleSaveProfile}>
              <Feather name="save" size={15} color="#fff" />
              <Text style={s.saveBtnText}>Lưu thay đổi</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {/* Current password */}
            <Text style={s.fieldLabel}>Mật khẩu hiện tại *</Text>
            <View style={s.inputRow}>
              <Feather name="lock" size={15} color="#a8b2c8" style={{ marginLeft: 12 }} />
              <TextInput
                style={[s.input, { flex: 1 }]}
                value={currentPw}
                onChangeText={setCurrentPw}
                placeholder="Nhập mật khẩu hiện tại"
                placeholderTextColor="#a8b2c8"
                secureTextEntry={!showCurrentPw}
              />
              <TouchableOpacity onPress={() => setShowCurrentPw(v => !v)} style={{ padding: 12 }}>
                <Feather name={showCurrentPw ? 'eye-off' : 'eye'} size={15} color="#a8b2c8" />
              </TouchableOpacity>
            </View>
            <View style={{ height: 16 }} />

            {/* New password */}
            <Text style={s.fieldLabel}>Mật khẩu mới *</Text>
            <View style={s.inputRow}>
              <Feather name="lock" size={15} color="#a8b2c8" style={{ marginLeft: 12 }} />
              <TextInput
                style={[s.input, { flex: 1 }]}
                value={newPw}
                onChangeText={setNewPw}
                placeholder="Ít nhất 8 ký tự"
                placeholderTextColor="#a8b2c8"
                secureTextEntry={!showNewPw}
              />
              <TouchableOpacity onPress={() => setShowNewPw(v => !v)} style={{ padding: 12 }}>
                <Feather name={showNewPw ? 'eye-off' : 'eye'} size={15} color="#a8b2c8" />
              </TouchableOpacity>
            </View>

            {/* Strength indicator */}
            {newPw.length > 0 && (
              <View style={s.strengthWrap}>
                <View style={s.strengthBars}>
                  {[1, 2, 3, 4, 5].map(n => (
                    <View key={n} style={[s.strengthBar, { backgroundColor: strength >= n ? strengthMeta.color : '#e4e8f0' }]} />
                  ))}
                </View>
                <Text style={[s.strengthLabel, { color: strengthMeta.color }]}>
                  {strengthMeta.label || 'Nhập mật khẩu'}
                </Text>
              </View>
            )}

            {/* Password hints */}
            <View style={s.hintBox}>
              {[
                { text: 'Ít nhất 8 ký tự', pass: newPw.length >= 8 },
                { text: 'Ít nhất 1 chữ hoa', pass: /[A-Z]/.test(newPw) },
                { text: 'Ít nhất 1 số', pass: /[0-9]/.test(newPw) },
                { text: 'Ít nhất 1 ký tự đặc biệt', pass: /[^A-Za-z0-9]/.test(newPw) },
              ].map((hint, i) => (
                <View key={i} style={s.hintRow}>
                  <Feather name={hint.pass ? 'check-circle' : 'circle'} size={12} color={hint.pass ? '#1f7a45' : '#c8cfdd'} />
                  <Text style={[s.hintText, hint.pass && { color: '#1f7a45' }]}>{hint.text}</Text>
                </View>
              ))}
            </View>
            <View style={{ height: 16 }} />

            {/* Confirm */}
            <Text style={s.fieldLabel}>Xác nhận mật khẩu mới *</Text>
            <View style={[s.inputRow, confirmPw && newPw !== confirmPw ? s.inputError : {}]}>
              <Feather name="lock" size={15} color="#a8b2c8" style={{ marginLeft: 12 }} />
              <TextInput
                style={[s.input, { flex: 1 }]}
                value={confirmPw}
                onChangeText={setConfirmPw}
                placeholder="Nhập lại mật khẩu mới"
                placeholderTextColor="#a8b2c8"
                secureTextEntry={!showConfirmPw}
              />
              <TouchableOpacity onPress={() => setShowConfirmPw(v => !v)} style={{ padding: 12 }}>
                <Feather name={showConfirmPw ? 'eye-off' : 'eye'} size={15} color="#a8b2c8" />
              </TouchableOpacity>
            </View>
            {confirmPw && newPw !== confirmPw && (
              <Text style={s.errorText}>Mật khẩu xác nhận không khớp</Text>
            )}

            <View style={{ height: 24 }} />
            <TouchableOpacity style={s.saveBtn} onPress={handleChangePassword}>
              <Feather name="shield" size={15} color="#fff" />
              <Text style={s.saveBtnText}>Cập nhật mật khẩu</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fb' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  backBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: '700', color: '#1d2944', letterSpacing: -0.5 },
  subtitle: { fontSize: 11, color: '#6b7694', marginTop: 1 },
  avatarSection: { alignItems: 'center', paddingVertical: 16 },
  avatar: { width: 72, height: 72, borderRadius: 20, backgroundColor: '#2740BA', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  avatarText: { fontSize: 26, fontWeight: '700', color: '#fff' },
  changeAvatarBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#edf0ff', marginBottom: 6 },
  changeAvatarText: { fontSize: 12, fontWeight: '600', color: '#2740BA' },
  avatarName: { fontSize: 15, fontWeight: '700', color: '#1d2944' },
  roleBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  roleText: { fontSize: 11, color: '#2740BA', fontWeight: '600' },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e4e8f0' },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#2740BA' },
  tabText: { fontSize: 12, color: '#6b7694', fontWeight: '500' },
  tabTextActive: { color: '#2740BA', fontWeight: '700' },
  fieldLabel: { fontSize: 11, fontWeight: '700', color: '#34405a', marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1, borderColor: '#dfe4ee', backgroundColor: '#fff', height: 50 },
  inputError: { borderColor: '#d85b5b' },
  input: { flex: 1, paddingHorizontal: 12, fontSize: 13, color: '#1d2944' },
  readonlyCard: { backgroundColor: '#f9fafb', borderRadius: 14, padding: 14, marginTop: 8, marginBottom: 16, borderWidth: 1, borderColor: '#e4e8f0' },
  readonlyTitle: { fontSize: 11, fontWeight: '700', color: '#6b7694', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  readonlyRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f2f8' },
  readonlyLabel: { fontSize: 11, color: '#6b7694' },
  readonlyValue: { fontSize: 12, fontWeight: '600', color: '#1d2944' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 50, borderRadius: 14, backgroundColor: '#2740BA', shadowColor: '#2740BA', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 4 },
  saveBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  strengthWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  strengthBars: { flexDirection: 'row', gap: 4, flex: 1 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: 11, fontWeight: '600', width: 60 },
  hintBox: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 12, marginTop: 10, gap: 6 },
  hintRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  hintText: { fontSize: 11, color: '#a8b2c8' },
  errorText: { fontSize: 11, color: '#c0392b', marginTop: 6 },
});
