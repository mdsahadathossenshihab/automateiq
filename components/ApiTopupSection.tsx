import React, { useState } from 'react';
import { Coins, Zap, ShieldCheck, AlertCircle, Wallet } from 'lucide-react';

interface ApiTopupSectionProps {
  onOrder: (amount: number) => void;
  onViewDetails: () => void;
}

const ApiTopupSection: React.FC<ApiTopupSectionProps> = ({ onOrder, onViewDetails }) => {
  const [amount, setAmount] = useState<string>('200');
  const [error, setError] = useState<string>('');

  const QUICK_AMOUNTS = [200, 500, 1000, 2500];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAmount(val);
    
    const num = parseInt(val);
    if (!val) {
      setError('');
      return;
    }
    
    if (isNaN(num)) {
      setError('অনুগ্রহ করে সংখ্যা লিখুন');
    } else if (num < 200) {
      setError('মিনিমাম রিচার্জ ২০০ টাকা');
    } else if (num % 10 !== 0) {
      setError('টাকার পরিমাণ ১০ এর গুণিতক হতে হবে');
    } else {
      setError('');
    }
  };

  const handleSubmit = () => {
    const num = parseInt(amount);
    if (!num || num < 200 || num % 10 !== 0) {
      setError('সঠিক পরিমাণ লিখুন (মিনিমাম ২০০, ১০ এর গুণিতক)');
      return;
    }
    onOrder(num);
  };

  return (
    <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row">
        
        {/* Left Info Side */}
        <div className="p-10 lg:p-16 lg:w-1/2 flex flex-col justify-center text-white z-10 relative">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8 w-fit backdrop-blur-md">
            <Zap size={14} /> Instant Top-up
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            API ক্রেডিট <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">ওয়ালেট</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-md">
            আপনার চ্যাটবটের নিরবচ্ছিন্ন সেবার জন্য প্রয়োজন অনুযায়ী ব্যালেন্স লোড করুন। কোনো মেয়াদ নেই।
          </p>
          
          <div className="space-y-6 mb-10">
            <div className="flex items-center gap-4 group">
              <div className="bg-slate-800 p-3 rounded-xl group-hover:bg-emerald-900/50 transition-colors">
                <ShieldCheck size={24} className="text-emerald-400"/>
              </div>
              <div>
                <h4 className="font-bold text-white">লাইফটাইম ভ্যালিডিটি</h4>
                <p className="text-sm text-slate-400">ব্যালেন্সের কোনো মেয়াদ নেই</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="bg-slate-800 p-3 rounded-xl group-hover:bg-blue-900/50 transition-colors">
                <Coins size={24} className="text-blue-400"/>
              </div>
              <div>
                <h4 className="font-bold text-white">Pay As You Go</h4>
                <p className="text-sm text-slate-400">যতটুকু ব্যবহার ততটুকু খরচ</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onViewDetails}
            className="text-white/70 hover:text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2 transition-colors w-fit border-b border-transparent hover:border-white/50 pb-0.5"
          >
            বিস্তারিত ও খরচ দেখুন
          </button>
        </div>

        {/* Right Input Side (Wallet Style) */}
        <div className="lg:w-1/2 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 p-10 lg:p-16 flex flex-col justify-center z-10">
          
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
            <div className="flex items-center gap-2 mb-6 text-slate-800">
              <Wallet className="text-emerald-600" />
              <h3 className="font-bold text-lg">রিচার্জ এমাউন্ট</h3>
            </div>
            
            <div className="relative mb-3">
              <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-slate-400">৳</span>
              <input 
                type="number" 
                value={amount}
                onChange={handleAmountChange}
                placeholder="200"
                className={`w-full pl-12 pr-6 py-5 text-4xl font-bold text-slate-800 bg-slate-50 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-100'}`}
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-xs font-bold flex items-center gap-1 mb-6 animate-pulse bg-red-50 p-2 rounded-lg">
                <AlertCircle size={14} /> {error}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-8 mt-4">
              {QUICK_AMOUNTS.map(amt => (
                <button
                  key={amt}
                  onClick={() => { setAmount(amt.toString()); setError(''); }}
                  className="px-4 py-2 bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-lg text-sm font-bold transition-all active:scale-95"
                >
                  ৳{amt}
                </button>
              ))}
            </div>

            <button 
              onClick={handleSubmit}
              className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-1 active:translate-y-0 text-lg flex justify-center items-center gap-2"
            >
              <Zap size={20} className="fill-white" /> রিচার্জ করুন
            </button>
            
            <p className="text-center text-xs text-slate-400 mt-6 font-medium">
              সিকিউর পেমেন্ট: বিকাশ / নগদ (পার্সোনাল)
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ApiTopupSection;