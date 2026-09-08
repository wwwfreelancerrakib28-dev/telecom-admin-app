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
  Sparkles,
  ListFilter
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

  const [runningNotice, setRunningNotice] = useState('🎉 স্বাগতম SIM OFFER SHOP এ!');
  const [noticeInput, setNoticeInput] = useState(runningNotice);
  const [soundAlertEnabled, setSoundAlertEnabled] = useState(true);
  const [broadcastMsg, setBroadcastMsg] = useState('');

  const [scratchCardsList, setScratchCardsList] = useState([
    { id: 'SC-1', type: 'Minute', title: '50 মিনিট প্যাক', price: 30, pin: '*123*88493021#' }
  ]);
  const [newCard, setNewCard] = useState({ type: 'Minute', title: '', price: '', pin: '' });
  const [popupAlert, setPopupAlert] = useState<string | null>(null);

  const handleCopyCardPin = (pin: string, id: string) => {
    navigator.clipboard.writeText(pin);
    setCopiedId(id);
    setPopupAlert('🎉 সফলভাবে কপি হয়েছে!');
    setTimeout(() => {
      setCopiedId(null);
      setPopupAlert(null);
    }, 3000);
  };

  const appStats = {
    totalInstalls: 342,
    activeAccounts: 128,
    totalBalance: 18500,
    onlineNowList: [
      { id: '1', name: 'User', phone: '01728116153', device: 'Android 14', activeTime: 'Now' }
    ]
  };

  const onlineCount = appStats.onlineNowList.length;

  const [addMoneyLogs, setAddMoneyLogs] = useState([
    { id: 'AM-101', userName: 'User', userPhone: '01728116153', method: 'bKash', amount: 1000, balanceType: 'main', trxId: 'BK990011', time: '10:30 AM', status: 'Approved' }
  ]);

  const [rechargeOrders, setRechargeOrders] = useState([
    { id: 'RCH-101', userId: '1', userName: 'User', userPhone: '01728116153', userMainBal: 1400, userDriveBal: 3870, operator: 'Grameenphone', amount: 200, targetNumber: '01711223344', time: '10:45 AM', status: 'Pending', note: '' }
  ]);

  // ড্রাইভ অর্ডারে সিম লোন স্ট্যাটাস (hasLoan: true/false) যোগ করা হয়েছে
  const [driveOrders, setDriveOrders] = useState([
    { id: 'DRV-201', userId: '1', userName: 'User', userPhone: '01728116153', userMainBal: 1400, userDriveBal: 3870, operator: 'Grameenphone', packageTitle: '30 GB + 700 Min', price: 580, targetNumber: '01711223344', time: '12:00 PM', status: 'Pending', hasLoan: false, note: '' }
  ]);

  const pendingRechargeCount = rechargeOrders.filter(o => o.status === 'Pending').length;
  const pendingDriveCount = driveOrders.filter(o => o.status === 'Pending').length;

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
    Grameenphone: true, Robi: true, Banglalink: true, Airtel: true, Teletalk: false
  });

  const [usersList, setUsersList] = useState([
    { id: '1', name: 'User', phone: '01728116153', pin: '1234', mainBalance: 1400, driveBalance: 3870, isBanned: false },
    { id: '2', name: 'Rakib Telecom', phone: '01844556677', pin: '5566', mainBalance: 500, driveBalance: 1200, isBanned: false }
  ]);

  const [addMoneyEnabled, setAddMoneyEnabled] = useState(true);
  const [paymentNumbers, setPaymentNumbers] = useState({ bkash: '01728116153', nagad: '01728116153', rocket: '01728116153' });

  const [offers, setOffers] = useState([
    { id: '1', operator: 'Grameenphone', title: '30 GB + 700 Min (30 Days)', offerPrice: 580, cashback: 119, profit: 45, note: 'ঢাকা ও চট্টগ্রাম' }
  ]);
  const [newOffer, setNewOffer] = useState({ operator: 'Grameenphone', title: '', offerPrice: '', cashback: '', profit: '', note: '' });

  const [chatMessages, setChatMessages] = useState([{ sender: 'user', text: 'ভাই রিচার্জ আটকে আছে' }]);
  const [replyText, setReplyText] = useState('');
  const [socialLinks, setSocialLinks] = useState({ facebook: 'https://facebook.com', whatsappNumber: '01728116153', whatsappLink: 'https://wa.me/8801728116153' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '1234' || adminPin.length >= 4) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('ভুল পিন!');
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

  const toggleUserBan = (userId: string) => {
    setUsersList(prev => prev.map(u => u.id === userId ? { ...u, isBanned: !u.isBanned } : u));
  };

  // ড্রাইভ অর্ডারে লোন টগল করার ফাংশন (হ্যাঁ/না)
  const toggleDriveLoanStatus = (id: string) => {
    setDriveOrders(prev => prev.map(o => o.id === id ? { ...o, hasLoan: !o.hasLoan } : o));
  };

  // ড্রাইভ কমপ্লিট করার সময় লোন চেক করা
  const handleCompleteDrive = (ord: any) => {
    if (ord.hasLoan) {
      alert('⚠️ এই নম্বরে লোন আছে! লোন থাকা অবস্থায় ড্রাইভ কমপ্লিট করা যাবে না। প্রথমে লোন পরিশোধ করতে বলুন।');
      return;
    }
    completeDriveOrder(ord.id);
  };

  const handleAddOffer = () => {
    if (!newOffer.title || !newOffer.offerPrice) return alert('তথ্য দিন');
    setOffers(prev => [...prev, { id: Date.now().toString(), ...newOffer, offerPrice: Number(newOffer.offerPrice), cashback: Number(newOffer.cashback) || 0, profit: Number(newOffer.profit) || 0 }]);
    setNewOffer({ operator: 'Grameenphone', title: '', offerPrice: '', cashback: '', profit: '', note: '' });
    alert('পাবলিশ হয়েছে!');
  };

  const handleSaveEditedOffer = () => {
    if (!editingOffer) return;
    setOffers(prev => prev.map(o => o.id === editingOffer.id ? editingOffer : o));
    setEditingOffer(null);
    alert('মডিফাই সফল হয়েছে!');
  };

  const handleAddNewCard = () => {
    if (!newCard.title || !newCard.price || !newCard.pin) return alert('সব পূরণ করুন');
    setScratchCardsList(prev => [...prev, { id: 'SC-' + Date.now(), ...newCard, price: Number(newCard.price) }]);
    setNewCard({ type: 'Minute', title: '', price: '', pin: '' });
    alert('কার্ড তৈরি হয়েছে!');
  };

  const completeRechargeOrder = (id: string) => setRechargeOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Completed' } : o));
  const completeDriveOrder = (id: string) => setDriveOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Completed' } : o));

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

  const filteredUsers = usersList.filter(u => u.phone.includes(searchQuery.trim()) || u.name.toLowerCase().includes(searchQuery.toLowerCase().trim()));
  const visibleOffers = offers.filter(of => of.operator === selectedOperatorFilter);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 select-none font-sans">
        <div className="w-full max-w-xs bg-white rounded-3xl p-6 shadow-xl border text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3"><Lock className="w-6 h-6" /></div>
          <h2 className="text-sm font-black text-slate-900">ADMIN LOGIN</h2>
          <form onSubmit={handleLogin} className="space-y-3 mt-4 text-left">
            {authError && <div className="p-2 bg-red-50 text-red-500 text-xs text-center rounded-xl">{authError}</div>}
            <input type="password" inputMode="numeric" maxLength={6} value={adminPin} onChange={(e) => setAdminPin(e.target.value)} placeholder="অ্যাডমিন পিন (••••)" className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs text-center font-bold tracking-widest" />
            <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md">লগইন</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col select-none font-sans text-xs">
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2.5">
          {(activeSection !== 'menu' || selectedUser) ? (
            <button onClick={handleBack} className="p-1.5 -ml-1 rounded-xl bg-slate-100"><ArrowLeft className="w-4 h-4" /></button>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold relative">
              <ShieldCheck className="w-4 h-4" />
              {onlineCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white font-bold text-[8px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {onlineCount}
                </span>
              )}
            </div>
          )}
          <div>
            <h1 className="text-xs font-black text-slate-900">SIM OFFER SHOP ADMIN</h1>
            <p className="text-[10px] text-slate-400">কন্ট্রোল ড্যাশবোর্ড</p>
          </div>
        </div>
        {activeSection === 'menu' && !selectedUser && (
          <div className="flex items-center gap-1.5">
            <button onClick={() => setSoundAlertEnabled(!soundAlertEnabled)} className={`p-2 rounded-xl ${soundAlertEnabled ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}><Volume2 className="w-4 h-4" /></button>
            <button onClick={() => setIsAuthenticated(false)} className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600"><LogOut className="w-4 h-4" /></button>
          </div>
        )}
      </header>

      <main className="flex-1 p-3 max-w-lg mx-auto w-full overflow-y-auto space-y-3">
        {activeSection === 'menu' && (
          <div className="space-y-3">
            <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-3 text-white shadow-lg space-y-2">
              <div className="flex justify-between items-center text-[10px] text-slate-300 font-bold border-b border-white/10 pb-1">
                <span>📊 SYSTEM METRICS</span>
                <span className="text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" /> Live</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-center">
                <div className="bg-white/5 border border-white/10 rounded-xl p-1.5">
                  <span className="text-[8px] text-slate-400 block">ইনস্টল</span>
                  <strong className="text-xs font-black text-white font-mono">{appStats.totalInstalls}</strong>
                </div>
                <div onClick={() => setActiveSection('users')} className="bg-white/5 border border-white/10 rounded-xl p-1.5 cursor-pointer active:scale-95">
                  <span className="text-[8px] text-slate-400 block">ইউজার ও সার্চ</span>
                  <strong className="text-xs font-black text-emerald-400 font-mono">{appStats.activeAccounts}</strong>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-1.5">
                  <span className="text-[8px] text-slate-400 block">মোট ব্যালেন্স</span>
                  <strong className="text-xs font-black text-amber-400 font-mono">৳{appStats.totalBalance}</strong>
                </div>
                <div onClick={() => setActiveSection('live_users')} className="bg-white/5 border border-white/10 rounded-xl p-1.5 cursor-pointer active:scale-95">
                  <span className="text-[8px] text-slate-400 block">অনলাইন</span>
                  <strong className="text-xs font-black text-rose-400 font-mono">{onlineCount} জন</strong>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button onClick={() => setActiveSection('recharge_orders')} className="bg-white border rounded-2xl p-3 flex flex-col items-center text-center shadow-sm active:scale-95 relative">
                {pendingRechargeCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 bg-rose-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {pendingRechargeCount}
                  </span>
                )}
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-1.5"><Send className="w-4 h-4" /></div>
                <span className="font-bold text-slate-900">রিচার্জ অর্ডার</span>
                <span className="text-[9px] text-slate-400">কমপ্লিট / ক্যানসেল</span>
              </button>

              <button onClick={() => setActiveSection('drive_orders')} className="bg-white border rounded-2xl p-3 flex flex-col items-center text-center shadow-sm active:scale-95 relative">
                {pendingDriveCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 bg-rose-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {pendingDriveCount}
                  </span>
                )}
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1.5"><Flame className="w-4 h-4" /></div>
                <span className="font-bold text-slate-900">ড্রাইভ অর্ডার</span>
                <span className="text-[9px] text-slate-400">প্যাকেজ রিকোয়েস্ট</span>
              </button>

              <button onClick={() => setActiveSection('scratch_cards')} className="bg-white border rounded-2xl p-3 flex flex-col items-center text-center shadow-sm active:scale-95">
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-1.5"><Ticket className="w-4 h-4" /></div>
                <span className="font-bold text-slate-900">স্ক্র্যাচ কার্ড</span>
                <span className="text-[9px] text-slate-400">মিনিট ও এমবি প্যাক</span>
              </button>

              <button onClick={() => setActiveSection('offers')} className="bg-white border rounded-2xl p-3 flex flex-col items-center text-center shadow-sm active:scale-95">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-1.5"><Radio className="w-4 h-4" /></div>
                <span className="font-bold text-slate-900">ড্রাইভ প্যাক কন্ট্রোল</span>
                <span className="text-[9px] text-slate-400">অফার ও সিম ম্যানেজ</span>
              </button>

              <button onClick={() => setActiveSection('history')} className="bg-white border rounded-2xl p-3 flex flex-col items-center text-center shadow-sm active:scale-95">
                <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-1.5"><History className="w-4 h-4" /></div>
                <span className="font-bold text-slate-900">History রিপোর্ট</span>
                <span className="text-[9px] text-slate-400">সকল লেনদেন</span>
              </button>

              <button onClick={() => setActiveSection('add_money')} className="bg-white border rounded-2xl p-3 flex flex-col items-center text-center shadow-sm active:scale-95">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5"><Wallet className="w-4 h-4" /></div>
                <span className="font-bold text-slate-900">এড মানি কন্ট্রোল</span>
                <span className="text-[9px] text-slate-400">অন/অফ ও নম্বর পরিবর্তন</span>
              </button>

              <button onClick={() => setActiveSection('chats')} className="bg-white border rounded-2xl p-3 flex flex-col items-center text-center shadow-sm active:scale-95">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5"><MessageSquare className="w-4 h-4" /></div>
                <span className="font-bold text-slate-900">লাইভ চ্যাট সাপোর্ট</span>
                <span className="text-[9px] text-slate-400">গ্রাহকের মেসেজ</span>
              </button>

              <button onClick={() => setActiveSection('broadcast')} className="bg-white border rounded-2xl p-3 flex flex-col items-center text-center shadow-sm active:scale-95">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1.5"><BellRing className="w-4 h-4" /></div>
                <span className="font-bold text-slate-900">নোটিশ ব্রডকাস্ট</span>
                <span className="text-[9px] text-slate-400">সবার অ্যাপে নোটিশ</span>
              </button>
            </div>
          </div>
        )}

        {/* রিচার্জ অর্ডার */}
        {activeSection === 'recharge_orders' && (
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 px-1">ফ্লেক্সিলোড / রিচার্জ অর্ডার রিকোয়েস্ট ({rechargeOrders.length})</h4>
            {rechargeOrders.map((ord) => (
              <div key={ord.id} className="bg-white border rounded-2xl p-3.5 space-y-2.5 shadow-sm">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-black text-slate-900 text-xs bg-sky-50 text-sky-700 px-2 py-0.5 rounded border border-sky-200">{ord.operator} - ৳{ord.amount}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg ${ord.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : ord.status === 'Cancelled' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{ord.status}</span>
                </div>

                <div className="bg-slate-50 border rounded-xl p-2.5 space-y-1.5 text-[11px]">
                  <p className="text-slate-700">👤 ইউজারের নাম: <strong className="text-slate-900">{ord.userName}</strong></p>
                  <p className="text-slate-700">📱 অ্যাকাউন্ট নম্বর: <strong className="font-mono text-slate-900">{ord.userPhone}</strong></p>
                  <p className="text-slate-700">💰 ব্যালেন্স: <span className="font-mono text-amber-600 font-bold">মেইন: ৳{ord.userMainBal}</span> | <span className="font-mono text-indigo-600 font-bold">ড্রাইভ: ৳{ord.userDriveBal}</span></p>
                  
                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-200">
                    <span className="text-slate-700">🎯 প্রেরণের নম্বর: <strong className="font-mono text-indigo-700 text-xs">{ord.targetNumber}</strong></span>
                    <button onClick={() => handleCopyCardPin(ord.targetNumber, ord.id)} className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 active:scale-95">
                      {copiedId === ord.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === ord.id ? 'কপি হয়েছে!' : 'নম্বর কপি'}</span>
                    </button>
                  </div>
                </div>

                {ord.status === 'Pending' && (
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => completeRechargeOrder(ord.id)} className="flex-1 py-2 bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Complete
                    </button>
                    <button onClick={() => setCancellingOrder({ ...ord, type: 'recharge' })} className="flex-1 py-2 bg-rose-600 text-white font-bold rounded-xl flex items-center justify-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ড্রাইভ অর্ডার (যেখানে সিম লোন চেক বক্স ও হ্যাঁ/না অপশন যুক্ত করা হয়েছে) */}
        {activeSection === 'drive_orders' && (
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 px-1">ড্রাইভ প্যাক অর্ডার রিকোয়েস্ট ({driveOrders.length})</h4>
            {driveOrders.map((ord) => (
              <div key={ord.id} className="bg-white border rounded-2xl p-3.5 space-y-2.5 shadow-sm">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-black text-slate-900 text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">{ord.operator} - {ord.packageTitle} (৳{ord.price})</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg ${ord.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : ord.status === 'Cancelled' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{ord.status}</span>
                </div>

                <div className="bg-slate-50 border rounded-xl p-2.5 space-y-1.5 text-[11px]">
                  <p className="text-slate-700">👤 ইউজারের নাম: <strong className="text-slate-900">{ord.userName}</strong></p>
                  <p className="text-slate-700">📱 অ্যাকাউন্ট নম্বর: <strong className="font-mono text-slate-900">{ord.userPhone}</strong></p>
                  <p className="text-slate-700">💰 ব্যালেন্স: <span className="font-mono text-amber-600 font-bold">মেইন: ৳{ord.userMainBal}</span> | <span className="font-mono text-indigo-600 font-bold">ড্রাইভ: ৳{ord.userDriveBal}</span></p>
                  
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-700">🎯 প্রেরণের নম্বর: <strong className="font-mono text-indigo-700 text-xs">{ord.targetNumber}</strong></span>
                    <button onClick={() => handleCopyCardPin(ord.targetNumber, ord.id)} className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 active:scale-95">
                      {copiedId === ord.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === ord.id ? 'কপি হয়েছে!' : 'নম্বর কপি'}</span>
                    </button>
                  </div>

                  {/* সিম লোন চেক অপশন (হ্যাঁ/না) */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 bg-amber-50/60 p-2 rounded-lg">
                    <span className="font-bold text-slate-800">⚠️ এই নাম্বারে কি লোন আছে?</span>
                    <button 
                      onClick={() => toggleDriveLoanStatus(ord.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${ord.hasLoan ? 'bg-rose-600 text-white shadow-sm' : 'bg-emerald-600 text-white shadow-sm'}`}
                    >
                      {ord.hasLoan ? 'হ্যাঁ (Loan আছে)' : 'না (Loan নাই)'}
                    </button>
                  </div>
                </div>

                {ord.status === 'Pending' && (
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => handleCompleteDrive(ord)} className="flex-1 py-2 bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Complete
                    </button>
                    <button onClick={() => setCancellingOrder({ ...ord, type: 'drive' })} className="flex-1 py-2 bg-rose-600 text-white font-bold rounded-xl flex items-center justify-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ড্রাইভ প্যাক কন্ট্রোল */}
        {activeSection === 'offers' && (
          <div className="space-y-3">
            <div className="bg-white border rounded-2xl p-3.5 space-y-2.5 shadow-sm">
              <h4 className="font-bold text-slate-900 border-b pb-1.5 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500" /> নতুন ড্রাইভ অফার যোগ করুন
              </h4>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-0.5">সিম অপারেটর</label>
                <select value={newOffer.operator} onChange={(e) => setNewOffer({ ...newOffer, operator: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2 font-bold">
                  <option value="Grameenphone">Grameenphone (GP)</option>
                  <option value="Robi">Robi</option>
                  <option value="Banglalink">Banglalink (BL)</option>
                  <option value="Airtel">Airtel</option>
                  <option value="Teletalk">Teletalk</option>
                </select>
              </div>
              <input type="text" placeholder="টাইটেল (যেমন: 30 GB + 700 Min)" value={newOffer.title} onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2" />
              <div className="grid grid-cols-3 gap-1.5">
                <div>
                  <label className="text-[9px] text-slate-400 block mb-0.5">মূল্য (৳)</label>
                  <input type="number" placeholder="580" value={newOffer.offerPrice} onChange={(e) => setNewOffer({ ...newOffer, offerPrice: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2 font-bold" />
                </div>
                <div>
                  <label className="text-[9px] text-slate-400 block mb-0.5">কমিশন (৳)</label>
                  <input type="number" placeholder="120" value={newOffer.cashback} onChange={(e) => setNewOffer({ ...newOffer, cashback: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2 font-bold text-emerald-600" />
                </div>
                <div>
                  <label className="text-[9px] text-slate-400 block mb-0.5">লাভ (৳)</label>
                  <input type="number" placeholder="45" value={newOffer.profit} onChange={(e) => setNewOffer({ ...newOffer, profit: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2 font-bold text-indigo-600" />
                </div>
              </div>
              <input type="text" placeholder="নোট (যেমন: শুধু ঢাকা বিভাগ)" value={newOffer.note} onChange={(e) => setNewOffer({ ...newOffer, note: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2 text-xs" />
              <button onClick={handleAddOffer} className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-md">অফার পাবলিশ করুন</button>
            </div>

            <div className="bg-white border rounded-2xl p-3.5 space-y-2.5 shadow-sm">
              <div className="flex justify-between items-center border-b pb-1.5">
                <h4 className="font-bold text-slate-800 flex items-center gap-1"><ListFilter className="w-3.5 h-3.5 text-indigo-600" /> অফারগুলো দেখুন</h4>
                <select
                  value={selectedOperatorFilter}
                  onChange={(e) => setSelectedOperatorFilter(e.target.value)}
                  className="bg-slate-100 border rounded-xl px-2.5 py-1 text-xs font-bold text-indigo-700 focus:outline-none"
                >
                  <option value="Grameenphone">GP</option>
                  <option value="Robi">Robi</option>
                  <option value="Banglalink">Banglalink</option>
                  <option value="Airtel">Airtel</option>
                  <option value="Teletalk">Teletalk</option>
                </select>
              </div>

              <div className="space-y-2">
                {visibleOffers.length === 0 ? (
                  <div className="p-4 text-center text-slate-400">এই সিমের জন্য কোনো অফার নেই</div>
                ) : (
                  visibleOffers.map((of) => (
                    <div key={of.id} className="bg-slate-50 border rounded-xl p-2.5 flex items-start justify-between">
                      <div className="space-y-0.5">
                        <h5 className="font-bold text-slate-900">{of.title}</h5>
                        <p className="text-[10px] text-slate-600">মূল্য: ৳{of.offerPrice} | কমিশন: ৳{of.cashback} | লাভ: ৳{of.profit}</p>
                        {of.note && <p className="text-[9px] text-indigo-600 font-medium">📌 {of.note}</p>}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => setEditingOffer(of)} className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><Edit3 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setOffers(offers.filter(o => o.id !== of.id))} className="p-1.5 bg-rose-50 text-rose-600 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {editingOffer && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-4 max-w-xs w-full space-y-2.5 shadow-2xl">
                  <h4 className="font-bold text-slate-900 border-b pb-1.5">অফার মডিফাই বা এডিট করুন</h4>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 block mb-0.5">টাইটেল</label>
                    <input type="text" value={editingOffer.title} onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2 text-xs" />
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div>
                      <label className="text-[9px] font-bold text-slate-500 block mb-0.5">মূল্য</label>
                      <input type="number" value={editingOffer.offerPrice} onChange={(e) => setEditingOffer({ ...editingOffer, offerPrice: Number(e.target.value) })} className="w-full bg-slate-50 border rounded-xl p-2 text-xs font-mono font-bold" />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-500 block mb-0.5">কমিশন</label>
                      <input type="number" value={editingOffer.cashback} onChange={(e) => setEditingOffer({ ...editingOffer, cashback: Number(e.target.value) })} className="w-full bg-slate-50 border rounded-xl p-2 text-xs font-mono font-bold text-emerald-600" />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-500 block mb-0.5">লাভ</label>
                      <input type="number" value={editingOffer.profit} onChange={(e) => setEditingOffer({ ...editingOffer, profit: Number(e.target.value) })} className="w-full bg-slate-50 border rounded-xl p-2 text-xs font-mono font-bold text-indigo-600" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 block mb-0.5">নোট</label>
                    <input type="text" value={editingOffer.note} onChange={(e) => setEditingOffer({ ...editingOffer, note: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2 text-xs" />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => setEditingOffer(null)} className="flex-1 py-2 bg-slate-100 rounded-xl font-bold">বাতিল</button>
                    <button onClick={handleSaveEditedOffer} className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-xl">সেভ করুন</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ক্যানসেল নোট মডাল */}
        {cancellingOrder && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-4 max-w-xs w-full space-y-2.5 shadow-2xl">
              <h4 className="font-bold text-slate-900 border-b pb-1.5">অর্ডার ক্যানসেল নোট</h4>
              <textarea placeholder="কারণ লিখুন (ঐচ্ছিক)..." value={cancelNote} onChange={(e) => setCancelNote(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2 h-16" />
              <div className="flex gap-2">
                <button onClick={() => setCancellingOrder(null)} className="flex-1 py-2 bg-slate-100 rounded-xl font-bold">ফিরে যান</button>
                <button onClick={() => submitCancelOrder(cancellingOrder.type)} className="flex-1 py-2 bg-rose-600 text-white font-bold rounded-xl">ক্যানসেল</button>
              </div>
            </div>
          </div>
        )}

        {/* এড মানি কন্ট্রোল */}
        {activeSection === 'add_money' && (
          <div className="space-y-3">
            <div className="bg-white border rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
              <div>
                <h4 className="font-bold text-slate-900">Add Balance সার্ভিস</h4>
                <p className="text-[10px] text-slate-400">বন্ধ করলে ইউজাররা টাকা পাঠাতে পারবে না</p>
              </div>
              <button onClick={() => setAddMoneyEnabled(!addMoneyEnabled)}>
                {addMoneyEnabled ? <ToggleRight className="w-7 h-7 text-emerald-600" /> : <ToggleLeft className="w-7 h-7 text-rose-600" />}
              </button>
            </div>

            <div className="bg-white border rounded-2xl p-3.5 space-y-2.5 shadow-sm">
              <h4 className="font-bold text-slate-900 border-b pb-1.5">পেমেন্ট নম্বর পরিবর্তন (bKash / Nagad / Rocket)</h4>
              <div>
                <label className="text-[10px] font-bold text-pink-600 block mb-0.5">bKash নম্বর</label>
                <input type="tel" value={paymentNumbers.bkash} onChange={(e) => setPaymentNumbers({ ...paymentNumbers, bkash: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2 text-xs font-mono font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-orange-600 block mb-0.5">Nagad নম্বর</label>
                <input type="tel" value={paymentNumbers.nagad} onChange={(e) => setPaymentNumbers({ ...paymentNumbers, nagad: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2 text-xs font-mono font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-purple-600 block mb-0.5">Rocket নম্বর</label>
                <input type="tel" value={paymentNumbers.rocket} onChange={(e) => setPaymentNumbers({ ...paymentNumbers, rocket: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2 text-xs font-mono font-bold" />
              </div>
              <button onClick={() => alert('নম্বর সফলভাবে আপডেট করা হয়েছে!')} className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md">
                নম্বরগুলো সেভ করুন
              </button>
            </div>
          </div>
        )}

        {/* স্ক্র্যাচ কার্ড */}
        {activeSection === 'scratch_cards' && (
          <div className="space-y-3">
            <div className="bg-white border rounded-2xl p-3.5 space-y-2.5 shadow-sm">
              <h4 className="font-bold text-slate-900 border-b pb-1.5 flex items-center gap-1"><Ticket className="w-3.5 h-3.5 text-pink-600" /> নতুন স্ক্র্যাচ কার্ড তৈরি</h4>
              <select value={newCard.type} onChange={(e) => setNewCard({ ...newCard, type: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2 font-bold">
                <option value="Minute">Minute Card</option>
                <option value="Internet">Internet Card</option>
              </select>
              <input type="text" placeholder="টাইটেল" value={newCard.title} onChange={(e) => setNewCard({ ...newCard, title: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="মূল্য (৳)" value={newCard.price} onChange={(e) => setNewCard({ ...newCard, price: e.target.value })} className="bg-slate-50 border rounded-xl p-2 font-bold" />
                <input type="text" placeholder="পিন কোড" value={newCard.pin} onChange={(e) => setNewCard({ ...newCard, pin: e.target.value })} className="bg-slate-50 border rounded-xl p-2 font-bold text-indigo-600" />
              </div>
              <button onClick={handleAddNewCard} className="w-full py-2.5 bg-pink-600 text-white font-bold rounded-xl">পাবলিশ</button>
            </div>

            <div className="bg-white border rounded-2xl p-3.5 space-y-2 shadow-sm">
              <h4 className="font-bold text-slate-900 border-b pb-1.5">সক্রিয় কার্ড লিস্ট</h4>
              {scratchCardsList.map((card) => (
                <div key={card.id} className="bg-slate-50 border rounded-xl p-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{card.title}</span>
                    <p className="text-[10px] text-slate-500">দাম: ৳{card.price} | পিন: <strong className="font-mono text-indigo-600">{card.pin}</strong></p>
                  </div>
                  <button onClick={() => handleCopyCardPin(card.pin, card.id)} className="px-2.5 py-1.5 bg-indigo-600 text-white rounded-lg font-bold flex items-center gap-1">
                    {copiedId === card.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} কপি
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ইউজার ম্যানেজার */}
        {activeSection === 'users' && !selectedUser && (
          <div className="space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input type="text" placeholder="নম্বর বা নাম দিয়ে খুঁজুন..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border rounded-xl pl-9 pr-3 py-2 shadow-sm" />
            </div>
            {filteredUsers.map((u) => (
              <div key={u.id} onClick={() => handleOpenUser(u)} className="bg-white border rounded-xl p-3 flex items-center justify-between shadow-sm cursor-pointer">
                <div>
                  <h4 className="font-bold text-slate-900">{u.name}</h4>
                  <p className="text-[10px] text-slate-500 font-mono">{u.phone} | মেইন: ৳{u.mainBalance} | ড্রাইভ: ৳{u.driveBalance}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); toggleUserBan(u.id); }} className={`p-1.5 rounded-lg ${u.isBanned ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {u.isBanned ? <UserCheck className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ইউজার প্রোফাইল ও ব্যালেন্স মডিফাই */}
        {activeSection === 'users' && selectedUser && (
          <div className="space-y-3">
            <div className="bg-white border rounded-2xl p-3.5">
              <h3 className="font-bold text-slate-900">{selectedUser.name}</h3>
              <p className="text-[10px] text-slate-500 font-mono">📱 {selectedUser.phone} | পিন: {selectedUser.pin}</p>
            </div>
            <div className="bg-white border rounded-2xl p-3.5 space-y-2.5">
              <h4 className="font-bold text-slate-800">ব্যালেন্স মডিফিকেশন</h4>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" value={customMainBalance} onChange={(e) => setCustomMainBalance(e.target.value)} placeholder="মেইন ব্যালেন্স" className="bg-slate-50 border rounded-xl p-2 font-mono font-bold" />
                <input type="number" value={customDriveBalance} onChange={(e) => setCustomDriveBalance(e.target.value)} placeholder="ড্রাইভ ব্যালেন্স" className="bg-slate-50 border rounded-xl p-2 font-mono font-bold" />
              </div>
              <button onClick={handleSaveBalance} className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl">আপডেট করুন</button>
            </div>
          </div>
        )}

        {/* হিস্ট্রি অপশন */}
        {activeSection === 'history' && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-1 bg-slate-200 p-1 rounded-xl">
              <button onClick={() => setHistoryTab('add_money')} className={`py-1.5 rounded-lg font-bold ${historyTab === 'add_money' ? 'bg-white shadow-sm' : ''}`}>এড-মানি</button>
              <button onClick={() => setHistoryTab('recharge')} className={`py-1.5 rounded-lg font-bold ${historyTab === 'recharge' ? 'bg-white shadow-sm' : ''}`}>রিচার্জ</button>
              <button onClick={() => setHistoryTab('drive')} className={`py-1.5 rounded-lg font-bold ${historyTab === 'drive' ? 'bg-white shadow-sm' : ''}`}>ড্রাইভ</button>
            </div>
            {historyTab === 'add_money' && addMoneyLogs.map(log => (
              <div key={log.id} className="bg-white border rounded-xl p-2.5 flex justify-between">
                <div>
                  <p className="font-bold text-slate-900">৳{log.amount} ({log.method})</p>
                  <p className="text-[10px] text-slate-500">TrxID: <strong className="font-mono text-indigo-600">{log.trxId}</strong></p>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold">{log.status}</span>
              </div>
            ))}
          </div>
        )}

        {/* লাইভ চ্যাট */}
        {activeSection === 'chats' && (
          <div className="bg-white border rounded-2xl p-3 h-[380px] flex flex-col">
            <div className="border-b pb-1.5 mb-2 font-bold">লাইভ চ্যাট সাপোর্ট</div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl px-3 py-1.5 ${msg.sender === 'admin' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-800'}`}>{msg.text}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-1.5 pt-2 border-t">
              <input type="text" placeholder="উত্তর..." value={replyText} onChange={(e) => setReplyText(e.target.value)} className="flex-1 bg-slate-50 border rounded-xl px-3 py-1.5" />
              <button onClick={() => { if(replyText){ setChatMessages([...chatMessages, {sender:'admin', text:replyText}]); setReplyText(''); } }} className="p-2 bg-indigo-600 text-white rounded-xl"><Send className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        )}

        {/* ব্রডকাস্ট নোটিশ */}
        {activeSection === 'broadcast' && (
          <div className="bg-white border rounded-2xl p-3.5 space-y-2.5">
            <h4 className="font-bold text-slate-900 border-b pb-1.5">রানিং নোটিশ আপডেট</h4>
            <input type="text" value={noticeInput} onChange={(e) => setNoticeInput(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 font-medium" />
            <button onClick={() => { setRunningNotice(noticeInput); alert('আপডেট হয়েছে!'); }} className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl">আপডেট</button>
          </div>
        )}
      </main>

      {/* পপ-আপ অ্যালার্ট */}
      {popupAlert && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-xs w-full text-center space-y-3 shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto"><Check className="w-5 h-5 stroke-[3]" /></div>
            <h4 className="text-xs font-extrabold text-slate-900">{popupAlert}</h4>
            <button onClick={() => setPopupAlert(null)} className="w-full py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl">ঠিক আছে</button>
          </div>
        </div>
      )}
    </div>
  );
}
