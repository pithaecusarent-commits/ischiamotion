import { VehicleResultsPage } from "@/app/[locale]/vehicle-results-page";
import type { Locale } from "@/lib/types";

type Props = {
  params: { locale: Locale };
  searchParams?: {
    category?: string;
    start?: string;
    end?: string;
    delivery_method?: string;
  };
};

export default function RisultatiPage({ params, searchParams }: Props) {
  return <VehicleResultsPage locale={params.locale} searchParams={searchParams} />;
}
