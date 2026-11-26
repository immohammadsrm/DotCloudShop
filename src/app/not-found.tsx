import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center pt-32">
      <div className="container-xl text-center">
        <p className="font-display text-gradient text-7xl font-black">404</p>
        <h1 className="heading mb-3 mt-4 text-3xl">Page not found</h1>
        <p className="mb-8 text-[14px] text-white/45">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="flex justify-center gap-3">
          <Link href="/" className="btn-primary"><span>Go Home</span><ArrowRight className="h-3.5 w-3.5" /></Link>
          <Link href="/shop/" className="btn-outline">Browse Store</Link>
        </div>
      </div>
    </section>
  );
}
