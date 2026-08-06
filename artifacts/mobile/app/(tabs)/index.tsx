import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LineChart, BarChart, DonutChart, ChartLegend } from '@/components/SimpleChart';
import { useAuth } from '@/contexts/AuthContext';

const KPI_CARDS = [
  { label: 'Doanh nghiệp', value: '247', delta: '+5.2%', icon: 'briefcase', color: '#2740BA', bg: '#edf0ff' },
  { label: 'Sản phẩm', value: '1.842', delta: '+12.1%', icon: 'package', color: '#1f7a45', bg: '#e8f5ed' },
  { label: 'Lượt quét QR', value: '12.456', delta: '+28.4%', icon: 'scan', color: '#E8650A', bg: '#fff4ed' },
  { label: 'Tỷ lệ phê duyệt', value: '94.2%', delta: '+1.8%', icon: 'check-circle', color: '#7c3aed', bg: '#f4f0ff' },
];

const QR_TREND = [
  { label: 'T1', value: 4200 },
  { label: 'T2', value: 3800 },
  { label: 'T3', value: 5100 },
  { label: 'T4', value: 6400 },
  { label: 'T5', value: 7200 },
  { label: 'T6', value: 8900 },
  { label: 'T7', value: 9500 },
  { label: 'T8', value: 10100 },
  { label: 'T9', value: 11200 },
  { label: 'T10', value: 10800 },
  { label: 'T11', value: 11900 },
  { label: 'T12', value: 12456 },
];

const PIE_DATA = [
  { label: 'Đang hoạt động', value: 194, color: '#1f7a45', pct: 78.5 },
  { label: 'Chờ xét duyệt', value: 31, color: '#E8650A', pct: 12.6 },
  { label: 'Tạm khóa', value: 22, color: '#c0392b', pct: 8.9 },
];

const ACTIVITIES = [
  { id: 1, title: 'Doanh nghiệp "Vĩnh Hảo" đã được phê duyệt', time: '2 phút trước', type: 'approve', icon: 'check-circle', color: '#1f7a45' },
  { id: 2, title: 'Sản phẩm mới "Bưởi Tân Triều" đăng ký', time: '15 phút trước', type: 'register', icon: 'plus-circle', color: '#2740BA' },
  { id: 3, title: 'QR Code "BVHO-2024" bị quét lần thứ 500', time: '45 phút trước', type: 'qr', icon: 'scan', color: '#E8650A' },
  { id: 4, title: 'Doanh nghiệp "An Phú Foods" cập nhật hồ sơ', time: '1 giờ trước', type: 'update', icon: 'edit', color: '#7c3aed' },
  { id: 5, title: 'Đồng bộ dữ liệu portal thành công — 18 lô hàng', time: '2 giờ trước', type: 'sync', icon: 'refresh-cw', color: '#1f7a45' },
  { id: 6, title: 'Chứng nhận "VietGAP" gia hạn thành công', time: '4 giờ trước', type: 'cert', icon: 'award', color: '#2740BA' },
];

const RECENT_SECTORS = [
  { label: 'Nông sản', value: 4820, color: '#2740BA' },
  { label: 'Thủy sản', value: 2940, color: '#1f7a45' },
  { label: 'Chế biến', value: 1890, color: '#E8650A' },
  { label: 'Dược liệu', value: 920, color: '#7c3aed' },
];

export default function DashboardScreen() {
  const { logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [chartWidth, setChartWidth] = useState(300);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#2740BA" />}
      >
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.brandName}>
              Đồng Nai <Text style={s.brandAccent}>Trace</Text>
            </Text>
            <Text style={s.greeting}>Chào mừng, Quản trị viên 👋</Text>
          </View>
          <View style={s.headerActions}>
            <TouchableOpacity style={s.iconBtn}>
              <Feather name="bell" size={18} color="#2740BA" />
            </TouchableOpacity>
            <TouchableOpacity style={s.iconBtn} onPress={logout}>
              <Feather name="log-out" size={18} color="#6b7694" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Date context */}
        <View style={s.dateRow}>
          <Feather name="calendar" size={12} color="#6b7694" />
          <Text style={s.dateText}>
            Tổng quan tháng 8, 2026 · Đang cập nhật theo thời gian thực
          </Text>
        </View>

        {/* KPI Grid */}
        <View style={s.kpiGrid}>
          {KPI_CARDS.map((k, i) => (
            <View key={i} style={s.kpiCard}>
              <View style={[s.kpiIcon, { backgroundColor: k.bg }]}>
                <Feather name={k.icon as any} size={18} color={k.color} />
              </View>
              <Text style={s.kpiValue}>{k.value}</Text>
              <Text style={s.kpiLabel}>{k.label}</Text>
              <View style={s.kpiDelta}>
                <Feather name="trending-up" size={10} color="#1f7a45" />
                <Text style={s.kpiDeltaText}>{k.delta}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* QR Trend Chart */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <View>
              <Text style={s.cardTitle}>Xu hướng quét QR</Text>
              <Text style={s.cardSub}>Tổng lượt quét theo tháng trong năm 2026</Text>
            </View>
            <View style={[s.badge, { backgroundColor: '#e8f5ed' }]}>
              <Text style={[s.badgeText, { color: '#1f7a45' }]}>↑ 28.4%</Text>
            </View>
          </View>
          <View style={s.chartWrap} onLayout={e => setChartWidth(e.nativeEvent.layout.width - 8)}>
            <LineChart data={QR_TREND} width={chartWidth} height={140} color="#2740BA" />
          </View>
        </View>

        {/* Status Distribution */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Phân bổ trạng thái doanh nghiệp</Text>
          <Text style={s.cardSub}>247 doanh nghiệp đã đăng ký</Text>
          <View style={s.donutRow}>
            <DonutChart data={PIE_DATA} size={100} />
            <ChartLegend data={PIE_DATA} />
          </View>
        </View>

        {/* Sector Chart */}
        <View style={s.card}>
          <Text style={s.cardTitle}>QR quét theo ngành hàng</Text>
          <Text style={s.cardSub}>Tháng này</Text>
          <View style={s.chartWrap} onLayout={e => setChartWidth(e.nativeEvent.layout.width - 8)}>
            <BarChart data={RECENT_SECTORS} width={chartWidth} height={160} />
          </View>
        </View>

        {/* Activity Feed */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <View>
              <Text style={s.cardTitle}>Nhật ký hoạt động</Text>
              <Text style={s.cardSub}>Các sự kiện mới nhất trên hệ thống</Text>
            </View>
          </View>
          {ACTIVITIES.map(act => (
            <View key={act.id} style={s.actRow}>
              <View style={[s.actIcon, { backgroundColor: act.color + '18' }]}>
                <Feather name={act.icon as any} size={14} color={act.color} />
              </View>
              <View style={s.actContent}>
                <Text style={s.actTitle}>{act.title}</Text>
                <Text style={s.actTime}>{act.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick links */}
        <View style={s.quickGrid}>
          {[
            { label: 'Đồng bộ dữ liệu', icon: 'refresh-cw', color: '#2740BA', route: '/sync' },
            { label: 'Phê duyệt chờ', icon: 'clock', color: '#E8650A', route: '/accounts' },
            { label: 'Cấu hình hệ thống', icon: 'settings', color: '#7c3aed', route: '/system' },
            { label: 'Hỗ trợ kỹ thuật', icon: 'message-circle', color: '#1f7a45', route: '/support' },
          ].map((q, i) => (
            <TouchableOpacity key={i} style={s.quickCard} activeOpacity={0.8}>
              <View style={[s.quickIcon, { backgroundColor: q.color + '18' }]}>
                <Feather name={q.icon as any} size={18} color={q.color} />
              </View>
              <Text style={s.quickLabel}>{q.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fb' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 16 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4,
  },
  brandName: { fontSize: 18, fontWeight: '700', color: '#1d2944', letterSpacing: -0.5 },
  brandAccent: { color: '#2740BA' },
  greeting: { fontSize: 11, color: '#6b7694', marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#e4e8f0',
  },

  dateRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, marginBottom: 14,
  },
  dateText: { fontSize: 11, color: '#6b7694' },

  kpiGrid: {
    flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12,
    gap: 0, marginBottom: 4,
  },
  kpiCard: {
    width: '50%', paddingHorizontal: 4, paddingBottom: 8,
  },
  kpiCardInner: {
    backgroundColor: '#fff', borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: '#e4e8f0',
    shadowColor: '#1d2944', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },

  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginHorizontal: 12,
    marginBottom: 12, borderWidth: 1, borderColor: '#e4e8f0',
    shadowColor: '#1d2944', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardTitle: { fontSize: 13, fontWeight: '700', color: '#1d2944', letterSpacing: -0.3 },
  cardSub: { fontSize: 10, color: '#6b7694', marginTop: 2 },
  chartWrap: { marginTop: 8, alignItems: 'center' },

  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '700' },

  donutRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 12 },

  actRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#f0f2f8' },
  actIcon: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  actContent: { flex: 1 },
  actTitle: { fontSize: 11, color: '#1d2944', lineHeight: 15 },
  actTime: { fontSize: 10, color: '#a8b2c8', marginTop: 2 },

  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 0 },
  quickCard: {
    width: '50%', padding: 4,
  },

  kpiIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  kpiValue: { fontSize: 22, fontWeight: '700', color: '#1d2944', letterSpacing: -1 },
  kpiLabel: { fontSize: 10, color: '#6b7694', marginTop: 2 },
  kpiDelta: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
  kpiDeltaText: { fontSize: 10, fontWeight: '600', color: '#1f7a45' },

  quickIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  quickLabel: { fontSize: 11, color: '#1d2944', fontWeight: '600', lineHeight: 14 },
});

// Overwrite kpiCard to include a card-style box
const kpiStyle = StyleSheet.create({
  card: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14, margin: 4,
    borderWidth: 1, borderColor: '#e4e8f0',
    shadowColor: '#1d2944', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  quick: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14, margin: 4,
    borderWidth: 1, borderColor: '#e4e8f0',
    alignItems: 'flex-start',
    shadowColor: '#1d2944', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
});
