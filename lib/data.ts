export const navLinks = [
  { label: "New", href: "#new" },
  { label: "About us", href: "#lookbook" },
  { label: "Delivery", href: "#faq" },
  { label: "Collections", href: "#collections" },
  { label: "Contact", href: "#contact" },
];

export type ProductCategory = "Belts" | "Rings" | "Cases";

export type Product = {
  slug: string;
  category: ProductCategory;
  name: string;
  variant: string;
  price: number;
  oldPrice?: number;
  tag?: "New" | "Sale" | "Pre-order";
  /** First image is the main one; the second shows on hover. */
  images: string[];
  alt: string;
};

// "-0" is the hand-picked main photo (first image.png). Pass hasMain=false if a product has none.
const img = (slug: string, count: number, hasMain = true) =>
  Array.from({ length: count + (hasMain ? 1 : 0) }, (_, i) => `/images/products/${slug}-${i + (hasMain ? 0 : 1)}.webp`);

// NOTE: prices marked "TODO price" are provisional. Confirm them before launch.
const categoryOrder: ProductCategory[] = ["Belts", "Cases", "Rings"];

const allProducts: Product[] = [
  {
    name: "Love Hurts Belt",
    slug: "love-hurts-belt",
    category: "Belts",
    variant: "Burgundy / Silver buckle",
    price: 89,
    tag: "New",
    images: img("love-hurts-belt", 6),
    alt: "Burgundy embossed belt with a silver heart and dagger buckle reading Love Hurts",
  },
  {
    name: "Snake Buckle Belt — Violet",
    slug: "snake-buckle-belt-violet",
    category: "Belts",
    variant: "Violet / Silver buckle",
    price: 69,
    oldPrice: 89,
    tag: "Sale",
    images: img("snake-buckle-belt-violet", 5),
    alt: "Violet snakeskin-print belt with a silver coiled snake buckle",
  },
  {
    name: "Headline Case — Silver",
    slug: "headline-case-silver",
    category: "Cases",
    variant: "Metal / Printed cover",
    price: 59,
    images: img("headline-case-silver", 4),
    alt: "Silver metal cigarette case with a vintage newspaper headline cover",
  },
  {
    name: "Gothic Rings Set",
    slug: "gothic-rings-set",
    category: "Rings",
    variant: "Silver / Set of 12",
    price: 49, // TODO price
    images: img("gothic-rings-set", 4),
    alt: "Set of twelve silver gothic rings with skulls, stars and black stones",
  },
  {
    name: "Bull Head Western Belt",
    slug: "bull-head-western-belt",
    category: "Belts",
    variant: "Brown / Antique brass buckle",
    price: 79, // TODO price
    images: img("bull-head-western-belt", 5),
    alt: "Brown embossed leather belt with an antique brass bull head buckle",
  },
  {
    name: "Grim Reaper Belt",
    slug: "grim-reaper-belt",
    category: "Belts",
    variant: "Red / Antique silver buckle",
    price: 89, // TODO price
    images: img("grim-reaper-belt", 4),
    alt: "Red embossed belt with an antique silver Grim Reaper skull buckle",
  },
  {
    name: "Leopard Plush Belt",
    slug: "leopard-plush-belt",
    category: "Belts",
    variant: "Pink / Silver double buckle",
    price: 59, // TODO price
    images: img("leopard-plush-belt", 2),
    alt: "Pink leopard-print plush double row belt with a silver buckle",
  },
  {
    name: "Pop Art Girl Case",
    slug: "pop-art-girl-case",
    category: "Cases",
    variant: "Metal / Printed cover",
    price: 59, // TODO price
    images: img("pop-art-girl-case", 4),
    alt: "Silver metal cigarette case printed with a pop art illustration of a girl with red lips",
  },
  {
    name: "Starry Night Case",
    slug: "starry-night-case",
    category: "Cases",
    variant: "Metal / Printed cover",
    price: 59, // TODO price
    images: img("starry-night-case", 4),
    alt: "Silver metal cigarette case printed with a swirling starry night painting",
  },
];

// Belts first, then cases, then rings (stable: keeps the order above inside each group).
export const products: Product[] = [...allProducts].sort(
  (a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category),
);

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const categories = [
  { name: "Belts & Buckles", href: "/products?category=Belts", image: "/images/category-belts-buckles.jpg", size: "big", position: "tablet:object-[50%_21.7%]" },
  { name: "Rings", href: "/products?category=Rings", image: "/images/product-star-ring-set.jpg", size: "small", position: "object-[50%_40%]" },
  { name: "Cases", href: "/products?category=Cases", image: "/images/product-headline-case-silver.jpg", size: "small", position: "object-[50%_30%]" },
  { name: "Chains & Pendants", href: "/products", image: "/images/category-chains-pendants.jpg", size: "wide", position: "" },
] as const;

export const hotspots = [
  { label: "Star Ring Set", short: "Star Ring Set", left: "37%", top: "57%", kind: "left" },
  { label: "Silver Chain Necklace", short: "Chain Necklace", left: "50%", top: "52.6%", kind: "mid" },
  { label: "Headline Case", short: "Headline Case", left: "85.8%", top: "40.7%", kind: "end" },
] as const;

export const faqs = [
  { q: "How long does delivery take?", a: "Orders are delivered across Morocco within 1 day. Delivery is free in Hay Hassani, Maarif and Médina. Anywhere else costs 30 DH. We message you on WhatsApp as soon as your parcel ships." },
  { q: "Can I pay cash on delivery?", a: "Yes. We only accept cash on delivery (COD): you pay in dirhams (DH) when your order arrives. Delivery is free in Hay Hassani, Maarif and Médina, and 30 DH elsewhere." },
];

export const footerColumns = [
  { title: "Shop", links: [["Belts & Buckles", "/products?category=Belts"], ["Rings", "/products?category=Rings"], ["Cases", "/products?category=Cases"], ["Chains & Pendants", "/products"]] },
  { title: "Help", links: [["Delivery", "#faq"], ["FAQ", "#faq"], ["Contact", "#contact"], ["About us", "#lookbook"]] },
  { title: "Social", links: [["Instagram", "#instagram"], ["TikTok", "#tiktok"], ["WhatsApp", "#whatsapp"]] },
] as const;

export const formatPrice = (n: number) => `${n} DH`;
