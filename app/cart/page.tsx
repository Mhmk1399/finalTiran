"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiDeleteBin6Line,
  RiAddLine,
  RiSubtractLine,
  RiArrowLeftLine,
  RiShoppingCartLine,
} from "react-icons/ri";
import { useCart } from "@/context/cartContext";
import { useRouter } from "next/navigation";
import { UserProfile } from "@/types/type";
import jMoment from "moment-jalaali";
import PersianDatePicker from "@/components/static/jalaliDatePicker";
import { getCheckoutInfo, completeCheckout } from "@/middleware/checkout";
import { toast } from "react-toastify";
import moment from "moment";
// Initialize jMoment
jMoment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });

export interface PaymentMethod {
  id: number;
  title: string;
  description?: string;
  type?: string;
  is_active?: boolean;
}

// export interface CheckoutData {
//   payMethods: PaymentMethod[];
//   sendMethods?: any[];
//   // Add other properties as needed
// }

const CartPage = () => {
  const router = useRouter();
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const [loading, setLoading] = useState(true);

  // User data - in a real app, you'd fetch this from your auth system
  const [userAccount, setUserAccount] = useState<UserProfile | null>(null);
  const [userDataLoading, setUserDataLoading] = useState(true); // Shipping method options
  console.log(userDataLoading);

  const [selectedDate, setSelectedDate] = useState("1404/03/01");
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<string>(
    moment().add(1, "day").format("jYYYY/jMM/jDD")
  );

  console.log(setSelectedDeliveryDate);
  // Payment method options

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number>(0);
  // Description and credit deduction
  const [description, setDescription] = useState("");
  // Checkout state
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState("");

  // Add these new state variables after existing ones
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState<
    PaymentMethod[]
  >([]);
  const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(false);

  const fetchUserAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Store current page URL for redirect after login
      const currentUrl = window.location.pathname + window.location.search;
      localStorage.setItem("redirectAfterLoginToCart", currentUrl);
      router.replace("/auth");
      return;
    }

    try {
      setUserDataLoading(true);
      const response = await fetch("/api/user", {
        headers: {
          method: "GET",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data.success && data.data) {
        setUserAccount(data.data);
      } else {
        console.error("No account data found:", data);
        // Set a fallback ID if needed
      }
    } catch (error) {
      console.error("Error fetching user account:", error);
      // Set a fallback ID if needed
    } finally {
      setUserDataLoading(false);
    }
  };
  const fetchPaymentMethods = async () => {
    const addressId = localStorage.getItem("address_id");
    const token = localStorage.getItem("token");

    if (!addressId || !token) {
      return;
    }

    try {
      setPaymentMethodsLoading(true);
      const response = await fetch(
        `/api/cart/checkout?address_id=${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "خطا در دریافت اطلاعات پرداخت");
      }

      if (data.success && data.data) {
        setAvailablePaymentMethods(data.data.payMethods || []);

        // Set default selections if available
        if (data.data.payMethods && data.data.payMethods.length > 0) {
          setSelectedPaymentMethod(data.data.payMethods[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      toast.error("خطا در دریافت روش‌های پرداخت", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setPaymentMethodsLoading(false);
    }
  };

  // Call the fetch function when the component mounts
  useEffect(() => {
    fetchUserAccount();
    fetchPaymentMethods();
  }, []);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // Handle shipping method change

  // Handle payment method change
  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedPaymentMethod(Number(e.target.value)); // Convert to number
  };

  // Format price with commas for thousands
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle checkout process
  const handleCheckout = async () => {
    if (items.length === 0) {
      setError("سبد خرید شما خالی است");
      return;
    }

    const addressId = localStorage.getItem("address_id");
    if (!addressId) {
      setError(
        "آدرس تحویل انتخاب نشده است. لطفا ابتدا یک محصول به سبد خرید اضافه کنید تا آدرس ثبت شود."
      );
      return;
    }

    if (!selectedDeliveryDate) {
      setError("لطفا تاریخ تحویل را انتخاب کنید.");
      return;
    }
    setCheckoutLoading(true);
    setError("");

    try {
      // 1. First, ensure all cart items are added to server cart
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("لطفا وارد حساب کاربری خود شوید");
      }

      // Add each item to server cart to ensure cart is not empty
      for (const item of items) {
        try {
          await fetch("/api/cart/index", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              variety_id: parseInt(item.id),
              quantity: item.quantity,
              unit_id: 1,
            }),
          });
        } catch (addError) {
          console.warn(
            `Failed to add item ${item.id} to server cart:`,
            addError
          );
          // Continue with other items
        }
      }

      // 2. Get checkout information

      const checkoutInfo = await getCheckoutInfo(parseInt(addressId));

      if (!checkoutInfo.sendMethods || checkoutInfo.sendMethods.length === 0) {
        throw new Error("روش ارسال در دسترس نیست");
      }
      // 3. Use the selected send method or first available one

      // const sendMethod =
      //   checkoutInfo.sendMethods.find(
      //     (method: any) => method.id === selectedShippingMethod
      //   ) || checkoutInfo.sendMethods[0];

      // 4. Use selectedPaymentMethod directly (it's already the ID)
      const payMethodId = selectedPaymentMethod;

      if (!payMethodId) {
        throw new Error("روش پرداخت انتخاب نشده است");
      }

      // 5. Get the receive date
      const englishDate = selectedDate.replace(/[۰-۹]/g, (match) => {
        const persianDigits = [
          "۰",
          "۱",
          "۲",
          "۳",
          "۴",
          "۵",
          "۶",
          "۷",
          "۸",
          "۹",
        ];
        return persianDigits.indexOf(match).toString();
      });

      // if (sendMethod.receives && sendMethod.receives.length > 0) {
      //   // Use the first available receive date if exists
      //   receiveDate = sendMethod.receives[0].date;
      // }

      // 6. Complete the checkout process

      const result = await completeCheckout(
        parseInt(addressId),
        description,
        // sendMethod.id,
        payMethodId, // Use the ID directly
        englishDate
      );
      console.log("Checkout result:", result);

      // 7. Handle the result
      if (result && result.success) {
        const { data } = result;

        // Store order information in localStorage for later use
        localStorage.setItem(
          "current_order_id",
          data.order_id?.toString() || ""
        );
        localStorage.setItem("payment_type", data.payment_type || "");

        // Check payment type and redirect accordingly
        if (data.payment_type === "online" && data.go_to_ipg_url) {
          // Show success message before redirect
          toast.success("سفارش شما ثبت شد. در حال انتقال به درگاه پرداخت...", {
            position: "top-center",
            autoClose: 2000,
          });

          // Redirect to payment gateway after a short delay
          setTimeout(() => {
            router.push(data.go_to_ipg_url);
          }, 1000);
        } else if (
          data.payment_type === "cash" ||
          data.payment_type === "cod"
        ) {
          // For cash on delivery
          toast.success("سفارش شما با موفقیت ثبت شد", {
            position: "top-center",
            autoClose: 3000,
          });

          // Clear cart and redirect to success page
          setTimeout(() => {
            router.push("/checkout/success");
          }, 2000);
        } else {
          // Handle other payment types or fallback
          toast.success("سفارش شما با موفقیت ثبت شد", {
            position: "top-center",
            autoClose: 3000,
          });

          // If there's a redirect URL, use it, otherwise go to success page
          if (data.go_to_ipg_url) {
            setTimeout(() => {
              window.location.href = data.go_to_ipg_url;
            }, 2000);
          } else {
            setTimeout(() => {
              router.push("/checkout/success");
            }, 2000);
          }
        }
      } else {
        // Handle case where success is false or result structure is different
        throw new Error(
          result?.message || result?.error || "خطا در پردازش سفارش"
        );
      }
    } catch (err) {
      console.error("Checkout error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "خطا در پردازش سفارش";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-36 pb-16 px-4 sm:px-6 lg:px-8" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-center mb-8 gap-2">
          <h1 className="text-3xl font-bold text-gray-900">
            سبد خرید {userAccount?.user?.first_name}
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-sm p-8 text-center"
          >
            <div className="flex justify-center mb-4">
              <RiShoppingCartLine className="h-16 w-16 text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              سبد خرید شما خالی است
            </h2>
            <p className="text-gray-500 mb-6">
              محصولات مورد نظر خود را به سبد خرید اضافه کنید
            </p>
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-800 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-700 transition-colors"
              >
                مشاهده محصولات
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white  border-t border-dashed p-6">
              <div className="divide-y divide-gray-200">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 sm:p-6 flex flex-col sm:flex-row items-center"
                    >
                      {/* Item details - same as before */}
                      <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden mb-4 sm:mb-0">
                        <Image
                          src={item?.image ?? "/assets/images/fashion/2.avif"}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 sm:mr-6 text-center sm:text-right">
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-gray-500">
                          {formatPrice(item.price)} تومان
                        </p>
                      </div>

                      <div className="flex items-center mt-4 sm:mt-0">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <motion.button
                            whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-2"
                          >
                            <RiSubtractLine className="h-5 w-5 text-gray-600" />
                          </motion.button>

                          <span className="px-4 py-1 text-gray-900">
                            {item.quantity}
                          </span>

                          <motion.button
                            whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-2"
                          >
                            <RiAddLine className="h-5 w-5 text-gray-600" />
                          </motion.button>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.1, color: "#f43f5e" }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeItem(item.id)}
                          className="mr-4 p-2 text-gray-500 hover:text-red-500"
                        >
                          <RiDeleteBin6Line className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white  border-t border-dashed p-6"
            >
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">جمع کل:</span>
                <span className="text-lg font-semibold">
                  {formatPrice(totalPrice)} تومان
                </span>
              </div>

              <div className="flex justify-between mb-4">
                <span className="text-gray-600">هزینه ارسال:</span>
                <span className="text-green-600">رایگان</span>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">
                    مبلغ قابل پرداخت:
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(totalPrice)} تومان
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Delivery Date */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white  border-t border-dashed p-6"
            >
              <h2 className="text-lg font-semibold mb-4">تاریخ تحویل</h2>
              <PersianDatePicker
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
                className="w-full"
              />
              {selectedDate && (
                <p className="mt-2 text-sm text-gray-600">
                  تاریخ انتخاب شده: {selectedDate}
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                تاریخ تحویل باید بین فردا تا ۳۰ روز آینده باشد.
              </p>
            </motion.div>

            {/* Payment Methods */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white  border-t border-dashed p-6"
            >
              <h2 className="text-lg font-semibold mb-4">روش‌های پرداخت</h2>

              {paymentMethodsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {availablePaymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center">
                      <input
                        type="radio"
                        id={`payment-${method.id}`}
                        name="payment"
                        value={method.id}
                        checked={selectedPaymentMethod === method.id}
                        onChange={handlePaymentMethodChange}
                        className="h-4 w-4 text-gray-800 focus:ring-gray-500"
                      />
                      <label
                        htmlFor={`payment-${method.id}`}
                        className="mr-2 block text-sm text-gray-700"
                      >
                        {method.title}
                        {method.description && (
                          <span className="text-xs text-gray-500 block">
                            {method.description}
                          </span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {/* Payment method information */}
              {availablePaymentMethods.length > 0 && (
                <div className="mt-4">
                  {availablePaymentMethods
                    .find((m) => m.id === selectedPaymentMethod)
                    ?.title.includes("درگاه") && (
                    <div className="p-3 bg-blue-50 rounded-md text-sm text-gray-700">
                      پس از تکمیل سفارش، به درگاه پرداخت آنلاین هدایت خواهید شد.
                    </div>
                  )}
                  {availablePaymentMethods
                    .find((m) => m.id === selectedPaymentMethod)
                    ?.title.includes("درب محل") && (
                    <div className="p-3 bg-yellow-50 rounded-md text-sm text-gray-700">
                      مبلغ سفارش در زمان تحویل کالا دریافت خواهد شد.
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Credit Deduction Option */}
            {/* <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.42 }}
              className="bg-white  border-t border-dashed p-6"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="useCredit"
                  checked={useCreditDeduction}
                  onChange={(e) => setUseCreditDeduction(e.target.checked)}
                  className="h-4 w-4 text-gray-800 focus:ring-gray-500 rounded"
                />
                <label
                  htmlFor="useCredit"
                  className="mr-2 block text-sm text-gray-700"
                >
                  استفاده از اعتبار حساب
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2 mr-6">
                با فعال کردن این گزینه، مبلغ سفارش از اعتبار حساب شما کسر خواهد
                شد.
              </p>
            </motion.div> */}

            {/* Order Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="bg-white  border-t border-dashed p-6"
            >
              <h2 className="text-lg font-semibold mb-4">توضیحات سفارش</h2>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md resize-none h-24"
                placeholder="توضیحات خود را وارد کنید... (اختیاری)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </motion.div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Checkout Button */}
            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full bg-gray-800 text-white py-3 px-4 rounded-md font-medium hover:bg-gray-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {checkoutLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    در حال پردازش...
                  </span>
                ) : (
                  "تکمیل سفارش و پرداخت"
                )}
              </motion.button>

              <Link href="/shop">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-3 bg-white text-gray-800 py-3 px-4 rounded-md font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <span className="flex items-center justify-center">
                    <RiArrowLeftLine className="ml-2" />
                    ادامه خرید
                  </span>
                </motion.button>
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CartPage;
