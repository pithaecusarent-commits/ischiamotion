export type Locale = "it" | "en";

export type VehicleCategorySlug = "scooter" | "auto" | "barca" | "bici";

export type BookingDeliveryMethod = "pickup_point" | "port_delivery" | "hotel_delivery";

export type BookingPaymentType = "pay_on_pickup" | "deposit_required" | "prepaid_full";

export type BookingPaymentMethod = "unknown" | "cash" | "card" | "bank_transfer" | "future_online_card";

export type BookingPaymentStatus = "unpaid" | "deposit_pending" | "deposit_paid" | "paid" | "refunded" | "cancelled";

export type PublicVehicle = {
  id: string;
  category: VehicleCategorySlug;
  title_it: string;
  title_en: string;
  location_it: string;
  location_en: string;
  price_from: number;
  features_it: string[];
  features_en: string[];
  emoji: string;
  is_available: boolean;
};

export type PublicPickupPoint = {
  id: string;
  name_it: string;
  name_en: string;
  zone: string;
  public_label_it: string;
  public_label_en: string;
  latitude: number | null;
  longitude: number | null;
  description_it?: string | null;
  description_en?: string | null;
  is_active: boolean;
};

export type VehicleFilter = "all" | VehicleCategorySlug;

export type VehicleCategory = {
  id: string;
  slug: string;
  name_it: string;
  name_en: string;
  is_active: boolean;
  created_at: string;
};

export type PickupPoint = {
  id: string;
  slug: string;
  name_it: string;
  name_en: string;
  public_label_it: string;
  public_label_en: string;
  zone: string;
  address_internal: string | null;
  latitude: number | null;
  longitude: number | null;
  description_it: string | null;
  description_en: string | null;
  is_active: boolean;
  created_at: string;
};

export type Renter = {
  id: string;
  business_name_internal: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  status: "pending" | "active" | "paused" | "disabled";
  created_at: string;
  updated_at: string;
};

export type Vehicle = {
  id: string;
  category_id: string | null;
  renter_id: string | null;
  pickup_point_id: string | null;
  title_it: string;
  title_en: string;
  description_it: string | null;
  description_en: string | null;
  price_from: number | null;
  image_url: string | null;
  features_it: string[];
  features_en: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Booking = {
  id: string;
  booking_code: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_language: Locale;
  vehicle_id: string | null;
  renter_id: string | null;
  pickup_point_id: string | null;
  start_date: string;
  end_date: string;
  pickup_time: string | null;
  status: "pending" | "confirmed" | "voucher_sent" | "checked_in" | "cancelled" | "completed" | "no_show";
  delivery_method: BookingDeliveryMethod;
  delivery_location: string | null;
  delivery_notes: string | null;
  payment_type: BookingPaymentType;
  payment_method: BookingPaymentMethod;
  payment_status: BookingPaymentStatus;
  total_amount: number | null;
  deposit_amount: number | null;
  balance_due: number | null;
  payment_notes: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type BookingVoucher = {
  id: string;
  booking_id: string;
  voucher_code: string;
  qr_payload: string | null;
  qr_image_url: string | null;
  issued_at: string | null;
  sent_at: string | null;
  created_at: string;
};

export type Checkin = {
  id: string;
  booking_id: string | null;
  voucher_code: string | null;
  checked_in_at: string | null;
  checked_in_by: string | null;
  method: string | null;
  notes: string | null;
  created_at: string;
};

export type RenterCategoryAvailability = {
  id: string;
  renter_id: string;
  category_id: string;
  pickup_point_id: string | null;
  is_open: boolean;
  reason: string | null;
  updated_at: string;
};
