import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Eye, EyeOff, LockKeyhole, Mail, MapPin, ShieldCheck, ArrowUpRight, CircleCheck, AlertCircle, Loader2, HelpCircle } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type FormStatus = 'idle' | 'loading' | 'success';

function TraceMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${compact ? 'gap-2.5' : ''}`} data-testid="brand-logo">
      <div className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#E8650A] text-white shadow-[0_8px_18px_rgba(232,101,10,.2)] ${compact ? 'h-10 w-10' : 'h-[52px] w-[52px]'}`}>
        <svg viewBox="0 0 52 52" aria-hidden="true" className="absolute inset-0 h-full w-full">
          <path d="M-4 37C10 28 17 35 25 24s14-6 31-14" fill="none" stroke="rgba(255,255,255,.32)" strokeWidth="2" />
          <path d="M-4 44C9 35 18 42 26 31s14-5 31-14" fill="none" stroke="rgba(255,255,255,.32)" strokeWidth="1.5" />
        </svg>
        <span className="relative font-mono text-[22px] font-medium tracking-[-.16em]">ĐN</span>
      </div>
      <div className="leading-none">
        <div className={`font-bold tracking-[-.04em] text-[#2740BA] ${compact ? 'text-[17px]' : 'text-[20px]'}`}>Đồng Nai <span className="text-[#E8650A]">Trace</span></div>
        <div className={`mt-1 font-mono uppercase tracking-[.16em] text-slate-500 ${compact ? 'text-[8px]' : 'text-[9px]'}`}>Trace with confidence</div>
      </div>
    </div>
  );
}

function TraceIllustration() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-20 -top-24 h-[520px] w-[520px] rounded-full bg-[#314ac6]/30 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 h-[470px] w-[470px] rounded-full bg-[#E8650A]/20 blur-3xl" />
      <div className="trace-grid absolute inset-0 opacity-40" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 760 900" preserveAspectRatio="none">
        <defs>
          <linearGradient id="route" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#E8650A" />
            <stop offset="1" stopColor="#ffb35c" />
          </linearGradient>
          <linearGradient id="hill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8ba3ef" stopOpacity=".32" />
            <stop offset="1" stopColor="#8ba3ef" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M-40 720C95 610 83 490 180 424S302 350 340 275s117-107 182-120 123-45 278-125v930H-40Z" fill="url(#hill)" />
        <path d="M-30 683C90 592 92 500 180 433s126-70 164-151 118-113 186-127 121-38 238-104" fill="none" stroke="rgba(188,204,255,.48)" strokeWidth="2" strokeDasharray="6 11" />
        <path d="M-35 700C82 617 94 512 187 443s132-66 169-147 120-119 185-130 115-40 226-111" fill="none" stroke="url(#route)" strokeWidth="3.5" strokeDasharray="1 13" strokeLinecap="round" className="animate-pulse-route" />
        <path d="M50 790C145 645 210 654 261 570s28-154 113-205 138-26 189-99" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="1" />
        <g fill="rgba(255,255,255,.86)">
          <circle cx="185" cy="443" r="5" /><circle cx="356" cy="296" r="5" /><circle cx="540" cy="153" r="5" />
        </g>
        <g fill="#E8650A">
          <circle cx="185" cy="443" r="2.5" /><circle cx="356" cy="296" r="2.5" /><circle cx="540" cy="153" r="2.5" />
        </g>
        <g fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="1">
          <path d="M135 470l24 12-8 25 24 18-13 29 20 18" />
          <path d="M310 336l22 14-6 24 26 16-11 23 20 24" />
          <path d="M490 193l28 10-7 24 23 15-8 25" />
        </g>
      </svg>
      <div className="absolute left-[11%] top-[43%] hidden animate-drift rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-white backdrop-blur-md sm:block">
        <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#ffad5e]" /><span className="font-mono text-[9px] uppercase tracking-[.18em] text-white/75">Vùng nguyên liệu</span></div>
        <div className="mt-1 text-[11px] font-semibold">Long Khánh</div>
      </div>
      <div className="absolute right-[12%] top-[17%] hidden rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-white backdrop-blur-md md:block">
        <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#ffad5e]" /><span className="font-mono text-[9px] uppercase tracking-[.18em] text-white/75">Điểm xác thực</span></div>
        <div className="mt-1 text-[11px] font-semibold">Biên Hòa</div>
      </div>
    </div>
  );
}

function PortalOverview() {
  return (
    <section className="relative hidden min-h-[100dvh] flex-col overflow-hidden bg-[#152978] px-10 py-10 text-white lg:flex xl:px-16" aria-label="Giới thiệu Đồng Nai Trace">
      <TraceIllustration />
      <div className="relative z-10 flex items-start justify-between">
        <TraceMark />
        <span className="rounded-full border border-white/20 bg-white/10 px-3 py-2 font-mono text-[9px] uppercase tracking-[.18em] text-white/75">Cổng thông tin tỉnh</span>
      </div>
      <div className="relative z-10 mt-auto max-w-[560px] pb-9 pt-20">
        <div className="mb-7 flex items-center gap-3 text-[#ffb265]">
          <span className="h-px w-9 bg-[#ffb265]" />
          <span className="font-mono text-[10px] uppercase tracking-[.25em]">Nguồn gốc rõ ràng · Giá trị bền vững</span>
        </div>
        <h1 className="max-w-[520px] text-balance text-[clamp(2.6rem,4.2vw,4.65rem)] font-bold leading-[1.06] tracking-[-.055em]">
          Mỗi sản phẩm,<br /><span className="text-[#ffb265]">một câu chuyện</span><br />đáng tin.
        </h1>
        <p className="mt-7 max-w-[420px] text-[15px] leading-7 text-blue-100/75">Nền tảng truy xuất nguồn gốc và xác thực sản phẩm của tỉnh Đồng Nai — kết nối minh bạch từ vùng nguyên liệu đến tay người tiêu dùng.</p>
      </div>
      <div className="relative z-10 flex items-end justify-between border-t border-white/15 pt-5">
        <div className="flex items-center gap-2 text-blue-100/70"><MapPin className="h-4 w-4 text-[#ffad5e]" strokeWidth={1.5} /><span className="text-xs">Đồng Nai, Việt Nam</span></div>
        <span className="font-mono text-[10px] tracking-[.18em] text-white/40">DN.TRACE / 01</span>
      </div>
    </section>
  );
}

function MobileBrand() {
  return (
    <div className="relative overflow-hidden bg-[#152978] px-6 pb-7 pt-7 text-white lg:hidden">
      <div className="absolute -right-20 -top-24 h-60 w-60 rounded-full bg-[#314ac6]/50 blur-3xl" />
      <div className="relative z-10 flex items-center justify-between">
        <TraceMark compact />
        <span className="font-mono text-[8px] uppercase tracking-[.18em] text-white/60">Cổng thông tin tỉnh</span>
      </div>
      <div className="relative z-10 mt-7 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#ffb265]">Nguồn gốc rõ ràng</p>
          <h1 className="mt-2 text-[25px] font-bold leading-tight tracking-[-.045em]">Mỗi sản phẩm,<br /><span className="text-[#ffb265]">một câu chuyện</span> đáng tin.</h1>
        </div>
        <div className="relative h-20 w-20 shrink-0 opacity-75">
          <svg viewBox="0 0 80 80" className="h-full w-full" aria-hidden="true"><path d="M3 62C22 48 23 35 36 30s19-1 26-13 12-9 17-14" fill="none" stroke="#ffad5e" strokeWidth="2" strokeDasharray="1 7" strokeLinecap="round" /><circle cx="23" cy="47" r="3" fill="#fff" /><circle cx="55" cy="22" r="3" fill="#fff" /></svg>
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setForgotSent(false);
    if (!identifier.trim() || !password.trim()) {
      setStatus('idle');
      setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }
    if (identifier.trim().length < 3 || password.length < 6) {
      setStatus('idle');
      setError('Thông tin đăng nhập chưa đúng định dạng. Vui lòng kiểm tra lại.');
      return;
    }
    setError('');
    setStatus('loading');
    window.setTimeout(() => setStatus('success'), 850);
  };

  const handleForgotPassword = () => {
    setForgotSent(true);
    setError('');
  };

  return (
    <section className="flex min-h-[calc(100dvh-0px)] flex-1 items-center justify-center bg-[#f5f7fb] px-5 py-10 sm:px-10 lg:px-14 xl:px-24" aria-label="Đăng nhập">
      <div className="w-full max-w-[475px] animate-rise-in">
        <div className="mb-9 lg:hidden"><MobileBrand /></div>
        <div className="mb-8 hidden items-start justify-between lg:flex">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.22em] text-[#E8650A]">Khu vực truy cập</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-.045em] text-[#17213a]">Chào mừng trở lại.</h2>
            <p className="mt-2 text-sm text-slate-500">Đăng nhập để tiếp tục quản lý dữ liệu truy xuất.</p>
          </div>
          <div className="mt-1 rounded-full bg-[#e9edff] p-2.5 text-[#2740BA]"><ShieldCheck className="h-5 w-5" strokeWidth={1.7} /></div>
        </div>
        <div className="rounded-[24px] border border-[#e0e5ef] bg-white p-6 shadow-[0_18px_60px_rgba(30,50,100,.08)] sm:p-9">
          <div className="mb-7 lg:hidden">
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#E8650A]">Khu vực truy cập</p>
            <h2 className="mt-2 text-[26px] font-bold tracking-[-.045em] text-[#17213a]">Chào mừng trở lại.</h2>
            <p className="mt-1.5 text-[13px] leading-5 text-slate-500">Đăng nhập để tiếp tục quản lý dữ liệu truy xuất.</p>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-5">
              <div>
                <label htmlFor="identifier" className="mb-2 block text-[12px] font-semibold text-[#34405a]">Tên đăng nhập hoặc email</label>
                <div className={`group relative flex items-center rounded-xl border bg-[#f9faff] transition-colors focus-within:border-[#2740BA] focus-within:ring-4 focus-within:ring-[#2740BA]/10 ${error && !identifier ? 'border-[#d85b5b]' : 'border-[#dfe4ee]'}`}>
                  <Mail className="pointer-events-none ml-3.5 h-[17px] w-[17px] text-slate-400 transition-colors group-focus-within:text-[#2740BA]" strokeWidth={1.7} />
                  <input id="identifier" data-testid="input-identifier" type="text" value={identifier} onChange={(event) => { setIdentifier(event.target.value); if (error) setError(''); }} autoComplete="username" placeholder="Ví dụ: nguyenvana hoặc email@donai.gov.vn" className="h-[50px] w-full bg-transparent px-3 text-[13px] text-[#1e2b45] outline-none placeholder:text-slate-400" aria-describedby={error ? 'login-error' : undefined} />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="mb-2 block text-[12px] font-semibold text-[#34405a]">Mật khẩu</label>
                <div className={`group relative flex items-center rounded-xl border bg-[#f9faff] transition-colors focus-within:border-[#2740BA] focus-within:ring-4 focus-within:ring-[#2740BA]/10 ${error && !password ? 'border-[#d85b5b]' : 'border-[#dfe4ee]'}`}>
                  <LockKeyhole className="pointer-events-none ml-3.5 h-[17px] w-[17px] text-slate-400 transition-colors group-focus-within:text-[#2740BA]" strokeWidth={1.7} />
                  <input id="password" data-testid="input-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => { setPassword(event.target.value); if (error) setError(''); }} autoComplete="current-password" placeholder="Nhập mật khẩu" className="h-[50px] w-full bg-transparent px-3 text-[13px] text-[#1e2b45] outline-none placeholder:text-slate-400" aria-describedby={error ? 'login-error' : undefined} />
                  <button type="button" data-testid="button-toggle-password" onClick={() => setShowPassword((visible) => !visible)} className="mr-2 rounded-lg p-2 text-slate-400 transition-colors hover:bg-[#e9edff] hover:text-[#2740BA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2740BA]" aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} aria-pressed={showPassword}>
                    {showPassword ? <EyeOff className="h-[17px] w-[17px]" strokeWidth={1.7} /> : <Eye className="h-[17px] w-[17px]" strokeWidth={1.7} />}
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-[12px] text-slate-600">
                <input type="checkbox" data-testid="checkbox-remember-login" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="peer sr-only" />
                <span className={`flex h-[17px] w-[17px] items-center justify-center rounded-[4px] border transition-colors ${remember ? 'border-[#2740BA] bg-[#2740BA]' : 'border-[#c8cfdd] bg-white'}`}>
                  {remember && <CircleCheck className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />}
                </span>
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <button type="button" data-testid="button-forgot-password" onClick={handleForgotPassword} className="rounded-md text-[12px] font-semibold text-[#2740BA] underline-offset-4 transition-colors hover:text-[#E8650A] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2740BA]">Quên mật khẩu?</button>
            </div>
            <div className="mt-6 min-h-[45px]" aria-live="polite">
              {error && <div id="login-error" data-testid="status-login-error" role="alert" className="flex items-start gap-2.5 rounded-xl border border-[#f2caca] bg-[#fff6f6] px-3.5 py-3 text-[12px] leading-5 text-[#b53d3d]"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} /><span>{error}</span></div>}
              {forgotSent && !error && <div data-testid="status-forgot-confirmation" role="status" className="flex items-start gap-2.5 rounded-xl border border-[#c9ddf4] bg-[#f3f8ff] px-3.5 py-3 text-[12px] leading-5 text-[#2740BA]"><HelpCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} /><span>Vui lòng liên hệ quản trị viên đơn vị để cấp lại mật khẩu.</span></div>}
              {status === 'success' && <div data-testid="status-login-success" role="status" className="flex items-start gap-2.5 rounded-xl border border-[#c7e6d5] bg-[#f2fbf6] px-3.5 py-3 text-[12px] leading-5 text-[#207a47]"><CircleCheck className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} /><span>Thông tin hợp lệ. Đang mở không gian làm việc của bạn.</span></div>}
            </div>
            <button type="submit" data-testid="button-submit-login" disabled={status === 'loading'} className="group mt-1 flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#E8650A] text-[13px] font-bold text-white shadow-[0_9px_20px_rgba(232,101,10,.2)] transition-[transform,background-color,box-shadow] hover:bg-[#d95c08] hover:shadow-[0_12px_24px_rgba(232,101,10,.28)] active:translate-y-px disabled:cursor-wait disabled:opacity-80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#E8650A]/25">
              {status === 'loading' ? <><Loader2 className="h-4 w-4 animate-spin" />Đang xác thực...</> : status === 'success' ? <>Đã xác thực <CircleCheck className="h-4 w-4" /></> : <>Đăng nhập <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></>}
            </button>
          </form>
          <div className="mt-7 flex items-center justify-center gap-2 text-center text-[11px] text-slate-400"><ShieldCheck className="h-3.5 w-3.5 text-[#2740BA]" strokeWidth={1.8} /><span>Dữ liệu của bạn được bảo vệ theo quy định an toàn thông tin.</span></div>
        </div>
        <div className="mt-7 flex items-center justify-between gap-4 px-1 text-[10px] text-slate-400">
          <span>© 2024 Đồng Nai Trace</span>
          <span className="font-mono tracking-[.12em]">PHIÊN BẢN 1.0.0</span>
        </div>
      </div>
    </section>
  );
}

function Home() {
  return (
    <main className="flex min-h-[100dvh] flex-col lg:flex-row">
      <PortalOverview />
      <LoginForm />
    </main>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;