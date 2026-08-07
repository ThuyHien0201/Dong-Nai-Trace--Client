import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const MENU_GROUPS = [
  {
    title: 'Quản lý nội dung',
    items: [
      { icon: 'layers', label: 'Danh mục & Địa bàn', sub: 'Ngành hàng, ĐVT, chứng nhận, huyện/TP', color: '#2740BA', bg: '#edf0ff', route: '/categories' },
      { icon: 'file-text', label: 'Tin tức & Banner', sub: 'Quản lý bài viết và banner quảng bá', color: '#1f7a45', bg: '#e8f5ed', route: '/cms' },
    ],
  },
  {
    title: 'Vận hành',
    items: [
      { icon: 'refresh-cw', label: 'Đồng bộ dữ liệu', sub: 'Đẩy dữ liệu lên Cổng truy xuất quốc gia', color: '#E8650A', bg: '#fff4ed', route: '/sync' },
      { icon: 'message-circle', label: 'Hỗ trợ & Thông báo', sub: 'Ticket hỗ trợ và gửi thông báo', color: '#7c3aed', bg: '#f4f0ff', route: '/support' },
    ],
  },
  {
    title: 'Quản trị',
    items: [
      { icon: 'users', label: 'Tài khoản người dùng', sub: 'Quản lý tài khoản và phân quyền', color: '#2740BA', bg: '#edf0ff', route: '/accounts' },
      { icon: 'cpu', label: 'Hệ thống', sub: 'Nhật ký, cấu hình và sao lưu', color: '#6b7694', bg: '#f2f3f7', route: '/system' },
      { icon: 'settings', label: 'Cài đặt cá nhân', sub: 'Hồ sơ và mật khẩu', color: '#1f7a45', bg: '#e8f5ed', route: '/settings' },
    ],
  },
];

export default function MoreScreen() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Đăng xuất', style: 'destructive', onPress: logout },
      ],
    );
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.avatar}>
            <Image source={require('../../assets/images/logo-skhcn.png')} style={s.avatarLogo} />
          </View>
          <View style={s.headerInfo}>
            <Text style={s.appName} numberOfLines={1} ellipsizeMode="tail">Đồng Nai <Text style={s.appAccent}>Trace</Text></Text>
            <Text style={s.name} numberOfLines={1} ellipsizeMode="tail">Quản trị viên</Text>
            <Text style={s.email} numberOfLines={1} ellipsizeMode="tail">admin@dongnai.gov.vn</Text>
            <View style={s.roleBadge}>
              <Feather name="shield" size={10} color="#2740BA" />
              <Text style={s.roleText}>Quản trị cấp tỉnh</Text>
            </View>
          </View>
          <TouchableOpacity style={s.settingsBtn} onPress={() => router.push('/settings')}>
            <Feather name="edit-2" size={14} color="#6b7694" />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={s.statsRow}>
          {[
            { label: 'Doanh nghiệp', value: '247', icon: 'briefcase' },
            { label: 'Sản phẩm', value: '1.842', icon: 'package' },
            { label: 'QR tháng này', value: '12.4K', icon: 'crosshair' },
          ].map((stat, i) => (
            <View key={i} style={s.statCard}>
              <Feather name={stat.icon as any} size={14} color="#2740BA" />
              <Text style={s.statValue}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu groups */}
        {MENU_GROUPS.map((group, gi) => (
          <View key={gi} style={s.group}>
            <Text style={s.groupTitle}>{group.title.toUpperCase()}</Text>
            <View style={s.groupCard}>
              {group.items.map((item, ii) => (
                <React.Fragment key={ii}>
                  <TouchableOpacity
                    style={s.menuItem}
                    onPress={() => router.push(item.route as any)}
                    activeOpacity={0.7}
                  >
                    <View style={[s.menuIcon, { backgroundColor: item.bg }]}>
                      <Feather name={item.icon as any} size={18} color={item.color} />
                    </View>
                    <View style={s.menuText}>
                      <Text style={s.menuLabel}>{item.label}</Text>
                      <Text style={s.menuSub}>{item.sub}</Text>
                    </View>
                    <Feather name="chevron-right" size={16} color="#c8cfdd" />
                  </TouchableOpacity>
                  {ii < group.items.length - 1 && <View style={s.sep} />}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        {/* App info */}
        <View style={s.appInfo}>
          <View style={s.appInfoRow}>
            <Text style={s.appInfoLabel}>Phiên bản ứng dụng</Text>
            <Text style={s.appInfoValue}>1.0.0 (build 2026080601)</Text>
          </View>
          <View style={s.appInfoRow}>
            <Text style={s.appInfoLabel}>Môi trường</Text>
            <View style={s.envBadge}><Text style={s.envText}>PRODUCTION</Text></View>
          </View>
          <View style={s.appInfoRow}>
            <Text style={s.appInfoLabel}>Kết nối API</Text>
            <View style={s.onlineDot}><Text style={s.onlineText}>● Trực tuyến</Text></View>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Feather name="log-out" size={16} color="#c0392b" />
          <Text style={s.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

         <Text style={s.footer}>© 2024 Đồng Nai Trace · TraceMark Technology</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fb' },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', margin: 12, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#e4e8f0',
    shadowColor: '#1d2944', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  avatar: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#2740BA', alignItems: 'center', justifyContent: 'center' },
  avatarLogo: { width: 44, height: 44, borderRadius: 13 },
  headerInfo: { flex: 1, minWidth: 0 },
  appName: { fontSize: 14, fontWeight: '700', color: '#1d2944' },
  appAccent: { color: '#E8650A' },
  name: { fontSize: 14, fontWeight: '700', color: '#1d2944' },
  email: { fontSize: 11, color: '#6b7694', marginTop: 2 },
  roleBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  roleText: { fontSize: 10, color: '#2740BA', fontWeight: '600' },
  settingsBtn: { flexShrink: 0, padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#e4e8f0' },

  statsRow: { flexDirection: 'row', paddingHorizontal: 12, gap: 8, marginBottom: 4 },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 12, alignItems: 'center',
    borderWidth: 1, borderColor: '#e4e8f0', gap: 4,
  },
  statValue: { fontSize: 16, fontWeight: '700', color: '#1d2944' },
  statLabel: { fontSize: 9, color: '#6b7694', textAlign: 'center' },

  group: { marginBottom: 8 },
  groupTitle: { fontSize: 10, fontWeight: '700', color: '#a8b2c8', letterSpacing: 1.5, paddingHorizontal: 16, marginBottom: 6, marginTop: 8 },
  groupCard: {
    backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 12,
    borderWidth: 1, borderColor: '#e4e8f0',
    shadowColor: '#1d2944', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
    overflow: 'hidden',
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  menuIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 13, fontWeight: '600', color: '#1d2944' },
  menuSub: { fontSize: 10, color: '#6b7694', marginTop: 2, lineHeight: 14 },
  sep: { height: 1, backgroundColor: '#f0f2f8', marginLeft: 68 },

  appInfo: {
    backgroundColor: '#fff', borderRadius: 16, marginHorizontal: 12, marginTop: 8,
    padding: 16, borderWidth: 1, borderColor: '#e4e8f0', gap: 10,
  },
  appInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  appInfoLabel: { fontSize: 11, color: '#6b7694' },
  appInfoValue: { fontSize: 11, fontWeight: '600', color: '#1d2944' },
  envBadge: { backgroundColor: '#edf0ff', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  envText: { fontSize: 9, fontWeight: '700', color: '#2740BA', letterSpacing: 1 },
  onlineDot: {},
  onlineText: { fontSize: 11, fontWeight: '600', color: '#1f7a45' },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#fef0f0', borderRadius: 16, marginHorizontal: 12, marginTop: 12, padding: 16,
    borderWidth: 1, borderColor: '#f5bcbc',
  },
  logoutText: { fontSize: 14, fontWeight: '700', color: '#c0392b' },
  footer: { fontSize: 10, color: '#c8cfdd', textAlign: 'center', marginTop: 16 },
});
