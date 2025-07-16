"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BiPhone, BiLogIn } from "react-icons/bi";
import Image from "next/image";
import Link from "next/link";
import { AriaBold } from "@/next-persian-fonts/woff2";

const AuthPage = () => {
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [smsDigits, setSmsDigits] = useState(["", "", "", ""]);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ phone: "", smsCode: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState("");
  const [isRedirecting, setIsRedirecting] = useState("");
  const [isRedirectingDashboard, setIsRedirectingDashboard] = useState("");

  // Initialize redirect messages
  useEffect(() => {
    const redirectUrl = localStorage.getItem("redirectAfterLogin");
    const redirectUrlCart = localStorage.getItem("redirectAfterLoginToCart");
    const redirectUrlDashboard = localStorage.getItem(
      "redirectAfterLoginToDashboard"
    );
    if (redirectUrl)
      setRedirectMessage(
        "پس از ورود به صفحه محصول برای کامنت بازگردانده خواهید شد"
      );
    else if (redirectUrlCart)
      setIsRedirecting("پس از ورود به صفحه کارت منتقل میشوید");
    else if (redirectUrlDashboard)
      setIsRedirectingDashboard("پس از ورود به داشبورد منتقل میشوید");
  }, []);

  // Auto focus inputs on step change
  useEffect(() => {
    if (step === 1) {
      setTimeout(() => phoneInputRef.current?.focus(), 300);
    } else if (step === 2) {
      setTimeout(() => digitRefs.current[0]?.focus(), 600);
    }
  }, [step]);

  // Validation functions with touched check
  const validatePhoneForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (formData.phone.length !== 11) {
      newErrors.phone = "شماره موبایل باید ۱۱ رقم باشد";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSmsForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (formData.smsCode.length < 4) {
      newErrors.smsCode = "کد تایید را به درستی وارد کنید";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendPhoneNumber = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.phone,
          sent_sms: true,
          application: 0,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "خطا در ارسال کد تایید");
        return false;
      }
      toast.success("کد تایید به شماره موبایل شما ارسال شد");
      return true;
    } catch {
      toast.error("خطا در ارسال کد تایید");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySmsCode = async (code?: string) => {
    const finalCode = code || formData.smsCode;
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.phone,
          sms_code: finalCode,
          application: 1,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "کد تایید نامعتبر است");
        return false;
      }

      if (data.data.token) localStorage.setItem("token", data.data.token);
      toast.success("ورود با موفقیت انجام شد");

      setTimeout(() => {
        const redirectUrl = localStorage.getItem("redirectAfterLogin");
        const redirectUrlCart = localStorage.getItem(
          "redirectAfterLoginToCart"
        );
        const redirectUrlDashboard = localStorage.getItem(
          "redirectAfterLoginToDashboard"
        );

        if (redirectUrl) {
          localStorage.removeItem("redirectAfterLogin");
          window.location.href = redirectUrl;
        } else if (redirectUrlCart) {
          localStorage.removeItem("redirectAfterLoginToCart");
          window.location.href = redirectUrlCart;
        } else if (redirectUrlDashboard) {
          localStorage.removeItem("redirectAfterLoginToDashboard");
          window.location.href = redirectUrlDashboard;
        } else {
          window.location.href = "/dashboard";
        }
      }, 3000);

      return true;
    } catch {
      toast.error("خطا در تایید کد");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // جلوگیری از ارسال دوباره حین بارگذاری

    if (step === 1) {
      setTouched({ phone: true });
      if (validatePhoneForm()) {
        const success = await handleSendPhoneNumber();
        if (success) setStep(2);
      }
    } else {
      setTouched({ smsCode: true });
      if (validateSmsForm()) {
        await handleVerifySmsCode();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const cleanedValue = value.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, [name]: cleanedValue }));

    // وقتی شماره کامل شد، ارسال خودکار فرم
    if (name === "phone" && cleanedValue.length === 11) {
      setTouched({ phone: true });
      setTimeout(() => {
        document
          .querySelector("form")
          ?.dispatchEvent(
            new Event("submit", { cancelable: true, bubbles: true })
          );
      }, 300);
    }
  };

  const handleDigitChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value.replace(/\D/, "");
    if (!value) return;

    const updatedDigits = [...smsDigits];
    updatedDigits[index] = value;
    setSmsDigits(updatedDigits);

    if (index < 3) digitRefs.current[index + 1]?.focus();

    if (updatedDigits.every((digit) => digit !== "")) {
      const smsCode = updatedDigits.join("");
      setFormData((prev) => ({ ...prev, smsCode }));
      setTouched({ smsCode: true });

      setTimeout(() => {
        handleVerifySmsCode(smsCode);
      }, 300);
    }
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      const updatedDigits = [...smsDigits];
      if (updatedDigits[index] === "") {
        if (index > 0) digitRefs.current[index - 1]?.focus();
      } else {
        updatedDigits[index] = "";
        setSmsDigits(updatedDigits);
      }
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
  };

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row pb-10 sm:pb-0 overflow-y-auto"
      dir="rtl"
    >
      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white order-2 lg:order-1">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-8"
            >
              {/* Logo/Brand */}
              <motion.div
                variants={itemVariants}
                className="text-center mb-8 border-b border-dashed border-gray-400 pb-2"
              >
                <h1 className={`text-4xl  ${AriaBold.className} text-gray-900 mb-2`}>تیران</h1>
                <p className="text-gray-600">به حساب کاربری خود وارد شوید</p>
              </motion.div>

              {(redirectMessage || isRedirecting || isRedirectingDashboard) && (
                <motion.div
                  variants={itemVariants}
                  className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200"
                  role="alert"
                  aria-live="polite"
                >
                  <p className="text-blue-700 text-sm">
                    {redirectMessage || isRedirecting || isRedirectingDashboard}
                  </p>
                </motion.div>
              )}

              <motion.h2
                variants={itemVariants}
                className={`text-2xl text-gray-800 text-center mb-8" ${AriaBold.className}`}
              >
                {step === 1 ? "ورود با شماره موبایل" : "تایید کد پیامک"}
              </motion.h2>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {step === 1 ? (
                  <motion.div variants={itemVariants}>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      شماره موبایل
                    </label>
                    <div className="relative">
                      <BiPhone
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        id="phone"
                        aria-invalid={errors.phone ? "true" : "false"}
                        aria-describedby={
                          errors.phone ? "phone-error" : undefined
                        }
                        ref={phoneInputRef}
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="09123456789"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={isLoading}
                        className={`w-full px-4 py-4 pr-12 placeholder:text-gray-300 rounded-lg border ${
                          errors.phone && touched.phone
                            ? "border-red-500"
                            : "border-gray-300"
                        } text-gray-900 focus:outline-none focus:ring-2 ${
                          errors.phone && touched.phone
                            ? "focus:ring-red-500"
                            : "focus:ring-gray-500"
                        } focus:border-transparent transition-all`}
                        maxLength={11}
                        autoComplete="tel"
                      />
                    </div>
                    {errors.phone && touched.phone && (
                      <span
                        id="phone-error"
                        className="text-red-500 text-sm block mt-2"
                      >
                        {errors.phone}
                      </span>
                    )}
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      variants={itemVariants}
                      className="text-center mb-6 p-4 bg-blue-50 rounded-lg"
                    >
                      <p className="text-gray-700">
                        کد تایید به شماره{" "}
                        <span className="font-semibold text-blue-600">
                          {formData.phone}
                        </span>{" "}
                        ارسال شد
                      </p>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        htmlFor="smsCode"
                      >
                        کد تایید
                      </label>
                      <div
                        className="flex flex-row gap-4 justify-center"
                        dir="ltr"
                        role="group"
                        aria-label="کد تایید"
                      >
                        {smsDigits.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => void (digitRefs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            className="w-12 h-14 text-center text-lg font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            value={digit}
                            disabled={isLoading}
                            onChange={(e) => handleDigitChange(e, index)}
                            onKeyDown={(e) => handleBackspace(e, index)}
                            aria-label={`رقم ${index + 1}`}
                          />
                        ))}
                      </div>
                      {errors.smsCode && touched.smsCode && (
                        <span
                          className="text-red-500 text-sm block mt-2"
                          id="smsCode-error"
                        >
                          {errors.smsCode}
                        </span>
                      )}
                    </motion.div>
                  </>
                )}

                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 mt-8 rounded-lg bg-black text-white font-semibold hover:bg-black/80 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                    isLoading ||
                    (step === 1 &&
                      (!formData.phone || formData.phone.length !== 11)) ||
                    (step === 2 && smsDigits.some((d) => !d))
                      ? "opacity-70 cursor-not-allowed"
                      : ""
                  }`}
                  type="submit"
                  disabled={
                    isLoading ||
                    (step === 1 &&
                      (!formData.phone || formData.phone.length !== 11)) ||
                    (step === 2 && smsDigits.some((d) => !d))
                  }
                  aria-busy={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <BiLogIn size={20} />
                  )}
                  {isLoading
                    ? "در حال پردازش..."
                    : step === 1
                    ? "دریافت کد تایید"
                    : "ورود به حساب کاربری"}
                </motion.button>
              </form>

              {step === 2 && (
                <motion.div
                  variants={itemVariants}
                  className="text-center mt-6"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      setStep(1);
                      setFormData((prev) => ({ ...prev, smsCode: "" }));
                      setErrors({});
                      setTouched({});
                      setSmsDigits(["", "", "", ""]);
                    }}
                    className="text-blue-600 hover:text-blue-800 transition-colors font-medium underline"
                    disabled={isLoading}
                  >
                    تغییر شماره موبایل
                  </motion.button>
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="text-center mt-8">
                <p className="text-sm text-gray-500">
                  با ورود به سایت، شما{" "}
                  <Link
                    href="#"
                    className={`text-gray-900  ${AriaBold.className}  hover:underline"`}
                  >
                    قوانین و مقررات
                  </Link>{" "}
                  را می‌پذیرید
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Left side - Image */}
      <div className="w-full lg:w-1/2 h-82 lg:h-auto relative bg-gradient-to-br from-blue-600 to-purple-700 order-1 lg:order-2">
        <motion.div
          transition={{ duration: 0.8 }}
          className="absolute inset-0 bg-black bg-opacity-20"
        />
        <Image
          src="/assets/images/contact.jpg"
          alt="Auth background"
          fill
          priority
          className="object-cover"
        />
      </div>
    </div>
  );
};

export default AuthPage;
