import { Product } from "@/types/type";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";

    const response = await fetch(
      `https://tiran.shop.hesabroclub.ir/api/web/shop-v1/v2/product/index?expand=variety,images,full_descrption&page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    // Filter products that have variety and variety is not null
    if (data.success && data.data && data.data.items) {
      data.data.items = data.data.items.filter(
        (product: Product) =>
          product.variety !== null && product.variety !== undefined
      );
    }

    console.log(data, "data in api route");

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
