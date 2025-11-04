# Memo App

## Database Script for Supabase

```
-- Create tables
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT
);

ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT auth.uid();

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  name TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.memos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  image_url TEXT
);

-- Create functions to handle updated_at for memos
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for handling updated_at
CREATE TRIGGER on_memos_update
  BEFORE UPDATE ON public.memos
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

-- Insert sample data with RLS temporarily disabled
-- Disable RLS
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.memos DISABLE ROW LEVEL SECURITY;



-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memos ENABLE ROW LEVEL SECURITY;

-- Now set up RLS policies
-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Categories policies
CREATE POLICY "Categories are viewable by owner"
  ON public.categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories"
  ON public.categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
  ON public.categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
  ON public.categories FOR DELETE
  USING (auth.uid() = user_id);

-- Memos policies
CREATE POLICY "Memos are viewable by owner"
  ON public.memos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own memos"
  ON public.memos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memos"
  ON public.memos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memos"
  ON public.memos FOR DELETE
  USING (auth.uid() = user_id);



  -- Create a storage bucket for memo images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('memo-images', 'memo-images', true)
ON CONFLICT (id) DO NOTHING;



-- Allow authenticated users to perform SELECT, INSERT, UPDATE, and DELETE operations
CREATE POLICY "Allow authenticated users to perform all operations"
ON storage.objects
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
```

## Key และ URL อยู่ที่ Project Setting > Data API

* Project URL นำไปกำหนดใน .env ที่ VITE_SUPABASE_URL
* Project API Keys (anon, public) นำไปกำหนดใน .env ที่  VITE_SUPABASE_ANON_KEY

## การเก็บภาพ
สร้างกล่อง "memo-images" (สร้างจาก Script แล้ว) และนำไปกำหนดใน .env ที่ VITE_SUPABASE_BUCKET_NAME ได้ว่า
```
VITE_SUPABASE_BUCKET_NAME="memo-images"
```

## กำหนด Policy เพื่อให้สามารถเพิ่มผู้ใช้ใหม่ได้

* ไปที่เมนู Authentication > Policies
* ใน Profiles เปลี่ยน id ตรง Default Value เป็น auth.uid() (กำหนดใน Script แล้ว)
* สำหรับการกำหนด Policies เบื้องต้นอื่น ถูกทำจาก Script ดูได้จาก Authentication > Policies