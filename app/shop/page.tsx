"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import ShopIntro from "@/components/static/shopIntro";
import VideoShowcase from "@/components/static/ui/videoShowcase";
import ProductRow from "@/components/global/ProductsRow";
import FilterCard from "@/components/static/ui/FilterCard";
import { Category } from "@/types/type";

function ShopPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    colors: [] as string[],
    available: false,
  });
  console.log(filters)
  const searchParams = useSearchParams();

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category");
        const data = await response.json();
        if (data.success && data.data) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();

    // Get category parameter from URL
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setShowIntro(false);
    } else {
      setSelectedCategory(null);
    }
  }, [searchParams]);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return (
    <>
      <AnimatePresence>
        {showIntro && !selectedCategory && (
          <ShopIntro onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      <main
        className="mb-12"
        style={{
          background: `url('/assets/images/texture.png')`,
        }}
      >
       
        <VideoShowcase />
        
        <div className="md:px-8 lg:px-20">
          {/* Filter Card */}
          <div className="mt-8 mb-12">
            <FilterCard
              onFilterChange={setFilters}
              categories={categories.map(cat => ({
                id: cat.id.toString(),
                label: cat.cat_name,
              }))}
              colors={[
                { id: "red", label: "قرمز" },
                { id: "blue", label: "آبی" },
                { id: "black", label: "مشکی" },
                { id: "white", label: "سفید" },
              ]}
            />
          </div>

          {/* Dynamic Product Rows */}
          {categories.map((category) => (
            <div key={category.id} className="mt-12">
              <ProductRow
                title={category.cat_name}
                description={`جدیدترین ${category.cat_name} را کشف کنید`}
                endpoint="/api/shop"
                className=""
                category={category.cat_name}
              />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default function Shop() {
  return (
    <Suspense>
      <ShopPage />
    </Suspense>
  );
}
