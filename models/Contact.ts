import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    companyName: { type: String }, // نام شرکت / موسسه
    firstName: { type: String, required: true }, // نام
    lastName: { type: String, required: true }, // نام خانوادگی
    phone: { type: String, required: true }, // شماره تماس
    email: { type: String, required: true }, // پست الکترونیک
    complaintSubject: { type: String, required: true }, // موضوع شکایت
    productDetails: { type: String }, // مشخصات محصول
    complaintDescription: { type: String, required: true }, // شرح شکایت
    customerRequest: { type: String }, // درخواست مشتری

    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Complaint ||
  mongoose.model("Complaint", complaintSchema);
