import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Alert, Switch, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useColors } from '@/hooks/useColors';

/* ─── Mock Data ─────────────────────────────────────────────── */
interface Article {
  id: string; title: string; category: string; status: 'published' | 'draft';
  author: string; date: string; views: number; excerpt: string; imageUri?: string;
}

const ARTICLES: Article[] = [
  { id: 'A1', title: 'Đồng Nai triển khai hệ thống truy xuất nguồn gốc toàn tỉnh', category: 'Tin tức', status: 'published', author: 'Ban Biên Tập', date: '2024-08-01', views: 2341, excerpt: 'UBND tỉnh Đồng Nai chính thức ra mắt cổng truy xuất nguồn gốc sản phẩm địa phương...', imageUri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=450&fit=crop' },
  { id: 'A2', title: 'Hướng dẫn đăng ký doanh nghiệp trên hệ thống TraceMark', category: 'Hướng dẫn', status: 'published', author: 'Phòng Kỹ Thuật', date: '2024-07-28', views: 1823, excerpt: 'Bước 1: Chuẩn bị hồ sơ đăng ký kinh doanh, mã số thuế hợp lệ...', imageUri: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=450&fit=crop' },
  { id: 'A3', title: 'Lễ trao chứng nhận VietGAP đợt 2 năm 2024 cho HTX Tân Triều', category: 'Sự kiện', status: 'published', author: 'Ban Biên Tập', date: '2024-07-20', views: 987, excerpt: 'Sáng ngày 20/7, Sở NN&PTNT tỉnh Đồng Nai đã tổ chức lễ trao chứng nhận...', imageUri: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=450&fit=crop' },
  { id: 'A4', title: 'Cập nhật tính năng mới: Tích hợp QR đa năng và bản đồ vùng trồng', category: 'Thông báo', status: 'draft', author: 'Phòng Kỹ Thuật', date: '2024-08-05', views: 0, excerpt: 'Phiên bản 2.1.0 sẽ mang đến nhiều cải tiến quan trọng về tính năng quét QR và hiển thị...', imageUri: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop' },
  { id: 'A5', title: 'Kết quả kiểm tra an toàn vệ sinh thực phẩm Q2/2024 tại Đồng Nai', category: 'Báo cáo', status: 'published', author: 'Sở Y Tế', date: '2024-07-10', views: 1245, excerpt: 'Kết quả kiểm tra 247 cơ sở sản xuất, chế biến thực phẩm trong Q2/2024...', imageUri: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=450&fit=crop' },
];

interface Banner {
  id: string;
  title: string;
  link: string;
  active: boolean;
  emoji: string;
  bg: string;
  imageUri?: string;
  startDate?: string;
  endDate?: string;
}

const INITIAL_BANNERS: Banner[] = [
  { id: 'BN-001', title: 'Chào mừng đến Đồng Nai Trace', link: 'https://dongnaitrace.vn', active: true, emoji: '🎉', bg: '#edf0ff' },
  { id: 'BN-002', title: 'Đăng ký doanh nghiệp ngay hôm nay', link: '/register', active: true, emoji: '🏢', bg: '#fff4ed' },
  { id: 'BN-003', title: 'Tra cứu nguồn gốc sản phẩm OCOP', link: '/trace', active: false, emoji: '🔍', bg: '#e8f5ed' },
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
  const colors = useColors();
  const [activeTab, setActiveTab] = useState<Tab>('Tin tức');
  const [articles, setArticles] = useState<Article[]>(ARTICLES);
  const [articleCategory, setArticleCategory] = useState('Tất cả');
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [showEditor, setShowEditor] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editExcerpt, setEditExcerpt] = useState('');
  const [editCat, setEditCat] = useState('Tin tức');
  const [editImageUri, setEditImageUri] = useState<string | undefined>();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showBannerEditor, setShowBannerEditor] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerLink, setBannerLink] = useState('');
  const [bannerImageUri, setBannerImageUri] = useState<string | undefined>();
  const [bannerStartDate, setBannerStartDate] = useState('');
  const [bannerEndDate, setBannerEndDate] = useState('');

  const toggleBanner = (id: string) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  const openBannerEditor = (banner?: Banner) => {
    setSelectedBanner(banner ?? null);
    setBannerTitle(banner?.title ?? '');
    setBannerLink(banner?.link ?? '');
    setBannerImageUri(banner?.imageUri);
    setBannerStartDate(banner?.startDate ?? '');
    setBannerEndDate(banner?.endDate ?? '');
    setShowBannerEditor(true);
  };

  const pickBannerImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Cần quyền truy cập', 'Cho phép Đồng Nai Trace truy cập thư viện ảnh để chọn hình banner.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 7],
      quality: 0.9,
    });
    if (!result.canceled) {
      setBannerImageUri(result.assets[0]?.uri);
    }
  };

  const handleSaveBanner = () => {
    if (!bannerTitle.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên banner.');
      return;
    }

    if (selectedBanner) {
      setBanners(prev => prev.map(b => b.id === selectedBanner.id ? {
        ...b,
        title: bannerTitle.trim(),
        link: bannerLink.trim(),
        imageUri: bannerImageUri,
        startDate: bannerStartDate.trim(),
        endDate: bannerEndDate.trim(),
      } : b));
      Alert.alert('Đã cập nhật', 'Banner đã được cập nhật.');
    } else {
      const nextNumber = banners.reduce((max, banner) => {
        const number = Number(banner.id.replace('BN-', ''));
        return Number.isFinite(number) ? Math.max(max, number) : max;
      }, 0) + 1;
      setBanners(prev => [...prev, {
        id: `BN-${String(nextNumber).padStart(3, '0')}`,
        title: bannerTitle.trim(),
        link: bannerLink.trim(),
        active: true,
        emoji: '▧',
        bg: '#edf0ff',
        imageUri: bannerImageUri,
        startDate: bannerStartDate.trim(),
        endDate: bannerEndDate.trim(),
      }]);
      Alert.alert('Đã thêm', 'Banner mới đã được thêm và đang hiển thị.');
    }
    setShowBannerEditor(false);
  };

  const handleDeleteBanner = (banner: Banner) => {
    Alert.alert(
      'Xóa banner',
      `Bạn có chắc muốn xóa "${banner.title}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            setBanners(prev => prev.filter(item => item.id !== banner.id));
            Alert.alert('Đã xóa', 'Banner đã được xóa khỏi danh sách.');
          },
        },
      ],
    );
  };

  const handleNewArticle = () => {
    setEditTitle('');
    setEditExcerpt('');
    setEditCat('Tin tức');
    setEditImageUri(undefined);
    setSelectedArticle(null);
    setShowEditor(true);
  };

  const openArticleEditor = (article: Article) => {
    setSelectedArticle(article);
    setEditTitle(article.title);
    setEditExcerpt(article.excerpt);
    setEditCat(article.category);
    setEditImageUri(article.imageUri);
    setShowEditor(true);
  };

  const pickArticleImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Cần quyền truy cập', 'Cho phép ứng dụng truy cập thư viện ảnh để chọn ảnh bài viết.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.9,
    });
    if (!result.canceled) setEditImageUri(result.assets[0]?.uri);
  };

  const handleSaveArticle = (publish = false) => {
    if (!editTitle.trim()) { Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề bài viết.'); return; }
    if (selectedArticle) {
      setArticles(current => current.map(article => article.id === selectedArticle.id ? {
        ...article,
        title: editTitle.trim(),
        excerpt: editExcerpt.trim(),
        category: editCat,
        imageUri: editImageUri,
        status: publish ? 'published' : article.status,
      } : article));
    } else {
      setArticles(current => [...current, {
        id: `A${current.length + 1}`,
        title: editTitle.trim(),
        excerpt: editExcerpt.trim(),
        category: editCat,
        imageUri: editImageUri,
        status: publish ? 'published' : 'draft',
        author: 'Ban Biên Tập',
        date: new Date().toISOString().slice(0, 10),
        views: 0,
      }]);
    }
    Alert.alert('Thành công', publish ? 'Bài viết đã được xuất bản.' : 'Bài viết đã được lưu thành bản nháp.');
    setShowEditor(false);
  };

  const visibleArticles = articleCategory === 'Tất cả'
    ? articles
    : articles.filter(article => article.category === articleCategory);

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
        {activeTab === 'Tin tức' ? (
          <TouchableOpacity style={s.addBtn} onPress={handleNewArticle}>
            <Feather name="plus" size={16} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={s.addBtn} onPress={() => openBannerEditor()}>
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
          <Text style={s.sectionLabel}>Chuyên mục</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.categoryFilterRow} style={s.horizontalFilter}>
            {['Tất cả', ...Object.keys(CAT_COLOR)].map(category => (
              <TouchableOpacity key={category} style={[s.categoryFilter, articleCategory === category && s.categoryFilterActive]} onPress={() => setArticleCategory(category)}>
                <Text style={[s.categoryFilterText, articleCategory === category && s.categoryFilterTextActive]}>{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={s.articleCountRow}>
            <Text style={s.articleCount}>{visibleArticles.length} bài viết</Text>
            <Text style={s.articleCountHint}>Tin tức & nội dung</Text>
          </View>
          {visibleArticles.map(art => {
            const cc = CAT_COLOR[art.category] || { bg: '#f5f7fb', text: '#6b7694' };
            return (
              <TouchableOpacity key={art.id} style={s.articleCard} activeOpacity={0.85}
                onPress={() => openArticleEditor(art)}>
                {art.imageUri ? <Image source={{ uri: art.imageUri }} style={s.articleImage} resizeMode="cover" /> : <View style={s.articleImagePlaceholder}><Feather name="image" size={22} color="#a8b2c8" /></View>}
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
                    onPress={() => Alert.alert('Xóa bài viết', `Bạn có chắc muốn xóa "${art.title}"?`, [{ text: 'Hủy' }, { text: 'Xóa', style: 'destructive', onPress: () => setArticles(current => current.filter(article => article.id !== art.id)) }])}>
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
              Bật/tắt để ẩn banner khỏi cổng thông tin. Chạm Sửa để cập nhật nội dung, link hoặc hình ảnh.
            </Text>
          </View>
          <View style={s.bannerCountRow}>
            <Text style={s.bannerCount}>Banner hiện có ({banners.length})</Text>
            <Text style={s.bannerCountHint}>{banners.filter(b => b.active).length} đang hiển thị</Text>
          </View>
          {banners.map((banner) => (
            <View key={banner.id} style={[s.bannerCard, !banner.active && s.bannerInactive]}>
              <View style={{ flex: 1 }}>
                <View style={s.bannerPreview}>
                  {banner.imageUri ? (
                    <Image source={{ uri: banner.imageUri }} style={s.bannerImage} resizeMode="cover" />
                  ) : (
                    <Feather name="image" size={22} color={banner.active ? '#2740BA' : '#a8b2c8'} />
                  )}
                  <View style={s.bannerPreviewOverlay}>
                    <Text style={s.bannerPreviewId}>{banner.id}</Text>
                  </View>
                </View>
                <Text style={[s.bannerTitle, !banner.active && { color: '#a8b2c8' }]}>{banner.title}</Text>
                <Text style={s.bannerSub} numberOfLines={1}>{banner.link || 'Chưa có link liên kết'}</Text>
                {(banner.startDate || banner.endDate) && (
                  <Text style={s.bannerDates}>
                    {banner.startDate || 'Không giới hạn'} → {banner.endDate || 'Không giới hạn'}
                  </Text>
                )}
              </View>
              <View style={s.bannerRight}>
                <Switch
                  value={banner.active}
                  onValueChange={() => toggleBanner(banner.id)}
                  trackColor={{ false: '#e4e8f0', true: '#2740BA' }}
                  thumbColor="#fff"
                  style={{ transform: [{ scale: 0.8 }] }}
                />
                <TouchableOpacity style={s.bannerEdit} onPress={() => openBannerEditor(banner)} accessibilityLabel={`Sửa ${banner.title}`}>
                  <Feather name="edit-2" size={12} color="#6b7694" />
                </TouchableOpacity>
                <TouchableOpacity style={s.bannerDelete} onPress={() => handleDeleteBanner(banner)} accessibilityLabel={`Xóa ${banner.title}`}>
                  <Feather name="trash-2" size={12} color="#c0392b" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <TouchableOpacity style={s.addBannerBtn} onPress={() => openBannerEditor()}>
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
            <TouchableOpacity style={s.saveBtn} onPress={() => handleSaveArticle(false)}>
              <Text style={s.saveBtnText}>Lưu</Text>
            </TouchableOpacity>
          </View>
          <KeyboardAwareScrollViewCompat
            contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
            bottomOffset={80}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={s.fieldLabel}>Danh mục</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 16, alignItems: 'center' }} style={{ maxHeight: 40, flexGrow: 0 }}>
              {Object.keys(CAT_COLOR).map(cat => (
                <TouchableOpacity key={cat} style={[s.catChip, editCat === cat && s.catChipActive]} onPress={() => setEditCat(cat)}>
                  <Text style={[s.catChipText, editCat === cat && { color: '#2740BA', fontWeight: '700' }]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={s.fieldLabel}>Ảnh đại diện</Text>
            <TouchableOpacity style={s.articleImagePicker} onPress={pickArticleImage} activeOpacity={0.8}>
              {editImageUri ? (
                <>
                  <Image source={{ uri: editImageUri }} style={s.selectedArticleImage} resizeMode="cover" />
                  <View style={s.changeImageBadge}>
                    <Feather name="camera" size={13} color="#fff" />
                    <Text style={s.changeImageText}>Đổi ảnh</Text>
                  </View>
                </>
              ) : (
                <>
                  <Feather name="image" size={24} color="#a8b2c8" />
                  <Text style={s.imagePickerText}>Chạm để chọn ảnh bài viết</Text>
                  <Text style={s.imagePickerHint}>Tỉ lệ đề xuất 16:9</Text>
                </>
              )}
            </TouchableOpacity>
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
              <TouchableOpacity style={s.draftBtn} onPress={() => handleSaveArticle(false)}>
                <Feather name="save" size={14} color="#6b7694" />
                <Text style={s.draftBtnText}>Lưu nháp</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.publishBtn} onPress={() => handleSaveArticle(true)}>
                <Feather name="send" size={14} color="#fff" />
                <Text style={s.publishBtnText}>Xuất bản</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollViewCompat>
        </SafeAreaView>
      </Modal>

      {/* Banner Editor Modal */}
      <Modal visible={showBannerEditor} animationType="slide" onRequestClose={() => setShowBannerEditor(false)}>
        <SafeAreaView style={[s.bannerEditorSafe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
          <View style={s.editorHeader}>
            <TouchableOpacity onPress={() => setShowBannerEditor(false)} style={s.iconButton} accessibilityLabel="Đóng">
              <Feather name="x" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={s.editorTitle}>{selectedBanner ? 'Chỉnh sửa banner' : 'Thêm banner mới'}</Text>
            <TouchableOpacity style={s.saveBtn} onPress={handleSaveBanner}>
              <Text style={s.saveBtnText}>Lưu</Text>
            </TouchableOpacity>
          </View>
          <KeyboardAwareScrollViewCompat
            contentContainerStyle={s.bannerEditorContent}
            bottomOffset={80}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={s.fieldLabel}>Tên banner *</Text>
            <TextInput
              style={s.fieldInput}
              value={bannerTitle}
              onChangeText={setBannerTitle}
              placeholder="Nhập tên banner..."
              placeholderTextColor={colors.textPlaceholder}
              returnKeyType="next"
            />

            <Text style={s.fieldLabel}>Hình ảnh</Text>
            <TouchableOpacity style={s.imagePicker} onPress={pickBannerImage} activeOpacity={0.8}>
              {bannerImageUri ? (
                <>
                  <Image source={{ uri: bannerImageUri }} style={s.selectedBannerImage} resizeMode="cover" />
                  <View style={s.changeImageBadge}>
                    <Feather name="camera" size={13} color="#fff" />
                    <Text style={s.changeImageText}>Đổi ảnh</Text>
                  </View>
                </>
              ) : (
                <>
                  <Feather name="image" size={24} color={colors.textPlaceholder} />
                  <Text style={s.imagePickerText}>Chạm để chọn ảnh từ thư viện</Text>
                  <Text style={s.imagePickerHint}>Tỉ lệ đề xuất 16:7</Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={s.fieldLabel}>Link liên kết</Text>
            <TextInput
              style={s.fieldInput}
              value={bannerLink}
              onChangeText={setBannerLink}
              placeholder="https://... hoặc /duong-dan"
              placeholderTextColor={colors.textPlaceholder}
              autoCapitalize="none"
              keyboardType="url"
              returnKeyType="next"
            />

            <Text style={s.fieldLabel}>Thời gian hiển thị <Text style={s.optionalLabel}>(không bắt buộc)</Text></Text>
            <View style={s.dateRow}>
              <View style={s.dateField}>
                <Text style={s.dateLabel}>Ngày bắt đầu</Text>
                <TextInput
                  style={s.dateInput}
                  value={bannerStartDate}
                  onChangeText={setBannerStartDate}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor={colors.textPlaceholder}
                  keyboardType="numbers-and-punctuation"
                />
              </View>
              <View style={s.dateField}>
                <Text style={s.dateLabel}>Ngày kết thúc</Text>
                <TextInput
                  style={s.dateInput}
                  value={bannerEndDate}
                  onChangeText={setBannerEndDate}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor={colors.textPlaceholder}
                  keyboardType="numbers-and-punctuation"
                />
              </View>
            </View>

            <View style={s.bannerFormNote}>
              <Feather name="check-circle" size={15} color={colors.success} />
              <Text style={s.bannerFormNoteText}>
                Banner mới sẽ được bật hiển thị ngay sau khi lưu. Bạn có thể tắt banner bất cứ lúc nào từ danh sách.
              </Text>
            </View>
            <TouchableOpacity style={s.bannerSaveButton} onPress={handleSaveBanner}>
              <Feather name="save" size={15} color="#fff" />
              <Text style={s.bannerSaveButtonText}>{selectedBanner ? 'Lưu thay đổi' : 'Thêm banner'}</Text>
            </TouchableOpacity>
          </KeyboardAwareScrollViewCompat>
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
  sectionLabel: { fontSize: 10, fontWeight: '700', color: '#6b7694', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 7 },
  horizontalFilter: { flexGrow: 0, maxHeight: 42, marginBottom: 12 },
  categoryFilterRow: { gap: 7, alignItems: 'center' },
  categoryFilter: { paddingHorizontal: 11, paddingVertical: 7, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e4e8f0' },
  categoryFilterActive: { backgroundColor: '#2740BA', borderColor: '#2740BA' },
  categoryFilterText: { fontSize: 10, fontWeight: '600', color: '#6b7694' },
  categoryFilterTextActive: { color: '#fff' },
  articleCountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 },
  articleCount: { fontSize: 12, fontWeight: '700', color: '#1d2944' },
  articleCountHint: { fontSize: 10, color: '#a8b2c8' },
  articleImage: { width: '100%', height: 128, borderRadius: 10, marginBottom: 11, backgroundColor: '#f0f2f8' },
  articleImagePlaceholder: { width: '100%', height: 128, borderRadius: 10, marginBottom: 11, backgroundColor: '#f0f2f8', alignItems: 'center', justifyContent: 'center' },
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
  bannerCountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  bannerCount: { fontSize: 13, fontWeight: '700', color: '#1d2944' },
  bannerCountHint: { fontSize: 10, color: '#1f7a45', fontWeight: '600' },
  bannerCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#e4e8f0',
    shadowColor: '#1d2944', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  bannerInactive: { opacity: 0.6 },
  bannerPreview: { height: 76, borderRadius: 10, backgroundColor: '#edf0ff', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 10 },
  bannerImage: { width: '100%', height: '100%' },
  bannerPreviewOverlay: { position: 'absolute', right: 7, top: 6, backgroundColor: 'rgba(29,41,68,.68)', borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2 },
  bannerPreviewId: { color: '#fff', fontSize: 9, fontWeight: '700' },
  bannerTitle: { fontSize: 12, fontWeight: '600', color: '#1d2944', lineHeight: 16 },
  bannerSub: { fontSize: 10, color: '#6b7694', marginTop: 2 },
  bannerDates: { fontSize: 9, color: '#a8b2c8', marginTop: 4 },
  bannerRight: { alignItems: 'center', gap: 6 },
  bannerEdit: { padding: 7, borderRadius: 8, backgroundColor: '#edf0ff' },
  bannerDelete: { padding: 7, borderRadius: 8, backgroundColor: '#fef0f0' },
  addBannerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 48, borderRadius: 14, borderWidth: 2, borderStyle: 'dashed', borderColor: '#c9ddf4', backgroundColor: '#f3f8ff' },
  addBannerText: { fontSize: 13, fontWeight: '600', color: '#2740BA' },

  bannerEditorSafe: { flex: 1 },
  bannerEditorContent: { padding: 16, paddingBottom: 32 },
  iconButton: { padding: 4 },
  optionalLabel: { color: '#a8b2c8', fontWeight: '400' },
  imagePicker: { height: 142, borderRadius: 14, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#c9ddf4', backgroundColor: '#f3f8ff', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 16 },
  selectedBannerImage: { width: '100%', height: '100%' },
  changeImageBadge: { position: 'absolute', flexDirection: 'row', alignItems: 'center', gap: 5, bottom: 10, backgroundColor: 'rgba(29,41,68,.78)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  changeImageText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  imagePickerText: { color: '#6b7694', fontSize: 12, fontWeight: '600', marginTop: 8 },
  imagePickerHint: { color: '#a8b2c8', fontSize: 10, marginTop: 4 },
  dateRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  dateField: { flex: 1 },
  dateLabel: { fontSize: 10, color: '#6b7694', marginBottom: 6 },
  dateInput: { height: 46, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e4e8f0', paddingHorizontal: 12, fontSize: 12, color: '#1d2944' },
  bannerFormNote: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', backgroundColor: '#e8f5ed', borderRadius: 12, padding: 12, marginTop: 4, marginBottom: 18 },
  bannerFormNoteText: { flex: 1, color: '#1f7a45', fontSize: 11, lineHeight: 16 },
  bannerSaveButton: { height: 48, borderRadius: 12, backgroundColor: '#E8650A', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  bannerSaveButtonText: { color: '#fff', fontSize: 13, fontWeight: '700' },

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
  articleImagePicker: { height: 142, borderRadius: 14, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#c9ddf4', backgroundColor: '#f3f8ff', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 16 },
  selectedArticleImage: { width: '100%', height: '100%' },
  draftBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#e4e8f0' },
  draftBtnText: { fontSize: 13, fontWeight: '600', color: '#6b7694' },
  publishBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 48, borderRadius: 12, backgroundColor: '#2740BA' },
  publishBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
});
