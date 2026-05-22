function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function shouldFill(x: number, y: number, seed: number) {
  const value = Math.imul(x + 17, 1103515245) ^ Math.imul(y + 31, 12345) ^ seed;
  return ((value >>> ((x + y) % 8)) & 1) === 1;
}

function isFinder(x: number, y: number, originX: number, originY: number) {
  return x >= originX && x < originX + 7 && y >= originY && y < originY + 7;
}

function finderRects(originX: number, originY: number, cell: number) {
  const x = originX * cell;
  const y = originY * cell;
  return [
    `<rect x="${x}" y="${y}" width="${7 * cell}" height="${7 * cell}" rx="${cell}" fill="#081C33"/>`,
    `<rect x="${x + cell}" y="${y + cell}" width="${5 * cell}" height="${5 * cell}" rx="${cell * 0.6}" fill="#fffdf7"/>`,
    `<rect x="${x + 2 * cell}" y="${y + 2 * cell}" width="${3 * cell}" height="${3 * cell}" rx="${cell * 0.35}" fill="#0097AB"/>`
  ].join("");
}

export function createQrSvgDataUrl(payload: string) {
  const size = 29;
  const cell = 8;
  const padding = 16;
  const canvas = size * cell + padding * 2;
  const seed = hashString(payload);
  const modules: string[] = [];

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (
        isFinder(x, y, 0, 0) ||
        isFinder(x, y, size - 7, 0) ||
        isFinder(x, y, 0, size - 7)
      ) {
        continue;
      }

      if (shouldFill(x, y, seed)) {
        modules.push(`<rect x="${padding + x * cell}" y="${padding + y * cell}" width="${cell}" height="${cell}" rx="1.5" fill="#081C33"/>`);
      }
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${canvas} ${canvas}">
    <rect width="${canvas}" height="${canvas}" rx="28" fill="#fffdf7"/>
    <rect x="8" y="8" width="${canvas - 16}" height="${canvas - 16}" rx="22" fill="#ffffff" stroke="rgba(0,151,171,.18)"/>
    <g transform="translate(${padding} ${padding})">
      ${finderRects(0, 0, cell)}
      ${finderRects(size - 7, 0, cell)}
      ${finderRects(0, size - 7, cell)}
    </g>
    ${modules.join("")}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
