import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

/* ─── Mock Data ─────────────────────────────────────────────── */
interface Article {
  id: string; title: string; category: string; status: 'published' | 'draft';
  author: string; date: string; views: number; excerpt: string;
}

const ARTICLES: Article[] = [
  { id: 'A1', title: 'Đồng Nai triển khai hệ thống truy xuất nguồn gốc toàn tỉnh', category: 'Tin tức', status: 'published', author: 'Ban Biên Tập', date: '2024-08-01', views: 2341, excerpt: 'UBND tỉnh Đồng Nai chính thức ra mắt cổng truy xuất nguồn gốc sản phẩm địa phương...' },
  { id: 'A2', title: 'Hướng dẫn đăng ký doanh nghiệp trên hệ thống TraceMark', category: 'Hướng dẫn', status: 'published', author: 'Phòng Kỹ Thuật', date: '2024-07-28', views: 1823, excerpt: 'Bước 1: Chuẩn bị hồ sơ đăng ký kinh doanh, mã số thuế hợp lệ...' },
  { id: 'A3', title: 'Lễ trao chứng nhận VietGAP đợt 2 năm 2024 cho HTX Tân Triều', category: 'Sự kiện', status: 'published', author: 'Ban Biên Tập', date: '2024-07-20', views: 987, excerpt: 'Sáng ngày 20/7, Sở NN&PTNT tỉnh Đồng Nai đã tổ chức lễ trao chứng nhận...' },
  { id: 'A4', title: 'Cập nhật tính năng mới: Tích hợp QR đa năng và bản đồ vùng trồng', category: 'Thông báo', status: 'draft', author: 'Phòng Kỹ Thuật', date: '2024-08-05', views: 0, excerpt: 'Phiên bản 2.1.0 sẽ mang đến nhiều cải tiến quan trọng về tính năng quét QR và hiển thị...' },
  { id: 'A5', title: 'Kết quả kiểm tra an toàn vệ sinh thực phẩm Q2/2024 tại Đồng Nai', category: 'Báo cáo', status: 'published', author: 'Sở Y Tế', date: '2024-07-10', views: 1245, excerpt: 'Kết quả kiểm tra 247 cơ sở sản xuất, chế biến thực phẩm trong Q2/2024...' },
];

interface Banner {
  id: string; title: string; subtitle: string; active: boolean; order: number; type: string;
}

const INITIAL_BANNERS: Banner[] = [
  { id: 'BN1', title: 'Truy xuất nguồn gốc — Minh bạch từ trang trại đến bàn ăn', subtitle: 'Đồng Nai Trace 2024', active: true, order: 1, type: 'Trang chủ' },
  { id: 'BN2', title: 'Đăng ký doanh nghiệp nhận ưu đãi tháng 8/2024', subtitle: 'Miễn phí đăng ký đến 31/8', active: true, order: 2, type: 'Khuyến mãi' },
  { id: 'BN3', title: 'Sản phẩm OCOP Đồng Nai — Chất lượng đã được kiểm chứng', subtitle: 'Chương trình OCOP 2024', active: false, order: 3, type: 'Sự kiện' },
  { id: 'BN4', title: 'Hội thảo kỹ thuật số hóa chuỗi cung ứng nông sản', subtitle: 'Biên Hòa, 15/9/2024', active: true, order: 4, type: 'Sự kiện' },
];

const CAT_COLOR: Record<string, { bg: string; text: string }> = {
  'Tin tức': { bg: '#edf0ff', text: '#2740BA' },
  'Hướng dẫn': { bg: '#e8f5ed', text: '#1f7a45' },
  'Sự kiện': { bg: '#fff4ed', text: '#E8650A' },
  'Thông báo': { bg: '#f4f0ff', text: '#7c3aed' },
  'Báo cáo': { bg: '#ecfeff', text: '#0891b2' },
};

const TABS = ['Tin tức', 'Banner'] as const;
type Tab = typeof TABS[number];

export default function CMSScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('Tin tức');
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [showEditor, setShowEditor] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editExcerpt, setEditExcerpt] = useState('');
  const [editCat, setEditCat] = useState('Tin tức');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const toggleBanner = (id: string) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  const handleNewArticle = () => {
    setEditTitle('');
    setEditExcerpt('');
    setEditCat('Tin tức');
    setSelectedArticle(null);
    setShowEditor(true);
  };

  const handleSaveArticle = () => {
    if (!editTitle.trim()) { Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề bài viết.'); return; }
    Alert.alert('Thành công', 'Bài viết đã được lưu thành bản nháp.');
    setShowEditor(false);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Feather name="arrow-left" size={20} color="#1d2944" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Tin tức & Banner</Text>
          <Text style={s.subtitle}>Quản lý nội dung hiển thị</Text>
        </View>
        {activeTab === 'Tin tức' && (
          <TouchableOpacity style={s.addBtn} onPress={handleNewArticle}>
            <Feather name="plus" size={16} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={s.tabs}>
        {TABS.map(t => (
          <TouchableOpacity key={t} style={[s.tab, activeTab === t && s.tabActive]} onPress={() => setActiveTab(t)}>
            <Text style={[s.tabText, activeTab === t && s.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {activeTab === 'Tin tức' ? (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
          {ARTICLES.map(art => {
            const cc = CAT_COLOR[art.category] || { bg: '#f5f7fb', text: '#6b7694' };
            return (
              <TouchableOpacity key={art.id} style={s.articleCard} activeOpacity={0.85}
                onPress={() => { setSelectedArticle(art); setEditTitle(art.title); setEditExcerpt(art.excerpt); setEditCat(art.category); setShowEditor(true); }}>
                <View style={s.articleHeader}>
                  <View style={[s.catBadge, { backgroundColor: cc.bg }]}>
                    <Text style={[s.catBadgeText, { color: cc.text }]}>{art.category}</Text>
                  </View>
                  <View style={[s.statusBadge, art.status === 'published' ? s.pub : s.draft]}>
                    <Feather name={art.status === 'published' ? 'eye' : 'edit'} size={9} color={art.status === 'published' ? '#1f7a45' : '#9a6116'} />
                    <Text style={[s.statusText, { color: art.status === 'published' ? '#1f7a45' : '#9a6116' }]}>
                      {art.status === 'published' ? 'Đã đăng' : 'Bản nháp'}
                    </Text>
                  </View>
                </View>
                <Text style={s.articleTitle}>{art.title}</Text>
                <Text style={s.articleExcerpt} numberOfLines={2}>{art.excerpt}</Text>
                <View style={s.articleMeta}>
                  <Feather name="user" size={11} color="#a8b2c8" />
                  <Text style={s.metaText}>{art.author}</Text>
                  <Feather name="calendar" size={11} color="#a8b2c8" style={{ marginLeft: 10 }} />
                  <Text style={s.metaText}>{art.date}</Text>
                  {art.status === 'published' && (
                    <>
                      <Feather name="eye" size={11} color="#a8b2c8" style={{ marginLeft: 10 }} />
                      <Text style={s.metaText}>{art.views.toLocaleString('vi-VN')}</Text>
                    </>
                  )}
                </View>
                <View style={s.articleActions}>
                  <TouchableOpacity style={s.actionChip}>
                    <Feather name="edit-2" size={12} color="#2740BA" />
                    <Text style={s.actionChipText}>Sửa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[s.actionChip, { backgroundColor: '#fef0f0' }]}
                    onPress={() => Alert.alert('Xóa bài viết', `Bạn có chắc muốn xóa "${art.title}"?`, [{ text: 'Hủy' }, { text: 'Xóa', style: 'destructive', onPress: () => {} }])}>
                    <Feather name="trash-2" size={12} color="#c0392b" />
                    <Text style={[s.actionChipText, { color: '#c0392b' }]}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
          <View style={s.bannerInfo}>
            <Feather name="info" size={13} color="#2740BA" />
            <Text style={s.bannerInfoText}>
              Kéo để sắp xếp thứ tự hiển thị. Bật/tắt để ẩn banner khỏi cổng thông tin.
            </Text>
          </View>
          {banners.map((banner, i) => (
            <View key={banner.id} style={[s.bannerCard, !banner.active && s.bannerInactive]}>
              <View style={s.bannerOrder}>
                <Text style={s.bannerOrderText}>{banner.order}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={s.bannerHead}>
                  <View style={[s.bannerType, { backgroundColor: banner.active ? '#edf0ff' : '#f0f2f8' }]}>
                    <Text style={[s.bannerTypeText, { color: banner.active ? '#2740BA' : '#a8b2c8' }]}>{banner.type}</Text>
                  </View>
                </View>
                <Text style={[s.bannerTitle, !banner.active && { color: '#a8b2c8' }]}>{banner.title}</Text>
                <Text style={s.bannerSub}>{banner.subtitle}</Text>
              </View>
              <View style={s.bannerRight}>
                <Switch
                  value={banner.active}
                  onValueChange={() => toggleBanner(banner.id)}
                  trackColor={{ false: '#e4e8f0', true: '#2740BA' }}
                  thumbColor="#fff"
                  style={{ transform: [{ scale: 0.8 }] }}
                />
                <TouchableOpacity style={s.bannerEdit}>
                  <Feather name="edit-2" size={12} color="#6b7694" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <TouchableOpacity style={s.addBannerBtn} onPress={() => Alert.alert('Thêm banner', 'Chức năng thêm banner mới.')}>
            <Feather name="plus" size={16} color="#2740BA" />
            <Text style={s.addBannerText}>Thêm banner mới</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Article Editor Modal */}
      <Modal visible={showEditor} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f7fb' }} edges={['top']}>
          <View style={s.editorHeader}>
            <TouchableOpacity onPress={() => setShowEditor(false)}>
              <Feather name="x" size={22} color="#1d2944" />
            </TouchableOpacity>
            <Text style={s.editorTitle}>{selectedArticle ? 'Chỉnh sửa bài viết' : 'Bài viết mới'}</Text>
            <TouchableOpacity style={s.saveBtn} onPress={handleSaveArticle}>
              <Text style={s.saveBtnText}>Lưu</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <Text style={s.fieldLabel}>Danh mục</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 16 }} style={{ maxHeight: 40, flexGrow: 0 }}>
              {Object.keys(CAT_COLOR).map(cat => (
                <TouchableOpacity key={cat} style={[s.catChip, editCat === cat && s.catChipActive]} onPress={() => setEditCat(cat)}>
                  <Text style={[s.catChipText, editCat === cat && { color: '#2740BA', fontWeight: '700' }]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={s.fieldLabel}>Tiêu đề *</Text>
            <TextInput
              style={s.fieldInput}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Nhập tiêu đề bài viết..."
              placeholderTextColor="#a8b2c8"
              multiline
            />
            <Text style={s.fieldLabel}>Nội dung / Tóm tắt</Text>
            <TextInput
              style={[s.fieldInput, { minHeight: 160, textAlignVertical: 'top' }]}
              value={editExcerpt}
              onChangeText={setEditExcerpt}
              placeholder="Nhập nội dung bài viết..."
              placeholderTextColor="#a8b2c8"
              multiline
            />
            <View style={s.editorActions}>
              <TouchableOpacity style={s.draftBtn} onPress={handleSaveArticle}>
                <Feather name="save" size={14} color="#6b7694" />
                <Text style={s.draftBtnText}>Lưu nháp</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.publishBtn} onPress={() => { setShowEditor(false); Alert.alert('Đã đăng', 'Bài viết đã được xuất bản.'); }}>
                <Feather name="send" size={14} color="#fff" />
                <Text style={s.publishBtnText}>Xuất bản</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fb' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  backBtn: { padding: 4 },
  title: { fontSize: 18, fontWeight: '700', color: '#1d2944', letterSpacing: -0.5 },
  subtitle: { fontSize: 11, color: '#6b7694', marginTop: 1 },
  addBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#2740BA', alignItems: 'center', justifyContent: 'center' },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e4e8f0' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#2740BA' },
  tabText: { fontSize: 13, color: '#6b7694', fontWeight: '500' },
  tabTextActive: { color: '#2740BA', fontWeight: '700' },

  articleCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 12,
    borderWidth: 1, borderColor: '#e4e8f0',
    shadowColor: '#1d2944', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  articleHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  catBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  catBadgeText: { fontSize: 10, fontWeight: '600' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  pub: { backgroundColor: '#e8f5ed' },
  draft: { backgroundColor: '#fff4d4' },
  statusText: { fontSize: 10, fontWeight: '600' },
  articleTitle: { fontSize: 13, fontWeight: '700', color: '#1d2944', lineHeight: 19, marginBottom: 5 },
  articleExcerpt: { fontSize: 11, color: '#6b7694', lineHeight: 16, marginBottom: 8 },
  articleMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  metaText: { fontSize: 10, color: '#a8b2c8' },
  articleActions: { flexDirection: 'row', gap: 8 },
  actionChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: '#edf0ff' },
  actionChipText: { fontSize: 11, fontWeight: '600', color: '#2740BA' },

  bannerInfo: { flexDirection: 'row', gap: 8, backgroundColor: '#f3f8ff', borderRadius: 10, padding: 10, marginBottom: 12, borderWidth: 1, borderColor: '#c9ddf4' },
  bannerInfoText: { flex: 1, fontSize: 11, color: '#2740BA', lineHeight: 16 },
  bannerCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#e4e8f0',
    shadowColor: '#1d2944', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  bannerInactive: { opacity: 0.6 },
  bannerOrder: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#f0f2f8', alignItems: 'center', justifyContent: 'center' },
  bannerOrderText: { fontSize: 12, fontWeight: '700', color: '#6b7694' },
  bannerHead: { flexDirection: 'row', marginBottom: 4 },
  bannerType: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  bannerTypeText: { fontSize: 9, fontWeight: '700' },
  bannerTitle: { fontSize: 12, fontWeight: '600', color: '#1d2944', lineHeight: 16 },
  bannerSub: { fontSize: 10, color: '#6b7694', marginTop: 2 },
  bannerRight: { alignItems: 'center', gap: 6 },
  bannerEdit: { padding: 4 },
  addBannerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 48, borderRadius: 14, borderWidth: 2, borderStyle: 'dashed', borderColor: '#c9ddf4', backgroundColor: '#f3f8ff' },
  addBannerText: { fontSize: 13, fontWeight: '600', color: '#2740BA' },

  editorHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#e4e8f0', backgroundColor: '#fff' },
  editorTitle: { fontSize: 15, fontWeight: '700', color: '#1d2944' },
  saveBtn: { backgroundColor: '#2740BA', paddingHorizontal: 16, paddingVertical: 7, borderRadius: 8 },
  saveBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
  fieldLabel: { fontSize: 11, fontWeight: '700', color: '#34405a', marginBottom: 8 },
  fieldInput: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e4e8f0', padding: 12, fontSize: 13, color: '#1d2944', marginBottom: 16 },
  catChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e4e8f0' },
  catChipActive: { backgroundColor: '#edf0ff', borderColor: '#2740BA' },
  catChipText: { fontSize: 11, color: '#6b7694' },
  editorActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  draftBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#e4e8f0' },
  draftBtnText: { fontSize: 13, fontWeight: '600', color: '#6b7694' },
  publishBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 48, borderRadius: 12, backgroundColor: '#2740BA' },
  publishBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
});
