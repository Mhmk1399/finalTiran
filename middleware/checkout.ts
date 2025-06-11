// Get checkout information based on address ID
export const getCheckoutInfo = async (addressId?: number) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("لطفا وارد حساب کاربری خود شوید");
    }

    // Check if addressId is provided
    let finalAddressId = addressId;

    // If no addressId provided, try to get from localStorage
    if (!finalAddressId) {
      const storedAddressId = localStorage.getItem("address_id");
      if (storedAddressId) {
        finalAddressId = parseInt(storedAddressId);
      }
    }

    // If still no addressId, throw error
    if (!finalAddressId || isNaN(finalAddressId)) {
      throw new Error("آدرس تحویل انتخاب نشده است");
    }

    console.log("Getting checkout info for address ID:", finalAddressId);

    const response = await fetch(
      `/api/cart/checkout?address_id=${finalAddressId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);

      // Handle specific error cases
      if (response.status === 404) {
        throw new Error("آدرس انتخاب شده یافت نشد");
      } else if (response.status === 422) {
        throw new Error("آدرس انتخاب شده نامعتبر است");
      } else if (response.status === 401) {
        // Clear invalid token and redirect to login
        localStorage.removeItem("token");
        throw new Error("لطفا دوباره وارد حساب کاربری خود شوید");
      }

      throw new Error(`خطا در دریافت اطلاعات ارسال: ${response.status}`);
    }

    // Try to parse the response as JSON
    let result;
    try {
      result = await response.json();
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      throw new Error("خطا در پردازش پاسخ سرور");
    }

    if (!result.success) {
      // Handle specific error messages
      if (result.message && result.message.includes("address")) {
        throw new Error("آدرس انتخاب شده معتبر نیست");
      }
      throw new Error(result.message || "خطا در دریافت اطلاعات ارسال");
    }

    console.log("Checkout Info:", result.data);

    // Validate that we have required data
    if (!result.data) {
      throw new Error("اطلاعات ارسال دریافت نشد");
    }

    // Store the address ID if it was successful
    if (finalAddressId) {
      localStorage.setItem("address_id", finalAddressId.toString());
    }

    return result.data;
  } catch (error: any) {
    console.error("Checkout Info Error:", error);

    // If it's an address-related error, clear the stored address
    if (
      error.message &&
      (error.message.includes("آدرس") ||
        error.message.includes("address") ||
        error.message.includes("422") ||
        error.message.includes("404"))
    ) {
      localStorage.removeItem("address_id");
    }

    throw new Error(error.message || "خطا در دریافت اطلاعات ارسال");
  }
};

// Add item to cart
export const addToCart = async (varietyId: number, quantity: number) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("لطفا وارد حساب کاربری خود شوید");
    }

    const requestData = {
      variety_id: varietyId,
      quantity: quantity,
      unit_id: 1,
    };

    console.log("addToCart request data:", requestData);
    console.log("Token:", token ? "exists" : "missing");

    const response = await fetch("/api/cart/index", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.replace("Bearer ", "")}`, // Clean token
      },
      body: JSON.stringify(requestData),
    });

    console.log("addToCart response status:", response.status);

    const responseText = await response.text();
    console.log("addToCart raw response:", responseText);

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse response:", parseError);
      throw new Error("Invalid response from server");
    }

    console.log("addToCart parsed result:", result);

    if (!response.ok) {
      console.error("API Error Response:", result);

      // Handle specific 422 errors
      if (response.status === 422) {
        if (result.message && result.message.includes("address")) {
          throw new Error("آدرس انتخاب شده نامعتبر است");
        } else if (result.message && result.message.includes("variety")) {
          throw new Error("محصول انتخاب شده نامعتبر است");
        } else if (result.message && result.message.includes("quantity")) {
          throw new Error("تعداد وارد شده نامعتبر است");
        } else {
          throw new Error("اطلاعات ارسالی نامعتبر است");
        }
      }

      throw new Error(`خطا در افزودن به سبد خرید: ${response.status}`);
    }

    if (!result.success) {
      throw new Error(result.message || "خطا در افزودن به سبد خرید");
    }

    return result.data;
  } catch (error) {
    console.error("Add to Cart Error:", error);
    throw error;
  }
};

// Complete checkout process - Updated to include more parameters
export const completeCheckout = async (
  addressId: number,
  description: string,
  payMethodId: number,
  selectedDate: string
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("لطفا وارد حساب کاربری خود شوید");
    }

    const checkoutData = {
      address_id: addressId,
      send_method_id: 22,
      pay_method_id: payMethodId,
      callback_url: window.location.origin + "/checkout/success",
      receive_date: selectedDate, // Use timestamp instead of hardcoded date
      description: description || "سفارش از فروشگاه",
    };

    console.log("Complete checkout data:", checkoutData);

    const response = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(checkoutData),
    });

    console.log("Complete checkout response status:", response.status);

    // Check if the response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        throw new Error(`خطا در تکمیل سفارش: ${response.status}`);
      }

      throw new Error(
        errorData.error ||
          errorData.message ||
          `خطا در تکمیل سفارش: ${response.status}`
      );
    }

    // Try to parse the response as JSON
    let result;
    try {
      result = await response.json();
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      throw new Error("خطا در پردازش پاسخ سرور");
    }

    console.log("Complete checkout result:", result);

    // Return the full result object to preserve the structure
    return result;
  } catch (error: any) {
    console.error("Complete Checkout Error:", error);
    throw new Error(error.message || "خطا در تکمیل سفارش");
  }
};
