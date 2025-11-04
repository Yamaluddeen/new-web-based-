import { Category } from '../../types/types';

type CategoryListProps = {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
};

export const CategoryList = ({ categories, onEdit, onDelete }: CategoryListProps) => {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {categories.map((category) => (
          <li key={category.id}>
            <div className="flex items-center justify-between px-4 py-4 sm:px-6">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-800 me-3">{category.name}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(category)}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => onDelete(category.id)}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-red-600 shadow-sm hover:bg-gray-50"
                >
                  ลบ
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
/* 
// src/components/category/CategoryBadge.tsx
import React from 'react';

type CategoryBadgeProps = {
  name: string;
  active?: boolean;
  onClick?: () => void;
};

export const CategoryBadge = ({ name, active = false, onClick }: CategoryBadgeProps) => {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium ${
        active
          ? 'bg-indigo-100 text-indigo-800'
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      {name}
    </span>
  );
};

// src/pages/CategoryPage.tsx
import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { CategoryForm } from '../components/category/CategoryForm';
import { CategoryList } from '../components/category/CategoryList';
import { Category } from '../lib/types';
import Swal from 'sweetalert2';

export const CategoryPage = () => {
  const { categories, loading, error, addCategory, updateCategory, deleteCategory } = useCategories();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleAddCategory = async (name: string) => {
    try {
      await addCategory(name);
      Swal.fire({
        title: 'สำเร็จ',
        text: 'เพิ่มกลุ่มเรื่องเรียบร้อยแล้ว',
        icon: 'success',
        confirmButtonText: 'ตกลง'
      });
    } catch (err: any) {
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: err.message,
        icon: 'error',
        confirmButtonText: 'ตกลง'
      });
    }
  };

  const handleUpdateCategory = async (name: string) => {
    if (editingCategory) {
      try {
        await updateCategory(editingCategory.id, name);
        setEditingCategory(null);
        Swal.fire({
          title: 'สำเร็จ',
          text: 'อัปเดตกลุ่มเรื่องเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง'
        });
      } catch (err: any) {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: err.message,
          icon: 'error',
          confirmButtonText: 'ตกลง'
        });
      }
    }
  };

  const handleDeleteCategory = async (id: string) => {
    Swal.fire({
      title: 'ยืนยันการลบ',
      text: 'คุณแน่ใจหรือไม่ว่าต้องการลบกลุ่มเรื่องนี้?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCategory(id);
          Swal.fire(
            'สำเร็จ',
            'ลบกลุ่มเรื่องเรียบร้อยแล้ว',
            'success'
          );
        } catch (err: any) {
          Swal.fire({
            title: 'เกิดข้อผิดพลาด',
            text: err.message,
            icon: 'error',
            confirmButtonText: 'ตกลง'
          });
        }
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">จัดการกลุ่มเรื่อง</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium mb-4">
          {editingCategory ? 'แก้ไขกลุ่มเรื่อง' : 'เพิ่มกลุ่มเรื่องใหม่'}
        </h2>
        <CategoryForm
          initialName={editingCategory?.name || ''}
          onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
          onCancel={editingCategory ? () => setEditingCategory(null) : undefined}
          isEditing={!!editingCategory}
        />
      </div>
      
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <h2 className="text-lg font-medium p-6 border-b">รายการกลุ่มเรื่องทั้งหมด</h2>
        
        {loading ? (
          <div className="p-6 text-center text-gray-500">กำลังโหลดข้อมูล...</div>
        ) : categories.length === 0 ? (
          <div className="p-6 text-center text-gray-500">ยังไม่มีกลุ่มเรื่อง</div>
        ) : (
          <CategoryList 
            categories={categories} 
            onEdit={setEditingCategory}
            onDelete={handleDeleteCategory}
          />
        )}
      </div>
    </div>
  );
};
 */