import { NextRequest, NextResponse } from "next/server";
import contact from "../../../models/Contact";
import connect from "@/lib/data";

export async function GET() {
  await connect();

  try {
    const contacts = await contact.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(contacts, { status: 200 });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return NextResponse.json(
      { error: "خطا در دریافت پیام‌ها" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  await connect();
  try {
    const body = await request.json();
    const {
      companyName,
      firstName,
      lastName,
      phone,
      email,
      complaintSubject,
      productDetails,
      complaintDescription,
      customerRequest,
    } = body;

    // Required fields validation
    // if (
    //   !firstName ||
    //   !lastName ||
    //   !phone ||
    //   !email ||
    //   !complaintSubject ||
    //   !complaintDate || !/^\d{4}\/\d{2}\/\d{2}$/.test(complaintDate) ||
    //   !complaintDescription
    // ) {
    //   return NextResponse.json(
    //     { error: "تمام فیلدهای الزامی را تکمیل کنید" },
    //     { status: 400 }
    //   );
    // }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "فرمت ایمیل صحیح نیست" },
        { status: 400 }
      );
    }

    // Create record
    const complaintData = {
      companyName: companyName || null,
      firstName,
      lastName,
      phone,
      email,
      complaintSubject,
      productDetails: productDetails || null,
      complaintDescription,
      customerRequest: customerRequest || null,
      status: "pending",
    };

    const contactUs = await contact.create(complaintData);

    return NextResponse.json(
      { message: "شکایت با موفقیت ثبت شد", id: contactUs.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Complaint form error:", error);
    return NextResponse.json({ error: "خطا در ثبت شکایت" }, { status: 500 });
  }
}
