export const navLinks = [
  { label: "New", href: "#new" },
  { label: "Collections", href: "/products" },
  { label: "About us", href: "#lookbook" },
  { label: "Delivery", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export type ProductCategory = "Belts" | "Rings" | "Cases";

export type Product = {
  slug: string;
  category: ProductCategory;
  name: string;
  variant: string;
  price: number;
  /** Every product is on promo: the price before the promo. */
  oldPrice: number;
  tag?: "New" | "Sale" | "Pre-order";
  /** Belts only. Omit to offer the default lengths. */
  sizes?: string[];
  /** Label for the option picker. Defaults to "Size". */
  optionLabel?: string;
  /** First image is the main one; the second shows on hover. */
  /** Shopify variant used when ordering. */
  variantId: string;
  images: string[];
  alt: string;
};

/** Choices the customer must make before ordering (belt size, ring pack). null = nothing to pick. */
export const productOptions = (p: Product): string[] | null =>
  p.sizes ?? (p.category === "Belts" ? ["Standard size"] : null);

/** Flat delivery fee (DH) anywhere in Casablanca. */
export const DELIVERY_FEE = 30;

export const categories = [
  {
    name: "Belts & Buckles",
    href: "/products?category=Belts",
    image: "/images/category-belts-buckles.webp",
    size: "big",
    position: "tablet:object-[50%_21.7%]",
  },
  {
    name: "Rings",
    href: "/products?category=Rings",
    image: "/images/product-star-ring-set.webp",
    size: "small",
    position: "object-[50%_40%]",
  },
  {
    name: "Cases",
    href: "/products?category=Cases",
    image: "/images/product-headline-case-silver.webp",
    size: "small",
    position: "object-[50%_30%]",
  },
  {
    name: "Chains & Pendants",
    href: "/products",
    image: "/images/category-chains-pendants.webp",
    size: "wide",
    position: "",
  },
] as const;

export const hotspots = [
  {
    label: "Star Ring Set",
    short: "Star Ring Set",
    left: "37%",
    top: "65%",
    kind: "left",
  },
  {
    label: "Silver Chain Necklace",
    short: "Chain Necklace",
    left: "50%",
    top: "52.6%",
    kind: "mid",
  },
  {
    label: "Headline Case",
    short: "Headline Case",
    left: "85.8%",
    top: "40.7%",
    kind: "end",
  },
] as const;

export const faqs = [
  {
    q: "How long does delivery take?",
    a: "Orders are delivered within 1 day. Delivery costs 30 DH anywhere in Casablanca. We message you on WhatsApp as soon as your parcel ships.",
  },
  {
    q: "Can I pay cash on delivery?",
    a: "Yes. We only accept cash on delivery (COD): you pay in dirhams (DH) when your order arrives. Delivery costs 30 DH anywhere in Casablanca.",
  },
];

export const footerColumns = [
  {
    title: "Shop",
    links: [
      ["Belts & Buckles", "/products?category=Belts"],
      ["Rings", "/products?category=Rings"],
      ["Cases", "/products?category=Cases"],
      ["Chains & Pendants", "/products"],
    ],
  },
  {
    title: "Help",
    links: [
      ["Delivery", "#faq"],
      ["FAQ", "#faq"],
      ["Contact", "#contact"],
      ["About us", "#lookbook"],
    ],
  },
  {
    title: "Social",
    links: [
      ["Instagram", "#instagram"],
      ["TikTok", "#tiktok"],
      ["WhatsApp", "#whatsapp"],
    ],
  },
] as const;

export const discountPercent = (p: Pick<Product, "price" | "oldPrice">) =>
  Math.round((1 - p.price / p.oldPrice) * 100);

export const formatPrice = (n: number) => `${n} DH`;
