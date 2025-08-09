"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MdDashboard, MdPeople, MdAnalytics, MdSettings } from "react-icons/md";
import AdminComplaintsPanel from "@/components/static/adminComplaintsPanel";
import BlogManagement from "@/components/static/BlogManagement";
import AddBlogPage from "@/components/static/addBlog";

const Dashboard = () => (
  <div className="p-8">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"></div>
  </div>
);

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const contentRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: "dashboard", label: "داشبورد", icon: MdDashboard },
    { id: "users", label: "پیام مشتریان", icon: MdPeople },
    { id: "blog", label: "مدیریت وبلاگ", icon: MdSettings },
    { id: "addblog", label: "ساخت وبلاگ", icon: MdSettings },
  ];

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 0 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [activeTab]);

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab) return;

    gsap.to(contentRef.current, {
      opacity: 0,
      y: 0,
      duration: 0.2,
      onComplete: () => {
        setActiveTab(tabId);
      },
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "users":
        return <AdminComplaintsPanel />;
      case "blog":
        return <BlogManagement />;
      case "addblog":
        return <AddBlogPage />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen " dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">پنل مدیریت</h1>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex space-x-1 px-6 py-2">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`md:px-3 px-1 md:py-3 transition-all duration-300 flex items-center gap-4 relative overflow-hidden ${
                  activeTab === tab.id
                    ? "bg-gray-500 text-white  transform scale-105"
                    : "text-gray-600  hover:text-gray-900"
                }`}
              >
                <IconComponent className="hidden md:block" size={15} />
                <span className="font-semibold text-sm md:text-lg">
                  {tab.label}
                </span>
                {activeTab === tab.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-900 -z-10 rounded-lg" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative">
        <div ref={contentRef} className="min-h-[calc(100vh-140px)]">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Admin;
