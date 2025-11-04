import { Link, useNavigate } from 'react-router';
import { useAuth } from '../services/useAuth';

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/sign-in');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold text-indigo-600">
            Memo App
          </Link>
          
          {user && (
            <div className="flex items-center space-x-4">
              <nav className="flex items-center space-x-4">
                <Link to="/memos" className="text-sm text-gray-700 hover:text-indigo-600">
                  บันทึกของฉัน
                </Link>
                <Link to="/categories" className="text-sm text-gray-700 hover:text-indigo-600">
                  กลุ่มเรื่อง
                </Link>
              </nav>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  ออกจากระบบ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};