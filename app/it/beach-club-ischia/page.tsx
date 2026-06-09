import { CategoryLanding } from "@/components/site/CategoryLanding";
import { getCategoryLanding } from "@/lib/category-landings";
import { categoryLandingMetadata } from "@/lib/category-landing-metadata";

const content = getCategoryLanding("it", "beach_club");

export const metadata = categoryLandingMetadata(content);

export default function Page() {
  return <CategoryLanding content={content} />;
}
