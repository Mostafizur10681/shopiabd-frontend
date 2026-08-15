export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
export const API_V1 = `${API_BASE_URL}/api/v1`;

export interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: string | number;
  sale_price?: string | number | null;
  SKU?: string;
  brand?: string;
  unit?: string;
  stock?: number;
  featured?: boolean;
  best_seller?: boolean;
  organic?: boolean;
  new_arrival?: boolean;
  image?: string | null;
  images?: string[];
  status?: boolean;
  category_id?: number;
  sub_category_id?: number | null;
  sub_category?: string | null;
  category?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  attributes?: { name: string; value: string }[];
  rating?: number;
  reviews_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  status?: boolean | number;
  sub_categories?: {
    id: number;
    name: string;
    slug: string;
    category_id?: number;
  }[];
}

export interface ApiBanner {
  id: number;
  title?: string;
  title_line1?: string;
  title_line2?: string;
  subtitle?: string;
  badge?: string;
  tagline?: string;
  image?: string;
  left_image?: string;
  bg_color?: string;
  right_bg_color?: string;
  cta_text?: string;
  cta_link?: string;
  order?: number;
  is_active?: boolean;
  menu_location?: string;
}

export interface ApiFaq {
  id: number;
  question: string;
  answer: string;
  category?: string;
  faq_category_id?: number;
}

export interface ApiDivision {
  id: number;
  name: string;
  bn_name?: string;
}

export interface ApiDistrict {
  id: number;
  division_id: number;
  name: string;
  bn_name?: string;
}

export interface ApiThana {
  id: number;
  district_id: number;
  name: string;
  bn_name?: string;
}

export interface ApiFooterSettings {
  id?: number;
  store_name?: string;
  logo_image?: string | null;
  address?: string;
  contact_address?: string;
  map_url?: string;
  copyright_text?: string;
  contact_phone?: string;
  contact_email?: string;
  working_hours_1?: string;
  working_hours_2?: string;
  contact_hours?: string;
  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  pinterest_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  tiktok_url?: string;
  column_1_title?: string;
  column_1_links?: { label: string; url: string }[];
  column_2_title?: string;
  column_2_links?: { label: string; url: string }[];
  column_3_title?: string;
  column_3_links?: { label: string; url: string }[];
  payment_methods?: string[];
}

export interface OrderItemPayload {
  product_id: number;
  quantity: number;
  attributes?: Record<string, string>;
}

export interface CreateOrderPayload {
  customer_name: string;
  company_name?: string;
  customer_phone: string;
  customer_email?: string;
  country?: string;
  division?: string;
  district: string;
  thana?: string;
  address: string;
  town_city?: string;
  postcode?: string;
  order_notes?: string;
  payment_method?: string;
  ship_different?: boolean;
  ship_customer_name?: string;
  ship_company_name?: string;
  ship_country?: string;
  ship_address?: string;
  ship_town_city?: string;
  ship_postcode?: string;
  ship_district?: string;
  ship_phone?: string;
  shipping_amount?: number;
  user_id?: number;
  items: OrderItemPayload[];
}

export async function placeOrder(payload: CreateOrderPayload) {
  return fetchFromApi<{
    success: boolean;
    message: string;
    data: any;
  }>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = endpoint.startsWith("http") ? endpoint : `${API_V1}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  // Attach Sanctum token if available in localStorage
  let headers: Record<string, string> = {
    "Accept": "application/json",
    "Content-Type": "application/json",
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("shopia_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  if (options?.headers) {
    headers = { ...headers, ...(options.headers as Record<string, string>) };
  }

  const res = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    let errMessage = `HTTP error ${res.status}`;
    let validationErrors: Record<string, string[]> | undefined = undefined;
    try {
      const errData = await res.json();
      if (errData.errors && typeof errData.errors === "object") {
        validationErrors = errData.errors;
        const firstKey = Object.keys(errData.errors)[0];
        if (firstKey && Array.isArray(errData.errors[firstKey]) && errData.errors[firstKey][0]) {
          errMessage = errData.errors[firstKey][0];
        } else if (errData.message) {
          errMessage = errData.message;
        }
      } else if (errData.message) {
        errMessage = errData.message;
      }
    } catch {
      // ignore
    }
    const error: any = new Error(errMessage);
    if (validationErrors) {
      error.errors = validationErrors;
    }
    throw error;
  }

  return res.json();
}

// ── Products ──
export async function getProducts(params?: {
  page?: number;
  per_page?: number;
  category?: string | number;
  search?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.per_page) searchParams.set("per_page", String(params.per_page));
  if (params?.category) searchParams.set("category", String(params.category));
  if (params?.search) searchParams.set("search", String(params.search));

  const query = searchParams.toString();
  const endpoint = `/products${query ? `?${query}` : ""}`;
  return fetchFromApi<{ success: boolean; data: { data: ApiProduct[]; meta?: any; links?: any } }>(endpoint);
}

export async function getProductBySlugOrId(idOrSlug: string | number) {
  return fetchFromApi<{ success: boolean; data: ApiProduct }>(`/products/${idOrSlug}`);
}

// ── Categories ──
export async function getCategories(all: boolean = true) {
  return fetchFromApi<{ success: boolean; data: ApiCategory[] }>(`/categories${all ? "?all=1" : ""}`);
}

// ── Banners ──
export async function getBanners() {
  return fetchFromApi<{ success: boolean; data: ApiBanner[] }>("/banners");
}

// ── Locations ──
export async function getDivisions() {
  return fetchFromApi<{ success: boolean; data: ApiDivision[] }>("/divisions");
}

export async function getDistricts(divisionId?: number | string) {
  const endpoint = divisionId ? `/districts?division_id=${divisionId}` : "/districts";
  return fetchFromApi<{ success: boolean; data: ApiDistrict[] }>(endpoint);
}

export async function getThanas(districtId?: number | string) {
  const endpoint = districtId ? `/thanas?district_id=${districtId}` : "/thanas";
  return fetchFromApi<{ success: boolean; data: ApiThana[] }>(endpoint);
}

// ── FAQs ──
export async function getFaqs() {
  return fetchFromApi<{ success: boolean; data: ApiFaq[] }>("/faqs");
}

// ── Partners ──
export async function getPartners() {
  return fetchFromApi<{ success: boolean; data: any[] }>("/partners");
}

// ── About Page ──
export async function getAboutPage() {
  return fetchFromApi<{ success: boolean; data: any }>("/about");
}

export async function updateAboutPage(payload: any) {
  return fetchFromApi<{ success: boolean; message: string; data: any }>("/about", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ── Orders ──
export async function createOrder(payload: CreateOrderPayload) {
  return fetchFromApi<{ success: boolean; message: string; data: any }>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getUserOrders(page: number = 1, perPage: number = 20) {
  return fetchFromApi<{ success: boolean; data: any; message?: string }>(`/orders?page=${page}&per_page=${perPage}`);
}

export async function trackOrder(orderNumber: string) {
  return fetchFromApi<{ success: boolean; data: any }>(`/orders/track/${orderNumber}`);
}

// ── Subscriptions ──
export async function subscribeNewsletter(email: string) {
  return fetchFromApi<{ success: boolean; message: string }>("/subscriptions", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// ── Contact Messages ──
export async function sendContactMessage(payload: {
  name: string;
  email?: string;
  phone: string;
  subject?: string;
  message: string;
}) {
  return fetchFromApi<{ success: boolean; message: string }>("/messages", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ── Auth ──
export async function loginCustomer(credentials: { email?: string; phone?: string; password?: string }) {
  return fetchFromApi<{ success: boolean; message: string; data: { token: string; user: any } }>("/auth/customer/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function registerCustomer(data: { name: string; email?: string; phone: string; password?: string }) {
  return fetchFromApi<{ success: boolean; message: string; data: { token: string; user: any } }>("/auth/customer/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getAuthProfile() {
  return fetchFromApi<{ success: boolean; data: any }>("/auth/profile");
}

export async function updateAuthProfile(payload: {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  profile_pic?: string;
}) {
  return fetchFromApi<{ success: boolean; message: string; data: any }>("/auth/profile", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function changeAuthPassword(payload: {
  current_password: string;
  password: string;
  password_confirmation: string;
}) {
  return fetchFromApi<{ success: boolean; message: string }>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteAuthAccount() {
  return fetchFromApi<{ success: boolean; message: string }>("/auth/delete-account", {
    method: "POST",
  });
}

export async function getFooterSettings() {
  return fetchFromApi<{ success: boolean; data: ApiFooterSettings }>("/footer-settings");
}

export async function logoutCustomer() {
  return fetchFromApi<{ success: boolean; message: string }>("/auth/logout", {
    method: "POST",
  });
}

export interface ApiContactSettings {
  id?: string | number;
  badge_text?: string;
  hero_title?: string;
  hero_subtitle?: string;
  phone?: string;
  secondary_phone?: string;
  email?: string;
  secondary_email?: string;
  whatsapp_number?: string;
  address?: string;
  business_hours_weekday?: string;
  business_hours_weekend?: string;
  response_time_note?: string;
  map_title?: string;
  map_subtitle?: string;
  map_url?: string;
  location_directions?: string;
  form_title?: string;
  form_subtitle?: string;
  form_topics?: string[];
  emergency_notice?: string;
  features?: { icon?: string; title?: string; desc?: string }[];
  support_title?: string;
  support_desc?: string;
  support_phone?: string;
  support_image?: string;
}

export async function getContactSettings() {
  return fetchFromApi<{ success: boolean; data: ApiContactSettings }>("/contact-settings");
}
