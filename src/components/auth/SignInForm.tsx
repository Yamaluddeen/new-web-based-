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
      {/* 🔹 Background Image */}
      {bgImageSrc && (
        <img
          src={bgImageSrc}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      )}

      {/* 🔹 Overlay สีดำโปร่ง 50% */}
      <div className="absolute inset-0 bg-black/50" />

      {/* 🔹 Centered Login Form */}
      <div className="relative z-10 flex items-center justify-center w-full h-full px-4">
        <div className="bg-white rounded-[16px] p-6 sm:p-8 flex flex-col items-center gap-6 w-full max-w-[400px] sm:max-w-[480px] shadow-lg">
          {/* Logo */}
          {logoSrc ? (
            <img
              src={logoSrc}
              alt="Logo"
              className="w-[120px] h-auto sm:w-[150px]"
            />
          ) : (
            <span className="text-lg font-bold text-gray-600">LOGO</span>
          )}

          {/* Form */}
          <form
            className="w-full flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Header */}
            <div className="text-left w-full mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#060606]">
                เข้าสู่ระบบ
              </h1>
              <p className="text-sm sm:text-base text-[#7f7f7f] mt-1">
                กรอกอีเมลและรหัสผ่านของคุณ
              </p>
            </div>

            {/* Inputs */}
            <div className="flex flex-col gap-3">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-sm sm:text-base text-[#060606]"
                >
                  อีเมล
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="กรุณากรอกอีเมล"
                  className={`w-full border rounded-md px-3 py-2 text-sm placeholder:text-[#c7c7c7] focus:outline-none focus:ring-2 focus:ring-[#42a7c3]/50 ${
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
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="password"
                  className="text-sm sm:text-base text-[#060606]"
                >
                  รหัสผ่าน
                </label>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="กรุณากรอกรหัสผ่าน"
                    className={`w-full border rounded-md px-3 py-2 pr-10 text-sm placeholder:text-[#c7c7c7] focus:outline-none focus:ring-2 focus:ring-[#42a7c3]/50 ${
                      errors.password ? "border-red-500" : "border-[#c7c7c7]"
                    }`}
                    {...register("password", {
                      required: "กรุณากรอกรหัสผ่าน",
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
                <a
                  href="/forgot-password"
                  className="text-right text-xs text-[#42a7c3] opacity-60 hover:opacity-100 transition-opacity mt-1"
                >
                  ลืมรหัสผ่าน
                </a>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-0.5">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#a1d3e1] text-white text-sm sm:text-base rounded-md py-2.5 hover:bg-[#8bc9d9] transition-colors"
              >
                {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
              </button>

              <p className="text-sm sm:text-base text-center">
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
