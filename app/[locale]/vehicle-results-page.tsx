import { notFound } from "next/navigation";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { SearchResults } from "@/components/site/SearchResults";
import { getActivePickupPoints } from "@/lib/supabase/queries/pickup-points";
import { searchPublicVehicles } from "@/lib/supabase/queries/public-vehicles";
import type { BookingDeliveryMethod, Locale, VehicleFilter } from "@/lib/types";

type SearchParams = {
  category?: string;
  start?: string;
  end?: string;
  delivery_method?: string;
};

const locales: Locale[] = ["it", "en"];
const categories: VehicleFilter[] = ["all", "scooter", "auto", "bici", "barca", "skipper"];
const deliveryMethods: BookingDeliveryMethod[] = ["pickup_point", "port_delivery", "hotel_delivery"];

// Maps URL params (which may contain DB slugs) to frontend VehicleFilter slugs.
// Prevents DB slugs like "boat-with-skipper" from falling back to "all".
const categoryAliases: Record<string, VehicleFilter> = {
  "boat-with-skipper": "skipper",
  "bici-elettriche": "bici",
  "barche-gommoni": "barca",
  "gommone": "barca",
  "barche": "barca"
};

function resolveCategory(raw: string | undefined): VehicleFilter {
  if (!raw) return "all";
  const normalized = categoryAliases[raw] ?? raw;
  return categories.includes(normalized as VehicleFilter) ? (normalized as VehicleFilter) : "all";
}

export async function VehicleResultsPage({
  locale,
  searchParams
}: {
  locale: Locale;
  searchParams?: SearchParams;
}) {
  if (!locales.includes(locale)) notFound();

  const category = resolveCategory(searchParams?.category);
  const deliveryMethod = deliveryMethods.includes(searchParams?.delivery_method as BookingDeliveryMethod)
    ? (searchParams?.delivery_method as BookingDeliveryMethod)
    : null;
  const startDate = searchParams?.start || "";
  const endDate = searchParams?.end || "";

  const [pickupPoints, result] = await Promise.all([
    getActivePickupPoints(),
    searchPublicVehicles({
      locale,
      category_slug: category,
      start_date: startDate,
      end_date: endDate,
      delivery_method: deliveryMethod || undefined
    })
  ]);

  return (
    <>
      <Header locale={locale} />
      <main>
        <SearchResults
          locale={locale}
          vehicles={result.vehicles}
          pickupPoints={pickupPoints}
          category={category}
          startDate={startDate}
          endDate={endDate}
          deliveryMethod={deliveryMethod}
          isFallback={result.isFallback}
        />
      </main>
      <Footer locale={locale} />
    </>
  );
}
