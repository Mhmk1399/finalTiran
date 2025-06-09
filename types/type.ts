// ------------------------------ category -----------------------------------

export interface Category {
  id: number;
  cat_name: string;
  cat_en_name: string;
  slug: string;
  src: string;
  icon: string;
  page_title: string;
  meta_tag: string;
  seo_des: string;
  selected: number;
  parent: Category | null;
  children: Category[];
  image_url: string;
}

// --------------------------------- product type ---------------------------

export interface Product {
  id: number;
  slug: string;
  page_title: string;
  meta_tag: string | null;
  seo_description: string;
  fa_name: string;
  en_name: string;
  store_stock: number;
  images: Array<{
    id: number;
    src: string;
  }>;
  brandMain: string | null;
  main_image_id: number | null;
  // Single variety object (for backward compatibility)
  variety: {
    id: number;
    price_main: number;
    price_final: number | string;
    is_coworker_price: boolean;
    for_sale: number;
    product_alert: string;
    Properties: Array<{
      id: number;
      title: string;
      property_id: number | string;
      property: {
        id: number | string;
        title: string;
      };
      code?: string; // For color properties
    }>;
    storage_image_ids: string | string[];
    full_name: string;
    category: {
      id: number;
      cat_name: string;
      cat_en_name: string;
      slug: string;
      src: string;
      icon: string;
      page_title: string;
      meta_tag: string;
      seo_des: string;
      selected: number;
      parent: {
        id: number;
        cat_name: string;
        cat_en_name: string;
        slug: string;
        src: string;
        icon: string;
        page_title: string;
        meta_tag: string;
        seo_des: string;
        selected: number;
        parent: any | null;
      } | null;
    };
    is_main: boolean;
    show_unit: string;
    units: Array<{
      id: number;
      title: string;
      short_title: string | null;
      step: string;
      ratio: number;
      is_main: number;
      can_buy: number;
      main_title: string;
    }>;
    fa_name: string;
    seo_description: string;
    slug: string;
    product_id: number;
    getWarranty: any | null;
    sepidar_code: string | null;
    b_code: string | null;
    mainTitle: string;
    store_stock: number;
    color: number;
  };
  // Array of varieties (for new implementation)
  varieties?: Array<{
    id: number;
    price_main: number;
    priceOff: number;
    for_sale: number;
    product_alert: string;
    Properties: Record<string, number>;
    showProperties: Array<{
      id: number;
      title: string;
      sort: number;
      child: {
        id: number;
        title: string;
      };
    }>;
    storage_image_ids: string;
    full_name: string;
    category: {
      id: number;
      cat_name: string;
      cat_en_name: string;
      slug: string;
      src: string;
      icon: string;
      page_title: string;
      meta_tag: string;
      seo_des: string;
      selected: number;
      parent: {
        id: number;
        cat_name: string;
        cat_en_name: string;
        slug: string;
        src: string;
        icon: string;
        page_title: string;
        meta_tag: string;
        seo_des: string;
        selected: number;
        parent: any | null;
      } | null;
    };
    is_main: boolean;
    show_price: number;
    show_price_off: number | null;
    show_unit: string;
    units: Array<{
      id: number;
      title: string;
      short_title: string | null;
      step: string;
      ratio: number;
      is_main: number;
      can_buy: number;
      main_title: string;
    }>;
    fa_name: string;
    seo_description: string;
    slug: string;
    product_id: number;
    getColor: {
      id: number;
      fa_name: string;
      en_name: string;
      code: string;
    } | null;
    getWarranty: any | null;
    sepidar_code: string | null;
    b_code: string | null;
    price_store: number | null;
    price_site: number | null;
    price_buy: number | null;
    mainTitle: string;
    store_stock: number;
    src: string;
    color: number;
  }>;
}

export interface ProductResponse {
  items: Product[];
  _links: {
    self: { href: string };
    first: { href: string };
    last: { href: string };
  };
  _meta: {
    totalCount: number;
    pageCount: number;
    currentPage: number;
    perPage: number;
  };
}

export interface ProductCardProps {
  product: Product;
}

// ---------------------------- product comment ------------------------------
export interface CommentChild {
  id: number;
  name: string;
  title: string;
  comment: string;
  can_edit: boolean;
  childs: CommentChild[];
}

export interface CommentItem {
  id: number;
  name: string;
  title: string;
  comment: string;
  can_edit: boolean;
  childs: CommentChild[];
  rate?: number;
}

export interface CommentResponse {
  success: boolean;
  data: {
    items: CommentItem[];
    _links: {
      self: { href: string };
      first: { href: string };
      last: { href: string };
    };
    _meta: {
      totalCount: number;
      pageCount: number;
      currentPage: number;
      perPage: number;
    };
  };
}

export interface Comment {
  id: number | string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  title?: string;
  replies?: Comment[];
  rate?: number;
}

export interface ProductCommentsProps {
  productSlug: string;
  productId: number;
}

// ---------------------------- productgrid ---------------------------------
export interface ProductGridProps {
  categoryFilter?: string | null;
}
// ---------------------------- producttabs ---------------------------------
export interface ProductTabsProps {
  product: Product;
}

//-------------------------- User interfaces dashboard -------------------------
export interface KeyValuePair {
  key: number;
  value: string | boolean;
}
interface UserBasicInfo {
  id: number;
  username: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  job: string;
  sex: {
    key: number;
    value: boolean | string;
  };
}

export interface UserType {
  id: number;
  type_name: string;
}
interface Province {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
  province_id: number;
}

export interface Address {
  id: number;
  address_type: number;
  zipcode: string;
  adress: string; // Note: keeping the original spelling from API
  province: Province;
  city: City;
  receiver_name: string;
  receiver_number: string;
  latitude: string | null;
  longitude: string | null;
  selected: boolean;
}
export interface AddressFormData {
  address_type: string;
  province_id: string;
  city_id: string;
  zipcode: string;
  receiver_name: string;
  receiver_number: string;
  adress: string;
}

export interface UserProfile {
  id: number;
  user: UserBasicInfo;
  show_title: string | null;
  national: KeyValuePair;
  nationalID: string | null;
  type_legal: KeyValuePair;
  identity_verification: KeyValuePair;
  type: UserType;
  birthday: string | null;
  complete: boolean;
  jobs: any[]; // You can define a more specific type if needed
  addresses: Address[];
}
// -------------------------------- ProductGallery ---------------------

export interface ProductGalleryProps {
  primaryImage: string;
  secondaryImage?: string;
  additionalImages: string[];
  productName: string;
  layout: "thumbnails" | "desktop" | "mobile";
  activeImageIndex?: number;
  onThumbnailClick?: (index: number) => void;
  onImageChange?: (index: number) => void;
}
// ------------------------------- ProductInfo ------------------------

export interface ProductInfoProps {
  product: Product;
  layout?: "desktop" | "mobile";
}

// ----------------------------- contact -----------------------------

export type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

// Form status type
export type FormStatus = "idle" | "submitting" | "success" | "error";

// ---------------------------- cart --------------------------------
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: null | string;
  size: null | string;
  color: null | string;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// ---------------------------- ScrollMediaShowcase ----------------------
export interface MediaItem {
  id: number;
  type: "image" | "video";
  src: string;
  alt?: string;
  title: string;
  description: string;
}

// ------------------------ datepicker ----------------------------------------
export interface PersianDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

// ------------------------ locationselector for cart ------------------------
export interface LocationSelectorProps {
  onProvinceChange?: (provinceId: string, provinceName: string) => void;
  onCityChange?: (cityId: string, cityName: string) => void;
  onLocationSelected?: (
    provinceId: string,
    provinceName: string,
    cityId: string,
    cityName: string
  ) => void;
  className?: string;
}

// ---------------------------- megamenu ----------------------------------------
export interface MegaMenuProps {
  categories: Category[];
  hoveredCategory: number | null;
  setHoveredCategory: (index: number | null) => void;
}

export interface ScrollMediaShowcaseProps {
  initialCenterImage?: string;
  transitionComplete?: () => void;
}

// -------------------------- categoryGrid ----------------------------------------
export interface CategoryItem {
  id: number;
  imageDefault: string; // Black & white image
  imageHover: string; // Colorful image
  title: string;
  subtitle?: string;
  description?: string;
  color?: string;
  icon?: string;
}
export interface MixedGridCardProps {
  category: CategoryItem;
  index?: number;
  isHovered: boolean;
  size: string;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  zIndex?: number;
}

export interface MixedGridShowcaseProps {
  categories: CategoryItem[];
  title?: string;
  subtitle?: string;
}
export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

//  --------------------------------- videoShowCase -------------------------------
export interface VideoItem {
  id: string;
  videoUrl: string;
  thumbnail: string;
  title: string;
  description: string;
  category?: string;
}

// ------------------------------------ Orders dashboard ------------------------------
export interface SendStatus {
  status: number;
  text: string;
}

export interface Status {
  status: number;
  text: string;
}

export interface PayStatus {
  status: number;
  text: string;
}

export interface SendMethodPrice {
  id: number;
  min_cart: number;
  price: number;
}

export interface SendMethodReceive {
  date: string;
  receives: any[];
}

export interface SendMethod {
  id: number;
  title: string;
  description: string;
  price: SendMethodPrice;
  prices: SendMethodPrice[];
  receives: SendMethodReceive[];
}

export interface PayMethod {
  id: number;
  title: string;
  description: string;
}

export interface Order {
  id: number;
  send_status: SendStatus;
  status: Status;
  pay_status: PayStatus;
  send_price: number;
  price_total: string | number;
  sendMethod: SendMethod;
  payMethod: PayMethod;
  sendMethodReceive: any;
  description: string;
  receive_date: string;
  date: string;
  can_payment: boolean;
  remind: number;
  remain: string | number;
  can_deliver: boolean;
}

export interface ApiResponse {
  success: boolean;
  data: {
    items: Order[];
    _links: any;
    _meta: {
      totalCount: number;
      pageCount: number;
      currentPage: number;
      perPage: number;
    };
  };
}
