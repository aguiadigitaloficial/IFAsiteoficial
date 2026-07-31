import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import seo from "../seo-config.json";

type PublicPath = keyof typeof seo.routes;

const upsertMeta = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value));
};

const organizationSchema = {
  "@type": "Organization",
  "@id": `${seo.siteUrl}/#organization`,
  name: seo.siteName,
  url: `${seo.siteUrl}/`,
  logo: `${seo.siteUrl}/assets/LOGO%20IFA%20COLORIDA%20COMPLETA.png`,
  telephone: seo.phone,
  sameAs: [seo.instagram],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: seo.phone,
    contactType: "customer service",
    availableLanguage: "Portuguese",
  },
};

const schemaFor = (path: PublicPath, title: string, description: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    organizationSchema,
    path === "/"
      ? {
          "@type": "WebSite",
          "@id": `${seo.siteUrl}/#website`,
          name: seo.siteName,
          url: `${seo.siteUrl}/`,
          description,
          publisher: { "@id": `${seo.siteUrl}/#organization` },
          inLanguage: "pt-BR",
        }
      : {
          "@type": "CollectionPage",
          "@id": `${seo.siteUrl}${path}#webpage`,
          name: title,
          url: `${seo.siteUrl}${path}`,
          description,
          about: { "@id": `${seo.siteUrl}/#organization` },
          inLanguage: "pt-BR",
        },
  ],
});

export function RouteSeo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
    const publicPath = (pathname in seo.routes ? pathname : "/") as PublicPath;
    const page = isAdmin
      ? { title: "Painel IFA", description: "Área administrativa do Instituto Futuro Atípico." }
      : seo.routes[publicPath];
    const canonical = `${seo.siteUrl}${publicPath === "/" ? "/" : publicPath}`;
    const robots = isAdmin ? "noindex, nofollow, noarchive" : "index, follow";
    const socialImage = `${seo.siteUrl}${seo.socialImage}`;

    document.title = page.title;
    document.documentElement.lang = "pt-BR";
    upsertMeta('meta[name="description"]', { name: "description", content: page.description });
    upsertMeta('meta[name="robots"]', { name: "robots", content: robots });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: page.title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: page.description });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: socialImage });
    upsertMeta('meta[property="og:image:width"]', { property: "og:image:width", content: "1200" });
    upsertMeta('meta[property="og:image:height"]', { property: "og:image:height", content: "630" });
    upsertMeta('meta[property="og:locale"]', { property: "og:locale", content: "pt_BR" });
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: seo.siteName });
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: page.title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: page.description });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: socialImage });

    let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;

    let structuredData = document.head.querySelector<HTMLScriptElement>("#ifa-structured-data");
    if (isAdmin) {
      structuredData?.remove();
    } else {
      if (!structuredData) {
        structuredData = document.createElement("script");
        structuredData.id = "ifa-structured-data";
        structuredData.type = "application/ld+json";
        document.head.appendChild(structuredData);
      }
      structuredData.textContent = JSON.stringify(schemaFor(publicPath, page.title, page.description));
    }
  }, [pathname]);

  return null;
}
