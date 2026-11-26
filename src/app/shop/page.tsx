import type { Metadata } from "next";
import { allProducts, cloudProducts, vccProducts } from "@/lib/products";
import PageHero from "@/components/PageHero";
import ProductGrid from "@/components/ProductGrid";

export const metadata: Metadata = {
  title: "Shop — Virtual Cards & Cloud Accounts",
  description: "Loaded virtual cards and ready-to-use cloud accounts. Pay with crypto, delivered in minutes.",
  alternates: { canonical: "/shop/" },
};

export default function ShopPage() {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Shop" }]}
        badge={`All ${allProducts.length} · Virtual Cards ${vccProducts.length} · Cloud Accounts ${cloudProducts.length}`}
        title="Our Cloud"
        highlight="Services"
        text="Loaded virtual cards and ready-to-use cloud accounts. Pay with crypto, delivered in minutes."
      />
      <section className="pb-20">
        <div className="container-xl">
          <ProductGrid products={allProducts} />
        </div>
      </section>
    </>
  );
}
