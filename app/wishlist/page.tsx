import type { Metadata } from "next";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { WishlistGrid } from "@/components/site/wishlist-grid";

export const metadata: Metadata = {
  title: "Wishlist | The Details",
  robots: { index: false },
};

export default function WishlistPage() {
  return (
    <>
      <div className="w-full px-8 pb-8 phone:px-4 phone:pb-6">
        <Navbar base="/" />
        <main>
          <h1 className="m-0 mb-10 font-display text-[clamp(56px,9vw,120px)] leading-[0.9] font-normal">
            WISHLIST
          </h1>
          <WishlistGrid />
        </main>
      </div>
      <Footer base="/" />
    </>
  );
}
