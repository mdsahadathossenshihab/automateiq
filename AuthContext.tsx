
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { User, Order, AuthContextType, SupportMessage, SiteSettings } from './types';
import { db, supabase } from './services/supabaseClient';
import { CONTACT_INFO, NOTIFICATION_SOUND_BASE64 } from './constants';
import { getUserLocation } from './services/locationService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]); 
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Site Settings State (Default to constants)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    facebook: CONTACT_INFO.facebookPage,
    youtube: CONTACT_INFO.youtubeChannel
  });
  
  // New Notification Hook
  const [toastMessage, setToastMessage] = useState<{title: string, body: string} | null>(null);

  // Audio Context Ref
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize Audio Context on user interaction
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  // Helper to play base64 sound via Web Audio API (More reliable than new Audio())
  const playNotificationSound = async () => {
    try {
      if (!audioContextRef.current) {
        initAudio();
      }
      
      const ctx = audioContextRef.current;
      if (!ctx) return;

      // Convert Base64 to ArrayBuffer
      const response = await fetch(NOTIFICATION_SOUND_BASE64);
      const arrayBuffer = await response.arrayBuffer();
      
      // Decode and play
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start(0);
    } catch (e) {
      console.warn("Web Audio API failed, falling back to HTML5 Audio", e);
      // Fallback
      const audio = new Audio(NOTIFICATION_SOUND_BASE64);
      audio.volume = 1.0;
      audio.play().catch(err => console.log("Audio blocked:", err));
    }
  };

  // Function to manually request permission (called from Dashboard Settings)
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert("This browser does not support notifications.");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      initAudio(); // Initialize audio context on click
      
      if (permission === 'granted') {
        playNotificationSound();
        sendBrowserNotification('নোটিফিকেশন চালু হয়েছে', 'এখন থেকে আপনি সাউন্ড এবং অ্যালার্ট পাবেন।');
        return true;
      } else {
        alert("Notification permission denied. Please enable it in browser settings.");
      }
    } catch (e) {
      console.error("Permission request error", e);
    }
    return false;
  };

  const sendBrowserNotification = async (title: string, body: string) => {
    console.log("TRIGGERING NOTIFICATION:", title);

    // 1. Play Sound
    playNotificationSound();

    // 2. Show In-App Toast (Always works)
    setToastMessage({ title, body });
    setTimeout(() => setToastMessage(null), 8000); 

    // 3. Show System Notification
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        // Option A: Service Worker (Best for Mobile Android)
        if ('serviceWorker' in navigator) {
           const registration = await navigator.serviceWorker.ready;
           if (registration) {
             console.log("Sending via Service Worker");
             registration.showNotification(title, {
               body: body,
               icon: 'https://cdn-icons-png.flaticon.com/512/893/893268.png',
               badge: 'https://cdn-icons-png.flaticon.com/512/893/893268.png',
               tag: 'automateiq-alert-' + Date.now(), // Unique tag to prevent overwriting
               vibrate: [200, 100, 200],
               requireInteraction: true,
               data: { url: window.location.href }
             } as any);
             return;
           }
        }

        // Option B: Standard API (Fallback for PC)
        console.log("Sending via Standard API");
        const n = new Notification(title, {
          body: body,
          icon: 'https://cdn-icons-png.flaticon.com/512/893/893268.png',
          tag: 'automateiq-alert-' + Date.now(),
          requireInteraction: true,
          silent: false 
        });
        n.onclick = function() {
          window.focus();
          this.close();
        };
      } catch (e) {
        console.warn("System notification failed", e);
      }
    } else {
      console.log("Permission not granted. Status:", Notification.permission);
    }
  };

  // Optimized refresh: fetch only what is needed based on role
  const refreshData = async (currentUser?: User) => {
    const targetUser = currentUser || user;
    
    try {
      const settings = await db.getSystemSettings();
      if (settings && (settings.facebook || settings.youtube)) {
        setSiteSettings(prev => ({ ...prev, ...settings }));
      }
    } catch (e) {
      console.warn("Settings fetch failed", e);
    }

    if (!targetUser) {
      setOrders([]);
      setUsers([]);
      setMessages([]);
      return;
    }

    try {
      const freshProfile = await db.getUserProfile(targetUser.id);
      if (freshProfile) setUser(freshProfile);

      const dbMessages = await db.getMessages(targetUser.role === 'admin' ? undefined : targetUser.id);
      if (dbMessages) setMessages(dbMessages);

      if (targetUser.role === 'admin') {
        const [dbOrders, dbUsers] = await Promise.all([
           db.getOrders(),
           db.getAllUsers()
        ]);
        if (dbOrders) setOrders(dbOrders);
        if (dbUsers) setUsers(dbUsers);
      } else {
        const dbOrders = await db.getOrders(targetUser.id);
        if (dbOrders) setOrders(dbOrders);
      }
    } catch (e) {
      console.error("Failed to refresh data", e);
    }
  };

  const ensureProfile = async (sessionUser: any): Promise<User> => {
    // Basic User construction from Session Metadata
    const baseUser: User = {
      id: sessionUser.id,
      email: sessionUser.email!,
      name: sessionUser.user_metadata?.full_name || 'User',
      phone: sessionUser.user_metadata?.phone || '',
      role: 'user',
      location: sessionUser.user_metadata?.location // Check metadata first
    };

    const isAdminEmail = sessionUser.email === 'info@automateiq.xyz' || sessionUser.email === 'Admin@automateiq.xyz'; 
    if (isAdminEmail) baseUser.role = 'admin';

    try {
      const profilePromise = db.getUserProfile(sessionUser.id);
      const timeoutPromise = new Promise<User | null>((_, reject) => 
        setTimeout(() => reject(new Error("Profile fetch timeout")), 2000)
      );

      let profile = await Promise.race([profilePromise, timeoutPromise]);
      
      // If we have a profile from DB
      if (profile) {
        if (isAdminEmail && profile.role !== 'admin') {
           profile.role = 'admin';
        }
        
        // LOCATION UPDATE LOGIC
        if (!profile.location || profile.location === 'Unknown' || profile.location === 'Unknown Location') {
             let loc = sessionStorage.getItem('cached_location');
             if (!loc) {
                loc = await getUserLocation();
             }
             if (loc && loc !== 'Unknown Location') {
                 profile.location = loc;
                 db.upsertProfile(profile).catch(console.warn);
             }
        }
        return profile;
      }

      // If no profile exists in DB yet, create one
      if (!baseUser.location || baseUser.location === 'Unknown') {
          const cached = sessionStorage.getItem('cached_location');
          baseUser.location = cached || await getUserLocation();
      }

      db.upsertProfile(baseUser).catch(err => console.warn("Background profile create failed", err));
      return baseUser; 
    } catch (e) {
      return baseUser; 
    }
  };

  useEffect(() => {
    let mounted = true;

    // --- SILENT LOCATION PRE-FETCH ---
    if (typeof sessionStorage !== 'undefined' && !sessionStorage.getItem('cached_location')) {
        getUserLocation();
    }

    db.getSystemSettings().then(settings => {
      if (settings && mounted) {
        setSiteSettings(prev => ({ ...prev, ...settings }));
      }
    });

    const safetyTimeout = setTimeout(() => {
      if (mounted && isLoading) {
        setIsLoading(false);
      }
    }, 2000);

    const initSession = async () => {
      try {
        if (!supabase) throw new Error("Supabase client missing");

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session?.user && mounted) {
          const tempUser: User = {
             id: session.user.id,
             email: session.user.email!,
             name: session.user.user_metadata?.full_name || 'User',
             phone: session.user.user_metadata?.phone || '',
             role: session.user.email === 'info@automateiq.xyz' ? 'admin' : 'user',
             location: session.user.user_metadata?.location 
          };
          
          setUser(tempUser);
          setIsLoading(false);

          ensureProfile(session.user).then(profile => {
             if (mounted) {
               setUser(profile);
               refreshData(profile);
             }
          });
        } else if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      } catch (e) {
        console.error("Session init error:", e);
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    initSession();

    const { data: authListener } = supabase ? supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        setIsLoading(false); 
        try {
          const profile = await ensureProfile(session.user);
          if (mounted) setUser(profile);
          refreshData(profile);
        } catch (e) {
          console.error("Auth change error:", e);
        }
      } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setUser(null);
        setOrders([]);
        setUsers([]);
        setMessages([]);
        setIsLoading(false);
      }
    }) : { data: { subscription: { unsubscribe: () => {} } } };

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // --- Real-time Listeners ---
  useEffect(() => {
    if (!user || !supabase) return;

    // Order Channel
    const orderChannel = supabase.channel('realtime-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        const newOrder = payload.new as Order;
        const oldOrder = payload.old as Order;

        const isAdmin = user.role === 'admin';
        const isMyOrder = newOrder.userId === user.id;

        if (isAdmin || isMyOrder) {
          if (payload.eventType === 'INSERT') {
             syncRealtimeOrder(newOrder, 'INSERT');
             
             // NOTIFY ADMIN ON NEW ORDER
             if (isAdmin) {
               sendBrowserNotification('নতুন অর্ডার!', `${newOrder.userName} অর্ডার করেছেন: ${newOrder.serviceName} (${newOrder.amount})`);
             }
          } else if (payload.eventType === 'UPDATE') {
             syncRealtimeOrder(newOrder, 'UPDATE');
             
             // NOTIFY USER ON STATUS CHANGE
             if (!isAdmin && oldOrder.status !== newOrder.status) {
                sendBrowserNotification('অর্ডার আপডেট', `আপনার অর্ডারের স্ট্যাটাস পরিবর্তন হয়েছে: ${newOrder.status}`);
             }
             
             // NOTIFY ADMIN IF USER SUBMITS DETAILS
             if (isAdmin && !oldOrder.isDetailsSubmitted && newOrder.isDetailsSubmitted) {
                sendBrowserNotification('অর্ডার আপডেট', `${newOrder.userName} অর্ডার ডিটেইলস সাবমিট করেছেন।`);
             }
          }
        }
      })
      .subscribe();

    // Messages Channel
    const messageChannel = supabase.channel('realtime-messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'support_messages' }, (payload) => {
        const newMessage = payload.new as SupportMessage;
        
        let shouldAdd = false;
        if (user.role === 'admin') {
           shouldAdd = true; // Admin sees all
        } else {
           if (newMessage.user_id === user.id) {
             shouldAdd = true; // User sees own chat
           }
        }

        if (shouldAdd) {
          setMessages(prev => {
             if (prev.find(m => m.id === newMessage.id)) return prev;
             return [...prev, newMessage];
          });

          // NOTIFICATION LOGIC
          const isFromMe = newMessage.sender_role === user.role;
          
          if (!isFromMe) {
             // If I am Admin, and msg is from User -> Notify Me
             if (user.role === 'admin' && newMessage.sender_role === 'user') {
                sendBrowserNotification('🔔 সাপোর্ট মেসেজ', 'একজন কাস্টমার আপনাকে মেসেজ পাঠিয়েছেন।');
             } 
             // If I am User, and msg is from Admin -> Notify Me
             else if (user.role === 'user' && newMessage.sender_role === 'admin') {
                sendBrowserNotification('অ্যাডমিন রিপ্লাই', 'সাপোর্ট থেকে নতুন মেসেজ এসেছে।');
             }
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(orderChannel);
      supabase.removeChannel(messageChannel);
    };
  }, [user?.id, user?.role]); 

  // --- Auth Methods ---

  const signupUser = async (data: { name: string; email: string; phone: string; pass: string }) => {
    let location = sessionStorage.getItem('cached_location');
    if (!location) {
        location = await getUserLocation();
    }
    const { error } = await db.signup({ ...data, location: location || 'Unknown' });
    if (error) return { success: false, message: error.message };
    return { success: true };
  };

  const verifyEmail = async (email: string, token: string) => {
    const { data, error } = await db.verifySignup(email, token);
    if (error || !data.user) {
      return { success: false, message: error?.message || "ভেরিফিকেশন ব্যর্থ হয়েছে" };
    }
    const tempUser: User = {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata?.full_name || 'User',
      phone: data.user.user_metadata?.phone || '',
      role: 'user',
      location: data.user.user_metadata?.location 
    };
    setUser(tempUser);
    ensureProfile(data.user);
    return { success: true };
  };

  const resendSignupCode = async (email: string) => {
    const { error } = await db.resendSignupCode(email);
    if (error) return { success: false, message: error.message };
    return { success: true };
  };

  const loginUser = async (email: string, pass: string) => {
    const { data, error } = await db.login(email, pass);
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true };
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
    setOrders([]);
    setUsers([]);
    setMessages([]);
  };

  const addOrder = async (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: 'pending'
    };
    setOrders(prev => [newOrder, ...prev]);
    db.addOrder(newOrder).then(success => {
        if(success) refreshData();
    });
  };

  const updateOrderStatus = async (orderId: string, status: 'approved' | 'rejected' | 'completed') => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    const success = await db.updateOrderStatus(orderId, status);
    if (!success) {
      console.error("Failed to update status in DB");
      await refreshData();
    }
    return success;
  };

  const updateOrderDetails = async (orderId: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updates } : o));
    await db.updateOrderDetails(orderId, updates);
    refreshData();
  };

  const updateSiteSettings = async (settings: SiteSettings) => {
    setSiteSettings(settings);
    const fbSuccess = await db.updateSystemSetting('facebook_url', settings.facebook);
    const ytSuccess = await db.updateSystemSetting('youtube_url', settings.youtube);
    return fbSuccess && ytSuccess;
  };

  const sendSupportMessage = async (text: string, targetUserId?: string) => {
    if (!user) return false;
    
    const receiverId = user.role === 'admin' ? (targetUserId || user.id) : user.id; 
    
    const msgData: Partial<SupportMessage> = {
      user_id: receiverId, 
      sender_role: user.role,
      message: text,
      is_read: false
    };
    
    const tempMsg: SupportMessage = {
      id: Date.now().toString(),
      ...msgData as SupportMessage,
      created_at: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, tempMsg]);
    
    const success = await db.sendMessage(msgData);
    if (!success) {
        console.error("Failed to send message");
        setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
    }
    return success;
  };

  const markMessagesRead = async (userId: string) => {
    if (!supabase || !user) return;
    setMessages(prev => prev.map(m => {
       if (m.user_id === userId && !m.is_read) {
          if (user.role === 'admin' && m.sender_role === 'user') return { ...m, is_read: true };
          if (user.role === 'user' && m.sender_role === 'admin') return { ...m, is_read: true };
       }
       return m;
    }));
    try {
      const senderRoleToMark = user.role === 'admin' ? 'user' : 'admin';
      await supabase.from('support_messages')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('sender_role', senderRoleToMark)
        .eq('is_read', false);
    } catch (e) {
      console.error("Read status update failed", e);
    }
  };

  const syncRealtimeOrder = (order: Order, eventType: 'INSERT' | 'UPDATE') => {
    setOrders(prevOrders => {
      if (eventType === 'INSERT') {
        const exists = prevOrders.some(o => o.id === order.id);
        if (exists) return prevOrders;
        return [order, ...prevOrders];
      }
      if (eventType === 'UPDATE') {
        return prevOrders.map(o => o.id === order.id ? { ...o, ...order } : o);
      }
      return prevOrders;
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, users, orders, messages, siteSettings,
      signupUser, verifyEmail, resendSignupCode, loginUser,
      logout, addOrder, updateOrderStatus, updateOrderDetails, 
      syncRealtimeOrder, sendSupportMessage, markMessagesRead,
      updateSiteSettings, requestNotificationPermission,
      isLoading 
    }}>
      {children}
      
      {/* Visual Toast Notification Component (Foreground) */}
      {toastMessage && (
        <div className="fixed top-24 right-5 z-[100] animate-bounce-in cursor-pointer" onClick={() => setToastMessage(null)}>
          <div className="bg-white border-l-4 border-blue-600 rounded-xl shadow-2xl p-4 flex items-start gap-3 max-w-sm ring-1 ring-black/5">
             <div className="bg-blue-100 p-2 rounded-full text-blue-600 shrink-0 animate-pulse">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
             </div>
             <div>
               <h4 className="font-bold text-slate-900 text-sm">{toastMessage.title}</h4>
               <p className="text-xs text-slate-500 mt-1 leading-relaxed">{toastMessage.body}</p>
             </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
