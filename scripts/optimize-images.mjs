import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceDirectory = path.resolve("public/assets");
const outputDirectory = path.join(sourceDirectory, "optimized");

const images = [
  ["FUNDO.png", "hero-background", 1440],
  ["fundo pc.jpg.jpeg", "light-background", 1440],
  ["FOTO FAMILIA.png", "family-photo", 1000],
  ["foto1.png", "family-thumb-1", 256],
  ["foto2.png", "family-thumb-2", 256],
  ["foto3.png", "family-thumb-3", 256],
  ["foto4.png", "family-thumb-4", 256],
  ["SOCIOS.jpeg", "founders", 1280],
  ["MULHER IFA.png", "woman-ifa", 360]
];

await mkdir(outputDirectory, { recursive: true });

for (const [sourceName, outputName, width] of images) {
  const source = path.join(sourceDirectory, sourceName);
  const pipeline = sharp(source).resize({ width, withoutEnlargement: true });
  await pipeline.clone().webp({ quality: 82, effort: 6 }).toFile(path.join(outputDirectory, `${outputName}.webp`));
  await pipeline.clone().avif({ quality: 58, effort: 7 }).toFile(path.join(outputDirectory, `${outputName}.avif`));
}

const socialBackground = await sharp(path.join(sourceDirectory, "FUNDO.png"))
  .resize(1200, 630, { fit: "cover" })
  .webp({ quality: 84, effort: 6 })
  .toBuffer();
const socialLogo = await sharp(path.join(sourceDirectory, "LOGO IFA BRANCA.svg"))
  .resize({ width: 560, withoutEnlargement: false })
  .png()
  .toBuffer();
await sharp(socialBackground)
  .composite([{ input: socialLogo, gravity: "center" }])
  .webp({ quality: 86, effort: 6 })
  .toFile(path.join(sourceDirectory, "ifa-social.webp"));

await sharp(path.join(sourceDirectory, "LOGO IFA COLORIDA.png"))
  .resize(192, 192, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png({ compressionLevel: 9 })
  .toFile(path.resolve("public/favicon.png"));
