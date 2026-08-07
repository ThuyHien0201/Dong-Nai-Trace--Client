import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, FlatList, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

/* ─── Mock Data ─────────────────────────────────────────────── */
interface Ticket {
  id: string; subject: string; from: string; status: 'open' | 'in_progress' | 'resolved';
  priority: 'high' | 'medium' | 'low'; date: string; category: string;
  messages: { role: 'user' | 'staff'; text: string; time: string }[];
}

const TICKETS: Ticket[] = [
  {
    id: 'TK001', subject: 'Không đăng nhập được vào tài khoản doanh nghiệp', from: 'Nguyễn Văn A (Vĩnh Hảo)', status: 'open', priority: 'high', date: '2024-08-05', category: 'Tài khoản',
    messages: [
      { role: 'user', text: 'Tôi không thể đăng nhập từ sáng hôm nay. Hệ thống báo lỗi "Thông tin không hợp lệ" dù tôi nhập đúng mật khẩu.', time: '09:15' },
      { role: 'staff', text: 'Cảm ơn bạn đã liên hệ. Chúng tôi đã kiểm tra và phát hiện IP của bạn bị chặn tạm thời do đăng nhập sai nhiều lần. Vui lòng chờ 30 phút và thử lại.', time: '09:42' },
      { role: 'user', text: 'Tôi đã thử sau 30 phút nhưng vẫn không được. Mã lỗi hiển thị là E-401.', time: '10:15' },
    ],
  },
  {
    id: 'TK002', subject: 'Cần hỗ trợ tải lên hồ sơ chứng nhận GlobalGAP', from: 'Trần Thị Lan (HTX Tân Triều)', status: 'in_progress', priority: 'medium', date: '2024-08-04', category: 'Hồ sơ',
    messages: [
      { role: 'user', text: 'File PDF chứng nhận GlobalGAP của chúng tôi có dung lượng 15MB nhưng hệ thống chỉ cho phép 5MB. Xin hướng dẫn cách xử lý.', time: '14:30' },
      { role: 'staff', text: 'Vui lòng nén file PDF bằng công cụ trực tuyến như ilovepdf.com hoặc liên hệ đơn vị cấp chứng nhận để xin bản PDF dung lượng nhỏ hơn.', time: '15:00' },
    ],
  },
  {
    id: 'TK003', subject: 'QR code sản phẩm bị quét ra thông tin sai', from: 'Lê Minh Khoa (An Phú Foods)', status: 'resolved', priority: 'high', date: '2024-08-02', category: 'QR Code',
    messages: [
      { role: 'user', text: 'QR code sản phẩm AP-001 khi quét lại hiển thị thông tin của sản phẩm khác. Rất nguy hiểm.', time: '08:00' },
      { role: 'staff', text: 'Đã kiểm tra và phát hiện lỗi mapping QR code. Đã sửa và cập nhật. Vui lòng kiểm tra lại.', time: '08:45' },
      { role: 'user', text: 'Đã kiểm tra, hoạt động bình thường rồi. Cảm ơn bạn.', time: '09:20' },
    ],
  },
  {
    id: 'TK004', subject: 'Thắc mắc về quy trình phê duyệt sản phẩm mới', from: 'Phạm Văn Bình (Bình Sơn)', status: 'open', priority: 'low', date: '2024-08-01', category: 'Quy trình',
    messages: [
      { role: 'user', text: 'Sản phẩm của chúng tôi đã nộp hồ sơ 10 ngày nhưng chưa được phê duyệt. Thông thường mất bao lâu?', time: '16:00' },
    ],
  },
];

const NOTIF_TYPES = ['Thông báo hệ thống', 'Nhắc nhở gia hạn', 'Kết quả phê duyệt', 'Cập nhật tính năng'];

const STATUS_META = {
  open: { label: 'Mở', color: '#E8650A', bg: '#fff4ed', icon: 'circle' as const },
  in_progress: { label: 'Đang xử lý', color: '#2740BA', bg: '#edf0ff', icon: 'clock' as const },
  resolved: { label: 'Đã giải quyết', color: '#1f7a45', bg: '#e8f5ed', icon: 'check-circle' as const },
};

const PRIORITY_META = {
  high: { label: 'Cao', color: '#c0392b' },
  medium: { label: 'Trung bình', color: '#E8650A' },
  low: { label: 'Thấp', color: '#1f7a45' },
};

const TABS = ['Tickets', 'Thông báo'] as const;
type Tab = typeof TABS[number];

export default function SupportScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('Tickets');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [reply, setReply] = useState('');
  const [notifTitle, setNotifTitle] = useState('');
  const [notifContent, setNotifContent] = useState('');
  const [notifType, setNotifType] = useState(NOTIF_TYPES[0]);
  const [sendToAll, setSendToAll] = useState(true);

  const handleSendReply = () => {
    if (!reply.trim()) return;
    Alert.alert('Đã gửi', 'Phản hồi đã được gửi đến người dùng.');
    setReply('');
  };

  const handleSendNotif = () => {
    if (!notifTitle.trim()) { Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề thông báo.'); return; }
    Alert.alert('Thành công', `Thông báo "${notifTitle}" đã được gửi.`);
    setNotifTitle('');
    setNotifContent('');
  };

  if (selectedTicket) {
    const sm = STATUS_META[selectedTicket.status];
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f7fb' }} edges={['top']}>
        <View style={s.header}>
          <TouchableOpacity onPress={() => setSelectedTicket(null)} style={s.backBtn}>
            <Feather name="arrow-left" size={20} color="#1d2944" />
          </TouchableOpacity>
          <Text style={s.title} numberOfLines={1}>{selectedTicket.subject}</Text>
          <View style={[tc.statusBadge, { backgroundColor: sm.bg }]}>
            <Text style={[tc.statusText, { color: sm.color }]}>{sm.label}</Text>
          </View>
        </View>
        <View style={tc.meta}>
          <Text style={tc.from}>{selectedTicket.from}</Text>
          <View style={[tc.priority, { backgroundColor: PRIORITY_META[selectedTicket.priority].color + '18' }]}>
            <Text style={[tc.priorityText, { color: PRIORITY_META[selectedTicket.priority].color }]}>
              Ưu tiên: {PRIORITY_META[selectedTicket.priority].label}
            </Text>
          </View>
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
          {selectedTicket.messages.map((msg, i) => (
            <View key={i} style={[tc.bubble, msg.role === 'staff' ? tc.staffBubble : tc.userBubble]}>
              <View style={[tc.bubbleInner, msg.role === 'staff' ? tc.staffBubbleInner : tc.userBubbleInner]}>
                <Text style={[tc.bubbleText, msg.role === 'staff' ? { color: '#fff' } : { color: '#1d2944' }]}>{msg.text}</Text>
                <Text style={[tc.bubbleTime, msg.role === 'staff' ? { color: 'rgba(255,255,255,0.7)' } : { color: '#a8b2c8' }]}>{msg.time}</Text>
              </View>
              <Text style={tc.bubbleRole}>{msg.role === 'staff' ? 'Nhân viên hỗ trợ' : 'Người dùng'}</Text>
            </View>
          ))}
        </ScrollView>
        {selectedTicket.status !== 'resolved' && (
          <View style={tc.replyBar}>
            <TextInput
              style={tc.replyInput}
              value={reply}
              onChangeText={setReply}
              placeholder="Nhập phản hồi..."
              placeholderTextColor="#a8b2c8"
              multiline
            />
            <TouchableOpacity style={tc.sendBtn} onPress={handleSendReply}>
              <Feather name="send" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        {selectedTicket.status !== 'resolved' && (
          <TouchableOpacity style={tc.resolveBtn} onPress={() => { setSelectedTicket(null); Alert.alert('Đã đóng', 'Ticket đã được đánh dấu hoàn thành.'); }}>
            <Feather name="check-circle" size={15} color="#fff" />
            <Text style={tc.resolveBtnText}>Đánh dấu hoàn thành</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Feather name="arrow-left" size={20} color="#1d2944" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Hỗ trợ & Thông báo</Text>
          <Text style={s.subtitle}>Ticket hỗ trợ và gửi thông báo</Text>
        </View>
      </View>

      <View style={s.tabs}>
        {TABS.map(t => (
          <TouchableOpacity key={t} style={[s.tab, activeTab === t && s.tabActive]} onPress={() => setActiveTab(t)}>
            <Text style={[s.tabText, activeTab === t && s.tabTextActive]}>{t}</Text>
            {t === 'Tickets' && (
              <View style={s.badge}><Text style={s.badgeText}>{TICKETS.filter(tk => tk.status === 'open').length}</Text></View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'Tickets' ? (
        <FlatList
          data={TICKETS}
          keyExtractor={tk => tk.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          renderItem={({ item: tk }) => {
            const sm = STATUS_META[tk.status];
            const pm = PRIORITY_META[tk.priority];
            return (
              <TouchableOpacity style={s.ticketCard} onPress={() => setSelectedTicket(tk)} activeOpacity={0.85}>
                <View style={s.ticketHeader}>
                  <View style={[s.ticketStatus, { backgroundColor: sm.bg }]}>
                    <Feather name={sm.icon} size={10} color={sm.color} />
                    <Text style={[s.ticketStatusText, { color: sm.color }]}>{sm.label}</Text>
                  </View>
                  <View style={s.ticketCat}>
                    <Text style={s.ticketCatText}>{tk.category}</Text>
                  </View>
                  <View style={[s.priorityDot, { backgroundColor: pm.color }]} />
                </View>
                <Text style={s.ticketSubject}>{tk.subject}</Text>
                <Text style={s.ticketFrom} numberOfLines={1}>{tk.from}</Text>
                <View style={s.ticketFooter}>
                  <Feather name="calendar" size={10} color="#a8b2c8" />
                  <Text style={s.ticketDate}>{tk.date}</Text>
                  <Feather name="message-square" size={10} color="#a8b2c8" style={{ marginLeft: 10 }} />
                  <Text style={s.ticketDate}>{tk.messages.length} tin nhắn</Text>
                </View>
              </TouchableOpacity>
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
          <View style={s.notifInfo}>
            <Feather name="bell" size={13} color="#2740BA" />
            <Text style={s.notifInfoText}>Soạn thông báo gửi đến doanh nghiệp và người dùng trong hệ thống.</Text>
          </View>

          <Text style={s.fieldLabel}>Loại thông báo</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 16, alignItems: 'center' }} style={{ maxHeight: 40, flexGrow: 0 }}>
            {NOTIF_TYPES.map(nt => (
              <TouchableOpacity key={nt} style={[s.typeChip, notifType === nt && s.typeChipActive]} onPress={() => setNotifType(nt)}>
                <Text style={[s.typeChipText, notifType === nt && { color: '#2740BA', fontWeight: '700' }]}>{nt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={s.fieldLabel}>Tiêu đề *</Text>
          <TextInput
            style={s.fieldInput}
            value={notifTitle}
            onChangeText={setNotifTitle}
            placeholder="Nhập tiêu đề thông báo..."
            placeholderTextColor="#a8b2c8"
          />

          <Text style={s.fieldLabel}>Nội dung</Text>
          <TextInput
            style={[s.fieldInput, { minHeight: 100, textAlignVertical: 'top' }]}
            value={notifContent}
            onChangeText={setNotifContent}
            placeholder="Nhập nội dung thông báo..."
            placeholderTextColor="#a8b2c8"
            multiline
          />

          <View style={s.targetRow}>
            <View style={{ flex: 1 }}>
              <Text style={s.fieldLabel}>Đối tượng nhận</Text>
              <Text style={s.targetSub}>247 doanh nghiệp đang hoạt động</Text>
            </View>
            <TouchableOpacity style={[s.targetToggle, sendToAll && s.targetToggleActive]} onPress={() => setSendToAll(v => !v)}>
              <Text style={[s.targetToggleText, sendToAll && { color: '#2740BA' }]}>{sendToAll ? 'Tất cả' : 'Chọn nhóm'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={s.sendNotifBtn} onPress={handleSendNotif}>
            <Feather name="send" size={15} color="#fff" />
            <Text style={s.sendNotifText}>Gửi thông báo</Text>
          </TouchableOpacity>

          {/* Sent history */}
          <Text style={[s.fieldLabel, { marginTop: 24, marginBottom: 12 }]}>Lịch sử đã gửi</Text>
          {[
            { title: 'Nhắc nhở gia hạn chứng nhận VietGAP', date: '2024-08-01', recipients: 42, type: 'Nhắc nhở gia hạn' },
            { title: 'Cập nhật tính năng đồng bộ dữ liệu v2.1', date: '2024-07-28', recipients: 247, type: 'Cập nhật tính năng' },
            { title: 'Kết quả phê duyệt đợt tháng 7/2024', date: '2024-07-20', recipients: 18, type: 'Kết quả phê duyệt' },
          ].map((h, i) => (
            <View key={i} style={s.historyCard}>
              <View style={s.historyHeader}>
                <View style={s.historyType}><Text style={s.historyTypeText}>{h.type}</Text></View>
                <Text style={s.historyDate}>{h.date}</Text>
              </View>
              <Text style={s.historyTitle}>{h.title}</Text>
              <View style={s.historyMeta}>
                <Feather name="users" size={11} color="#6b7694" />
                <Text style={s.historyMetaText}>{h.recipients} người nhận</Text>
              </View>
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
  title: { flex: 1, fontSize: 18, fontWeight: '700', color: '#1d2944', letterSpacing: -0.5 },
  subtitle: { fontSize: 11, color: '#6b7694', marginTop: 1 },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e4e8f0' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 6 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#2740BA' },
  tabText: { fontSize: 13, color: '#6b7694', fontWeight: '500' },
  tabTextActive: { color: '#2740BA', fontWeight: '700' },
  badge: { backgroundColor: '#E8650A', width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontSize: 9, fontWeight: '700', color: '#fff' },

  ticketCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#e4e8f0',
    shadowColor: '#1d2944', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  ticketHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  ticketStatus: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  ticketStatusText: { fontSize: 10, fontWeight: '600' },
  ticketCat: { backgroundColor: '#f0f2f8', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  ticketCatText: { fontSize: 10, color: '#6b7694' },
  priorityDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 'auto' as any },
  ticketSubject: { fontSize: 13, fontWeight: '700', color: '#1d2944', lineHeight: 18, marginBottom: 4 },
  ticketFrom: { fontSize: 11, color: '#6b7694', marginBottom: 8 },
  ticketFooter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ticketDate: { fontSize: 10, color: '#a8b2c8' },

  notifInfo: { flexDirection: 'row', gap: 8, backgroundColor: '#f3f8ff', borderRadius: 10, padding: 10, marginBottom: 16, borderWidth: 1, borderColor: '#c9ddf4' },
  notifInfoText: { flex: 1, fontSize: 11, color: '#2740BA', lineHeight: 16 },
  fieldLabel: { fontSize: 11, fontWeight: '700', color: '#34405a', marginBottom: 8 },
  fieldInput: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e4e8f0', padding: 12, fontSize: 13, color: '#1d2944', marginBottom: 16 },
  typeChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e4e8f0' },
  typeChipActive: { backgroundColor: '#edf0ff', borderColor: '#2740BA' },
  typeChipText: { fontSize: 11, color: '#6b7694' },
  targetRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  targetSub: { fontSize: 10, color: '#6b7694', marginTop: 2 },
  targetToggle: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: '#e4e8f0', backgroundColor: '#fff' },
  targetToggleActive: { borderColor: '#2740BA', backgroundColor: '#edf0ff' },
  targetToggleText: { fontSize: 12, color: '#6b7694', fontWeight: '600' },
  sendNotifBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 50, borderRadius: 14, backgroundColor: '#2740BA' },
  sendNotifText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  historyCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#e4e8f0' },
  historyHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  historyType: { backgroundColor: '#f0f2f8', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  historyTypeText: { fontSize: 10, color: '#6b7694' },
  historyDate: { fontSize: 10, color: '#a8b2c8' },
  historyTitle: { fontSize: 12, fontWeight: '600', color: '#1d2944', marginBottom: 6 },
  historyMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  historyMetaText: { fontSize: 11, color: '#6b7694' },
});

const tc = StyleSheet.create({
  meta: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingBottom: 10 },
  from: { flex: 1, fontSize: 12, color: '#6b7694' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '700' },
  priority: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  priorityText: { fontSize: 10, fontWeight: '600' },
  bubble: { marginBottom: 12 },
  staffBubble: { alignItems: 'flex-end' },
  userBubble: { alignItems: 'flex-start' },
  bubbleInner: { maxWidth: '80%', borderRadius: 16, padding: 12 },
  staffBubbleInner: { backgroundColor: '#2740BA', borderBottomRightRadius: 4 },
  userBubbleInner: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e4e8f0', borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 12, lineHeight: 18 },
  bubbleTime: { fontSize: 9, marginTop: 4 },
  bubbleRole: { fontSize: 9, color: '#a8b2c8', marginTop: 3, paddingHorizontal: 4 },
  replyBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: '#e4e8f0', backgroundColor: '#fff' },
  replyInput: { flex: 1, backgroundColor: '#f5f7fb', borderRadius: 12, borderWidth: 1, borderColor: '#e4e8f0', paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: '#1d2944', maxHeight: 80 },
  sendBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#2740BA', alignItems: 'center', justifyContent: 'center' },
  resolveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 48, backgroundColor: '#1f7a45', margin: 12, borderRadius: 12 },
  resolveBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
