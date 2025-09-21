"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ShopIntro from "@/components/static/shopIntro";
import VideoShowcase from "@/components/static/ui/videoShowcase";
import ProductRow from "@/components/global/ProductsRow";
// import FilterCard from "@/components/static/ui/FilterCard";
import { Category } from "@/types/type";

function ShopPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    colors: [] as string[],
    available: false,
  });
  console.log(setFilters);
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
        console.log("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
 
  useEffect(() => {
    const query = searchParams.get("query");

    if (query && categories.length > 0) {
      // Find parent category by cat_en_name and show its children
      const parentCategory = categories.find(
        (cat) => cat.cat_en_name === query
      );
      
      if (parentCategory && parentCategory.children.length > 0) {
        setFilteredCategories(parentCategory.children);
      } else {
        // Search for third level category
        const thirdLevelCategory = categories
          .flatMap(cat => cat.children)
          .flatMap(child => child.children || [])
          .find(grandChild => grandChild.cat_en_name === query);
        
        if (thirdLevelCategory) {
          setFilteredCategories([thirdLevelCategory]);
        } else {
          setFilteredCategories([]);
        }
      }
      setShowIntro(false);
    } else {
      // Show all categories if no query
      setFilteredCategories(categories);
    }
  }, [searchParams, categories]);
 

  // Filter categories based on selected category filters (using slugs)
  const displayCategories =
    filters.categories.length > 0
      ? filteredCategories.filter((category) =>
          filters.categories.includes(category.slug)
        )
      : filteredCategories;

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  if (showIntro) {
    return <ShopIntro onComplete={handleIntroComplete} />;
  }

  return (
    <main>
      <VideoShowcase />
      <div className="md:px-8 lg:px-20">
        {/* <div className="mt-8 mb-12">
          <FilterCard
            onFilterChange={setFilters}
            categories={categories.map((cat) => ({
              id: cat.id.toString(),
              label: cat.cat_name,
              slug: cat.slug,
              cat_en_name: cat.parent?.cat_en_name,
            }))}
            colors={[
              { id: "red", label: "قرمز" },
              { id: "abi", label: "آبی" },
              { id: "black", label: "مشکی" },
              { id: "white", label: "سفید" },
            ]}
          />
        </div> */}
        {displayCategories.map((category) => (
          <div key={category.id} className="mt-12">
            <ProductRow
              filters={filters}
              title={category.cat_name}
              description={`جدیدترین ${category.cat_name} را کشف کنید`}
              endpoint="/api/shop"
              className=""
              categorySlug={category.slug}
              showLoadMore={true}
            />
          </div>
        ))}
      </div>
    </main>
  );
}

export default function Shop() {
  return (
    <Suspense>
      <ShopPage />
    </Suspense>
  );
}
