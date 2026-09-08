import React, { useState } from 'react';
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
  Radio
} from 'lucide-react';

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPhone] = useState('01728116153');
  const [adminPin, setAdminPin] = useState('');
  const [authError, setAuthError] = useState('');

  // মেনু নেভিগেশন স্টেট
  const [activeSection, setActiveSection] = useState<'menu' | 'users' | 'add_money' | 'offers' | 'chats' | 'links'>('menu');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [customMainBalance, setCustomMainBalance] = useState('');
  const [customDriveBalance, setCustomDriveBalance] = useState('');
  const [editingUser, setEditingUser] = useState<any | null>(null);

  // অপারেটর সক্রিয়/নিষ্ক্রিয় (Active/Inactive) সুইচ স্টেট
  const [operatorStatus, setOperatorStatus] = useState<Record<string, boolean>>({
    Grameenphone: true,
    Robi: true,
    Banglalink: true,
    Airtel: true,
    Teletalk: false // ডিফল্ট বন্ধ রাখা হলো
  });

  // ডামি ইউজার তালিকা
  const [usersList, setUsersList] = useState([
    {
      id: '1',
      name: 'User',
      phone: '01728116153',
      pin: '1234',
      mainBalance: 1400,
      driveBalance: 3870,
      history: [
        { type: 'add_balance', title: 'Add Balance (bKash)', amount: 1000, recipient: '01728116153', time: '10:30 AM' },
        { type: 'recharge', title: 'Flexiload (GP)', amount: 100, recipient: '01728116153', time: 'Yesterday' }
      ]
    },
    {
      id: '2',
      name: 'Rakib Telecom',
      phone: '01844556677',
      pin: '5566',
      mainBalance: 500,
      driveBalance: 1200,
      history: [
        { type: 'add_balance', title: 'Add Balance (Nagad)', amount: 1200, recipient: '01844556677', time: '11:00 AM' }
      ]
    }
  ]);

  const [addMoneyEnabled, setAddMoneyEnabled] = useState(true);
  const [paymentNumbers, setPaymentNumbers] = useState({
    bkash: '01728116153',
    nagad: '01728116153',
    rocket: '01728116153'
  });

  // অফার তালিকা
  const [offers, setOffers] = useState([
    { id: '1', operator: 'Grameenphone', title: '30 GB + 700 Min (30 Days)', offerPrice: 580, cashback: 119, note: 'শুধু চট্টগ্রাম ও ঢাকা বিভাগের জন্য' },
    { id: '2', operator: 'Robi', title: '50 GB + 1000 Min (30 Days)', offerPrice: 750, cashback: 149, note: 'অল বাংলাদেশ পাবে' },
    { id: '3', operator: 'Banglalink', title: '40 GB + 800 Min (30 Days)', offerPrice: 649, cashback: 130, note: 'সকল গ্রাহক পাবে' },
    { id: '4', operator: 'Airtel', title: '25 GB + 500 Min (30 Days)', offerPrice: 498, cashback: 95, note: 'স্পেশাল রেট' },
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
    whatsapp: '01728116153'
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

  // নির্দিষ্ট অপারেটর চালু বা বন্ধ করার টগল
  const toggleOperatorStatus = (operator: string) => {
    setOperatorStatus(prev => {
      const updated = { ...prev, [operator]: !prev[operator] };
      return updated;
    });
  };

  // নতুন অফার যোগ হ্যান্ডলার
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

  const handleSendMessage = () => {
    if (!replyText.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'admin', text: replyText.trim() }]);
    setReplyText('');
  };

  const filteredUsers = usersList.filter(
    u => u.phone.includes(searchQuery.trim()) || u.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  // সিম অনুযায়ী ব্যাজ কালার
  const getOperatorBadgeClass = (operator: string) => {
    switch (operator) {
      case 'Grameenphone': return 'bg-sky-50 text-sky-600 border-sky-200';
      case 'Robi': return 'bg-rose-50 text-rose-600 border-rose-200';
      case 'Banglalink': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'Airtel': return 'bg-red-50 text-red-600 border-red-200';
      case 'Teletalk': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  // শুধুমাত্র সক্রিয় সিমের অফার ফিল্টার
  const visibleOffers = offers.filter(of => operatorStatus[of.operator] !== false);

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
          {activeSection !== 'menu' ? (
            <button 
              onClick={() => {
                if (selectedUser) setSelectedUser(null);
                else setActiveSection('menu');
              }} 
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-700 active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
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

        <button 
          onClick={() => setIsAuthenticated(false)}
          className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 active:scale-95 transition-all"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 p-4 max-w-lg mx-auto w-full overflow-y-auto">
        {activeSection === 'menu' && (
          <div className="space-y-4">
            {/* কন্ট্রোল রুম ড্যাশবোর্ড কার্ড */}
            <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 text-white shadow-xl">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider bg-white/10 px-2.5 py-1 rounded-lg">
                Admin Control Room
              </span>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button 
                  onClick={() => setActiveSection('users')}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-3 text-left transition-all active:scale-95 group"
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <p className="text-[10px] text-slate-400 font-medium">মোট ইউজার</p>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-black font-mono text-white">{usersList.length} জন</h3>
                </button>

                <button 
                  onClick={() => setActiveSection('offers')}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-3 text-left transition-all active:scale-95 group"
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <p className="text-[10px] text-slate-400 font-medium">সক্রিয় অফার</p>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-black text-amber-400 font-mono">{visibleOffers.length} টি</h3>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setActiveSection('users')}
                className="bg-white border border-slate-200/80 rounded-3xl p-4 flex flex-col items-center text-center shadow-sm hover:shadow-md active:scale-95 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-900">ইউজার ম্যানেজার</span>
                <span className="text-[10px] text-slate-400">সার্চ, ব্যালেন্স ও পিন</span>
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
                  <Flame className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-900">ড্রাইভ প্যাক কন্ট্রোল</span>
                <span className="text-[10px] text-slate-400">সিম অন/অফ ও নতুন অফার</span>
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
                onClick={() => setActiveSection('links')}
                className="col-span-2 bg-white border border-slate-200/80 rounded-3xl p-4 flex items-center justify-between shadow-sm active:scale-98 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-900 block">সোশ্যাল সাপোর্ট লিঙ্ক</span>
                    <span className="text-[10px] text-slate-400">Facebook ও WhatsApp পরিবর্তন</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl">সেটিংস</span>
              </button>
            </div>
          </div>
        )}

        {/* ১. ইউজার ম্যানেজার ভিউ */}
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
                      <h4 className="text-xs font-bold text-slate-900">{u.name}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">📱 {u.phone}</p>
                      <p className="text-[10px] text-slate-400">
                        পিন: <span className="font-mono font-bold text-amber-600">{u.pin}</span> | মেইন: ৳{u.mainBalance} | ড্রাইভ: ৳{u.driveBalance}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
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

            {editingUser && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-5 max-w-xs w-full space-y-3 shadow-2xl">
                  <h4 className="text-xs font-bold text-slate-900 border-b pb-2">ইউজার তথ্য এডিট</h4>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">নাম</label>
                    <input type="text" value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2 text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">মোবাইল নম্বর</label>
                    <input type="tel" value={editingUser.phone} onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2 text-xs font-mono" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">গোপন পিন</label>
                    <input type="text" inputMode="numeric" value={editingUser.pin} onChange={(e) => setEditingUser({ ...editingUser, pin: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2 text-xs font-mono text-amber-600 font-bold" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => setEditingUser(null)} className="flex-1 py-2 bg-slate-100 rounded-xl text-xs font-bold">বাতিল</button>
                    <button onClick={handleSaveUserEdit} className="flex-1 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">সেভ</button>
                  </div>
                </div>
              </div>
            )}
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

            <div className="bg-white border rounded-3xl p-4 space-y-2 shadow-sm">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                <History className="w-4 h-4 text-indigo-600" /> ট্রানজ্যাকশন হিস্ট্রি
              </h4>
              {selectedUser.history?.map((h: any, i: number) => (
                <div key={i} className="bg-slate-50 border rounded-xl p-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{h.title}</p>
                    <p className="text-[10px] text-slate-400">{h.recipient} • {h.time}</p>
                  </div>
                  <p className="font-mono font-bold text-indigo-600">৳{h.amount}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ২. এড মানি কন্ট্রোল */}
        {activeSection === 'add_money' && (
          <div className="space-y-4">
            <div className="bg-white border rounded-3xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Add Balance সার্ভিস</h4>
                <p className="text-[10px] text-slate-400">বন্ধ করলে ইউজাররা টাকা পাঠাতে পারবে না</p>
              </div>
              <button onClick={() => setAddMoneyEnabled(!addMoneyEnabled)}>
                {addMoneyEnabled ? (
                  <span className="text-emerald-600 text-xs font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1">
                    <ToggleRight className="w-5 h-5" /> চালু
                  </span>
                ) : (
                  <span className="text-rose-600 text-xs font-bold bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl flex items-center gap-1">
                    <ToggleLeft className="w-5 h-5" /> বন্ধ
                  </span>
                )}
              </button>
            </div>

            <div className="bg-white border rounded-3xl p-4 space-y-3 shadow-sm">
              <h4 className="text-xs font-bold text-slate-900 border-b pb-2">পেমেন্ট নম্বর পরিবর্তন</h4>
              <div>
                <label className="text-[10px] font-bold text-pink-600 block mb-1">bKash নম্বর</label>
                <input type="tel" value={paymentNumbers.bkash} onChange={(e) => setPaymentNumbers({ ...paymentNumbers, bkash: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-mono font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-orange-600 block mb-1">Nagad নম্বর</label>
                <input type="tel" value={paymentNumbers.nagad} onChange={(e) => setPaymentNumbers({ ...paymentNumbers, nagad: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-mono font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-purple-600 block mb-1">Rocket নম্বর</label>
                <input type="tel" value={paymentNumbers.rocket} onChange={(e) => setPaymentNumbers({ ...paymentNumbers, rocket: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-mono font-bold" />
              </div>
              <button onClick={() => alert('নম্বর সংরক্ষিত হয়েছে!')} className="w-full py-3 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md">
                নম্বর সেভ করুন
              </button>
            </div>
          </div>
        )}

        {/* ৩. ড্রাইভ অফার ও সিম অপারেটর অন/অফ কন্ট্রোল */}
        {activeSection === 'offers' && (
          <div className="space-y-4">
            
            {/* সিম অন/অফ কন্ট্রোল সুইচ বক্স */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5 mb-3">
                <Radio className="w-4 h-4 text-indigo-600 animate-pulse" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">সিম অফার চালু / বন্ধ কন্ট্রোল</h4>
                  <p className="text-[10px] text-slate-400">যে সিমটি বন্ধ করবেন, ইউজার অ্যাপে সেই সিমের অফার লুকানো থাকবে</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { name: 'Grameenphone', label: 'GP (গ্রামীন)' },
                  { name: 'Robi', label: 'Robi (রবি)' },
                  { name: 'Banglalink', label: 'BL (বাংলালিংক)' },
                  { name: 'Airtel', label: 'Airtel (এয়ারটেল)' },
                  { name: 'Teletalk', label: 'Teletalk (টেলিটক)' }
                ].map((op) => {
                  const isActive = operatorStatus[op.name] !== false;
                  return (
                    <button
                      key={op.name}
                      onClick={() => toggleOperatorStatus(op.name)}
                      className={`p-2.5 rounded-2xl border flex items-center justify-between text-left transition-all active:scale-95 ${
                        isActive 
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 shadow-sm' 
                          : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold leading-tight">{op.label}</p>
                        <span className="text-[9px] font-semibold uppercase">
                          {isActive ? '● অফার চালু' : '○ অফার বন্ধ'}
                        </span>
                      </div>
                      {isActive ? (
                        <ToggleRight className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* নতুন অফার পাবলিশ ফর্ম */}
            <div className="bg-white border rounded-3xl p-4 space-y-3 shadow-sm">
              <h4 className="text-xs font-bold text-slate-900 border-b pb-2 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-rose-500" /> নতুন ড্রাইভ অফার তৈরি করুন
              </h4>

              {/* সিম অপারেটর সিলেকশন */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">সিম অপারেটর নির্বাচন করুন</label>
                <select
                  value={newOffer.operator}
                  onChange={(e) => setNewOffer({ ...newOffer, operator: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
                >
                  <option value="Grameenphone">Grameenphone (GP)</option>
                  <option value="Robi">Robi</option>
                  <option value="Banglalink">Banglalink (BL)</option>
                  <option value="Airtel">Airtel</option>
                  <option value="Teletalk">Teletalk</option>
                </select>
              </div>

              {/* অফার প্যাকেজ নাম */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">প্যাকেজ বিবরণ / টাইটেল</label>
                <input 
                  type="text" 
                  placeholder="যেমন: 30 GB + 700 Min (30 Days)" 
                  value={newOffer.title} 
                  onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium" 
                />
              </div>

              {/* মূল্য ও কমিশন */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">অফার মূল্য (৳)</label>
                  <input 
                    type="number" 
                    placeholder="যেমন: 580" 
                    value={newOffer.offerPrice} 
                    onChange={(e) => setNewOffer({ ...newOffer, offerPrice: e.target.value })} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold font-mono" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">কমিশন / ক্যাশব্যাক (৳)</label>
                  <input 
                    type="number" 
                    placeholder="যেমন: 120" 
                    value={newOffer.cashback} 
                    onChange={(e) => setNewOffer({ ...newOffer, cashback: e.target.value })} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold font-mono text-emerald-600" 
                  />
                </div>
              </div>

              {/* অফার নোট */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-indigo-500" /> অফার নোট (শর্ত বা নির্দেশনা)
                </label>
                <input 
                  type="text" 
                  placeholder="যেমন: শুধু ঢাকা বিভাগ পাবে / হাজির অফার / রিচার্জ অফার" 
                  value={newOffer.note} 
                  onChange={(e) => setNewOffer({ ...newOffer, note: e.target.value })} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700" 
                />
              </div>

              <button 
                onClick={handleAddOffer} 
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" /> অফারটি পাবলিশ করুন
              </button>
            </div>

            {/* বর্তমান অফার তালিকা (চালু সিমের অফারগুলো দেখাচ্ছে) */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold text-slate-700">চালু অফার সমূহ ({visibleOffers.length})</span>
                <span className="text-[10px] text-slate-400">মোট ডাটাবেজে: {offers.length} টি</span>
              </div>

              {visibleOffers.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-6 text-center">
                  <p className="text-xs text-slate-400 font-medium">কোনো অফার সক্রিয় নেই অথবা নির্বাচিত সিমগুলো বন্ধ রয়েছে</p>
                </div>
              ) : (
                visibleOffers.map((of) => (
                  <div key={of.id} className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-start justify-between shadow-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold border uppercase ${getOperatorBadgeClass(of.operator || 'Grameenphone')}`}>
                          {of.operator || 'GP'}
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 leading-tight">{of.title}</h5>
                      </div>

                      <p className="text-[11px] text-slate-500">
                        মূল্য: <span className="font-bold text-slate-800">৳{of.offerPrice}</span> | 
                        কমিশন: <span className="font-bold text-emerald-600">৳{of.cashback}</span>
                      </p>

                      {of.note && (
                        <p className="text-[10px] text-indigo-600 bg-indigo-50/80 border border-indigo-100 px-2 py-0.5 rounded-lg inline-flex items-center gap-1">
                          📌 {of.note}
                        </p>
                      )}
                    </div>

                    <button 
                      onClick={() => setOffers(offers.filter(o => o.id !== of.id))} 
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ৪. লাইভ চ্যাট */}
        {activeSection === 'chats' && (
          <div className="bg-white border rounded-3xl p-3.5 h-[450px] flex flex-col shadow-sm">
            <div className="border-b pb-2 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">{activeChatUser ? activeChatUser.name.charAt(0) : 'U'}</div>
              <div><h4 className="text-xs font-bold text-slate-900">{activeChatUser ? activeChatUser.name : 'গ্রাহক নির্বাচন করুন'}</h4><p className="text-[10px] text-slate-400 font-mono">{activeChatUser?.phone}</p></div>
            </div>
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

        {/* ৫. সোশ্যাল লিংক */}
        {activeSection === 'links' && (
          <div className="bg-white border rounded-3xl p-4 space-y-3.5 shadow-sm">
            <h4 className="text-xs font-bold text-slate-900 border-b pb-2">সোশ্যাল সাপোর্ট লিঙ্ক কনফিগার</h4>
            <div><label className="text-[10px] font-bold text-blue-600 block mb-1">Facebook গ্রুপ লিংক</label><input type="text" value={socialLinks.facebook} onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs" /></div>
            <div><label className="text-[10px] font-bold text-emerald-600 block mb-1">WhatsApp নম্বর</label><input type="tel" value={socialLinks.whatsapp} onChange={(e) => setSocialLinks({ ...socialLinks, whatsapp: e.target.value })} className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-mono" /></div>
            <button onClick={() => alert('লিংক সেভ হয়েছে!')} className="w-full py-3 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md">লিংক সেভ করুন</button>
          </div>
        )}
      </main>
    </div>
  );
}
