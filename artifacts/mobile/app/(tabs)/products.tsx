import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Linking,
  Modal,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';

type ProductStatus = 'approved' | 'pending';
type ProductTab = 'basic' | 'trace';

type TraceStep = {
  title: string;
  date: string;
  description: string;
  image: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  color: string;
  done: boolean;
};

type Product = {
  id: string;
  name: string;
  company: string;
  sector: string;
  status: ProductStatus;
  unit: string;
  region: string;
  category: string;
  certifications: string[];
  description: string;
  imageUrl: string;
  images: string[];
  hasTrace: boolean;
  traceSteps: TraceStep[];
};

const PRODUCT_IMAGES = {
  pomelo: [
    'https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=800&h=560&fit=crop',
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&h=560&fit=crop',
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=560&fit=crop',
  ],
  honey: [
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&h=560&fit=crop',
    'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&h=560&fit=crop',
  ],
  fish: [
    'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=800&h=560&fit=crop',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=560&fit=crop',
  ],
  dragonFruit: [
    'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&h=560&fit=crop',
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=560&fit=crop',
  ],
  durian: [
    'https://images.unsplash.com/photo-1600423115367-87ea7661688f?w=800&h=560&fit=crop',
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=560&fit=crop',
  ],
  shrimp: [
    'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&h=560&fit=crop',
    'https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=800&h=560&fit=crop',
  ],
  coffee: [
    'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=560&fit=crop',
    'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=800&h=560&fit=crop',
  ],
  pepper: [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=560&fit=crop',
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=560&fit=crop',
  ],
};

const TRACE_STEPS: TraceStep[] = [
  {
    title: 'Gieo trồng / Nuôi trồng',
    date: '10/01/2025',
    description: 'Giống được kiểm định và gieo trồng tại vùng canh tác đã đăng ký.',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=500&fit=crop',
    icon: 'sun',
    color: '#1f7a45',
    done: true,
  },
  {
    title: 'Chăm sóc',
    date: '08/07/2024',
    description: 'Tưới nước, bón phân hữu cơ theo lịch, kiểm tra sâu bệnh định kỳ.',
    image: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=800&h=500&fit=crop',
    icon: 'sunrise',
    color: '#2e9fbf',
    done: true,
  },
  {
    title: 'Thu hoạch',
    date: '20/04/2025',
    description: 'Thu hoạch đúng độ chín, không sử dụng chất bảo quản sau thu hoạch.',
    image: 'https://images.unsplash.com/photo-1588165171080-c89acfa5ee83?w=800&h=500&fit=crop',
    icon: 'package',
    color: '#E8650A',
    done: true,
  },
  {
    title: 'Sơ chế / Đóng gói',
    date: '22/04/2025',
    description: 'Phân loại, làm sạch và đóng gói tại kho sơ chế đạt chuẩn VSATTP.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=500&fit=crop',
    icon: 'box',
    color: '#7c3aed',
    done: true,
  },
  {
    title: 'Vận chuyển',
    date: '25/04/2025',
    description: 'Vận chuyển bằng xe lạnh đạt chuẩn.',
    image: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800&h=500&fit=crop',
    icon: 'truck',
    color: '#2740BA',
    done: true,
  },
  {
    title: 'Phân phối',
    date: '27/04/2025',
    description: 'Phân phối đến các điểm bán lẻ.',
    image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=800&h=500&fit=crop',
    icon: 'shopping-bag',
    color: '#0e7c7c',
    done: false,
  },
];

const makeProduct = (
  id: string,
  name: string,
  company: string,
  sector: string,
  status: ProductStatus,
  unit: string,
  region: string,
  certifications: string[],
  category: string,
  description: string,
  images: string[],
  hasTrace = false,
): Product => ({
  id,
  name,
  company,
  sector,
  status,
  unit,
  region,
  certifications,
  category,
  description,
  imageUrl: images[0],
  images,
  hasTrace,
  traceSteps: TRACE_STEPS,
});

const INITIAL_PRODUCTS: Product[] = [
  makeProduct('SP-001', 'Bưởi Tân Triều', 'Cơ sở Bưởi Tân Triều', 'OCOP', 'approved', 'kg', 'Vĩnh Cửu', ['OCOP 4★', 'VietGAP'], 'Trái cây', 'Bưởi Tân Triều – đặc sản nổi tiếng vùng Vĩnh Cửu, được trồng theo quy trình VietGAP, không thuốc trừ sâu hóa học. Vỏ mỏng, múi ngọt thanh, mọng nước, đạt chuẩn OCOP 4 sao.', PRODUCT_IMAGES.pomelo, true),
  makeProduct('SP-002', 'Mật ong rừng Định Quán', 'HTX Ong Mật Định Quán', 'Nông sản', 'pending', 'lọ', 'Định Quán', ['OCOP 3★'], 'Thực phẩm', 'Mật ong nguyên chất từ rừng nguyên sinh Định Quán, thu hoạch thủ công theo mùa, không pha trộn. Giàu enzyme tự nhiên, màu vàng hổ phách, hương thơm đặc trưng.', PRODUCT_IMAGES.honey),
  makeProduct('SP-003', 'Cá điêu hồng Nhơn Trạch', 'Trại thủy sản NT', 'Thủy sản', 'approved', 'kg', 'Nhơn Trạch', ['VietGAP'], 'Thủy sản', 'Cá điêu hồng nuôi ao lồng tại Nhơn Trạch, thức ăn đạt chuẩn, không sử dụng chất kháng sinh cấm. Thịt chắc, thơm ngon, đạt tiêu chuẩn VietGAP.', PRODUCT_IMAGES.fish),
  makeProduct('SP-004', 'Thanh long ruột đỏ', 'Nông trại Long Thành', 'Nông sản', 'approved', 'kg', 'Long Thành', [], 'Trái cây', 'Thanh long ruột đỏ trồng tại Long Thành, thu hoạch theo vụ. Vỏ đỏ đẹp, ruột đỏ tươi, vị ngọt nhẹ.', PRODUCT_IMAGES.dragonFruit),
  makeProduct('SP-005', 'Sầu riêng Xuân Lộc', 'HTX Xuân Lộc', 'OCOP', 'approved', 'kg', 'Xuân Lộc', ['OCOP 4★', 'GlobalGAP'], 'Trái cây', 'Sầu riêng Ri6 và Musang King trồng tại Xuân Lộc, đất đỏ bazan giàu dinh dưỡng. Quy trình GlobalGAP, kiểm soát dư lượng thuốc BVTV chặt chẽ.', PRODUCT_IMAGES.durian, true),
  makeProduct('SP-006', 'Tôm thẻ chân trắng', 'Trại tôm Long Khánh', 'Thủy sản', 'pending', 'kg', 'Long Khánh', ['HACCP'], 'Thủy sản', 'Tôm thẻ chân trắng nuôi ao HDPE công nghệ cao tại Long Khánh. Kiểm soát vi sinh, không kháng sinh, đạt tiêu chuẩn HACCP.', PRODUCT_IMAGES.shrimp),
  makeProduct('SP-007', 'Cà phê Robusta Định Quán', 'Công ty TNHH Cà phê DNT', 'Nông sản', 'approved', 'kg', 'Định Quán', ['4C', 'Rainforest Alliance'], 'Nông sản', 'Cà phê Robusta trồng trên đất đỏ bazan Định Quán, độ cao 400–600m. Canh tác bền vững, không phá rừng.', PRODUCT_IMAGES.coffee),
  makeProduct('SP-008', 'Tiêu đen Vĩnh Cửu', 'HTX Tiêu Vĩnh Cửu', 'OCOP', 'approved', 'kg', 'Vĩnh Cửu', ['OCOP 3★', 'Organic'], 'Gia vị', 'Tiêu đen hữu cơ vùng Vĩnh Cửu, trồng theo phương pháp canh tác hữu cơ, không phân bón hóa học. Hạt chắc, mùi thơm nồng.', PRODUCT_IMAGES.pepper, true),
];

const REGIONS = ['Tất cả địa bàn', 'Vĩnh Cửu', 'Định Quán', 'Nhơn Trạch', 'Long Thành', 'Xuân Lộc', 'Long Khánh', 'Biên Hòa', 'Trảng Bom'];
const SECTORS = ['Tất cả ngành', 'OCOP', 'Nông sản', 'Thủy sản', 'Thực phẩm CB', 'Dược liệu', 'Chăn nuôi'];
const STATUS_OPTIONS: Array<{ key: 'all' | ProductStatus; label: string }> = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chờ duyệt' },
  { key: 'approved', label: 'Đã duyệt' },
];

function StatusBadge({ status, compact = false }: { status: ProductStatus; compact?: boolean }) {
  const colors = useColors();
  const approved = status === 'approved';
  return (
    <View style={[styles.statusBadge, { backgroundColor: approved ? colors.successLight : colors.warningLight, borderColor: approved ? colors.successBorder : colors.warningBorder }, compact && styles.statusBadgeCompact]}>
      <Feather name={approved ? 'check' : 'clock'} size={compact ? 10 : 12} color={approved ? colors.success : colors.warning} />
      <Text style={[styles.statusText, { color: approved ? colors.success : colors.warning }]}>{approved ? 'Đã duyệt' : 'Chờ duyệt'}</Text>
    </View>
  );
}

function ProductCard({ product, onPress, onDelete }: { product: Product; onPress: () => void; onDelete: () => void }) {
  const colors = useColors();
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.cardImageWrap}>
        <Image source={{ uri: product.imageUrl }} style={styles.cardImage} />
        <View style={styles.cardImageShade} />
        <View style={styles.cardStatus}><StatusBadge status={product.status} compact /></View>
        <View style={styles.cardCode}><Text style={styles.cardCodeText}>{product.id}</Text></View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardName} numberOfLines={2}>{product.name}</Text>
          <TouchableOpacity style={styles.moreButton} onPress={onDelete} hitSlop={8}>
            <Feather name="more-horizontal" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
        <Text style={styles.cardCompany} numberOfLines={1}>{product.company}</Text>
        <View style={styles.cardMetaRow}>
          <View style={styles.metaItem}><Feather name="map-pin" size={11} color={colors.textMuted} /><Text style={styles.metaText}>{product.region}</Text></View>
          <View style={styles.metaItem}><Feather name="layers" size={11} color={colors.textMuted} /><Text style={styles.metaText}>{product.sector}</Text></View>
        </View>
        <View style={styles.cardFooter}>
          <View style={styles.certRow}>
            {product.certifications.slice(0, 2).map(cert => <Text key={cert} style={styles.certPill}>{cert}</Text>)}
            {product.certifications.length > 2 && <Text style={styles.certMore}>+{product.certifications.length - 2}</Text>}
          </View>
          <Feather name="chevron-right" size={16} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

function ProductListRow({ product, onPress, onDelete }: { product: Product; onPress: () => void; onDelete: () => void }) {
  const colors = useColors();
  return (
    <TouchableOpacity style={styles.listRow} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: product.imageUrl }} style={styles.listImage} />
      <View style={styles.listContent}>
        <View style={styles.listTitleRow}>
          <Text style={styles.listName} numberOfLines={1}>{product.name}</Text>
          <TouchableOpacity onPress={onDelete} hitSlop={8}><Feather name="trash-2" size={15} color={colors.error} /></TouchableOpacity>
        </View>
        <Text style={styles.listCode}>{product.id} · {product.company}</Text>
        <View style={styles.listBottom}>
          <Text style={styles.listRegion}>{product.region} · {product.sector}</Text>
          <StatusBadge status={product.status} compact />
        </View>
      </View>
    </TouchableOpacity>
  );
}

function FilterSheet({
  visible,
  status,
  region,
  sector,
  onClose,
  onApply,
}: {
  visible: boolean;
  status: 'all' | ProductStatus;
  region: string;
  sector: string;
  onClose: () => void;
  onApply: (status: 'all' | ProductStatus, region: string, sector: string) => void;
}) {
  const colors = useColors();
  const [draftStatus, setDraftStatus] = useState(status);
  const [draftRegion, setDraftRegion] = useState(region);
  const [draftSector, setDraftSector] = useState(sector);

  const apply = () => {
    onApply(draftStatus, draftRegion, draftSector);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: colors.card }]}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <View><Text style={styles.sheetTitle}>Bộ lọc sản phẩm</Text><Text style={styles.sheetSubtitle}>Thu hẹp danh sách theo nhu cầu</Text></View>
            <TouchableOpacity onPress={onClose} hitSlop={10}><Feather name="x" size={20} color={colors.textMuted} /></TouchableOpacity>
          </View>
          <Text style={styles.filterLabel}>Trạng thái</Text>
          <View style={styles.optionWrap}>
            {STATUS_OPTIONS.map(option => (
              <TouchableOpacity key={option.key} style={[styles.option, { borderColor: draftStatus === option.key ? colors.primary : colors.cardBorder, backgroundColor: draftStatus === option.key ? colors.primaryLight : colors.card }]} onPress={() => setDraftStatus(option.key)}>
                <Text style={[styles.optionText, { color: draftStatus === option.key ? colors.primary : colors.textMuted }]}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.filterLabel}>Địa bàn</Text>
          <FlatList horizontal data={REGIONS} keyExtractor={item => item} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalOptions} renderItem={({ item }) => (
            <TouchableOpacity style={[styles.option, { borderColor: draftRegion === item ? colors.primary : colors.cardBorder, backgroundColor: draftRegion === item ? colors.primaryLight : colors.card }]} onPress={() => setDraftRegion(item)}>
              <Text style={[styles.optionText, { color: draftRegion === item ? colors.primary : colors.textMuted }]}>{item}</Text>
            </TouchableOpacity>
          )} />
          <Text style={styles.filterLabel}>Ngành hàng</Text>
          <FlatList horizontal data={SECTORS} keyExtractor={item => item} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalOptions} renderItem={({ item }) => (
            <TouchableOpacity style={[styles.option, { borderColor: draftSector === item ? colors.primary : colors.cardBorder, backgroundColor: draftSector === item ? colors.primaryLight : colors.card }]} onPress={() => setDraftSector(item)}>
              <Text style={[styles.optionText, { color: draftSector === item ? colors.primary : colors.textMuted }]}>{item}</Text>
            </TouchableOpacity>
          )} />
          <View style={styles.sheetActions}>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => { setDraftStatus('all'); setDraftRegion(REGIONS[0]); setDraftSector(SECTORS[0]); }}>
              <Text style={styles.secondaryButtonText}>Đặt lại</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={apply}>
              <Feather name="check" size={16} color={colors.primaryForeground} />
              <Text style={styles.primaryButtonText}>Áp dụng bộ lọc</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function QrModal({ product, visible, onClose }: { product: Product; visible: boolean; onClose: () => void }) {
  const colors = useColors();
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=360x360&data=${encodeURIComponent(`https://trace.dongnai.gov.vn/sp/${product.id}`)}&color=2740BA&bgcolor=ffffff&margin=12`;
  const publicUrl = `https://trace.dongnai.gov.vn/sp/${product.id}`;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.qrModal, { backgroundColor: colors.card }]}>
          <View style={styles.modalTopRow}>
            <View><Text style={styles.sheetTitle}>Mã QR sản phẩm</Text><Text style={styles.sheetSubtitle}>Mã truy xuất công khai</Text></View>
            <TouchableOpacity onPress={onClose} hitSlop={10}><Feather name="x" size={20} color={colors.textMuted} /></TouchableOpacity>
          </View>
          <Image source={{ uri: qrUrl }} style={styles.qrImage} />
          <Text style={styles.qrId}>{product.id}-DNT-2025</Text>
          <Text style={styles.qrName}>{product.name}</Text>
          <Text style={styles.qrHint}>Quét mã để xem thông tin truy xuất công khai</Text>
          <View style={styles.qrActions}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => Share.share({ message: `Thông tin truy xuất ${product.name}: ${publicUrl}` })}>
              <Feather name="share-2" size={15} color={colors.primaryForeground} />
              <Text style={styles.primaryButtonText}>Chia sẻ liên kết</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => Linking.openURL(publicUrl)}>
              <Feather name="external-link" size={15} color={colors.primary} />
              <Text style={styles.secondaryButtonText}>Mở trang công khai</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function EditModal({ product, visible, onClose, onSave }: { product: Product; visible: boolean; onClose: () => void; onSave: (product: Product) => void }) {
  const colors = useColors();
  const [name, setName] = useState(product.name);
  const [company, setCompany] = useState(product.company);
  const [region, setRegion] = useState(product.region);
  const [description, setDescription] = useState(product.description);

  const save = () => {
    if (!name.trim() || !company.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên sản phẩm và doanh nghiệp.');
      return;
    }
    onSave({ ...product, name: name.trim(), company: company.trim(), region: region.trim() || product.region, description: description.trim() || product.description });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.editSheet, { backgroundColor: colors.card }]}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <View><Text style={styles.sheetTitle}>Chỉnh sửa sản phẩm</Text><Text style={styles.sheetSubtitle}>{product.id}</Text></View>
            <TouchableOpacity onPress={onClose} hitSlop={10}><Feather name="x" size={20} color={colors.textMuted} /></TouchableOpacity>
          </View>
          <KeyboardAwareScrollViewCompat contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.inputLabel}>Tên sản phẩm</Text>
            <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Nhập tên sản phẩm" placeholderTextColor={colors.textPlaceholder} />
            <Text style={styles.inputLabel}>Doanh nghiệp</Text>
            <TextInput value={company} onChangeText={setCompany} style={styles.input} placeholder="Nhập tên doanh nghiệp" placeholderTextColor={colors.textPlaceholder} />
            <Text style={styles.inputLabel}>Khu vực</Text>
            <TextInput value={region} onChangeText={setRegion} style={styles.input} placeholder="Nhập khu vực" placeholderTextColor={colors.textPlaceholder} />
            <Text style={styles.inputLabel}>Mô tả sản phẩm</Text>
            <TextInput value={description} onChangeText={setDescription} style={[styles.input, styles.multilineInput]} multiline textAlignVertical="top" placeholder="Mô tả sản phẩm" placeholderTextColor={colors.textPlaceholder} />
            <TouchableOpacity style={styles.primaryButton} onPress={save}>
              <Feather name="save" size={16} color={colors.primaryForeground} />
              <Text style={styles.primaryButtonText}>Lưu thay đổi</Text>
            </TouchableOpacity>
          </KeyboardAwareScrollViewCompat>
        </View>
      </View>
    </Modal>
  );
}

function ProductDetail({ product, onBack, onDelete, onUpdate }: { product: Product; onBack: () => void; onDelete: () => void; onUpdate: (product: Product) => void }) {
  const colors = useColors();
  const [tab, setTab] = useState<ProductTab>('basic');
  const [imageIndex, setImageIndex] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const approved = product.status === 'approved';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.detailTopBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} hitSlop={8}><Feather name="arrow-left" size={20} color={colors.textPrimary} /></TouchableOpacity>
        <Text style={styles.detailTopTitle} numberOfLines={1}>Chi tiết sản phẩm</Text>
        <TouchableOpacity style={styles.detailTopAction} onPress={() => setShowEdit(true)} hitSlop={8}><Feather name="edit-2" size={17} color={colors.primary} /></TouchableOpacity>
      </View>
      <FlatList
        data={[product]}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.detailContent}
        renderItem={() => (
          <View>
            <View style={styles.detailHero}>
              <View style={styles.heroImageWrap}>
                <Image source={{ uri: product.images[imageIndex] }} style={styles.heroImage} />
                <TouchableOpacity style={[styles.heroArrow, styles.heroArrowLeft]} onPress={() => setImageIndex((imageIndex - 1 + product.images.length) % product.images.length)}><Feather name="chevron-left" size={20} color={colors.textPrimary} /></TouchableOpacity>
                <TouchableOpacity style={[styles.heroArrow, styles.heroArrowRight]} onPress={() => setImageIndex((imageIndex + 1) % product.images.length)}><Feather name="chevron-right" size={20} color={colors.textPrimary} /></TouchableOpacity>
                <View style={styles.heroStatus}><StatusBadge status={product.status} /></View>
              </View>
              <View style={styles.thumbnailRow}>
                {product.images.map((image, index) => <TouchableOpacity key={image} style={[styles.thumbnail, { borderColor: index === imageIndex ? colors.primary : colors.cardBorder }]} onPress={() => setImageIndex(index)}><Image source={{ uri: image }} style={styles.thumbnailImage} /></TouchableOpacity>)}
              </View>
              <View style={styles.detailTitleBlock}>
                <Text style={styles.detailName}>{product.name}</Text>
                <Text style={styles.detailCompany}>{product.company}</Text>
                <Text style={styles.detailIdentifier}>{product.id} · {product.region}</Text>
              </View>
            </View>

            {approved && (
              <View style={styles.tabBar}>
                <TouchableOpacity style={[styles.tabItem, tab === 'basic' && { borderBottomColor: colors.primary }]} onPress={() => setTab('basic')}><Text style={[styles.tabText, tab === 'basic' && { color: colors.primary }]}><Feather name="file-text" size={13} color={tab === 'basic' ? colors.primary : colors.textMuted} />  Thông tin</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.tabItem, tab === 'trace' && { borderBottomColor: colors.success }]} onPress={() => setTab('trace')}><Text style={[styles.tabText, tab === 'trace' && { color: colors.success }]}><Feather name="link-2" size={13} color={tab === 'trace' ? colors.success : colors.textMuted} />  Truy xuất</Text></TouchableOpacity>
              </View>
            )}

            {(!approved || tab === 'basic') && (
              <View>
                <View style={styles.infoCard}>
                  <Text style={styles.sectionTitle}>Thông tin sản phẩm</Text>
                  <View style={styles.infoGrid}>
                    {[
                      ['Danh mục', product.category, 'layers'],
                      ['Ngành hàng', product.sector, 'grid'],
                      ['Đơn vị tính', product.unit, 'box'],
                      ['Khu vực', product.region, 'map-pin'],
                      ['Mã sản phẩm', product.id, 'hash'],
                      ['Doanh nghiệp', product.company, 'briefcase'],
                    ].map(([label, value, icon]) => (
                      <View key={label} style={styles.infoCell}><Feather name={icon as React.ComponentProps<typeof Feather>['name']} size={13} color={colors.primary} /><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue} numberOfLines={2}>{value}</Text></View>
                    ))}
                  </View>
                  <Text style={styles.subsectionTitle}>Chứng nhận</Text>
                  <View style={styles.certWrap}>{product.certifications.length ? product.certifications.map(cert => <View key={cert} style={styles.detailCert}><Feather name="award" size={13} color={colors.primary} /><Text style={styles.detailCertText}>{cert}</Text></View>) : <Text style={styles.emptyText}>Chưa có chứng nhận</Text>}</View>
                  <Text style={styles.subsectionTitle}>Mô tả sản phẩm</Text>
                  <Text style={styles.description}>{product.description}</Text>
                </View>
                <View style={styles.actionCard}>
                  <View style={styles.actionHeader}><Text style={styles.sectionTitle}>Thao tác</Text><StatusBadge status={product.status} /></View>
                  {approved && <TouchableOpacity style={styles.qrAction} onPress={() => setShowQR(true)}><Feather name="maximize" size={17} color={colors.primary} /><Text style={styles.qrActionText}>Xem mã QR sản phẩm</Text><Feather name="chevron-right" size={17} color={colors.primary} /></TouchableOpacity>}
                  <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.secondaryButton} onPress={() => setShowEdit(true)}><Feather name="edit-2" size={15} color={colors.textSecondary} /><Text style={styles.secondaryButtonTextDark}>Chỉnh sửa</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={onDelete}><Feather name="trash-2" size={15} color={colors.error} /><Text style={styles.deleteButtonText}>Xóa</Text></TouchableOpacity>
                  </View>
                </View>
                {approved && !product.hasTrace && <View style={styles.emptyTrace}><Feather name="link-2" size={25} color={colors.textPlaceholder} /><Text style={styles.emptyTraceTitle}>Chưa có dữ liệu truy xuất</Text><Text style={styles.emptyTraceText}>Sản phẩm đã được duyệt nhưng chưa có đơn vị giải pháp đẩy dữ liệu lên.</Text></View>}
              </View>
            )}

            {approved && tab === 'trace' && (
              <View>
                <View style={styles.providerCard}><View><Text style={styles.infoLabel}>ĐƠN VỊ GIẢI PHÁP</Text><Text style={styles.providerName}>iTrace Việt Nam</Text><Text style={styles.providerUpdated}>Cập nhật lần cuối: 27/04/2025 · 14:32</Text></View><Image source={{ uri: product.imageUrl }} style={styles.providerImage} /></View>
                 <View style={styles.traceCard}><Text style={styles.sectionTitle}>Quy trình truy xuất</Text>{product.traceSteps.map((step, index) => <View key={step.title} style={styles.traceRow}><View style={styles.traceRail}><View style={[styles.traceCircle, { backgroundColor: step.done ? step.color : colors.lockedLight, borderColor: step.done ? step.color : colors.lockedBorder }]}><Feather name={step.icon} size={15} color={step.done ? '#fff' : colors.textMuted} /></View>{index < product.traceSteps.length - 1 && <View style={[styles.traceLine, { backgroundColor: step.done ? `${step.color}40` : colors.cardBorder }]} />}</View><View style={styles.traceCopy}><View style={styles.traceTitleRow}><Text style={styles.traceTitle}>{step.title}</Text>{!step.done && <Text style={styles.waitingPill}>Chờ cập nhật</Text>}</View><Text style={styles.traceDate}>{step.date}</Text><Text style={styles.traceDescription}>{step.description}</Text><Image source={{ uri: step.image }} style={styles.traceImage} /></View></View>)}</View>
                <View style={styles.docsCard}><View style={styles.docsHeader}><Text style={styles.sectionTitle}>Chứng nhận lô hàng</Text><Text style={styles.docsCount}>3 file</Text></View>{['Kết quả kiểm nghiệm lô hàng tháng 4/2025', 'Chứng nhận VietGAP – lô xuất tháng 4', 'Biên bản kiểm tra vùng trồng'].map(document => <View key={document} style={styles.docRow}><View style={styles.pdfBadge}><Text style={styles.pdfText}>PDF</Text></View><Text style={styles.docName} numberOfLines={1}>{document}</Text><TouchableOpacity hitSlop={8} onPress={() => Alert.alert('Tài liệu', 'Tài liệu sẽ được tải xuống khi kết nối kho lưu trữ được bật.')}><Feather name="download" size={16} color={colors.primary} /></TouchableOpacity></View>)}</View>
                <View style={styles.actionCard}><Text style={styles.sectionTitle}>Mã định danh sản phẩm</Text><View style={styles.identifierBox}><Feather name="maximize" size={15} color={colors.primary} /><Text style={styles.identifierText}>{product.id}-DNT-2025</Text></View><TouchableOpacity style={[styles.primaryButton, { marginTop: 12 }]} onPress={() => setShowQR(true)}><Feather name="maximize" size={15} color={colors.primaryForeground} /><Text style={styles.primaryButtonText}>Mở mã QR truy xuất</Text></TouchableOpacity></View>
              </View>
            )}
          </View>
        )}
      />
      <QrModal product={product} visible={showQR} onClose={() => setShowQR(false)} />
      <EditModal product={product} visible={showEdit} onClose={() => setShowEdit(false)} onSave={onUpdate} />
    </SafeAreaView>
  );
}

export default function ProductsScreen() {
  const colors = useColors();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | ProductStatus>('all');
  const [region, setRegion] = useState(REGIONS[0]);
  const [sector, setSector] = useState(SECTORS[0]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = useMemo(() => products.filter(product => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [product.name, product.company, product.id].some(value => value.toLowerCase().includes(query));
    return matchesSearch && (status === 'all' || product.status === status) && (region === REGIONS[0] || product.region === region) && (sector === SECTORS[0] || product.sector === sector);
  }), [products, search, status, region, sector]);

  const removeProduct = (product: Product) => {
    Alert.alert('Xóa sản phẩm', `Bạn có chắc muốn xóa “${product.name}”?`, [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => { setProducts(current => current.filter(item => item.id !== product.id)); setSelected(current => current?.id === product.id ? null : current); } },
    ]);
  };

  const exportData = async () => {
    const csv = ['Mã sản phẩm,Tên sản phẩm,Doanh nghiệp,Ngành hàng,Khu vực,Trạng thái', ...filtered.map(product => `${product.id},"${product.name}","${product.company}",${product.sector},${product.region},${product.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}`)].join('\n');
    await Share.share({ title: 'Danh sách sản phẩm', message: csv });
  };

  if (selected) return <ProductDetail product={selected} onBack={() => setSelected(null)} onDelete={() => removeProduct(selected)} onUpdate={updated => { setProducts(current => current.map(item => item.id === updated.id ? updated : item)); setSelected(updated); }} />;

  const activeFilterCount = (status !== 'all' ? 1 : 0) + (region !== REGIONS[0] ? 1 : 0) + (sector !== SECTORS[0] ? 1 : 0);
  const approvedCount = products.filter(product => product.status === 'approved').length;
  const pendingCount = products.filter(product => product.status === 'pending').length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.listHeader}>
        <View><Text style={styles.eyebrow}>QUẢN LÝ</Text><Text style={styles.pageTitle}>Sản phẩm</Text><Text style={styles.pageSubtitle}>{products.length} sản phẩm đã đăng ký</Text></View>
        <TouchableOpacity style={styles.exportButton} onPress={exportData}><Feather name="share-2" size={15} color={colors.primary} /><Text style={styles.exportText}>Xuất</Text></TouchableOpacity>
      </View>
      <View style={styles.statusTabs}>
        {[
          ['all', 'Tất cả', products.length],
          ['pending', 'Chờ duyệt', pendingCount],
          ['approved', 'Đã duyệt', approvedCount],
        ].map(([key, label, count]) => <TouchableOpacity key={key} style={[styles.statusTab, status === key && { backgroundColor: colors.primary }]} onPress={() => setStatus(key as 'all' | ProductStatus)}><Text style={[styles.statusTabText, status === key && { color: colors.primaryForeground }]}>{label}</Text><View style={[styles.countPill, status === key && { backgroundColor: 'rgba(255,255,255,0.2)' }]}><Text style={[styles.countText, status === key && { color: colors.primaryForeground }]}>{count}</Text></View></TouchableOpacity>)}
      </View>
      <View style={styles.searchToolbar}>
        <Feather name="search" size={16} color={colors.textPlaceholder} />
        <TextInput value={search} onChangeText={setSearch} style={styles.searchInput} placeholder="Tìm tên, doanh nghiệp, mã..." placeholderTextColor={colors.textPlaceholder} returnKeyType="search" />
        {!!search && <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}><Feather name="x" size={16} color={colors.textMuted} /></TouchableOpacity>}
        <TouchableOpacity style={[styles.filterButton, activeFilterCount > 0 && { backgroundColor: colors.primaryLight }]} onPress={() => setShowFilters(true)}><Feather name="sliders" size={16} color={activeFilterCount > 0 ? colors.primary : colors.textMuted} />{activeFilterCount > 0 && <View style={[styles.filterDot, { backgroundColor: colors.accent }]} />}</TouchableOpacity>
      </View>
      <View style={styles.resultToolbar}>
        <Text style={styles.resultText}>Hiển thị <Text style={styles.resultStrong}>{filtered.length}</Text> sản phẩm</Text>
        <View style={styles.viewSwitcher}>
          <TouchableOpacity style={[styles.viewButton, viewMode === 'grid' && { backgroundColor: colors.primary }]} onPress={() => setViewMode('grid')}><Feather name="grid" size={15} color={viewMode === 'grid' ? colors.primaryForeground : colors.textMuted} /></TouchableOpacity>
          <TouchableOpacity style={[styles.viewButton, viewMode === 'list' && { backgroundColor: colors.primary }]} onPress={() => setViewMode('list')}><Feather name="list" size={15} color={viewMode === 'list' ? colors.primaryForeground : colors.textMuted} /></TouchableOpacity>
        </View>
      </View>
      <FlatList
        key={viewMode}
        data={filtered}
        numColumns={viewMode === 'grid' ? 2 : 1}
        keyExtractor={item => item.id}
        renderItem={({ item }) => viewMode === 'grid' ? <View style={styles.gridCell}><ProductCard product={item} onPress={() => setSelected(item)} onDelete={() => removeProduct(item)} /></View> : <ProductListRow product={item} onPress={() => setSelected(item)} onDelete={() => removeProduct(item)} />}
        contentContainerStyle={styles.productList}
        columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<View style={styles.emptyList}><Feather name="package" size={42} color={colors.textPlaceholder} /><Text style={styles.emptyListTitle}>Không tìm thấy sản phẩm</Text><Text style={styles.emptyListText}>Thử thay đổi từ khóa hoặc bộ lọc.</Text></View>}
      />
      <FilterSheet visible={showFilters} status={status} region={region} sector={sector} onClose={() => setShowFilters(false)} onApply={(nextStatus, nextRegion, nextSector) => { setStatus(nextStatus); setRegion(nextRegion); setSector(nextSector); }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fb' },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 12 },
  eyebrow: { color: '#E8650A', fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  pageTitle: { color: '#1d2944', fontSize: 26, fontWeight: '700', letterSpacing: -0.8, marginTop: 3 },
  pageSubtitle: { color: '#6b7694', fontSize: 11, marginTop: 3 },
  exportButton: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#dce3ff', backgroundColor: '#edf0ff', paddingHorizontal: 12, paddingVertical: 9, borderRadius: 11, marginTop: 8 },
  exportText: { color: '#2740BA', fontSize: 11, fontWeight: '700' },
  statusTabs: { flexDirection: 'row', gap: 7, paddingHorizontal: 12, marginBottom: 10 },
  statusTab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 11, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e4e8f0' },
  statusTabText: { color: '#6b7694', fontSize: 11, fontWeight: '600' },
  countPill: { backgroundColor: '#f0f2f8', borderRadius: 10, minWidth: 18, paddingHorizontal: 5, paddingVertical: 2, alignItems: 'center' },
  countText: { color: '#6b7694', fontSize: 10, fontWeight: '700' },
  searchToolbar: { flexDirection: 'row', alignItems: 'center', gap: 9, marginHorizontal: 12, paddingHorizontal: 12, height: 44, borderRadius: 13, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e4e8f0' },
  searchInput: { flex: 1, color: '#1d2944', fontSize: 12, paddingVertical: 0 },
  filterButton: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  filterDot: { position: 'absolute', top: 5, right: 5, width: 6, height: 6, borderRadius: 3 },
  resultToolbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10 },
  resultText: { color: '#6b7694', fontSize: 11 },
  resultStrong: { color: '#1d2944', fontWeight: '700' },
  viewSwitcher: { flexDirection: 'row', borderRadius: 9, overflow: 'hidden', borderWidth: 1, borderColor: '#e4e8f0', backgroundColor: '#fff' },
  viewButton: { width: 32, height: 30, alignItems: 'center', justifyContent: 'center' },
  productList: { paddingHorizontal: 12, paddingBottom: 28 },
  gridRow: { gap: 8 },
  gridCell: { flex: 1, maxWidth: '50%', paddingBottom: 8 },
  card: { backgroundColor: '#fff', borderRadius: 15, borderWidth: 1, borderColor: '#e4e8f0', overflow: 'hidden', shadowColor: '#1d2944', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  cardImageWrap: { height: 112, backgroundColor: '#f0f2f8', position: 'relative' },
  cardImage: { width: '100%', height: '100%' },
  cardImageShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,20,50,0.06)' },
  cardStatus: { position: 'absolute', top: 8, right: 7 },
  cardCode: { position: 'absolute', bottom: 7, left: 8, backgroundColor: 'rgba(29,41,68,0.78)', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 5 },
  cardCodeText: { color: '#fff', fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  cardBody: { padding: 10 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'flex-start' },
  cardName: { flex: 1, color: '#1d2944', fontSize: 12, fontWeight: '700', lineHeight: 16 },
  moreButton: { marginLeft: 3, padding: 1 },
  cardCompany: { color: '#6b7694', fontSize: 10, marginTop: 4 },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 7 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3, flexShrink: 1 },
  metaText: { color: '#6b7694', fontSize: 9 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#f0f2f8', paddingTop: 8, marginTop: 8 },
  certRow: { flexDirection: 'row', alignItems: 'center', gap: 3, flex: 1, flexWrap: 'wrap' },
  certPill: { color: '#2740BA', backgroundColor: '#edf0ff', fontSize: 8, fontWeight: '700', paddingHorizontal: 5, paddingVertical: 3, borderRadius: 5 },
  certMore: { color: '#6b7694', fontSize: 9 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  statusBadgeCompact: { paddingHorizontal: 6, paddingVertical: 3 },
  statusText: { fontSize: 9, fontWeight: '700' },
  listRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#e4e8f0', padding: 9, marginBottom: 8 },
  listImage: { width: 62, height: 62, borderRadius: 10, backgroundColor: '#f0f2f8' },
  listContent: { flex: 1, marginLeft: 10, minWidth: 0 },
  listTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  listName: { flex: 1, color: '#1d2944', fontSize: 13, fontWeight: '700' },
  listCode: { color: '#6b7694', fontSize: 10, marginTop: 4 },
  listBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 5, marginTop: 7 },
  listRegion: { color: '#6b7694', fontSize: 9, flex: 1 },
  emptyList: { alignItems: 'center', paddingVertical: 70 },
  emptyListTitle: { color: '#25304b', fontSize: 14, fontWeight: '700', marginTop: 12 },
  emptyListText: { color: '#6b7694', fontSize: 11, marginTop: 4 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(18,27,52,0.45)' },
  sheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 18, paddingTop: 10, paddingBottom: 26, maxHeight: '78%' },
  sheetHandle: { alignSelf: 'center', width: 38, height: 4, borderRadius: 4, backgroundColor: '#d9dce9', marginBottom: 14 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  sheetTitle: { color: '#1d2944', fontSize: 18, fontWeight: '700' },
  sheetSubtitle: { color: '#6b7694', fontSize: 11, marginTop: 3 },
  filterLabel: { color: '#25304b', fontSize: 12, fontWeight: '700', marginTop: 6, marginBottom: 8 },
  optionWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  horizontalOptions: { gap: 8, paddingBottom: 10, alignItems: 'center' },
  option: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 11, paddingVertical: 8 },
  optionText: { fontSize: 11, fontWeight: '600' },
  sheetActions: { flexDirection: 'row', gap: 9, paddingTop: 10 },
  primaryButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, backgroundColor: '#2740BA', borderRadius: 11, paddingVertical: 12, minHeight: 44 },
  primaryButtonText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  secondaryButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, borderWidth: 1, borderColor: '#e4e8f0', backgroundColor: '#fff', borderRadius: 11, paddingHorizontal: 14, paddingVertical: 11, minHeight: 44 },
  secondaryButtonText: { color: '#6b7694', fontSize: 12, fontWeight: '700' },
  detailTopBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 9, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e4e8f0' },
  backButton: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  detailTopTitle: { flex: 1, color: '#1d2944', fontSize: 15, fontWeight: '700', marginLeft: 6 },
  detailTopAction: { width: 34, height: 34, borderRadius: 9, backgroundColor: '#edf0ff', alignItems: 'center', justifyContent: 'center' },
  detailContent: { paddingBottom: 32 },
  detailHero: { backgroundColor: '#fff', padding: 12, borderBottomWidth: 1, borderBottomColor: '#e4e8f0' },
  heroImageWrap: { height: 220, borderRadius: 16, overflow: 'hidden', backgroundColor: '#f0f2f8', position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroArrow: { position: 'absolute', top: '45%', width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.88)' },
  heroArrowLeft: { left: 10 },
  heroArrowRight: { right: 10 },
  heroStatus: { position: 'absolute', top: 10, right: 10 },
  thumbnailRow: { flexDirection: 'row', gap: 7, marginTop: 9 },
  thumbnail: { width: 48, height: 42, borderWidth: 2, borderRadius: 8, overflow: 'hidden' },
  thumbnailImage: { width: '100%', height: '100%' },
  detailTitleBlock: { paddingTop: 13 },
  detailName: { color: '#1d2944', fontSize: 20, fontWeight: '700', lineHeight: 26 },
  detailCompany: { color: '#6b7694', fontSize: 12, marginTop: 4 },
  detailIdentifier: { color: '#E8650A', fontSize: 10, fontWeight: '700', marginTop: 5 },
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e4e8f0' },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 13, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabText: { color: '#6b7694', fontSize: 11, fontWeight: '700' },
  infoCard: { backgroundColor: '#fff', margin: 12, padding: 15, borderRadius: 16, borderWidth: 1, borderColor: '#e4e8f0' },
  sectionTitle: { color: '#1d2944', fontSize: 14, fontWeight: '700' },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
  infoCell: { width: '50%', paddingRight: 9, paddingBottom: 14 },
  infoLabel: { color: '#6b7694', fontSize: 9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 5 },
  infoValue: { color: '#25304b', fontSize: 12, fontWeight: '600', marginTop: 3, lineHeight: 17 },
  subsectionTitle: { color: '#6b7694', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 8, marginBottom: 8 },
  certWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 8 },
  detailCert: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 8, backgroundColor: '#edf0ff' },
  detailCertText: { color: '#2740BA', fontSize: 10, fontWeight: '700' },
  emptyText: { color: '#6b7694', fontSize: 11, fontStyle: 'italic' },
  description: { color: '#6b7694', fontSize: 12, lineHeight: 19 },
  actionCard: { backgroundColor: '#fff', marginHorizontal: 12, marginBottom: 12, padding: 15, borderRadius: 16, borderWidth: 1, borderColor: '#e4e8f0' },
  actionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  qrAction: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 13, padding: 12, borderRadius: 11, backgroundColor: '#edf0ff' },
  qrActionText: { flex: 1, color: '#2740BA', fontSize: 12, fontWeight: '700' },
  actionRow: { flexDirection: 'row', gap: 9, marginTop: 11 },
  secondaryButtonTextDark: { color: '#25304b', fontSize: 12, fontWeight: '700' },
  deleteButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, borderWidth: 1, borderColor: '#f5bcbc', backgroundColor: '#fef0f0', borderRadius: 11, paddingVertical: 11, minHeight: 44 },
  deleteButtonText: { color: '#c0392b', fontSize: 12, fontWeight: '700' },
  emptyTrace: { alignItems: 'center', marginHorizontal: 12, marginBottom: 12, padding: 22, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', borderColor: '#e4e8f0', backgroundColor: '#f9fafb' },
  emptyTraceTitle: { color: '#25304b', fontSize: 12, fontWeight: '700', marginTop: 9 },
  emptyTraceText: { color: '#6b7694', fontSize: 10, lineHeight: 16, textAlign: 'center', marginTop: 4 },
  providerCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', margin: 12, padding: 15, borderRadius: 16, borderWidth: 1, borderColor: '#e4e8f0' },
  providerName: { color: '#1d2944', fontSize: 14, fontWeight: '700', marginTop: 5 },
  providerUpdated: { color: '#6b7694', fontSize: 10, marginTop: 4 },
  providerImage: { width: 52, height: 52, borderRadius: 11 },
  traceCard: { backgroundColor: '#fff', marginHorizontal: 12, marginBottom: 12, padding: 15, borderRadius: 16, borderWidth: 1, borderColor: '#e4e8f0' },
  traceRow: { flexDirection: 'row', minHeight: 91 },
  traceRail: { width: 34, alignItems: 'center', marginRight: 11 },
  traceCircle: { width: 32, height: 32, borderRadius: 16, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  traceLine: { width: 2, flex: 1, marginVertical: -1 },
  traceCopy: { flex: 1, paddingBottom: 17 },
  traceTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  traceTitle: { flex: 1, color: '#25304b', fontSize: 12, fontWeight: '700' },
  waitingPill: { color: '#6b7694', backgroundColor: '#f0f2f8', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 3, fontSize: 8, fontWeight: '700' },
  traceDate: { color: '#6b7694', fontSize: 9, marginTop: 4 },
  traceDescription: { color: '#6b7694', backgroundColor: '#f9fafb', borderRadius: 9, padding: 9, fontSize: 10, lineHeight: 15, marginTop: 6 },
  traceImage: { width: '100%', height: 145, borderRadius: 10, marginTop: 8, backgroundColor: '#f0f2f8' },
  docsCard: { backgroundColor: '#fff', marginHorizontal: 12, marginBottom: 12, padding: 15, borderRadius: 16, borderWidth: 1, borderColor: '#e4e8f0' },
  docsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  docsCount: { color: '#2740BA', backgroundColor: '#edf0ff', borderRadius: 10, paddingHorizontal: 7, paddingVertical: 4, fontSize: 9, fontWeight: '700' },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 9, borderTopWidth: 1, borderTopColor: '#f0f2f8' },
  pdfBadge: { width: 32, height: 32, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8650A' },
  pdfText: { color: '#fff', fontSize: 8, fontWeight: '700' },
  docName: { flex: 1, color: '#25304b', fontSize: 10, fontWeight: '600' },
  identifierBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f7f8fd', borderWidth: 1, borderColor: '#e4e8f0', borderRadius: 10, padding: 11, marginTop: 11 },
  identifierText: { color: '#25304b', fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },
  qrModal: { alignSelf: 'center', width: '88%', borderRadius: 22, padding: 20, alignItems: 'center', shadowColor: '#1d2944', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 20, elevation: 8 },
  modalTopRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  qrImage: { width: 220, height: 220, borderRadius: 12, borderWidth: 1, borderColor: '#b8e2c8' },
  qrId: { color: '#2740BA', fontSize: 12, fontWeight: '700', letterSpacing: 0.5, marginTop: 13 },
  qrName: { color: '#1d2944', fontSize: 13, fontWeight: '700', marginTop: 5, textAlign: 'center' },
  qrHint: { color: '#6b7694', fontSize: 10, textAlign: 'center', marginTop: 4 },
  qrActions: { width: '100%', gap: 8, marginTop: 16 },
  editSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 18, paddingTop: 10, paddingBottom: 24, maxHeight: '90%' },
  formContent: { paddingBottom: 15 },
  inputLabel: { color: '#25304b', fontSize: 11, fontWeight: '700', marginBottom: 6, marginTop: 10 },
  input: { minHeight: 43, borderWidth: 1, borderColor: '#e4e8f0', borderRadius: 11, backgroundColor: '#f9fafb', color: '#1d2944', fontSize: 12, paddingHorizontal: 12 },
  multilineInput: { minHeight: 100, paddingTop: 11, marginBottom: 16 },
});