import { motion } from "framer-motion";
import { UserProfile } from "@/types/type";
import {
  RiShoppingBag3Line,
  RiUser3Line,
  RiLogoutBoxRLine,
} from "react-icons/ri";

interface DashboardSidebarProps {
  activePanel: string;
  setActivePanel: (panel: string) => void;
  userProfile: UserProfile | null;
}

const DashboardSidebar = ({
  activePanel,
  setActivePanel,
  userProfile,
}: DashboardSidebarProps) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth";
  };

  const menuItems = [
    {
      id: "orders",
      label: "سفارش‌های من",
      icon: <RiShoppingBag3Line className="w-5 h-5" />,
    },
    {
      id: "profile",
      label: "اطلاعات شخصی",
      icon: <RiUser3Line className="w-5 h-5" />,
    },
   
  ];

  return (
    <div className="bg-white shadow-md p-6">
      {/* User Profile Summary */}
      <div className="flex flex-col items-center mb-8">
        <h3 className="text-lg font-semibold text-gray-900">
          داشبورد /
          {userProfile?.user.first_name
            ? `${userProfile?.user.first_name} ${userProfile?.user?.last_name}`
            : userProfile?.user.username}
        </h3>
        <p className="text-sm text-gray-50">{userProfile?.user?.email}</p>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActivePanel(item.id)}
            className={`w-full flex items-center py-3 px-4 rounded-sm text-right transition-colors ${
              activePanel === item.id
                ? "bg-gray-800 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="ml-3">{item.icon}</span>
            {item.label}
          </motion.button>
        ))}

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center py-3 px-4 rounded-md text-right text-red-600 hover:bg-red-50 transition-colors mt-8"
        >
          <span className="ml-3">
            <RiLogoutBoxRLine className="w-5 h-5" />
          </span>
          خروج از حساب
        </motion.button>
      </nav>
    </div>
  );
};

export default DashboardSidebar;
