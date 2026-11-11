import type { ImageLoaderProps } from "next/image";

// Never uses /_next/image. Shopify's CDN resizes via ?width=; everything else is served as-is.
export default function imageLoader({ src, width }: ImageLoaderProps): string {
  try {
    const url = new URL(src);
    if (url.hostname === "cdn.shopify.com") {
      url.searchParams.set("width", String(width));
      return url.toString();
    }
  } catch {
    // Not an absolute URL (local file): return unchanged.
  }
  return src;
}
