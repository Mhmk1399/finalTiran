"use client";
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

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
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setExpandedSections({ categories: false, colors: false });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full p-4 my-6 flex items-center justify-center" ref={filterRef } dir="rtl">
      <div className="flex flex-col px-5 py-2 md:flex-row items-center justify-center gap-4 md:gap-6 border-b border-dashed ">
        
        {/* Categories Filter */}
        <div className="relative">
          <button
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-center gap-2 px-5 py-2 bg-transparent rounded-full text-gray-800 font-medium hover:bg-gray-100 transition-colors"
          >
            <span>دسته‌بندی</span>
            <ChevronDown 
              className={`w-4 h-4 transition-transform duration-300 ${
                expandedSections.categories ? 'rotate-180' : ''
              }`}
            />
          </button>
          {expandedSections.categories && (
            <div className="absolute top-full mt-2 w-56 p-4 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      selectedCategories.includes(category.id)
                        ? 'bg-gray-900 text-white hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Colors Filter */}
        <div className="relative">
          <button
            onClick={() => toggleSection('colors')}
            className="flex items-center justify-center gap-2 px-5 py-2 bg-transparent rounded-full text-gray-800 font-medium hover:bg-gray-100 transition-colors"
          >
            <span>رنگ</span>
            <ChevronDown 
              className={`w-4 h-4 bg-white transition-transform duration-300 ${
                expandedSections.colors ? 'rotate-180' : ''
              }`}
            />
          </button>
          {expandedSections.colors && (
            <div className="absolute top-full mt-2 w-56 p-4  z-10">
              <div className="flex flex-wrap bg-white p-4 rounded-md gap-2">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleColorChange(color.id)}
                    className={`px-3 py-1 text-sm   transition-colors ${
                      selectedColors.includes(color.id)
                        ? 'bg-gray-900 text-white hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
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
          className={`flex items-center gap-3 px-5 py-2 rounded-full font-medium transition-all duration-300 ${
            availableOnly
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          <div className={`w-5 h-5 rounded-full bg-white flex items-center justify-center transition-all duration-300 ${availableOnly ? 'bg-opacity-100' : 'bg-opacity-50'}`}>
            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${availableOnly ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          </div>
          <span>فقط کالاهای موجود</span>
        </button>
      </div>
    </div>
  );
};

export default FilterCard;
