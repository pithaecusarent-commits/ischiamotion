import type { PublicPickupPoint } from "@/lib/types";

export function IschiaPickupMap({ points }: { points: PublicPickupPoint[] }) {
  return (
    <div className="pickup-map" style={{ width: "100%", maxWidth: 560 }}>
      <picture>
        <source srcSet="/images/ischia-motion-map.webp" type="image/webp" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/ischia-motion-map.png"
          alt={`Mappa di Ischia con ${points.length} punti di ritiro IschiaMotion`}
          width="756"
          height="756"
          loading="lazy"
          decoding="async"
          className="ischia-map-image"
        />
      </picture>
    </div>
  );
}
