"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquareText, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import { useParams } from "next/navigation";

import { getProducts } from "@/lib/api";

type Product = {
  product_id: string;
  review_count: number;
  average_rating: number;
  average_helpfulness: number | null;
  positive_reviews: number;
  neutral_reviews: number;
  negative_reviews: number;
  positive_percentage: number;
  negative_percentage: number;
};

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const productId = decodeURIComponent(params.id ?? "");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    setLoading(true);
    getProducts(1, 1, productId)
      .then((response) => {
        const products = (response as { products: Product[] }).products;
        setProduct(products[0] ?? null);
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <main className="min-h-screen px-6 pb-20 pt-12">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-5 w-28 rounded bg-[var(--surface-soft)]" />
          <div className="mt-8 h-12 w-96 max-w-full rounded-lg bg-[var(--surface-soft)]" />
          <div className="mt-4 h-5 w-72 rounded bg-[var(--surface-soft)]" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-32 rounded-2xl border border-[var(--border)] bg-[var(--surface)]" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen px-6 pb-20 pt-12">
        <div className="mx-auto max-w-7xl">
          <Link href="/products" className="lens-hover-target inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </Link>
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <p className="text-sm font-medium text-red-400">Product not found</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {error ?? `No analytics were returned for ${productId}.`}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 pb-20 pt-12">
      <div className="mx-auto max-w-7xl">
        <Link href="/products" className="lens-hover-target inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]">
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>

        <section className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-400)]">Product intelligence</p>
          <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-mono text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
                {product.product_id}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
                A product-level view of customer feedback, rating performance, and sentiment.
              </p>
            </div>
            <Link
              href={`/reviews?product=${encodeURIComponent(product.product_id)}`}
              className="lens-hover-target inline-flex w-fit items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
            >
              <MessageSquareText className="h-4 w-4" />
              View reviews
            </Link>
          </div>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DetailMetric label="Reviews" value={product.review_count.toLocaleString()} icon={<MessageSquareText className="h-5 w-5 text-cyan-300" />} />
          <DetailMetric label="Average rating" value={product.average_rating.toFixed(2)} icon={<Star className="h-5 w-5 fill-current text-amber-400" />} />
          <DetailMetric label="Positive" value={`${product.positive_percentage.toFixed(1)}%`} icon={<ThumbsUp className="h-5 w-5 text-[var(--positive)]" />} />
          <DetailMetric label="Negative" value={`${product.negative_percentage.toFixed(1)}%`} icon={<ThumbsDown className="h-5 w-5 text-[var(--negative)]" />} />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Sentiment mix</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--text-primary)]">How customers responded</h2>

            <div className="mt-8 space-y-6">
              <SentimentBar label="Positive" value={product.positive_percentage} count={product.positive_reviews} tone="positive" />
              <SentimentBar label="Neutral" value={(product.neutral_reviews / product.review_count) * 100} count={product.neutral_reviews} tone="neutral" />
              <SentimentBar label="Negative" value={product.negative_percentage} count={product.negative_reviews} tone="negative" />
            </div>
          </article>

          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Engagement</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--text-primary)]">Review helpfulness</h2>

            <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-5">
              <p className="text-sm text-[var(--text-secondary)]">Average helpfulness rate</p>
              <p className="mt-3 text-3xl font-semibold text-[var(--text-primary)]">
                {product.average_helpfulness === null ? "—" : `${(product.average_helpfulness * 100).toFixed(1)}%`}
              </p>
              <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
                Based on the helpfulness information available for reviews associated with this product.
              </p>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

function DetailMetric({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[var(--text-secondary)]">{label}</p>
        {icon}
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">{value}</p>
    </article>
  );
}

function SentimentBar({ label, value, count, tone }: { label: string; value: number; count: number; tone: "positive" | "neutral" | "negative" }) {
  const toneClass = tone === "positive" ? "bg-[var(--positive)]" : tone === "negative" ? "bg-[var(--negative)]" : "bg-[var(--neutral)]";

  return (
    <div>
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-medium text-[var(--text-primary)]">{label}</span>
        <span className="text-[var(--text-secondary)]">{count.toLocaleString()} · {value.toFixed(1)}%</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface-soft)]">
        <div className={`h-full rounded-full ${toneClass}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}
