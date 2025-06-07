import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RiFileList3Line } from "react-icons/ri";
import {
  ApiResponse,
  Order,
  PayStatus,
  SendStatus,
  Status,
} from "@/types/type";
import Link from "next/link";

const OrdersPanel = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data: ApiResponse = await response.json();
        if (data.success) {
          setOrders(data.data.items || []);
        } else {
          setError("خطا در دریافت سفارش‌ها");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("خطا در ارتباط با سرور");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Format price with commas for thousands
  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseInt(price) : price;
    if (isNaN(numPrice)) return "0";
    return numPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getStatusColor = (status: Status) => {
    switch (status.status) {
      case 1:
        return "bg-green-100 text-green-800"; // Delivered/Completed
      case 2:
        return "bg-blue-100 text-blue-800"; // Processing
      case 3:
        return "bg-red-100 text-red-800"; // Rejected
      case 4:
        return "bg-yellow-100 text-yellow-800"; // Waiting for operator approval
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPayStatusColor = (payStatus: PayStatus) => {
    switch (payStatus.status) {
      case 1:
        return "bg-green-100 text-green-800"; // Successful payment
      case 2:
        return "bg-red-100 text-red-800"; // Failed payment
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSendStatusColor = (sendStatus: SendStatus) => {
    switch (sendStatus.status) {
      case 0:
        return "bg-yellow-100 text-yellow-800"; // Waiting for confirmation
      case 1:
        return "bg-blue-100 text-blue-800"; // Confirmed
      case 2:
        return "bg-green-100 text-green-800"; // Sent
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <RiFileList3Line className="w-6 h-6 ml-2 text-gray-700" />
        <h2 className="text-xl font-semibold text-gray-800">سفارش‌های من</h2>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50">
          <RiFileList3Line className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            هنوز سفارشی ثبت نکرده‌اید
          </h3>
          <p className="text-gray-500">
            سفارش‌های شما پس از خرید در این قسمت نمایش داده می‌شوند.
          </p>
          <button className="bg-black mt-3 text-white px-4 py-2 hover:bg-black/70">
            <Link href="/shop">
            فروشگاه
            </Link>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mobile View - Cards */}
          <div className="block md:hidden space-y-4">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white  shadow-md p-4 border"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      سفارش #{order.id}
                    </h3>
                    <p className="text-sm text-gray-600">{order.date}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">مبلغ کل:</span>
                    <span className="text-sm font-medium">
                      {formatPrice(order.price_total)} تومان
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">هزینه ارسال:</span>
                    <span className="text-sm">
                      {formatPrice(order.send_price)} تومان
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">روش پرداخت:</span>
                    <span className="text-sm">{order.payMethod.title}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">وضعیت سفارش:</span>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.text}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">وضعیت پرداخت:</span>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPayStatusColor(
                        order.pay_status
                      )}`}
                    >
                      {order.pay_status.text}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">وضعیت ارسال:</span>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getSendStatusColor(
                        order.send_status
                      )}`}
                    >
                      {order.send_status.text}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-right text-sm font-medium text-gray-700">
                    شماره سفارش
                  </th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-gray-700">
                    تاریخ
                  </th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-gray-700">
                    مبلغ کل
                  </th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-gray-700">
                    وضعیت سفارش
                  </th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-gray-700">
                    وضعیت پرداخت
                  </th>
                  <th className="py-3 px-4 text-right text-sm font-medium text-gray-700">
                    وضعیت ارسال
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="py-4 px-4 text-sm text-gray-700 font-medium">
                      #{order.id}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      {order.date}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      {formatPrice(order.price_total)} تومان
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.text}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getPayStatusColor(
                          order.pay_status
                        )}`}
                      >
                        {order.pay_status.text}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getSendStatusColor(
                          order.send_status
                        )}`}
                      >
                        {order.send_status.text}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPanel;
