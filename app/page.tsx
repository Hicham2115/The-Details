import { BestSellers } from "@/components/site/best-sellers";
import { Categories } from "@/components/site/categories";
import { Contact } from "@/components/site/contact";
import { Faq } from "@/components/site/faq";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import { Lookbook } from "@/components/site/lookbook";
import { Navbar } from "@/components/site/navbar";

export default function Home() {
  return (
    <>
      <div id="top" className="w-full px-8 pb-8 phone:px-4 phone:pb-6">
        <Navbar />
        <main>
          <Hero />
          <BestSellers />
          <Categories />
          <Lookbook />
          <Faq />
          <Contact />
        </main>
      </div>
      <Footer />
    </>
  );
}
