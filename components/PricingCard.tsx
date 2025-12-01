import React from 'react';
import { PricingPackage } from '../types';
import { Check, Clock, ShieldCheck, Zap, Info, Server } from 'lucide-react';

interface PricingCardProps {
  pkg: PricingPackage;
  onOrder: (pkg: PricingPackage) => void;
  onViewDetails: (pkgId: string) => void;
}

const PricingCard: React.FC<PricingCardProps> = ({ pkg, onOrder, onViewDetails }) => {
  return (
    <div className={`flex flex-col h-full bg-white rounded-3xl border transition-all duration-300 hover:shadow-2xl ${pkg.recommended ? 'border-blue-500 shadow-xl relative scale-105 z-10' : 'border-slate-200 hover:border-slate-300'}`}>
      {pkg.recommended && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md z-10">
          জনপ্রিয় চয়েস
        </div>
      )}

      {/* Header */}
      <div className={`p-8 border-b border-slate-100 ${pkg.recommended ? 'bg-blue-50/30' : 'bg-slate-50/50'} rounded-t-3xl`}>
        <h3 className="text-xl font-bold text-slate-900">{pkg.serviceName}</h3>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">{pkg.description}</p>
      </div>

      {/* Pricing Options */}
      <div className="p-8 space-y-5">
        {/* Monthly Option or API Info */}
        {!pkg.hideMonthlyOption ? (
          <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={14} /> মাসিক প্যাকেজ
              </span>
              {!pkg.monthlyVariants && (
                <span className="text-2xl font-bold text-slate-800">{pkg.monthlyPrice}</span>
              )}
            </div>
            
            {pkg.monthlyVariants ? (
              <div className="space-y-3 mt-2">
                {pkg.monthlyVariants.map((variant, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                    <span className="text-slate-700 font-medium">{variant.name}</span>
                    <span className="font-bold text-slate-900">{variant.price}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100 shadow-sm">
             <div className="flex items-center gap-2 mb-2 text-emerald-800 font-bold text-sm uppercase tracking-wide">
               <Server size={16} />
               <span>API বিলিং সিস্টেম</span>
             </div>
             <p className="text-xs text-emerald-700 leading-relaxed">
               কোনো মাসিক চার্জ নেই। শুধুমাত্র প্ল্যাটফর্ম চার্জ ($৭/মাস) প্রযোজ্য।
               <span className="block mt-2 font-bold bg-white px-2 py-1 rounded w-fit border border-emerald-200">🎁 ১ম মাস ফ্রি!</span>
             </p>
          </div>
        )}

        {/* One-Time Option */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 hover:border-slate-300 transition-colors">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Zap size={14} /> এককালীন প্যাকেজ
            </span>
            <span className="text-2xl font-bold text-slate-800">{pkg.oneTimePrice}</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="px-8 pb-8 flex-1">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">ফিচারসমূহ</h4>
        <ul className="space-y-4">
          {pkg.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="bg-green-100 rounded-full p-0.5 mt-0.5 shrink-0">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-sm text-slate-600 font-medium">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="p-8 pt-0 flex gap-3 mt-auto">
        <button 
          onClick={() => onViewDetails(pkg.id)}
          className="flex-1 py-3.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Info size={16} /> বিস্তারিত
        </button>
        <button 
          onClick={() => onOrder(pkg)}
          className={`flex-[1.5] py-3.5 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl text-white ${pkg.recommended ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' : 'bg-slate-800 hover:bg-slate-900'}`}
        >
          অর্ডার করুন
        </button>
      </div>
    </div>
  );
};

export default PricingCard;