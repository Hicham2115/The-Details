import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/site/best-sellers";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { ProductDetail } from "@/components/site/product-detail";
import { SectionHead, SectionTitle } from "@/components/site/section-head";
import { getProduct, products } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: `${p.name} | The Details`,
    description: `${p.name}, ${p.variant}. ${p.price} DH. Cash on delivery across Morocco.`,
    openGraph: { images: [p.images[0]] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const related = [
    ...products.filter((x) => x.slug !== p.slug && x.category === p.category),
    ...products.filter((x) => x.slug !== p.slug && x.category !== p.category),
  ].slice(0, 4);

  return (
    <>
      <div className="w-full px-8 pb-8 phone:px-4 phone:pb-6">
        <Navbar base="/" />
        <main>
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            <Link href="/" className="inline-flex min-h-11 items-center hover:text-foreground"><span className="link-underline">Home</span></Link>
            <ChevronRight className="size-3.5" strokeWidth={1.5} />
            <Link href="/products" className="inline-flex min-h-11 items-center hover:text-foreground"><span className="link-underline">Products</span></Link>
            <ChevronRight className="size-3.5" strokeWidth={1.5} />
            <span aria-current="page" className="text-foreground">{p.name}</span>
          </nav>

          <ProductDetail key={p.slug} p={p} />

          <section aria-labelledby="related-title" className="mt-24 tablet:mt-16">
            <SectionHead>
              <SectionTitle id="related-title">YOU MAY ALSO LIKE</SectionTitle>
            </SectionHead>
            <div className="grid grid-cols-4 gap-6 tablet:grid-cols-2 tablet:gap-4 phone:gap-2.5">
              {related.map((r) => (
                <ProductCard key={r.slug} p={r} />
              ))}
            </div>
          </section>
        </main>
      </div>
      <Footer base="/" />
    </>
  );
}
