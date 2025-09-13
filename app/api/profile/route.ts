import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  const headersList = await headers();
  const token = headersList.get("authorization");

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(
      "https://tiran.shop.hesabroclub.ir/api/web/shop-v1/profile?expand=creator%2Cupdater%2Cnumbers%2Ctotal_balance%2Caddresses%2Caddresses%2Ccoins%2Cdiscounts",
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      return NextResponse.json(
        {
          success: true,
          addresses: data.data.addresses || [],
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch addresses",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("Error fetching addresses:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const headersList = await headers();
  const token = headersList.get("authorization");

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ["scenario", "name", "last_name", "email"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    const response = await fetch(
      "https://tiran.shop.hesabroclub.ir/api/web/shop-v1/v2/profile",
      {
        method: "PUT",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      return NextResponse.json(
        {
          success: true,
          message: "Profile updated successfully",
          data: data.data,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: data.message || "Failed to update profile",
          errors: data.errors || null,
        },
        { status: response.status || 400 }
      );
    }
  } catch (error) {
    console.log("Error updating profile:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
