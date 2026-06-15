import type { Metadata } from "next";
import { VehicleResultsPage } from "@/app/[locale]/vehicle-results-page";
import type { Locale } from "@/lib/types";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true
  },
  alternates: {
    canonical: "/it/risultati"
  }
};

type Props = {
  params: { locale: Locale };
  searchParams?: {
    category?: string;
    start?: string;
    end?: string;
    delivery_method?: string;
    pickup_municipality?: string;
    port_slug?: string;
    hotel_municipality?: string;
  };
};

export default function RisultatiPage({ params, searchParams }: Props) {
  return <VehicleResultsPage locale={params.locale} searchParams={searchParams} />;
}
