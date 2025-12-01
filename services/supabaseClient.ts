import { createClient } from '@supabase/supabase-js';
import { User, Order, SupportMessage, SiteSettings } from '../types';

// Supabase Configuration
const SUPABASE_URL = 'https://dyqxsqpdomfsfcgtrhmh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_U8gdiofEV07sVzhyoh_zJg_5DU1XS8O';

// Initialize Client
const initSupabase = () => {
  try {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        },
        db: {
            schema: 'public'
        }
    });
  } catch (e) {
    console.warn('Supabase initialization failed.');
    return null;
  }
};

export const supabase = initSupabase();

export const db = {
  // --- AUTH FUNCTIONS (Password Based) ---

  // 1. Sign Up with Email, Password & Meta Data
  signup: async (data: { email: string; pass: string; name: string; phone: string }) => {
    if (!supabase) return { error: { message: "System offline" } };
    return await supabase.auth.signUp({
      email: data.email,
      password: data.pass,
      options: {
        data: {
          full_name: data.name,
          phone: data.phone,
          role: 'user' // Default role
        }
      }
    });
  },

  // 2. Verify Email (Signup Code)
  verifySignup: async (email: string, token: string) => {
    if (!supabase) return { data: null, error: { message: "System offline" } };
    return await supabase.auth.verifyOtp({ 
      email, 
      token, 
      type: 'signup' // Verifying a signup code
    });
  },

  // 3. Resend Signup Code
  resendSignupCode: async (email: string) => {
    if (!supabase) return { error: { message: "System offline" } };
    return await supabase.auth.resend({
      type: 'signup',
      email: email
    });
  },

  // 4. Login with Password
  login: async (email: string, pass: string) => {
    if (!supabase) return { error: { message: "System offline" } };
    return await supabase.auth.signInWithPassword({
      email,
      password: pass
    });
  },

  // 5. Save/Update Profile
  upsertProfile: async (user: User) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role
      });
      if (error) {
        // Log specific error if table is missing or RLS issue
        if (error.code === '42P01') {
          console.error("DATABASE ERROR: 'profiles' table not found. Please run the provided SQL script.");
        } else if (error.code === '42883') {
          console.error("DATABASE ERROR: Type mismatch (UUID vs Text). Please run the provided SQL script with UUID types.");
        }
        // Don't throw, just log. We don't want to crash the UI.
        console.warn("Upsert failed", error);
      }
    } catch (e: any) {
      console.warn("Profile sync error:", e.message);
    }
  },

  getUserProfile: async (userId: string): Promise<User | null> => {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error) return null;
      return data as User;
    } catch {
      return null;
    }
  },

  getAllUsers: async (): Promise<User[] | null> => {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) return [];
      return data as User[];
    } catch {
      return [];
    }
  },

  // --- ORDER FUNCTIONS ---

  getOrders: async (userId?: string): Promise<Order[] | null> => {
    if (!supabase) return [];
    try {
      let query = supabase.from('orders').select('*').order('date', { ascending: false });
      
      // If userId is provided, filter for that user only (Client Side Performance Fix)
      if (userId) {
        query = query.eq('userId', userId);
      }
      
      const { data, error } = await query;
      if (error) {
        console.warn('DB Error (Get Orders):', error.message || error);
        return []; // Return empty array on error instead of throwing
      }
      return data as Order[];
    } catch (error: any) {
      console.warn('DB Error (Get Orders Exception):', error.message || error);
      return [];
    }
  },

  addOrder: async (order: Order): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('orders').insert([order]);
      if (error) {
        console.error("Add Order Error:", error);
        return false;
      }
      return true;
    } catch (error: any) {
      console.warn('DB Error (Add Order):', error.message || error);
      return false;
    }
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<boolean> => {
    if (!supabase) return false;
    try {
      console.log(`Attempting to update order ${orderId} to status: ${status}`);
      const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
      
      if (error) {
        console.error("Update Status Failed Details:", error);
        
        // Handle Specific DB Errors to Guide User
        if (error.code === '23514') {
             alert("ডাটাবেজ সমস্যা: 'completed' স্ট্যাটাসটি ডাটাবেজে অনুমোদিত নয় (Check Constraint)। দয়া করে SQL Editor এ গিয়ে 'ALTER TABLE orders DROP CONSTRAINT orders_status_check;' রান করুন।");
        } else if (error.code === '42501') {
             alert("পারমিশন সমস্যা: ডাটাবেজ আপনাকে আপডেট করতে দিচ্ছে না (RLS Policy)। আপনার রোল 'Admin' কিনা চেক করুন।");
        } else {
             alert(`Error: ${error.message || 'Unknown database error'}`);
        }
        return false;
      }
      return true;
    } catch (error: any) {
      console.warn('DB Error (Update Order):', error.message || error);
      return false;
    }
  },

  // Generic update for other details (Admin instructions, client submission)
  updateOrderDetails: async (orderId: string, updates: Partial<Order>): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('orders').update(updates).eq('id', orderId);
      if (error) {
        console.error("Update Details Error:", error);
        return false;
      }
      return true;
    } catch (error: any) {
      console.warn('DB Error (Update Order Details):', error.message || error);
      return false;
    }
  },

  // --- SUPPORT MESSAGE FUNCTIONS ---

  getMessages: async (userId?: string): Promise<SupportMessage[] | null> => {
    if (!supabase) return [];
    try {
      let query = supabase.from('support_messages').select('*').order('created_at', { ascending: true });
      // If specific user, filter
      if (userId) {
        query = query.eq('user_id', userId);
      }
      // If admin calls this without userId, they get ALL messages (controlled by RLS)
      
      const { data, error } = await query;
      if (error) return [];
      return data as SupportMessage[];
    } catch {
      return [];
    }
  },

  sendMessage: async (msg: Partial<SupportMessage>): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('support_messages').insert([msg]);
      if (error) {
        console.error("Send Message Error:", error);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  markMessagesRead: async (userId: string) => {
    if (!supabase) return;
    try {
       // Function handled by component/context logic
    } catch {}
  },

  // --- SETTINGS FUNCTIONS ---
  getSystemSettings: async (): Promise<SiteSettings | null> => {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.from('system_settings').select('*');
      if (error || !data) return null;
      
      // Convert Array to Object
      const settings: any = {};
      data.forEach(item => {
        if (item.key === 'facebook_url') settings.facebook = item.value;
        if (item.key === 'youtube_url') settings.youtube = item.value;
      });
      
      return settings as SiteSettings;
    } catch {
      return null;
    }
  },

  updateSystemSetting: async (key: string, value: string): Promise<boolean> => {
    if (!supabase) return false;
    try {
      const { error } = await supabase.from('system_settings').upsert({ key, value });
      return !error;
    } catch {
      return false;
    }
  }
};