import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { BarChart, LineChart, DonutChart, ChartLegend } from '@/components/SimpleChart';

const PERIODS = ['7 ngày', '30 ngày', 'Quý này', 'Năm nay'];
const REGIONS = ['Tất cả', 'Biên Hòa', 'Long Thành', 'Nhơn Trạch', 'Xuân Lộc'];

const KPIS = [
  { label: 'Tổng doanh nghiệp', value: '247', delta: '+5.2%', positive: true, icon: 'briefcase', color: '#2740BA', bg: '#edf0ff' },
  { label: 'Tổng sản phẩm', value: '1.842', delta: '+12.1%', positive: true, icon: 'package', color: '#1f7a45', bg: '#e8f5ed' },
  { label: 'QR quét tháng này', value: '12.456', delta: '+28.4%', positive: true, icon: 'scan', color: '#E8650A', bg: '#fff4ed' },
  { label: 'Chờ phê duyệt', value: '31', delta: '-8.2%', positive: false, icon: 'clock', color: '#7c3aed', bg: '#f4f0ff' },
];

const QR_MONTHLY = [
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

const SECTOR_DATA = [
  { label: 'Nông sản', value: 94, color: '#2740BA' },
  { label: 'Thủy sản', value: 58, color: '#1f7a45' },
  { label: 'Chế biến', value: 47, color: '#E8650A' },
  { label: 'Đồ uống', value: 32, color: '#7c3aed' },
  { label: 'Dược liệu', value: 16, color: '#0891b2' },
];

const STATUS_DIST = [
  { label: 'Hoạt động', value: 194, color: '#1f7a45', pct: 78 },
  { label: 'Chờ duyệt', value: 31, color: '#E8650A', pct: 13 },
  { label: 'Tạm khóa', value: 22, color: '#c0392b', pct: 9 },
];

const REGION_DATA = [
  { label: 'Biên Hòa', value: 89, color: '#2740BA' },
  { label: 'Long Thành', value: 52, color: '#1f7a45' },
  { label: 'Nhơn Trạch', value: 41, color: '#E8650A' },
  { label: 'Xuân Lộc', value: 38, color: '#7c3aed' },
  { label: 'Khác', value: 27, color: '#a8b2c8' },
];

const NEW_BIZ_MONTHLY = [
  { label: 'T4', value: 12 },
  { label: 'T5', value: 18 },
  { label: 'T6', value: 9 },
  { label: 'T7', value: 22 },
  { label: 'T8', value: 15 },
];

const STACKED_DATA = [
  { label: 'Q1', val1: 82, val2: 34, val3: 18 },
  { label: 'Q2', val1: 95, val2: 41, val3: 21 },
  { label: 'Q3', val1: 110, val2: 52, val3: 19 },
  { label: 'Q4', val1: 128, val2: 61, val3: 25 },
];

export default function AnalyticsScreen() {
  const [period, setPeriod] = useState('Năm nay');
  const [region, setRegion] = useState('Tất cả');
  const [chartWidth, setChartWidth] = useState(300);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.title}>Báo cáo & Thống kê</Text>
            <Text style={s.subtitle}>Phân tích dữ liệu hoạt động hệ thống</Text>
          </View>
          <TouchableOpacity style={s.exportBtn}>
            <Feather name="download" size={14} color="#2740BA" />
            <Text style={s.exportText}>Xuất</Text>
          </TouchableOpacity>
        </View>

        {/* Period filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow} style={{ maxHeight: 44, flexGrow: 0 }}>
          {PERIODS.map(p => (
            <TouchableOpacity key={p} style={[s.chip, period === p && s.chipActive]} onPress={() => setPeriod(p)}>
              <Text style={[s.chipText, period === p && s.chipTextActive]}>{p}</Text>
            </TouchableOpacity>
          ))}
          <View style={{ width: 8 }} />
          {REGIONS.map(r => (
            <TouchableOpacity key={r} style={[s.chip, s.regionChip, region === r && s.regionChipActive]} onPress={() => setRegion(r)}>
              <Text style={[s.chipText, region === r && { color: '#E8650A', fontWeight: '700' }]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* KPI Grid */}
        <View style={s.kpiGrid}>
          {KPIS.map((k, i) => (
            <View key={i} style={s.kpiWrap}>
              <View style={s.kpiCard}>
                <View style={[s.kpiIcon, { backgroundColor: k.bg }]}>
                  <Feather name={k.icon as any} size={16} color={k.color} />
                </View>
                <Text style={s.kpiVal}>{k.value}</Text>
                <Text style={s.kpiLabel}>{k.label}</Text>
                <View style={s.kpiDeltaRow}>
                  <Feather name={k.positive ? 'trending-up' : 'trending-down'} size={10} color={k.positive ? '#1f7a45' : '#c0392b'} />
                  <Text style={[s.kpiDelta, { color: k.positive ? '#1f7a45' : '#c0392b' }]}>{k.delta}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* QR Trend */}
        <View style={s.card} onLayout={e => setChartWidth(e.nativeEvent.layout.width - 32)}>
          <Text style={s.cardTitle}>Xu hướng quét QR theo tháng</Text>
          <Text style={s.cardSub}>Tổng lượt quét trong năm 2026 • {period}</Text>
          <View style={s.chartWrap}>
            <LineChart data={QR_MONTHLY} width={chartWidth} height={140} color="#2740BA" />
          </View>
        </View>

        {/* Sector Distribution Bar */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Phân bổ doanh nghiệp theo ngành</Text>
          <Text style={s.cardSub}>Số lượng đã đăng ký</Text>
          <View style={s.chartWrap}>
            <BarChart
              data={SECTOR_DATA.map(d => ({ label: d.label.slice(0, 6), value: d.value, color: d.color }))}
              width={chartWidth}
              height={160}
            />
          </View>
          <ChartLegend data={SECTOR_DATA} />
        </View>

        {/* Status Donut */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Phân bổ trạng thái doanh nghiệp</Text>
          <Text style={s.cardSub}>247 doanh nghiệp đã đăng ký</Text>
          <View style={s.donutRow}>
            <DonutChart data={STATUS_DIST} size={110} />
            <ChartLegend data={STATUS_DIST} />
          </View>
        </View>

        {/* Region bar */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Doanh nghiệp theo địa bàn</Text>
          <Text style={s.cardSub}>Phân bổ theo huyện/TP</Text>
          <View style={s.chartWrap}>
            <BarChart
              data={REGION_DATA.map(d => ({ label: d.label.slice(0, 8), value: d.value, color: d.color }))}
              width={chartWidth}
              height={160}
            />
          </View>
          <ChartLegend data={REGION_DATA} />
        </View>

        {/* New registrations trend */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Doanh nghiệp mới đăng ký</Text>
          <Text style={s.cardSub}>5 tháng gần đây</Text>
          <View style={s.chartWrap}>
            <BarChart
              data={NEW_BIZ_MONTHLY.map(d => ({ label: d.label, value: d.val, color: '#7c3aed' }))}
              width={chartWidth}
              height={120}
              defaultColor="#7c3aed"
            />
          </View>
        </View>

        {/* Quarterly stacked summary */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Tăng trưởng theo quý</Text>
          <Text style={s.cardSub}>Doanh nghiệp mới • QR quét (K) • Sản phẩm mới</Text>
          <View style={{ marginTop: 12 }}>
            {STACKED_DATA.map((row, i) => {
              const total = row.val1 + row.val2 + row.val3;
              const pcts = [row.val1 / total, row.val2 / total, row.val3 / total];
              const colors = ['#2740BA', '#1f7a45', '#E8650A'];
              return (
                <View key={i} style={sq.row}>
                  <Text style={sq.label}>{row.label}</Text>
                  <View style={sq.barWrap}>
                    {pcts.map((p, j) => (
                      <View key={j} style={[sq.seg, { flex: p, backgroundColor: colors[j] }]} />
                    ))}
                  </View>
                  <Text style={sq.total}>{total}</Text>
                </View>
              );
            })}
            <View style={sq.legend}>
              {[['Doanh nghiệp', '#2740BA'], ['QR (K)', '#1f7a45'], ['Sản phẩm', '#E8650A']].map(([l, c]) => (
                <View key={l} style={sq.legendItem}>
                  <View style={[sq.dot, { backgroundColor: c as string }]} />
                  <Text style={sq.legendText}>{l}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fb' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#1d2944', letterSpacing: -0.5 },
  subtitle: { fontSize: 11, color: '#6b7694', marginTop: 2 },
  exportBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#edf0ff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  exportText: { fontSize: 12, color: '#2740BA', fontWeight: '600' },
  filterRow: { paddingHorizontal: 12, paddingVertical: 4, gap: 6 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e4e8f0' },
  chipActive: { backgroundColor: '#edf0ff', borderColor: '#2740BA' },
  regionChip: {},
  regionChipActive: { backgroundColor: '#fff4ed', borderColor: '#E8650A' },
  chipText: { fontSize: 11, color: '#6b7694', fontWeight: '500' },
  chipTextActive: { color: '#2740BA', fontWeight: '700' },

  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8, marginVertical: 4 },
  kpiWrap: { width: '50%', padding: 4 },
  kpiCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#e4e8f0',
    shadowColor: '#1d2944', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  kpiIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  kpiVal: { fontSize: 20, fontWeight: '700', color: '#1d2944', letterSpacing: -0.8 },
  kpiLabel: { fontSize: 10, color: '#6b7694', marginTop: 2 },
  kpiDeltaRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
  kpiDelta: { fontSize: 10, fontWeight: '600' },

  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginHorizontal: 12,
    marginBottom: 12, borderWidth: 1, borderColor: '#e4e8f0',
    shadowColor: '#1d2944', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  cardTitle: { fontSize: 13, fontWeight: '700', color: '#1d2944', letterSpacing: -0.3 },
  cardSub: { fontSize: 10, color: '#6b7694', marginTop: 2 },
  chartWrap: { marginTop: 12, alignItems: 'center' },
  donutRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 },
});

const sq = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  label: { fontSize: 11, fontWeight: '600', color: '#6b7694', width: 28 },
  barWrap: { flex: 1, flexDirection: 'row', height: 20, borderRadius: 10, overflow: 'hidden', gap: 1 },
  seg: { height: '100%' },
  total: { fontSize: 11, fontWeight: '700', color: '#1d2944', width: 28, textAlign: 'right' },
  legend: { flexDirection: 'row', gap: 16, marginTop: 4, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 10, color: '#6b7694' },
});
