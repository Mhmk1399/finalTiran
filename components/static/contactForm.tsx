"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    complaintSubject: "",
    productDetails: "",
    complaintDescription: "",
    customerRequest: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // ساده‌ترین اعتبارسنجی سمت کلاینت
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.firstName.trim()) newErrors.firstName = "نام الزامی است";
    if (!formData.lastName.trim())
      newErrors.lastName = "نام خانوادگی الزامی است";
    if (!formData.phone.trim()) newErrors.phone = "شماره تماس الزامی است";
    if (!formData.email.trim()) newErrors.email = "ایمیل الزامی است";
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email))
        newErrors.email = "فرمت ایمیل صحیح نیست";
    }
    if (!formData.complaintSubject.trim())
      newErrors.complaintSubject = "موضوع شکایت الزامی است";
    if (!formData.complaintDescription.trim())
      newErrors.complaintDescription = "شرح شکایت الزامی است";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    // حذف خطا هنگام تغییر
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data.message);

      if (res.ok) {
        toast.success("پیام شما با موفقیت ارسال شد.");
        setFormData({
          companyName: "",
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          complaintSubject: "",
          productDetails: "",
          complaintDescription: "",
          customerRequest: "",
        });
      } else {
        toast.error("خطایی در ارسال پیام رخ داده است.");
      }
    } catch (error) {
      console.log(error);
      toast.error("خطایی در ارسال پیام رخ داده است.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contact-form" className="my-20 max-w-4xl w-full mx-auto">
      <h3 className="text-3xl text-center font-bold mb-6 text-gray-800">
        فرم تماس با ما
      </h3>{" "}
      <motion.form
        className=" grid md:grid-cols-2 gap-4  p-6 rounded-md  mt-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        dir="rtl"
      >
        {/* companyName */}
        <div className="mb-4">
          <label
            htmlFor="companyName"
            className="block mb-1 font-semibold text-gray-700"
          >
            نام شرکت (اختیاری)
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="نام شرکت یا موسسه"
          />
        </div>

        {/* firstName */}
        <div className="mb-4">
          <label
            htmlFor="firstName"
            className="block mb-1 font-semibold text-gray-700"
          >
            نام *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full border rounded-md px-3 py-2 focus:outline-none ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-indigo-500`}
            placeholder="نام خود را وارد کنید"
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>

        {/* lastName */}
        <div className="mb-4">
          <label
            htmlFor="lastName"
            className="block mb-1 font-semibold text-gray-700"
          >
            نام خانوادگی *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full border rounded-md px-3 py-2 focus:outline-none ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-indigo-500`}
            placeholder="نام خانوادگی خود را وارد کنید"
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>

        {/* phone */}
        <div className="mb-4">
          <label
            htmlFor="phone"
            className="block mb-1 font-semibold text-gray-700"
          >
            شماره تماس *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full border rounded-md px-3 py-2 focus:outline-none ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-indigo-500`}
            placeholder="شماره تماس خود را وارد کنید"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        {/* email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block mb-1 font-semibold text-gray-700"
          >
            ایمیل *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full border rounded-md px-3 py-2 focus:outline-none ${
              errors.email ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-indigo-500`}
            placeholder="ایمیل خود را وارد کنید"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* complaintSubject */}
        <div className="mb-4">
          <label
            htmlFor="complaintSubject"
            className="block mb-1 font-semibold text-gray-700"
          >
            موضوع شکایت *
          </label>
          <input
            type="text"
            id="complaintSubject"
            name="complaintSubject"
            value={formData.complaintSubject}
            onChange={handleChange}
            className={`w-full border rounded-md px-3 py-2 focus:outline-none ${
              errors.complaintSubject ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-indigo-500`}
            placeholder="موضوع شکایت خود را وارد کنید"
          />
          {errors.complaintSubject && (
            <p className="text-red-500 text-xs mt-1">
              {errors.complaintSubject}
            </p>
          )}
        </div>

        {/* productDetails */}
        <div className="mb-4">
          <label
            htmlFor="productDetails"
            className="block mb-1 font-semibold text-gray-700"
          >
            مشخصات محصول (اختیاری)
          </label>
          <textarea
            id="productDetails"
            name="productDetails"
            value={formData.productDetails}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="در صورت نیاز، مشخصات محصول را وارد کنید"
            rows={2}
          />
        </div>

        {/* complaintDescription */}
        <div className="mb-4">
          <label
            htmlFor="complaintDescription"
            className="block mb-1 font-semibold text-gray-700"
          >
            شرح شکایت *
          </label>
          <textarea
            id="complaintDescription"
            name="complaintDescription"
            value={formData.complaintDescription}
            onChange={handleChange}
            className={`w-full border rounded-md px-3 py-2 focus:outline-none ${
              errors.complaintDescription ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-indigo-500`}
            placeholder="شرح کامل شکایت خود را وارد کنید"
            rows={4}
          />
          {errors.complaintDescription && (
            <p className="text-red-500 text-xs mt-1">
              {errors.complaintDescription}
            </p>
          )}
        </div>

        {/* customerRequest */}
        <div className="mb-6">
          <label
            htmlFor="customerRequest"
            className="block mb-1 font-semibold text-gray-700"
          >
            درخواست مشتری (اختیاری)
          </label>
          <textarea
            id="customerRequest"
            name="customerRequest"
            value={formData.customerRequest}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="در صورت نیاز، درخواست خود را وارد کنید"
            rows={2}
          />
        </div>

        {/* Submit button and status */}
      </motion.form>
      <button
        type="submit"
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white py-3 px-6  font-semibold hover:bg-gray-800 transition-colors duration-200 ml-8  mx-auto"
      >
        {loading ? "در حال ارسال..." : "ارسال شکایت"}
      </button>
    </div>
  );
};

export default ContactForm;
