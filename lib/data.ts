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
  images: string[];
  alt: string;
};

// "-0" is the hand-picked main photo (first image.png). Pass hasMain=false if a product has none.
const img = (slug: string, count: number, hasMain = true) =>
  Array.from(
    { length: count + (hasMain ? 1 : 0) },
    (_, i) => `/images/products/${slug}-${i + (hasMain ? 0 : 1)}.webp`,
  );

// NOTE: prices marked "TODO price" are provisional. Confirm them before launch.
const categoryOrder: ProductCategory[] = ["Belts", "Cases", "Rings"];

const allProducts: Product[] = [
  {
    name: "Love Hurts Belt",
    slug: "love-hurts-belt",
    category: "Belts",
    variant: "Burgundy / Silver buckle",
    price: 110,
    oldPrice: 150, // TODO confirm the "before" price
    tag: "New",
    images: img("love-hurts-belt", 4),
    alt: "Burgundy embossed belt with a silver heart and dagger buckle reading Love Hurts",
  },
  {
    name: "Snake Buckle Belt — Violet",
    slug: "snake-buckle-belt-violet",
    category: "Belts",
    variant: "Violet / Silver buckle",
    price: 110,
    oldPrice: 150, // TODO confirm the "before" price
    images: img("snake-buckle-belt-violet", 4),
    alt: "Violet snakeskin-print belt with a silver coiled snake buckle",
  },
  {
    name: "Headline Case — Silver",
    slug: "headline-case-silver",
    category: "Cases",
    variant: "Metal / Printed cover",
    price: 100,
    oldPrice: 140, // TODO confirm the "before" price
    images: img("headline-case-silver", 1),
    alt: "Silver metal cigarette case with a vintage newspaper headline cover",
  },
  {
    name: "Gothic Rings Set",
    slug: "gothic-rings-set",
    category: "Rings",
    variant: "Silver / Pack of 4 rings",
    price: 100,
    oldPrice: 130, // TODO confirm the "before" price
    optionLabel: "Pack",
    sizes: ["Pack 1", "Pack 2", "Pack 3"],
    images: img("gothic-rings-set", 2),
    alt: "Silver gothic rings with skulls, stars and black stones",
  },
  {
    name: "Bull Head Western Belt",
    slug: "bull-head-western-belt",
    category: "Belts",
    variant: "Brown / Antique brass buckle",
    price: 110,
    oldPrice: 150, // TODO confirm the "before" price
    images: img("bull-head-western-belt", 4),
    alt: "Brown embossed leather belt with an antique brass bull head buckle",
  },
  {
    name: "Grim Reaper Belt",
    slug: "grim-reaper-belt",
    category: "Belts",
    variant: "Red / Antique silver buckle",
    price: 110,
    oldPrice: 150, // TODO confirm the "before" price
    images: img("grim-reaper-belt", 3),
    alt: "Red embossed belt with an antique silver Grim Reaper skull buckle",
  },
  {
    name: "Leopard Plush Belt",
    slug: "leopard-plush-belt",
    category: "Belts",
    variant: "Pink / Silver double buckle",
    price: 110,
    oldPrice: 150, // TODO confirm the "before" price
    images: img("leopard-plush-belt", 3),
    alt: "Pink leopard-print plush double row belt with a silver buckle",
  },
  {
    name: "Pop Art Girl Case",
    slug: "pop-art-girl-case",
    category: "Cases",
    variant: "Metal / Printed cover",
    price: 100,
    oldPrice: 140, // TODO confirm the "before" price
    images: img("pop-art-girl-case", 1),
    alt: "Silver metal cigarette case printed with a pop art illustration of a girl with red lips",
  },
  {
    name: "Starry Night Case",
    slug: "starry-night-case",
    category: "Cases",
    variant: "Metal / Printed cover",
    price: 100,
    oldPrice: 140, // TODO confirm the "before" price
    images: img("starry-night-case", 1),
    alt: "Silver metal cigarette case printed with a swirling starry night painting",
  },
];

// Belts first, then cases, then rings (stable: keeps the order above inside each group).
export const products: Product[] = [...allProducts].sort(
  (a, b) =>
    categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category),
);

/** Choices the customer must make before ordering (belt size, ring pack). null = nothing to pick. */
export const productOptions = (p: Product): string[] | null =>
  p.sizes ?? (p.category === "Belts" ? ["Standard size"] : null);

/** Flat delivery fee (DH) anywhere in Casablanca. */
export const DELIVERY_FEE = 30;

export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);

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
