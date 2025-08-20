"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Grid3X3, Palette, Check } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterCardProps {
  onFilterChange: (filters: {
    categories: string[];
    colors: string[];
    available: boolean;
  }) => void;
  categories: FilterOption[];
  colors: FilterOption[];
}

const FilterCard: React.FC<FilterCardProps> = ({
  onFilterChange,
  categories,
  colors,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categories: false,
    colors: false,
  });

  const filterRef = useRef<HTMLDivElement>(null);

  const handleCategoryChange = (categoryId: string) => {
    const updated = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(updated);
    onFilterChange({
      categories: updated,
      colors: selectedColors,
      available: availableOnly,
    });
  };

  const handleColorChange = (colorId: string) => {
    const updated = selectedColors.includes(colorId)
      ? selectedColors.filter((id) => id !== colorId)
      : [...selectedColors, colorId];

    setSelectedColors(updated);
    onFilterChange({
      categories: selectedCategories,
      colors: updated,
      available: availableOnly,
    });
  };

  const handleAvailableChange = (checked: boolean) => {
    setAvailableOnly(checked);
    onFilterChange({
      categories: selectedCategories,
      colors: selectedColors,
      available: checked,
    });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      categories: section === "categories" ? !prev.categories : false,
      colors: section === "colors" ? !prev.colors : false,
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setExpandedSections({ categories: false, colors: false });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="w-full px-4 py-6 flex items-center justify-center"
      ref={filterRef}
      dir="rtl"
    >
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 w-full max-w-4xl">
        {/* Categories Filter */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => toggleSection("categories")}
            className={`flex items-center justify-center gap-2 px-4 py-2.5   font-medium transition-all duration-200 w-full sm:w-auto ${
              selectedCategories.length > 0
                ? "bg-gray-50 text-gray-700 border border-blue-200"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            <span>دسته بندی</span>
            {selectedCategories.length > 0 && (
              <span className="bg-gray-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                {selectedCategories.length}
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                expandedSections.categories ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedSections.categories && (
            <div className="absolute top-full mt-2 w-full sm:w-64 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-3 py-1.5 text-xs   transition-all duration-200 flex items-center gap-1 ${
                      selectedCategories.includes(category.id)
                        ? "bg-gray-500 text-white hover:bg-gray-800"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {selectedCategories.includes(category.id) && (
                      <Check className="w-3 h-3" />
                    )}
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Colors Filter */}
        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => toggleSection("colors")}
            className={`flex items-center justify-center gap-2 px-4 py-2.5   font-medium transition-all duration-200 w-full sm:w-auto ${
              selectedColors.length > 0
                ? "bg-gray-50 text-gray-700 border border-purple-200"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>رنگ</span>
            {selectedColors.length > 0 && (
              <span className="bg-gray-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                {selectedColors.length}
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                expandedSections.colors ? "rotate-180" : ""
              }`}
            />
          </button>
          {expandedSections.colors && (
            <div className="absolute top-full mt-2 w-full sm:w-64 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleColorChange(color.id)}
                    className={`px-3 py-1.5 text-sm  transition-all duration-200 flex items-center gap-1 ${
                      selectedColors.includes(color.id)
                        ? "bg-gray-500 text-white hover:bg-gray-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {selectedColors.includes(color.id) && (
                      <Check className="w-3 h-3" />
                    )}
                    {color.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Available Filter */}
        <button
          onClick={() => handleAvailableChange(!availableOnly)}
          className={`flex items-center justify-center gap-2 px-4 py-2.5   font-medium transition-all duration-200 w-full sm:w-auto ${
            availableOnly
              ? "bg-blue-50 text-blue-700 border border-blue-200"
              : "bg-gray-50 text-gray-700 hover:bg-gray-100"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              availableOnly
                ? "bg-blue-500 border-blue-500"
                : "bg-white border-gray-300"
            }`}
          >
            {availableOnly && <Check className="w-3 h-3 text-white" />}
          </div>
          <span>فقط کالاهای موجود</span>
        </button>
      </div>
    </div>
  );
};

export default FilterCard;
