import React, { useState, useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { 
  ShieldCheck, 
  Users, 
  Wallet, 
  Flame, 
  MessageSquare, 
  Share2, 
  Search, 
  Eye, 
  Edit3, 
  Save, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Send, 
  ArrowLeft, 
  History, 
  Lock, 
  LogOut, 
  ChevronRight,
  FileText,
  Radio,
  CheckCircle,
  XCircle,
  Copy,
  Check,
  Smartphone,
  UserCheck,
  Activity,
  BellRing,
  Volume2,
  Ban,
  Ticket,
  Sparkles
} from 'lucide-react';

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPhone] = useState('01728116153');
  const [adminPin, setAdminPin] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeSection, setActiveSection] = useState<'menu' | 'users' | 'add_money' | 'recharge_orders' | 'drive_orders' | 'offers' | 'history' | 'chats' | 'links' | 'live_users' | 'broadcast' | 'scratch_cards'>('menu');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [customMainBalance, setCustomMainBalance] = useState('');
  const [customDriveBalance, setCustomDriveBalance] = useState('');
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const [historyTab, setHistoryTab] = useState<'add_money' | 'recharge' | 'drive'>('add_money');
  const [cancellingOrder, setCancellingOrder] = useState<any | null>(null);
  const [cancelNote, setCancelNote] = useState('');

  const [selectedOperatorFilter, setSelectedOperatorFilter] = useState('Grameenphone');
  const [editingOffer, setEditingOffer] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // নোটিশ ও স্ক্র্যাচ কার্ড স্টেট
  const [runningNotice, setRunningNotice] = useState('🎉 স্বাগতম SIM OFFER SHOP এ! স্ক্র্যাচ কার্ড কিনে জিতে নিন আকর্ষণীয় মিনিট ও এমবি প্যাক।');
  const [noticeInput, setNoticeInput] = useState(runningNotice);
  const [soundAlertEnabled, setSoundAlertEnabled] = useState(true);
  const [broadcastMsg, setBroadcastMsg] = useState('');

  // স্ক্র্যাচ কার্ড ম্যানেজমেন্ট স্টেট (অ্যাডমিন নতুন কার্ড যোগ করতে পারবে)
  const [scratchCardsList, setScratchCardsList] = useState([
    { id: 'SC-1', type: 'Minute', title: '50 মিনিট (সবার জন্য)', price: 30, pin: '*123*88493021#' },
    { id: 'SC-2', type: 'Internet', title: '1 GB এমবি প্যাক', price: 25, pin: '*567*99201934#' }
  ]);
  const [newCard, setNewCard] = useState({ type: 'Minute', title: '', price: '', pin: '' });

  // পপ-আপ অ্যালার্ট স্টেট (কপি করার পর দেখানোর জন্য)
  const [popupAlert, setPopupAlert] = useState<string | null>(null);

  const handleCopyCardPin = (pin: string, id: string) => {
    navigator.clipboard.writeText(pin);
    setCopiedId(id);
    setPopupAlert('🎉 আপনার স্ক্র্যাচ কার্ডের নম্বরটি সফলভাবে কপি করা হয়ে গেছে! ডায়াল করে আপনার মিনিট/এমবি উপভোগ করুন।');
    setTimeout(() => {
      setCopiedId(null);
      setPopupAlert(null);
    }, 3500);
  };

  const appStats = {
    totalInstalls: 342,
    activeAccounts: 128,
    totalVaultBalance: 18500,
    onlineNowList: [
      { id: '1', name: 'User', phone: '01728116153', device: 'Android 14 (Pixel)', activeTime: 'Just now' },
      { id: '2', name: 'Rakib Telecom', phone: '01844556677', device: 'Android 13 (Realme)', activeTime: '2 mins ago' }
    ]
  };

  const [addMoneyLogs, setAddMoneyLogs] = useState([
    { id: 'AM-101', userName: 'User', userPhone: '01728116153', method: 'bKash', amount: 1000, balanceType: 'main', trxId: 'BK990011', time: '10:30 AM', status: 'Approved' }
  ]);

  const [rechargeOrders, setRechargeOrders] = useState([
    { id: 'RCH-101', userName: 'User', userPhone: '01728116153', operator: 'Grameenphone', amount: 200, targetNumber: '01711223344', time: '10:45 AM', status: 'Pending', note: '' }
  ]);

  const [driveOrders, setDriveOrders] = useState([
    { id: 'DRV-201', userName: 'User', userPhone: '01728116153', operator: 'Grameenphone', packageTitle: '30 GB + 700 Min', price: 580, targetNumber: '01711223344', time: '12:00 PM', status: 'Pending', note: '' }
  ]);

  const handleBack = () => {
    if (cancellingOrder) {
      setCancellingOrder(null);
      setCancelNote('');
    } else if (editingOffer) {
      setEditingOffer(null);
    } else if (editingUser) {
      setEditingUser(null);
    } else if (selectedUser) {
      setSelectedUser(null);
    } else if (activeSection !== 'menu') {
      setActiveSection('menu');
    }
  };

  useEffect(() => {
    const backListener = CapacitorApp.addListener('backButton', () => {
      if (cancellingOrder || editingOffer || editingUser || selectedUser || activeSection !== 'menu') {
        handleBack();
      } else {
        CapacitorApp.exitApp();
      }
    });

    return () => {
      backListener.then(handler => handler.remove());
    };
  }, [cancellingOrder, editingOffer, editingUser, selectedUser, activeSection]);

  const [operatorStatus, setOperatorStatus] = useState<Record<string, boolean>>({
    Grameenphone: true,
    Robi: true,
    Banglalink: true,
    Airtel: true,
    Teletalk: false
  });

  const [usersList, setUsersList] = useState([
    { id: '1', name: 'User', phone: '01728116153', pin: '1234', mainBalance: 1400, driveBalance: 3870, isBanned: false },
    { id: '2', name: 'Rakib Telecom', phone: '01844556677', pin: '5566', mainBalance: 500, driveBalance: 1200, isBanned: false }
  ]);

  const [addMoneyEnabled, setAddMoneyEnabled] = useState(true);
  const [paymentNumbers, setPaymentNumbers] = useState({
    bkash: '01728116153',
    nagad: '01728116153',
    rocket: '01728116153'
  });

  const [offers, setOffers] = useState([
    { id: '1', operator: 'Grameenphone', title: '30 GB + 700 Min (30 Days)', offerPrice: 580, cashback: 119, note: 'শুধু চট্টগ্রাম ও ঢাকা বিভাগের জন্য' }
  ]);

  const [newOffer, setNewOffer] = useState({ 
    operator: 'Grameenphone', 
    title: '', 
    offerPrice: '', 
    cashback: '', 
    note: '' 
  });

  const [chatUsers] = useState([
    { id: '1', name: 'User', phone: '01728116153', lastMsg: 'ভাই রিচার্জ আটকে আছে' }
  ]);
  const [activeChatUser, setActiveChatUser] = useState<any | null>(null);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'user', text: 'ভাই রিচার্জ আটকে আছে' }
  ]);
  const [replyText, setReplyText] = useState('');

  const [socialLinks, setSocialLinks] = useState({
    facebook: 'https://facebook.com',
    whatsappNumber: '01728116153',
    whatsappLink: 'https://wa.me/8801728116153'
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '1234' || adminPin.length >= 4) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('ভুল অ্যাডমিন পিন!');
    }
  };

  const handleOpenUser = (u: any) => {
    setSelectedUser(u);
    setCustomMainBalance(u.mainBalance.toString());
    setCustomDriveBalance(u.driveBalance.toString());
  };

  const handleSaveBalance = () => {
    if (!selectedUser) return;
    const main = customMainBalance === '' ? 0 : Number(customMainBalance);
    const drive = customDriveBalance === '' ? 0 : Number(customDriveBalance);

    setUsersList(prev => prev.map(u => u.id === selectedUser.id ? { ...u, mainBalance: main, driveBalance: drive } : u));
    setSelectedUser({ ...selectedUser, mainBalance: main, driveBalance: drive });
    alert('ব্যালেন্স আপডেট সফল!');
  };

  const handleSaveUserEdit = () => {
    if (!editingUser) return;
    setUsersList(prev => prev.map(u => u.id === editingUser.id ? editingUser : u));
    if (selectedUser?.id === editingUser.id) setSelectedUser(editingUser);
    setEditingUser(null);
  };

  const toggleUserBan = (userId: string) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, isBanned: !u.isBanned } : u));
    alert('ইউজারের স্ট্যাটাস পরিবর্তন করা হয়েছে!');
  };

  const toggleOperatorStatus = (operator: string) => {
    setOperatorStatus(prev => ({ ...prev, [operator]: !prev[operator] }));
  };

  const handleAddOffer = () => {
    if (!newOffer.title || !newOffer.offerPrice) {
      alert('অনুগ্রহ করে অফার টাইটেল ও মূল্য লিখুন');
      return;
    }
    setOffers(prev => [
      ...prev,
      { 
        id: Date.now().toString(), 
        operator: newOffer.operator, 
        title: newOffer.title, 
        offerPrice: Number(newOffer.offerPrice), 
        cashback: Number(newOffer.cashback) || 0,
        note: newOffer.note.trim()
      }
    ]);
    setNewOffer({ operator: 'Grameenphone', title: '', offerPrice: '', cashback: '', note: '' });
    alert('অফার সফলভাবে পাবলিশ হয়েছে!');
  };

  const handleAddNewCard = () => {
    if (!newCard.title || !newCard.price || !newCard.pin) {
      alert('সবগুলো ঘর পূরণ করুন!');
      return;
    }
    setScratchCardsList(prev => [
      ...prev,
      { id: 'SC-' + Date.now(), ...newCard, price: Number(newCard.price) }
    ]);
    setNewCard({ type: 'Minute', title: '', price: '', pin: '' });
    alert('নতুন স্ক্র্যাচ কার্ড তৈরি করা হয়েছে!');
  };

  const completeRechargeOrder = (id: string) => {
    setRechargeOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Completed' } : o));
  };

  const completeDriveOrder = (id: string) => {
    setDriveOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Completed' } : o));
  };

  const submitCancelOrder = (type: 'recharge' | 'drive') => {
    if (!cancellingOrder) return;
    if (type === 'recharge') {
      setRechargeOrders(prev => prev.map(o => o.id === cancellingOrder.id ? { ...o, status: 'Cancelled', note: cancelNote.trim() } : o));
    } else {
      setDriveOrders(prev => prev.map(o => o.id === cancellingOrder.id ? { ...o, status: 'Cancelled', note: cancelNote.trim() } : o));
    }
    setCancellingOrder(null);
    setCancelNote('');
  };

  const handleSendMessage = () => {
    if (!replyText.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'admin', text: replyText.trim() }]);
    setReplyText('');
  };

  const filteredUsers = usersList.filter(
    u => u.phone.includes(searchQuery.trim()) || u.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const visibleOffers = offers.filter(of => of.operator === selectedOperatorFilter);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 select-none font-sans">
        <div className="w-full max-w-xs bg-white rounded-3xl p-6 shadow-xl border border-slate-100 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-base font-black text-slate-900">SIM OFFER SHOP</h2>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-5">ADMIN PANEL ACCESS</p>

          <form onSubmit={handleLogin} className="space-y-3.5 text-left">
            {authError && <div className="p-2 bg-red-50 text-red-500 text-xs text-center rounded-xl border border-red-200">{authError}</div>}
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">অ্যাডমিন নম্বর</label>
              <input type="text" disabled value={adminPhone} className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-500 font-mono font-bold" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">অ্যাডমিন পিন</label>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-mono tracking-widest text-center focus:outline-none focus:border-indigo-600"
              />
            </div>
            <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-200 active:scale-95 transition-all">
              লগইন করুন
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col select-none font-sans">
      <header className="bg-white border-b border-slate-200 px-4 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          {(activeSection !== 'menu' || selectedUser) ? (
            <button 
              type="button"
              onClick={handleBack}
              className="p-2 -ml-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 active:scale-90 transition-all flex items-center justify-center cursor-pointer shadow-sm"
              title="পিছনে যান"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
          )}
          <div>
            <h1 className="text-sm font-black text-slate-900 leading-tight">SIM OFFER SHOP ADMIN PANEL</h1>
            <p className="text-[11px] text-slate-500 font-medium">অ্যাডমিন কন্ট্রোল ড্যাশবোর্ড</p>
          </div>
        </div>

        {activeSection === 'menu' && !selectedUser && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundAlertEnabled(!soundAlertEnabled)}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${soundAlertEnabled ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-400'}`}
              title="অর্ডার অ্যালার্ট সাউন্ড অন/অফ"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 active:scale-95 transition-all"
              title="লগআউট"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 p-4 max-w-lg mx-auto w-full overflow-y-auto">
        {activeSection === 'menu' && (
          <div className="space-y-4">
            {/* কন্ট্রোল রুম: ইনস্টল কাউন্ট, অ্যাকাউন্ট কাউন্ট এবং ভল্ট ব্যালেন্স */}
            <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 text-white shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider bg-white/10 px-2.5 py-1 rounded-lg">
                  Realtime App Metrics & Vault
                </span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" /> Live System
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                  <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-sky-400" /> অ্যাপ ইনস্টল করেছে
                  </p>
                  <h3 className="text-base font-black font-mono text-white mt-1">{appStats.totalInstalls} জন</h3>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                  <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-emerald-400" /> সচল অ্যাকাউন্ট
                  </p>
                  <h3 className="text-base font-black font-mono text-emerald-400 mt-1">{appStats.activeAccounts} জন</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div 
                  onClick={() => setActiveSection('users')}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-3 cursor-pointer transition-all active:scale-95"
                >
                  <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                    <Wallet className="w-3 h-3 text-amber-400" /> মোট জমা ব্যালেন্স (Vault)
                  </p>
                  <h3 className="text-base font-black font-mono text-amber-400 mt-1">৳{appStats.totalVaultBalance.toLocaleString()}</h3>
                </div>

                <div 
                  onClick={() => setActiveSection('live_users')}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-3 cursor-pointer transition-all active:scale-95 group"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <Activity className="w-3 h-3 text-rose-400 animate-pulse" /> বর্তমানে অনলাইনে আছে
                    </p>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                  </div>
                  <h3 className="text-base font-black font-mono text-rose-400 mt-1">{appStats.onlineNowList.length} জন</h3>
                </div>
              </div>
            </div>

            {/* ড্যাশবোর্ড কার্ড অপশনগুলো */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => setActiveSection('recharge_orders')}
                className="bg-white border border-slate-200/80 rounded-3xl p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md active:scale-95 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-2">
                  <Send className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-900">রিচার্জ অর্ডার</span>
                <span className="text-[10px] text-slate-400">কমপ্লিট বা ক্যানসেল</span>
              </button>

              <button
                onClick={() => setActiveSection('drive_orders')}
                className="bg-white border border-slate-200/80 rounded-3xl p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md active:scale-95 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
                  <Flame className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-900">ড্রাইভ অর্ডার</span>
                <span className="text-[10px] text-slate-400">প্যাকেজ রিকোয়েস্ট</span>
              </button>

              <button
                onClick={() => setActiveSection('scratch_cards')}
                className="bg-white border border-slate-200/80 rounded-3xl p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md active:scale-95 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center mb-2">
                  <Ticket className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-900">স্ক্র্যাচ কার্ড (মিনিট/এমবি)</span>
                <span className="text-[10px] text-slate-400">লাকি কুপন ম্যানেজ</span>
              </button>

              <button
                onClick={() => setActiveSection('history')}
                className="bg-white border border-slate-200/80 rounded-3xl p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md active:scale-95 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mb-2">
                  <History className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-900">History (সকল তথ্য)</span>
                <span className="text-[10px] text-slate-400">এড-মানি, রিচার্জ ও ড্রাইভ</span>
              </button>

              <button
                onClick={() => setActiveSection('add_money')}
                className="bg-white border border-slate-200/80 rounded-3xl p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md active:scale-95 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                  <Wallet className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-900">এড মানি কন্ট্রোল</span>
                <span className="text-[10px] text-slate-400">অন/অফ ও নম্বর</span>
              </button>

              <button
                onClick={() => setActiveSection('offers')}
                className="bg-white border border-slate-200/80 rounded-3xl p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md active:scale-95 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
                  <Radio className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-900">ড্রাইভ প্যাক কন্ট্রোল</span>
                <span className="text-[10px] text-slate-400">সিম ও অফার ম্যানেজ</span>
              </button>

              <button
                onClick={() => setActiveSection('chats')}
                className="bg-white border border-slate-200/80 rounded-3xl p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md active:scale-95 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-900">লাইভ চ্যাট সাপোর্ট</span>
                <span className="text-[10px] text-slate-400">গ্রাহকের সাথে মেসেজ</span>
              </button>

              <button
                onClick={() => setActiveSection('broadcast')}
                className="bg-white border border-slate-200/80 rounded-3xl p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md active:scale-95 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                  <BellRing className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-900">নোটিশ ব্রডকাস্ট</span>
                <span className="text-[10px] text-slate-400">সবার অ্যাপে নোটিশ পাঠান</span>
              </button>
            </div>
          </div>
        )}

        {/* নতুন: স্ক্র্যাচ কার্ড ম্যানেজমেন্ট ও জেনারেটর */}
        {activeSection === 'scratch_cards' && (
          <div className="space-y-4">
            <div className="bg-white border rounded-3xl p-4 space-y-3 shadow-sm">
              <h4 className="text-xs font-bold text-slate-900 border-b pb-2 flex items-center gap-1.5">
                <Ticket className="w-4 h-4 text-pink-600" /> নতুন স্ক্র্যাচ কার্ড (মিনিট / এমবি) তৈরি করুন
              </h4>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">কার্ডের ধরণ (Type)</label>
                <select
                  value={newCard.type}
                  onChange={(e) => setNewCard({ ...newCard, type: e.target.value })}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold"
                >
                  <option value="Minute">Minute Card (মিনিট প্যাক)</option>
                  <option value="Internet">Internet Card (এমবি প্যাক)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">প্যাকেজ বিবরণ / টাইটেল</label>
                <input 
                  type="text" 
                  placeholder="যেমন: ১০০ মিনিট (সব সিমে)" 
                  value={newCard.title} 
                  onChange={(e) => setNewCard({ ...newCard, title: e.target.value })} 
                  className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-medium" 
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">মূল্য (৳)</label>
                  <input 
                    type="number" 
                    placeholder="যেমন: 50" 
                    value={newCard.price} 
                    onChange={(e) => setNewCard({ ...newCard, price: e.target.value })} 
                    className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold font-mono" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">সিক্রেট পিন / ডায়াল কোড</label>
                  <input 
                    type="text" 
                    placeholder="যেমন: *123*993821#" 
                    value={newCard.pin} 
                    onChange={(e) => setNewCard({ ...newCard, pin: e.target.value })} 
                    className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold font-mono text-indigo-600" 
                  />
                </div>
              </div>

              <button 
                onClick={handleAddNewCard} 
                className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" /> স্ক্র্যাচ কার্ড পাবলিশ করুন
              </button>
            </div>

            <div className="bg-white border rounded-3xl p-4 space-y-3 shadow-sm">
              <h4 className="text-xs font-bold text-slate-900 border-b pb-2">সক্রিয় স্ক্র্যাচ কার্ড লিস্ট ({scratchCardsList.length})</h4>
              <div className="space-y-2.5">
                {scratchCardsList.map((card) => (
                  <div key={card.id} className="bg-slate-50 border rounded-2xl p-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${card.type === 'Minute' ? 'bg-sky-50 text-sky-700' : 'bg-emerald-50 text-emerald-700'}`}>
                          {card.type}
                        </span>
                        <h5 className="font-bold text-slate-900">{card.title}</h5>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">মূল্য: ৳{card.price} | পিন: <strong className="font-mono text-indigo-600">{card.pin}</strong></p>
                    </div>
                    <button 
                      onClick={() => handleCopyCardPin(card.pin, card.id)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-bold flex items-center gap-1 active:scale-95"
                    >
                      {copiedId === card.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === card.id ? 'কপি!' : 'কপি পিন'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* লাইভ অনলাইন ইউজার ট্র্যাকার পেজ */}
        {activeSection === 'live_users' && (
          <div className="space-y-4">
            <div className="bg-white border rounded-3xl p-4 space-y-3 shadow-sm">
              <h4 className="text-xs font-bold text-slate-900 border-b pb-2 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-rose-500 animate-pulse" /> বর্তমানে অ্যাপ ওপেন করে আছে যারা (Live Online)
              </h4>

              <div className="space-y-2.5">
                {appStats.onlineNowList.map((usr) => (
                  <div key={usr.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span className="font-bold text-slate-900">{usr.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({usr.phone})</span>
                      </div>
                      <p className="text-[10px] text-slate-500">ডিভাইস: {usr.device}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">
                      {usr.activeTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* নোটিশ ব্রডকাস্ট পেজ */}
        {activeSection === 'broadcast' && (
          <div className="space-y-4">
            <div className="bg-white border rounded-3xl p-4 space-y-3 shadow-sm">
              <h4 className="text-xs font-bold text-slate-900 border-b pb-2 flex items-center gap-1.5">
                <BellRing className="w-4 h-4 text-indigo-600" /> অ্যাপ রানিং নোটিশ (Marquee Notice) পরিবর্তন
              </h4>
              <input
                type="text"
                value={noticeInput}
                onChange={(e) => setNoticeInput(e.target.value)}
                className="w-full bg-slate-50 border rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-indigo-600"
              />
              <button
                onClick={() => {
                  setRunningNotice(noticeInput);
                  alert('রানিং নোটিশ সফলভাবে আপডেট হয়েছে!');
                }}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                নোটিশ আপডেট করুন
              </button>
            </div>
          </div>
        )}

        {/* মোট ইউজার ম্যানেজার */}
        {activeSection === 'users' && !selectedUser && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="নম্বর বা নাম দিয়ে গ্রাহক খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 shadow-sm focus:outline-none focus:border-indigo-600 font-medium"
              />
            </div>

            <div className="flex justify-between items-center px-1 text-[11px] text-slate-500">
              <span>মোট নিবন্ধিত গ্রাহক: {filteredUsers.length} জন</span>
              <span>ক্লিক করে প্রোফাইল দেখুন</span>
            </div>

            <div className="space-y-2.5">
              {filteredUsers.map((u) => (
                <div 
                  key={u.id} 
                  onClick={() => handleOpenUser(u)}
                  className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between shadow-sm cursor-pointer active:scale-98 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        {u.name}
                        {u.isBanned ? (
                          <span className="text-[9px] bg-rose-50 text-rose-600 border border-rose-200 px-1.5 py-0.2 rounded font-bold">Blocked</span>
                        ) : (
                          <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.2 rounded font-semibold">Active</span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono">📱 {u.phone}</p>
                      <p className="text-[10px] text-slate-400">
                        পিন: <span className="font-mono font-bold text-amber-600">{u.pin}</span> | মেইন: ৳{u.mainBalance} | ড্রাইভ: ৳{u.driveBalance}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => toggleUserBan(u.id)} 
                      className={`p-2 rounded-xl text-xs font-bold ${u.isBanned ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}
                      title={u.isBanned ? 'আনব্লক করুন' : 'ব্লক করুন'}
                    >
                      {u.isBanned ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleOpenUser(u)} className="p-2 bg-slate-100 rounded-xl text-slate-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingUser(u)} className="p-2 bg-slate-100 rounded-xl text-slate-600">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* গ্রাহক প্রোফাইল ও ব্যালেন্স মডিফাই */}
        {activeSection === 'users' && selectedUser && (
          <div className="space-y-4">
            <div className="bg-white border rounded-3xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedUser.name}</h3>
                <p className="text-xs text-slate-500 font-mono">📱 {selectedUser.phone}</p>
                <p className="text-xs text-amber-600 font-mono font-bold mt-0.5">🔑 পিন: {selectedUser.pin}</p>
              </div>
              <button onClick={() => setEditingUser(selectedUser)} className="p-2 bg-slate-100 rounded-xl text-xs font-bold flex items-center gap-1">
                <Edit3 className="w-3.5 h-3.5" /> এডিট
              </button>
            </div>

            <div className="bg-white border rounded-3xl p-4 space-y-3 shadow-sm">
              <h4 className="text-xs font-bold text-slate-800">ব্যালেন্স মডিফিকেশন</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border rounded-2xl p-3">
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">মেইন ব্যালেন্স (৳)</label>
                  <input
                    type="number"
                    value={customMainBalance}
                    onChange={(e) => setCustomMainBalance(e.target.value)}
                    className="w-full bg-white border rounded-xl px-3 py-2 text-sm font-mono font-bold"
                  />
                </div>
                <div className="bg-slate-50 border rounded-2xl p-3">
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">ড্রাইভ ব্যালেন্স (৳)</label>
                  <input
                    type="number"
                    value={customDriveBalance}
                    onChange={(e) => setCustomDriveBalance(e.target.value)}
                    className="w-full bg-white border rounded-xl px-3 py-2 text-sm font-mono font-bold"
                  />
                </div>
              </div>
              <button onClick={handleSaveBalance} className="w-full py-3 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md active:scale-95">
                <Save className="w-4 h-4 inline mr-1" /> ব্যালেন্স আপডেট করুন
              </button>
            </div>
          </div>
        )}

        {/* রিচার্জ অর্ডার */}
        {activeSection === 'recharge_orders' && (
          <div className="space-y-4">
            <div className="bg-white border rounded-3xl p-4 space-y-3 shadow-sm">
              <h4 className="text-xs font-bold text-slate-900 border-b pb-2 flex items-center gap-1.5">
                <Send className="w-4 h-4 text-sky-600" /> ফ্লেক্সিলোড / রিচার্জ অর্ডার রিকোয়েস্ট
              </h4>

              <div className="space-y-2.5">
                {rechargeOrders.map((ord) => (
                  <div key={ord.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">{ord.operator}</span>
                        <span className="text-xs font-bold text-slate-900">৳{ord.amount}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                        ord.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        ord.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {ord.status}
                      </span>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-2.5 space-y-1">
                      <p className="text-[11px] text-slate-700">গ্রাহক: <strong className="text-slate-900">{ord.userName}</strong> ({ord.userPhone})</p>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="text-[11px] text-slate-600">প্রাপক নম্বর: <strong className="font-mono text-indigo-700 text-xs">{ord.targetNumber}</strong></span>
                        <button
                          onClick={() => handleCopyCardPin(ord.targetNumber, ord.id)}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all active:scale-95"
                        >
                          {copiedId === ord.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === ord.id ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
                        </button>
                      </div>
                    </div>

                    {ord.status === 'Pending' && (
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => completeRechargeOrder(ord.id)} className="flex-1 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Complete
                        </button>
                        <button onClick={() => setCancellingOrder({ ...ord, type: 'recharge' })} className="flex-1 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ড্রাইভ অর্ডার */}
        {activeSection === 'drive_orders' && (
          <div className="space-y-4">
            <div className="bg-white border rounded-3xl p-4 space-y-3 shadow-sm">
              <h4 className="text-xs font-bold text-slate-900 border-b pb-2 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-600" /> ড্রাইভ প্যাক অর্ডার রিকোয়েস্ট
              </h4>

              <div className="space-y-2.5">
                {driveOrders.map((ord) => (
                  <div key={ord.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">{ord.operator}</span>
                        <span className="text-xs font-bold text-slate-900">{ord.packageTitle} - ৳{ord.price}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                        ord.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        ord.status === 'Cancelled' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {ord.status}
                      </span>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-2.5 space-y-1">
                      <p className="text-[11px] text-slate-700">গ্রাহক: <strong className="text-slate-900">{ord.userName}</strong> ({ord.userPhone})</p>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="text-[11px] text-slate-600">প্রাপক নম্বর: <strong className="font-mono text-indigo-700 text-xs">{ord.targetNumber}</strong></span>
                        <button
                          onClick={() => handleCopyCardPin(ord.targetNumber, ord.id)}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all active:scale-95"
                        >
                          {copiedId === ord.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === ord.id ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
                        </button>
                      </div>
                    </div>

                    {ord.status === 'Pending' && (
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => completeDriveOrder(ord.id)} className="flex-1 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Complete
                        </button>
                        <button onClick={() => setCancellingOrder({ ...ord, type: 'drive' })} className="flex-1 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* হিস্ট্রি অপশন */}
        {activeSection === 'history' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-1.5 bg-slate-200/80 p-1 rounded-2xl">
              <button onClick={() => setHistoryTab('add_money')} className={`py-2 rounded-xl text-[11px] font-bold transition-all ${historyTab === 'add_money' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}>এড-মানি হিস্ট্রি</button>
              <button onClick={() => setHistoryTab('recharge')} className={`py-2 rounded-xl text-[11px] font-bold transition-all ${historyTab === 'recharge' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}>রিচার্জ হিস্ট্রি</button>
              <button onClick={() => setHistoryTab('drive')} className={`py-2 rounded-xl text-[11px] font-bold transition-all ${historyTab === 'drive' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}>ড্রাইভ হিস্ট্রি</button>
            </div>

            {historyTab === 'add_money' && (
              <div className="bg-white border rounded-3xl p-4 space-y-3 shadow-sm">
                <h4 className="text-xs font-bold text-slate-900 border-b pb-2">এড-মানি হিস্ট্রি রিপোর্ট</h4>
                <div className="space-y-2.5">
                  {addMoneyLogs.map((log) => (
                    <div key={log.id} className="bg-slate-50 border rounded-2xl p-3 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-900">৳{log.amount} ({log.method})</p>
                        <p className="text-[11px] text-slate-600">TrxID: <strong className="font-mono text-indigo-600">{log.trxId}</strong></p>
                        <p className="text-[10px] text-slate-400">গ্রাহক: {log.userName} ({log.userPhone})</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">{log.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* এড মানি কন্ট্রোল */}
        {activeSection === 'add_money' && (
          <div className="space-y-4">
            <div className="bg-white border rounded-3xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Add Balance সার্ভিস</h4>
                <p className="text-[10px] text-slate-400">বন্ধ করলে ইউজাররা টাকা পাঠাতে পারবে না</p>
              </div>
              <button onClick={() => setAddMoneyEnabled(!addMoneyEnabled)}>
                {addMoneyEnabled ? (
                  <span className="text-emerald-600 text-xs font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1"><ToggleRight className="w-5 h-5" /> চালু</span>
                ) : (
                  <span className="text-rose-600 text-xs font-bold bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl flex items-center gap-1"><ToggleLeft className="w-5 h-5" /> বন্ধ</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ড্রাইভ অফার কন্ট্রোল */}
        {activeSection === 'offers' && (
          <div className="space-y-4">
            <div className="bg-white border rounded-3xl p-4 space-y-3 shadow-sm">
              <h4 className="text-xs font-bold text-slate-900 border-b pb-2">নতুন ড্রাইভ অফার তৈরি করুন</h4>
              <div><label className="text-[10px] font-bold text-slate-500 block mb-1">অপারেটর</label>
                <select value={newOffer.operator} onChange={(e) => setNewOffer({ ...newOffer, operator: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold">
                  <option value="Grameenphone">GP</option><option value="Robi">Robi</option><option value="Banglalink">Banglalink</option><option value="Airtel">Airtel</option><option value="Teletalk">Teletalk</option>
                </select>
              </div>
              <div><label className="text-[10px] font-bold text-slate-500 block mb-1">টাইটেল</label><input type="text" placeholder="যেমন: 30 GB" value={newOffer.title} onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs" /></div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-[10px] font-bold text-slate-500 block mb-1">মূল্য (৳)</label><input type="number" placeholder="580" value={newOffer.offerPrice} onChange={(e) => setNewOffer({ ...newOffer, offerPrice: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold" /></div>
                <div><label className="text-[10px] font-bold text-slate-500 block mb-1">কমিশন (৳)</label><input type="number" placeholder="120" value={newOffer.cashback} onChange={(e) => setNewOffer({ ...newOffer, cashback: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-bold" /></div>
              </div>
              <button onClick={handleAddOffer} className="w-full py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md">অফার পাবলিশ করুন</button>
            </div>
          </div>
        )}

        {/* লাইভ চ্যাট */}
        {activeSection === 'chats' && (
          <div className="bg-white border rounded-3xl p-3.5 h-[420px] flex flex-col shadow-sm">
            <div className="border-b pb-2 mb-2 flex items-center gap-2"><h4 className="text-xs font-bold text-slate-900">লাইভ চ্যাট সাপোর্ট</h4></div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs ${msg.sender === 'admin' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-800'}`}>{msg.text}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <input type="text" placeholder="উত্তর লিখুন..." value={replyText} onChange={(e) => setReplyText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} className="flex-1 bg-slate-50 border rounded-xl px-3 py-2 text-xs focus:outline-none" />
              <button onClick={handleSendMessage} className="p-2.5 bg-indigo-600 text-white rounded-xl"><Send className="w-4 h-4" /></button>
            </div>
          </div>
        )}

        {/* সোশ্যাল লিংক */}
        {activeSection === 'links' && (
          <div className="bg-white border rounded-3xl p-4 space-y-3.5 shadow-sm">
            <h4 className="text-xs font-bold text-slate-900 border-b pb-2">সোশ্যাল সাপোর্ট লিঙ্ক কনফিগার</h4>
            <div><label className="text-[10px] font-bold text-blue-600 block mb-1">Facebook লিংক</label><input type="text" value={socialLinks.facebook} onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs" /></div>
            <div><label className="text-[10px] font-bold text-emerald-600 block mb-1">WhatsApp লিংক</label><input type="text" value={socialLinks.whatsappLink} onChange={(e) => setSocialLinks({ ...socialLinks, whatsappLink: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-mono" /></div>
            <button onClick={() => alert('সংরক্ষিত হয়েছে!')} className="w-full py-3 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md">সেভ করুন</button>
          </div>
        )}
      </main>

      {/* আধুনিক পপ-আপ অ্যালার্ট (স্ক্র্যাচ কার্ড বা নম্বর কপি করার পর দেখানোর জন্য) */}
      {popupAlert && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 leading-snug">সফলভাবে কপি হয়েছে!</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{popupAlert}</p>
            </div>
            <button
              onClick={() => setPopupAlert(null)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md active:scale-95 transition-all"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}
    </div>
  );
              }
