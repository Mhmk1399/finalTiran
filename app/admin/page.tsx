"use client";
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MdPeople, MdSettings, MdAddCircleOutline } from "react-icons/md";
import AdminComplaintsPanel from "@/components/static/adminComplaintsPanel";
import BlogManagement from "@/components/static/BlogManagement";
import AddBlogPage from "@/components/static/addBlog";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const contentRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: "users", label: "پیام مشتریان", icon: MdPeople },
    { id: "blog", label: "مدیریت وبلاگ", icon: MdSettings },
    { id: "addblog", label: "ساخت وبلاگ", icon: MdAddCircleOutline },
  ];

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [activeTab]);

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab) return;
    gsap.to(contentRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.2,
      onComplete: () => setActiveTab(tabId),
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <AdminComplaintsPanel />;
      case "blog":
        return <BlogManagement />;
      case "addblog":
        return <AddBlogPage />;
      default:
        return <AdminComplaintsPanel />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100" dir="rtl">
      {/* Sidebar for large screens */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white shadow-lg border-l border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">پنل مدیریت</h1>
        </div>
        <nav className="flex-1 py-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center w-full px-6 py-3 mb-1  text-right transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-l from-gray-700 to-gray-900 text-white font-semibold shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="ml-3 text-lg" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-x-auto ">
        {/* Mobile Navigation */}
        <nav className="lg:hidden bg-white shadow-md border-b border-gray-200">
          <div className="flex overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center flex-1 justify-center text-xs py-3 whitespace-nowrap  font-medium transition-all ${
                    activeTab === tab.id
                      ? "border-b-2 border-gray-800 text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="ml-1 text-sm" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div ref={contentRef}>{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
