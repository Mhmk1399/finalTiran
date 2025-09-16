"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  RiCheckboxCircleFill,
  RiShoppingBag3Line,
  RiHomeLine,
  RiPhoneLine,
  RiMailLine,
  RiCalendarLine,
  RiTruckLine,
} from "react-icons/ri";
import { useRouter } from "next/navigation";

interface OrderDetails {
  order_id: string;
  payment_type: string;
  total_amount?: string;
  order_date?: string;
}

const CheckoutSuccessPage = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const [loading, setLoading] = useState(true);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get order details from localStorage
    const orderId = localStorage.getItem("current_order_id");
    const paymentType = localStorage.getItem("payment_type");

    if (!orderId || !paymentType) {
      router.push("/");
    }

    if (orderId) {
      setOrderDetails({
        order_id: orderId,
        payment_type: paymentType || "online",
        order_date: new Date().toLocaleDateString("fa-IR"),
      });
      localStorage.removeItem("cart")
    }

    // Hide confetti after 3 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    // Set loading to false after a short delay
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      clearTimeout(confettiTimer);
      clearTimeout(loadingTimer);
    };
  }, []);

  // Confetti animation component
  const Confetti = () => {
    const confettiPieces = Array.from({ length: 50 }, (_, i) => i);

    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {confettiPieces.map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2   "
            initial={{
              x: Math.random() * window.innerWidth,
              y: -10,
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              y: window.innerHeight + 10,
              rotate: 360,
              opacity: 0,
            }}
            transition={{
              duration: Math.random() * 2 + 2,
              delay: Math.random() * 2,
              ease: "easeOut",
            }}
            style={{
              backgroundColor: [
                "#3B82F6",
                "#8B5CF6",
                "#10B981",
                "#F59E0B",
                "#EF4444",
                "#EC4899",
              ][Math.floor(Math.random() * 6)],
            }}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center  ">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-500 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" dir="rtl">
      {/* Confetti Animation */}
      <AnimatePresence>{showConfetti && <Confetti />}</AnimatePresence>

      {/* Background Decorative Elements */}

      <div className="relative mt-20 z-10 min-h-screen flex items-center justify-center   lg:px-8 pt-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl w-full"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              duration: 0.5,
              type: "spring" as const,
              stiffness: 200,
            }}
            className="text-center"
          >
            <div className="relative inline-block">
              <RiCheckboxCircleFill className="w-24 h-24 text-green-500 mx-auto" />
            </div>
          </motion.div>

          {/* Main Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white/80 backdrop-blur-lg  p-8 sm:p-2 border border-white/20"
          >
            {/* Success Message */}
            <div className="text-center mb-8 border-b pb-3">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-2xl sm:text-4xl font-bold text-gray-800 mb-4"
              >
                پرداخت موفق!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-base text-gray-600 leading-relaxed"
              >
                سفارش شما با موفقیت ثبت شد و پرداخت انجام گردید.
                <br />
                از خرید شما متشکریم! 🙏
              </motion.p>
            </div>

            {/* Order Details */}
            {orderDetails && (
              <motion.div
                ref={receiptRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="bg-gray-50   p-6 mb-8"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <RiShoppingBag3Line className="ml-2 text-blue-500" />
                  جزئیات سفارش
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">شماره سفارش:</span>
                    <span className="font-mono text-gray-800 bg-white px-3 py-1  ">
                      #{orderDetails.order_id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">نوع پرداخت:</span>
                    <span className="text-gray-800">
                      {orderDetails.payment_type === "online"
                        ? "آنلاین"
                        : "نقدی"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">تاریخ سفارش:</span>
                    <span className="text-gray-800 flex items-center">
                      <RiCalendarLine className="ml-1" />
                      {orderDetails.order_date}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="bg-blue-50  p-6 mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <RiTruckLine className="ml-2 text-green-500" />
                مراحل بعدی
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-400   ml-3"></span>
                  ایمیل تأیید سفارش برای شما ارسال خواهد شد
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400   ml-3"></span>
                  سفارش شما آماده‌سازی و ارسال خواهد شد
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-purple-400   ml-3"></span>
                  کد رهگیری از طریق پیامک اطلاع‌رسانی می‌شود
                </li>
              </ul>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6   font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                >
                  <RiShoppingBag3Line className="ml-2" />
                  مشاهده سفارشات
                </motion.button>
              </Link>

              <Link href="/shop">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white text-gray-700 py-4 px-6   font-medium border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 flex items-center justify-center"
                >
                  <RiHomeLine className="ml-2" />
                  ادامه خرید
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Contact Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-center mt-8"
          >
            <p className="text-gray-600 mb-4">سوالی دارید؟ با ما تماس بگیرید</p>
            <div className="flex justify-center gap-3">
              <a
                href="tel:+989123456789"
                className="flex items-center text-gray-500 hover:text-green-500 transition-colors duration-300"
              >
                <RiPhoneLine className="ml-1" />
                تماس
              </a>
              <a
                href="mailto:support@example.com"
                className="flex items-center text-gray-500 hover:text-blue-500 transition-colors duration-300"
              >
                <RiMailLine className="ml-1" />
                ایمیل
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default CheckoutSuccessPage;
