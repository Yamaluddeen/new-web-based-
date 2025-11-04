import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Memo } from '../types/types';
import { useAuth } from './useAuth';

export const useMemos = (categoryId?: string) => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // ดึงข้อมูล Memo
  const fetchMemos = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase
        .from('memos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setMemos(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // เพิ่ม Memo ใหม่
  const addMemo = async (title: string, content: string, categoryId: string, imageFile?: File) => {
    if (!user) return null;
    
    try {
      setError(null);
      
      let imageUrl;
      
      // อัปโหลดรูปภาพถ้ามี
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        
        const { error: uploadError } = await supabase.storage
          .from(import.meta.env.VITE_SUPABASE_BUCKET_NAME)
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (uploadError) {
          console.log(uploadError.message)
          throw uploadError;
        }
        
        const { data } = supabase.storage
          .from(import.meta.env.VITE_SUPABASE_BUCKET_NAME)
          .getPublicUrl(filePath);
          
        imageUrl = data.publicUrl;
      }
      
      const newMemo = {
        title,
        content,
        category_id: categoryId,
        user_id: user.id,
        image_url: imageUrl
      };
      
      const { data, error } = await supabase
        .from('memos')
        .insert([newMemo])
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      setMemos([data, ...memos]);
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };


  // แก้ไข Memo
  const updateMemo = async (id: string, title: string, content: string, categoryId: string, imageFile?: File) => {
    if (!user) return null;
    
    try {
      setError(null);
      
      const updateData: any = {
        title,
        content,
        category_id: categoryId
      };
      
      // อัปโหลดรูปภาพใหม่ถ้ามี
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from(import.meta.env.VITE_SUPABASE_BUCKET_NAME)
          .upload(filePath, imageFile);
          
        if (uploadError) {
          throw uploadError;
        }
        
        const { data } = supabase.storage
          .from(import.meta.env.VITE_SUPABASE_BUCKET_NAME)
          .getPublicUrl(filePath);
          
        updateData.image_url = data.publicUrl;
      }
      
      const { data, error } = await supabase
        .from('memos')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      setMemos(memos.map(memo => memo.id === id ? data : memo));
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  // ลบ Memo
  const deleteMemo = async (id: string) => {
    if (!user) return false;
    
    try {
      setError(null);
      
      // ค้นหา memo ที่จะลบเพื่อเอาข้อมูลรูปภาพ
      const memoToDelete = memos.find(memo => memo.id === id);
      
      // ลบรูปภาพถ้ามี
      if (memoToDelete?.image_url) {
        const filePath = memoToDelete.image_url.split('/').slice(-2).join('/');
        await supabase.storage
          .from(import.meta.env.VITE_SUPABASE_BUCKET_NAME)
          .remove([filePath]);
      }
      
      const { error } = await supabase
        .from('memos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) {
        throw error;
      }
      
      setMemos(memos.filter(memo => memo.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // ดึงข้อมูล Memo เมื่อ component ถูกโหลดหรือ categoryId เปลี่ยน
  useEffect(() => {
    fetchMemos();
  }, [user, categoryId]);

  return {
    memos,
    loading,
    error,
    fetchMemos,
    addMemo,
    updateMemo,
    deleteMemo
  };
};