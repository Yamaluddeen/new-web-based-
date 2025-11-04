import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useAuth } from "../../services/useAuth";
import { useNavigate } from "react-router-dom";

type SignInFormValues = {
  email: string;
  password: string;
};

interface SignInFormProps {
  onSuccess?: () => void;
  logoSrc?: string;
  bgImageSrc?: string;
  eyeIconSrc?: string;
}

export const SignInForm = ({
  onSuccess,
  logoSrc,
  bgImageSrc,
  eyeIconSrc,
}: SignInFormProps) => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>();

  const onSubmit = async (data: SignInFormValues) => {
    try {
      const result = (await signIn(data.email, data.password)) as {
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
        if (onSuccess) onSuccess();
        else navigate("/dashboard");
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
      id="section-login"
      className="relative w-screen h-screen flex items-center justify-center m-0 p-0"
    >
      {/* Background Image */}
      {bgImageSrc && (
        <img
          src={bgImageSrc}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover object-center m-0 p-0"
        />
      )}

      {/* Overlay สีดำโปร่ง */}
      <div className="absolute inset-0 bg-black/50 m-0 p-0" />

      {/* Centered Login Form */}
      <div className="relative z-10 flex items-center justify-center w-full h-full m-0 p-0">
        {/* กล่องฟอร์มขนาดปกติ max-width 552px */}
        <div className="bg-white rounded-[18px] p-8 flex flex-col items-center gap-8 w-full max-w-[552px] shadow-lg">
          {/* Logo */}
          {logoSrc ? (
            <img src={logoSrc} alt="Logo" className="w-[188px] h-auto" />
          ) : (
            <span className="text-xl font-bold text-gray-600">LOGO</span>
          )}

          {/* Form */}
          <form
            className="w-full flex flex-col gap-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Header */}
            <div className="flex flex-col gap-2 text-left">
              <h1 className="text-[32px] font-bold text-[#060606] leading-[39px]">
                เข้าสู่ระบบ
              </h1>
              <p className="text-lg text-[#7f7f7f]">
                กรุณากรอกอีเมลและรหัสผ่านของคุณ
              </p>
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-4">
              {/* Email */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-base font-normal text-[#060606]"
                >
                  อีเมล
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="กรุณากรอกอีเมล"
                  className={`w-full border rounded-lg px-4 py-3 text-sm placeholder:text-[#c7c7c7] focus:outline-none focus:ring-2 focus:ring-[#42a7c3]/50 ${
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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-base font-normal text-[#060606]"
                >
                  รหัสผ่าน
                </label>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="กรุณากรอกรหัสผ่าน"
                    className={`w-full border rounded-lg px-4 py-3 pr-12 text-sm placeholder:text-[#c7c7c7] focus:outline-none focus:ring-2 focus:ring-[#42a7c3]/50 ${
                      errors.password ? "border-red-500" : "border-[#c7c7c7]"
                    }`}
                    {...register("password", {
                      required: "กรุณากรอกรหัสผ่าน",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400"
                  >
                    <img
                      src={
                        eyeIconSrc ||
                        "https://cdn-icons-png.flaticon.com/512/709/709612.png"
                      }
                      alt="toggle password visibility"
                      className="w-6 h-6"
                    />
                  </button>
                </div>
                <a
                  href="/forgot-password"
                  className="text-right text-xs text-[#42a7c3] opacity-60 hover:opacity-100 transition-opacity"
                >
                  ลืมรหัสผ่าน
                </a>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#a1d3e1] text-white text-base rounded-lg py-3 hover:bg-[#8bc9d9] transition-colors"
              >
                {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
              </button>

              <p className="text-base text-center">
                <span className="text-[#19191b]">ยังไม่มีบัญชีใช่ไหม? </span>
                <a href="/sign-up" className="text-[#42a7c3] hover:underline">
                  สร้างบัญชีใหม่
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
