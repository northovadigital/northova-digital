function normalizeUrl(value: string) {
  let normalized = value.trim();

  while (normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
}

function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL);
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return (
      "https" + "://" + normalizeUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL)
    );
  }

  if (process.env.VERCEL_URL) {
    return "https" + "://" + normalizeUrl(process.env.VERCEL_URL);
  }

  return "http" + "://localhost:3000";
}

export const siteUrl = resolveSiteUrl();
