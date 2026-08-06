/**
 * Simple SVG-based chart components using react-native-svg.
 * No third-party chart library needed.
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Polyline, Circle, Line, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';

export interface BarDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface LineDataPoint {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarDataPoint[];
  height?: number;
  width?: number;
  defaultColor?: string;
}

export function BarChart({ data, height = 160, width = 280, defaultColor = '#2740BA' }: BarChartProps) {
  if (!data.length) return null;
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const barW = Math.floor((width - 24) / data.length) - 6;
  const chartH = height - 32;
  const barAreaW = width - 24;

  return (
    <Svg width={width} height={height} style={{ overflow: 'visible' }}>
      {/* Gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
        const y = 8 + chartH * (1 - ratio);
        return (
          <Line
            key={i}
            x1={12}
            y1={y}
            x2={width - 12}
            y2={y}
            stroke="#e4e8f0"
            strokeWidth={1}
            strokeDasharray={ratio === 0 || ratio === 1 ? '0' : '4 3'}
          />
        );
      })}
      {/* Bars */}
      {data.map((d, i) => {
        const barH = Math.max((d.value / maxVal) * chartH, 2);
        const x = 12 + i * (barAreaW / data.length) + 3;
        const y = 8 + chartH - barH;
        return (
          <React.Fragment key={i}>
            <Defs>
              <LinearGradient id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={d.color || defaultColor} stopOpacity="1" />
                <Stop offset="1" stopColor={d.color || defaultColor} stopOpacity="0.55" />
              </LinearGradient>
            </Defs>
            <Rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx={4}
              fill={`url(#grad${i})`}
            />
          </React.Fragment>
        );
      })}
      {/* X-axis labels */}
      {data.map((d, i) => {
        const cx = 12 + i * (barAreaW / data.length) + 3 + barW / 2;
        return (
          <SvgText
            key={i}
            x={cx}
            y={height - 2}
            textAnchor="middle"
            fontSize={9}
            fill="#6b7694"
          >
            {d.label}
          </SvgText>
        );
      })}
    </Svg>
  );
}

interface LineChartProps {
  data: LineDataPoint[];
  height?: number;
  width?: number;
  color?: string;
  fillColor?: string;
}

export function LineChart({ data, height = 120, width = 280, color = '#2740BA', fillColor = 'rgba(39,64,186,0.1)' }: LineChartProps) {
  if (data.length < 2) return null;
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const minVal = Math.min(...data.map(d => d.value), 0);
  const range = maxVal - minVal || 1;
  const padX = 16;
  const padY = 10;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2 - 16;

  const points = data.map((d, i) => ({
    x: padX + (i / (data.length - 1)) * chartW,
    y: padY + chartH - ((d.value - minVal) / range) * chartH,
  }));

  const polylineStr = points.map(p => `${p.x},${p.y}`).join(' ');
  // Filled area
  const fillStr = `${padX},${padY + chartH} ${polylineStr} ${padX + chartW},${padY + chartH}`;

  return (
    <Svg width={width} height={height} style={{ overflow: 'visible' }}>
      {/* Grid */}
      {[0, 0.5, 1].map((r, i) => {
        const y = padY + chartH * (1 - r);
        return (
          <Line key={i} x1={padX} y1={y} x2={width - padX} y2={y}
            stroke="#e4e8f0" strokeWidth={1} strokeDasharray={r === 0 ? '0' : '4 3'} />
        );
      })}
      {/* Fill */}
      <Polyline points={fillStr} fill={fillColor} stroke="none" />
      {/* Line */}
      <Polyline points={polylineStr} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      {/* Dots */}
      {points.map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#fff" stroke={color} strokeWidth={2} />
      ))}
      {/* X labels */}
      {data.map((d, i) => (
        <SvgText key={i} x={points[i].x} y={height - 2} textAnchor="middle" fontSize={9} fill="#6b7694">
          {d.label}
        </SvgText>
      ))}
    </Svg>
  );
}

interface PieDataPoint {
  label: string;
  value: number;
  color: string;
}

export function DonutChart({ data, size = 120 }: { data: PieDataPoint[]; size?: number }) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const cx = size / 2, cy = size / 2;
  const r = size * 0.36, innerR = size * 0.22;
  let startAngle = -Math.PI / 2;

  const toXY = (angle: number, radius: number) => ({
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  });

  const segments = data.map(d => {
    const angle = (d.value / total) * 2 * Math.PI;
    const end = startAngle + angle;
    const seg = { ...d, start: startAngle, end, angle };
    startAngle = end;
    return seg;
  });

  return (
    <Svg width={size} height={size}>
      {segments.map((seg, i) => {
        if (seg.angle === 0) return null;
        const outerStart = toXY(seg.start, r);
        const outerEnd = toXY(seg.end, r);
        const innerStart = toXY(seg.start, innerR);
        const innerEnd = toXY(seg.end, innerR);
        const largeArc = seg.angle > Math.PI ? 1 : 0;
        const d = [
          `M ${outerStart.x} ${outerStart.y}`,
          `A ${r} ${r} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
          `L ${innerEnd.x} ${innerEnd.y}`,
          `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
          'Z',
        ].join(' ');
        return <Svg key={i}><Rect x={0} y={0} width={size} height={size} fill="none" /></Svg>;
      })}
      {/* Colored rings */}
      {segments.map((seg, i) => {
        if (seg.angle === 0) return null;
        const s = toXY(seg.start, (r + innerR) / 2);
        const e = toXY(seg.end, (r + innerR) / 2);
        const strokeW = r - innerR;
        const largeArc = seg.angle > Math.PI ? 1 : 0;
        return (
          <Polyline key={i} points={`${s.x},${s.y} ${e.x},${e.y}`} stroke="none" />
        );
      })}
      {/* Simple ring */}
      {data.map((seg, i) => {
        const pct = seg.value / total;
        const len = 2 * Math.PI * r;
        const dashArr = `${pct * len - 3} ${len}`;
        const offset = segments.slice(0, i).reduce((acc, s) => acc + (s.value / total) * len, 0);
        return (
          <Circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={r - innerR}
            strokeDasharray={dashArr}
            strokeDashoffset={-offset + len / 4}
          />
        );
      })}
    </Svg>
  );
}

export function ChartLegend({ data }: { data: Array<{ label: string; value: number; color: string; pct?: number }> }) {
  return (
    <View style={ls.wrap}>
      {data.map((d, i) => (
        <View key={i} style={ls.row}>
          <View style={[ls.dot, { backgroundColor: d.color }]} />
          <Text style={ls.label} numberOfLines={1}>{d.label}</Text>
          <Text style={ls.val}>{d.pct !== undefined ? `${d.pct}%` : d.value.toLocaleString('vi-VN')}</Text>
        </View>
      ))}
    </View>
  );
}

const ls = StyleSheet.create({
  wrap: { marginTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  label: { flex: 1, fontSize: 11, color: '#34405a' },
  val: { fontSize: 11, fontWeight: '700', color: '#1d2944' },
});
