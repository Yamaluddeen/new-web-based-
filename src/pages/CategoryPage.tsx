import React, { useState } from 'react';
import Layout  from '../layouts/Layout';
import { useCategories } from '../services/useCategories';
import { CategoryForm } from '../components/category/CategoryForm';
import { CategoryList } from '../components/category/CategoryList';
import Swal from 'sweetalert2';

const CategoryPage: React.FC = () => {
  const { categories, loading, error, addCategory, updateCategory, deleteCategory } = useCategories();
  const [editCategory, setEditCategory] = useState<{ id: string; name: string } | null>(null);

  const handleAddCategory = async (name: string) => {
    try {
      await addCategory(name);
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ',
        text: 'เพิ่มกลุ่มเรื่องใหม่เรียบร้อยแล้ว',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err: unknown) {
      Swal.fire({
        icon: 'error',
        title: 'ไม่สามารถเพิ่มกลุ่มเรื่องได้',
        text: err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'
      });
    }
  };

  const handleUpdateCategory = async (id: string, name: string) => {
    try {
      await updateCategory(id, name);
      setEditCategory(null);
      Swal.fire({
        icon: 'success',
        title: 'สำเร็จ',
        text: 'แก้ไขกลุ่มเรื่องเรียบร้อยแล้ว',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err: unknown) {
      Swal.fire({
        icon: 'error',
        title: 'ไม่สามารถแก้ไขกลุ่มเรื่องได้',
        text: err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'ยืนยันการลบ',
      text: 'คุณแน่ใจหรือไม่ว่าต้องการลบกลุ่มเรื่องนี้? Memo ที่อยู่ในกลุ่มเรื่องนี้จะถูกลบด้วย',
      showCancelButton: true,
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      try {
        await deleteCategory(id);
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ',
          text: 'ลบกลุ่มเรื่องเรียบร้อยแล้ว',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err: unknown) {
        Swal.fire({
          icon: 'error',
          title: 'ไม่สามารถลบกลุ่มเรื่องได้',
          text: err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'
        });
      }
    }
  };

  const handleEditClick = (category: { id: string; name: string }) => {
    setEditCategory(category);
  };

  const handleCancelEdit = () => {
    setEditCategory(null);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">จัดการกลุ่มเรื่อง</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">
              {editCategory ? 'แก้ไขกลุ่มเรื่อง' : 'เพิ่มกลุ่มเรื่องใหม่'}
            </h2>
            <CategoryForm 
              onSubmit={editCategory ? 
                (name) => handleUpdateCategory(editCategory.id, name) : 
                handleAddCategory
              }
              initialName={editCategory?.name || ''}
              onCancel={editCategory ? handleCancelEdit : undefined}
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">กลุ่มเรื่องทั้งหมด</h2>
            {loading ? (
              <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : categories.length === 0 ? (
              <p className="text-gray-500">ยังไม่มีกลุ่มเรื่อง</p>
            ) : (
              <CategoryList 
                categories={categories}
                onEdit={handleEditClick}
                onDelete={handleDeleteCategory}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;