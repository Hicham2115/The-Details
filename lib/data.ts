export const navLinks = [
  { label: "New", href: "#new" },
  { label: "About us", href: "#about" },
  { label: "Delivery", href: "#delivery" },
  { label: "Collections", href: "#collections" },
  { label: "Contact", href: "#contact" },
];

export type Product = {
  name: string;
  variant: string;
  price: number;
  oldPrice?: number;
  tag?: "New" | "Sale" | "Pre-order";
  image: string;
  alt: string;
};

export const products: Product[] = [
  {
    name: "Love Hurts Belt",
    variant: "Burgundy / Silver buckle",
    price: 89,
    tag: "New",
    image: "/images/product-love-hurts-belt.jpg",
    alt: "Burgundy embossed belt with a heart and dagger buckle reading Love Hurts",
  },
  {
    name: "Snake Buckle Belt — Violet",
    variant: "Violet / Silver buckle",
    price: 69,
    oldPrice: 89,
    tag: "Sale",
    image: "/images/product-snake-buckle-belt-violet.jpg",
    alt: "Violet scaled belt with a silver snake buckle",
  },
  {
    name: "Headline Case — Silver",
    variant: "Metal / Printed cover",
    price: 59,
    image: "/images/product-headline-case-silver.jpg",
    alt: "Silver metal cigarette case with a printed newspaper headline cover",
  },
  {
    name: "Star Ring Set",
    variant: "Silver / Set of 4",
    price: 49,
    tag: "Pre-order",
    image: "/images/product-star-ring-set.jpg",
    alt: "Hand wearing four silver rings, including a star ring, and a chain bracelet",
  },
];

export const categories = [
  { name: "Belts & Buckles", href: "#belts", image: "/images/category-belts-buckles.jpg", size: "big", position: "tablet:object-[50%_21.7%]" },
  { name: "Rings", href: "#rings", image: "/images/product-star-ring-set.jpg", size: "small", position: "object-[50%_40%]" },
  { name: "Cases", href: "#cases", image: "/images/product-headline-case-silver.jpg", size: "small", position: "object-[50%_30%]" },
  { name: "Chains & Pendants", href: "#chains", image: "/images/category-chains-pendants.jpg", size: "wide", position: "" },
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
  { title: "Shop", links: [["Belts & Buckles", "#belts"], ["Rings", "#rings"], ["Cases", "#cases"], ["Chains & Pendants", "#chains"]] },
  { title: "Help", links: [["Delivery", "#delivery"], ["FAQ", "#faq"], ["Contact", "#contact"], ["About us", "#about"]] },
  { title: "Social", links: [["Instagram", "#instagram"], ["TikTok", "#tiktok"], ["WhatsApp", "#whatsapp"]] },
] as const;

export const formatPrice = (n: number) => `${n} DH`;
