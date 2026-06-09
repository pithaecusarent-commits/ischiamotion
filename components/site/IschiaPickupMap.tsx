import type { PublicPickupPoint } from "@/lib/types";

export function IschiaPickupMap({ points }: { points: PublicPickupPoint[] }) {
  return (
    <div className="pickup-map" style={{ width: "100%", maxWidth: 560 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/ischia-motion-map.png"
        alt={`Mappa di Ischia con ${points.length} punti di ritiro IschiaMotion`}
        className="ischia-map-image"
      />
    </div>
  );
}
