export type SolutionProvider = {
  id: number;
  image: string;
  name: string;
  taxCode: string;
  representative: string;
  phone: string;
  email: string;
  businessLicense: string;
  organization: string;
  connectedCertificate: string;
  capabilityProfile: string;
};

export const INITIAL_SOLUTION_PROVIDERS: SolutionProvider[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=160&h=160&fit=crop",
    name: "Công ty TNHH TraceMark Việt Nam",
    taxCode: "0316458120",
    representative: "Nguyễn Hoàng Nam",
    phone: "028 7300 2288",
    email: "contact@tracemark.vn",
    businessLicense: "GPKD_TraceMark.pdf",
    organization: "Công ty TNHH",
    connectedCertificate: "CN_KetNoi_TraceMark.pdf",
    capabilityProfile: "HoSoNangLuc_TraceMark.pdf",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=160&h=160&fit=crop",
    name: "Công ty CP Công nghệ GreenTrace",
    taxCode: "0109854217",
    representative: "Trần Minh Hương",
    phone: "024 3765 9120",
    email: "hello@greentrace.vn",
    businessLicense: "GiayPhep_GreenTrace.pdf",
    organization: "Công ty cổ phần",
    connectedCertificate: "ChungNhan_GreenTrace.pdf",
    capabilityProfile: "",
  },
];
