import type { PublicPickupPoint } from "@/lib/types";

type MapPoint = {
  zone: string;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
};

const mapPoints: MapPoint[] = [
  { zone: "Ischia Porto", x: 82, y: 48, labelX: 75, labelY: 36 },
  { zone: "Casamicciola", x: 60, y: 31, labelX: 52, labelY: 20 },
  { zone: "Lacco Ameno", x: 43, y: 31, labelX: 30, labelY: 20 },
  { zone: "Forio", x: 22, y: 52, labelX: 12, labelY: 43 },
  { zone: "Sant'Angelo", x: 45, y: 76, labelX: 35, labelY: 86 },
  { zone: "Barano", x: 67, y: 65, labelX: 58, labelY: 76 }
];

const ischiaSilhouette =
  "M365 62 C384 74,396 102,396 132 C396 158,380 172,360 184 C342 196,320 192,300 204 C278 218,256 222,234 218 C212 214,194 224,170 220 C146 216,120 208,94 202 C66 194,38 178,28 156 C16 134,22 108,38 92 C56 74,84 64,116 58 C150 50,186 46,218 44 C252 42,286 46,316 52 C344 58,358 56,365 62 Z";

function getMapPoint(zone: string, index: number) {
  return mapPoints.find((point) => point.zone === zone) || {
    zone,
    x: 22 + index * 10,
    y: 42 + (index % 2) * 12,
    labelX: 18 + index * 10,
    labelY: 32 + (index % 2) * 12
  };
}

export function IschiaPickupMap({ points }: { points: PublicPickupPoint[] }) {
  return (
    <div className="pickup-map" aria-hidden="true">
      <div className="ischia-map-stage">
        <svg className="ischia-map-svg" viewBox="0 0 420 260" role="img" focusable="false">
          <path className="ischia-map-shadow" d={ischiaSilhouette} />
          <path className="ischia-map-land" d={ischiaSilhouette} />
          <path className="ischia-map-outline" d={ischiaSilhouette} />
          <path
            className="ischia-map-ridge"
            d="M118 148 C158 130,204 120,252 124 C292 128,326 138,356 152"
          />
          <path
            className="ischia-map-coast-detail"
            d="M168 208 C196 215,228 216,256 210"
          />
        </svg>

        {points.map((point, index) => {
          const position = getMapPoint(point.zone, index);

          return (
            <span
              className="map-pin"
              key={point.id}
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
            >
              {index + 1}
            </span>
          );
        })}

        {points.map((point, index) => {
          const position = getMapPoint(point.zone, index);

          return (
            <span
              className="map-label"
              key={`${point.id}-label`}
              style={{ left: `${position.labelX}%`, top: `${position.labelY}%` }}
            >
              {point.zone}
            </span>
          );
        })}
      </div>
    </div>
  );
}
