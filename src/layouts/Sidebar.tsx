import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../services/useAuth";
import { useCategories } from "../services/useCategories";
import { FiBook, FiTag, FiHome } from "react-icons/fi";

const Sidebar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/sign-in");
  };

  const { categories, loading } = useCategories();
  const location = useLocation();

  return (
    <>
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-gray-800 text-white p-6 transform transition-transform duration-300 ease-in-out z-10 translate-x-0"
          } lg:translate-x-0`}
      >
        <div className="flex items-center text-center  mb-6">
          <span className="text-xl text-white  font-semibold rounded-xl bg-sky-700 w-full p-3">
            Memo App
          </span>
        </div>

        <nav className="space-y-2">
          <Link
            to="/memos"
            className={`flex items-center px-4 py-2 rounded-md hover:bg-gray-700 ${
              location.pathname === "/memos" && !location.search
                ? "bg-gray-700"
                : ""
            }`}
          >
            <FiHome className="mr-2" /> All Memos
          </Link>

          <Link
            to="/categories"
            className={`flex items-center px-4 py-2 rounded-md hover:bg-gray-700 ${
              location.pathname === "/categories" ? "bg-gray-700" : ""
            }`}
          >
            <FiTag className="mr-2" /> Manage Categories
          </Link>

          <div className="pt-4">
            <div className="text-sm text-gray-400 mb-2">Categories</div>
            {loading ? (
              <div className="px-4 py-2">Loading...</div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/memos?category=${category.id}`}
                    className={`flex items-center px-4 py-2 text-sm rounded-md hover:bg-gray-700 ${
                      location.search === `?category=${category.id}`
                        ? "bg-gray-700"
                        : ""
                    }`}
                  >
                    <FiBook className="mr-2" /> {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>



            <div className="absolute bottom-6 left-0 w-full flex flex-col items-center space-x-2">
            {user && <div className="text-sm text-white mb-3">{user.email}</div>}
            <button onClick={handleSignOut} className="text-sm font-semibold text-white bg-sky-500 px-5 py-2 rounded-2xl">
              ออกจากระบบ
            </button>
            </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
