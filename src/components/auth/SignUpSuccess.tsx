import { FiArrowLeft } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router";

const SignUpSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <FaCheckCircle className="text-blue-500 text-4xl" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">การลงทะเบียนสำเร็จ</h2>

          <p className="text-gray-600 mb-6">
            คุณได้ลงทะเบียนสำเร็จแล้ว กรุณาทำการเข้าสู่ระบบจากลิงค์ด้านล่างนี้
          </p>

          <Link
            to="/sign-in"
            className="flex items-center justify-center text-blue-500 hover:underline"
          >
            <FiArrowLeft className="mr-2" /> กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpSuccess;
