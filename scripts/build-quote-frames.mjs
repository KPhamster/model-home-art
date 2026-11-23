// Exports the artwork for the quote form's live frame preview.
//
// Source: head-on photos of seven of the shop's frames on white, each cropped to the frame's
// outer edge, plus one hero still for the sample picture. They live outside git in
//   design/quote-frames/source/<name> frame.jpg
//   design/hero-options/frame-swap-wall/orange/walnut.png
//
// Output:
//   public/quote/frames/<id>.webp          the whole frame; the page draws it as a CSS border-image
//   public/quote/frames/<id>-corner.webp   a close-up of one corner, for the picker buttons
//   public/quote/sample-art-<width>.webp   the picture shown until the visitor adds their own
//   src/components/quote/quote-frames.ts   the list the preview reads
//
// How a photo of one frame fits every picture size: a border-image cuts the photo into four
// corners and four sides. The corners keep their shape and the sides stretch. For that the
// page needs to know how thick the moulding is on each side of the photo ("slice"), which
// this script measures by finding where the white opening starts.
//
// Run with:  npm run quote:frames
// Uses sharp, which is installed as part of Next.js.

import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "design/quote-frames/source");
const sampleSource = path.join(root, "design/hero-options/frame-swap-wall/orange/walnut.png");
const publicDir = path.join(root, "public/quote");
const framesDir = path.join(publicDir, "frames");
const manifestPath = path.join(root, "src/components/quote/quote-frames.ts");

const FRAME_WIDTH = 1600; // exported width of a whole frame photo
const TRIM = 2; // pixels shaved off every outer edge, where a cut-out can leave a pale fringe
const CORNER_SIZE = 160; // exported size of a corner close-up
const WEBP = { quality: 82, effort: 6 };

// In loop order. "inches" is the moulding's width: an estimate from the photos, used only to
// draw the frame in proportion to the picture. "whiteFrame" marks a frame too pale to tell
// from the opening by brightness alone.
const FRAMES = [
  { id: "walnut", file: "walnut frame.jpg", label: "Walnut", inches: 1 },
  { id: "natural", file: "natural frame.jpg", label: "Natural wood", inches: 1 },
  { id: "black", file: "black frame.jpg", label: "Black", inches: 2 },
  { id: "white", file: "white frame.jpg", label: "White", inches: 2, whiteFrame: true },
  { id: "gold", file: "gold frame.jpg", label: "Gold", inches: 2 },
  { id: "antique-gold", file: "antique gold frame.jpg", label: "Antique gold", inches: 2.25 },
  { id: "silver", file: "silver frame.jpg", label: "Silver", inches: 2.25 },
];

// The painted area inside the mat of the hero still, in its 2048 px square. It is 4:5.
const SAMPLE_ART = { left: 609, top: 498, width: 830, height: 1040 };
const SAMPLE_WIDTHS = [480, 830];
// Shown behind a corner close-up's opening, so the white frame stands out on a white page.
const CORNER_BACKING = { r: 201, g: 192, b: 178 };

await rm(publicDir, { recursive: true, force: true });
await mkdir(framesDir, { recursive: true });
await mkdir(path.dirname(manifestPath), { recursive: true });

const entries = [];
let totalBytes = 0;

for (const frame of FRAMES) {
  const resized = await sharp(path.join(sourceDir, frame.file)).resize({ width: FRAME_WIDTH, kernel: "lanczos3" }).removeAlpha().toBuffer();
  const meta = await sharp(resized).metadata();
  const width = meta.width - 2 * TRIM;
  const height = meta.height - 2 * TRIM;
  const data = await sharp(resized).extract({ left: TRIM, top: TRIM, width, height }).raw().toBuffer();
  // A fresh pipeline over the trimmed pixels each time: sharp applies only one extract per pipeline.
  const trimmed = () => sharp(data, { raw: { width, height, channels: 3 } });

  // The opening is pure white. Around it the cut-out leaves a few near-white pixels, which
  // count as opening too. The white frame is nearly as bright as the opening, so there the
  // edge is the thin shadow line where the moulding meets it, and that line is kept.
  const openingFrom = frame.whiteFrame ? 240 : 200;
  const inset = frame.whiteFrame ? 0 : 1;
  const isOpening = (x, y) => {
    const i = (y * width + x) * 3;
    return Math.min(data[i], data[i + 1], data[i + 2]) >= openingFrom;
  };
  const cx = Math.round(width / 2);
  const cy = Math.round(height / 2);
  if (!isOpening(cx, cy)) throw new Error(`${frame.file}: the middle of the photo is not a white opening`);
  const rows = [0.3, 0.5, 0.7].map((f) => Math.round(height * f));
  const cols = [0.3, 0.5, 0.7].map((f) => Math.round(width * f));
  // Walk from the middle towards each edge until the opening stops; keep the thinnest
  // reading, less the inset, so no sliver of the opening is ever drawn as frame.
  const walk = (x, y, dx, dy) => {
    let steps = 0;
    while (isOpening(x + dx * (steps + 1), y + dy * (steps + 1))) steps++;
    return steps;
  };
  const slice = {
    left: Math.min(...rows.map((y) => cx - walk(cx, y, -1, 0))) - inset,
    right: Math.min(...rows.map((y) => width - 1 - cx - walk(cx, y, 1, 0))) - inset,
    top: Math.min(...cols.map((x) => cy - walk(x, cy, 0, -1))) - inset,
    bottom: Math.min(...cols.map((x) => height - 1 - cy - walk(x, cy, 0, 1))) - inset,
  };
  for (const [side, px] of Object.entries(slice)) {
    if (px < 20 || px > width / 4) throw new Error(`${frame.file}: implausible ${side} moulding of ${px} px`);
  }

  const whole = await trimmed().webp(WEBP).toBuffer();
  await writeFile(path.join(framesDir, `${frame.id}.webp`), whole);

  // Corner close-up: the top-left corner and a little of the opening beside it.
  const side = Math.round(Math.max(slice.left, slice.top) * 2.3);
  const backing = await sharp({
    create: { width: side - slice.left, height: side - slice.top, channels: 3, background: CORNER_BACKING },
  })
    .png()
    .toBuffer();
  // Two pipelines, because sharp resizes before it composites whatever order they are called in.
  const backed = await sharp(await trimmed().extract({ left: 0, top: 0, width: side, height: side }).png().toBuffer())
    .composite([{ input: backing, left: slice.left, top: slice.top }])
    .png()
    .toBuffer();
  const corner = await sharp(backed).resize({ width: CORNER_SIZE, height: CORNER_SIZE, kernel: "lanczos3" }).webp(WEBP).toBuffer();
  await writeFile(path.join(framesDir, `${frame.id}-corner.webp`), corner);

  totalBytes += whole.length + corner.length;
  const percent = (px, of) => Number(((px / of) * 100).toFixed(3));
  entries.push({
    id: frame.id,
    label: frame.label,
    image: `/quote/frames/${frame.id}.webp`,
    corner: `/quote/frames/${frame.id}-corner.webp`,
    // Moulding thickness on each side, as a percentage of the photo: top, right, bottom, left.
    slice: [percent(slice.top, height), percent(slice.right, width), percent(slice.bottom, height), percent(slice.left, width)],
    inches: frame.inches,
  });
  console.log(
    `${frame.id.padEnd(13)} ${width}x${height}  moulding t${slice.top} r${slice.right} b${slice.bottom} l${slice.left} px  ` +
      `${(whole.length / 1024).toFixed(0)} KB + corner ${(corner.length / 1024).toFixed(1)} KB`,
  );
}

for (const w of SAMPLE_WIDTHS) {
  const buffer = await sharp(sampleSource).extract(SAMPLE_ART).resize({ width: w, kernel: "lanczos3" }).webp(WEBP).toBuffer();
  await writeFile(path.join(publicDir, `sample-art-${w}.webp`), buffer);
  totalBytes += buffer.length;
  console.log(`sample-art-${w}  ${(buffer.length / 1024).toFixed(0)} KB`);
}

const manifest = `// Generated by scripts/build-quote-frames.mjs. Do not edit by hand; run "npm run quote:frames".

/**
 * The frames the quote form's preview can show. "slice" is how thick the moulding is on each
 * side of the photo (top, right, bottom, left, as percentages), which is what lets one photo
 * be drawn around a picture of any shape. "inches" is the moulding's width, an estimate used
 * only to keep the frame in proportion to the picture.
 */
export const quoteFrames = [
${entries.map((e) => `  ${JSON.stringify(e)},`).join("\n")}
] as const;

export type QuoteFrame = (typeof quoteFrames)[number];
export type QuoteFrameId = QuoteFrame["id"];

/** The picture shown until the visitor adds a photo of their own: 16 x 20 in, portrait. */
export const quoteSampleArt = ${JSON.stringify({
  src: `/quote/sample-art-${SAMPLE_WIDTHS.at(-1)}.webp`,
  srcSet: SAMPLE_WIDTHS.map((w) => `/quote/sample-art-${w}.webp ${w}w`).join(", "),
  widthInches: 16,
  heightInches: 20,
})} as const;
`;
await writeFile(manifestPath, manifest);
console.log(`total ${(totalBytes / 1024).toFixed(0)} KB, manifest written to ${path.relative(root, manifestPath)}`);
