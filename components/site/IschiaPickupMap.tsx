import type { PublicPickupPoint } from "@/lib/types";

// Coordinate geografiche approssimative dei comuni in percentuale
// rispetto al viewBox originale (267 x 236)
// Usate per posizionare i marker sopra la sagoma reale
type MapPoint = {
  zone: string;
  // cx, cy in coordinate del viewBox 267x236
  cx: number;
  cy: number;
  // dove mettere l'etichetta rispetto al marker
  labelPlacement: "top" | "bottom" | "left" | "right";
};

const ZONE_POSITIONS: MapPoint[] = [
  { zone: "Ischia Porto",  cx: 220, cy: 68,  labelPlacement: "top"    },
  { zone: "Casamicciola",  cx: 168, cy: 60,  labelPlacement: "top"    },
  { zone: "Lacco Ameno",   cx: 115, cy: 55,  labelPlacement: "top"    },
  { zone: "Forio",         cx: 42,  cy: 140, labelPlacement: "left"   },
  { zone: "Sant'Angelo",   cx: 140, cy: 185, labelPlacement: "bottom" },
  { zone: "Barano",        cx: 195, cy: 175, labelPlacement: "bottom" },
];

function getLabelOffset(placement: MapPoint["labelPlacement"]) {
  switch (placement) {
    case "top":    return { tx: 0,   ty: -28 };
    case "bottom": return { tx: 0,   ty: 28  };
    case "left":   return { tx: -50, ty: 0   };
    case "right":  return { tx: 50,  ty: 0   };
  }
}

function labelWidth(label: string) {
  return Math.max(64, label.length * 7 + 20);
}

export function IschiaPickupMap({ points }: { points: PublicPickupPoint[] }) {
  return (
    <div className="pickup-map" style={{ width: "100%", maxWidth: 560 }}>
      <svg
        viewBox="0 0 267 270"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", display: "block", overflow: "visible" }}
        role="img"
        aria-label="Mappa di Ischia con i punti di ritiro veicoli"
      >
        {/* ------------------------------------------------------------------ */}
        {/* SAGOMA ISCHIA — path originali dal file SVG, transform identico     */}
        {/* transform="translate(0,236) scale(0.1,-0.1)" inverte l'asse Y       */}
        {/* e scala le coordinate originali (x10) nel viewBox 267x236           */}
        {/* ------------------------------------------------------------------ */}
        <g transform="translate(0,236) scale(0.1,-0.1)">

          {/* Fill verde acqua */}
          <path
            fill="#e6f7f5"
            stroke="none"
            d="M1155 1834 c53 -41 94 -53 196 -59 64 -4 129 -2 169 5 156 28 211 23
310 -26 54 -27 61 -36 114 -139 14 -27 37 -63 51 -78 30 -34 99 -66 141 -67
17 0 51 -7 75 -15 100 -36 138 -97 119 -195 -12 -64 -13 -172 -2 -186 19 -21
44 -109 44 -154 0 -50 -23 -95 -52 -104 -8 -2 -47 -10 -86 -16 -83 -13 -105
-30 -168 -129 -47 -72 -86 -107 -158 -140 -40 -18 -66 -21 -168 -21 -109 0
-130 3 -208 30 -48 17 -109 41 -137 55 -27 13 -79 30 -115 39 -157 36 -174 38
-203 27 -16 -6 -44 -11 -63 -11 -19 0 -34 -5 -34 -11 0 -6 -6 -9 -14 -6 -13 5
-236 -46 -256 -58 -17 -10 -253 -6 -263 4 -6 6 -25 11 -41 11 l-31 -1 40 -22
c35 -19 55 -21 170 -21 131 0 181 9 355 62 65 20 222 21 290 3 65 -18 211 -72
238 -89 24 -16 101 -37 192 -54 109 -20 251 11 345 75 38 26 105 110 105 132
0 19 51 65 88 81 19 8 49 14 68 14 40 0 84 16 104 38 47 53 54 151 15 237 -23
52 -24 67 -22 188 2 120 0 136 -20 173 -26 49 -81 79 -158 88 -121 13 -162 39
-206 131 -16 33 -46 77 -67 97 -91 92 -116 100 -268 95 -65 -2 -154 -10 -197
-18 -70 -12 -84 -11 -155 6 -42 10 -86 25 -97 32 -11 7 -29 13 -40 13 -20 -1
-20 -1 0 -16z"
          />

          {/* Stroke interno chiaro (effetto doppio bordo del logo) */}
          <path
            fill="none"
            stroke="#66cdd6"
            strokeWidth="14"
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity="0.5"
            d="M1155 1834 c53 -41 94 -53 196 -59 64 -4 129 -2 169 5 156 28 211 23
310 -26 54 -27 61 -36 114 -139 14 -27 37 -63 51 -78 30 -34 99 -66 141 -67
17 0 51 -7 75 -15 100 -36 138 -97 119 -195 -12 -64 -13 -172 -2 -186 19 -21
44 -109 44 -154 0 -50 -23 -95 -52 -104 -8 -2 -47 -10 -86 -16 -83 -13 -105
-30 -168 -129 -47 -72 -86 -107 -158 -140 -40 -18 -66 -21 -168 -21 -109 0
-130 3 -208 30 -48 17 -109 41 -137 55 -27 13 -79 30 -115 39 -157 36 -174 38
-203 27 -16 -6 -44 -11 -63 -11 -19 0 -34 -5 -34 -11 0 -6 -6 -9 -14 -6 -13 5
-236 -46 -256 -58 -17 -10 -253 -6 -263 4 -6 6 -25 11 -41 11 l-31 -1 40 -22
c35 -19 55 -21 170 -21 131 0 181 9 355 62 65 20 222 21 290 3 65 -18 211 -72
238 -89 24 -16 101 -37 192 -54 109 -20 251 11 345 75 38 26 105 110 105 132
0 19 51 65 88 81 19 8 49 14 68 14 40 0 84 16 104 38 47 53 54 151 15 237 -23
52 -24 67 -22 188 2 120 0 136 -20 173 -26 49 -81 79 -158 88 -121 13 -162 39
-206 131 -16 33 -46 77 -67 97 -91 92 -116 100 -268 95 -65 -2 -154 -10 -197
-18 -70 -12 -84 -11 -155 6 -42 10 -86 25 -97 32 -11 7 -29 13 -40 13 -20 -1
-20 -1 0 -16z"
          />

          {/* Stroke esterno turchese principale */}
          <path
            fill="none"
            stroke="#0099a8"
            strokeWidth="30"
            strokeLinejoin="round"
            strokeLinecap="round"
            d="M1155 1834 c53 -41 94 -53 196 -59 64 -4 129 -2 169 5 156 28 211 23
310 -26 54 -27 61 -36 114 -139 14 -27 37 -63 51 -78 30 -34 99 -66 141 -67
17 0 51 -7 75 -15 100 -36 138 -97 119 -195 -12 -64 -13 -172 -2 -186 19 -21
44 -109 44 -154 0 -50 -23 -95 -52 -104 -8 -2 -47 -10 -86 -16 -83 -13 -105
-30 -168 -129 -47 -72 -86 -107 -158 -140 -40 -18 -66 -21 -168 -21 -109 0
-130 3 -208 30 -48 17 -109 41 -137 55 -27 13 -79 30 -115 39 -157 36 -174 38
-203 27 -16 -6 -44 -11 -63 -11 -19 0 -34 -5 -34 -11 0 -6 -6 -9 -14 -6 -13 5
-236 -46 -256 -58 -17 -10 -253 -6 -263 4 -6 6 -25 11 -41 11 l-31 -1 40 -22
c35 -19 55 -21 170 -21 131 0 181 9 355 62 65 20 222 21 290 3 65 -18 211 -72
238 -89 24 -16 101 -37 192 -54 109 -20 251 11 345 75 38 26 105 110 105 132
0 19 51 65 88 81 19 8 49 14 68 14 40 0 84 16 104 38 47 53 54 151 15 237 -23
52 -24 67 -22 188 2 120 0 136 -20 173 -26 49 -81 79 -158 88 -121 13 -162 39
-206 131 -16 33 -46 77 -67 97 -91 92 -116 100 -268 95 -65 -2 -154 -10 -197
-18 -70 -12 -84 -11 -155 6 -42 10 -86 25 -97 32 -11 7 -29 13 -40 13 -20 -1
-20 -1 0 -16z"
          />

          {/* Dettagli costieri originali (piccole penisole) */}
          <path fill="#0099a8" d="M897 1939 c7 -7 15 -10 18 -7 3 3 -2 9 -12 12 -14 6 -15 5 -6 -5z"/>
          <path fill="#0099a8" d="M935 1920 c3 -5 15 -10 25 -10 10 0 21 -4 24 -9 7 -10 56 -21 56 -12
0 6 -90 41 -104 41 -4 0 -4 -4 -1 -10z"/>
          <path fill="#0099a8" d="M1105 1860 c3 -5 8 -10 11 -10 2 0 4 5 4 10 0 6 -5 10 -11 10 -5 0
-7 -4 -4 -10z"/>
          <path fill="#0099a8" d="M227 800 c-9 -32 -5 -72 6 -61 5 5 7 26 5 47 -3 35 -5 36 -11 14z"/>
          <path fill="#0099a8" d="M235 711 c-3 -5 -1 -12 5 -16 5 -3 10 1 10 9 0 18 -6 21 -15 7z"/>
          <path fill="#0099a8" d="M260 685 c0 -8 4 -15 10 -15 5 0 7 7 4 15 -4 8 -8 15 -10 15 -2 0 -4
-7 -4 -15z"/>
          <path fill="#0099a8" d="M290 664 c1 -21 52 -64 77 -64 22 0 14 16 -14 30 -16 8 -36 21 -45
29 -10 8 -18 10 -18 5z"/>
        </g>

        {/* ------------------------------------------------------------------ */}
        {/* ONDE — in coordinate viewBox dirette (sotto la sagoma)              */}
        {/* ------------------------------------------------------------------ */}
        <path
          fill="none"
          stroke="#0099a8"
          strokeWidth="2.2"
          strokeLinecap="round"
          d="M 10,250 C 38,243 66,255 94,248 C 122,241 150,254 178,247 C 206,240 230,252 250,246"
        />
        <path
          fill="none"
          stroke="#e8920a"
          strokeWidth="2.8"
          strokeLinecap="round"
          d="M 130,257 C 152,251 174,262 196,256 C 214,250 230,260 248,255"
        />

        {/* ------------------------------------------------------------------ */}
        {/* MARKER — renderizzati in coordinate viewBox 267x236                 */}
        {/* ------------------------------------------------------------------ */}
        {points.map((point, index) => {
          const pos = ZONE_POSITIONS.find((z) => z.zone === point.zone) ?? {
            zone: point.zone,
            cx: 60 + index * 30,
            cy: 120,
            labelPlacement: "top" as const,
          };

          const offset = getLabelOffset(pos.labelPlacement);
          const lw = labelWidth(point.zone);
          const lx = pos.cx + offset.tx;
          const ly = pos.cy + offset.ty;

          return (
            <g key={point.id}>
              {/* Etichetta */}
              <g transform={`translate(${lx},${ly})`}>
                <rect
                  x={-lw / 2}
                  y="-12"
                  width={lw}
                  height="22"
                  rx="11"
                  fill="white"
                  stroke="#0099a8"
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="5"
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="600"
                  fontFamily="sans-serif"
                  fill="#00616d"
                >
                  {point.zone}
                </text>
              </g>

              {/* Linea etichetta → marker */}
              <line
                x1={lx}
                y1={ly + (offset.ty < 0 ? 10 : offset.ty > 0 ? -10 : 0)}
                x2={pos.cx}
                y2={pos.cy - 14}
                stroke="#0099a8"
                strokeWidth="0.8"
                strokeDasharray="2,2"
                opacity="0.5"
              />

              {/* Marker cerchio + numero */}
              <g transform={`translate(${pos.cx},${pos.cy})`}>
                <circle r="14" fill="rgba(0,153,168,0.15)" stroke="#0099a8" strokeWidth="1.5" />
                <circle r="9" fill="#0099a8" />
                <text
                  x="0"
                  y="0"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="9"
                  fontWeight="700"
                  fontFamily="sans-serif"
                  fill="white"
                >
                  {index + 1}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
