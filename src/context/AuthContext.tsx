import { createContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom'; // ใช้ react-router-dom แทน react-router

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: unknown } | undefined>;
  signUp: (email: string, password: string) => Promise<{ error: unknown } | undefined>;
  signOut: () => Promise<void>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // เข้าสู่ระบบ
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { error };
      }
      navigate('/memos');
    } catch (error) {
      return { error };
    }
  };

  // ลงทะเบียน
  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/signup-success`
        }
      });

      if (error) {
        return { error };
      }

      // ตรวจสอบว่า user ถูกสร้างแล้วก่อน insert profiles
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: data.user.id, email, created_at: new Date() }]); // ใส่ created_at ถ้าตารางมีคอลัมน์นี้
        if (profileError) {
          console.error("สร้าง profile ไม่สำเร็จ", profileError);
          return { error: profileError };
        }
      }

      navigate('/signup-success');
      return { error: null };
    } catch (error) {
      console.error(error);
      return { error };
    }
  };

  // ออกจากระบบ
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/sign-in');
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
