const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'app', 'globals.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Replace the :root variables block completely
const oldRoot = `:root {
  --green: #18a36f;
  --green-dark: #075d40;
  --green-deep: #053c32;
  --green-soft: #e5faf1;
  --mint: #7ce3bb;
  --sea: #0a7899;
  --sea-soft: #dff8ff;
  --sun: #ffbf65;
  --coral: #ff7f6e;
  --sand: #f6efe2;
  --sand-2: #fff8eb;
  --sand-dark: #e9dcc5;
  --ink: #151512;
  --ink-mid: #55554b;
  --ink-light: #8d8b7f;
  --white: #fffdf7;
  --glass: rgba(255,253,247,.72);
  --shadow-soft: 0 20px 60px rgba(7, 93, 64, .14);
  --shadow-strong: 0 28px 80px rgba(4, 25, 20, .22);
  --radius: 28px;
}`;

const newRoot = `:root {
  --green: #0097AB;
  --green-dark: #0D2B4E;
  --green-deep: #081C33;
  --green-soft: #E0F4F8;
  --mint: #2DBFCC;
  --sea: #0097AB;
  --sea-soft: #E0F4F8;
  --sun: #E8951A;
  --coral: #ff7f6e;
  --sand: #f6efe2;
  --sand-2: #fff8eb;
  --sand-dark: #e9dcc5;
  --ink: #151512;
  --ink-mid: #55554b;
  --ink-light: #8d8b7f;
  --white: #fffdf7;
  --glass: rgba(255,253,247,.72);
  --shadow-soft: 0 20px 60px rgba(13, 43, 78, .14);
  --shadow-strong: 0 28px 80px rgba(4, 18, 40, .22);
  --radius: 28px;
}`;

css = css.replace(oldRoot, newRoot);

// 2. Hardcoded rgba replacements (old green → navy/teal)
const rgbaReplacements = [
  // old dark green shadow → navy
  [/rgba\(7,\s*93,\s*64,/g,    'rgba(13,43,78,'],
  [/rgba\(4,\s*25,\s*20,/g,    'rgba(4,18,40,'],
  [/rgba\(8,\s*40,\s*30,/g,    'rgba(8,20,40,'],
  // old mid-green → teal
  [/rgba\(24,\s*163,\s*111,/g, 'rgba(0,151,171,'],
  // old mint green → teal light
  [/rgba\(124,\s*227,\s*187,/g,'rgba(0,151,171,'],
  // old sea blue → teal
  [/rgba\(10,\s*120,\s*153,/g, 'rgba(0,151,171,'],
  // sun/orange stays orange but update to brand orange
  [/rgba\(255,\s*191,\s*101,/g,'rgba(232,149,26,'],
];

for (const [pattern, replacement] of rgbaReplacements) {
  const matches = (css.match(pattern) || []).length;
  if (matches > 0) {
    console.log(`  ${matches}x  ${pattern} → ${replacement}`);
    css = css.replace(pattern, replacement);
  }
}

// 3. Hardcoded hex colors
const hexReplacements = [
  // Dark backgrounds (deep green → deep navy)
  ['#11221d', '#0A1A2E'],
  ['#061b16', '#050E20'],
  ['#0b5a48', '#0D4A6E'],
  ['#082f28', '#08243A'],
  ['#12120f', '#0A0F1E'],
  ['#071b16', '#050F20'],
  ['#090f0c', '#07091A'],   // footer bg
  // Hero right panel bg
  ['#e8fff5', '#E0F8FA'],
  ['#effaf9', '#E8F8FB'],
  ['#fff3dc', '#FFF3DC'],
  // Vehicle card gradient
  ['#e8f8e7', '#E0F8FA'],
  ['#dff5ff', '#DCF4F8'],
  // Sun colors → brand orange
  ['#ffd17b', '#F5A832'],
  ['#ffb95a', '#E8951A'],
  // Availability badge green
  ['#0d6b49', '#0D4E7A'],
  // Hero watermark (inline, specific)
  ['rgba(7,93,64,.045)', 'rgba(13,43,78,.045)'],
  // Green-soft bg references
  ['rgba(229,250,241,.68)', 'rgba(224,244,248,.68)'],
  ['rgba(229,250,241,.78)', 'rgba(224,244,248,.78)'],
];

for (const [from, to] of hexReplacements) {
  if (css.includes(from)) {
    console.log(`  hex: ${from} → ${to}`);
    css = css.split(from).join(to);
  }
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('\nglobals.css updated.');
