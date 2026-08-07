import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  ActivityIndicator, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import C from '@/constants/colors';

type Status = 'idle' | 'loading' | 'success';

export default function LoginScreen() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = () => {
    setForgotSent(false);
    if (!identifier.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }
    if (identifier.trim().length < 3 || password.length < 6) {
      setError('Thông tin đăng nhập chưa đúng định dạng. Vui lòng kiểm tra lại.');
      return;
    }
    setError('');
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => login(), 650);
    }, 850);
  };

  const handleForgot = () => {
    setForgotSent(true);
    setError('');
  };

  const s = styles;

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
          {/* Header brand */}
          <View style={s.header}>
            <View style={s.headerContent}>
              <View style={s.logoRow}>
                <Image
                  source={require('../assets/images/logo-skhcn.png')}
                  style={s.logoImage}
                  resizeMode="contain"
                  accessibilityLabel="Logo Sở Khoa học và Công nghệ Đồng Nai"
                />
                <View style={{ flex: 1 }}>
                  <Text style={s.brandName}>ĐỒNG NAI TRACE</Text>
                  <Text style={s.brandSub}>HỆ THỐNG TRUY XUẤT NGUỒN GỐC SẢN PHẨM</Text>
                </View>
                <Feather name="globe" size={19} color={C.light.primary} />
              </View>
            </View>
          </View>

          {/* Form card */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Đăng nhập</Text>
            <Text style={s.cardSub}>Nhập thông tin tài khoản của bạn</Text>

            {/* Identifier */}
            <View style={s.fieldGroup}>
              <Text style={s.fieldLabel}>TÊN ĐĂNG NHẬP</Text>
              <View style={[s.inputRow, error && !identifier ? s.inputError : null]}>
                <Feather name="mail" size={16} color="#a8b2c8" style={s.inputIcon} />
                <TextInput
                  style={s.input}
                  value={identifier}
                  onChangeText={v => { setIdentifier(v); if (error) setError(''); }}
                  placeholder="Mã số doanh nghiệp / CCCD / tài khoản"
                  placeholderTextColor="#a8b2c8"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Password */}
            <View style={[s.fieldGroup, { marginTop: 14 }]}>
              <View style={s.passwordLabelRow}>
                <Text style={s.fieldLabel}>MẬT KHẨU</Text>
                <TouchableOpacity onPress={handleForgot}>
                  <Text style={s.forgotText}>Quên mật khẩu?</Text>
                </TouchableOpacity>
              </View>
              <View style={[s.inputRow, error && !password ? s.inputError : null]}>
                <Feather name="lock" size={16} color="#a8b2c8" style={s.inputIcon} />
                <TextInput
                  style={[s.input, { flex: 1 }]}
                  value={password}
                  onChangeText={v => { setPassword(v); if (error) setError(''); }}
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor="#a8b2c8"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={s.eyeBtn}>
                  <Feather name={showPassword ? 'eye-off' : 'eye'} size={16} color="#a8b2c8" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember + Forgot */}
            <View style={s.rememberRow}>
              <TouchableOpacity style={s.checkRow} onPress={() => setRemember(v => !v)}>
                <View style={[s.checkbox, remember && s.checkboxChecked]}>
                  {remember && <Feather name="check" size={10} color="#fff" />}
                </View>
                <Text style={s.rememberText}>Ghi nhớ đăng nhập</Text>
              </TouchableOpacity>
            </View>

            {/* Error / success banners */}
            {!!error && (
              <View style={[s.banner, s.bannerError]}>
                <Feather name="alert-circle" size={14} color="#b53d3d" style={{ marginTop: 1 }} />
                <Text style={[s.bannerText, { color: '#b53d3d' }]}>{error}</Text>
              </View>
            )}
            {forgotSent && !error && (
              <View style={[s.banner, s.bannerInfo]}>
                <Feather name="help-circle" size={14} color="#2740BA" style={{ marginTop: 1 }} />
                <Text style={[s.bannerText, { color: '#2740BA' }]}>
                  Vui lòng liên hệ quản trị viên đơn vị để cấp lại mật khẩu.
                </Text>
              </View>
            )}
            {status === 'success' && (
              <View style={[s.banner, s.bannerSuccess]}>
                <Feather name="check-circle" size={14} color="#207a47" style={{ marginTop: 1 }} />
                <Text style={[s.bannerText, { color: '#207a47' }]}>
                  Thông tin hợp lệ. Đang mở không gian làm việc của bạn.
                </Text>
              </View>
            )}

            {/* Submit */}
            <TouchableOpacity
              style={[s.submitBtn, status === 'loading' && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={status === 'loading'}
              activeOpacity={0.85}
            >
              {status === 'loading' ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text style={s.submitText}>
                    {status === 'success' ? 'Đã xác thực' : 'Đăng nhập'}
                  </Text>
                  <Feather name={status === 'success' ? 'check' : 'arrow-up-right'} size={16} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            {/* Security note */}
            <View style={s.securityRow}>
              <Feather name="shield" size={12} color="#2740BA" />
              <Text style={s.securityText}>
                Dữ liệu của bạn được bảo vệ theo quy định an toàn thông tin.
              </Text>
            </View>
          </View>

          <View style={s.footer}>
            <Text style={s.footerText}>© 2024 Đồng Nai Trace</Text>
            <Text style={s.footerVersion}>PHIÊN BẢN 1.0.0</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fb' },
  scroll: { flexGrow: 1 },
  header: {
    backgroundColor: '#f5f7fb',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e8f0',
  },
  headerContent: { zIndex: 10 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoImage: { width: 42, height: 42, flexShrink: 0 },
  brandName: { fontSize: 16, fontWeight: '700', color: '#2740BA' },
  brandSub: {
    fontSize: 7, fontWeight: '500', color: '#8896b0',
    marginTop: 2,
  },

  card: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 24,
  },
  cardTitle: {
    fontSize: 27, fontWeight: '700', color: '#1d2944',
  },
  cardSub: { fontSize: 13, color: '#6b7694', lineHeight: 19, marginTop: 4, marginBottom: 20 },

  fieldGroup: {},
  fieldLabel: { fontSize: 11, fontWeight: '600', color: '#34405a', marginBottom: 7 },
  passwordLabelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 12,
    borderWidth: 1, borderColor: '#e4e8f0', backgroundColor: '#f5f7fb', height: 48,
  },
  inputError: { borderColor: '#d85b5b' },
  inputIcon: { marginLeft: 14 },
  input: {
    flex: 1, paddingHorizontal: 12, fontSize: 13, color: '#1e2b45',
    fontFamily: 'Inter_400Regular',
  },
  eyeBtn: { padding: 12 },

  rememberRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: {
    width: 16, height: 16, borderRadius: 4, borderWidth: 1,
    borderColor: '#c8cfdd', backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { borderColor: '#2740BA', backgroundColor: '#2740BA' },
  rememberText: { fontSize: 11, color: '#34405a' },
  forgotText: { fontSize: 11, fontWeight: '600', color: '#2740BA' },

  banner: {
    flexDirection: 'row', gap: 8, borderRadius: 10, paddingHorizontal: 12,
    paddingVertical: 10, marginTop: 14, borderWidth: 1,
  },
  bannerError: { backgroundColor: '#fff6f6', borderColor: '#f2caca' },
  bannerInfo: { backgroundColor: '#f3f8ff', borderColor: '#c9ddf4' },
  bannerSuccess: { backgroundColor: '#f2fbf6', borderColor: '#c7e6d5' },
  bannerText: { flex: 1, fontSize: 11, lineHeight: 16 },

  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, height: 52, borderRadius: 10, backgroundColor: '#2740BA',
    marginTop: 16,
  },
  submitText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  securityRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16, justifyContent: 'center' },
  securityText: { fontSize: 10, color: '#a8b2c8', flex: 1, lineHeight: 14 },

  footer: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 24, paddingTop: 8,
  },
  footerText: { fontSize: 10, color: '#a8b2c8' },
  footerVersion: { fontSize: 10, color: '#a8b2c8', fontFamily: 'Inter_400Regular', letterSpacing: 1 },
});
