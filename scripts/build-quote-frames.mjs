// Exports the artwork for the quote form's live frame preview.
//
// Source: head-on photos of seven of the shop's frames on white, each cropped to the frame's
// outer edge; one hero still for the default sample picture; and one unframed, straight-on
// picture of each kind of piece the quote form lists. They live outside git in
//   design/quote-frames/source/<name> frame.jpg
//   design/hero-options/frame-swap-wall/orange/walnut.png
//   design/quote-frames/samples/<name>.png
// The pieces were redrawn from the site's own category photos (assets/*_image.*) with an
// image model, which took each piece out of its frame and turned it to face the camera.
// Three were drawn from a description instead, to leave out a real album cover, a real
// player's name and an autograph: vinyl, jersey and sports.
//
// Output:
//   public/quote/frames/<id>.webp            the whole frame; the page draws it as a CSS border-image
//   public/quote/frames/<id>-corner.webp     a close-up of one corner, for the picker buttons
//   public/quote/sample-art-<width>.webp     the picture shown until a kind of piece is chosen
//   public/quote/samples/<name>-<width>.webp the picture shown for each kind of piece
//   src/components/quote/quote-frames.ts     the list the preview reads
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

// One sample per kind of piece. "category" is the quote form's value for it (its name in
// lower case); "inches" is how wide such a piece typically is, which sets how heavy the frame
// and mat look around it until the visitor types a size. "crop" trims the source, as
// percentages of its width and height: left, top, right, bottom.
const samplesDir = path.join(root, "design/quote-frames/samples");
const CATEGORY_WIDTHS = [480, 960];
const EDGE = [1.5, 1.5, 1.5, 1.5]; // generated pictures often carry a faint line at the very edge
const CATEGORY_SAMPLES = [
  { category: "photo", file: "photo", inches: 8 },
  { category: "poster/print", file: "poster", inches: 24 },
  { category: "fine art", file: "fine-art", inches: 18 },
  { category: "diploma/certificate", file: "diploma", inches: 16 },
  { category: "jersey", file: "jersey", inches: 24 },
  { category: "mirror", file: "mirror", inches: 20 },
  { category: "canvas", file: "canvas", inches: 18 },
  { category: "needlework/textile", file: "needlework", inches: 12 },
  { category: "shadowbox/memorabilia", file: "shadowbox", inches: 18 },
  { category: "medals/awards", file: "medals", inches: 12 },
  { category: "vinyl/album art", file: "vinyl", inches: 14 },
  { category: "baby keepsake", file: "baby", inches: 12 },
  { category: "wedding", file: "wedding", inches: 15 },
  { category: "military", file: "military", inches: 18 },
  // This one came back inside a wooden box frame; the crop keeps only the linen backing.
  { category: "sports equipment", file: "sports", inches: 16, crop: [7, 6, 5.5, 6] },
  { category: "document", file: "document", inches: 12 },
  { category: "map/blueprint", file: "map", inches: 18 },
  { category: "flag/banner", file: "flag", inches: 24 },
];
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

const categorySamples = {};
await mkdir(path.join(publicDir, "samples"), { recursive: true });
for (const sample of CATEGORY_SAMPLES) {
  const source = path.join(samplesDir, `${sample.file}.png`);
  const meta = await sharp(source).metadata();
  const [l, t, r, b] = sample.crop ?? EDGE;
  const box = {
    left: Math.round((meta.width * l) / 100),
    top: Math.round((meta.height * t) / 100),
    width: Math.round((meta.width * (100 - l - r)) / 100),
    height: Math.round((meta.height * (100 - t - b)) / 100),
  };
  let bytes = 0;
  for (const w of CATEGORY_WIDTHS) {
    const buffer = await sharp(source).extract(box).resize({ width: w, kernel: "lanczos3" }).webp({ quality: 80, effort: 6 }).toBuffer();
    await writeFile(path.join(publicDir, "samples", `${sample.file}-${w}.webp`), buffer);
    bytes += buffer.length;
  }
  totalBytes += bytes;
  categorySamples[sample.category] = {
    src: `/quote/samples/${sample.file}-${CATEGORY_WIDTHS.at(-1)}.webp`,
    srcSet: CATEGORY_WIDTHS.map((w) => `/quote/samples/${sample.file}-${w}.webp ${w}w`).join(", "),
    widthInches: sample.inches,
    heightInches: Number(((sample.inches * box.height) / box.width).toFixed(1)),
  };
  console.log(`sample ${sample.file.padEnd(11)} ${box.width}x${box.height}  ${categorySamples[sample.category].widthInches} x ${categorySamples[sample.category].heightInches} in  ${(bytes / 1024).toFixed(0)} KB`);
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

/** A sample picture the preview can frame, and the size in inches it is drawn at. */
export type QuoteSample = { src: string; srcSet: string; widthInches: number; heightInches: number };

/** The picture shown until a kind of piece is chosen: 16 x 20 in, portrait. */
export const quoteSampleArt: QuoteSample = ${JSON.stringify({
  src: `/quote/sample-art-${SAMPLE_WIDTHS.at(-1)}.webp`,
  srcSet: SAMPLE_WIDTHS.map((w) => `/quote/sample-art-${w}.webp ${w}w`).join(", "),
  widthInches: 16,
  heightInches: 20,
})};

/**
 * The picture shown for each kind of piece on the quote form, keyed by the form's value for
 * it, until the visitor adds a photo of their own. A kind that is not here ("other") keeps
 * the default above.
 */
export const quoteCategorySamples: Partial<Record<string, QuoteSample>> = {
${Object.entries(categorySamples).map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join("\n")}
};
`;
await writeFile(manifestPath, manifest);
console.log(`total ${(totalBytes / 1024).toFixed(0)} KB, manifest written to ${path.relative(root, manifestPath)}`);
