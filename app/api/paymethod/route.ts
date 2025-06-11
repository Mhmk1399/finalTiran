import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get("address_id");

    if (!addressId) {
      return new Response(
        JSON.stringify({
          error: "Address ID is required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Get the authorization header from the request
    const token = request.headers.get("authorization");

    if (!token) {
      return new Response(
        JSON.stringify({
          error: "Authorization header is required",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const response = await fetch(
      `https://tiran.shop.hesabroclub.ir/api/web/shop-v1/v2/cart/checkout?expand=receives%2Cprices&address_id=${addressId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: data.message || "خطا در دریافت اطلاعات پرداخت",
          details: data,
        }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Payment methods fetch error:", error);
    return new Response(
      JSON.stringify({
        error: "خطای سرور داخلی",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
