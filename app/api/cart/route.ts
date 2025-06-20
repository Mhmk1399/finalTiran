export async function POST(request: Request) {
  try {
    const body = await request.json();
    const Authorization = request.headers.get("Authorization");
    console.log(Authorization, "aaaaaaaaaaaaaaaaaaaaaaaaaa");
    const token = Authorization?.split(" ")[1];
    console.log(token, "333333333333333333333333333333333333333");

    // Ensure credit_deduction is properly formatted as 0 or 1
    // if (body.credit_deduction !== undefined) {
    //   body.credit_deduction = body.credit_deduction ? 1 : 0;
    // }

    // Remove undefined fields
    // Object.keys(body).forEach((key) => {
    //   if (body[key] === undefined) {
    //     delete body[key];
    //   }
    // });

    const response = await fetch(
      "https://tiran.shop.hesabroclub.ir/api/web/shop-v1/cart/checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    console.log(data, "api/cart");

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: data.message || "خطا در پردازش سفارش",
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
    console.error("Checkout error:", error);
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
