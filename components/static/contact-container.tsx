"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { socialLinks } from "@/lib/footerData";

// Form state type

const ContactContainer = () => {
  return (
    <section className="bg-white min-h-screen pt-20 px-5 md:px-15 lg:pl-0 lg:pr-20">
      {/* Hero Section */}

      <div className="flex flex-col-reverse lg:flex-row lg:items-end lg:gap-12">
        {/* Left Side - Image */}
        <motion.div
          className="relative w-full lg:w-1/2 h-[450px]  md:h-[500px] lg:h-[620px] overflow-hidden "
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Image
            src="/assets/images/tirancontact.png" // Add your office/company image
            alt="دفتر شرکت تیران"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </motion.div>

        {/* Right Side - Company Info */}
        <motion.div
          className="w-full h-full lg:w-1/2 flex flex-col items-start lg:items-start gap-4  mt-10 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          dir="rtl"
        >
          {/* Logo */}
       

          {/* Company Image */}
          <motion.div
            className="flex justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Image
              src="/assets/images/dastkhat.png" // Company building or team image
              alt="ساختمان شرکت"
              width={100}
              height={80}
              className="object-contain "
            />
          </motion.div>

          {/* Description Text */}
          <motion.p
            className="text-gray-400 text-right text-[14px] md:text-[16px] lg:text-sm xl:text-base leading-relaxed  lg:text-right "
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            ماموریت ما در تیران استایل ارائه محصولاتی است که به مشتریانمان کمک
            می‌کند تا سبک زندگی خود را با جسارت و اصالت تعریف کنند و از دیگران
            متمایز شوند
          </motion.p>

          {/* Contact Info */}
          <motion.div
            className="space-y-1 mt-5 md:mt-8 mb-8 "
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Phone */}
            <div className="flex items-center justify-start lg:justify-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-7 lg:h-7 xl:w-8 xl:h-8  text-gray-400 flex-shrink-0">
                تلفن
              </div>
              <span className="text-gray-800 font-bold text-sm sm:text-base lg:text-xs xl:text-sm text-center lg:text-right">
                ۰۲۱-۱۲۳۴۵۶۷۸
              </span>
            </div>

            {/* Address */}
            <div className="flex items-center justify-start lg:justify-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 lg:w-7 lg:h-7 xl:w-8 xl:h-8  text-gray-400 flex-shrink-0">
                نشانی
              </div>
              <span className="text-gray-800 font-bold text-sm sm:text-base lg:text-xs xl:text-sm text-center lg:text-right">
                تهران، پلاک یک
              </span>
            </div>
          </motion.div>

          {/* Weblog Button and Social Media */}
          <motion.div
            className="flex flex-row items-center gap-4 justify-between w-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            viewport={{ once: true }}
          >
            {/* Weblog Button */}
            <div className="flex justify-center lg:justify-start">
              <motion.button
                className="flex items-center px-4 sm:px-6 lg:px-4 xl:px-5 py-3 sm:py-3 lg:py-2 xl:py-2.5 bg-black text-white  hover:bg-gray-800 transition-colors duration-200 font-medium text-sm sm:text-base lg:text-xs xl:text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open("/blog", "_blank")} // Adjust URL as needed
              >
                <span className="">وبلاگ خبرنامه</span>
              </motion.button>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center md:justify-start gap-3 lg:gap-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{
                      y: -3,
                      scale: 1.1,
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 lg:w-10 lg:h-10 bg-gray-900 hover:bg-gray-900 text-gray-50 hover:text-white flex items-center justify-center transition-all duration-300 group"
                    aria-label={social.name}
                  >
                    <IconComponent
                      size={20}
                      className="lg:w-5 lg:h-5 transition-transform duration-300 group-hover:scale-110"
                    />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactContainer;
