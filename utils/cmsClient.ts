export async function fetchFromCMS(endpoint: string) {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_BASE_URL;

  const res = await fetch(`${baseUrl}${endpoint}`, {
    next: { revalidate: 60 }, //Optional Next.js caching
  });

  if (!res.ok) {
    throw new Error("Failed to fetch CMS content");
  }

  return res.json();
}
