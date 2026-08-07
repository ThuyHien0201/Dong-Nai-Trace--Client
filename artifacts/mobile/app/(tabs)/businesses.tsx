import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput,
  Modal, ScrollView, Image, Alert, 
   
   
    Pressable,
 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';

/* ─── Mock Data ────────────────────────────────────────────── */
const STATUSES = ['Tất cả', 'Đã duyệt', 'Chờ duyệt', 'Đã khóa'];

interface Business {
  id: string;
  name: string;
  code: string;
  taxId: string;
  sector: string;
  address: string;
  businessType: string;
  district: string;
  phone: string;
  email: string;
  representative: string;
  status: 'active' | 'pending' | 'locked';
  productCount: number;
  joinDate: string;
  certifications: string[];
  documents: { name: string; date: string }[];
  image?: string;
  images?: string[];
}

const BUSINESSES: Business[] = [
  {
    id: 'B001',
    name: 'Công ty CP Thực phẩm Vĩnh Hảo',
    code: 'VH-2024-001',
    businessType: 'Công ty TNHH',
    image: 'https://picsum.photos/seed/vinhhao/600/400',
    images: [
      'https://picsum.photos/seed/vinhhao1/800/600',
      'https://picsum.photos/seed/vinhhao2/800/600',
      'https://picsum.photos/seed/vinhhao3/800/600',
    ],
    taxId: '0601234567',
    sector: 'Đồ uống',
    address: '15 Hùng Vương, TP Biên Hòa',
    district: 'Biên Hòa',
    phone: '0251.3890.123',
    email: 'contact@vinhhao.vn',
    representative: 'Nguyễn Văn Thành',
    status: 'active',
    productCount: 12,
    joinDate: '2024-01-15',
    certifications: ['ISO 22000', 'HACCP'],
    documents: [
      { name: 'Giấy phép VSATTP', date: '2024-01-10' },
      { name: 'Đăng ký kinh doanh', date: '2023-12-20' }
    ]
  },

  {
    id: 'B002',
    name: 'HTX Nông nghiệp Tân Triều',
    code: 'TT-2024-002',
     businessType: 'HTX',
    image: 'https://picsum.photos/seed/tantrieu/600/400',
    images: [
      'https://picsum.photos/seed/tantrieu1/800/600',
      'https://picsum.photos/seed/tantrieu2/800/600',
      'https://picsum.photos/seed/tantrieu3/800/600',
    ],
    taxId: '0601234568',
    sector: 'Nông sản',
    address: '8 Đinh Tiên Hoàng, Vĩnh Cửu',
    district: 'Vĩnh Cửu',
    phone: '0251.3891.124',
    email: 'info@tantrieuhtx.vn',
    representative: 'Trần Thị Lan',
    status: 'active',
    productCount: 8,
    joinDate: '2024-02-03',
    certifications: ['VietGAP', 'GlobalGAP'],
    documents: [
      { name: 'Chứng nhận VietGAP', date: '2024-02-01' }
    ]
  },

  {
    id: 'B003',
    name: 'Công ty TNHH An Phú Foods',
    code: 'AP-2024-003',
     businessType: 'HTX',
    image: 'https://picsum.photos/seed/anphu/600/400',
    images: [
      'https://picsum.photos/seed/anphu1/800/600',
      'https://picsum.photos/seed/anphu2/800/600',
      'https://picsum.photos/seed/anphu3/800/600',
    ],
    taxId: '0601234569',
    sector: 'Chế biến thực phẩm',
    address: '22 Võ Thị Sáu, Long Thành',
    district: 'Long Thành',
    phone: '0251.3892.125',
    email: 'sales@anphufoods.com',
    representative: 'Lê Minh Khoa',
    status: 'pending',
    productCount: 5,
    joinDate: '2024-03-10',
    certifications: [],
    documents: [
      { name: 'Đăng ký kinh doanh', date: '2024-03-08' }
    ]
  },

  {
    id: 'B004',
    name: 'Trại nuôi thủy sản Bình Sơn',
    code: 'BS-2024-004',
     businessType: 'HTX',
    image: 'https://picsum.photos/seed/binhson/600/400',
    images: [
      'https://picsum.photos/seed/binhson1/800/600',
      'https://picsum.photos/seed/binhson2/800/600',
      'https://picsum.photos/seed/binhson3/800/600',
    ],
    taxId: '0601234570',
    sector: 'Thủy sản',
    address: '5 Trần Phú, Nhơn Trạch',
    district: 'Nhơn Trạch',
    phone: '0251.3893.126',
    email: 'binhson@aqua.vn',
    representative: 'Phạm Văn Bình',
    status: 'active',
    productCount: 6,
    joinDate: '2024-01-28',
    certifications: ['ASC'],
    documents: [
      { name: 'Giấy phép nuôi trồng', date: '2024-01-25' }
    ]
  },

  {
    id: 'B005',
    name: 'HTX Dược liệu Xuân Lộc',
    code: 'XL-2024-005',
     businessType: 'HTX',
    image: 'https://picsum.photos/seed/xuanloc/600/400',
    images: [
      'https://picsum.photos/seed/xuanloc1/800/600',
      'https://picsum.photos/seed/xuanloc2/800/600',
      'https://picsum.photos/seed/xuanloc3/800/600',
    ],
    taxId: '0601234571',
    sector: 'Dược liệu',
    address: '30 Hà Huy Tập, Xuân Lộc',
    district: 'Xuân Lộc',
    phone: '0251.3894.127',
    email: 'duoclieu@xuanloc.vn',
    representative: 'Nguyễn Thị Hoa',
    status: 'locked',
    productCount: 3,
    joinDate: '2024-04-15',
    certifications: ['GACP'],
    documents: [
      { name: 'Giấy phép dược liệu', date: '2024-04-10' }
    ]
  },

  {
    id: 'B006',
    name: 'Công ty CP Chế biến Đồng Nai',
    code: 'DN-2024-006',
     businessType: 'HTX',
    image: 'https://picsum.photos/seed/dongnai/600/400',
    images: [
      'https://picsum.photos/seed/dongnai1/800/600',
      'https://picsum.photos/seed/dongnai2/800/600',
      'https://picsum.photos/seed/dongnai3/800/600',
    ],
    taxId: '0601234572',
    sector: 'Chế biến thực phẩm',
    address: '100 KCN Tam Phước, Biên Hòa',
    district: 'Biên Hòa',
    phone: '0251.3895.128',
    email: 'info@chebiendongnai.vn',
    representative: 'Võ Văn Cường',
    status: 'active',
    productCount: 20,
    joinDate: '2023-11-01',
    certifications: ['ISO 22000', 'BRC'],
    documents: [
      { name: 'Giấy phép KCN', date: '2023-10-28' },
      { name: 'PCCC', date: '2023-10-15' }
    ]
  },

  {
    id: 'B007',
    name: 'Trang trại hữu cơ Green Valley',
    code: 'GV-2024-007',
     businessType: 'HTX',
    image: 'https://picsum.photos/seed/greenvalley/600/400',
    images: [
      'https://picsum.photos/seed/greenvalley1/800/600',
      'https://picsum.photos/seed/greenvalley2/800/600',
      'https://picsum.photos/seed/greenvalley3/800/600',
    ],
    taxId: '0601234573',
    sector: 'Nông sản',
    address: '7 Phú Điền, Định Quán',
    district: 'Định Quán',
    phone: '0251.3896.129',
    email: 'greenvalley@organic.vn',
    representative: 'Trần Minh Tuấn',
    status: 'pending',
    productCount: 4,
    joinDate: '2024-06-01',
    certifications: ['Organic Vietnam'],
    documents: []
  }
];

const STATUS_META = {
  active: { label: 'Đã duyệt', color: '#1f7a45', bg: '#e8f5ed' },
  pending: { label: 'Chờ duyệt', color: '#9a6116', bg: '#fff4d4' },
  locked: { label: 'Đã khóa', color: '#c0392b', bg: '#fef0f0' },
};

/* ─── Utility ──────────────────────────────────────────────── */
function StatusBadge({ status }: { status: keyof typeof STATUS_META }) {
  const m = STATUS_META[status];
  return (
    <View style={[sb.wrap, { backgroundColor: m.bg }]}>
      <Text style={[sb.text, { color: m.color }]}>{m.label}</Text>
    </View>
  );
}

const sb = StyleSheet.create({
  wrap: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  text: { fontSize: 10, fontWeight: '600' },
});

/* ─── Business Card ─────────────────────────────────────────── */
function BizCard({
  biz,
  onPress,
  onEdit,
  onDelete,
  onLock,
  onResetPassword,
}: {
  biz: Business;
  onPress: () => void;
  onEdit: (biz: Business) => void;
  onDelete: (biz: Business) => void;
  onLock: (biz: Business) => void;
  onResetPassword: (biz: Business) => void;
}) {
  
  const m = STATUS_META[biz.status];
  return (
    <TouchableOpacity style={s.bizCard} onPress={onPress} activeOpacity={0.85}>
      <View style={s.bizCardHeader}>
        <View style={s.bizAvatar}>
          <Text style={s.bizAvatarText}>{biz.name.charAt(0)}</Text>
        </View>
        <View style={s.bizInfo}>
          <Text style={s.bizName} numberOfLines={2}>{biz.name}</Text>
          <Text style={s.bizCode}>{biz.code}</Text>
        </View>
        <StatusBadge status={biz.status} />
      </View>
      <View style={s.bizRow}>
        <Feather name="map-pin" size={11} color="#6b7694" />
        <Text style={s.bizRowText}>{biz.district}</Text>
        <Feather name="layers" size={11} color="#6b7694" style={{ marginLeft: 12 }} />
        <Text style={s.bizRowText}>{biz.sector}</Text>
      </View>
      <View style={s.bizRow}>
        <Feather name="package" size={11} color="#6b7694" />
        
        <Text style={s.bizRowText}>{biz.representative}</Text>
      </View>
      {biz.certifications.length > 0 && (
        <View style={s.certRow}>
          {biz.certifications.map(cert => (
            <View key={cert} style={s.certBadge}>
              <Feather name="award" size={11} color="#2740BA" />
              <Text style={s.certText}>{cert}</Text>
            </View>
          ))}
        </View>
      )}
      <View style={s.actionRow}>
        <TouchableOpacity
          accessibilityLabel="Đặt lại mật khẩu"
          hitSlop={8}
          onPress={() => onResetPassword(biz)}
        >
          <Feather name="key" size={16} color="#6366f1" />
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel="Chỉnh sửa doanh nghiệp"
          hitSlop={8}
          onPress={() => onEdit(biz)}
        >
          <Feather name="edit-2" size={16} color="#2563eb" />
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel={biz.status === 'locked' ? 'Mở khóa doanh nghiệp' : 'Khóa doanh nghiệp'}
          hitSlop={8}
          onPress={() => onLock(biz)}
        >
          <Feather name={biz.status === 'locked' ? 'unlock' : 'lock'} size={16} color="#f59e0b" />
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityLabel="Xóa doanh nghiệp"
          hitSlop={8}
          onPress={() => onDelete(biz)}
        >
          <Feather name="trash-2" size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

/* ─── Business Detail ───────────────────────────────────────── */
function BusinessDetail({
  biz,
  onBack,
  onUpdate,
  onDelete,
  onLock,
  onResetPassword,
  onResetPasswordConfirmed,
}: {
  biz: Business;
  onBack: () => void;
  onUpdate: (business: Business) => void;
  onDelete: (business: Business) => void;
  onLock: (business: Business) => void;
  onResetPassword: (business: Business) => void;
  onResetPasswordConfirmed: (business: Business) => void;
}) {
  const [tab, setTab] = useState<'info' | 'docs' | 'status_action'>('info');
  const [showQR, setShowQR] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const tabs = [
    { key: 'info', label: 'Thông tin' },
    { key: 'docs', label: 'Tài liệu đăng ký' },
    { key: 'status_action', label: 'Trạng thái và thao tác' },
  ] as const;

  const STATUS_ACTIONS = {
    status: biz.status ?? 'Đã duyệt',
    phone: biz.phone,
    address: biz.address,
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#f5f7fb' }}>
      {/* Cover */}
      <View style={sd.cover}>
       
        <TouchableOpacity style={sd.backBtn} onPress={onBack}>
          <Feather name="arrow-left" size={18} color="#fff" />
        </TouchableOpacity>
        <View style={sd.coverContent}>
          <Image
            source={{ uri: biz.image }}
            style={sd.coverImage}
            resizeMode="cover"
          />

          <Text style={sd.coverName}>{biz.name}</Text>
          <Text style={sd.coverCode}>{biz.code}</Text>
        </View>
        <View style={sd.coverActions}>
          <TouchableOpacity style={sd.actionBtn} onPress={() => setShowQR(true)}>
            <Feather name="maximize" size={14} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[sd.actionBtn, { backgroundColor: '#E8650A' }]} onPress={() => onLock(biz)}>
            <Feather name={biz.status === 'locked' ? 'unlock' : 'lock'} size={14} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={sd.tabs}>
        {tabs.map(t => (
          <TouchableOpacity key={t.key} style={[sd.tab, tab === t.key && sd.tabActive]} onPress={() => setTab(t.key)}>
            <Text style={[sd.tabText, tab === t.key && sd.tabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {tab === 'info' && (
          <View>
            <StatusBadge status={biz.status} />
            <View style={{ height: 12 }} />
            {[
              { label: 'Mã số doanh nghiệp', value: biz.code, icon: 'hash' },
              { label: 'Mã số thuế', value: biz.taxId, icon: 'file-text' },
              { label: 'Ngành hàng', value: biz.sector, icon: 'layers' },
              { label: 'Địa chỉ', value: biz.address, icon: 'map-pin' },
              { label: 'Quận/Huyện', value: biz.district, icon: 'map' },
              { label: 'Người đại diện', value: biz.representative, icon: 'user' },
            { label: 'Loại hình', value: biz.businessType, icon: 'briefcase' },
              { label: 'Điện thoại', value: biz.phone, icon: 'phone' },
              { label: 'Email', value: biz.email, icon: 'mail' },
              { label: 'Ngày đăng ký', value: biz.joinDate, icon: 'calendar' },
              { label: 'Số sản phẩm', value: `${biz.productCount} sản phẩm`, icon: 'package' },
            ].map(row => (
              <View key={row.label} style={sd.infoRow}>
                <Feather name={row.icon as any} size={13} color="#6b7694" style={sd.infoIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={sd.infoLabel}>{row.label}</Text>
                  <Text style={sd.infoValue}>{row.value}</Text>
                </View>
              </View>
            ))}
            {biz.certifications.length > 0 && (
              <View style={sd.certWrap}>
                <Text style={sd.certTitle}>Chứng nhận</Text>
                {biz.certifications.map(c => (
                  <View key={c} style={sd.certRow}>
                    <Feather name="award" size={14} color="#2740BA" />
                    <Text style={sd.certText}>{c}</Text>
                  </View>
                ))}
              </View>
            )}
            <TouchableOpacity style={sd.resetBtn} onPress={() => setShowReset(true)}>
              <Feather name="key" size={14} color="#E8650A" />
              <Text style={sd.resetText}>Đặt lại mật khẩu tài khoản</Text>
            </TouchableOpacity>
          </View>
        )}

        {tab === 'docs' && (
          <View>
            {biz.documents.length === 0 ? (
              <View style={sd.empty}>
                <Feather name="folder" size={36} color="#d9dce9" />
                <Text style={sd.emptyText}>
                  Chưa có hồ sơ nào được tải lên
                </Text>
              </View>
            ) : (
              biz.documents.map((doc, i) => (
                <View key={i} style={sd.docRow}>
                  <View style={sd.docIcon}>
                    <Feather
                      name="file-text"
                      size={18}
                      color="#2740BA"
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={sd.docName}>
                      {doc.name}
                    </Text>

                    <Text style={sd.docDate}>
                      Ngày tải: {doc.date}
                    </Text>
                  </View>

                  <TouchableOpacity>
                    <Feather
                      name="download"
                      size={16}
                      color="#6b7694"
                    />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}

        {tab === 'status_action' && (
          <View style={sd.actionCard}>
            <Text style={sd.actionTitle}>
              Trạng thái & Thao tác
            </Text>

            <StatusBadge status={biz.status} />

            <View style={sd.contactCard}>
              <View style={sd.contactRow}>
                <Feather
                  name="phone"
                  size={18}
                  color="#2F54EB"
                />

                <Text style={sd.contactText}>
                  {biz.phone}
                </Text>
              </View>

              <View style={sd.contactRow}>
                <Feather
                  name="map-pin"
                  size={18}
                  color="#F97316"
                />

                <Text style={sd.contactText}>
                  {biz.address}
                </Text>
              </View>
            </View>

            <View style={sd.actionRow}>
              <TouchableOpacity
                style={sd.actionButton}
                onPress={() => setShowEdit(true)}
              >
                <Feather
                  name="edit-2"
                  size={18}
                  color="#475569"
                />

                <Text style={sd.actionButtonText}>
                  Chỉnh sửa
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={sd.actionButton}
                onPress={() => onLock(biz)}
              >
                <Feather
                  name={biz.status === 'locked' ? 'unlock' : 'lock'}
                  size={18}
                  color="#475569"
                />

                <Text style={sd.actionButtonText}>
                  {biz.status === 'locked' ? 'Mở khóa' : 'Khóa'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={sd.resetButton}
              onPress={() => setShowReset(true)}
            >
              <Feather
                name="key"
                size={18}
                color="#475569"
              />

              <Text style={sd.actionButtonText}>Đặt lại mật khẩu</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* QR Modal */}
      <Modal visible={showQR} transparent animationType="fade">
        <TouchableOpacity style={sd.modalOverlay} onPress={() => setShowQR(false)} activeOpacity={1}>
          <View style={sd.qrModal}>
            <View style={sd.qrBox}>
              <View style={sd.qrPlaceholder}>
                <Feather name="maximize" size={48} color="#2740BA" />
                <Text style={sd.qrCode}>{biz.code}</Text>
              </View>
            </View>
            <Text style={sd.qrLabel}>Mã QR Doanh nghiệp</Text>
            <Text style={sd.qrSub}>{biz.name}</Text>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Reset Password Modal */}
      <Modal visible={showReset} transparent animationType="slide">
        <View style={sd.modalOverlay}>
          <View style={sd.resetModal}>
            <Text style={sd.resetTitle}>Đặt lại mật khẩu</Text>
            <Text style={sd.resetSub}>Bạn có chắc muốn đặt lại mật khẩu cho doanh nghiệp "{biz.name}"?</Text>
            <View style={sd.resetActions}>
              <TouchableOpacity style={sd.resetCancel} onPress={() => setShowReset(false)}>
                <Text style={sd.resetCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={sd.resetConfirm} onPress={() => { setShowReset(false); onResetPasswordConfirmed(biz); }}>
                <Text style={sd.resetConfirmText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <BusinessEditModal
        key={`${biz.id}-${biz.name}-${biz.email}-${biz.phone}`}
        business={biz}
        visible={showEdit}
        onClose={() => setShowEdit(false)}
        onSave={(updatedBusiness) => {
          onUpdate(updatedBusiness);
          setShowEdit(false);
        }}
      />
    </View>
  );
}

function BusinessEditModal({
  business,
  visible,
  onClose,
  onSave,
}: {
  business: Business;
  visible: boolean;
  onClose: () => void;
  onSave: (business: Business) => void;
}) {
  const [name, setName] = useState(business.name);
  const [representative, setRepresentative] = useState(business.representative);
  const [phone, setPhone] = useState(business.phone);
  const [email, setEmail] = useState(business.email);
  const [address, setAddress] = useState(business.address);
  const [sector, setSector] = useState(business.sector);

  const save = () => {
    if (!name.trim() || !representative.trim() || !phone.trim() || !email.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên doanh nghiệp, người đại diện, điện thoại và email.');
      return;
    }

    onSave({
      ...business,
      name: name.trim(),
      representative: representative.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim() || business.address,
      sector: sector.trim() || business.sector,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={sd.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={sd.editModal}>
          <View style={sd.sheetHandle} />
          <View style={sd.editHeader}>
            <View>
              <Text style={sd.editTitle}>Chỉnh sửa doanh nghiệp</Text>
              <Text style={sd.editSubtitle}>{business.code}</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <Feather name="x" size={20} color="#6b7694" />
            </TouchableOpacity>
          </View>
          <KeyboardAwareScrollViewCompat
            contentContainerStyle={sd.editContent}
            showsVerticalScrollIndicator={false}
          >
            {[
              ['Tên doanh nghiệp', name, setName, 'Nhập tên doanh nghiệp'],
              ['Người đại diện', representative, setRepresentative, 'Nhập người đại diện'],
              ['Điện thoại', phone, setPhone, 'Nhập số điện thoại'],
              ['Email', email, setEmail, 'Nhập email'],
              ['Ngành hàng', sector, setSector, 'Nhập ngành hàng'],
              ['Địa chỉ', address, setAddress, 'Nhập địa chỉ'],
            ].map(([label, value, setter, placeholder]) => (
              <View key={label as string}>
                <Text style={sd.inputLabel}>{label as string}</Text>
                <TextInput
                  value={value as string}
                  onChangeText={setter as (value: string) => void}
                  placeholder={placeholder as string}
                  placeholderTextColor="#a8b2c8"
                  style={sd.input}
                  keyboardType={label === 'Điện thoại' ? 'phone-pad' : label === 'Email' ? 'email-address' : 'default'}
                  autoCapitalize={label === 'Email' ? 'none' : 'sentences'}
                />
              </View>
            ))}
            <TouchableOpacity style={sd.saveButton} onPress={save}>
              <Feather name="save" size={16} color="#fff" />
              <Text style={sd.saveButtonText}>Lưu thay đổi</Text>
            </TouchableOpacity>
          </KeyboardAwareScrollViewCompat>
        </View>
      </View>
    </Modal>
  );
}

/* ─── Main Screen ───────────────────────────────────────────── */
export default function BusinessesScreen() {
  const [businesses, setBusinesses] = useState<Business[]>(BUSINESSES);
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('Tất cả');
  const [selectedStatus, setSelectedStatus] = useState('Tất cả');
  
  const [selected, setSelected] = useState<Business | null>(null);
  const handleEdit = (biz: Business) => {
    setSelected(biz);
  };

  const completeResetPassword = (biz: Business) => {
    Alert.alert('Thành công', `Mật khẩu của ${biz.name} đã được đặt lại. Thông tin đăng nhập mới sẽ được gửi đến ${biz.email}.`);
  };

  const handleResetPassword = (biz: Business) => {
    Alert.alert(
      'Đặt lại mật khẩu',
      `Đặt lại mật khẩu cho ${biz.name}?`,
      [
        { text: 'Hủy' },
        {
          text: 'Đồng ý',
          onPress: () => {
            completeResetPassword(biz);
          },
        },
      ]
    );
  };

  const handleLock = (biz: Business) => {
    const willLock = biz.status !== 'locked';
    Alert.alert(
      willLock ? 'Khóa doanh nghiệp' : 'Mở khóa doanh nghiệp',
      willLock
        ? `Khóa ${biz.name}? Doanh nghiệp sẽ không thể truy cập tài khoản.`
        : `Mở khóa ${biz.name}? Doanh nghiệp sẽ có thể truy cập lại tài khoản.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: willLock ? 'Khóa' : 'Mở khóa',
          style: willLock ? 'destructive' : 'default',
          onPress: () => {
            const updated = { ...biz, status: willLock ? 'locked' : 'active' as Business['status'] };
            setBusinesses(current => current.map(item => item.id === biz.id ? updated : item));
            setSelected(current => current?.id === biz.id ? updated : current);
            Alert.alert('Đã cập nhật', willLock ? 'Doanh nghiệp đã được khóa.' : 'Doanh nghiệp đã được mở khóa.');
          },
        },
      ]
    );
  };

  const handleDelete = (biz: Business) => {
    Alert.alert(
      'Xóa doanh nghiệp',
      `Xóa ${biz.name}?`,
      [
        { text: 'Hủy' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            setBusinesses(current => current.filter(item => item.id !== biz.id));
            setSelected(current => current?.id === biz.id ? null : current);
            Alert.alert('Đã xóa', 'Doanh nghiệp đã được xóa khỏi danh sách.');
          },
        },
      ]
    );
  };
  const handleUpdate = (updated: Business) => {
    setBusinesses(current => current.map(item => item.id === updated.id ? updated : item));
    setSelected(updated);
    Alert.alert('Đã lưu', 'Thông tin doanh nghiệp đã được cập nhật.');
  };
  const filtered = useMemo(() => {
    return businesses.filter(b => {
      const q = search.toLowerCase();
      if (q && !b.name.toLowerCase().includes(q) && !b.code.toLowerCase().includes(q) && !b.representative.toLowerCase().includes(q)) return false;
      if (selectedSector !== 'Tất cả' && b.sector !== selectedSector) return false;
      if (selectedStatus !== 'Tất cả') {
        const map: Record<string, Business['status']> = { 'Đã duyệt': 'active', 'Chờ duyệt': 'pending', 'đã khóa': 'locked' };
        if (b.status !== map[selectedStatus]) return false;
      }
      return true;
    });
  }, [businesses, search, selectedSector, selectedStatus]);

  if (selected) {
    return (
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <BusinessDetail
          biz={selected}
          onBack={() => setSelected(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onLock={handleLock}
          onResetPassword={handleResetPassword}
          onResetPasswordConfirmed={completeResetPassword}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.title}>Doanh nghiệp</Text>
          <Text style={s.subtitle}>{businesses.length} doanh nghiệp đã đăng ký</Text>
        </View>
      
      </View>

      {/* Search */}
      <View style={s.searchRow}>
        <Feather name="search" size={15} color="#a8b2c8" style={s.searchIcon} />
        <TextInput
          style={s.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Tìm theo tên, mã, đại diện…"
          placeholderTextColor="#a8b2c8"
        />
        {!!search && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Feather name="x" size={15} color="#a8b2c8" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.chips}
        style={{
          flexGrow: 0,
          marginBottom: 10,
        }}>
        {STATUSES.map(st => (
          <TouchableOpacity key={st} style={[s.chip, selectedStatus === st && s.chipActive]} onPress={() => setSelectedStatus(st)}>
            <Text style={[s.chipText, selectedStatus === st && s.chipTextActive]}>{st}</Text>
          </TouchableOpacity>
        ))}
        <View style={{ width: 4 }} />
        
      </ScrollView>

      {/* Results count */}
      <View style={s.resultsRow}>
        <Text style={s.resultsText}>{filtered.length} kết quả</Text>
        {(selectedSector !== 'Tất cả' || selectedStatus !== 'Tất cả' || search) && (
          <TouchableOpacity onPress={() => { setSearch(''); setSelectedSector('Tất cả'); setSelectedStatus('Tất cả'); }}>
            <Text style={s.clearText}>Xóa bộ lọc</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={b => b.id}
        numColumns={1}
        
        renderItem={({ item }) => (
          <BizCard
            biz={item}
            onPress={() => setSelected(item)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onLock={handleLock}
            onResetPassword={handleResetPassword}
          />
        )}
        contentContainerStyle={{ padding: 12, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.empty}>
            <Feather name="briefcase" size={40} color="#d9dce9" />
            <Text style={s.emptyTitle}>Không có doanh nghiệp nào</Text>
            <Text style={s.emptyText}>Thử điều chỉnh bộ lọc tìm kiếm</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

/* ─── Styles ────────────────────────────────────────────────── */
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fb' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 16, paddingTop: 30, paddingBottom: 8 },
  title: { fontSize: 20, fontWeight: '700', color: '#1d2944', letterSpacing: -0.5 },
  subtitle: { fontSize: 11, color: '#6b7694', marginTop: 2 },
 
  
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eef2f7',
  },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12,
    borderWidth: 1, borderColor: '#e4e8f0', marginHorizontal: 12, marginBottom: 8, paddingHorizontal: 12, height: 42,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 13, color: '#1d2944' },
  chip: {
    width: 90,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e4e8f0',
  },
  chips: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 29,
    gap: 6,
  },
  resultsRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  chipActive: { backgroundColor: '#edf0ff', borderColor: '#2740BA' },
  chipSector: {},
  chipSectorActive: { backgroundColor: '#fff4ed', borderColor: '#E8650A' },
  chipText: { fontSize: 11, color: '#6b7694', fontWeight: '500' },
  chipTextActive: { color: '#2740BA', fontWeight: '700' },

 
  resultsText: { fontSize: 11, color: '#6b7694' },
  clearText: { fontSize: 11, fontWeight: '600', color: '#2740BA' },

  bizCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#e4e8f0',
    shadowColor: '#1d2944', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  bizCardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  bizAvatar: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: '#edf0ff',
    alignItems: 'center', justifyContent: 'center', marginRight: 10, flexShrink: 0,
  },
  bizAvatarText: { fontSize: 18, fontWeight: '700', color: '#2740BA' },
  bizInfo: { flex: 1, marginRight: 8 },
  bizName: { fontSize: 13, fontWeight: '700', color: '#1d2944', lineHeight: 18 },
  bizCode: { fontSize: 10, color: '#6b7694', marginTop: 2, fontFamily: 'Inter_400Regular' },
  bizRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  bizRowText: { fontSize: 11, color: '#6b7694' },
  certRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  certBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
    backgroundColor: '#edf0ff',
  },
  certText: { fontSize: 10, color: '#2740BA', fontWeight: '600' },

  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyTitle: { fontSize: 14, fontWeight: '600', color: '#6b7694', marginTop: 12 },
  emptyText: { fontSize: 11, color: '#a8b2c8', marginTop: 4 },
});

const sd = StyleSheet.create({
  
  coverImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#fff',
  },
  cover: { backgroundColor: '#1e3171', padding: 20, paddingTop: 16, paddingBottom: 24 },
  backBtn: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  coverContent: { alignItems: 'center', marginBottom: 16 },
  coverAvatar: {
    width: 56, height: 56, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  coverAvatarText: { fontSize: 26, fontWeight: '700', color: '#fff' },
  coverName: { fontSize: 15, fontWeight: '700', color: '#fff', textAlign: 'center', lineHeight: 20 },
  coverCode: { fontSize: 11, color: 'rgba(219,234,254,0.7)', marginTop: 4 },
  coverActions: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  actionBtn: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.15)', flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e4e8f0' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#2740BA' },
  tabText: { fontSize: 12, color: '#6b7694', fontWeight: '500' },
  tabTextActive: { color: '#2740BA', fontWeight: '700' },

  infoRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f2f8' },
  infoIcon: { marginRight: 10, marginTop: 2 },
  infoLabel: { fontSize: 10, color: '#6b7694', marginBottom: 2 },
  infoValue: { fontSize: 13, color: '#1d2944', fontWeight: '500' },

  certWrap: { marginTop: 16, backgroundColor: '#edf0ff', borderRadius: 12, padding: 12 },
  certTitle: { fontSize: 11, fontWeight: '700', color: '#2740BA', marginBottom: 8 },
  certRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  certText: { fontSize: 12, color: '#2740BA', fontWeight: '500' },

  resetBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16,
    backgroundColor: '#fff4ed', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#fcd9bb',
  },
  resetText: { fontSize: 12, color: '#E8650A', fontWeight: '600' },

  docRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff',
    borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#e4e8f0',
  },
  docIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#edf0ff', alignItems: 'center', justifyContent: 'center' },
  docName: { fontSize: 12, fontWeight: '600', color: '#1d2944' },
  docDate: { fontSize: 10, color: '#6b7694', marginTop: 2 },

  timelineRow: { flexDirection: 'row', marginBottom: 16, position: 'relative' },
  timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#2740BA', marginTop: 4, marginRight: 12, flexShrink: 0 },
  timelineLine: { position: 'absolute', left: 5, top: 16, width: 2, height: 40, backgroundColor: '#e4e8f0' },
  timelineContent: { flex: 1 },
  timelineDate: { fontSize: 10, color: '#6b7694', marginBottom: 2 },
  timelineEvent: { fontSize: 12, fontWeight: '600', color: '#1d2944' },
  timelineUser: { fontSize: 10, color: '#a8b2c8', marginTop: 2 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  qrModal: { backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center', width: 260 },
  qrBox: { marginBottom: 12 },
  qrPlaceholder: {
    width: 160, height: 160, borderRadius: 12, backgroundColor: '#f5f7fb',
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#e4e8f0', borderStyle: 'dashed',
  },
  qrCode: { fontSize: 11, color: '#2740BA', marginTop: 8, fontWeight: '600' },
  qrLabel: { fontSize: 13, fontWeight: '700', color: '#1d2944' },
  qrSub: { fontSize: 11, color: '#6b7694', textAlign: 'center', marginTop: 4 },

  resetModal: { backgroundColor: '#fff', borderRadius: 20, padding: 24, width: '85%' },
  resetTitle: { fontSize: 16, fontWeight: '700', color: '#1d2944', marginBottom: 8 },
  resetSub: { fontSize: 12, color: '#6b7694', lineHeight: 18, marginBottom: 20 },
  resetActions: { flexDirection: 'row', gap: 12 },
  resetCancel: { flex: 1, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e4e8f0', alignItems: 'center' },
  resetCancelText: { fontSize: 13, color: '#6b7694', fontWeight: '600' },
  resetConfirm: { flex: 1, paddingVertical: 12, borderRadius: 10, backgroundColor: '#E8650A', alignItems: 'center' },
  resetConfirmText: { fontSize: 13, color: '#fff', fontWeight: '700' },
  sheetHandle: { alignSelf: 'center', width: 38, height: 4, borderRadius: 4, backgroundColor: '#d9dce9', marginBottom: 14 },
  editModal: { width: '100%', maxHeight: '90%', backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 18, paddingTop: 10, paddingBottom: 24 },
  editHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  editTitle: { fontSize: 18, fontWeight: '700', color: '#1d2944' },
  editSubtitle: { fontSize: 11, color: '#6b7694', marginTop: 3 },
  editContent: { paddingBottom: 12 },
  inputLabel: { fontSize: 11, fontWeight: '700', color: '#25304b', marginTop: 10, marginBottom: 6 },
  input: { minHeight: 43, borderWidth: 1, borderColor: '#e4e8f0', borderRadius: 11, backgroundColor: '#f9fafb', color: '#1d2944', fontSize: 12, paddingHorizontal: 12 },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, minHeight: 44, borderRadius: 11, backgroundColor: '#2740BA', marginTop: 18 },
  saveButtonText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  empty: { alignItems: 'center', paddingVertical: 32 },
  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },

  actionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1d2944',
    marginBottom: 16,
  },

  statusBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 16,
  },

  statusText: {
    color: '#16A34A',
    fontWeight: '600',
    marginLeft: 4,
  },

  qrButton: {
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    backgroundColor: '#EEF2FF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  qrText: {
    marginLeft: 8,
    color: '#2740BA',
    fontSize: 14,
    fontWeight: '600',
  },

  contactCard: {
    borderWidth: 1,
    borderColor: '#e4e8f0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  contactText: {
    marginLeft: 10,
    fontSize: 13,
    color: '#6b7694',
  },

  actionButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e4e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  actionButtonText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },

  resetButton: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e4e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },


  emptyText: { fontSize: 12, color: '#a8b2c8', marginTop: 8, textAlign: 'center' },
});
