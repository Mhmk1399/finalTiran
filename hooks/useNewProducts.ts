import useSWR from "swr";
import { Product } from "@/types/type";

interface ApiResponse {
  success: boolean;
  data: {
    items: Product[];
    _meta: {
      totalCount: number;
      pageCount: number;
      currentPage: number;
      perPage: number;
    };
  };
}

const fetcher = async (url: string): Promise<Product[]> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  const data: ApiResponse = await response.json();
  if (!data.success || !data.data?.items) {
    throw new Error("Invalid API response");
  }
  return data.data.items;
};

export const useProducts = (
  endpoint: string,
  category?: string,
  limit?: number
) => {
  // Build URL with category_slug if category is provided
  const url = category
    ? `${endpoint}${
        endpoint.includes("?") ? "&" : "?"
      }category_slug=${category}`
    : endpoint;

  const { data, error, isLoading } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute
  });

  return {
    products: limit && data ? data.slice(0, limit) : data || [],
    isLoading,
    error,
  };
};
