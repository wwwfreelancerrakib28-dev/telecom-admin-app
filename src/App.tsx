import React, { useState, useEffect } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { db } from './firebase';
import { ref, set, push, onValue, update, remove } from 'firebase/database';
import { 
  ShieldCheck, Wallet, Flame, MessageSquare, Search, Edit3, Trash2, 
  ToggleLeft, ToggleRight, Send, ArrowLeft, History, Lock, LogOut, 
  Radio, CheckCircle, XCircle, Copy, Check, Ban, Ticket, BellRing, Globe, FileText, Smartphone, Users
} from 'lucide-react';

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeSection, setActiveSection] = useState<'menu' | 'users' | 'add_money' | 'recharge_orders' | 'drive_orders' | 'offers' | 'history' | 'chats' | 'links' | 'live_users' | 'broadcast' | 'scratch_cards' | 'update_control'>('menu');
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

  // ফোর্স আপডেট কন্ট্রোল স্টেট
  const [forceUpdateEnabled, setForceUpdateEnabled] = useState(false);
  const [updateLink, setUpdateLink] = useState('https://play.google.com/store/apps/details?id=com.telecom.app');

  const [addMoneyNote, setAddMoneyNote] = useState('প্রথমে নাম্বারে টাকা পাঠিয়ে ট্রানজ্যাকশন আইডি দিন।');
  const [noteInput, setNoteInput] = useState(addMoneyNote);

  const [socialLinks, setSocialLinks] = useState({ facebookPage: '', whatsappNumber: '' });
  const [masterDriveEnabled, setMasterDriveEnabled] = useState(true);
  const [simStatus, setSimStatus] = useState<Record<string, boolean>>({});

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

  const handleUpdateSettingsSave = () => {
    set(ref(db, 'settings/forceUpdate'), { enabled: forceUpdateEnabled, link: updateLink });
    alert('✅ ফোর্স আপডেট সেটিংস সফলভাবে আপডেট করা হয়েছে!');
  };

  const updateAddMoneyNoteInDb = () => {
    set(ref(db, 'settings/addMoneyNote'), noteInput);
    setAddMoneyNote(noteInput);
    alert('এড-মানি নোট সফলভাবে আপডেট হয়েছে!');
  };

  const updateAddMoneySettings = () => {
    set(ref(db, 'settings/addMoney'), { enabled: addMoneyEnabled, numbers: paymentNumbers });
    alert('পেমেন্ট সেটিংস সফলভাবে আপডেট করা হয়েছে!');
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
    alert('✅ এড-মানি অ্যাপ্রুভ করা হয়েছে!');
  };

  const handleCancelAddMoney = (id: string) => {
    update(ref(db, `addMoneyLogs/${id}`), { status: 'Cancelled' });
    alert('❌ এড-মানি রিকোয়েস্ট ক্যানসেল করা হয়েছে।');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-xs">
        <div className="w-full max-w-xs bg-white rounded-3xl p-6 shadow-xl border text-center">
          <Lock className="w-6 h-6 mx-auto mb-3 text-indigo-600" />
          <h2 className="text-sm font-black text-slate-900">ADMIN LOGIN</h2>
          <form onSubmit={(e) => { e.preventDefault(); if (adminPin === '1234' || adminPin.length >= 4) { setIsAuthenticated(true); setAuthError(''); } else { setAuthError('ভুল পিন!'); } }} className="space-y-3 mt-4 text-left">
            {authError && <div className="p-2 bg-red-50 text-red-500 text-xs text-center rounded-xl">{authError}</div>}
            <input type="password" inputMode="numeric" maxLength={6} value={adminPin} onChange={(e) => setAdminPin(e.target.value)} placeholder="অ্যাডমিন পিন (••••)" className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs text-center font-bold tracking-widest" />
            <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl">লগইন</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-xs">
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-2.5">
          {activeSection !== 'menu' && <button onClick={() => setActiveSection('menu')} className="p-1.5 -ml-1 rounded-xl bg-slate-100"><ArrowLeft className="w-4 h-4" /></button>}
          <h1 className="text-xs font-black text-slate-900">SIM OFFER SHOP ADMIN</h1>
        </div>
        <button onClick={() => setIsAuthenticated(false)} className="p-2 rounded-xl bg-slate-100 text-slate-600"><LogOut className="w-4 h-4" /></button>
      </header>

      <main className="flex-1 p-3 max-w-lg mx-auto w-full overflow-y-auto space-y-3">
        {activeSection === 'menu' && (
          <div className="grid grid-cols-2 gap-2.5">
            <button onClick={() => setActiveSection('recharge_orders')} className="bg-white border rounded-2xl p-3 flex flex-col items-center text-center shadow-sm">
              <Send className="w-5 h-5 text-sky-600 mb-1" />
              <span className="font-bold">রিচার্জ অর্ডার</span>
            </button>
            <button onClick={() => setActiveSection('drive_orders')} className="bg-white border rounded-2xl p-3 flex flex-col items-center text-center shadow-sm">
              <Flame className="w-5 h-5 text-amber-600 mb-1" />
              <span className="font-bold">ড্রাইভ অর্ডার</span>
            </button>
            <button onClick={() => setActiveSection('scratch_cards')} className="bg-white border rounded-2xl p-3 flex flex-col items-center text-center shadow-sm">
              <Ticket className="w-5 h-5 text-pink-600 mb-1" />
              <span className="font-bold">স্ক্র্যাচ কার্ড</span>
            </button>
            <button onClick={() => setActiveSection('offers')} className="bg-white border rounded-2xl p-3 flex flex-col items-center text-center shadow-sm">
              <Radio className="w-5 h-5 text-rose-600 mb-1" />
              <span className="font-bold">ড্রাইভ প্যাক কন্ট্রোল</span>
            </button>
            <button onClick={() => setActiveSection('history')} className="bg-white border rounded-2xl p-3 flex flex-col items-center text-center shadow-sm">
              <History className="w-5 h-5 text-violet-600 mb-1" />
              <span className="font-bold">History রিপোর্ট</span>
            </button>
            <button onClick={() => setActiveSection('add_money')} className="bg-white border rounded-2xl p-3 flex flex-col items-center text-center shadow-sm">
              <Wallet className="w-5 h-5 text-emerald-600 mb-1" />
              <span className="font-bold">এড মানি কন্ট্রোল ও নোট</span>
            </button>
            <button onClick={() => setActiveSection('users')} className="bg-white border rounded-2xl p-3 flex flex-col items-center text-center shadow-sm">
              <Users className="w-5 h-5 text-indigo-600 mb-1" />
              <span className="font-bold">ইউজার ম্যানেজার</span>
            </button>
            <button onClick={() => setActiveSection('update_control')} className="bg-white border rounded-2xl p-3 flex flex-col items-center text-center shadow-sm">
              <Smartphone className="w-5 h-5 text-blue-600 mb-1" />
              <span className="font-bold">Force Update কন্ট্রোল</span>
            </button>
          </div>
        )}

        {/* এড মানি কন্ট্রোল ও নোট সেকশন */}
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

            <div className="bg-white border rounded-2xl p-3.5 space-y-2 shadow-sm">
              <h4 className="font-bold text-slate-900 border-b pb-1.5 flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-indigo-600" /> এড-মানি নির্দেশিকা নোট</h4>
              <textarea value={noteInput} onChange={(e) => setNoteInput(e.target.value)} placeholder="ইউজার অ্যাপে দেখানোর জন্য নোট লিখুন..." className="w-full bg-slate-50 border rounded-xl p-2.5 h-20 text-xs" />
              <button onClick={updateAddMoneyNoteInDb} className="w-full py-2 bg-indigo-600 text-white font-bold rounded-xl">নোট আপডেট করুন</button>
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

        {/* ফোর্স আপডেট কন্ট্রোল পেজ */}
        {activeSection === 'update_control' && (
          <div className="space-y-3">
            <div className="bg-white border rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
              <div>
                <h4 className="font-bold text-slate-900">ফোর্স আপডেট (Force Update)</h4>
                <p className="text-[10px] text-slate-400">চালু করলে ইউজাররা আপডেট ছাড়া অ্যাপে ঢুকতে পারবে না</p>
              </div>
              <button onClick={() => setForceUpdateEnabled(!forceUpdateEnabled)}>
                {forceUpdateEnabled ? <ToggleRight className="w-7 h-7 text-emerald-600" /> : <ToggleLeft className="w-7 h-7 text-rose-600" />}
              </button>
            </div>

            <div className="bg-white border rounded-2xl p-3.5 space-y-2 shadow-sm">
              <h4 className="font-bold text-slate-900 border-b pb-1.5">নতুন অ্যাপ ডাউনলোড লিংক</h4>
              <input type="text" value={updateLink} onChange={(e) => setUpdateLink(e.target.value)} placeholder="https://..." className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-medium" />
              <button onClick={handleUpdateSettingsSave} className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl">সেটিংস সেভ করুন</button>
            </div>
          </div>
        )}

        {activeSection === 'history' && (
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 px-1">এড-মানি রিকোয়েস্ট লিস্ট</h4>
            {addMoneyLogs.map(log => (
              <div key={log.id} className="bg-white border rounded-xl p-3 space-y-2 shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-900">৳{log.amount} ({log.method})</p>
                    <p className="text-[10px] text-slate-600">👤 {log.userName} ({log.userPhone})</p>
                    <p className="text-[10px] text-slate-400">TrxID: <strong className="font-mono text-indigo-600">{log.trxId}</strong></p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${log.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : log.status === 'Cancelled' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{log.status}</span>
                </div>
                {log.status === 'Pending' && (
                  <div className="flex gap-2 pt-1 border-t">
                    <button onClick={() => handleApproveAddMoney(log)} className="flex-1 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-xs">Approve</button>
                    <button onClick={() => handleCancelAddMoney(log.id)} className="flex-1 py-1.5 bg-rose-600 text-white font-bold rounded-lg text-xs">Cancel</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
