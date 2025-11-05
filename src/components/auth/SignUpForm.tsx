import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useAuth } from "../../services/useAuth";
import { useNavigate } from "react-router-dom";

type SignUpFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

interface SignUpFormProps {
  onSuccess?: () => void;
  logoSrc?: string;
  bgImageSrc?: string;
  eyeIconSrc?: string;
}

export const SignUpForm = ({
  onSuccess,
  logoSrc,
  bgImageSrc,
  eyeIconSrc,
}: SignUpFormProps) => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>();

  const onSubmit = async (data: SignUpFormValues) => {
    if (data.password !== data.confirmPassword) {
      Swal.fire({
        title: "รหัสผ่านไม่ตรงกัน",
        text: "กรุณากรอกรหัสผ่านให้ตรงกัน",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    try {
      const result = (await signUp(data.email, data.password)) as {
        error?: { message: string };
      };

      if (result?.error) {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: result.error.message,
          icon: "error",
          confirmButtonText: "ตกลง",
        });
      } else {
        Swal.fire({
          title: "สมัครสมาชิกสำเร็จ!",
          text: "คุณสามารถเข้าสู่ระบบได้ทันที",
          icon: "success",
          confirmButtonText: "ตกลง",
        }).then(() => {
          if (onSuccess) onSuccess();
          else navigate("/sign-in");
        });
      }
    } catch (err: unknown) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text:
          err instanceof Error
            ? err.message
            : "เกิดข้อผิดพลาดไม่ทราบสาเหตุ",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

  return (
    <section
      id="section-signup"
      className="relative w-screen h-screen flex items-center justify-center"
    >
      {/* พื้นหลัง */}
      {bgImageSrc && (
        <img
          src={bgImageSrc}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      )}
      <div className="absolute inset-0 bg-black/50" />

      {/* กล่องฟอร์ม */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <div className="bg-white rounded-[16px] p-6 flex flex-col items-center gap-6 w-full max-w-[420px] max-h-[90vh] shadow-lg overflow-y-auto">
          {/* โลโก้ */}
          {logoSrc ? (
            <img src={logoSrc} alt="Logo" className="w-[140px] h-auto" />
          ) : (
            <span className="text-lg font-bold text-gray-600">LOGO</span>
          )}

          {/* ฟอร์ม */}
          <form
            className="w-full flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* หัวข้อ */}
            <div className="flex flex-col gap-1 text-left">
              <h1 className="text-[26px] font-bold text-[#060606] leading-[32px]">
                สร้างบัญชีใหม่
              </h1>
              <p className="text-sm text-[#7f7f7f]">
                กรอกข้อมูลเพื่อลงทะเบียนบัญชีใหม่ของคุณ
              </p>
            </div>

            {/* ช่องกรอกข้อมูล */}
            <div className="flex flex-col gap-3">
              {/* อีเมล */}
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-sm text-[#060606]">
                  อีเมล
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="example@email.com"
                  className={`w-full border rounded-lg px-3 py-2 text-sm placeholder:text-[#c7c7c7] focus:outline-none focus:ring-2 focus:ring-[#42a7c3]/50 ${
                    errors.email ? "border-red-500" : "border-[#c7c7c7]"
                  }`}
                  {...register("email", {
                    required: "กรุณากรอกอีเมล",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "รูปแบบอีเมลไม่ถูกต้อง",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* รหัสผ่าน */}
              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-sm text-[#060606]">
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="รหัสผ่านอย่างน้อย 6 ตัวอักษร"
                    className={`w-full border rounded-lg px-3 py-2 pr-10 text-sm placeholder:text-[#c7c7c7] focus:outline-none focus:ring-2 focus:ring-[#42a7c3]/50 ${
                      errors.password ? "border-red-500" : "border-[#c7c7c7]"
                    }`}
                    {...register("password", {
                      required: "กรุณากรอกรหัสผ่าน",
                      minLength: {
                        value: 6,
                        message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"
                  >
                    <img
                      src={
                        eyeIconSrc ||
                        "https://cdn-icons-png.flaticon.com/512/709/709612.png"
                      }
                      alt="toggle password visibility"
                      className="w-5 h-5"
                    />
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* ยืนยันรหัสผ่าน */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm text-[#060606]"
                >
                  ยืนยันรหัสผ่าน
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="พิมพ์รหัสผ่านอีกครั้ง"
                    className={`w-full border rounded-lg px-3 py-2 pr-10 text-sm placeholder:text-[#c7c7c7] focus:outline-none focus:ring-2 focus:ring-[#42a7c3]/50 ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-[#c7c7c7]"
                    }`}
                    {...register("confirmPassword", {
                      required: "กรุณายืนยันรหัสผ่าน",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"
                  >
                    <img
                      src={
                        eyeIconSrc ||
                        "https://cdn-icons-png.flaticon.com/512/709/709612.png"
                      }
                      alt="toggle password visibility"
                      className="w-5 h-5"
                    />
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* ปุ่ม */}
            <div className="flex flex-col items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#a1d3e1] text-white text-sm rounded-lg py-2.5 hover:bg-[#8bc9d9] transition-colors"
              >
                {isSubmitting ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
              </button>

              <p className="text-sm text-center">
                <span className="text-[#19191b]">มีบัญชีอยู่แล้ว? </span>
                <a href="/sign-in" className="text-[#42a7c3] hover:underline">
                  เข้าสู่ระบบ
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
