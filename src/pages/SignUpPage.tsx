import { Link } from 'react-router';
import { useAuth } from '../services/useAuth';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

type SignUpFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

export const SignUpPage = () => {
  const { signUp } = useAuth();
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    watch
  } = useForm<SignUpFormValues>();

  const password = watch('password');

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      const result = await signUp(data.email, data.password); // ลบ username ออกให้ตรงกับ AuthContext ใหม่
      if (result?.error) {
        const errorMessage = (result.error as { message: string }).message || 'เกิดข้อผิดพลาด';
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'ตกลง'
        });
      } else {
        Swal.fire({
          title: 'ลงทะเบียนสำเร็จ',
          text: 'กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ',
          icon: 'success',
          confirmButtonText: 'ตกลง'
        });
      }
    } catch (err: unknown) {
      Swal.fire({
        title: 'เกิดข้อผิดพลาด',
        text: err instanceof Error ? err.message : 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ',
        icon: 'error',
        confirmButtonText: 'ตกลง'
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">ลงทะเบียนผู้ใช้ใหม่</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">อีเมล</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="อีเมล"
                {...register("email", { 
                  required: "กรุณากรอกอีเมล", 
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "รูปแบบอีเมลไม่ถูกต้อง"
                  }
                })}
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                {...register("password", { 
                  required: "กรุณากรอกรหัสผ่าน", 
                  minLength: { value: 6, message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }
                })}
              />
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">ยืนยันรหัสผ่าน</label>
              <input
                id="confirmPassword"
                type="password"
                className={`mt-1 block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="ยืนยันรหัสผ่าน"
                {...register("confirmPassword", { 
                  required: "กรุณายืนยันรหัสผ่าน",
                  validate: value => value === password || "รหัสผ่านไม่ตรงกัน"
                })}
              />
              {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isSubmitting ? 'กำลังดำเนินการ...' : 'ลงทะเบียน'}
            </button>
          </div>

          {/* Link to Sign In */}
          <div className="text-sm text-center">
            <Link to="/sign-in" className="font-medium text-indigo-600 hover:text-indigo-500">
              มีบัญชีแล้ว? เข้าสู่ระบบที่นี่
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
