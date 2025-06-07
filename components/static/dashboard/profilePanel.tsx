import { motion } from "framer-motion";
import { RiUser3Line, RiMapPinLine, RiPhoneLine } from "react-icons/ri";
import { UserProfile } from "@/types/type";

interface ProfilePanelProps {
  userProfile: UserProfile | null;
}

const ProfilePanel = ({ userProfile }: ProfilePanelProps) => {
  if (!userProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">در حال بارگذاری اطلاعات...</p>
      </div>
    );
  }

  const getSexDisplay = (sexKey: number) => {
    switch (sexKey) {
      case 1:
        return "مرد";
      case 2:
        return "زن";
      default:
        return "تعیین نشده";
    }
  };

  const selectedAddress = userProfile.addresses?.find((addr) => addr.selected);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <RiUser3Line className="w-6 h-6 ml-2 text-gray-700" />
        <h2 className="text-xl font-semibold text-gray-800">اطلاعات شخصی</h2>
      </div>

      {/* Personal Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-6 shadow-sm border"
      >
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          اطلاعات کاربری
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              شماره تلفن
            </label>
            <p className="p-3 bg-gray-50 rounded-md">
              {userProfile.user?.username || "تعیین نشده"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام
            </label>
            <p className="p-3 bg-gray-50 rounded-md">
              {userProfile.user?.first_name || "تعیین نشده"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام خانوادگی
            </label>
            <p className="p-3 bg-gray-50 rounded-md">
              {userProfile.user?.last_name || "تعیین نشده"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ایمیل
            </label>
            <p className="p-3 bg-gray-50 rounded-md">
              {userProfile.user?.email || "تعیین نشده"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              شغل
            </label>
            <p className="p-3 bg-gray-50 rounded-md">
              {userProfile.user?.job || "تعیین نشده"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              جنسیت
            </label>
            <p className="p-3 bg-gray-50 rounded-md">
              {getSexDisplay(userProfile.user?.sex?.key)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              کد ملی
            </label>
            <p className="p-3 bg-gray-50 rounded-md">
              {userProfile.nationalID || "تعیین نشده"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              تاریخ تولد
            </label>
            <p className="p-3 bg-gray-50 rounded-md">
              {userProfile.birthday || "تعیین نشده"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ملیت
            </label>
            <p className="p-3 bg-gray-50 rounded-md">
              {userProfile.national?.value || "تعیین نشده"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نوع شخص
            </label>
            <p className="p-3 bg-gray-50 rounded-md">
              {userProfile.type_legal?.value || "تعیین نشده"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              وضعیت احراز هویت
            </label>
            <p
              className={`p-3 rounded-md ${
                userProfile.identity_verification?.key === 1
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {userProfile.identity_verification?.value || "تعیین نشده"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نوع کاربر
            </label>
            <p className="p-3 bg-gray-50 rounded-md">
              {userProfile.type?.type_name || "تعیین نشده"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Selected Address */}
      {selectedAddress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm border"
        >
          <div className="flex items-center mb-4">
            <RiMapPinLine className="w-5 h-5 ml-2 text-gray-700" />
            <h3 className="text-lg font-medium text-gray-800">
              آدرس انتخاب شده
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نام گیرنده
              </label>
              <p className="p-3 bg-gray-50 rounded-md flex items-center">
                <RiUser3Line className="w-4 h-4 ml-2 text-gray-500" />
                {selectedAddress.receiver_name}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                شماره تماس
              </label>
              <p className="p-3 bg-gray-50 rounded-md flex items-center">
                <RiPhoneLine className="w-4 h-4 ml-2 text-gray-500" />
                {selectedAddress.receiver_number}
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                آدرس کامل
              </label>
              <p className="p-3 bg-gray-50 rounded-md">
                {selectedAddress.province?.name} - {selectedAddress.city?.name}
                <br />
                {selectedAddress.adress}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                کد پستی
              </label>
              <p className="p-3 bg-gray-50 rounded-md">
                {selectedAddress.zipcode}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Address Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg p-6 shadow-sm border"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <RiMapPinLine className="w-5 h-5 ml-2 text-gray-700" />
            <h3 className="text-lg font-medium text-gray-800">خلاصه آدرس‌ها</h3>
          </div>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
            {userProfile.addresses?.length || 0} آدرس
          </span>
        </div>

        {userProfile.addresses && userProfile.addresses.length > 0 ? (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {userProfile.addresses.slice(0, 5).map((address) => (
              <div
                key={address.id}
                className={`p-3 rounded-md border ${
                  address.selected
                    ? "border-blue-200 bg-blue-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-800">
                      {address.receiver_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {address.province?.name} - {address.city?.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {address.adress}
                    </p>
                  </div>
                  {address.selected && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                      انتخاب شده
                    </span>
                  )}
                </div>
              </div>
            ))}
            {userProfile.addresses.length > 5 && (
              <p className="text-sm text-gray-500 text-center pt-2">
                و {userProfile.addresses.length - 5} آدرس دیگر...
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            هیچ آدرسی ثبت نشده است
          </p>
        )}
      </motion.div>

      {/* Profile Completion Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg p-6 shadow-sm border"
      >
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          وضعیت تکمیل پروفایل
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            پروفایل شما {userProfile.complete ? "تکمیل شده" : "ناقص"} است
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              userProfile.complete
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {userProfile.complete ? "تکمیل شده" : "نیاز به تکمیل"}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePanel;
