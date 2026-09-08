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
  Search, 
  Edit3, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Send, 
  ArrowLeft, 
  History, 
  Lock, 
  LogOut, 
  Radio,
  CheckCircle,
  XCircle,
  Copy,
  Check,
  Ban,
  Ticket,
  BellRing,
  Settings,
  Globe,
  Sparkles
} from 'lucide-react';

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeSection, setActiveSection] = useState<'menu' | 'users' | 'add_money' | 'recharge_orders' | 'drive_orders' | 'offers' | 'history' | 'chats' | 'settings' | 'live_users' | 'broadcast' | 'scratch_cards'>('menu');
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

  // সোশ্যাল লিংক স্টেট (সেটিংসের জন্য)
  const [socialLinks, setSocialLinks] = useState({
    facebookPage: 'https://facebook.com/yourpage',
    whatsappNumber: '+8801728116153'
  });

  const [masterDriveEnabled, setMasterDriveEnabled] = useState(true);
  const [simStatus, setSimStatus] = useState<Record<string, boolean>>({
    Grameenphone: true,
    Robi: true,
    Banglalink: true,
    Airtel: true,
    Teletalk: true
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
  const [selectedOfferOp, setSelectedOfferOp] = useState('Grameenphone');
  const [newOffer, setNewOffer] = useState({ operator: 'Grameenphone', title: '', offerPrice: '', cashback: '', profit: '', note: '' });
  const [editingOffer, setEditingOffer] = useState<any | null>(null);

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
      if (data) setOffers(Object.keys(data).map(key => ({ id: key, ...data[key] })));
      else setOffers([]);
    });

    onValue(ref(db, 'settings/masterDrive'), (snapshot) => {
      const val = snapshot.val();
      if (val !== null) setMasterDriveEnabled(val);
    });

    onValue(ref(db, 'settings/simStatus'), (snapshot) => {
      const val = snapshot.val();
      if (val) setSimStatus(val);
    });

    onValue(ref(db, 'settings/notice'), (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setRunningNotice(val);
        setNoticeInput(val);
      }
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

  const toggleMasterDrive = () => {
    const newState = !masterDriveEnabled;
    setMasterDriveEnabled(newState);
    set(ref(db, 'settings/masterDrive'), newState);
  };

  const toggleSimStatus = (simName: string) => {
    const updated = { ...simStatus, [simName]: !simStatus[simName] };
    setSimStatus(updated);
    set(ref(db, 'settings/simStatus'), updated);
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
    alert('অফার সফলভাবে পাবলিশ হয়েছে!');
  };

  const handleUpdateOffer = () => {
    if (!editingOffer) return;
    update(ref(db, `offers/${editingOffer.id}`), {
      title: editingOffer.title,
      offerPrice: Number(editingOffer.offerPrice),
      cashback: Number(editingOffer.cashback) || 0,
      profit: Number(editingOffer.profit) || 0,
      note: editingOffer.note || ''
    });
    setEditingOffer(null);
    alert('অফার সফলভাবে আপডেট করা হয়েছে!');
  };

  const handleDeleteOffer = (id: string) => {
    if (window.confirm('আপনি কি এই অফারটি ডিলিট করতে চান?')) {
      remove(ref(db, `offers/${id}`));
      alert('অফার ডিলিট করা হয়েছে!');
    }
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
      <div className="min-h-screen bg-[#0f0c29] bg-gradient-to-tr from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center p-4 select-none font-sans text-xs">
        <div className="w-full max-w-sm bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 shadow-2xl text-center space-y-4 text-white">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center mx-auto shadow-lg"><Lock className="w-6 h-6" /></div>
          <h2 className="text-base font-black tracking-wider">ADMIN LOGIN</h2>
          <form onSubmit={(e) => { e.preventDefault(); if (adminPin === '1234' || adminPin.length >= 4) { setIsAuthenticated(true); setAuthError(''); } else { setAuthError('ভুল পিন!'); } }} className="space-y-3 text-left">
            {authError && <div className="p-2 bg-red-500/20 text-red-300 text-xs text-center rounded-xl border border-red-500/30">{authError}</div>}
            <input type="password" inputMode="numeric" maxLength={6} value={adminPin} onChange={(e) => setAdminPin(e.target.value)} placeholder="অ্যাডমিন পিন (••••)" className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-xs text-center font-bold tracking-widest text-white focus:outline-none focus:border-indigo-400" />
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-xs rounded-xl shadow-xl shadow-indigo-600/30">লগইন</button>
          </form>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-[#0d0b21] text-slate-100 flex flex-col select-none font-sans text-xs">
      <header className="bg-[#141032]/80 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-lg">
        <div className="flex items-center gap-2.5">
          {(activeSection !== 'menu' || selectedUser) ? (
            <button onClick={handleBack} className="p-1.5 -ml-1 rounded-xl bg-white/5 border border-white/10 text-white"><ArrowLeft className="w-4 h-4" /></button>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold relative">
              <ShieldCheck className="w-4 h-4" />
            </div>
          )}
          <div>
            <h1 className="text-xs font-black text-white">SIM OFFER SHOP ADMIN</h1>
            <p className="text-[10px] text-indigo-300 font-mono">{currentTime}</p>
          </div>
        </div>
        {activeSection === 'menu' && !selectedUser && (
          <div className="flex items-center gap-1.5">
            <button onClick={() => setActiveSection('settings')} className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold flex items-center gap-1 shadow-sm"><Settings className="w-4 h-4" /> সেটিংস</button>
            <button onClick={() => setIsAuthenticated(false)} className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300"><LogOut className="w-4 h-4" /></button>
          </div>
        )}
      </header>

      <main className="flex-1 p-3 max-w-lg mx-auto w-full overflow-y-auto space-y-3">
        {activeSection === 'menu' && (
          <div className="space-y-3">
            <div className="bg-gradient-to-tr from-[#1a1442] via-[#241b5c] to-[#120e2e] border border-white/10 rounded-2xl p-3 text-white shadow-xl space-y-2">
              <div className="flex justify-between items-center text-[10px] text-purple-300 font-bold border-b border-white/10 pb-1">
                <span>📊 SYSTEM METRICS</span>
                <span className="text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" /> Live</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-center">
                <div className="bg-black/30 border border-white/10 rounded-xl p-1.5">
                  <span className="text-[8px] text-slate-400 block">ইনস্টল</span>
                  <strong className="text-xs font-black text-white font-mono">{appStats.totalInstalls}</strong>
                </div>
                <div onClick={() => setActiveSection('users')} className="bg-black/30 border border-white/10 rounded-xl p-1.5 cursor-pointer active:scale-95">
                  <span className="text-[8px] text-slate-400 block">ইউজার ও সার্চ</span>
                  <strong className="text-xs font-black text-emerald-400 font-mono">{appStats.activeAccounts}</strong>
                </div>
                <div className="bg-black/30 border border-white/10 rounded-xl p-1.5">
                  <span className="text-[8px] text-slate-400 block">মোট ব্যালেন্স</span>
                  <strong className="text-xs font-black text-amber-400 font-mono">৳{appStats.totalBalance}</strong>
                </div>
                <div onClick={() => setActiveSection('live_users')} className="bg-black/30 border border-white/10 rounded-xl p-1.5 cursor-pointer active:scale-95">
                  <span className="text-[8px] text-slate-400 block">অনলাইন</span>
                  <strong className="text-xs font-black text-rose-400 font-mono">{onlineCount} জন</strong>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button onClick={() => setActiveSection('recharge_orders')} className="bg-[#141032] border border-white/10 rounded-2xl p-3 flex flex-col items-center text-center shadow-lg relative">
                {pendingRechargeCount > 0 && <span className="absolute top-2.5 right-2.5 bg-rose-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce">{pendingRechargeCount}</span>}
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-1.5"><Send className="w-4 h-4" /></div>
                <span className="font-bold text-white">রিচার্জ অর্ডার</span>
                <span className="text-[9px] text-slate-400">কমপ্লিট / ক্যানসেল</span>
              </button>

              <button onClick={() => setActiveSection('drive_orders')} className="bg-[#141032] border border-white/10 rounded-2xl p-3 flex flex-col items-center text-center shadow-lg relative">
                {pendingDriveCount > 0 && <span className="absolute top-2.5 right-2.5 bg-rose-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce">{pendingDriveCount}</span>}
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-1.5"><Flame className="w-4 h-4" /></div>
                <span className="font-bold text-white">ড্রাইভ অর্ডার</span>
                <span className="text-[9px] text-slate-400">প্যাকেজ রিকোয়েস্ট</span>
              </button>

              <button onClick={() => setActiveSection('scratch_cards')} className="bg-[#141032] border border-white/10 rounded-2xl p-3 flex flex-col items-center text-center shadow-lg">
                <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mb-1.5"><Ticket className="w-4 h-4" /></div>
                <span className="font-bold text-white">স্ক্র্যাচ কার্ড</span>
                <span className="text-[9px] text-slate-400">মিনিট ও এমবি প্যাক</span>
              </button>

              <button onClick={() => setActiveSection('offers')} className="bg-[#141032] border border-white/10 rounded-2xl p-3 flex flex-col items-center text-center shadow-lg">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-1.5"><Radio className="w-4 h-4" /></div>
                <span className="font-bold text-white">ড্রাইভ প্যাক কন্ট্রোল</span>
                <span className="text-[9px] text-slate-400">অফার ও সিম ম্যানেজ</span>
              </button>

              <button onClick={() => setActiveSection('history')} className="bg-[#141032] border border-white/10 rounded-2xl p-3 flex flex-col items-center text-center shadow-lg relative">
                {pendingAddMoneyCount > 0 && <span className="absolute top-2.5 right-2.5 bg-rose-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce">{pendingAddMoneyCount}</span>}
                <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-1.5"><History className="w-4 h-4" /></div>
                <span className="font-bold text-white">History রিপোর্ট</span>
                <span className="text-[9px] text-slate-400">সকল লেনদেন</span>
              </button>

              <button onClick={() => setActiveSection('add_money')} className="bg-[#141032] border border-white/10 rounded-2xl p-3 flex flex-col items-center text-center shadow-lg">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1.5"><Wallet className="w-4 h-4" /></div>
                <span className="font-bold text-white">এড মানি কন্ট্রোল</span>
                <span className="text-[9px] text-slate-400">অন/অফ ও নম্বর পরিবর্তন</span>
              </button>

              <button onClick={() => setActiveSection('chats')} className="bg-[#141032] border border-white/10 rounded-2xl p-3 flex flex-col items-center text-center shadow-lg">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-1.5"><MessageSquare className="w-4 h-4" /></div>
                <span className="font-bold text-white">লাইভ চ্যাট সাপোর্ট</span>
                <span className="text-[9px] text-slate-400">গ্রাহকের মেসেজ</span>
              </button>

              <button onClick={() => setActiveSection('broadcast')} className="bg-[#141032] border border-white/10 rounded-2xl p-3 flex flex-col items-center text-center shadow-lg">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-1.5"><BellRing className="w-4 h-4" /></div>
                <span className="font-bold text-white">নোটিশ ব্রডকাস্ট</span>
                <span className="text-[9px] text-slate-400">সবার অ্যাপে নোটিশ</span>
              </button>
            </div>
          </div>
        )}

        {/* সেটিংস পেজ (যেখানে ফেসবুক ও হোয়াটসঅ্যাপ লিংক যোগ করার অপশন রয়েছে) */}
        {activeSection === 'settings' && (
          <div className="space-y-3 bg-[#141032] border border-white/10 rounded-2xl p-4 shadow-xl text-white">
            <h4 className="font-bold border-b border-white/10 pb-2 flex items-center gap-1.5"><Settings className="w-4 h-4 text-indigo-400" /> অ্যাপ ও সোশ্যাল লিংক সেটিংস</h4>
            <div>
              <label className="text-[10px] font-bold text-indigo-300 block mb-1">ফেসবুক পেজ লিংক</label>
              <input type="text" value={socialLinks.facebookPage} onChange={(e) => setSocialLinks({ ...socialLinks, facebookPage: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 font-medium text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-indigo-300 block mb-1">হোয়াটসঅ্যাপ নম্বর</label>
              <input type="text" value={socialLinks.whatsappNumber} onChange={(e) => setSocialLinks({ ...socialLinks, whatsappNumber: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 font-medium text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <button onClick={handleUpdateSocialLinks} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg active:scale-95">সেটিংস সেভ করুন</button>
          </div>
        )}

        {/* অন্যান্য সেকশনগুলো */}
        {activeSection === 'live_users' && (
          <div className="space-y-2">
            <h4 className="font-bold text-slate-300 px-1">বর্তমানে অনলাইন ইউজারগণ ({usersList.length})</h4>
            {usersList.map((u) => (
              <div key={u.id} className="bg-[#141032] border border-white/10 rounded-xl p-3 flex items-center justify-between shadow-lg text-white">
                <div>
                  <h4 className="font-bold">{u.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">📱 {u.phone} | মেইন: ৳{u.mainBalance || 0} | ড্রাইভ: ৳{u.driveBalance || 0}</p>
                </div>
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              </div>
            ))}
          </div>
        )}

        {activeSection === 'broadcast' && (
          <div className="space-y-3">
            <div className="bg-[#141032] border border-white/10 rounded-2xl p-3.5 space-y-2.5 shadow-xl text-white">
              <h4 className="font-bold border-b border-white/10 pb-1.5">রানিং নোটিশ আপডেট (App Marquee)</h4>
              <input type="text" value={noticeInput} onChange={(e) => setNoticeInput(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 font-medium text-white" />
              <button onClick={updateNoticeInDb} className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl">আপডেট করুন</button>
            </div>
          </div>
        )}

        {activeSection === 'offers' && (
          <div className="space-y-3">
            <div className="bg-[#141032] border border-white/10 rounded-2xl p-3.5 space-y-3 shadow-xl text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div>
                  <h4 className="font-bold">মাস্টার ড্রাইভ অফার কন্ট্রোল</h4>
                  <p className="text-[10px] text-slate-400">বন্ধ করলে ইউজার অ্যাপে ড্রাইভ অফার বন্ধ দেখাবে</p>
                </div>
                <button onClick={toggleMasterDrive}>
                  {masterDriveEnabled ? <ToggleRight className="w-8 h-8 text-emerald-400" /> : <ToggleLeft className="w-8 h-8 text-rose-400" />}
                </button>
              </div>
            </div>

            <div className="bg-[#141032] border border-white/10 rounded-2xl p-3.5 space-y-2.5 shadow-xl text-white">
              <h4 className="font-bold border-b border-white/10 pb-1.5 flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-rose-500" /> নতুন ড্রাইভ অফার যোগ করুন</h4>
              <div className="grid grid-cols-5 gap-1 bg-black/30 p-1 rounded-xl border border-white/10">
                {['Grameenphone', 'Robi', 'Banglalink', 'Airtel', 'Teletalk'].map((op) => (
                  <button key={op} type="button" onClick={() => setNewOffer({ ...newOffer, operator: op })} className={`py-2 rounded-lg font-bold text-[10px] ${newOffer.operator === op ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}>
                    {op === 'Grameenphone' ? 'GP' : op === 'Banglalink' ? 'BL' : op}
                  </button>
                ))}
              </div>
              <input type="text" placeholder="টাইটেল (যেমন: 30 GB + 700 Min)" value={newOffer.title} onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-white" />
              <div className="grid grid-cols-3 gap-1.5">
                <input type="number" placeholder="মূল্য (৳)" value={newOffer.offerPrice} onChange={(e) => setNewOffer({ ...newOffer, offerPrice: e.target.value })} className="bg-black/40 border border-white/10 rounded-xl p-2 font-bold text-white" />
                <input type="number" placeholder="কমিশন (৳)" value={newOffer.cashback} onChange={(e) => setNewOffer({ ...newOffer, cashback: e.target.value })} className="bg-black/40 border border-white/10 rounded-xl p-2 font-bold text-emerald-400" />
                <input type="number" placeholder="লাভ (৳)" value={newOffer.profit} onChange={(e) => setNewOffer({ ...newOffer, profit: e.target.value })} className="bg-black/40 border border-white/10 rounded-xl p-2 font-bold text-indigo-400" />
              </div>
              <input type="text" placeholder="নোট" value={newOffer.note} onChange={(e) => setNewOffer({ ...newOffer, note: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-xs text-white" />
              <button onClick={handleAddOffer} className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg">অফার পাবলিশ করুন</button>
            </div>
          </div>
        )}

        {activeSection === 'recharge_orders' && (
          <div className="space-y-3">
            <h4 className="font-bold text-slate-300 px-1">রিচার্জ অর্ডার রিকোয়েস্ট ({rechargeOrders.length})</h4>
            {rechargeOrders.map((ord) => (
              <div key={ord.id} className="bg-[#141032] border border-white/10 rounded-2xl p-3.5 space-y-2.5 shadow-xl text-white">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="font-black text-xs bg-sky-500/10 text-sky-300 border border-sky-500/20 px-2 py-0.5 rounded">{ord.operator} - ৳{ord.amount}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg ${ord.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>{ord.status}</span>
                </div>
                <div className="bg-black/30 border border-white/10 rounded-xl p-2.5 space-y-1.5 text-[11px]">
                  <p className="text-slate-300">👤 ইউজার: <strong className="text-white">{ord.userName}</strong> ({ord.userPhone})</p>
                  <p className="text-slate-300">🎯 নম্বর: <strong className="font-mono text-indigo-300">{ord.targetNumber}</strong></p>
                </div>
                {ord.status === 'Pending' && (
                  <button onClick={() => completeRechargeOrder(ord.id)} className="w-full py-2 bg-emerald-600 text-white font-bold rounded-xl">Complete</button>
                )}
              </div>
            ))}
          </div>
        )}

        {activeSection === 'drive_orders' && (
          <div className="space-y-3">
            <h4 className="font-bold text-slate-300 px-1">ড্রাইভ অর্ডার রিকোয়েস্ট ({driveOrders.length})</h4>
            {driveOrders.map((ord) => (
              <div key={ord.id} className="bg-[#141032] border border-white/10 rounded-2xl p-3.5 space-y-2.5 shadow-xl text-white">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="font-black text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded">{ord.operator} - {ord.packageTitle} (৳{ord.price})</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg ${ord.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>{ord.status}</span>
                </div>
                <div className="bg-black/30 border border-white/10 rounded-xl p-2.5 space-y-1.5 text-[11px]">
                  <p className="text-slate-300">👤 ইউজার: <strong className="text-white">{ord.userName}</strong> ({ord.userPhone})</p>
                  <p className="text-slate-300">🎯 নম্বর: <strong className="font-mono text-indigo-300">{ord.targetNumber}</strong></p>
                </div>
                {ord.status === 'Pending' && (
                  <button onClick={() => update(ref(db, `driveOrders/${ord.id}`), { status: 'Completed' })} className="w-full py-2 bg-emerald-600 text-white font-bold rounded-xl">Complete</button>
                )}
              </div>
            ))}
          </div>
        )}

        {activeSection === 'history' && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-1 bg-[#141032] border border-white/10 p-1 rounded-xl shadow-inner">
              <button onClick={() => setHistoryTab('add_money')} className={`py-1.5 rounded-lg font-bold ${historyTab === 'add_money' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}>এড-মানি</button>
              <button onClick={() => setHistoryTab('recharge')} className={`py-1.5 rounded-lg font-bold ${historyTab === 'recharge' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}>রিচার্জ</button>
              <button onClick={() => setHistoryTab('drive')} className={`py-1.5 rounded-lg font-bold ${historyTab === 'drive' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}>ড্রাইভ</button>
            </div>
            {historyTab === 'add_money' && addMoneyLogs.map(log => (
              <div key={log.id} className="bg-[#141032] border border-white/10 rounded-xl p-3 flex justify-between items-center shadow-lg text-white">
                <div>
                  <p className="font-bold">৳{log.amount} ({log.method})</p>
                  <p className="text-[10px] text-slate-400">👤 {log.userName} | TrxID: {log.trxId}</p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${log.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>{log.status}</span>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'add_money' && (
          <div className="space-y-3">
            <div className="bg-[#141032] border border-white/10 rounded-2xl p-3.5 flex items-center justify-between shadow-xl text-white">
              <div>
                <h4 className="font-bold">Add Balance সার্ভিস</h4>
                <p className="text-[10px] text-slate-400">বন্ধ করলে ইউজাররা টাকা পাঠাতে পারবে না</p>
              </div>
              <button onClick={() => setAddMoneyEnabled(!addMoneyEnabled)}>
                {addMoneyEnabled ? <ToggleRight className="w-8 h-8 text-emerald-400" /> : <ToggleLeft className="w-8 h-8 text-rose-400" />}
              </button>
            </div>
            <div className="bg-[#141032] border border-white/10 rounded-2xl p-3.5 space-y-2.5 shadow-xl text-white">
              <h4 className="font-bold border-b border-white/10 pb-1.5">পেমেন্ট নম্বর পরিবর্তন</h4>
              <input type="tel" value={paymentNumbers.bkash} onChange={(e) => setPaymentNumbers({ ...paymentNumbers, bkash: e.target.value })} placeholder="bKash" className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-xs font-mono font-bold text-white" />
              <input type="tel" value={paymentNumbers.nagad} onChange={(e) => setPaymentNumbers({ ...paymentNumbers, nagad: e.target.value })} placeholder="Nagad" className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-xs font-mono font-bold text-white" />
              <input type="tel" value={paymentNumbers.rocket} onChange={(e) => setPaymentNumbers({ ...paymentNumbers, rocket: e.target.value })} placeholder="Rocket" className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-xs font-mono font-bold text-white" />
              <button onClick={updateAddMoneySettings} className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-md">সেভ করুন</button>
            </div>
          </div>
        )}

        {activeSection === 'scratch_cards' && (
          <div className="space-y-3">
            <div className="bg-[#141032] border border-white/10 rounded-2xl p-3.5 space-y-2.5 shadow-xl text-white">
              <h4 className="font-bold border-b border-white/10 pb-1.5 flex items-center gap-1"><Ticket className="w-3.5 h-3.5 text-pink-500" /> নতুন স্ক্র্যাচ কার্ড তৈরি</h4>
              <select value={newCard.type} onChange={(e) => setNewCard({ ...newCard, type: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-2 font-bold text-white">
                <option value="Minute">Minute Card</option>
                <option value="Internet">Internet Card</option>
              </select>
              <input type="text" placeholder="টাইটেল (যেমন: ২৫ মিনিট)" value={newCard.title} onChange={(e) => setNewCard({ ...newCard, title: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-2 text-white" />
              <input type="number" placeholder="মূল্য (৳)" value={newCard.price} onChange={(e) => setNewCard({ ...newCard, price: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-2 font-bold text-white" />
              <button onClick={handleAddNewCard} className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl shadow-md">পাবলিশ</button>
            </div>
          </div>
        )}

        {activeSection === 'users' && !selectedUser && (
          <div className="space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input type="text" placeholder="নম্বর বা নাম দিয়ে খুঁজুন..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#141032] border border-white/10 rounded-xl pl-9 pr-3 py-2 shadow-lg text-white" />
            </div>
            {filteredUsers.map((u) => (
              <div key={u.id} onClick={() => handleOpenUser(u)} className="bg-[#141032] border border-white/10 rounded-xl p-3 flex items-center justify-between shadow-lg cursor-pointer text-white">
                <div>
                  <h4 className="font-bold">{u.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">{u.phone} | মেইন: ৳{u.mainBalance || 0} | ড্রাইভ: ৳{u.driveBalance || 0}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); toggleUserBan(u.id, u.isBanned); }} className={`p-1.5 rounded-lg ${u.isBanned ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                  {u.isBanned ? <Users className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'chats' && (
          <div className="grid grid-cols-3 gap-2 h-[450px]">
            <div className="bg-[#141032] border border-white/10 rounded-2xl p-2 overflow-y-auto space-y-1 text-white">
              <h5 className="font-bold text-[10px] text-slate-400 p-1">ইউজার লিস্ট</h5>
              {chatUsers.map(u => (
                <div key={u.id} onClick={() => setActiveChatUser(u)} className={`p-2 rounded-xl cursor-pointer ${activeChatUser?.id === u.id ? 'bg-indigo-600/30 border border-indigo-500/40' : 'bg-black/30'}`}>
                  <p className="font-bold text-xs">{u.name}</p>
                  <p className="text-[9px] text-slate-400 font-mono">{u.phone}</p>
                </div>
              ))}
            </div>
            <div className="col-span-2 bg-[#141032] border border-white/10 rounded-2xl p-3 flex flex-col justify-between shadow-xl text-white">
              <div className="border-b border-white/10 pb-2 flex items-center justify-between">
                <h4 className="font-bold text-xs">{activeChatUser ? activeChatUser.name : 'চ্যাট সিলেক্ট করুন'}</h4>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-3 py-1.5 text-xs ${msg.sender === 'admin' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'bg-white/10 text-slate-200'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5 pt-2 border-t border-white/10">
                <input type="text" placeholder="উত্তর লিখুন..." value={replyText} onChange={(e) => setReplyText(e.target.value)} className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" />
                <button onClick={handleSendAdminChat} className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-md"><Send className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        )}
      </main>

      {popupAlert && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#18133a] border border-white/15 rounded-3xl p-5 max-w-xs w-full text-center space-y-3 shadow-2xl text-white">
            <h4 className="text-xs font-extrabold">{popupAlert}</h4>
            <button onClick={() => setPopupAlert(null)} className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs rounded-xl">ঠিক আছে</button>
          </div>
        </div>
      )}
    </div>
  );
}
