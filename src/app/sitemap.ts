import type { MetadataRoute } from 'next';

const SITE_URL = 'https://nagarments.com';

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  'https://n-a-garments-backend.onrender.com'
).replace(/\/+$/, '');

type SitemapProduct = {
  id: string;
  isAvailable?: boolean;
  updatedAt?: string;
};

type ProductsResponse =
  | SitemapProduct[]
  | {
      data?: SitemapProduct[];
      totalPages?: number;
    };

async function getAvailableProducts(): Promise<SitemapProduct[]> {
  const products: SitemapProduct[] = [];

  try {
    for (let page = 1; page <= 100; page++) {
      const response = await fetch(
        `${API_BASE_URL}/products?page=${page}&limit=100`,
        { next: { revalidate: 3600 } },
      );

      if (!response.ok) {
        break;
      }

      const result = (await response.json()) as ProductsResponse;

      const pageProducts = Array.isArray(result)
        ? result
        : Array.isArray(result.data)
          ? result.data
          : [];

      products.push(...pageProducts);

      const totalPages = Array.isArray(result)
        ? 1
        : result.totalPages ?? 1;

      if (page >= totalPages || pageProducts.length === 0) {
        break;
      }
    }
  } catch {
    return [];
  }

  return products.filter(
    (product) =>
      typeof product.id === 'string' &&
      product.id.length > 0 &&
      product.isAvailable !== false,
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/shop`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/privacy`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/custom-order`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  const products = await getAvailableProducts();

  const productPages: MetadataRoute.Sitemap = products.map((product) => {
    const entry: MetadataRoute.Sitemap[number] = {
      url: `${SITE_URL}/shop/${encodeURIComponent(product.id)}`,
      changeFrequency: 'weekly',
      priority: 0.7,
    };

    if (product.updatedAt) {
      const updatedAt = new Date(product.updatedAt);

      if (!Number.isNaN(updatedAt.getTime())) {
        entry.lastModified = updatedAt;
      }
    }

    return entry;
  });

  return [...pages, ...productPages];
}
