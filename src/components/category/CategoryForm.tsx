import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type CategoryFormProps = {
  initialName?: string;
  onSubmit: (name: string) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
};

type FormValues = {
  name: string;
};

export const CategoryForm = ({ 
  initialName = '', 
  onSubmit, 
  onCancel,
  isEditing = false 
}: CategoryFormProps) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset 
  } = useForm<FormValues>({
    defaultValues: {
      name: initialName
    }
  });

  const onSubmitHandler = async (data: FormValues) => {
    try {
      await onSubmit(data.name);
      if (!isEditing) {
        reset({ name: initialName });
      }
    } catch (error) {
      console.log(error)
      // Error handling is done in the parent component
    }
  };

  useEffect(() => {

      reset({ name: initialName });
    
  }, [initialName, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          ชื่อกลุ่มเรื่อง
        </label>
        <input
          id="name"
          type="text"
          className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
            errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
          }`}
          placeholder="ระบุชื่อกลุ่มเรื่อง"
          {...register("name", { 
            required: "กรุณาระบุชื่อกลุ่มเรื่อง", 
            minLength: { value: 2, message: "ชื่อกลุ่มเรื่องต้องมีอย่างน้อย 2 ตัวอักษร" } 
          })}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
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
          {isSubmitting ? 'กำลังดำเนินการ...' : isEditing ? 'บันทึกการเปลี่ยนแปลง' : 'บันทึกกลุ่มเรื่อง'}
        </button>
      </div>
    </form>
  );
};
