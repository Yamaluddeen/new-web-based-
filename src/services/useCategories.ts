import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Category } from '../types/types';
import { useAuth } from './useAuth';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // ดึงข้อมูลกลุ่มเรื่อง
  const fetchCategories = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name');
        
      if (error) {
        throw error;
      }
      
      setCategories(data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  // เพิ่มกลุ่มเรื่องใหม่
  const addCategory = async (name: string) => {
    if (!user) return null;
    
    try {
      setError(null);
      
      const newCategory = {
        name,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('categories')
        .insert([newCategory])
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      setCategories([...categories, data]);
      return data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      throw err;
    }
  };

  // แก้ไขกลุ่มเรื่อง
  const updateCategory = async (id: string, name: string) => {
    if (!user) return null;
    
    try {
      setError(null);
      
      const { data, error } = await supabase
        .from('categories')
        .update({ name })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      setCategories(categories.map(category => category.id === id ? data : category));
      return data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      throw err;
    }
  };

  // ลบกลุ่มเรื่อง
  const deleteCategory = async (id: string) => {
    if (!user) return false;
    
    try {
      setError(null);
      
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) {
        throw error;
      }
      
      setCategories(categories.filter(category => category.id !== id));
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      throw err;
    }
  };

  // ดึงข้อมูลกลุ่มเรื่องเมื่อ component ถูกโหลด
  useEffect(() => {
    fetchCategories();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory
  };
};