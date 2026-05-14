// src/components/SEO.jsx
import { Helmet } from "react-helmet-async";

const SITE_NAME = "Unilancer";
const BASE_URL = "https://unilancer.online";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-banner.png`;
const DEFAULT_DESCRIPTION =
  "Unilancer is the ultimate freelance marketplace for university students and alumni. Find gigs, post jobs, hire student developers, and build your career on campus.";

/**
 * Reusable SEO component for per-page meta tags + breadcrumb schema.
 *
 * @param {string}  title        - Page title (appended with " | Unilancer")
 * @param {string}  description  - Meta description
 * @param {string}  path         - Page path (e.g. "/gigs")
 * @param {string}  image        - OG image URL (defaults to banner)
 * @param {Array}   breadcrumbs  - Array of { name, path } for breadcrumb schema
 * @param {string}  type         - OG type (default: "website")
 * @param {boolean} noIndex      - If true, adds noindex
 */
const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  breadcrumbs = [],
  type = "website",
  noIndex = false,
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Campus Freelance Marketplace for Students & Alumni`;
  const url = `${BASE_URL}${path}`;

  // Build BreadcrumbList JSON-LD
  const breadcrumbSchema =
    breadcrumbs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: crumb.name,
            item: `${BASE_URL}${crumb.path}`,
          })),
        }
      : null;

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Breadcrumb Schema */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
