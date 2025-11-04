import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Category, Memo } from '../../types/types';

type MemoFormProps = {
  categories: Category[];
  initialData?: Memo;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
};

type FormData = {
  title: string;
  content: string;
  categoryId: string;
};

export const MemoForm = ({ 
  categories, 
  initialData, 
  onSubmit, 
  onCancel,
  isEditing = false 
}: MemoFormProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset 
  } = useForm<FormData>({
    defaultValues: initialData
      ? {
          title: initialData.title,
          content: initialData.content,
          categoryId: initialData.category_id,
        }
      : {
          title: '',
          content: '',
          categoryId: categories.length > 0 ? categories[0].id : '',
        }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmitHandler = async (data: FormData) => {
    try {
      await onSubmit({
        ...data,
        imageFile
      } as any);
      
      if (!isEditing) {
        reset();
        setImageFile(null);
        setImagePreview(null);
      }
    } catch (error) {
      console.log(error)
      // Error handling is done in the parent component
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          หัวข้อ
        </label>
        <input
          id="title"
          type="text"
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
            errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
          placeholder="ระบุหัวข้อ"
          {...register("title", { 
            required: "กรุณาระบุหัวข้อ", 
            minLength: { value: 2, message: "หัวข้อต้องมีอย่างน้อย 2 ตัวอักษร" } 
          })}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
          กลุ่มเรื่อง
        </label>
        <select
          id="categoryId"
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
            errors.categoryId ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
          {...register("categoryId", { 
            required: "กรุณาเลือกกลุ่มเรื่อง"
          })}
        >
          {categories.length === 0 ? (
            <option value="" disabled>ไม่มีกลุ่มเรื่อง</option>
          ) : (
            categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))
          )}
        </select>
        {errors.categoryId && (
          <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          เนื้อหา
        </label>
        <textarea
          id="content"
          rows={5}
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
            errors.content ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
          placeholder="ระบุเนื้อหา"
          {...register("content", { 
            required: "กรุณาระบุเนื้อหา", 
            minLength: { value: 5, message: "เนื้อหาต้องมีอย่างน้อย 5 ตัวอักษร" } 
          })}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          รูปภาพ
        </label>
        <div className="mt-1 flex items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
        {imagePreview && (
          <div className="mt-2 relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-24 w-auto object-cover rounded-md"
            />
            <button
              type="button"
              onClick={() => {
                setImageFile(null);
                setImagePreview(null);
              }}
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            ยกเลิก
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isSubmitting ? 'กำลังดำเนินการ...' : isEditing ? 'บันทึกการเปลี่ยนแปลง' : 'เพิ่มบันทึก'}
        </button>
      </div>
    </form>
  );
};