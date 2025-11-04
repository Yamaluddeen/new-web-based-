export type Profile = {
    id: string;
    updated_at: string;
    username: string;
    email: string;
    avatar_url?: string;
  };
  
  export type Category = {
    id: string;
    created_at: string;
    name: string;
    user_id: string;
  };
  
  export type Memo = {
    id: string;
    created_at: string;
    updated_at: string;
    title: string;
    content: string;
    category_id: string;
    user_id: string;
    image_url?: string;
  };
  
  export type Database = {
    public: {
      Tables: {
        profiles: {
          Row: Profile;
          Insert: Omit<Profile, 'id' | 'updated_at'>;
          Update: Partial<Omit<Profile, 'id'>>;
        };
        categories: {
          Row: Category;
          Insert: Omit<Category, 'id' | 'created_at'>;
          Update: Partial<Omit<Category, 'id' | 'created_at' | 'user_id'>>;
        };
        memos: {
          Row: Memo;
          Insert: Omit<Memo, 'id' | 'created_at' | 'updated_at'>;
          Update: Partial<Omit<Memo, 'id' | 'created_at' | 'updated_at' | 'user_id'>>;
        };
      };
    };
  };
  