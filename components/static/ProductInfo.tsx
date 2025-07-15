"use client";
import { useState, useEffect } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/cartContext";
import { Product, ProductInfoProps } from "@/types/type";
import { toast } from "react-toastify";
import AddressModal from "./addressModal";
import { addToCart } from "@/middleware/checkout";
import { useRouter } from "next/navigation";

export default function ProductInfo({
  product,
  layout = "mobile",
}: ProductInfoProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedVariety, setSelectedVariety] = useState<
    NonNullable<Product["varieties"]>[number] | null
  >(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  // ProductTabs states

  const { addItem } = useCart();

  // Initialize with the first variety if available
  useEffect(() => {
    if (product?.varieties && product.varieties.length > 0) {
      setSelectedVariety(product.varieties[0]);

      // Set initial size if available
      if (
        product.varieties[0].showProperties &&
        product.varieties[0].showProperties.length > 0
      ) {
        const sizeProperty = product.varieties[0].showProperties.find(
          (prop) => prop.title === "سایز"
        );
        if (sizeProperty) {
          setSelectedSize(sizeProperty.child.title);
        }
      }

      // Set initial color if available
      if (product.varieties[0].getColor) {
        setSelectedColor(product.varieties[0].getColor.fa_name);
      }
    }
  }, [product]);

  // Format price with discount if available
  const formattedPrice = new Intl.NumberFormat("fa-IR", {
    style: "currency",
    currency: "IRR",
    maximumFractionDigits: 0,
  }).format(selectedVariety?.price_main ?? 0);

  // Extract all available properties from varieties
  const propertiesByType: Record<
    string,
    Array<{ id: number; title: string; propertyId: number }>
  > = {};

  // Collect all properties from all varieties
  product?.varieties?.forEach((variety) => {
    variety.showProperties?.forEach((prop) => {
      if (!propertiesByType[prop.title]) {
        propertiesByType[prop.title] = [];
      }

      // Add property if not already in the array
      const existingProp = propertiesByType[prop.title].find(
        (p) => p.id === prop.child.id
      );
      if (!existingProp) {
        propertiesByType[prop.title].push({
          id: prop.child.id,
          title: prop.child.title,
          propertyId: prop.id,
        });
      }
    });
  });

  // Get color information
  const color = selectedVariety?.getColor || null;

  const handlePropertyChange = (
    propertyTitle: string,
    propertyId: number,
    propertyTypeId: number
  ) => {
    console.log(propertyTypeId);
    // Update the selected property
    setSelectedSize(propertyTitle);

    // Find variety that matches this property
    const matchingVariety = product?.varieties?.find((variety) =>
      variety.showProperties?.some((prop) => prop.child.id === propertyId)
    );

    if (matchingVariety) {
      setSelectedVariety(matchingVariety);

      // Update color if the new variety has a different color
      if (matchingVariety.getColor) {
        setSelectedColor(matchingVariety.getColor.fa_name);
      }
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariety || selectedVariety.store_stock <= 0) {
      toast.error("این محصول در انبار موجود نیست", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    // Show adding animation
    setIsAddingToCart(true);

    try {
      // Check if user is logged in
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("لطفا وارد حساب کاربری خود شوید", {
          position: "top-center",
          autoClose: 3000,
        });
        router.push("/auth");

        return;
      }
      // Check if address exists in localStorage
      const addressId = localStorage.getItem("address_id");

      if (!addressId) {
        // If no address, show the address modal
        setShowAddressModal(true);
        return;
      }

      // If address exists, proceed with adding to cart
      await processAddToCart();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "خطا در افزودن به سبد خرید",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
    } finally {
      // Reset button after animation
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 1500);
    }
  };

  const processAddToCart = async () => {
    try {
      if (!selectedVariety) return;

      // 1. Add item to local cart context
      addItem({
        id: selectedVariety.id.toString(),
        name: product.fa_name,
        price: selectedVariety.price_main,
        quantity: quantity,
        image: product?.images[0]?.src,
        size: selectedSize,
        color: selectedColor,
      });

      // 2. Add item to server cart
      await addToCart(selectedVariety.id, quantity);

      toast.success("محصول به سبد خرید اضافه شد", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "خطا در افزودن به سبد خرید",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
    }
  };

  const handleAddressCreated = () => {
    // After address is created, continue with adding to cart
    processAddToCart();
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // ProductTabs configuration

  return (
    <div
      className={`${
        layout === "desktop"
          ? "h-full max-w-none flex flex-col px-6 py-8"
          : "container mx-auto px-4 sm:px-6"
      } ${layout === "desktop" ? "" : "mt-20 sm:pb-8"}`}
    >
      {/* Product Header */}
      <div className="space-y-2">
        {/* Header Section */}
        <div className="flex items-center justify-center md:justify-start">
          <h1
            className={`font-light tracking-wide text-gray-900 mb-3 ${
              layout === "desktop" ? "text-2xl lg:text-3xl" : "text-2xl"
            }`}
          >
            {product.fa_name}
          </h1>
        </div>
        <div className="flex items-center justify-center md:justify-start">
          <h1
            className={`font-light tracking-wide text-gray-400 mb-3 ${
              layout === "desktop" ? "text-base " : "text-sm text-center"
            }`}
          >
            {product.seo_description}
          </h1>
        </div>

        {/* Color Selection Dropdown - First */}

        {color && (
          <div className="pt-4">
            <div className="border-b border-gray-400 border-dashed pb-2 mb-1">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer py-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-900">
                      رنگ: {selectedColor || "انتخاب کنید"}
                    </h3>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-500 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="mt-3 p-3 bg-white  ">
                  <div className="flex flex-wrap gap-3">
                    {Array.from(
                      new Set(
                        product?.varieties
                          ?.filter((v) => v.getColor)
                          ?.map((v) => v.getColor!)
                      )
                    ).map((colorObj) => (
                      <motion.button
                        key={colorObj.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedColor(colorObj.fa_name);
                          const match = product?.varieties?.find(
                            (v) => v.getColor?.id === colorObj.id
                          );
                          if (match) setSelectedVariety(match);
                        }}
                        className={`w-8 h-8 rounded-full  transition-all ${
                          selectedColor === colorObj.fa_name
                            ? "border-gray-900 shadow-lg"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        style={{ backgroundColor: colorObj.code }}
                        title={`${colorObj.fa_name} (${colorObj.code})`}
                      />
                    ))}
                  </div>
                </div>
              </details>
            </div>
          </div>
        )}

        {/* Properties Selection Dropdown - Second */}
        {Object.keys(propertiesByType).length > 0 && (
          <div className="pt-4">
            <div className="border-b border-gray-400 border-dashed pb-2 mb-1">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer py-2">
                  <h3 className="text-sm font-medium text-gray-900">
                    مشخصات محصول: {selectedSize || "انتخاب کنید"}
                  </h3>
                  <svg
                    className="w-4 h-4 text-gray-500 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>

                <div className="mt-6 space-y-6">
                  {/* All Properties in One Section */}
                  <div className="space-y-4">
                    {Object.entries(propertiesByType).map(
                      ([propertyType, options]) =>
                        options.length > 0 && (
                          <div key={propertyType} className="space-y-3">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {propertyType}
                            </h4>
                            <div className="grid grid-cols-12 gap-2">
                              {options.map((option) => (
                                <motion.button
                                  key={option.id}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => {
                                    handlePropertyChange(
                                      option.title,
                                      option.id,
                                      option.propertyId
                                    );
                                  }}
                                  className={`py-2 px-3 text-sm  bg-gray-100 transition-all ${
                                    selectedSize === option.title
                                      ? " text-black"
                                      : "  text-gray-700"
                                  }`}
                                >
                                  {option.title}
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        )
                    )}
                  </div>
                </div>
              </details>
            </div>
          </div>
        )}

        {/* سایر مشخصات - Third */}
        <div className="pt-4">
          <div className="border-b border-gray-400 border-dashed pb-2 mb-1">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer py-2">
                <h3 className="text-sm font-medium text-gray-900">
                  سایر مشخصات
                </h3>
                <svg
                  className="w-4 h-4 text-gray-500 transition-transform group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>

              <div className="mt-6 space-y-6">
                {/* Product Information */}
                <div className="space-y-3 text-xs text-gray-600">
                  <div className="flex justify-start gap-2 py-2">
                    <span>دسته‌بندی:</span>
                    <span className="font-bold">
                      {selectedVariety?.category?.cat_name || "نامشخص"}
                    </span>
                  </div>
                  {selectedVariety?.show_unit && (
                    <div className="flex justify-start gap-2 py-2">
                      <span>واحد:</span>
                      <span className="font-bold">
                        {selectedVariety.show_unit}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-start gap-2 py-2">
                    <span>موجودی:</span>
                    <span
                      className={`font-bold ${
                        (selectedVariety?.store_stock ?? 0) > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {(selectedVariety?.store_stock ?? 0) > 0
                        ? `${selectedVariety?.store_stock} عدد موجود`
                        : "ناموجود"}
                    </span>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* Price, Add to Cart Button, and Quantity in One Row - Last */}
        <div className="pt-6 space-y-4">
          {/* Price - Mobile: Full width, Desktop: In row */}
          <div className="block md:hidden">
            <div className="flex items-center justify-center">
              <div
                className={`font-medium text-gray-900 ${
                  layout === "desktop" ? "text-lg" : "text-xl"
                }`}
              >
                {formattedPrice}
              </div>
            </div>
          </div>

          {/* Add to Cart Button and Quantity in One Row */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
            {/* Price - Desktop: In row */}
            <div className="hidden md:flex items-center">
              <div
                className={`font-medium text-gray-900 ${
                  layout === "desktop" ? "text-lg" : "text-xl"
                } whitespace-nowrap`}
              >
                {formattedPrice}
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex-1 order-2 md:order-1">
              <motion.button
                disabled={!selectedVariety || selectedVariety.store_stock <= 0}
                onClick={handleAddToCart}
                whileHover={
                  (selectedVariety?.store_stock ?? 0) > 0 ? { scale: 1 } : {}
                }
                whileTap={
                  (selectedVariety?.store_stock ?? 0) > 0 ? { scale: 0.99 } : {}
                }
                className={`w-full py-3 md:py-3 flex items-center justify-center gap-3 border border-dashed cursor-pointer font-medium duration-300 transition-all ${
                  (selectedVariety?.store_stock ?? 0) > 0
                    ? " text-black hover:border-gray-300"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                } ${layout === "desktop" ? "text-sm" : "text-sm md:text-base"}`}
              >
                {isAddingToCart ? (
                  <>
                    <Check size={18} />
                    <span className="hidden sm:inline">اضافه شد</span>
                    <span className="sm:hidden">✓</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    <span className="hidden sm:inline">افزودن به سبد خرید</span>
                    <span className="sm:hidden">افزودن</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Quantity Selection */}
            <div className="flex-shrink-0 order-1 md:order-2">
              <div className="flex items-center justify-center md:justify-start">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <motion.button
                    whileHover={{ backgroundColor: "#f9fafb" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={decrementQuantity}
                    className="w-10 h-12 md:w-10 md:h-12 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-light">−</span>
                  </motion.button>

                  <div className="w-12 h-12 md:w-12 md:h-12 flex items-center justify-center border-x border-gray-200 font-medium text-sm">
                    {quantity}
                  </div>

                  <motion.button
                    whileHover={{ backgroundColor: "#f9fafb" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={incrementQuantity}
                    className="w-10 h-12 md:w-10 md:h-12 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-light">+</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Stock Info */}
          <div className="text-center md:text-right">
            <span className="text-xs md:text-sm text-gray-500">
              {(selectedVariety?.store_stock ?? 0) > 0
                ? `${selectedVariety?.store_stock} عدد موجود`
                : "ناموجود"}
            </span>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onAddressCreated={handleAddressCreated}
      />
    </div>
  );
}
