import React, { useState, useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { db } from './firebase';
import { ref, set, push, onValue, update, remove } from 'firebase/database';
import { 
  ShieldCheck, Wallet, Flame, MessageSquare, Search, Edit3, Trash2, 
  ToggleLeft, ToggleRight, Send, ArrowLeft, History, Lock, LogOut, 
  Radio, CheckCircle, XCircle, Copy, Check, Ban, Ticket, BellRing, Globe, FileText, Smartphone, Users, Sparkles, Facebook, MessageCircle
} from 'lucide-react';

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeSection, setActiveSection] = useState<'menu' | 'users' | 'add_money' | 'recharge_orders' | 'drive_orders' | 'offers' | 'history' | 'chats' | 'broadcast' | 'scratch_cards' | 'update_control' | 'links'>('menu');
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

  // ফোর্স আপডেট কন্ট্রোল
  const [forceUpdateEnabled, setForceUpdateEnabled] = useState(false);
  const [updateLink, setUpdateLink] = useState('https://play.google.com/store/apps/details?id=com.telecom.app');

  // এড-মানি নোট
  const [addMoneyNote, setAddMoneyNote] = useState('প্রথমে নাম্বারে টাকা পাঠিয়ে ট্রানজ্যাকশন আইডি দিন।');
  const [noteInput, setNoteInput] = useState(addMoneyNote);

  // ব্রডকাস্ট স্টেট
  const [broadcastType, setBroadcastType] = useState<'all' | 'personal'>('all');
  const [targetPhone, setTargetPhone] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');

  const [masterDriveEnabled, setMasterDriveEnabled] = useState(true);
  const [simStatus, setSimStatus] = useState<Record<string, boolean>>({
    Grameenphone: true, Robi: true, Banglalink: true, Airtel: true, Teletalk: true
  });

  // সাপোর্ট লিংক
  const [socialLinks, setSocialLinks] = useState({ facebookPage: '', whatsappNumber: '' });

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

  useEffect(() => {
    onValue(ref(db, 'users'), (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setUsersList(list);
        setChatUsers(list);
        if (!activeChatUser && list.length > 0) setActiveChatUser(list[0]);
      } else { setUsersList([]); }
    });

    onValue(ref(db, 'offers'), (snapshot) => {
      const data = snapshot.val();
      if (data) setOffers(Object.keys(data).map(key => ({ id: key, ...data[key] })));
      else setOffers([]);
    });

    onValue(ref(db, 'settings/forceUpdate'), (snapshot) => {
      const val = snapshot.val();
      if (val) {
        if (val.enabled !== undefined) setForceUpdateEnabled(val.enabled);
        if (val.link) setUpdateLink(val.link);
      }
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
      if (val) { setRunningNotice(val); setNoticeInput(val); }
    });

    onValue(ref(db, 'settings/addMoneyNote'), (snapshot) => {
      const val = snapshot.val();
      if (val) { setAddMoneyNote(val); setNoteInput(val); }
    });

    onValue(ref(db, 'settings/addMoney'), (snapshot) => {
      const val = snapshot.val();
      if (val) {
        if (val.enabled !== undefined) setAddMoneyEnabled(val.enabled);
        if (val.numbers) setPaymentNumbers(val.numbers);
      }
    });

    onValue(ref(db, 'settings/socialLinks'), (snapshot) => {
      const val = snapshot.val();
      if (val) setSocialLinks(val);
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
      } else { setChatMessages([]); }
    });
  }, [activeChatUser]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpdateSettingsSave = () => {
    set(ref(db, 'settings/forceUpdate'), { enabled: forceUpdateEnabled, link: updateLink });
    setPopupAlert('✅ ফোর্স আপডেট সেটিংস সেভ হয়েছে!');
  };

  const handleUpdateSocialLinks = () => {
    set(ref(db, 'settings/socialLinks'), socialLinks);
    setPopupAlert('✅ সাপোর্ট ও সোশ্যাল লিংক সেভ হয়েছে!');
  };

  const updateAddMoneyNoteInDb = () => {
    set(ref(db, 'settings/addMoneyNote'), noteInput);
    setAddMoneyNote(noteInput);
    setPopupAlert('✅ এড-মানি নোট আপডেট হয়েছে!');
  };

  const updateAddMoneySettings = () => {
    set(ref(db, 'settings/addMoney'), { enabled: addMoneyEnabled, numbers: paymentNumbers });
    setPopupAlert('✅ পেমেন্ট নম্বর আপডেট করা হয়েছে!');
  };

  const updateNoticeInDb = () => {
    set(ref(db, 'settings/notice'), noticeInput);
    setRunningNotice(noticeInput);
    setPopupAlert('✅ রানিং নোটিশ আপডেট হয়েছে!');
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

  const handleApproveAddMoney = (log: any) => {
    const targetUserId = log.userId || '1';
    const userRef = ref(db, `users/${targetUserId}`);
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      if (userData) {
        const currentBal = log.balanceType === 'drive' ? (userData.driveBalance || 0) : (userData.mainBalance || 0);
        const newBal = currentBal + Number(log.amount);
        if (log.balanceType === 'drive') update(userRef, { driveBalance: newBal });
        else update(userRef, { mainBalance: newBal });
      }
    }, { onlyOnce: true });

    update(ref(db, `addMoneyLogs/${log.id}`), { status: 'Approved' });
    setPopupAlert('✅ এড-মানি অ্যাপ্রুভ করা হয়েছে!');
  };

  const handleCancelAddMoney = (id: string) => {
    update(ref(db, `addMoneyLogs/${id}`), { status: 'Cancelled' });
  };

  const handleAddOffer = () => {
    if (!newOffer.title || !newOffer.offerPrice) return alert('তথ্য দিন');
    push(ref(db, 'offers'), {
      ...newOffer,
      offerPrice: Number(newOffer.offerPrice),
      cashback: Number(newOffer.cashback) || 0,
      profit: Number(newOffer.profit) || 0
    });
    setNewOffer({ operator: 'Grameenphone', title: '', offerPrice: '', cashback: '', profit: '', note: '' });
    setPopupAlert('✅ অফার পাবলিশ হয়েছে!');
  };

  const handleUpdateOffer = () => {
    if (!editingOffer) return;
    update(ref(db, `offers/${editingOffer.id}`), {
      title: editingOffer.title, offerPrice: Number(editingOffer.offerPrice),
      cashback: Number(editingOffer.cashback) || 0, profit: Number(editingOffer.profit) || 0,
      note: editingOffer.note || ''
    });
    setEditingOffer(null);
    setPopupAlert('✅ অফার আপডেট করা হয়েছে!');
  };

  const handleDeleteOffer = (id: string) => {
    if (window.confirm('অফারটি ডিলিট করতে চান?')) {
      remove(ref(db, `offers/${id}`));
    }
  };

  const handleAddNewCard = () => {
    if (!newCard.title || !newCard.price) return alert('সব পূরণ করুন');
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
    push(ref(db, 'scratchCards'), {
      type: newCard.type, title: newCard.title, price: Number(newCard.price), pin: randomPin
    });
    setNewCard({ type: 'Minute', title: '', price: '' });
    setPopupAlert('✅ কার্ড তৈরি হয়েছে!');
  };

  const completeRechargeOrder = (id: string) => { update(ref(db, `rechargeOrders/${id}`), { status: 'Completed' }); };
  const handleCompleteDrive = (ord: any) => {
    if (ord.hasLoan) return alert('⚠️ লোন থাকা অবস্থায় ড্রাইভ কমপ্লিট করা যাবে না।');
    update(ref(db, `driveOrders/${ord.id}`), { status: 'Completed' });
  };
  const toggleDriveLoanStatus = (id: string, currentStatus: boolean) => { update(ref(db, `driveOrders/${id}`), { hasLoan: !currentStatus }); };
  const submitCancelOrder = (type: 'recharge' | 'drive') => {
    if (!cancellingOrder) return;
    const path = type === 'recharge' ? `rechargeOrders/${cancellingOrder.id}` : `driveOrders/${cancellingOrder.id}`;
    update(ref(db, path), { status: 'Cancelled', note: cancelNote.trim() });
    setCancellingOrder(null); setCancelNote('');
  };

  const handleSendBroadcast = () => {
    if (!broadcastMsg.trim()) return alert('মেসেজ লিখুন!');
    if (broadcastType === 'all') {
      push(ref(db, 'notifications'), { title: 'অ্যাডমিন নোটিশ', msg: broadcastMsg.trim(), time: new Date().toLocaleTimeString(), target: 'all' });
    } else {
      if (!targetPhone) return alert('নম্বর বা ইউজার সিলেক্ট করুন!');
      push(ref(db, `notifications/${targetPhone}`), { title: 'পার্সোনাল নোটিশ', msg: broadcastMsg.trim(), time: new Date().toLocaleTimeString(), target: targetPhone });
    }
    setBroadcastMsg('');
    setPopupAlert('✅ নোটিশ পাঠানো হয়েছে!');
  };

  const handleSendAdminChat = () => {
    if (!replyText.trim() || !activeChatUser) return;
    push(ref(db, `chats/${activeChatUser.id}`), { sender: 'admin', text: replyText.trim(), time: new Date().toLocaleTimeString() });
    setReplyText('');
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
    setPopupAlert('✅ ব্যালেন্স আপডেট সফল!');
  };
  const toggleUserBan = (userId: string, currentStatus: boolean) => { update(ref(db, `users/${userId}`), { isBanned: !currentStatus }); };

  const appStats = {
    totalInstalls: usersList.length + 300,
    activeAccounts: usersList.length,
    totalBalance: usersList.reduce((acc, u) => acc + (Number(u.mainBalance) || 0) + (Number(u.driveBalance) || 0), 18500)
  };

  const pendingRechargeCount = rechargeOrders.filter(o => o.status === 'Pending').length;
  const pendingDriveCount = driveOrders.filter(o => o.status === 'Pending').length;
  const pendingAddMoneyCount = addMoneyLogs.filter(o => o.status === 'Pending').length;
  const filteredUsers = usersList.filter(u => (u.phone || '').includes(searchQuery.trim()) || (u.name || '').toLowerCase().includes(searchQuery.toLowerCase().trim()));

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f0c29] bg-gradient-to-tr from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center p-4 font-sans text-xs text-white">
        <div className="w-full max-w-xs bg-white/10 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 shadow-2xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/40">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-base font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">ADMIN SECURE LOGIN</h2>
          <form onSubmit={(e) => { e.preventDefault(); if (adminPin === '1234' || adminPin.length >= 4) { setIsAuthenticated(true); setAuthError(''); } else { setAuthError('ভুল পিন!'); } }} className="space-y-3 pt-2 text-left">
            {authError && <div className="p-2 bg-rose-500/20 text-rose-300 text-xs text-center rounded-xl border border-rose-500/30">{authError}</div>}
            <div>
              <label className="text-[10px] font-bold text-indigo-200 block mb-1">অ্যাডমিন পিন কোড</label>
              <input type="password" inputMode="numeric" maxLength={6} value={adminPin} onChange={(e) => setAdminPin(e.target.value)} placeholder="••••" className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-center font-bold tracking-widest text-white focus:outline-none focus:border-indigo-400" />
            </div>
            <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-xl shadow-xl shadow-indigo-600/30 active:scale-95 transition-all">প্রবেশ করুন</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0b21] text-slate-100 flex flex-col font-sans text-xs">
      <header className="bg-[#141032]/80 backdrop-blur-xl border-b border-white/10 px-4 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-lg">
        <div className="flex items-center gap-3">
          {activeSection !== 'menu' && !selectedUser ? (
            <button onClick={() => setActiveSection('menu')} className="p-2 -ml-2 rounded-2xl bg-white/5 border border-white/10 text-white active:scale-95 transition-all"><ArrowLeft className="w-4 h-4" /></button>
          ) : selectedUser ? (
            <button onClick={() => setSelectedUser(null)} className="p-2 -ml-2 rounded-2xl bg-white/5 border border-white/10 text-white active:scale-95 transition-all"><ArrowLeft className="w-4 h-4" /></button>
          ) : (
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-lg"><ShieldCheck className="w-4 h-4" /></div>
          )}
          <div>
            <h1 className="text-xs font-black text-white leading-tight">SIM OFFER ADMIN</h1>
            <p className="text-[10px] text-indigo-300 font-mono">Premium Dashboard</p>
          </div>
        </div>
        <button onClick={() => setIsAuthenticated(false)} className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 active:scale-95 shadow-sm"><LogOut className="w-3.5 h-3.5" /></button>
      </header>

      <main className="flex-1 p-3 max-w-lg mx-auto w-full overflow-y-auto space-y-4">
        {activeSection === 'menu' && (
          <div className="space-y-4">
            {/* ড্যাশবোর্ড স্ট্যাটাস */}
            <div className="bg-gradient-to-tr from-[#1a1442] via-[#241b5c] to-[#120e2e] border border-white/10 rounded-3xl p-5 text-white shadow-2xl space-y-3 relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="flex justify-between items-center relative z-10 border-b border-white/10 pb-2">
                <span className="text-[10px] font-bold text-purple-300 uppercase">📊 SYSTEM METRICS</span>
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" /> Live</span>
              </div>
              <div className="grid grid-cols-3 gap-2 relative z-10 text-center">
                <div className="bg-black/30 border border-white/10 rounded-2xl p-2.5">
                  <span className="text-[9px] text-slate-400 block mb-0.5">মোট ইউজার</span>
                  <strong className="text-sm font-black text-white font-mono">{appStats.activeAccounts}</strong>
                </div>
                <div className="bg-black/30 border border-white/10 rounded-2xl p-2.5">
                  <span className="text-[9px] text-slate-400 block mb-0.5">টোটাল ব্যালেন্স</span>
                  <strong className="text-sm font-black text-amber-400 font-mono">৳{appStats.totalBalance}</strong>
                </div>
                <div className="bg-black/30 border border-white/10 rounded-2xl p-2.5">
                  <span className="text-[9px] text-slate-400 block mb-0.5">ইনস্টল</span>
                  <strong className="text-sm font-black text-indigo-300 font-mono">{appStats.totalInstalls}</strong>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setActiveSection('recharge_orders')} className="bg-[#141032] border border-white/10 hover:bg-white/5 rounded-3xl p-4 flex flex-col items-center text-center shadow-lg active:scale-95 transition-all relative">
                {pendingRechargeCount > 0 && <span className="absolute top-3 right-3 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">{pendingRechargeCount}</span>}
                <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-2"><Send className="w-5 h-5" /></div>
                <span className="font-extrabold text-white text-xs">রিচার্জ অর্ডার</span>
              </button>

              <button onClick={() => setActiveSection('drive_orders')} className="bg-[#141032] border border-white/10 hover:bg-white/5 rounded-3xl p-4 flex flex-col items-center text-center shadow-lg active:scale-95 transition-all relative">
                {pendingDriveCount > 0 && <span className="absolute top-3 right-3 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">{pendingDriveCount}</span>}
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-2"><Flame className="w-5 h-5" /></div>
                <span className="font-extrabold text-white text-xs">ড্রাইভ অর্ডার</span>
              </button>

              <button onClick={() => setActiveSection('offers')} className="bg-[#141032] border border-white/10 hover:bg-white/5 rounded-3xl p-4 flex flex-col items-center text-center shadow-lg active:scale-95 transition-all">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-2"><Radio className="w-5 h-5" /></div>
                <span className="font-extrabold text-white text-xs">অফার কন্ট্রোল</span>
              </button>

              <button onClick={() => setActiveSection('scratch_cards')} className="bg-[#141032] border border-white/10 hover:bg-white/5 rounded-3xl p-4 flex flex-col items-center text-center shadow-lg active:scale-95 transition-all">
                <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mb-2"><Ticket className="w-5 h-5" /></div>
                <span className="font-extrabold text-white text-xs">স্ক্র্যাচ কার্ড</span>
              </button>

              <button onClick={() => setActiveSection('add_money')} className="bg-[#141032] border border-white/10 hover:bg-white/5 rounded-3xl p-4 flex flex-col items-center text-center shadow-lg active:scale-95 transition-all">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2"><Wallet className="w-5 h-5" /></div>
                <span className="font-extrabold text-white text-xs">এড মানি ও নোট</span>
              </button>

              <button onClick={() => setActiveSection('history')} className="bg-[#141032] border border-white/10 hover:bg-white/5 rounded-3xl p-4 flex flex-col items-center text-center shadow-lg active:scale-95 transition-all relative">
                {pendingAddMoneyCount > 0 && <span className="absolute top-3 right-3 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">{pendingAddMoneyCount}</span>}
                <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-2"><History className="w-5 h-5" /></div>
                <span className="font-extrabold text-white text-xs">History রিপোর্ট</span>
              </button>

              <button onClick={() => setActiveSection('users')} className="bg-[#141032] border border-white/10 hover:bg-white/5 rounded-3xl p-4 flex flex-col items-center text-center shadow-lg active:scale-95 transition-all">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2"><Users className="w-5 h-5" /></div>
                <span className="font-extrabold text-white text-xs">ইউজার ম্যানেজার</span>
              </button>

              <button onClick={() => setActiveSection('chats')} className="bg-[#141032] border border-white/10 hover:bg-white/5 rounded-3xl p-4 flex flex-col items-center text-center shadow-lg active:scale-95 transition-all">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-2"><MessageSquare className="w-5 h-5" /></div>
                <span className="font-extrabold text-white text-xs">লাইভ চ্যাট</span>
              </button>

              <button onClick={() => setActiveSection('broadcast')} className="bg-[#141032] border border-white/10 hover:bg-white/5 rounded-3xl p-4 flex flex-col items-center text-center shadow-lg active:scale-95 transition-all">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mb-2"><BellRing className="w-5 h-5" /></div>
                <span className="font-extrabold text-white text-xs">ব্রডকাস্ট / নোটিশ</span>
              </button>

              <button onClick={() => setActiveSection('update_control')} className="bg-[#141032] border border-white/10 hover:bg-white/5 rounded-3xl p-4 flex flex-col items-center text-center shadow-lg active:scale-95 transition-all">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-2"><Smartphone className="w-5 h-5" /></div>
                <span className="font-extrabold text-white text-xs">Force Update</span>
              </button>

              <button onClick={() => setActiveSection('links')} className="col-span-2 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 hover:bg-cyan-600/30 rounded-3xl p-4 flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
                <Globe className="w-5 h-5 text-cyan-400" />
                <span className="font-extrabold text-cyan-300 text-xs">সাপোর্ট ও লিংক সেটিংস</span>
              </button>
            </div>
          </div>
        )}

        {/* সাপোর্ট ও সোশ্যাল লিংক সেটিংস */}
        {activeSection === 'links' && (
          <div className="space-y-4">
            <div className="bg-[#141032] border border-white/10 rounded-3xl p-5 flex items-center justify-between shadow-xl">
              <div>
                <h4 className="font-bold text-white">সাপোর্ট ও সোশ্যাল লিংক</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">ইউজার অ্যাপের সাপোর্ট অপশনের জন্য লিংক সেট করুন</p>
              </div>
              <Globe className="w-8 h-8 text-cyan-400 opacity-80" />
            </div>

            <div className="bg-[#141032] border border-white/10 rounded-3xl p-5 space-y-4 shadow-xl">
              <div>
                <label className="text-[10px] font-bold text-indigo-300 block mb-1.5 flex items-center gap-1"><Facebook className="w-3.5 h-3.5" /> ফেসবুক পেজ লিংক</label>
                <input type="text" value={socialLinks.facebookPage} onChange={(e) => setSocialLinks({ ...socialLinks, facebookPage: e.target.value })} placeholder="https://facebook.com/..." className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs font-medium text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-emerald-300 block mb-1.5 flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> হোয়াটসঅ্যাপ নম্বর</label>
                <input type="text" value={socialLinks.whatsappNumber} onChange={(e) => setSocialLinks({ ...socialLinks, whatsappNumber: e.target.value })} placeholder="+88017XXXXXXXX" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs font-medium text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <button onClick={handleUpdateSocialLinks} className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all">লিংকগুলো আপডেট করুন</button>
            </div>
          </div>
        )}

        {/* অন্যান্য সমস্ত ভিউ যা আগেই আপডেট করা হয়েছে (Recharge, Drive, Offers, Update, etc.) */}
        {activeSection === 'recharge_orders' && (
          <div className="space-y-3">
            <h4 className="font-bold text-slate-300 px-1 border-b border-white/10 pb-2">রিচার্জ অর্ডার রিকোয়েস্ট ({rechargeOrders.length})</h4>
            {rechargeOrders.map((ord) => (
              <div key={ord.id} className="bg-[#141032] border border-white/10 rounded-3xl p-4 space-y-3 shadow-xl text-white">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="font-black text-sky-400 text-xs bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-xl uppercase">{ord.operator} - ৳{ord.amount}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg ${ord.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : ord.status === 'Cancelled' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>{ord.status}</span>
                </div>
                <div className="bg-black/30 border border-white/10 rounded-2xl p-3 space-y-1.5 text-[11px]">
                  <p className="text-slate-300">👤 ইউজার: <strong className="text-white">{ord.userName}</strong> ({ord.userPhone})</p>
                  <div className="flex items-center justify-between pt-1.5 border-t border-white/10">
                    <span className="text-slate-400">🎯 রিচার্জ নম্বর: <strong className="font-mono text-indigo-300 text-sm">{ord.targetNumber}</strong></span>
                    <button onClick={() => handleCopy(ord.targetNumber, ord.id)} className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-[10px] font-bold flex items-center gap-1 active:scale-95 shadow">
                      {copiedId === ord.id ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />} কপি
                    </button>
                  </div>
                </div>
                {ord.status === 'Pending' && (
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => completeRechargeOrder(ord.id)} className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-1 shadow-md active:scale-95"><CheckCircle className="w-4 h-4" /> Complete</button>
                    <button onClick={() => setCancellingOrder({ ...ord, type: 'recharge' })} className="flex-1 py-2.5 bg-rose-600 text-white font-bold rounded-xl flex items-center justify-center gap-1 shadow-md active:scale-95"><XCircle className="w-4 h-4" /> Cancel</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ড্রাইভ অর্ডার ভিউ */}
        {activeSection === 'drive_orders' && (
          <div className="space-y-3">
            <h4 className="font-bold text-slate-300 px-1 border-b border-white/10 pb-2">ড্রাইভ প্যাক রিকোয়েস্ট ({driveOrders.length})</h4>
            {driveOrders.map((ord) => (
              <div key={ord.id} className="bg-[#141032] border border-white/10 rounded-3xl p-4 space-y-3 shadow-xl text-white">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="font-black text-amber-400 text-xs bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-xl uppercase">{ord.operator} - ৳{ord.price}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg ${ord.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : ord.status === 'Cancelled' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>{ord.status}</span>
                </div>
                <div className="bg-black/30 border border-white/10 rounded-2xl p-3 space-y-2 text-[11px]">
                  <p className="text-slate-300">📦 প্যাকেজ: <strong className="text-white">{ord.packageTitle}</strong></p>
                  <p className="text-slate-400">👤 ইউজার: <strong className="text-white">{ord.userName}</strong> ({ord.userPhone})</p>
                  <div className="flex items-center justify-between pt-1.5 border-t border-white/10">
                    <span className="text-slate-400">🎯 টার্গেট নম্বর: <strong className="font-mono text-indigo-300 text-sm">{ord.targetNumber}</strong></span>
                    <button onClick={() => handleCopy(ord.targetNumber, ord.id)} className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-[10px] font-bold flex items-center gap-1 active:scale-95 shadow">
                      {copiedId === ord.id ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />} কপি
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl">
                    <span className="font-bold text-amber-300">⚠️ এই নাম্বারে কি লোন আছে?</span>
                    <button onClick={() => toggleDriveLoanStatus(ord.id, ord.hasLoan)} className={`px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-md ${ord.hasLoan ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>
                      {ord.hasLoan ? 'হ্যাঁ (Loan আছে)' : 'না (Loan নাই)'}
                    </button>
                  </div>
                </div>
                {ord.status === 'Pending' && (
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => handleCompleteDrive(ord)} className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-1 shadow-md active:scale-95"><CheckCircle className="w-4 h-4" /> Complete</button>
                    <button onClick={() => setCancellingOrder({ ...ord, type: 'drive' })} className="flex-1 py-2.5 bg-rose-600 text-white font-bold rounded-xl flex items-center justify-center gap-1 shadow-md active:scale-95"><XCircle className="w-4 h-4" /> Cancel</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {cancellingOrder && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#18133a] border border-white/15 rounded-3xl p-5 max-w-xs w-full space-y-3 shadow-2xl text-white">
              <h4 className="font-bold border-b border-white/10 pb-2">অর্ডার ক্যানসেল নোট</h4>
              <textarea placeholder="বাতিল করার কারণ লিখুন..." value={cancelNote} onChange={(e) => setCancelNote(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 h-20 text-xs focus:outline-none focus:border-indigo-500 text-white" />
              <div className="flex gap-2 pt-1">
                <button onClick={() => setCancellingOrder(null)} className="flex-1 py-2.5 bg-white/10 text-slate-300 rounded-xl font-bold">ফিরে যান</button>
                <button onClick={() => submitCancelOrder(cancellingOrder.type)} className="flex-1 py-2.5 bg-rose-600 text-white font-bold rounded-xl shadow-lg">ক্যানসেল করুন</button>
              </div>
            </div>
          </div>
        )}

        {/* অফার কন্ট্রোল ভিউ */}
        {activeSection === 'offers' && (
          <div className="space-y-4">
            <div className="bg-[#141032] border border-white/10 rounded-3xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div>
                  <h4 className="font-bold text-white">মাস্টার ড্রাইভ অফার কন্ট্রোল</h4>
                  <p className="text-[10px] text-slate-400">বন্ধ করলে ইউজার অ্যাপে সব ড্রাইভ বন্ধ দেখাবে</p>
                </div>
                <button onClick={toggleMasterDrive}>
                  {masterDriveEnabled ? <ToggleRight className="w-8 h-8 text-emerald-400" /> : <ToggleLeft className="w-8 h-8 text-rose-500" />}
                </button>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1.5">নির্দিষ্ট সিমের অফার অন/অফ করুন</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Grameenphone', 'Robi', 'Banglalink', 'Airtel', 'Teletalk'].map((sim) => (
                    <div key={sim} className="flex items-center justify-between bg-black/30 border border-white/10 p-2 rounded-xl">
                      <span className="font-bold text-slate-300">{sim === 'Grameenphone' ? 'GP' : sim === 'Banglalink' ? 'BL' : sim}</span>
                      <button onClick={() => toggleSimStatus(sim)}>
                        {simStatus[sim] !== false ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-rose-500" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#141032] border border-white/10 rounded-3xl p-5 space-y-3 shadow-xl">
              <h4 className="font-bold text-white border-b border-white/10 pb-2 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-500" /> নতুন ড্রাইভ অফার যোগ করুন
              </h4>

              <div className="grid grid-cols-5 gap-1 bg-black/30 border border-white/10 p-1 rounded-xl">
                {['Grameenphone', 'Robi', 'Banglalink', 'Airtel', 'Teletalk'].map((op) => (
                  <button key={op} type="button" onClick={() => setNewOffer({ ...newOffer, operator: op })} className={`py-2 rounded-lg font-bold text-[10px] ${newOffer.operator === op ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}>
                    {op === 'Grameenphone' ? 'GP' : op === 'Banglalink' ? 'BL' : op}
                  </button>
                ))}
              </div>

              <input type="text" placeholder="টাইটেল (যেমন: 30 GB + 700 Min)" value={newOffer.title} onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500" />
              <div className="grid grid-cols-3 gap-2">
                <input type="number" placeholder="মূল্য (৳)" value={newOffer.offerPrice} onChange={(e) => setNewOffer({ ...newOffer, offerPrice: e.target.value })} className="bg-black/40 border border-white/10 rounded-xl p-2.5 font-bold text-white text-center focus:outline-none focus:border-indigo-500" />
                <input type="number" placeholder="কমিশন (৳)" value={newOffer.cashback} onChange={(e) => setNewOffer({ ...newOffer, cashback: e.target.value })} className="bg-black/40 border border-emerald-500/30 rounded-xl p-2.5 font-bold text-emerald-400 text-center focus:outline-none focus:border-emerald-500" />
                <input type="number" placeholder="লাভ (৳)" value={newOffer.profit} onChange={(e) => setNewOffer({ ...newOffer, profit: e.target.value })} className="bg-black/40 border border-indigo-500/30 rounded-xl p-2.5 font-bold text-indigo-400 text-center focus:outline-none focus:border-indigo-500" />
              </div>
              <input type="text" placeholder="নোট (যেমন: শুধু ঢাকা বিভাগ)" value={newOffer.note} onChange={(e) => setNewOffer({ ...newOffer, note: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500" />
              <button onClick={handleAddOffer} className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg active:scale-95">অফার পাবলিশ করুন</button>
            </div>

            <div className="bg-[#141032] border border-white/10 rounded-3xl p-5 space-y-3 shadow-xl">
              <h4 className="font-bold text-white border-b border-white/10 pb-2">সকল সক্রিয় অফার তালিকা</h4>
              <div className="grid grid-cols-5 gap-1 bg-black/30 border border-white/10 p-1 rounded-xl mb-2">
                {['Grameenphone', 'Robi', 'Banglalink', 'Airtel', 'Teletalk'].map((op) => (
                  <button key={op} onClick={() => setSelectedOfferOp(op)} className={`py-1.5 rounded-lg font-bold text-[10px] ${selectedOfferOp === op ? 'bg-white/10 text-indigo-300 shadow' : 'text-slate-400'}`}>
                    {op === 'Grameenphone' ? 'GP' : op === 'Banglalink' ? 'BL' : op}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                {offers.filter(o => o.operator === selectedOfferOp).map((offer) => (
                  <div key={offer.id} className="bg-black/30 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between text-white">
                    <div>
                      <span className="font-bold text-white">{offer.title}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">মূল্য: ৳{offer.offerPrice} | কমিশন: ৳{offer.cashback} | লাভ: <span className="text-indigo-400 font-bold">৳{offer.profit}</span></p>
                      {offer.note && <p className="text-[10px] text-indigo-300 mt-0.5">📌 {offer.note}</p>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <button onClick={() => setEditingOffer(offer)} className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDeleteOffer(offer.id)} className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {editingOffer && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-[#18133a] border border-white/15 rounded-3xl p-5 max-w-xs w-full space-y-3.5 shadow-2xl text-white">
                  <h4 className="font-bold border-b border-white/10 pb-2">অফার মডিফাই বা এডিট করুন</h4>
                  <input type="text" value={editingOffer.title} onChange={(e) => setEditingOffer({ ...editingOffer, title: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-indigo-500" />
                  <div className="grid grid-cols-3 gap-2">
                    <input type="number" value={editingOffer.offerPrice} onChange={(e) => setEditingOffer({ ...editingOffer, offerPrice: e.target.value })} className="bg-black/40 border border-white/10 rounded-xl p-2.5 font-bold text-center" />
                    <input type="number" value={editingOffer.cashback} onChange={(e) => setEditingOffer({ ...editingOffer, cashback: e.target.value })} className="bg-black/40 border border-emerald-500/30 text-emerald-400 rounded-xl p-2.5 font-bold text-center" />
                    <input type="number" value={editingOffer.profit} onChange={(e) => setEditingOffer({ ...editingOffer, profit: e.target.value })} className="bg-black/40 border border-indigo-500/30 text-indigo-400 rounded-xl p-2.5 font-bold text-center" />
                  </div>
                  <input type="text" placeholder="নোট এডিট করুন" value={editingOffer.note || ''} onChange={(e) => setEditingOffer({ ...editingOffer, note: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs" />
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => setEditingOffer(null)} className="flex-1 py-2.5 bg-white/10 rounded-xl font-bold">বাতিল</button>
                    <button onClick={handleUpdateOffer} className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg">সেভ করুন</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* স্ক্র্যাচ কার্ড ভিউ */}
        {activeSection === 'scratch_cards' && (
          <div className="space-y-4">
            <div className="bg-[#141032] border border-white/10 rounded-3xl p-5 space-y-3 shadow-xl">
              <h4 className="font-bold text-white border-b border-white/10 pb-2 flex items-center gap-1.5"><Ticket className="w-4 h-4 text-pink-500" /> নতুন স্ক্র্যাচ কার্ড তৈরি</h4>
              <select value={newCard.type} onChange={(e) => setNewCard({ ...newCard, type: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 font-bold text-white focus:outline-none focus:border-pink-500">
                <option value="Minute">Minute Card (মিনিট)</option>
                <option value="Internet">Internet Card (এমবি)</option>
              </select>
              <input type="text" placeholder="টাইটেল (যেমন: ২৫ মিনিট বা ১ জিবি)" value={newCard.title} onChange={(e) => setNewCard({ ...newCard, title: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-pink-500" />
              <input type="number" placeholder="মূল্য (৳)" value={newCard.price} onChange={(e) => setNewCard({ ...newCard, price: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 font-bold text-white focus:outline-none focus:border-pink-500" />
              <button onClick={handleAddNewCard} className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl shadow-lg active:scale-95">পাবলিশ করুন</button>
            </div>
            <div className="bg-[#141032] border border-white/10 rounded-3xl p-5 space-y-3 shadow-xl">
              <h4 className="font-bold text-white border-b border-white/10 pb-2">সক্রিয় কার্ড লিস্ট</h4>
              {scratchCardsList.map((card) => (
                <div key={card.id} className="bg-black/30 border border-white/10 rounded-2xl p-3.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">{card.title}</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">দাম: ৳{card.price} | পিন: <strong className="font-mono text-pink-400">{card.pin}</strong></p>
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(card.pin); setPopupAlert('✅ পিন কপি হয়েছে!'); }} className="px-3 py-1.5 bg-pink-500/10 border border-pink-500/30 text-pink-400 rounded-xl font-bold flex items-center gap-1 shadow-sm active:scale-95"><Copy className="w-3.5 h-3.5" /> কপি</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* এড মানি কন্ট্রোল ও নোট সেকশন */}
        {activeSection === 'add_money' && (
          <div className="space-y-4">
            <div className="bg-[#141032] border border-white/10 rounded-3xl p-5 flex items-center justify-between shadow-xl">
              <div>
                <h4 className="font-bold text-white">Add Balance সার্ভিস</h4>
                <p className="text-[10px] text-slate-400">বন্ধ করলে ইউজাররা টাকা পাঠাতে পারবে না</p>
              </div>
              <button onClick={() => setAddMoneyEnabled(!addMoneyEnabled)}>
                {addMoneyEnabled ? <ToggleRight className="w-8 h-8 text-emerald-400" /> : <ToggleLeft className="w-8 h-8 text-rose-500" />}
              </button>
            </div>

            <div className="bg-[#141032] border border-white/10 rounded-3xl p-5 space-y-3 shadow-xl">
              <h4 className="font-bold text-white border-b border-white/10 pb-2 flex items-center gap-1.5"><FileText className="w-4 h-4 text-indigo-400" /> এড-মানি নির্দেশিকা নোট</h4>
              <textarea value={noteInput} onChange={(e) => setNoteInput(e.target.value)} placeholder="ইউজার অ্যাপে দেখানোর জন্য নোট লিখুন..." className="w-full bg-black/40 border border-white/10 rounded-xl p-3 h-24 text-xs text-white focus:outline-none focus:border-indigo-500" />
              <button onClick={updateAddMoneyNoteInDb} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg active:scale-95">নোট আপডেট করুন</button>
            </div>

            <div className="bg-[#141032] border border-white/10 rounded-3xl p-5 space-y-3 shadow-xl">
              <h4 className="font-bold text-white border-b border-white/10 pb-2">পেমেন্ট নম্বর পরিবর্তন</h4>
              <div>
                <label className="text-[10px] text-indigo-300 font-bold block mb-1">bKash Number</label>
                <input type="tel" value={paymentNumbers.bkash} onChange={(e) => setPaymentNumbers({ ...paymentNumbers, bkash: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-[10px] text-indigo-300 font-bold block mb-1">Nagad Number</label>
                <input type="tel" value={paymentNumbers.nagad} onChange={(e) => setPaymentNumbers({ ...paymentNumbers, nagad: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-[10px] text-indigo-300 font-bold block mb-1">Rocket Number</label>
                <input type="tel" value={paymentNumbers.rocket} onChange={(e) => setPaymentNumbers({ ...paymentNumbers, rocket: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <button onClick={updateAddMoneySettings} className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg active:scale-95">নম্বরগুলো সেভ করুন</button>
            </div>
          </div>
        )}

        {/* History Report */}
        {activeSection === 'history' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-1 bg-[#141032] border border-white/10 p-1.5 rounded-2xl shadow-inner">
              <button onClick={() => setHistoryTab('add_money')} className={`py-2 rounded-xl font-bold transition-all ${historyTab === 'add_money' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}>এড-মানি</button>
              <button onClick={() => setHistoryTab('recharge')} className={`py-2 rounded-xl font-bold transition-all ${historyTab === 'recharge' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}>রিচার্জ</button>
              <button onClick={() => setHistoryTab('drive')} className={`py-2 rounded-xl font-bold transition-all ${historyTab === 'drive' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}>ড্রাইভ</button>
            </div>

            {historyTab === 'add_money' && (
              <div className="space-y-3">
                <h4 className="font-bold text-slate-300 px-1 border-b border-white/10 pb-2">এড-মানি রিকোয়েস্ট লিস্ট ({addMoneyLogs.length})</h4>
                {addMoneyLogs.map(log => (
                  <div key={log.id} className="bg-[#141032] border border-white/10 rounded-3xl p-4 space-y-3 shadow-xl text-white">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <div>
                        <p className="font-black text-sm">৳{log.amount} <span className="text-emerald-400 text-xs font-bold">({log.method})</span></p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">TrxID: <strong className="text-indigo-300">{log.trxId}</strong></p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-xl border ${log.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : log.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>{log.status}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 bg-black/30 p-2.5 rounded-2xl border border-white/5">👤 {log.userName} ({log.userPhone})</div>
                    {log.status === 'Pending' && (
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => handleApproveAddMoney(log)} className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-md active:scale-95">Approve</button>
                        <button onClick={() => handleCancelAddMoney(log.id)} className="flex-1 py-2.5 bg-rose-600 text-white font-bold rounded-xl shadow-md active:scale-95">Cancel</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {historyTab === 'recharge' && (
              <div className="space-y-2">
                {rechargeOrders.map(ord => (
                  <div key={ord.id} className="bg-[#141032] border border-white/10 rounded-2xl p-3.5 flex justify-between items-center shadow-lg text-white">
                    <div>
                      <p className="font-bold">{ord.operator} - ৳{ord.amount}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">👤 {ord.userName} | <span className="font-mono text-indigo-300">{ord.targetNumber}</span></p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white/5 border border-white/10">{ord.status}</span>
                  </div>
                ))}
              </div>
            )}

            {historyTab === 'drive' && (
              <div className="space-y-2">
                {driveOrders.map(ord => (
                  <div key={ord.id} className="bg-[#141032] border border-white/10 rounded-2xl p-3.5 flex justify-between items-center shadow-lg text-white">
                    <div>
                      <p className="font-bold">{ord.operator} - ৳{ord.price}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">👤 {ord.userName} | <span className="font-mono text-indigo-300">{ord.targetNumber}</span></p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white/5 border border-white/10">{ord.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ইউজার ম্যানেজার */}
        {activeSection === 'users' && !selectedUser && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input type="text" placeholder="নম্বর বা নাম দিয়ে খুঁজুন..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#141032] border border-white/20 rounded-2xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 shadow-lg" />
            </div>
            <div className="space-y-2.5">
              {usersList.filter(u => (u.phone || '').includes(searchQuery.trim()) || (u.name || '').toLowerCase().includes(searchQuery.toLowerCase().trim())).map((u) => (
                <div key={u.id} onClick={() => handleOpenUser(u)} className="bg-[#141032] border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-lg cursor-pointer hover:bg-white/5 transition-all text-white">
                  <div>
                    <h4 className="font-bold text-sm">{u.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">📱 {u.phone}</p>
                    <p className="text-[10px] text-indigo-300 font-mono mt-0.5">মেইন: ৳{u.mainBalance || 0} | ড্রাইভ: ৳{u.driveBalance || 0}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); update(ref(db, `users/${u.id}`), { isBanned: !u.isBanned }); }} className={`p-2.5 rounded-xl border ${u.isBanned ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'}`}>
                    {u.isBanned ? <Ban className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ইউজার ব্যালেন্স এডিট */}
        {activeSection === 'users' && selectedUser && (
          <div className="space-y-4">
            <div className="bg-[#141032] border border-white/10 rounded-3xl p-5 text-center shadow-xl text-white">
              <h3 className="text-base font-black">{selectedUser.name}</h3>
              <p className="text-[11px] text-slate-400 font-mono mt-1">📱 {selectedUser.phone}</p>
            </div>
            <div className="bg-[#141032] border border-white/10 rounded-3xl p-5 space-y-3 shadow-xl">
              <h4 className="font-bold text-white border-b border-white/10 pb-2">ব্যালেন্স মডিফিকেশন</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">মেইন ব্যালেন্স</label>
                  <input type="number" value={customMainBalance} onChange={(e) => setCustomMainBalance(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 font-mono font-bold text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">ড্রাইভ ব্যালেন্স</label>
                  <input type="number" value={customDriveBalance} onChange={(e) => setCustomDriveBalance(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 font-mono font-bold text-white focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
              <button onClick={() => {
                update(ref(db, `users/${selectedUser.id}`), { mainBalance: Number(customMainBalance) || 0, driveBalance: Number(customDriveBalance) || 0 });
                setPopupAlert('✅ ব্যালেন্স আপডেট সফল!');
              }} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg active:scale-95">ব্যালেন্স আপডেট করুন</button>
            </div>
          </div>
        )}

        {/* লাইভ চ্যাট */}
        {activeSection === 'chats' && (
          <div className="grid grid-cols-3 gap-2 h-[450px]">
            <div className="bg-[#141032] border border-white/10 rounded-2xl p-2 overflow-y-auto space-y-1 shadow-xl">
              <h5 className="font-bold text-[10px] text-slate-400 p-2 text-center uppercase tracking-widest border-b border-white/5 mb-2">ইনবক্স</h5>
              {chatUsers.map(u => (
                <div key={u.id} onClick={() => setActiveChatUser(u)} className={`p-2.5 rounded-xl cursor-pointer transition-all ${activeChatUser?.id === u.id ? 'bg-indigo-600 shadow-md text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>
                  <p className="font-bold text-[11px] truncate">{u.name}</p>
                  <p className="text-[9px] font-mono opacity-70 mt-0.5">{u.phone}</p>
                </div>
              ))}
            </div>
            <div className="col-span-2 bg-[#141032] border border-white/10 rounded-2xl p-3 flex flex-col justify-between shadow-xl text-white">
              <div className="border-b border-white/10 pb-2">
                <h4 className="font-bold text-xs">{activeChatUser ? activeChatUser.name : 'চ্যাট সিলেক্ট করুন'}</h4>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs shadow-md ${msg.sender === 'admin' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-black/40 border border-white/10 text-slate-200'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5 pt-2 border-t border-white/10">
                <input type="text" placeholder="মেসেজ লিখুন..." value={replyText} onChange={(e) => setReplyText(e.target.value)} className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" />
                <button onClick={handleSendAdminChat} className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-md active:scale-95"><Send className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        )}

        {/* ব্রডকাস্ট / নোটিশ */}
        {activeSection === 'broadcast' && (
          <div className="space-y-4">
            <div className="bg-[#141032] border border-white/10 rounded-3xl p-5 space-y-3 shadow-xl">
              <h4 className="font-bold text-white border-b border-white/10 pb-2">রানিং নোটিশ আপডেট (App Marquee)</h4>
              <input type="text" value={noticeInput} onChange={(e) => setNoticeInput(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500" />
              <button onClick={updateNoticeInDb} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg active:scale-95">আপডেট করুন</button>
            </div>

            <div className="bg-[#141032] border border-white/10 rounded-3xl p-5 space-y-4 shadow-xl">
              <h4 className="font-bold text-white border-b border-white/10 pb-2 flex items-center gap-1.5">
                <BellRing className="w-4 h-4 text-orange-500" /> নোটিফিকেশন ও মেসেজ সেন্ডার
              </h4>
              <div className="grid grid-cols-2 gap-1.5 bg-black/30 border border-white/10 p-1.5 rounded-2xl">
                <button onClick={() => setBroadcastType('all')} className={`py-2.5 rounded-xl font-bold transition-all ${broadcastType === 'all' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}>🌐 সবাইকে পাঠান</button>
                <button onClick={() => setBroadcastType('personal')} className={`py-2.5 rounded-xl font-bold transition-all ${broadcastType === 'personal' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'}`}>👤 নির্দিষ্ট ইউজার</button>
              </div>

              {broadcastType === 'personal' && (
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">গ্রাহক সিলেক্ট করুন</label>
                  <select value={targetPhone} onChange={(e) => setTargetPhone(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 font-bold text-xs text-white focus:outline-none focus:border-indigo-500">
                    <option value="" className="text-slate-900">-- গ্রাহক সিলেক্ট করুন --</option>
                    {usersList.map(u => (
                      <option key={u.id} value={u.phone} className="text-slate-900">{u.name} ({u.phone})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">নোটিফিকেশন মেসেজ</label>
                <textarea placeholder="মেসেজ লিখুন..." value={broadcastMsg} onChange={(e) => setBroadcastMsg(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 h-24 text-white focus:outline-none focus:border-indigo-500" />
              </div>

              <button onClick={handleSendBroadcast} className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-1.5 active:scale-95">
                <Send className="w-4 h-4" /> নোটিফিকেশন সেন্ড করুন
              </button>
            </div>
          </div>
        )}

        {/* ফোর্স আপডেট কন্ট্রোল পেজ */}
        {activeSection === 'update_control' && (
          <div className="space-y-4">
            <div className="bg-[#141032] border border-white/10 rounded-3xl p-5 flex items-center justify-between shadow-xl">
              <div>
                <h4 className="font-bold text-white">ফোর্স আপডেট (Force Update)</h4>
                <p className="text-[10px] text-slate-400">চালু করলে ইউজাররা আপডেট ছাড়া অ্যাপে ঢুকতে পারবে না</p>
              </div>
              <button onClick={() => setForceUpdateEnabled(!forceUpdateEnabled)}>
                {forceUpdateEnabled ? <ToggleRight className="w-8 h-8 text-emerald-400" /> : <ToggleLeft className="w-8 h-8 text-rose-500" />}
              </button>
            </div>

            <div className="bg-[#141032] border border-white/10 rounded-3xl p-5 space-y-3 shadow-xl">
              <h4 className="font-bold text-white border-b border-white/10 pb-2">নতুন অ্যাপ ডাউনলোড লিংক (Play Store / APK Link)</h4>
              <input type="text" value={updateLink} onChange={(e) => setUpdateLink(e.target.value)} placeholder="https://..." className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs font-medium text-white focus:outline-none focus:border-indigo-500" />
              <button onClick={handleUpdateSettingsSave} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg active:scale-95">সেটিংস সেভ করুন</button>
            </div>
          </div>
        )}
      </main>

      {/* পপআপ অ্যালার্ট */}
      {popupAlert && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#18133a] border border-white/15 rounded-3xl p-6 max-w-xs w-full text-center space-y-4 shadow-2xl text-white">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-inner">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
            <h4 className="text-xs font-black leading-relaxed text-slate-200">{popupAlert}</h4>
            <button onClick={() => setPopupAlert(null)} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg active:scale-95">ঠিক আছে</button>
          </div>
        </div>
      )}
    </div>
  );
    }
