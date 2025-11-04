import { ReactNode } from "react";
import { useAuth } from "../services/useAuth";
import { Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";

type LayoutProps = {
  children: ReactNode;
  requireAuth?: boolean; // ถ้า true -> ต้อง login ก่อนถึงเข้าได้
  fullScreen?: boolean;  // สำหรับหน้าที่ต้องการ layout เต็มจอ (เช่น Login)
};

const Layout = ({ children, requireAuth = true, fullScreen = false }: LayoutProps) => {
  const { user, loading } = useAuth();

  // แสดงหน้าโหลดตอนรอเช็กสถานะผู้ใช้
  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // ถ้า requireAuth และไม่มี user → redirect ไปหน้า sign-in
  if (requireAuth && !user) {
    return <Navigate to="/sign-in" replace />;
  }

  // ถ้าเป็นหน้าเต็มจอ (เช่นหน้า Login) → ไม่ต้องแสดง Sidebar หรือ margin/padding, สูง-กว้างเต็มหน้าจอ
  if (fullScreen || !requireAuth) {
    return (
      <div className="w-screen h-screen flex items-center justify-center m-0 p-0">
        {children}
      </div>
    );
  }

  // Layout ปกติ (มี Sidebar)
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar เฉพาะเมื่อ login แล้ว */}
      {user && (
        <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white shadow-md">
          <Sidebar />
        </aside>
      )}

      {/* ส่วนเนื้อหา */}
      <div className={`${user ? "lg:ml-64" : ""} flex-1 min-h-screen`}>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
