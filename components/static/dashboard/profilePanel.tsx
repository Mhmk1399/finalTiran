import { motion } from "framer-motion";
import { RiUser3Line, RiMapPinLine, RiPhoneLine } from "react-icons/ri";
import { UserProfile } from "@/types/type";
import { RiEditLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { useState } from "react";
import LocationSelector from "../LocationSelector";
interface ProfilePanelProps {
  userProfile: UserProfile | null;
  // onProfileUpdate?: () => void; // Add this prop for refresh callback
}
interface AddressEditFormProps {
  address: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}
const AddressEditForm: React.FC<AddressEditFormProps> = ({
  address,
  onSave,
  onCancel,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    address_type: address.address_type || "2",
    province_id: address.province?.id || "",
    city_id: address.city?.id || "",
    zipcode: address.zipcode || "",
    receiver_name: address.receiver_name || "",
    receiver_number: address.receiver_number || "",
    adress: address.adress || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add this function to handle location selection without form submission
  const handleLocationSelect = (
    provinceId: string,
    provinceName: string,
    cityId: string,
    cityName: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      province_id: provinceId,
      city_id: cityId,
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          انتخاب استان و شهر
        </label>
        {/* Add onClick handler to prevent form submission */}
        <div onClick={(e) => e.stopPropagation()}>
          <LocationSelector
            onLocationSelected={handleLocationSelect}
            className="border border-gray-300 rounded-md"
          />
        </div>
        {formData.province_id && formData.city_id && (
          <p className="text-sm text-green-600 mt-2">
            ✓ استان و شهر انتخاب شده (استان: {formData.province_id}, شهر:{" "}
            {formData.city_id})
          </p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام گیرنده
            </label>
            <input
              type="text"
              name="receiver_name"
              value={formData.receiver_name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              شماره تماس
            </label>
            <input
              type="tel"
              name="receiver_number"
              value={formData.receiver_number}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              کد پستی
            </label>
            <input
              type="text"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Move LocationSelector outside form context or prevent its events */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            آدرس کامل
          </label>
          <textarea
            name="adress"
            value={formData.adress}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 disabled:opacity-50"
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
};

const ProfilePanel = ({ userProfile }: ProfilePanelProps) => {
  console.log(userProfile);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
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

  const handleSaveAddress = async (addressData: any) => {
    setIsUpdatingAddress(true);

    try {
      const token = localStorage.getItem("token");
      const addressId = localStorage.getItem("address_id");

      if (!token) {
        toast.error("لطفا دوباره وارد شوید");
        return;
      }

      if (!addressId) {
        toast.error("شناسه آدرس یافت نشد");
        return;
      }

      const response = await fetch("/api/address", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          address_id: addressId,
          ...addressData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "خطا در به‌روزرسانی آدرس");
      }

      toast.success("آدرس با موفقیت به‌روزرسانی شد");
      setIsEditingAddress(false);

      // Call the refresh callback to update parent component
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error(
        error instanceof Error ? error.message : "خطا در به‌روزرسانی آدرس"
      );
    } finally {
      setIsUpdatingAddress(false);
    }
  };

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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <RiMapPinLine className="w-5 h-5 ml-2 text-gray-700" />
              <h3 className="text-lg font-medium text-gray-800">
                آدرس انتخاب شده
              </h3>
            </div>
            <button
              onClick={() => setIsEditingAddress(true)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
            >
              <RiEditLine className="w-4 h-4" />
              ویرایش
            </button>
          </div>

          {isEditingAddress ? (
            <AddressEditForm
              address={selectedAddress}
              onSave={handleSaveAddress}
              onCancel={() => setIsEditingAddress(false)}
              isLoading={isUpdatingAddress}
            />
          ) : (
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
                  {selectedAddress.province?.name} -{" "}
                  {selectedAddress.city?.name}
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
          )}
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
