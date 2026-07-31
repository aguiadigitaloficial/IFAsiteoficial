import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const seo = JSON.parse(await readFile(path.join(root, "src/seo-config.json"), "utf8"));
const source = await readFile(path.join(root, "dist/index.html"), "utf8");

const schemaFor = (route, page) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${seo.siteUrl}/#organization`,
      name: seo.siteName,
      url: `${seo.siteUrl}/`,
      logo: `${seo.siteUrl}/assets/LOGO%20IFA%20COLORIDA%20COMPLETA.png`,
      telephone: seo.phone,
      sameAs: [seo.instagram]
    },
    route === "/"
      ? {
          "@type": "WebSite",
          "@id": `${seo.siteUrl}/#website`,
          name: seo.siteName,
          url: `${seo.siteUrl}/`,
          description: page.description,
          publisher: { "@id": `${seo.siteUrl}/#organization` },
          inLanguage: "pt-BR"
        }
      : {
          "@type": "CollectionPage",
          "@id": `${seo.siteUrl}${route}#webpage`,
          name: page.title,
          url: `${seo.siteUrl}${route}`,
          description: page.description,
          about: { "@id": `${seo.siteUrl}/#organization` },
          inLanguage: "pt-BR"
        }
  ]
});

const escapeAttribute = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");

const render = (route, page) => {
  const canonical = `${seo.siteUrl}${route === "/" ? "/" : route}`;
  const socialImage = `${seo.siteUrl}${seo.socialImage}`;
  const html = source
    .replace(/<title>.*?<\/title>/s, `<title>${page.title}</title>`)
    .replace(/<meta name="description" content=".*?"\s*\/?>/s, `<meta name="description" content="${escapeAttribute(page.description)}" />`)
    .replace(/<link rel="canonical" href=".*?"\s*\/?>/s, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta property="og:title" content=".*?"\s*\/?>/s, `<meta property="og:title" content="${escapeAttribute(page.title)}" />`)
    .replace(/<meta property="og:description" content=".*?"\s*\/?>/s, `<meta property="og:description" content="${escapeAttribute(page.description)}" />`)
    .replace(/<meta property="og:url" content=".*?"\s*\/?>/s, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<meta property="og:image" content=".*?"\s*\/?>/s, `<meta property="og:image" content="${socialImage}" />`)
    .replace(/<meta name="twitter:title" content=".*?"\s*\/?>/s, `<meta name="twitter:title" content="${escapeAttribute(page.title)}" />`)
    .replace(/<meta name="twitter:description" content=".*?"\s*\/?>/s, `<meta name="twitter:description" content="${escapeAttribute(page.description)}" />`)
    .replace(/<script id="ifa-structured-data" type="application\/ld\+json">.*?<\/script>/s, `<script id="ifa-structured-data" type="application/ld+json">${JSON.stringify(schemaFor(route, page))}</script>`);
  const routeHtml = html
    .replace(/(<h1 id="static-seo-heading"[^>]*>).*?(<\/h1>)/s, `$1\n        ${page.heading}\n      $2`)
    .replace(/(<p id="static-seo-description"[^>]*>).*?(<\/p>)/s, `$1\n        ${page.description}\n      $2`);
  return route === "/" ? routeHtml : routeHtml.replace(/\s*<link rel="preload" as="image" href="\/assets\/optimized\/hero-background\.avif"[^>]*>/, "");
};

for (const [route, page] of Object.entries(seo.routes)) {
  const html = render(route, page);
  if (route === "/") {
    await writeFile(path.join(root, "dist/index.html"), html);
  } else {
    const directory = path.join(root, "dist", route.slice(1));
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, "index.html"), html);
  }
}
