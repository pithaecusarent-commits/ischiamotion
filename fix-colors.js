const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'offerta-ischiamotion.html');
let html = fs.readFileSync(filePath, 'utf8');
const originalLength = html.length;

// Track all replacements
const replacements = [
  // Shadow variables: old dark green rgba → navy rgba
  [/rgba\(26,74,58,/g, 'rgba(13,43,78,'],
  [/rgba\(26, 74, 58,/g, 'rgba(13, 43, 78,'],

  // Hardcoded third stop in hero/conclusion gradient
  [/#1e5a7a/gi, '#0A5080'],

  // Old green tint overlays in hero background
  [/rgba\(93,171,142,/g, 'rgba(0,151,171,'],
  [/rgba\(93, 171, 142,/g, 'rgba(0, 151, 171,'],

  // Old blue overlay in hero background
  [/rgba\(30,90,122,/g, 'rgba(13,43,78,'],
  [/rgba\(30, 90, 122,/g, 'rgba(13, 43, 78,'],

  // Roadmap card box-shadow old green
  [/rgba\(45,110,88,/g, 'rgba(13,43,78,'],
  [/rgba\(45, 110, 88,/g, 'rgba(13, 43, 78,'],

  // .badge-blue text color old blue
  [/#1e5070/gi, '#0D2B4E'],

  // Any remaining old green colors
  [/#1a4a3a/gi, '#0D2B4E'],
  [/#075D40/gi, '#0097AB'],
  [/#18A36F/gi, '#0097AB'],
  [/#7CE3BB/gi, '#2DBFCC'],
  [/#0A7899/gi, '#0097AB'],
];

let count = 0;
for (const [pattern, replacement] of replacements) {
  const before = html;
  html = html.replace(pattern, replacement);
  const changed = (before.match(pattern) || []).length;
  if (changed > 0) {
    console.log(`  ${changed}x  ${pattern} → ${replacement}`);
    count += changed;
  }
}

fs.writeFileSync(filePath, html, 'utf8');
console.log(`\nDone. ${count} replacements made. File size: ${(html.length / 1024).toFixed(0)} KB (was ${(originalLength / 1024).toFixed(0)} KB)`);
