"use client";
import React, { useEffect, useState } from "react";

interface Complaint {
  _id: string;
  companyName?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  complaintSubject: string;
  productDetails?: string;
  complaintDescription: string;
  customerRequest?: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
  updatedAt: string;
}

const AdminComplaintsPanel = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/contact");
        if (!res.ok) {
          throw new Error("خطا در دریافت پیام‌ها");
        }
        const data: Complaint[] = await res.json();
        setComplaints(data);
      } catch (err: any) {
        setError(err.message || "خطا در دریافت داده‌ها");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading)
    return <p className="text-center py-10">در حال بارگذاری پیام‌ها...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <div className="overflow-x-auto p-5">
      <h2 className="text-2xl font-bold mb-6 text-center">
        پیام‌های تماس با ما
      </h2>

      {complaints.length === 0 ? (
        <p className="text-center text-gray-600">هیچ پیامی ثبت نشده است.</p>
      ) : (
        <table className="min-w-full border border-gray-300 rounded-md overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr className="text-right">
              <th className="p-3 border-b border-gray-300">
                نام و نام خانوادگی
              </th>
              <th className="p-3 border-b border-gray-300">شرکت</th>
              <th className="p-3 border-b border-gray-300">تلفن</th>
              <th className="p-3 border-b border-gray-300">ایمیل</th>
              <th className="p-3 border-b border-gray-300">موضوع شکایت</th>
              <th className="p-3 border-b border-gray-300">تاریخ ثبت</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c._id} className="hover:bg-gray-50 cursor-pointer">
                <td className="p-3 border-b border-gray-300">
                  {c.firstName} {c.lastName}
                </td>
                <td className="p-3 border-b border-gray-300">
                  {c.companyName || "-"}
                </td>
                <td className="p-3 border-b border-gray-300">{c.phone}</td>
                <td className="p-3 border-b border-gray-300">{c.email}</td>
                <td className="p-3 border-b border-gray-300">
                  {c.complaintSubject}
                </td>

                <td className="p-3 border-b border-gray-300">
                  {new Date(c.createdAt).toLocaleDateString("fa-IR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminComplaintsPanel;
