import React, { useState } from 'react';
import {
  ShieldCheck, Users, Wallet, Flame, MessageSquare, Share2, Search,
  Eye, Edit3, Save, Trash2, ToggleLeft, ToggleRight, Send, ArrowLeft,
  Lock, LogOut
} from 'lucide-react';

type Section = 'menu' | 'users' | 'add_money' | 'offers' | 'chats' | 'links';

type HistoryItem = {
  type: string;
  title: string;
  amount: number;
  recipient: string;
  time: string;
};

type User = {
  id: string;
  name: string;
  phone: string;
  pin: string;
  mainBalance: number;
  driveBalance: number;
  history: HistoryItem[];
};

type Offer = {
  id: string;
  title: string;
  offerPrice: number;
  cashback: number;
};

type ChatMessage = {
  sender: 'user' | 'admin';
  text: string;
};

export default function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPhone] = useState('01728116153');
  const [adminPin, setAdminPin] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeSection, setActiveSection] = useState<Section>('menu');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [customMainBalance, setCustomMainBalance] = useState('');
  const [customDriveBalance, setCustomDriveBalance] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [usersList, setUsersList] = useState<User[]>([
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

  const [offers, setOffers] = useState<Offer[]>([
    { id: '1', title: 'GP 30 GB + 700 Min', offerPrice: 580, cashback: 119 },
    { id: '2', title: 'Robi 50 GB + 1000 Min', offerPrice: 750, cashback: 149 }
  ]);

  const [newOffer, setNewOffer] = useState({
    title: '',
    offerPrice: '',
    cashback: ''
  });

  const [chatUsers] = useState([
    { id: '1', name: 'User', phone: '01728116153', lastMsg: 'ভাই রিচার্জ আটকে আছে' }
  ]);
  const [activeChatUser, setActiveChatUser] = useState<typeof chatUsers[number] | null>(chatUsers[0]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'user', text: 'ভাই রিচার্জ আটকে আছে' }
  ]);
  const [replyText, setReplyText] = useState('');

  const [socialLinks, setSocialLinks] = useState({
    facebook: 'https://facebook.com',
    whatsapp: '01728116153'
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '1234') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('ভুল অ্যাডমিন পিন!');
    }
  };

  const handleOpenUser = (u: User) => {
    setSelectedUser(u);
    setCustomMainBalance(u.mainBalance.toString());
    setCustomDriveBalance(u.driveBalance.toString());
  };

  const handleSaveBalance = () => {
    if (!selectedUser) return;

    const main = customMainBalance === '' ? 0 : Number(customMainBalance);
    const drive = customDriveBalance === '' ? 0 : Number(customDriveBalance);

    if (!Number.isFinite(main) || !Number.isFinite(drive) || main < 0 || drive < 0) {
      alert('সঠিক ব্যালেন্স দিন।');
      return;
    }

    setUsersList(prev =>
      prev.map(u =>
        u.id === selectedUser.id
          ? { ...u, mainBalance: main, driveBalance: drive }
          : u
      )
    );

    setSelectedUser({ ...selectedUser, mainBalance: main, driveBalance: drive });
    alert('ব্যালেন্স আপডেট সফল!');
  };

  const handleSaveUserEdit = () => {
    if (!editingUser) return;

    setUsersList(prev =>
      prev.map(u => (u.id === editingUser.id ? editingUser : u))
    );

    if (selectedUser?.id === editingUser.id) {
      setSelectedUser(editingUser);
    }

    setEditingUser(null);
  };

  const handleAddOffer = () => {
    if (!newOffer.title || !newOffer.offerPrice) {
      alert('অফার টাইটেল ও মূল্য দিন।');
      return;
    }

    const offerPrice = Number(newOffer.offerPrice);
    const cashback = Number(newOffer.cashback) || 0;

    if (!Number.isFinite(offerPrice) || offerPrice < 0 || cashback < 0) {
      alert('সঠিক মূল্য/কমিশন দিন।');
      return;
    }

    setOffers(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        title: newOffer.title,
        offerPrice,
        cashback
      }
    ]);

    setNewOffer({ title: '', offerPrice: '', cashback: '' });
  };

  const handleSendMessage = () => {
    if (!replyText.trim()) return;

    setChatMessages(prev => [
      ...prev,
      { sender: 'admin', text: replyText.trim() }
    ]);

    setReplyText('');
  };

  const filteredUsers = usersList.filter(u =>
    u.phone.includes(searchQuery.trim()) ||
    u.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const goBack = () => {
    if (selectedUser) {
      setSelectedUser(null);
    } else {
      setActiveSection('menu');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 select-none">
        <div className="w-full max-w-xs bg-white rounded-3xl p-6 shadow-xl border border-slate-100 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-base font-black text-slate-900">SIM OFFER SHOP</h2>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-5">
            ADMIN PANEL ACCESS
          </p>

          <form onSubmit={handleLogin} className="space-y-3.5 text-left">
            {authError && (
              <div className="p-2 bg-red-50 text-red-500 text-xs text-center rounded-xl border border-red-200">
                {authError}
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">
                অ্যাডমিন নম্বর
              </label>
              <input
                type="text"
                disabled
                value={adminPhone}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-500 font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-1">
                অ্যাডমিন পিন
              </label>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={adminPin}
                onChange={e => setAdminPin(e.target.value)}
                placeholder="••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-mono tracking-widest text-center focus:outline-none focus:border-indigo-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-200 active:scale-95 transition-all"
            >
              লগইন করুন
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col select-none">
      <header className="bg-white border-b border-slate-200 px-4 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          {activeSection !== 'menu' ? (
            <button
              onClick={goBack}
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
            <h1 className="text-sm font-black text-slate-900 leading-tight">
              SIM OFFER SHOP ADMIN PANEL
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              অ্যাডমিন কন্ট্রোল ড্যাশবোর্ড
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setIsAuthenticated(false);
            setAdminPin('');
            setActiveSection('menu');
            setSelectedUser(null);
          }}
          className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 active:scale-95 transition-all"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-1 p-4 max-w-lg mx-auto w-full overflow-y-auto">
        {activeSection === 'menu' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 text-white shadow-xl">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider bg-white/10 px-2.5 py-1 rounded-lg">
                Admin Control Room
              </span>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                  <p className="text-[10px] text-slate-400">মোট ইউজার</p>
                  <h3 className="text-lg font-black font-mono">
                    {usersList.length} জন
                  </h3>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                  <p className="text-[10px] text-slate-400">সক্রিয় অফার</p>
                  <h3 className="text-lg font-black text-amber-400 font-mono">
                    {offers.length} টি
                  </h3>
                </div>
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
                <span className="text-[10px] text-slate-400">নতুন অফার ও দাম</span>
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
                className="col-span-2 bg-white border border-slate-200/80 rounded-3xl p-4 flex items-center justify-between shadow-sm active:scale-95 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-900 block">
                      সোশ্যাল সাপোর্ট লিঙ্ক
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Facebook ও WhatsApp পরিবর্তন
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl">
                  সেটিংস
                </span>
              </button>
            </div>
          </div>
        )}

        {activeSection === 'users' && !selectedUser && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="নম্বর বা নাম দিয়ে গ্রাহক খুঁজুন..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 shadow-sm focus:outline-none focus:border-indigo-600 font-medium"
              />
            </div>

            <div className="space-y-2.5">
              {filteredUsers.map(u => (
                <div
                  key={u.id}
                  onClick={() => handleOpenUser(u)}
                  className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between shadow-sm cursor-pointer active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                      {u.name.charAt(0)}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{u.name}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        📱 {u.phone}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        পিন:{' '}
                        <span className="font-mono font-bold text-amber-600">
                          {u.pin}
                        </span>{' '}
                        | মেইন: ৳{u.mainBalance} | ড্রাইভ: ৳{u.driveBalance}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => handleOpenUser(u)}
                      className="p-2 bg-slate-100 rounded-xl text-slate-600"
                      aria-label="View user"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingUser({ ...u })}
                      className="p-2 bg-slate-100 rounded-xl text-slate-600"
                      aria-label="Edit user"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="bg-white border rounded-2xl p-6 text-center text-xs text-slate-500">
                  কোনো ইউজার পাওয়া যায়নি।
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'users' && selectedUser && (
          <div className="space-y-4">
            <div className="bg-white border rounded-3xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedUser.name}</h3>
                <p className="text-xs text-slate-500 font-mono">📱 {selectedUser.phone}</p>
                <p className="text-xs text-amber-600 font-mono font-bold mt-0.5">
                  🔑 পিন: {selectedUser.pin}
                </p>
              </div>

              <button
                onClick={() => setEditingUser({ ...selectedUser })}
                className="p-2 bg-slate-100 rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" /> এডিট
              </button>
            </div>

            <div className="bg-white border rounded-3xl p-4 space-y-3 shadow-sm">
              <h4 className="text-xs font-bold text-slate-800">ব্যালেন্স মডিফিকেশন</h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border rounded-2xl p-3">
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">
                    মেইন ব্যালেন্স (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={customMainBalance}
                    onChange={e => setCustomMainBalance(e.target.value)}
                    className="w-full bg-white border rounded-xl px-3 py-2 text-sm font-mono font-bold"
                  />
                </div>

                <div className="bg-slate-50 border rounded-2xl p-3">
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">
                    ড্রাইভ ব্যালেন্স (৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={customDriveBalance}
                    onChange={e => setCustomDriveBalance(e.target.value)}
                    className="w-full bg-white border rounded-xl px-3 py-2 text-sm font-mono font-bold"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveBalance}
                className="w-full py-3 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md active:scale-95"
              >
                <Save className="w-4 h-4 inline mr-1" /> ব্যালেন্স আপডেট করুন
              </button>
            </div>

            <div className="bg-white border rounded-3xl p-4 shadow-sm">
              <h4 className="text-xs font-bold text-slate-800 mb-3">লেনদেন ইতিহাস</h4>
              <div className="space-y-2">
                {selectedUser.history.map((item, i) => (
                  <div key={i} className="bg-slate-50 border rounded-2xl p-3">
                    <p className="text-xs font-bold text-slate-900">{item.title}</p>
                    <p className="text-[10px] text-slate-500">
                      ৳{item.amount} · {item.recipient} · {item.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'add_money' && (
          <div className="space-y-4">
            <div className="bg-white border rounded-3xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Add Balance সার্ভিস</h4>
                <p className="text-[10px] text-slate-400">
                  বন্ধ করলে ইউজাররা টাকা পাঠাতে পারবে না
                </p>
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
              <h4 className="text-xs font-bold text-slate-900 border-b pb-2">
                পেমেন্ট নম্বর পরিবর্তন
              </h4>

              <div>
                <label className="text-[10px] font-bold text-pink-600 block mb-1">
                  bKash নম্বর
                </label>
                <input
                  type="tel"
                  value={paymentNumbers.bkash}
                  onChange={e => setPaymentNumbers({ ...paymentNumbers, bkash: e.target.value })}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-orange-600 block mb-1">
                  Nagad নম্বর
                </label>
                <input
                  type="tel"
                  value={paymentNumbers.nagad}
                  onChange={e => setPaymentNumbers({ ...paymentNumbers, nagad: e.target.value })}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-purple-600 block mb-1">
                  Rocket নম্বর
                </label>
                <input
                  type="tel"
                  value={paymentNumbers.rocket}
                  onChange={e => setPaymentNumbers({ ...paymentNumbers, rocket: e.target.value })}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-mono font-bold"
                />
              </div>

              <button
                onClick={() => alert('নম্বর সংরক্ষিত হয়েছে!')}
                className="w-full py-3 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                নম্বর সেভ করুন
              </button>
            </div>
          </div>
        )}

        {activeSection === 'offers' && (
          <div className="space-y-4">
            <div className="bg-white border rounded-3xl p-4 space-y-3 shadow-sm">
              <h4 className="text-xs font-bold text-slate-900 border-b pb-2">
                নতুন অফার পাবলিশ
              </h4>

              <input
                type="text"
                placeholder="অফার টাইটেল"
                value={newOffer.title}
                onChange={e => setNewOffer({ ...newOffer, title: e.target.value })}
                className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="মূল্য (৳)"
                  value={newOffer.offerPrice}
                  onChange={e => setNewOffer({ ...newOffer, offerPrice: e.target.value })}
                  className="bg-slate-50 border rounded-xl p-2.5 text-xs"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="কমিশন (৳)"
                  value={newOffer.cashback}
                  onChange={e => setNewOffer({ ...newOffer, cashback: e.target.value })}
                  className="bg-slate-50 border rounded-xl p-2.5 text-xs"
                />
              </div>

              <button
                onClick={handleAddOffer}
                className="w-full py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl"
              >
                অফার যোগ করুন
              </button>
            </div>

            <div className="space-y-2">
              {offers.map(of => (
                <div
                  key={of.id}
                  className="bg-white border rounded-2xl p-3.5 flex items-center justify-between shadow-sm"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">{of.title}</p>
                    <p className="text-[10px] text-slate-500">
                      মূল্য: ৳{of.offerPrice} | কমিশন: ৳{of.cashback}
                    </p>
                  </div>

                  <button
                    onClick={() => setOffers(prev => prev.filter(o => o.id !== of.id))}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl"
                    aria-label="Delete offer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'chats' && (
          <div className="bg-white border rounded-3xl p-3.5 h-[520px] flex flex-col shadow-sm">
            <div className="flex gap-2 overflow-x-auto border-b pb-2 mb-2">
              {chatUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => setActiveChatUser(user)}
                  className={`shrink-0 rounded-xl px-3 py-2 text-left ${
                    activeChatUser?.id === user.id
                      ? 'bg-indigo-50 border border-indigo-200'
                      : 'bg-slate-50 border'
                  }`}
                >
                  <p className="text-[11px] font-bold text-slate-900">{user.name}</p>
                  <p className="text-[9px] text-slate-400 font-mono">{user.phone}</p>
                </button>
              ))}
            </div>

            <div className="border-b pb-2 mb-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                {activeChatUser ? activeChatUser.name.charAt(0) : 'U'}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {activeChatUser ? activeChatUser.name : 'গ্রাহক নির্বাচন করুন'}
                </h4>
                <p className="text-[10px] text-slate-400 font-mono">
                  {activeChatUser?.phone}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs ${
                      msg.sender === 'admin'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2 border-t">
              <input
                type="text"
                placeholder="উত্তর লিখুন..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-slate-50 border rounded-xl px-3 py-2 text-xs focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="p-2.5 bg-indigo-600 text-white rounded-xl"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeSection === 'links' && (
          <div className="bg-white border rounded-3xl p-4 space-y-3.5 shadow-sm">
            <h4 className="text-xs font-bold text-slate-900 border-b pb-2">
              সোশ্যাল সাপোর্ট লিঙ্ক কনফিগার
            </h4>

            <div>
              <label className="text-[10px] font-bold text-blue-600 block mb-1">
                Facebook গ্রুপ লিংক
              </label>
              <input
                type="url"
                value={socialLinks.facebook}
                onChange={e => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-emerald-600 block mb-1">
                WhatsApp নম্বর
              </label>
              <input
                type="tel"
                value={socialLinks.whatsapp}
                onChange={e => setSocialLinks({ ...socialLinks, whatsapp: e.target.value })}
                className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-mono"
              />
            </div>

            <button
              onClick={() => alert('লিংক সেভ হয়েছে!')}
              className="w-full py-3 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md"
            >
              লিংক সেভ করুন
            </button>
          </div>
        )}
      </main>

      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl">
            <h3 className="text-sm font-black text-slate-900 mb-4">ইউজার এডিট</h3>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">নাম</label>
                <input
                  value={editingUser.name}
                  onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">ফোন</label>
                <input
                  value={editingUser.phone}
                  onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 block mb-1">পিন</label>
                <input
                  value={editingUser.pin}
                  maxLength={6}
                  onChange={e => setEditingUser({ ...editingUser, pin: e.target.value })}
                  className="w-full bg-slate-50 border rounded-xl p-2.5 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => setEditingUser(null)}
                className="py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                বাতিল
              </button>
              <button
                onClick={handleSaveUserEdit}
                className="py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                সেভ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
