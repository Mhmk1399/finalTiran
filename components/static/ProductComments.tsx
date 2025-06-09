"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  ProductCommentsProps,
  Comment,
  CommentItem,
  CommentResponse,
} from "@/types/type";

export default function ProductComments({
  productSlug,
  productId,
}: ProductCommentsProps) {
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch comments when component mounts or productSlug changes
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/comment?product_slug=${productSlug}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }

        const data: CommentResponse = await response.json();

        if (data.success && data.data.items) {
          // Transform API comments to our Comment interface format
          const transformedComments = data.data.items.map((item) =>
            transformComment(item)
          );
          setComments(transformedComments);
        } else {
          setComments([]);
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError("خطا در بارگذاری نظرات. لطفا دوباره تلاش کنید.");
      } finally {
        setLoading(false);
      }
    };

    if (productSlug) {
      fetchComments();
    }
  }, [productSlug]);

  // Transform API comment format to our UI format
  const transformComment = (item: CommentItem): Comment => {
    const comment: Comment = {
      id: item.id,
      name: item.name,
      avatar: "/images/avatars/avatar-user.jpg", // Default avatar
      rating: item.rate || 5, // Use API rating if available, fallback to 5
      date: new Date().toISOString().split("T")[0], // Default date as API doesn't provide date
      text: item.comment,
      title: item.title,
      replies: item.childs?.map((child) => transformComment(child)) || [],
    };
    return comment;
  };
  console.log(transformComment);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      setSubmitError("متن نظر الزامی است");
      return;
    }

    if (!isAuthenticated) {
      // Redirect to login page or show login modal
      setSubmitError("برای ثبت نظر باید وارد حساب کاربری خود شوید");
      // You could redirect to login page
      // router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      // Get auth token from localStorage or your auth context
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const commentData = {
        product_id: Number(productId),
        rate: newRating,
        // name: userName || undefined,
        title: newTitle || undefined,
        comment: newComment,
        parent_id: replyToId || undefined,
      };

      const response = await fetch("/api/comment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(commentData),
      });
      console.log(commentData, "comment");
      console.log("API response:", await response.text());

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit comment");
      }

      // Comment submitted successfully
      // Refresh the comments list
      const refreshResponse = await fetch(
        `/api/comment?product_slug=${productSlug}`
      );
      const refreshData: CommentResponse = await refreshResponse.json();

      if (refreshData.success && refreshData.data.items) {
        const transformedComments = refreshData.data.items.map((item) =>
          transformComment(item)
        );
        setComments(transformedComments);
      }

      // Reset form
      setNewComment("");
      setNewTitle("");
      setReplyToId(null);
    } catch (err) {
      console.error("Error submitting comment:", err);
      setSubmitError(
        err instanceof Error
          ? err.message
          : "خطا در ثبت نظر. لطفا دوباره تلاش کنید."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = (commentId: number | string) => {
    setReplyToId(Number(commentId));
    // Scroll to comment form
    document
      .getElementById("comment-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Render a comment and its replies
  const renderComment = (comment: Comment, isReply: boolean = false) => (
    <motion.div
      key={comment.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`border border-gray-200 p-6 ${
        isReply
          ? "bg-gray-50 border-l-4 border-l-blue-400 ml-4 rounded-r-lg"
          : "bg-white rounded-lg"
      }`}
    >
      <div className="flex items-start gap-4">
        {isReply && (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm">↳</span>
            </div>
          </div>
        )}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h4 className="font-medium">{comment.name}</h4>
            {isReply && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                پاسخ
              </span>
            )}
            <span className="text-sm text-gray-500">
              {new Date(comment.date).toLocaleDateString("fa-IR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="flex mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < comment.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>

          {comment.title && (
            <h5 className="font-medium mb-2">{comment.title}</h5>
          )}
          <p className="text-gray-700">{comment.text}</p>

          {/* Reply button - only show for main comments, not replies */}
          {isAuthenticated && !isReply && (
            <button
              aria-label="reply"
              onClick={() => handleReply(comment.id)}
              className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              پاسخ به این نظر
            </button>
          )}

          {/* Render replies if any */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4">
              {comment.replies.map((reply) => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="my-16">
      <h2 className="text-2xl font-bold border-b border-dashed w-fit pb-3 mb-6">
        نظرات مشتریان
      </h2>
      <h3 className="text-lg font-medium mb-4">
        {replyToId ? "پاسخ به نظر" : "نظرات خود را با ما به اشتراک بگذارید"}
      </h3>
      {/* Add a review form */}
      <form
        id="comment-form"
        onSubmit={handleSubmitComment}
        className="mb-10 p-6 rounded-lg"
      >
        {replyToId && (
          <div className="mb-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              در حال پاسخ به نظر شماره {replyToId}
              <button
                aria-label="reply"
                onClick={() => setReplyToId(null)}
                className="mr-2 text-red-500 hover:text-red-700"
              >
                (انصراف)
              </button>
            </p>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            امتیاز شما: {newRating} از 5
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                aria-label="rate"
                onMouseEnter={() => setHoverRating(rating)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setNewRating(rating)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  size={24}
                  className={`${
                    (hoverRating || newRating) >= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  } transition-colors`}
                />
              </button>
            ))}
            <span className="mr-2 text-sm text-gray-600">
              {newRating === 1 && "خیلی بد"}
              {newRating === 2 && "بد"}
              {newRating === 3 && "متوسط"}
              {newRating === 4 && "خوب"}
              {newRating === 5 && "عالی"}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-bold mb-2">
            عنوان نظر
          </label>
          <input
            id="title"
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="عنوان نظر شما"
            className="w-full px-3 py-2 border-b border-dashed border-gray-300 focus:outline-none focus:border-gray-950"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-bold mb-2">
            متن نظر
          </label>
          <textarea
            id="comment"
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="نظر شما در مورد این محصول"
            className="w-full px-3 py-2 border-b border-dashed border-gray-300 focus:outline-none focus:border-gray-950"
            required
          />
        </div>

        {submitError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600">{submitError}</div>
        )}

        {!isAuthenticated ? (
          <div className="mb-4 p-3 bg-gray-900 text-white">
            برای ثبت نظر باید وارد حساب کاربری خود شوید.
            <button
              aria-label="login"
              type="button"
              onClick={() => {
                // Store current page URL for redirect after login
                const currentUrl =
                  window.location.pathname + window.location.search;
                localStorage.setItem("redirectAfterLogin", currentUrl);
                router.push("/auth");
              }}
              className="mr-2 text-blue-400 hover:text-blue-600"
            >
              ورود به حساب کاربری
            </button>
          </div>
        ) : (
          <button
            aria-label="submit"
            type="submit"
            disabled={submitting}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              submitting
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-black text-white hover:bg-blue-600"
            }`}
          >
            {submitting ? (
              <>
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                در حال ثبت...
              </>
            ) : (
              <>
                ثبت نظر
                <Send size={18} />
              </>
            )}
          </button>
        )}
      </form>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-2 text-gray-600">در حال بارگذاری نظرات...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-10 text-red-500">
          <p>{error}</p>
        </div>
      )}

      {/* Reviews list */}
      {!loading && !error && (
        <div className="space-y-6">
          <AnimatePresence>
            {comments.map((comment) => renderComment(comment))}
          </AnimatePresence>

          {comments.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              هنوز نظری ثبت نشده است. اولین نفری باشید که نظر می‌دهید!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
