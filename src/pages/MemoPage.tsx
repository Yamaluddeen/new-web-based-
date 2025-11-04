import  { useState } from 'react';
import { useMemos } from '../services/useMemos';
import { useCategories } from '../services/useCategories';
import { MemoList } from '../components/memo/MemoList';
import { MemoForm } from '../components/memo/MemoForm';
import { MemoFilter } from '../components/memo/MemoFilter';
import { Memo } from '../types/types';
import Swal from 'sweetalert2';
import Layout from '../layouts/Layout';

export  const MemoPage = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [editingMemo, setEditingMemo] = useState<Memo | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { categories, loading: categoriesLoading } = useCategories();
  const { 
    memos, 
    loading: memosLoading, 
    error, 
    addMemo, 
    updateMemo, 
    deleteMemo 
  } = useMemos(selectedCategoryId || undefined);

  // สร้าง categoryMap สำหรับการแสดงชื่อกลุ่มเรื่อง
  const categoryMap = categories.reduce(
    (acc, category) => {
      acc[category.id] = category.name;
      return acc;
    },
    {} as { [key: string]: string }
  );

  const handleAddMemo = async (data: any) => {
    try {
      await addMemo(data.title, data.content, data.categoryId, data.imageFile);
      setIsFormVisible(false);
      Swal.fire({
        title: 'สำเร็จ',
        text: 'เพิ่มบันทึกเรียบร้อยแล้ว',
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

  const handleUpdateMemo = async (data: any) => {
    if (editingMemo) {
      try {
        await updateMemo(editingMemo.id, data.title, data.content, data.categoryId, data.imageFile);
        setEditingMemo(null);
        Swal.fire({
          title: 'สำเร็จ',
          text: 'อัปเดตบันทึกเรียบร้อยแล้ว',
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

  const handleDeleteMemo = async (id: string) => {
    Swal.fire({
      title: 'ยืนยันการลบ',
      text: 'คุณแน่ใจหรือไม่ว่าต้องการลบบันทึกนี้?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteMemo(id);
          Swal.fire(
            'สำเร็จ',
            'ลบบันทึกเรียบร้อยแล้ว',
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
    <Layout>
    <div className="container w-175 mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold me-3">บันทึกของฉัน</h1>
        <button
          onClick={() => {
            setEditingMemo(null);
            setIsFormVisible(!isFormVisible);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md"
        >
          {isFormVisible ? 'ซ่อนฟอร์ม' : '+ เพิ่มบันทึกใหม่'}
        </button>
      </div>
      
      {isFormVisible && !editingMemo && (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">เพิ่มบันทึกใหม่</h2>
          {categoriesLoading ? (
            <p>กำลังโหลดข้อมูลกลุ่มเรื่อง...</p>
          ) : categories.length === 0 ? (
            <div className="text-yellow-700 bg-yellow-50 p-4 rounded-md">
              <p>คุณยังไม่มีกลุ่มเรื่อง กรุณาเพิ่มกลุ่มเรื่องก่อนที่จะสร้างบันทึก</p>
              <a href="/categories" className="text-indigo-600 hover:text-indigo-800 font-medium">
                ไปที่หน้าจัดการกลุ่มเรื่อง
              </a>
            </div>
          ) : (
            <MemoForm
              categories={categories}
              onSubmit={handleAddMemo}
              onCancel={() => setIsFormVisible(false)}
            />
          )}
        </div>
      )}
      
      {editingMemo && (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">แก้ไขบันทึก</h2>
          <MemoForm
            categories={categories}
            initialData={editingMemo}
            onSubmit={handleUpdateMemo}
            onCancel={() => setEditingMemo(null)}
            isEditing={true}
          />
        </div>
      )}
      
      {!categoriesLoading && categories.length > 0 && (
        <MemoFilter
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />
      )}
      
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}
      
      {memosLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
        </div>
      ) : (
        <MemoList
          memos={memos}
          categoryMap={categoryMap}
          onEdit={(memo) => {
            setEditingMemo(memo);
            setIsFormVisible(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onDelete={handleDeleteMemo}
        />
      )}
    </div>
    </Layout>
  );
};
