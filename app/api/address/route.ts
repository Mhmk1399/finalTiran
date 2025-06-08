import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();

    // Create a new object for the modified body
    const modifiedBody = { ...body };

    // Convert province_id and city_id to integers for the API
    if (modifiedBody.province_id) {
      modifiedBody.province_id = parseInt(modifiedBody.province_id, 10);
    }

    if (modifiedBody.city_id) {
      modifiedBody.city_id = parseInt(modifiedBody.city_id, 10);
    }

    // Get the authorization token from the request headers
    const token = request.headers.get("Authorization");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "لطفا وارد حساب کاربری خود شوید" },
        { status: 401 }
      );
    }

    console.log("Sending to API:", modifiedBody);

    // Forward the request to the external API with the modified body
    const response = await fetch(
      "https://tiran.shop.hesabroclub.ir/api/web/shop-v1/profile/address",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(modifiedBody),
      }
    );

    // Get the response data
    const data = await response.json();
    console.log("API response:", data);

    // Return the response
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error in address API route:", error);
    return NextResponse.json(
      { success: false, message: "خطا در ارتباط با سرور" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Authorization token required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Get address_id from localStorage (will be sent in request body)
    const body = await request.json();
    const { address_id, ...addressData } = body;

    if (!address_id) {
      return NextResponse.json(
        { success: false, error: "Address ID is required" },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = [
      "address_type",
      "province_id",
      "city_id",
      "zipcode",
      "receiver_name",
      "receiver_number",
      "adress",
    ];
    for (const field of requiredFields) {
      if (!addressData[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Make request to external API
    const apiUrl = `https://tiran.shop.hesabroclub.ir/api/web/shop-v1/v2/profile/address?address_id=${address_id}`;

    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(addressData),
    });

    const data = await response.json();
    console.log(data , "boooooddddy")

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.message || "Failed to update address",
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Address updated successfully",
      data: data,
    });
  } catch (error) {
    console.error("Address update error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
