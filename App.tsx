import React, { useState, useRef, useEffect } from 'react';
import { SERVICES, PRICING_PACKAGES, SERVICE_DETAILS, CONTACT_INFO, API_TOPUP_PACKAGE, META_PIXEL_ID } from './constants';
import ServiceCard from './components/ServiceCard';
import PricingCard from './components/PricingCard';
import ChatAssistant from './components/ChatAssistant';
import OrderModal from './components/OrderModal';
import ServiceDetailModal from './components/ServiceDetailModal';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import ApiTopupSection from './components/ApiTopupSection';
import Logo from './components/Logo';
import { AuthProvider, useAuth } from './AuthContext';
import { PricingPackage, ServiceDetailContent } from './types';
import { Facebook, Youtube, Mail, Phone, ExternalLink, LayoutDashboard, LogIn, Loader2, Coins, Send, CheckCircle2, ArrowRight, X, Menu, ChevronRight } from 'lucide-react';
import { X as LucideX } from 'lucide-react';

// Wrapper component to use Auth Hook
const MainContent: React.FC = () => {
  const { user, isLoading, sendSupportMessage, siteSettings } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Contact Form States
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [isSendingMsg, setIsSendingMsg] = useState(false);
  
  const [selectedPackage, setSelectedPackage] = useState<PricingPackage | null>(null);
  const [selectedDetailContent, setSelectedDetailContent] = useState<ServiceDetailContent | null>(null);

  const pricingSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!user) {
      setIsDashboardOpen(false);
    }
  }, [user]);

  // --- Meta Pixel Tracking (Navigation Only) ---
  useEffect(() => {
    // Note: Initial PageView is handled in index.html to ensure 100% detection.
    // We only track subsequent navigation changes here.
    
    const handleHashChange = () => {
      if ((window as any).fbq) {
        (window as any).fbq('track', 'PageView');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLoginClick = () => {
    setSelectedPackage(null);
    setIsAuthModalOpen(true);
  };

  const handleOrderClick = (pkg: PricingPackage) => {
    if (!user) {
      setSelectedPackage(pkg);
      setIsAuthModalOpen(true);
    } else {
      setSelectedPackage(pkg);
      setIsOrderModalOpen(true);
    }
  };

  const handleCustomApiOrder = (amount: number) => {
    const customPkg: PricingPackage = {
      ...API_TOPUP_PACKAGE,
      oneTimePrice: `৳${amount}`,
      features: [
        `Recharge Amount: ৳${amount}`,
        ...API_TOPUP_PACKAGE.features
      ]
    };
    handleOrderClick(customPkg);
  };

  const handleAuthSuccess = () => {
    if (selectedPackage) {
       setIsOrderModalOpen(true);
    } else {
       setIsDashboardOpen(true);
    }
  };

  const handleOrderSuccess = () => {
    setIsOrderModalOpen(false);
    setIsDashboardOpen(true);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMsg.trim()) return;

    if (!user) {
      alert("দুঃখিত, আমাদের সাপোর্ট টিমের সাথে কথা বলতে এবং রিপ্লাই পেতে অনুগ্রহ করে লগইন করুন।");
      setIsAuthModalOpen(true);
      return;
    }

    setIsSendingMsg(true);
    const fullMessage = `Name: ${contactName}, Phone: ${contactPhone}\n\nMessage: ${contactMsg}`;
    
    const success = await sendSupportMessage(fullMessage);
    
    if (success) {
      // Pixel Track Contact
      try {
        if ((window as any).fbq) {
          (window as any).fbq('track', 'Contact');
        }
      } catch (e) {}

      alert("আপনার মেসেজটি সফলভাবে পাঠানো হয়েছে! উত্তরের জন্য ড্যাশবোর্ড চেক করুন।");
      setContactMsg('');
      setContactName('');
      setContactPhone('');
      setIsDashboardOpen(true);
    } else {
      alert("মেসেজ পাঠাতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
    }
    setIsSendingMsg(false);
  };

  const handleViewDetails = (pkgId: string) => {
    const content = SERVICE_DETAILS[pkgId] || SERVICE_DETAILS['default'];
    if (!SERVICE_DETAILS[pkgId]) {
      const pkg = PRICING_PACKAGES.find(p => p.id === pkgId) || (API_TOPUP_PACKAGE.id === pkgId ? API_TOPUP_PACKAGE : null);
      if (pkg) {
         setSelectedDetailContent({
           ...content,
           title: pkg.serviceName
         });
      }
    } else {
      setSelectedDetailContent(content);
    }
    setIsDetailModalOpen(true);
  };
  
  const handleNavigateToPricing = () => {
    setIsDashboardOpen(false);
    setTimeout(() => {
        pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
        <p className="text-blue-200 font-medium tracking-widest uppercase text-sm">Initializing...</p>
      </div>
    );
  }

  if (isDashboardOpen && user) {
    return <Dashboard onClose={() => setIsDashboardOpen(false)} onNavigateToPricing={handleNavigateToPricing} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 scroll-smooth selection:bg-blue-600 selection:text-white">
      {/* Premium Navbar */}
      <nav className="fixed w-full z-40 bg-white/80 backdrop-blur-lg border-b border-slate-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <a href="#" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
              <Logo className="text-3xl" />
            </a>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              {['Home', 'Services', 'Pricing', 'Contact'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="text-slate-600 hover:text-blue-600 font-semibold transition-colors text-sm uppercase tracking-wide relative group"
                >
                  {item === 'Pricing' ? 'প্যাকেজ' : item === 'Services' ? 'সার্ভিসসমূহ' : item === 'Contact' ? 'যোগাযোগ' : 'হোম'}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                </a>
              ))}
              
              <a href="#api-credit" className="text-emerald-600 font-bold transition-colors text-sm uppercase tracking-wide flex items-center gap-1 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 hover:border-emerald-300">
                <Coins size={16} /> API ক্রেডিট
              </a>
              
              {user ? (
                <button 
                  onClick={() => setIsDashboardOpen(true)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full transition-all font-medium shadow-lg hover:shadow-slate-500/30 transform hover:-translate-y-0.5"
                >
                  <LayoutDashboard size={18} /> ড্যাশবোর্ড
                </button>
              ) : (
                <button 
                  onClick={handleLoginClick}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-blue-500/30 font-medium transform hover:-translate-y-0.5"
                >
                  <LogIn size={18} /> লগইন
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="text-slate-800 hover:text-blue-600 p-2 transition-colors"
              >
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Modern Sliding Mobile Menu */}
      <div className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
        <div className={`absolute top-0 right-0 w-80 h-full bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <Logo className="text-2xl" />
            <button onClick={() => setMobileMenuOpen(false)} className="text-slate-500 hover:text-red-500 transition-colors bg-slate-50 p-2 rounded-full"><LucideX size={24} /></button>
          </div>
          <div className="p-6 flex flex-col space-y-4 flex-1 overflow-y-auto">
            {['Home', 'Services', 'Pricing', 'Contact'].map((item) => (
              <a 
                key={item}
                onClick={() => setMobileMenuOpen(false)} 
                href={`#${item.toLowerCase()}`} 
                className="flex items-center justify-between text-lg font-bold text-slate-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-xl transition-all"
              >
                {item === 'Pricing' ? 'প্যাকেজ' : item === 'Services' ? 'সার্ভিসসমূহ' : item === 'Contact' ? 'যোগাযোগ' : 'হোম'}
                <ChevronRight size={18} className="opacity-50"/>
              </a>
            ))}
            <a onClick={() => setMobileMenuOpen(false)} href="#api-credit" className="flex items-center justify-between text-lg font-bold text-emerald-700 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100">
              API ক্রেডিট <Coins size={18} />
            </a>
          </div>
          <div className="p-6 border-t border-slate-100 bg-slate-50">
            {user ? (
              <button 
                onClick={() => { setMobileMenuOpen(false); setIsDashboardOpen(true); }} 
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <LayoutDashboard size={20} /> ড্যাশবোর্ড
              </button>
            ) : (
              <button 
                onClick={() => { setMobileMenuOpen(false); handleLoginClick(); }} 
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <LogIn size={20} /> লগইন করুন
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Refined Hero Section */}
      <section id="home" className="relative pt-36 pb-20 lg:pt-56 lg:pb-40 overflow-hidden bg-slate-900 scroll-mt-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-slate-900 pointer-events-none"></div>
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-block animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-300 text-sm font-bold uppercase tracking-widest backdrop-blur-md mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
              AI Automation Agency
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight mb-8 animate-fade-in-up animation-delay-100 tracking-tight">
            Automate Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">Business Growth</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200 font-light">
            আধুনিক প্রযুক্তির ছোঁয়ায় আপনার ব্যবসাকে করুন স্মার্ট। মেসেঞ্জার, হোয়াটসঅ্যাপ এবং সোশ্যাল মিডিয়া অটোমেশনের মাধ্যমে বাড়ান কাস্টমার এনগেজমেন্ট।
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in-up animation-delay-300">
            <button 
              onClick={() => user ? setIsDashboardOpen(true) : handleLoginClick()}
              className="px-10 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-500 transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.6)] hover:scale-105 flex items-center justify-center gap-3"
            >
              শুরু করুন <ArrowRight size={20} />
            </button>
            <a 
              href="#services" 
              className="px-10 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all hover:scale-105 flex items-center justify-center backdrop-blur-sm"
            >
              সার্ভিস দেখুন
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">আমাদের সার্ভিসসমূহ</h2>
            <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full mb-4"></div>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              আমরা আপনার ব্যবসার জন্য আধুনিক প্রযুক্তির অটোমেশন সার্ভিস প্রদান করে থাকি।
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                onClick={() => handleViewDetails(service.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" ref={pricingSectionRef} className="py-24 bg-slate-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">সার্ভিস ও প্রাইসিং প্যাকেজ</h2>
            <div className="w-24 h-1.5 bg-emerald-500 mx-auto rounded-full mb-4"></div>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              স্বচ্ছ ও সাশ্রয়ী মূল্যে আপনার ব্যবসার জন্য সেরা প্যাকেজটি বেছে নিন।
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {PRICING_PACKAGES.map((pkg) => (
              <PricingCard 
                key={pkg.id} 
                pkg={pkg} 
                onOrder={handleOrderClick} 
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
          
          <div className="mt-12 text-center bg-white p-8 rounded-3xl border border-slate-200 max-w-4xl mx-auto shadow-sm hover:shadow-md transition-shadow">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center justify-center gap-2 text-lg uppercase tracking-wide">
              <CheckCircle2 size={24} className="text-blue-600"/> সাপোর্ট পলিসি বিস্তারিত
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p className="font-bold text-blue-900 mb-2">মাসিক প্যাকেজ</p>
                <p className="text-slate-700 text-sm leading-relaxed">যতক্ষণ সাবস্ক্রিপশন চালু থাকবে, ততক্ষণ ২৪/৭ সাপোর্ট ফ্রি। এপিআই এবং টেকনিক্যাল ইস্যু আমরা দেখবো।</p>
              </div>
              <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200">
                <p className="font-bold text-slate-900 mb-2">এককালীন প্যাকেজ</p>
                <p className="text-slate-700 text-sm leading-relaxed">কেনার পর ১ বার সেটআপ সাপোর্ট ফ্রি। পরবর্তীতে কোনো সমস্যা সমাধানের জন্য সার্ভিস চার্জ প্রযোজ্য হবে।</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated API Credit Section */}
      <section id="api-credit" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ApiTopupSection 
            onOrder={handleCustomApiOrder}
            onViewDetails={() => handleViewDetails(API_TOPUP_PACKAGE.id)}
          />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-slate-900 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-700 relative">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 relative z-10">
              <div className="p-10 md:p-16 text-white flex flex-col justify-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">আমাদের সাথে <br/><span className="text-blue-400">যোগাযোগ করুন</span></h2>
                <p className="text-slate-300 text-lg mb-10 leading-relaxed max-w-md">
                  আপনার ব্যবসার অটোমেশন নিয়ে কথা বলতে চান? আমাদের টিম আপনার যেকোনো প্রশ্নের উত্তর দিতে প্রস্তুত।
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-6 group">
                    <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:bg-blue-600 transition-all duration-300 border border-blue-600/30 group-hover:border-blue-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                      <Phone className="text-blue-400 group-hover:text-white" size={28} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 uppercase tracking-wider font-bold mb-1">হটলাইন / WhatsApp</p>
                      <p className="text-2xl font-bold font-mono tracking-wide">{CONTACT_INFO.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 group">
                    <div className="w-16 h-16 bg-emerald-600/20 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:bg-emerald-600 transition-all duration-300 border border-emerald-600/30 group-hover:border-emerald-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                      <Mail className="text-emerald-400 group-hover:text-white" size={28} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 uppercase tracking-wider font-bold mb-1">ইমেইল</p>
                      <p className="text-xl font-bold">{CONTACT_INFO.email}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex gap-4">
                  <a href={siteSettings.facebook} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all border border-white/10 hover:-translate-y-1">
                    <Facebook size={24} />
                  </a>
                  <a href={siteSettings.youtube} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-red-600 hover:text-white transition-all border border-white/10 hover:-translate-y-1">
                    <Youtube size={24} />
                  </a>
                </div>
              </div>

              <div className="p-10 md:p-16 bg-white lg:rounded-l-none lg:rounded-r-[2.5rem]">
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">আপনার নাম</label>
                    <input 
                      type="text" 
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all" 
                      placeholder="নাম লিখুন" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">ফোন নাম্বার</label>
                    <input 
                      type="tel" 
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-bold placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all" 
                      placeholder="017..." 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">বার্তা</label>
                    <textarea 
                      rows={4} 
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 font-medium placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all resize-none" 
                      placeholder="আপনার বার্তা লিখুন..."
                      required
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSendingMsg}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-600/30 transform active:scale-95 flex items-center justify-center gap-3 text-lg"
                  >
                    {isSendingMsg ? <Loader2 className="animate-spin" /> : <><Send size={20} /> মেসেজ পাঠান</>}
                  </button>
                  <p className="text-xs text-center text-slate-400 mt-4">
                    *মেসেজ পাঠাতে লগইন প্রয়োজন।
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Logo className="text-3xl" />
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-slate-500 font-medium">
                আধুনিক ব্যবসার জন্য স্মার্ট অটোমেশন সলিউশন। আমরা আপনার সময় বাঁচাতে এবং ব্যবসায়িক প্রবৃদ্ধি নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ।
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest text-slate-500">কুইক লিংক</h4>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="#home" className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">হোম</a></li>
                <li><a href="#services" className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">সার্ভিসসমূহ</a></li>
                <li><a href="#pricing" className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">প্যাকেজ</a></li>
                <li><a href="#contact" className="hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">যোগাযোগ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase text-xs tracking-widest text-slate-500">সোশ্যাল মিডিয়া</h4>
              <div className="flex gap-4">
                <a href={siteSettings.facebook} target="_blank" rel="noopener noreferrer" className="bg-slate-900 p-4 rounded-2xl hover:bg-blue-600 hover:text-white transition-all hover:-translate-y-1">
                  <Facebook size={20} />
                </a>
                <a href={siteSettings.youtube} target="_blank" rel="noopener noreferrer" className="bg-slate-900 p-4 rounded-2xl hover:bg-red-600 hover:text-white transition-all hover:-translate-y-1">
                  <Youtube size={20} />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-900 pt-8 text-center text-sm text-slate-600 font-medium">
            <p>&copy; {new Date().getFullYear()} AutoMateIQ. সর্বস্বত্ব সংরক্ষিত।</p>
          </div>
        </div>
      </footer>

      {/* AI Chat Widget */}
      <ChatAssistant />
      
      {/* Order Modal */}
      <OrderModal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
        pkg={selectedPackage}
        onSuccess={handleOrderSuccess}
      />

      {/* Service Detail Modal */}
      <ServiceDetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        content={selectedDetailContent} 
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;