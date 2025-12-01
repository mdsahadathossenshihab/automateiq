import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../AuthContext';
import { CONTACT_INFO } from '../constants';
import { LogOut, Package, CheckCircle, Clock, XCircle, LayoutDashboard, Users, ShoppingCart, User as UserIcon, Send, Link as LinkIcon, Calendar, X, Mail, MessageSquare, ExternalLink, Copy, Check, Search, ArrowLeft, ArrowRight, Phone, Award, Loader2, Zap, Coins, MessageCircle, Settings, Save, AlertTriangle, Terminal, FileCode, Server, Menu, FileText, HelpCircle, BellRing } from 'lucide-react';
import { Order, User, SupportMessage } from '../types';
import Logo from './Logo';

interface DashboardProps {
  onClose: () => void;
  onNavigateToPricing: () => void;
}

// --- Helper Components ---

const CopyButton = ({ text, title = "Copy" }: { text: string, title?: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <button 
      onClick={handleCopy}
      className={`transition-colors ${copied ? 'text-green-600' : 'text-slate-400 hover:text-blue-600'}`}
      title={copied ? "Copied!" : title}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
};

// --- Chat Interface ---
const ChatInterface = ({ messages, currentUserId, onSend, targetUser }: { messages: SupportMessage[], currentUserId: string, onSend: (text: string) => void, targetUser?: User }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { scrollToBottom(); }, [messages]);
  const handleSend = (e: React.FormEvent) => { e.preventDefault(); if (!input.trim()) return; onSend(input); setInput(''); };

  return (
    <div className="flex flex-col h-[700px] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-white border-b border-slate-100 p-5 flex items-center gap-4 sticky top-0 z-10">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
          {targetUser ? (targetUser.name || 'U').charAt(0).toUpperCase() : 'S'}
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-lg">{targetUser ? targetUser.name : 'সাপোর্ট চ্যাট'}</h3>
          <p className="text-sm text-slate-500 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            {targetUser ? targetUser.email : 'সরাসরি কথা বলুন'}
          </p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-50">
            <MessageSquare size={64} className="mb-4" />
            <p className="text-lg font-medium">কোনো মেসেজ নেই। কথা শুরু করুন!</p>
          </div>
        )}
        
        {messages.map((msg) => {
          const amIAdmin = !!targetUser; 
          const isMe = amIAdmin 
            ? msg.sender_role === 'admin' 
            : msg.sender_role === 'user'; 

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] space-y-1`}>
                <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'}`}>
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                </div>
                <p className={`text-[10px] ${isMe ? 'text-right text-slate-400' : 'text-left text-slate-400'}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSend} className="p-5 bg-white border-t border-slate-100">
        <div className="flex gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="মেসেজ লিখুন..." 
            className="flex-1 px-4 bg-transparent outline-none text-slate-800 placeholder-slate-400 font-medium" 
          />
          <button type="submit" disabled={!input.trim()} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 hover:shadow-lg active:scale-95">
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

const ApproveModal = ({ order, isOpen, onClose, onApprove }: { order: Order | null, isOpen: boolean, onClose: () => void, onApprove: (data: any) => void }) => {
  const [fbLink, setFbLink] = useState('');
  if (!isOpen || !order) return null;
  const isTopUp = order.serviceName === 'API ক্রেডিট রিচার্জ';
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApprove(isTopUp ? { adminFbLink: 'N/A', startDate: new Date().toISOString() } : { adminFbLink: fbLink });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
          <h3 className="font-bold text-xl">{isTopUp ? 'টপ-আপ কনফার্মেশন' : 'অর্ডার গ্রহণ করুন'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-sm text-slate-500 mb-1">অর্ডার সার্ভিস</p>
            <p className="font-bold text-slate-800 text-lg">{order.serviceName}</p>
            {isTopUp && <div className="mt-3 text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 inline-block">৳ {order.amount}</div>}
          </div>
          
          {!isTopUp && (
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">ফেসবুক প্রোফাইল লিংক (অ্যাডমিন)</label>
              <input type="text" required placeholder="https://facebook.com/..." value={fbLink} onChange={e => setFbLink(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white text-slate-900 font-medium" />
            </div>
          )}
          
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30">
            {isTopUp ? 'টপ-আপ কনফার্ম করুন' : 'লিংক পাঠান'}
          </button>
        </form>
      </div>
    </div>
  );
};

const ReviewModal = ({ order, isOpen, onClose, onAction }: { order: Order | null, isOpen: boolean, onClose: () => void, onAction: (action: 'activate' | 'request_info', data?: any) => void }) => {
  const [mode, setMode] = useState<'activate' | 'request_info'>('activate');
  const [deadline, setDeadline] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen || !order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'activate') onAction('activate', { completionDate: deadline, startDate: new Date().toISOString() });
    else onAction('request_info', { adminMessage: message });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
        <div className="bg-indigo-900 p-6 flex justify-between items-center text-white">
          <h3 className="font-bold text-xl">রিভিউ প্যানেল</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
        </div>
        
        <div className="p-6 bg-indigo-50/50 border-b border-indigo-100 max-h-64 overflow-y-auto">
           <div className="grid grid-cols-2 gap-3 text-sm">
             <div className="bg-white p-3 rounded-xl border border-indigo-100"><span className="text-xs text-indigo-400 font-bold uppercase block mb-1">Page Link</span><a href={order.clientPageLink} target="_blank" className="text-blue-600 font-bold hover:underline truncate block">{order.clientPageLink || 'N/A'}</a></div>
             <div className="bg-white p-3 rounded-xl border border-indigo-100"><span className="text-xs text-indigo-400 font-bold uppercase block mb-1">Doc Link</span><a href={order.clientDocLink} target="_blank" className="text-blue-600 font-bold hover:underline truncate block">{order.clientDocLink || 'N/A'}</a></div>
             <div className="bg-white p-3 rounded-xl border border-indigo-100"><span className="text-xs text-indigo-400 font-bold uppercase block mb-1">Email</span><span className="text-slate-800 font-medium block truncate">{order.clientEmail || 'N/A'}</span></div>
             <div className="bg-white p-3 rounded-xl border border-indigo-100"><span className="text-xs text-indigo-400 font-bold uppercase block mb-1">WhatsApp</span><span className="text-slate-800 font-medium block truncate">{order.clientWhatsapp || 'N/A'}</span></div>
             <div className="col-span-2 bg-white p-3 rounded-xl border border-indigo-100"><span className="text-xs text-indigo-400 font-bold uppercase block mb-1">Note</span><p className="text-slate-700">{order.clientRequirements || 'None'}</p></div>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl">
            <button type="button" onClick={() => setMode('activate')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${mode === 'activate' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>Activate</button>
            <button type="button" onClick={() => setMode('request_info')} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${mode === 'request_info' ? 'bg-white text-orange-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>Request Info</button>
          </div>

          {mode === 'activate' ? (
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">শেষ হওয়ার সময় (Deadline)</label>
              <input type="datetime-local" required value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 font-medium" />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">কি তথ্য প্রয়োজন?</label>
              <textarea rows={3} required placeholder="লিখুন..." value={message} onChange={e => setMessage(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white text-slate-900 font-medium" />
            </div>
          )}
          
          <button type="submit" className={`w-full text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl ${mode === 'activate' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-orange-600 hover:bg-orange-700'}`}>
            {mode === 'activate' ? 'সাবস্ক্রিপশন চালু করুন' : 'রিকোয়েস্ট পাঠান'}
          </button>
        </form>
      </div>
    </div>
  );
};

const ClientSubmissionForm = ({ order, onSubmit }: { order: Order, onSubmit: (data: any) => void }) => {
  const [docLink, setDocLink] = useState(order.clientDocLink || '');
  const [pageLink, setPageLink] = useState(order.clientPageLink || '');
  const [email, setEmail] = useState(order.clientEmail || '');
  const [whatsapp, setWhatsapp] = useState(order.clientWhatsapp || '');
  const [reqs, setReqs] = useState(order.clientRequirements || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (order.serviceName === 'API ক্রেডিট রিচার্জ') {
    return <div className="mt-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-8 text-white shadow-xl animate-fade-in-up"><h3 className="font-bold text-2xl mb-2 flex items-center gap-3"><Coins size={28} /> রিচার্জ সফল!</h3><p className="text-emerald-50 opacity-90 text-lg">আপনার রিচার্জ রিকোয়েস্টটি অ্যাডমিন অ্যাপ্রুভ করেছেন।</p></div>;
  }

  const handleSubmit = (e: React.FormEvent) => { 
    e.preventDefault(); 
    setIsSubmitting(true); 
    onSubmit({ clientDocLink: docLink, clientPageLink: pageLink, clientEmail: email, clientWhatsapp: whatsapp, clientRequirements: reqs, adminMessage: null }); 
  };

  const isResubmission = !!order.adminMessage;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isResubmission ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
          {isResubmission ? <AlertTriangle size={24}/> : <CheckCircle size={24}/>}
        </div>
        <div>
          <h3 className="font-bold text-xl text-slate-800">{isResubmission ? 'তথ্য আপডেট প্রয়োজন' : 'অর্ডার সেটআপ'}</h3>
          <p className="text-slate-500 text-sm">অ্যাক্টিভেশনের জন্য তথ্য দিন</p>
        </div>
      </div>
      
      {isResubmission && (
        <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 mb-8">
          <p className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-2">অ্যাডমিন মেসেজ</p>
          <p className="text-slate-800 font-medium">{order.adminMessage}</p>
        </div>
      )}

      {!isResubmission && (
        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 mb-8 flex items-start gap-4">
          <div className="bg-white p-2 rounded-lg text-blue-600 shadow-sm shrink-0"><LinkIcon size={20} /></div>
          <div>
            <p className="font-bold text-slate-800 mb-1">অ্যাডমিন প্রোফাইল লিংক</p>
            <a href={order.adminFbLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline break-all">{order.adminFbLink || 'Loading...'}</a>
            <p className="text-xs text-slate-500 mt-2">*এই আইডিতে পেজ এক্সেস দিন</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2"><label className="text-sm font-bold text-slate-700">পেজ লিংক / নাম</label><input type="text" required value={pageLink} onChange={e => setPageLink(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-900 font-medium" placeholder="facebook.com/page" /></div>
          <div className="space-y-2"><label className="text-sm font-bold text-slate-700">বিজনেস ডিটেইলস (Link)</label><input type="text" required value={docLink} onChange={e => setDocLink(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-900 font-medium" placeholder="Google Doc / Sheet Link" /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2"><label className="text-sm font-bold text-slate-700">ইমেইল</label><input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-900 font-medium" placeholder="name@email.com" /></div>
          <div className="space-y-2"><label className="text-sm font-bold text-slate-700">WhatsApp</label><input type="tel" required value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-900 font-medium" placeholder="017..." /></div>
        </div>
        <div className="space-y-2"><label className="text-sm font-bold text-slate-700">অন্যান্য তথ্য</label><textarea rows={3} value={reqs} onChange={e => setReqs(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-900 font-medium resize-none" placeholder="আপনার রিকোয়ারমেন্টস..." /></div>
        <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-500/30 flex items-center justify-center gap-3">
          {isSubmitting ? <Loader2 className="animate-spin" /> : <>{isResubmission ? 'আপডেট করুন' : 'সাবমিট করুন'} <Send size={20} /></>}
        </button>
      </form>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ onClose, onNavigateToPricing }) => {
  const { user, users, orders, logout, updateOrderStatus, updateOrderDetails, isLoading, messages, sendSupportMessage, markMessagesRead, siteSettings, updateSiteSettings, requestNotificationPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'profile' | 'support' | 'settings'>('profile');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedChatUser, setSelectedChatUser] = useState<User | null>(null);
  
  const [settingsFb, setSettingsFb] = useState(siteSettings.facebook);
  const [settingsYt, setSettingsYt] = useState(siteSettings.youtube);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => { if (user && user.role !== 'admin' && (activeTab === 'users' || activeTab === 'settings')) { setActiveTab('profile'); } }, [user, activeTab]);
  useEffect(() => { setSettingsFb(siteSettings.facebook); setSettingsYt(siteSettings.youtube); }, [siteSettings]);

  // Actions
  const handleApproveClick = (order: Order) => { setSelectedOrder(order); setIsApproveModalOpen(true); };
  const confirmApprove = async (data: { adminFbLink: string, startDate?: string }) => { if (!selectedOrder) return; await updateOrderStatus(selectedOrder.id, 'approved'); const updates: any = { adminFbLink: data.adminFbLink }; if (data.startDate) updates.startDate = data.startDate; await updateOrderDetails(selectedOrder.id, updates); setIsApproveModalOpen(false); setSelectedOrder(null); };
  const handleReviewClick = (order: Order) => { setSelectedOrder(order); setIsReviewModalOpen(true); };
  const confirmReviewAction = async (action: 'activate' | 'request_info', data: any) => { if (!selectedOrder) return; if (action === 'activate') { await updateOrderDetails(selectedOrder.id, { completionDate: data.completionDate, startDate: data.startDate, adminMessage: null }); } else { await updateOrderDetails(selectedOrder.id, { adminMessage: data.adminMessage, isDetailsSubmitted: false }); } setIsReviewModalOpen(false); setSelectedOrder(null); };
  const handleReject = async (orderId: string) => { if (confirm('Reject this order?')) { await updateOrderStatus(orderId, 'rejected'); } };
  const handleComplete = async (orderId: string) => { if (confirm('Mark as Completed?')) { await updateOrderStatus(orderId, 'completed'); } };
  const handleClientSubmit = async (data: any) => { const pendingOrder = orders.find(o => o.status === 'approved' && (!o.isDetailsSubmitted || !!o.adminMessage) && !o.startDate); if (pendingOrder) { await updateOrderDetails(pendingOrder.id, { ...data, isDetailsSubmitted: true, adminMessage: null }); } };
  const handleSaveSettings = async () => { setIsSavingSettings(true); const success = await updateSiteSettings({ facebook: settingsFb, youtube: settingsYt }); setIsSavingSettings(false); if (success) alert("Saved!"); };

  const handleTestNotification = async () => {
    const granted = await requestNotificationPermission();
    if (!granted) {
      alert("ব্রাউজার থেকে নোটিফিকেশন ব্লক করা হয়েছে। দয়া করে এড্রেস বারের তালা আইকনে ক্লিক করে 'Reset Permission' দিন।");
    }
  };

  const uniqueChatUserIds = Array.from(new Set(messages.map(m => m.user_id)));
  const chatUsers = users.filter(u => uniqueChatUserIds.includes(u.id));
  const unreadCounts = chatUsers.reduce<Record<string, number>>((acc, u) => { acc[u.id] = messages.filter(m => m.user_id === u.id && m.sender_role === 'user' && !m.is_read).length; return acc; }, {});
  const totalUnreadCount = (Object.values(unreadCounts) as number[]).reduce((a, b) => a + b, 0);
  
  // Calculate Pending Order Count for Sidebar
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  const handleSelectChat = (u: User) => { setSelectedChatUser(u); markMessagesRead(u.id); };
  const handleSendMessage = (text: string) => { if (user?.role === 'admin' && selectedChatUser) { sendSupportMessage(text, selectedChatUser.id); } else if (user?.role === 'user') { sendSupportMessage(text); } };

  // Improved Filter Logic: Matches User OR User's Order ID/TrxID
  const filteredUsers = users?.filter(u => {
    const term = searchTerm.toLowerCase();
    const userMatch = (u.name || '').toLowerCase().includes(term) || 
                      (u.email || '').toLowerCase().includes(term) || 
                      (u.phone || '').includes(term);
    
    // Also check if this user has any order matching the search term
    const orderMatch = orders.some(o => o.userId === u.id && (o.id.includes(term) || o.trxId.toLowerCase().includes(term)));
    
    return userMatch || orderMatch;
  });

  // Automatically select user if searching by Order ID leads to a single user
  useEffect(() => { 
    if (searchTerm && user?.role === 'admin' && filteredUsers.length === 1 && !selectedUser) { 
        // Optional: Auto-select can be jarring if user is typing, better to let them click 'Manage'
        // But the requirement implies easy finding.
        // For now, the filtered list shows the right user, which is the standard behavior.
    } 
  }, [searchTerm, filteredUsers, selectedUser, user]);
  
  // Admin View: If searching, filter orders list too
  const userOrders = selectedUser 
    ? orders.filter(o => {
        const matchesUser = o.userId === selectedUser.id;
        const term = searchTerm.toLowerCase();
        // If there is a search term, only show matching orders, otherwise show all
        const matchesSearch = !searchTerm || (o.id.includes(term) || o.trxId.toLowerCase().includes(term));
        return matchesUser && matchesSearch;
      }) 
    : [];

  const myOrders = orders.filter(o => o.userId === user?.id);
  const orderNeedingAction = myOrders.find(o => o.status === 'approved' && (!o.isDetailsSubmitted || !!o.adminMessage) && !o.startDate);
  
  const isPlanActive = (startDateStr: string | undefined, packageDetails: string) => { 
    if (!startDateStr) return { active: false, daysLeft: 0, duration: 0 };
    const startDate = new Date(startDateStr); 
    const now = new Date(); 
    const diffTime = Math.abs(now.getTime() - startDate.getTime()); 
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    const details = packageDetails || '';
    const isTrial = details.toLowerCase().includes('trial') || details.includes('ট্রায়াল');
    const duration = isTrial ? 7 : 30;
    return { active: diffDays <= duration, daysLeft: Math.max(0, duration - diffDays), duration };
  };
  const activeSubscriptions = myOrders.map(o => ({...o, planStatus: isPlanActive(o.startDate, o.packageDetails)})).filter(o => (o.status === 'approved' || o.status === 'completed') && o.planStatus.active && o.serviceName !== 'API ক্রেডিট রিচার্জ');

  const renderStatusBadge = (order: Order) => {
    switch (order.status) {
      case 'pending': return <span className="px-4 py-1.5 bg-amber-50 text-amber-600 text-xs font-bold rounded-full uppercase tracking-wider border border-amber-100 flex items-center w-fit gap-1"><Clock size={12}/> Pending</span>;
      case 'approved': 
        if (order.startDate) return <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full uppercase tracking-wider flex items-center w-fit gap-1 border border-emerald-100"><CheckCircle size={12}/> Active</span>;
        if (order.isDetailsSubmitted) return <span className="px-4 py-1.5 bg-purple-50 text-purple-600 text-xs font-bold rounded-full uppercase tracking-wider border border-purple-100 flex items-center w-fit gap-1"><Search size={12}/> In Review</span>;
        return <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider flex items-center w-fit gap-1 border border-blue-100"><Loader2 size={12} className="animate-spin"/> Processing</span>;
      case 'completed': return <span className="px-4 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider flex items-center w-fit gap-1 border border-slate-200"><CheckCircle size={12}/> Completed</span>;
      case 'rejected': return <span className="px-4 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-full uppercase tracking-wider border border-red-100 flex items-center w-fit gap-1"><XCircle size={12}/> Rejected</span>;
      default: return null;
    }
  };

  const NavButton = ({ id, icon: Icon, label, badge }: any) => (
    <button onClick={() => { setActiveTab(id); setSelectedUser(null); setSelectedChatUser(null); }} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm mb-1 ${activeTab === id ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}>
      <Icon size={18} /> {label} {badge > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>}
    </button>
  );

  const SERVER_CODE = `import { serve } from "https://deno.land/std@0.168.0/http/server.ts"; import { createClient } from "https://esm.sh/@supabase/supabase-js@2"; serve(async (req) => { return new Response(JSON.stringify({ message: "SupaBot Active" }), { status: 200, headers: { 'Content-Type': 'application/json' } }); });`;
  const DEPLOY_COMMAND = `npx supabase functions deploy supa-bot-core --project-ref dyqxsqpdomfsfcgtrhmh`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex overflow-hidden font-sans">
      {/* Sidebar - SaaS Style */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col shrink-0 z-20 shadow-xl shadow-slate-200/50 hidden md:flex">
        <div className="p-8 pb-0">
          <Logo className="text-2xl" />
          <p className="text-xs text-slate-400 mt-2 font-medium tracking-wide uppercase">{user?.role === 'admin' ? 'Admin Workspace' : 'Client Portal'}</p>
        </div>
        <div className="p-6 space-y-1 mt-6 flex-1">
          {user?.role === 'admin' ? (
            <>
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Management</p>
              <NavButton id="users" icon={Users} label="Users & Orders" badge={pendingOrdersCount} />
              <NavButton id="support" icon={MessageCircle} label="Inbox" badge={totalUnreadCount} />
              <NavButton id="settings" icon={Settings} label="System Settings" />
            </>
          ) : (
            <>
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Menu</p>
              <NavButton id="profile" icon={LayoutDashboard} label="Dashboard" />
              <NavButton id="support" icon={MessageCircle} label="Support Chat" />
            </>
          )}
        </div>
        <div className="p-6 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4 px-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
              {(user?.name || 'U').charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-800 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 font-bold text-xs transition-colors justify-center uppercase tracking-wide border border-red-100 hover:border-red-200">Sign Out</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-100 p-4 flex justify-between items-center shadow-sm z-30">
          <Logo />
          <div className="flex gap-4">
             <button onClick={onClose}><X size={24} className="text-slate-400"/></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-12 scrollbar-thin scrollbar-thumb-slate-200">
          <div className="max-w-6xl mx-auto">
            {/* Header Area */}
            <div className="flex justify-between items-end mb-10">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {activeTab === 'users' ? 'User Management' : activeTab === 'support' ? 'Messages' : activeTab === 'settings' ? 'Settings' : `Welcome back, ${(user?.name || 'User').split(' ')[0]}`}
                </h1>
                <p className="text-slate-500 mt-1">Manage your automation services and account.</p>
              </div>
              <button onClick={onClose} className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 transition-all hover:shadow-md">
                <LogOut size={14} className="rotate-180" /> Exit Dashboard
              </button>
            </div>

            {/* USER PROFILE VIEW */}
            {activeTab === 'profile' && user?.role === 'user' && (
              <div className="space-y-10 animate-fade-in-up">
                {activeSubscriptions.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeSubscriptions.map(sub => (
                      <div key={sub.id} className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-6">
                            <span className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider text-blue-200">Active Plan</span>
                            <Zap className="text-yellow-400 fill-yellow-400" size={24} />
                          </div>
                          <h2 className="text-3xl font-bold text-white mb-2">{sub.serviceName}</h2>
                          <p className="text-slate-400 text-sm mb-8 line-clamp-1">{sub.packageDetails}</p>
                          <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                            <div>
                              <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Time Left</p>
                              <p className="text-xl font-bold font-mono">{sub.planStatus.daysLeft} Days</p>
                            </div>
                            <div className="h-8 w-px bg-white/10"></div>
                            <div>
                              <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Status</p>
                              <p className="text-emerald-400 font-bold flex items-center gap-1"><CheckCircle size={14}/> Active</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {orderNeedingAction && <ClientSubmissionForm order={orderNeedingAction} onSubmit={handleClientSubmit} />}
                
                {!orderNeedingAction && myOrders.some(o => o.status === 'approved' && o.isDetailsSubmitted && !o.startDate && !o.adminMessage) && (
                   <div className="bg-white border-l-4 border-purple-500 rounded-2xl p-6 shadow-sm flex items-start gap-4">
                      <div className="bg-purple-100 p-3 rounded-full text-purple-600"><Clock size={24}/></div>
                      <div><h3 className="text-lg font-bold text-slate-800">রিভিউ চলছে</h3><p className="text-slate-500">আপনার সাবমিট করা তথ্য অ্যাডমিন রিভিউ করছেন।</p></div>
                   </div>
                )}

                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Clock className="text-slate-400"/> Recent Orders</h2>
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                        <tr><th className="px-8 py-5">Order Info</th><th className="px-8 py-5">Status</th><th className="px-8 py-5 text-right">Amount</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {myOrders.map(order => (
                          <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-5">
                              <p className="font-bold text-slate-800">{order.serviceName}</p>
                              <p className="text-xs text-slate-400 font-mono mt-1">#{order.id.slice(-6)}</p>
                            </td>
                            <td className="px-8 py-5">{renderStatusBadge(order)}</td>
                            <td className="px-8 py-5 text-right font-bold text-slate-700 font-mono">{order.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {myOrders.length === 0 && <div className="p-12 text-center text-slate-400"><Package size={48} className="mx-auto mb-4 opacity-20"/><p>No orders yet</p></div>}
                  </div>
                </div>
              </div>
            )}

            {/* ADMIN USERS VIEW */}
            {activeTab === 'users' && user?.role === 'admin' && (
              <div className="space-y-6 animate-fade-in-up">
                {!selectedUser ? (
                  <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
                        <input type="text" placeholder="Search by name, email, phone or Order ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium placeholder-slate-400" />
                      </div>
                    </div>
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                        <tr><th className="px-8 py-5">User</th><th className="px-8 py-5">Contact</th><th className="px-8 py-5 text-right">Action</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredUsers?.map((u) => {
                          const userPendingCount = orders.filter(o => o.userId === u.id && o.status === 'pending').length;
                          const userTotalOrders = orders.filter(o => o.userId === u.id).length;
                          
                          return (
                            <tr key={u.id} className="hover:bg-blue-50/30 transition-colors">
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">{(u.name || '?').charAt(0)}</div>
                                  <div><p className="font-bold text-slate-800">{u.name || 'Unknown'}</p><p className="text-xs text-slate-500">{u.email}</p></div>
                                </div>
                              </td>
                              <td className="px-8 py-5 font-mono text-slate-600 text-sm">{u.phone}</td>
                              <td className="px-8 py-5 text-right">
                                <div className="flex items-center justify-end gap-3">
                                  {userPendingCount > 0 && <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-md">{userPendingCount} New</span>}
                                  {userTotalOrders > 0 && <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md">{userTotalOrders} Orders</span>}
                                  <button onClick={() => setSelectedUser(u)} className="text-blue-600 font-bold text-xs bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">Manage</button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div>
                    <button onClick={() => setSelectedUser(null)} className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm"><ArrowLeft size={16}/> Back to Users</button>
                    <div className="grid grid-cols-1 gap-6">
                      {userOrders.map(order => (
                        <div key={order.id} className={`bg-white rounded-3xl border p-8 shadow-sm relative overflow-hidden ${order.status === 'pending' ? 'border-amber-400 border-l-8' : 'border-slate-200'}`}>
                          {order.status === 'pending' && <span className="absolute top-4 right-4 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">New Order</span>}
                          <div className="flex justify-between items-start mb-8">
                            <div>
                              <h3 className="font-bold text-xl text-slate-900">{order.serviceName}</h3>
                              <p className="text-slate-500 text-sm mt-1">{order.packageDetails}</p>
                              {/* Order ID with Copy Button */}
                              <div className="mt-2 flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-lg w-fit">
                                <span className="text-xs font-mono text-slate-600 font-bold">ID: {order.id}</span>
                                <CopyButton text={order.id} />
                              </div>
                            </div>
                            {renderStatusBadge(order)}
                          </div>
                          
                          {/* UPDATED ADMIN CARD VIEW TO SHOW DETAILS */}
                          {order.isDetailsSubmitted && (
                             <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl mb-6 text-sm">
                               <p className="text-xs font-bold text-indigo-500 uppercase tracking-wide mb-3">Client Submission</p>
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                 <div><span className="block text-xs text-slate-500">Page Link</span><a href={order.clientPageLink} className="text-blue-600 font-bold hover:underline">{order.clientPageLink || '-'}</a></div>
                                 <div><span className="block text-xs text-slate-500">Doc Link</span><a href={order.clientDocLink} className="text-blue-600 font-bold hover:underline">{order.clientDocLink || '-'}</a></div>
                                 <div><span className="block text-xs text-slate-500">Email</span><span className="text-slate-800 font-medium">{order.clientEmail || '-'}</span></div>
                                 <div><span className="block text-xs text-slate-500">WhatsApp</span><span className="text-slate-800 font-medium">{order.clientWhatsapp || '-'}</span></div>
                               </div>
                             </div>
                          )}

                          <div className="bg-slate-50 rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 border border-slate-100">
                            <div><p className="text-xs font-bold text-slate-400 uppercase mb-1">Amount</p><p className="text-lg font-bold text-slate-900">{order.amount}</p></div>
                            <div><p className="text-xs font-bold text-slate-400 uppercase mb-1">TrxID</p><p className="text-lg font-mono text-slate-900">{order.trxId}</p></div>
                            <div><p className="text-xs font-bold text-slate-400 uppercase mb-1">Sender</p><p className="text-lg font-mono text-slate-900">{order.senderPhone}</p></div>
                            <div><p className="text-xs font-bold text-slate-400 uppercase mb-1">Date</p><p className="text-lg text-slate-900">{new Date(order.date).toLocaleDateString()}</p></div>
                          </div>
                          <div className="flex flex-wrap gap-3 justify-end">
                            {order.status === 'pending' && <><button onClick={() => handleReject(order.id)} className="px-6 py-3 rounded-xl font-bold text-red-600 bg-red-50 hover:bg-red-100">Reject</button><button onClick={() => handleApproveClick(order)} className="px-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg">Approve & Send Link</button></>}
                            {order.status === 'approved' && !order.startDate && <div className="w-full flex justify-between items-center">{!order.isDetailsSubmitted ? <span className="text-orange-600 font-bold text-sm bg-orange-50 px-4 py-2 rounded-lg border border-orange-100 animate-pulse">Waiting for Client Submission...</span> : <button onClick={() => handleReviewClick(order)} className="px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg flex items-center gap-2 ml-auto"><FileText size={18}/> Review Client Details</button>}</div>}
                            {(order.startDate || order.status === 'completed') && order.status !== 'completed' && <button onClick={() => handleComplete(order.id)} className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200">Archive Order</button>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ADMIN SETTINGS VIEW */}
            {activeTab === 'settings' && user?.role === 'admin' && (
              <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
                
                {/* NEW: Notification Test Section */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl border border-indigo-100 p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-4 text-indigo-900">
                    <BellRing size={24} />
                    <h3 className="font-bold text-xl">Notifications & Sound</h3>
                  </div>
                  <p className="text-sm text-indigo-700 mb-6 leading-relaxed">
                    ব্রাউজার থেকে সাউন্ড এবং নোটিফিকেশন পেতে অনুমতি প্রয়োজন। নিচের বাটনে ক্লিক করে টেস্ট করুন।
                  </p>
                  <button 
                    onClick={handleTestNotification}
                    className="flex items-center gap-2 bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                  >
                    <BellRing size={18} /> টেস্ট করুন (Test Sound)
                  </button>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                  <h3 className="font-bold text-xl text-slate-900 mb-6">Social Links</h3>
                  <div className="space-y-5">
                    <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Facebook Page</label><input type="text" value={settingsFb} onChange={e => setSettingsFb(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium" /></div>
                    <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">YouTube Channel</label><input type="text" value={settingsYt} onChange={e => setSettingsYt(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium" /></div>
                    <button onClick={handleSaveSettings} disabled={isSavingSettings} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg flex justify-center">{isSavingSettings ? <Loader2 className="animate-spin" /> : 'Save Changes'}</button>
                  </div>
                </div>
                <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl">
                  <div className="flex items-center gap-3 mb-6"><Terminal className="text-emerald-400"/><h3 className="font-bold text-xl text-white">Deployment Helper</h3></div>
                  <div className="space-y-6">
                    <div><label className="text-slate-400 text-xs font-bold uppercase mb-2 block">1. File Content (index.ts)</label><div className="relative"><pre className="bg-slate-950 p-4 rounded-xl text-xs text-slate-300 font-mono overflow-x-auto border border-slate-800 h-32">{SERVER_CODE}</pre><button onClick={() => navigator.clipboard.writeText(SERVER_CODE)} className="absolute top-2 right-2 p-2 bg-slate-800 rounded hover:text-white"><Copy size={14}/></button></div></div>
                    <div><label className="text-slate-400 text-xs font-bold uppercase mb-2 block">2. Deploy Command</label><div className="flex gap-2"><code className="flex-1 bg-slate-950 p-4 rounded-xl text-sm text-emerald-400 font-mono border border-slate-800">{DEPLOY_COMMAND}</code><button onClick={() => navigator.clipboard.writeText(DEPLOY_COMMAND)} className="px-6 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500">Copy</button></div></div>
                  </div>
                </div>
              </div>
            )}

            {/* MESSAGES VIEW */}
            {activeTab === 'support' && (
              <div className="h-[700px] animate-fade-in-up">
                {user?.role === 'admin' && !selectedChatUser ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {chatUsers.map(u => (
                      <div key={u.id} onClick={() => handleSelectChat(u)} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">{(u.name || '?').charAt(0)}</div>
                          {(unreadCounts[u.id] || 0) > 0 && <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">{unreadCounts[u.id]} New</span>}
                        </div>
                        <h4 className="font-bold text-slate-800 text-lg mb-1">{u.name}</h4>
                        <p className="text-slate-500 text-sm mb-4">{u.email}</p>
                        <span className="text-blue-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">Chat Now <ArrowRight size={16}/></span>
                      </div>
                    ))}
                    {chatUsers.length === 0 && <div className="col-span-full text-center py-20 text-slate-400"><MessageCircle size={48} className="mx-auto mb-4 opacity-30"/><p>No messages yet.</p></div>}
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto h-full flex flex-col">
                    {user?.role === 'admin' && <button onClick={() => setSelectedChatUser(null)} className="mb-4 text-slate-500 hover:text-slate-900 font-bold flex items-center gap-2 text-sm"><ArrowLeft size={18}/> Back to Inbox</button>}
                    <ChatInterface 
                      messages={user?.role === 'admin' ? messages.filter(m => m.user_id === selectedChatUser?.id) : messages} 
                      currentUserId={user?.id || ''} 
                      onSend={handleSendMessage} 
                      targetUser={user?.role === 'admin' ? selectedChatUser! : undefined} 
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <ApproveModal isOpen={isApproveModalOpen} onClose={() => setIsApproveModalOpen(false)} order={selectedOrder} onApprove={confirmApprove} />
      <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} order={selectedOrder} onAction={confirmReviewAction} />
    </div>
  );
};

export default Dashboard;