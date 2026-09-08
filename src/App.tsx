import React, { useState, useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { db } from './firebase';
import { ref, set, push, onValue, update, remove } from 'firebase/database';
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
  ListFilter,
  Globe
} from 'lucide-react';

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeSection, setActiveSection] = useState<'menu' | 'users' | 'add_money' | 'recharge_orders' | 'drive_orders' | 'offers' | 'history' | 'chats' | 'links' | 'live_users' | 'broadcast' | 'scratch_cards'>('menu');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [customMainBalance, setCustomMainBalance] = useState('');
  const [customDriveBalance, setCustomDriveBalance] = useState('');

  const [historyTab, setHistoryTab] = useState<'add_money' | 'recharge' | 'drive'>('add_money');
  const [cancellingOrder, setCancellingOrder] = useState<any | null>(null);
  const [cancelNote, setCancelNote] = useState('');

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [runningNotice, setRunningNotice] = useState('🎉 স্বাগতম SIM OFFER SHOP এ!');
  const [noticeInput, setNoticeInput] = useState(runningNotice);
  const [soundAlertEnabled, setSoundAlertEnabled] = useState(true);

  // মাস্টার ড্রাইভ ও সিম কন্ট্রোল স্টেট
  const [masterDriveStatus, setMasterDriveStatus] = useState(true);
  const [simControlStatus, setSimControlStatus] = useState<Record<string, boolean>>({
    Grameenphone: true,
    Robi: true,
    Banglalink: true,
    Airtel: true,
    Teletalk: true
  });

  const [socialLinks, setSocialLinks] = useState({
    facebookPage: 'https://facebook.com/yourpage',
    whatsappNumber: '+8801728116153'
  });

  const [broadcastType, setBroadcastType] = useState<'all' | 'personal'>('all');
  const [targetPhone, setTargetPhone] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');

  const [scratchCardsList, setScratchCardsList] = useState<any[]>([]);
  const [newCard, setNewCard] = useState({ type: 'Minute', title: '', price: '' });
  const [popupAlert, setPopupAlert] = useState<string | null>(null);

  const [usersList, setUsersList] = useState<any[]>([]);
  const [addMoneyEnabled, setAddMoneyEnabled] = useState(true);
  const [paymentNumbers, setPaymentNumbers] = useState({ bkash: '01728116153', nagad: '01728116153', rocket: '01728116153' });

  const [offers, setOffers] = useState<any[]>([]);
  const [newOffer, setNewOffer] = useState({ operator: 'Grameenphone', title: '', offerPrice: '', cashback: '', profit: '', note: '' });

  const [addMoneyLogs, setAddMoneyLogs] = useState<any[]>([]);
  const [rechargeOrders, setRechargeOrders] = useState<any[]>([]);
  const [driveOrders, setDriveOrders] = useState<any[]>([]);

  const [chatUsers, setChatUsers] = useState<any[]>([]);
  const [activeChatUser, setActiveChatUser] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState('');

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Firebase Synchronization
  useEffect(() => {
    onValue(ref(db, 'users'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setUsersList(list);
        setChatUsers(list);
        if (!activeChatUser && list.length > 0) setActiveChatUser(list[0]);
      } else {
        setUsersList([]);
      }
    });

    onValue(ref(db, 'offers'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setOffers(Object.keys(data).map(key => ({ id: key, ...data[key] })));
      } else {
        setOffers([]);
      }
    });

    onValue(ref(db, 'settings/notice'), (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setRunningNotice(val);
        setNoticeInput(val);
      }
    });

    onValue(ref(db, 'settings/masterDriveStatus'), (snapshot) => {
      const val = snapshot.val();
      if (val !== null) setMasterDriveStatus(val);
    });

    onValue(ref(db, 'settings/simControlStatus'), (snapshot) => {
      const val = snapshot.val();
      if (val) setSimControlStatus(val);
    });

    onValue(ref(db, 'settings/socialLinks'), (snapshot) => {
      const val = snapshot.val();
      if (val) setSocialLinks(val);
    });

    onValue(ref(db, 'settings/addMoney'), (snapshot) => {
      const val = snapshot.val();
      if (val) {
        if (val.enabled !== undefined) setAddMoneyEnabled(val.enabled);
        if (val.numbers) setPaymentNumbers(val.numbers);
      }
    });

    onValue(ref(db, 'addMoneyLogs'), (snapshot) => {
      const data = snapshot.val();
      if (data) setAddMoneyLogs(Object.keys(data).map(key => ({ id: key, ...data[key] })));
      else setAddMoneyLogs([]);
    });

    onValue(ref(db, 'rechargeOrders'), (snapshot) => {
      const data = snapshot.val();
      if (data) setRechargeOrders(Object.keys(data).map(key => ({ id: key, ...data[key] })));
      else setRechargeOrders([]);
    });

    onValue(ref(db, 'driveOrders'), (snapshot) => {
      const data = snapshot.val();
      if (data) setDriveOrders(Object.keys(data).map(key => ({ id: key, ...data[key] })));
      else setDriveOrders([]);
    });

    onValue(ref(db, 'scratchCards'), (snapshot) => {
      const data = snapshot.val();
      if (data) setScratchCardsList(Object.keys(data).map(key => ({ id: key, ...data[key] })));
      else setScratchCardsList([]);
    });

    onValue(ref(db, 'chats'), (snapshot) => {
      const data = snapshot.val();
      if (data && activeChatUser) {
        const userMsgs = data[activeChatUser.id] || [];
        setChatMessages(Object.keys(userMsgs).map(k => ({ id: k, ...userMsgs[k] })));
      } else {
        setChatMessages([]);
      }
    });
  }, [activeChatUser]);

  const handleToggleMasterDrive = () => {
    const newState = !masterDriveStatus;
    setMasterDriveStatus(newState);
    set(ref(db, 'settings/masterDriveStatus'), newState);
  };

  const handleToggleSim = (simName: string) => {
    const updated = { ...simControlStatus, [simName]: !simControlStatus[simName] };
    setSimControlStatus(updated);
    set(ref(db, 'settings/simControlStatus'), updated);
  };

  const handleDeleteOffer = (id: string) => {
    if (window.confirm('আপনি কি এই অফারটি ডিলিট করতে চান?')) {
      remove(ref(db, `offers/${id}`));
      alert('অফার সফলভাবে ডিলিট করা হয়েছে!');
    }
  };

  const handleSendAdminChat = () => {
    if (!replyText.trim() || !activeChatUser) return;
    const msgRef = push(ref(db, `chats/${activeChatUser.id}`));
    set(msgRef, {
      sender: 'admin',
      text: replyText.trim(),
      time: new Date().toLocaleTimeString()
    });
    setReplyText('');
  };

  const handleSendBroadcast = () => {
    if (!broadcastMsg.trim()) return alert('মেসেজ লিখুন!');
    if (broadcastType === 'all') {
      const notifRef = push(ref(db, 'notifications'));
      set(notifRef, {
        title: 'অ্যাডমিন নোটিশ',
        msg: broadcastMsg.trim(),
        time: new Date().toLocaleTimeString(),
        target: 'all'
      });
      alert('সফলভাবে সবার কাছে নোটিশ পাঠানো হয়েছে!');
    } else {
      if (!targetPhone) return alert('নম্বর বা ইউজার সিলেক্ট করুন!');
      const notifRef = push(ref(db, `notifications/${targetPhone}`));
      set(notifRef, {
        title: 'পার্সোনাল নোটিশ',
        msg: broadcastMsg.trim(),
        time: new Date().toLocaleTimeString(),
        target: targetPhone
      });
      alert(`সফলভাবে ${targetPhone} নম্বরে পার্সোনাল মেসেজ পাঠানো হয়েছে!`);
    }
    setBroadcastMsg('');
  };

  const handleUpdateSocialLinks = () => {
    set(ref(db, 'settings/socialLinks'), socialLinks);
    alert('সোশ্যাল লিংক সফলভাবে আপডেট করা হয়েছে!');
  };

  const handleCopyCardPin = (pin: string, id: string) => {
    navigator.clipboard.writeText(pin);
    setCopiedId(id);
    setPopupAlert('🎉 সফলভাবে কপি হয়েছে!');
    setTimeout(() => { setCopiedId(null); setPopupAlert(null); }, 3000);
  };

  const appStats = {
    totalInstalls: usersList.length + 300,
    activeAccounts: usersList.length,
    totalBalance: usersList.reduce((acc, u) => acc + (Number(u.mainBalance) || 0) + (Number(u.driveBalance) || 0), 18500),
    onlineNowList: usersList
  };

  const onlineCount = appStats.onlineNowList.length;
  const pendingRechargeCount = rechargeOrders.filter(o => o.status === 'Pending').length;
  const pendingDriveCount = driveOrders.filter(o => o.status === 'Pending').length;
  const pendingAddMoneyCount = addMoneyLogs.filter(o => o.status === 'Pending').length;

  const handleBack = () => {
    if (cancellingOrder) { setCancellingOrder(null); setCancelNote(''); }
    else if (selectedUser) { setSelectedUser(null); }
    else if (activeSection !== 'menu') { setActiveSection('menu'); }
  };

  useEffect(() => {
    const backListener = CapacitorApp.addListener('backButton', () => {
      if (cancellingOrder || selectedUser || activeSection !== 'menu') {
        handleBack();
      } else {
        CapacitorApp.exitApp();
      }
    });
    return () => { backListener.then(handler => handler.remove()); };
  }, [cancellingOrder, selectedUser, activeSection]);

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
    setCustomMainBalance((u.mainBalance || 0).toString());
    setCustomDriveBalance((u.driveBalance || 0).toString());
  };

  const handleSaveBalance = () => {
    if (!selectedUser) return;
    const main = customMainBalance === '' ? 0 : Number(customMainBalance);
    const drive = customDriveBalance === '' ? 0 : Number(customDriveBalance);
    update(ref(db, `users/${selectedUser.id}`), { mainBalance: main, driveBalance: drive });
    setSelectedUser({ ...selectedUser, mainBalance: main, driveBalance: drive });
    alert('ব্যালেন্স আপডেট সফল!');
  };

  const toggleUserBan = (userId: string, currentStatus: boolean) => {
    update(ref(db, `users/${userId}`), { isBanned: !currentStatus });
  };

  const toggleDriveLoanStatus = (id: string, currentStatus: boolean) => {
    update(ref(db, `driveOrders/${id}`), { hasLoan: !currentStatus });
  };

  const handleCompleteDrive = (ord: any) => {
    if (ord.hasLoan) {
      alert('⚠️ এই নম্বরে লোন আছে! লোন থাকা অবস্থায় ড্রাইভ কমপ্লিট করা যাবে না।');
      return;
    }
    update(ref(db, `driveOrders/${ord.id}`), { status: 'Completed' });
  };

  const handleAddOffer = () => {
    if (!newOffer.title || !newOffer.offerPrice) return alert('তথ্য দিন');
    const newRef = push(ref(db, 'offers'));
    set(newRef, {
      ...newOffer,
      offerPrice: Number(newOffer.offerPrice),
      cashback: Number(newOffer.cashback) || 0,
      profit: Number(newOffer.profit) || 0
    });
    setNewOffer({ operator: 'Grameenphone', title: '', offerPrice: '', cashback: '', profit: '', note: '' });
    alert('অফার পাবলিশ হয়েছে!');
  };

  const handleAddNewCard = () => {
    if (!newCard.title || !newCard.price) return alert('সব পূরণ করুন');
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    const newRef = push(ref(db, 'scratchCards'));
    set(newRef, {
      type: newCard.type,
      title: newCard.title,
      price: Number(newCard.price),
      pin: randomPin
    });
    setNewCard({ type: 'Minute', title: '', price: '' });
    alert('কার্ড তৈরি হয়েছে!');
  };

  const completeRechargeOrder = (id: string) => {
    update(ref(db, `rechargeOrders/${id}`), { status: 'Completed' });
  };

  const handleApproveAddMoney = (log: any) => {
    const targetUserId = log.userId || '1';
    const userRef = ref(db, `users/${targetUserId}`);
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      if (userData) {
        const currentBal = log.balanceType === 'drive' ? (userData.driveBalance || 0) : (userData.mainBalance || 0);
        const newBal = currentBal + Number(log.amount);
        if (log.balanceType === 'drive') {
          update(userRef, { driveBalance: newBal });
        } else {
          update(userRef, { mainBalance: newBal });
        }
      }
    }, { onlyOnce: true });

    update(ref(db, `addMoneyLogs/${log.id}`), { status: 'Approved' });
    alert('✅ এড-মানি সফলভাবে অ্যাপ্রুভ করা হয়েছে!');
  };

  const handleCancelAddMoney = (id: string) => {
    update(ref(db, `addMoneyLogs/${id}`), { status: 'Cancelled' });
    alert('❌ এড-মানি রিকোয়েস্ট ক্যানসেল করা হয়েছে।');
  };

  const submitCancelOrder = (type: 'recharge' | 'drive') => {
    if (!cancellingOrder) return;
    const path = type === 'recharge' ? `rechargeOrders/${cancellingOrder.id}` : `driveOrders/${cancellingOrder.id}`;
    update(ref(db, path), { status: 'Cancelled', note: cancelNote.trim() });
    setCancellingOrder(null);
    setCancelNote('');
  };

  const updateNoticeInDb = () => {
    set(ref(db, 'settings/notice'), noticeInput);
    setRunningNotice(noticeInput);
    alert('রানিং নোটিশ আপডেট হয়েছে!');
  };

  const updateAddMoneySettings = () => {
    set(ref(db, 'settings/addMoney'), {
      enabled: addMoneyEnabled,
      numbers: paymentNumbers
    });
    alert('পেমেন্ট সেটিংস সফলভাবে আপডেট করা হয়েছে!');
  };

  const filteredUsers = usersList.filter(u => (u.phone || '').includes(searchQuery.trim()) || (u.name || '').toLowerCase().includes(searchQuery.toLowerCase().trim()));

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
            </div>
          )}
          <div>
            <h1 className="text-xs font-black text-slate-900">SIM OFFER SHOP ADMIN</h1>
            <p className="text-[10px] text-slate-400 font-mono">{currentTime}</p>
          </div>
        </div>
        {activeSection === 'menu' && !selectedUser && (
          <div className="flex items-center gap-1.5">
            <button onClick={() => setActiveSection('links')} className="p-2 rounded-xl bg-blue-50 text-blue-600 font-bold" title="সোশ্যাল লিংক"><Globe className="w-4 h-4" /></button>
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
              <button onClick={() => setActiveSection('recharge_orders')} className="bg-white border rounded-2xl p-3 flex flex-col items-center text-center shadow-sm relative">
                {pendingRechargeCount > 0 && <span className="absolute top-2.5 right-2.5 bg-rose-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce">{pendingRechargeCount}</span>}
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-1.5"><Send className="w-4 h-4" /></div>
                <span className="font-bold text-slate-900">রিচার্জ অর্ডার</span>
                <span className="text-[9px] text-slate-400">কমপ্লিট / ক্যানসেল</span>
              </button>

              <button onClick={() => setActiveSection('drive_orders')} className="bg-white border rounded-2xl p-3 flex flex-col items-center text-center shadow-sm relative">
                {pendingDriveCount > 0 && <span className="absolute top-2.5 right-2.5 bg-rose-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce">{pendingDriveCount}</span>}
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-1.5"><Flame className="w-4 h-4" /></div>
                <span className="font-bold text-slate-900">ড্রাইভ অর্ডার</span>
                <span className="text-[9px] text-slate-400">প্যাকেজ রিকোয়েস্ট</span>
              </button>

              <button onClick={() => setActiveSection('scratch_cards')} className="bg-white border rounded-2xl p-3 flex flex-col items-center text-center shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-1.5"><Ticket className="w-4 h-4" /></div>
                <span className="font-bold text-slate-900">স্ক্র্যাচ কার্ড</span>
                <span className="text-[9px] text-slate-400">মিনিট ও এমবি প্যাক</span>
              </button>

              <button onClick={() => setActiveSection('offers')} className="bg-white border rounded-2xl p-3 flex flex-col items-center text-center shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-1.5"><Radio className="w-4 h-4" /></div>
                <span className="font-bold text-slate-900">ড্রাইভ প্যাক কন্ট্রোল</span>
                <span className="text-[9px] text-slate-400">অফার ও সিম ম্যানেজ</span>
              </button>

              <button onClick={() => setActiveSection('history')} className="bg-white border rounded-2xl p-3 flex flex-col items-center text-center shadow-sm relative">
                {pendingAddMoneyCount > 0 && <span className="absolute top-2.5 right-2.5 bg-rose-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce">{pendingAddMoneyCount}</span>}
                <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-1.5"><History className="w-4 h-4" /></div>
                <span className="font-bold text-slate-900">History রিপোর্ট</span>
                <span className="text-[9px] text-slate-400">সকল লেনদেন</span>
              </button>

              <button onClick={() => setActiveSection('add_money')} className="bg-white border rounded-2xl p-3 flex flex-col items-center text-center shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5"><Wallet className="w-4 h-4" /></div>
                <span className="font-bold text-slate-900">এড মানি কন্ট্রোল</span>
                <span className="text-[9px] text-slate-400">অন/অফ ও নম্বর পরিবর্তন</span>
              </button>

              <button onClick={() => setActiveSection('chats')} className="bg-white border rounded-2xl p-3 flex flex-col items-center text-center shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5"><MessageSquare className="w-4 h-4" /></div>
                <span className="font-bold text-slate-900">লাইভ চ্যাট সাপোর্ট</span>
                <span className="text-[9px] text-slate-400">গ্রাহকের মেসেজ</span>
              </button>

              <button onClick={() => setActiveSection('broadcast')} className="bg-white border rounded-2xl p-3 flex flex-col items-center text-center shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1.5"><BellRing className="w-4 h-4" /></div>
                <span className="font-bold text-slate-900">নোটিশ ব্রডকাস্ট</span>
                <span className="text-[9px] text-slate-400">সবার অ্যাপে নোটিশ</span>
              </button>
            </div>
          </div>
        )}

        {/* অনলাইন ইউজার লিস্ট পেজ */}
        {activeSection === 'live_users' && (
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 px-1">বর্তমানে অনলাইন ইউজারগণ ({usersList.length})</h4>
            {usersList.map((u) => (
              <div key={u.id} className="bg-white border rounded-xl p-3 flex items-center justify-between shadow-sm">
                <div>
                  <h4 className="font-bold text-slate-900">{u.name}</h4>
                  <p className="text-[10px] text-slate-500 font-mono">📱 {u.phone} | মেইন: ৳{u.mainBalance || 0} | ড্রাইভ: ৳{u.driveBalance || 0}</p>
                </div>
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              </div>
            ))}
          </div>
        )}

        {/* সোশ্যাল লিংক কনফিগারেশন পেজ */}
        {activeSection === 'links' && (
          <div className="space-y-3 bg-white border rounded-2xl p-4 shadow-sm">
            <h4 className="font-bold text-slate-900 border-b pb-2 flex items-center gap-1.5"><Globe className="w-4 h-4 text-blue-600" /> সাপোর্ট ও সোশ্যাল লিংক সেটিংস</h4>
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">ফেসবুক পেজ লিংক</label>
              <input type="text" value={socialLinks.facebookPage} onChange={(e) => setSocialLinks({ ...socialLinks, facebookPage: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2.5 font-medium" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">হোয়াটসঅ্যাপ নম্বর</label>
              <input type="text" value={socialLinks.whatsappNumber} onChange={(e) => setSocialLinks({ ...socialLinks, whatsappNumber: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2.5 font-medium" />
            </div>
            <button onClick={updateAddMoneySettings} className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md">লিংকগুলো সেভ করুন</button>
          </div>
        )}

        {/* ব্রডকাস্ট ও পার্সোনাল নোটিশ পেজ */}
        {activeSection === 'broadcast' && (
          <div className="space-y-3">
            <div className="bg-white border rounded-2xl p-3.5 space-y-2.5 shadow-sm">
              <h4 className="font-bold text-slate-900 border-b pb-1.5">রানিং নোটিশ আপডেট (App Marquee)</h4>
              <input type="text" value={noticeInput} onChange={(e) => setNoticeInput(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 font-medium" />
              <button onClick={updateNoticeInDb} className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl">আপডেট করুন</button>
            </div>

            <div className="bg-white border rounded-2xl p-3.5 space-y-3 shadow-sm">
              <h4 className="font-bold text-slate-900 border-b pb-1.5 flex items-center gap-1.5">
                <BellRing className="w-4 h-4 text-indigo-600" /> নোটিফিকেশন ও মেসেজ সেন্ডার
              </h4>
              <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button onClick={() => setBroadcastType('all')} className={`py-2 rounded-lg font-bold transition-all ${broadcastType === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'}`}>🌐 সবাইকে পাঠান</button>
                <button onClick={() => setBroadcastType('personal')} className={`py-2 rounded-lg font-bold transition-all ${broadcastType === 'personal' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'}`}>👤 পার্সোনাল (নির্দিষ্ট)</button>
              </div>

              {broadcastType === 'personal' && (
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">গ্রাহক সিলেক্ট করুন</label>
                  <select value={targetPhone} onChange={(e) => setTargetPhone(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 font-bold text-xs">
                    <option value="">-- গ্রাহক সিলেক্ট করুন --</option>
                    {usersList.map(u => (
                      <option key={u.id} value={u.phone}>{u.name} ({u.phone})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">নোটিফিকেশন মেসেজ</label>
                <textarea placeholder="মেসেজ লিখুন..." value={broadcastMsg} onChange={(e) => setBroadcastMsg(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2.5 h-24" />
              </div>

              <button onClick={handleSendBroadcast} className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5">
                <Send className="w-4 h-4" /> নোটিফিকেশন সেন্ড করুন
              </button>
            </div>
          </div>
        )}

        {/* ড্রাইভ প্যাক কন্ট্রোল (মাস্টার সুইচ, সিম অন/অফ, নতুন অফার ও লিস্ট) */}
        {activeSection === 'offers' && (
          <div className="space-y-3">
            {/* মাস্টার ড্রাইভ অন/অফ সুইচ */}
            <div className="bg-white border rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
              <div>
                <h4 className="font-bold text-slate-900">সার্বক্ষণিক ড্রাইভ সার্ভিস (Master Drive)</h4>
                <p className="text-[10px] text-slate-400">বন্ধ করলে ইউজার অ্যাপে আজ সারাদিনের ড্রাইভ বন্ধ দেখাবে</p>
              </div>
              <button onClick={handleToggleMasterDrive}>
                {masterDriveStatus ? <ToggleRight className="w-7 h-7 text-emerald-600" /> : <ToggleLeft className="w-7 h-7 text-rose-600" />}
              </button>
            </div>

            {/* নির্দিষ্ট সিম অন/অফ কন্ট্রোল */}
            <div className="bg-white border rounded-2xl p-3.5 space-y-2 shadow-sm">
              <h4 className="font-bold text-slate-900 border-b pb-1.5">নির্দিষ্ট সিম ভিত্তিক অফার অন/অফ</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(simControlStatus).map((sim) => (
                  <div key={sim} className="flex items-center justify-between bg-slate-50 border p-2 rounded-xl">
                    <span className="font-bold text-slate-800">{sim}</span>
                    <button onClick={() => handleToggleSim(sim)}>
                      {simControlStatus[sim] ? <ToggleRight className="w-6 h-6 text-emerald-600" /> : <ToggleLeft className="w-6 h-6 text-rose-600" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* নতুন অফার যোগ করুন */}
            <div className="bg-white border rounded-2xl p-3.5 space-y-2.5 shadow-sm">
              <h4 className="font-bold text-slate-900 border-b pb-1.5 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500" /> নতুন ড্রাইভ অফার যোগ করুন
              </h4>

              {/* সিম লোগো বাটন সিলেকশন */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">অপারেটর সিলেক্ট করুন</label>
                <div className="grid grid-cols-5 gap-1">
                  {['Grameenphone', 'Robi', 'Banglalink', 'Airtel', 'Teletalk'].map((op) => (
                    <button
                      key={op}
                      type="button"
                      onClick={() => setNewOffer({ ...newOffer, operator: op })}
                      className={`py-2 rounded-xl text-[10px] font-black border transition-all ${newOffer.operator === op ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-700'}`}
                    >
                      {op === 'Grameenphone' ? 'GP' : op === 'Banglalink' ? 'BL' : op}
                    </button>
                  ))}
                </div>
              </div>

              <input type="text" placeholder="টাইটেল (যেমন: 30 GB + 700 Min)" value={newOffer.title} onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2" />
              <div className="grid grid-cols-3 gap-1.5">
                <input type="number" placeholder="মূল্য (৳)" value={newOffer.offerPrice} onChange={(e) => setNewOffer({ ...newOffer, offerPrice: e.target.value })} className="bg-slate-50 border rounded-xl p-2 font-bold" />
                <input type="number" placeholder="কমিশন (৳)" value={newOffer.cashback} onChange={(e) => setNewOffer({ ...newOffer, cashback: e.target.value })} className="bg-slate-50 border rounded-xl p-2 font-bold text-emerald-600" />
                <input type="number" placeholder="লাভ (৳)" value={newOffer.profit} onChange={(e) => setNewOffer({ ...newOffer, profit: e.target.value })} className="bg-slate-50 border rounded-xl p-2 font-bold text-indigo-600" />
              </div>
              <input type="text" placeholder="নোট" value={newOffer.note} onChange={(e) => setNewOffer({ ...newOffer, note: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2 text-xs" />
              <button onClick={handleAddOffer} className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-md">অফার পাবলিশ করুন</button>
            </div>

            {/* বর্তমান অফার লিস্ট ও ডিলিট অপশন */}
            <div className="bg-white border rounded-2xl p-3.5 space-y-2 shadow-sm">
              <h4 className="font-bold text-slate-900 border-b pb-1.5">সকল বর্তমান অফার ({offers.length})</h4>
              {offers.length === 0 ? (
                <p className="text-slate-400 text-center py-2">কোনো অফার নেই</p>
              ) : (
                offers.map((of) => (
                  <div key={of.id} className="bg-slate-50 border rounded-xl p-2.5 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded uppercase">{of.operator}</span>
                      <h5 className="font-bold text-slate-900 text-xs mt-0.5">{of.title}</h5>
                      <p className="text-[10px] text-emerald-600 font-bold">মূল্য: ৳{of.offerPrice} | কমিশন: ৳{of.cashback}</p>
                    </div>
                    <button onClick={() => handleDeleteOffer(of.id)} className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 active:scale-95" title="ডিলিট করুন">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* রিচার্জ অর্ডার */}
        {activeSection === 'recharge_orders' && (
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 px-1">ফ্লেক্সিলোড / রিচার্জ অর্ডার রিকোয়েস্ট ({rechargeOrders.length})</h4>
            {rechargeOrders.map((ord) => (
              <div key={ord.id} className="bg-white border rounded-2xl p-3.5 space-y-2.5 shadow-sm">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-black text-slate-900 text-xs bg-sky-50 text-sky-700 px-2 py-0.5 rounded border border-sky-200">{ord.operator} - ৳{ord.amount}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg ${ord.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : ord.status === 'Cancelled' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{ord.status}</span>
                </div>
                <div className="bg-slate-50 border rounded-xl p-2.5 space-y-1.5 text-[11px]">
                  <p className="text-slate-700">👤 ইউজারের নাম: <strong className="text-slate-900">{ord.userName}</strong></p>
                  <p className="text-slate-700">📱 অ্যাকাউন্ট নম্বর: <strong className="font-mono text-slate-900">{ord.userPhone}</strong></p>
                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-200">
                    <span className="text-slate-700">🎯 প্রেরণের নম্বর: <strong className="font-mono text-indigo-700 text-xs">{ord.targetNumber}</strong></span>
                    <button onClick={() => handleCopyCardPin(ord.targetNumber, ord.id)} className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 active:scale-95">
                      {copiedId === ord.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === ord.id ? 'কপি হয়েছে!' : 'নম্বর কপি'}</span>
                    </button>
                  </div>
                </div>
                {ord.status === 'Pending' && (
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => completeRechargeOrder(ord.id)} className="flex-1 py-2 bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Complete</button>
                    <button onClick={() => setCancellingOrder({ ...ord, type: 'recharge' })} className="flex-1 py-2 bg-rose-600 text-white font-bold rounded-xl flex items-center justify-center gap-1"><XCircle className="w-3.5 h-3.5" /> Cancel</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ড্রাইভ অর্ডার */}
        {activeSection === 'drive_orders' && (
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 px-1">ড্রাইভ প্যাক অর্ডার রিকোয়েস্ট ({driveOrders.length})</h4>
            {driveOrders.map((ord) => (
              <div key={ord.id} className="bg-white border rounded-2xl p-3.5 space-y-2.5 shadow-sm">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-black text-slate-900 text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">{ord.operator} - {ord.packageTitle} (৳{ord.price})</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg ${ord.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : ord.status === 'Cancelled' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{ord.status}</span>
                </div>
                <div className="bg-slate-50 border rounded-xl p-2.5 space-y-1.5 text-[11px]">
                  <p className="text-slate-700">👤 ইউজারের নাম: <strong className="text-slate-900">{ord.userName}</strong></p>
                  <p className="text-slate-700">📱 অ্যাকাউন্ট নম্বর: <strong className="font-mono text-slate-900">{ord.userPhone}</strong></p>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                    <span className="text-slate-700">🎯 প্রেরণের নম্বর: <strong className="font-mono text-indigo-700 text-xs">{ord.targetNumber}</strong></span>
                    <button onClick={() => handleCopyCardPin(ord.targetNumber, ord.id)} className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1">
                      {copiedId === ord.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} নম্বর কপি
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 bg-amber-50/60 p-2 rounded-lg">
                    <span className="font-bold text-slate-800">⚠️ এই নাম্বারে কি লোন আছে?</span>
                    <button onClick={() => toggleDriveLoanStatus(ord.id, ord.hasLoan)} className={`px-3 py-1 rounded-lg text-xs font-bold ${ord.hasLoan ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>
                      {ord.hasLoan ? 'হ্যাঁ (Loan আছে)' : 'না (Loan নাই)'}
                    </button>
                  </div>
                </div>
                {ord.status === 'Pending' && (
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => handleCompleteDrive(ord)} className="flex-1 py-2 bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Complete</button>
                    <button onClick={() => setCancellingOrder({ ...ord, type: 'drive' })} className="flex-1 py-2 bg-rose-600 text-white font-bold rounded-xl flex items-center justify-center gap-1"><XCircle className="w-3.5 h-3.5" /> Cancel</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {cancellingOrder && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-4 max-w-xs w-full space-y-2.5 shadow-2xl">
              <h4 className="font-bold text-slate-900 border-b pb-1.5">অর্ডার ক্যানসেল নোট</h4>
              <textarea placeholder="কারণ লিখুন..." value={cancelNote} onChange={(e) => setCancelNote(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-2 h-16" />
              <div className="flex gap-2">
                <button onClick={() => setCancellingOrder(null)} className="flex-1 py-2 bg-slate-100 rounded-xl font-bold">ফিরে যান</button>
                <button onClick={() => submitCancelOrder(cancellingOrder.type)} className="flex-1 py-2 bg-rose-600 text-white font-bold rounded-xl">ক্যানসেল</button>
              </div>
            </div>
          </div>
        )}

        {/* হিস্ট্রি রিপোর্ট */}
        {activeSection === 'history' && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-1 bg-slate-200 p-1 rounded-xl">
              <button onClick={() => setHistoryTab('add_money')} className={`py-1.5 rounded-lg font-bold ${historyTab === 'add_money' ? 'bg-white shadow-sm' : ''}`}>এড-মানি ({addMoneyLogs.length})</button>
              <button onClick={() => setHistoryTab('recharge')} className={`py-1.5 rounded-lg font-bold ${historyTab === 'recharge' ? 'bg-white shadow-sm' : ''}`}>রিচার্জ ({rechargeOrders.length})</button>
              <button onClick={() => setHistoryTab('drive')} className={`py-1.5 rounded-lg font-bold ${historyTab === 'drive' ? 'bg-white shadow-sm' : ''}`}>ড্রাইভ ({driveOrders.length})</button>
            </div>

            {historyTab === 'add_money' && (
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 px-1">এড-মানি রিকোয়েস্ট লিস্ট</h4>
                {addMoneyLogs.map(log => (
                  <div key={log.id} className="bg-white border rounded-xl p-3 space-y-2 shadow-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-900">৳{log.amount} ({log.method}) - <span className="text-indigo-600 uppercase font-bold">{log.balanceType || 'main'}</span></p>
                        <p className="text-[10px] text-slate-600">👤 {log.userName} (<span className="font-mono">{log.userPhone}</span>)</p>
                        <p className="text-[10px] text-slate-400">TrxID: <strong className="font-mono text-indigo-600">{log.trxId}</strong></p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${log.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : log.status === 'Cancelled' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{log.status}</span>
                    </div>
                    {log.status === 'Pending' && (
                      <div className="flex gap-2 pt-1 border-t">
                        <button onClick={() => handleApproveAddMoney(log)} className="flex-1 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Approve</button>
                        <button onClick={() => handleCancelAddMoney(log.id)} className="flex-1 py-1.5 bg-rose-600 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1"><XCircle className="w-3.5 h-3.5" /> Cancel</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {historyTab === 'recharge' && (
              <div className="space-y-2">
                {rechargeOrders.map(ord => (
                  <div key={ord.id} className="bg-white border rounded-xl p-3 flex justify-between items-center shadow-sm">
                    <div>
                      <p className="font-bold">{ord.operator} - ৳{ord.amount}</p>
                      <p className="text-[10px] text-slate-600">👤 {ord.userName} | নম্বর: <span className="font-mono text-indigo-600">{ord.targetNumber}</span></p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-amber-50 text-amber-700">{ord.status}</span>
                  </div>
                ))}
              </div>
            )}

            {historyTab === 'drive' && (
              <div className="space-y-2">
                {driveOrders.map(ord => (
                  <div key={ord.id} className="bg-white border rounded-xl p-3 flex justify-between items-center shadow-sm">
                    <div>
                      <p className="font-bold">{ord.operator} - {ord.packageTitle} (৳{ord.price})</p>
                      <p className="text-[10px] text-slate-600">👤 {ord.userName} | নম্বর: <span className="font-mono text-indigo-600">{ord.targetNumber}</span></p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-amber-50 text-amber-700">{ord.status}</span>
                  </div>
                ))}
              </div>
            )}
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
              <h4 className="font-bold text-slate-900 border-b pb-1.5">পেমেন্ট নম্বর পরিবর্তন</h4>
              <input type="tel" value={paymentNumbers.bkash} onChange={(e) => setPaymentNumbers({ ...paymentNumbers, bkash: e.target.value })} placeholder="bKash Number" className="w-full bg-slate-50 border rounded-xl p-2 text-xs font-mono font-bold" />
              <input type="tel" value={paymentNumbers.nagad} onChange={(e) => setPaymentNumbers({ ...paymentNumbers, nagad: e.target.value })} placeholder="Nagad Number" className="w-full bg-slate-50 border rounded-xl p-2 text-xs font-mono font-bold" />
              <input type="tel" value={paymentNumbers.rocket} onChange={(e) => setPaymentNumbers({ ...paymentNumbers, rocket: e.target.value })} placeholder="Rocket Number" className="w-full bg-slate-50 border rounded-xl p-2 text-xs font-mono font-bold" />
              <button onClick={updateAddMoneySettings} className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl">নম্বরগুলো সেভ করুন</button>
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
              <input type="text" placeholder="টাইটেল (যেমন: ২৫ মিনিট)" value={newCard.title} onChange={(e) => setNewCard({ ...newCard, title: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2" />
              <input type="number" placeholder="মূল্য (৳)" value={newCard.price} onChange={(e) => setNewCard({ ...newCard, price: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2 font-bold" />
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
                  <button onClick={() => handleCopyCardPin(card.pin, card.id)} className="px-2.5 py-1.5 bg-indigo-600 text-white rounded-lg font-bold flex items-center gap-1">কপি</button>
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
              <input type="text" placeholder="নম্বর বা নাম দিয়ে খুঁজুন..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border rounded-xl pl-9 pr-3 py-2 shadow-sm" />
            </div>
            {filteredUsers.map((u) => (
              <div key={u.id} onClick={() => handleOpenUser(u)} className="bg-white border rounded-xl p-3 flex items-center justify-between shadow-sm cursor-pointer">
                <div>
                  <h4 className="font-bold text-slate-900">{u.name}</h4>
                  <p className="text-[10px] text-slate-500 font-mono">{u.phone} | মেইন: ৳{u.mainBalance || 0} | ড্রাইভ: ৳{u.driveBalance || 0}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); toggleUserBan(u.id, u.isBanned); }} className={`p-1.5 rounded-lg ${u.isBanned ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {u.isBanned ? <UserCheck className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'users' && selectedUser && (
          <div className="space-y-3">
            <div className="bg-white border rounded-2xl p-3.5">
              <h3 className="font-bold text-slate-900">{selectedUser.name}</h3>
              <p className="text-[10px] text-slate-500 font-mono">📱 {selectedUser.phone}</p>
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

        {/* লাইভ চ্যাট সাপোর্ট */}
        {activeSection === 'chats' && (
          <div className="grid grid-cols-3 gap-2 h-[450px]">
            <div className="bg-white border rounded-2xl p-2 overflow-y-auto space-y-1">
              <h5 className="font-bold text-[10px] text-slate-400 p-1">ইউজার লিস্ট</h5>
              {chatUsers.map(u => (
                <div key={u.id} onClick={() => setActiveChatUser(u)} className={`p-2 rounded-xl cursor-pointer ${activeChatUser?.id === u.id ? 'bg-indigo-50 border border-indigo-200' : 'bg-slate-50'}`}>
                  <p className="font-bold text-xs">{u.name}</p>
                  <p className="text-[9px] text-slate-500 font-mono">{u.phone}</p>
                </div>
              ))}
            </div>
            <div className="col-span-2 bg-white border rounded-2xl p-3 flex flex-col justify-between shadow-sm">
              <div className="border-b pb-2 flex items-center justify-between">
                <h4 className="font-bold text-xs">{activeChatUser ? activeChatUser.name : 'চ্যাট সিলেক্ট করুন'}</h4>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-3 py-1.5 text-xs ${msg.sender === 'admin' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5 pt-2 border-t">
                <input type="text" placeholder="উত্তর লিখুন..." value={replyText} onChange={(e) => setReplyText(e.target.value)} className="flex-1 bg-slate-50 border rounded-xl px-3 py-2 text-xs" />
                <button onClick={handleSendAdminChat} className="p-2.5 bg-indigo-600 text-white rounded-xl"><Send className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        )}
      </main>

      {popupAlert && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-xs w-full text-center space-y-3 shadow-2xl">
            <h4 className="text-xs font-extrabold text-slate-900">{popupAlert}</h4>
            <button onClick={() => setPopupAlert(null)} className="w-full py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl">ঠিক আছে</button>
          </div>
        </div>
      )}
    </div>
  );
}
