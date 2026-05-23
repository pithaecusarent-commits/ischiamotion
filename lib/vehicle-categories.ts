export const NAUTICAL_CATEGORY_SLUGS = ["gommone", "barca", "boat-with-skipper", "skipper"] as const;

export function isNauticalCategory(slug: string | undefined | null): boolean {
  if (!slug) return false;
  return (NAUTICAL_CATEGORY_SLUGS as readonly string[]).includes(slug);
}
