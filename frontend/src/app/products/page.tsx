"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  PackageSearch,
  Search,
  Star,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

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

type ProductsResponse = {
  page: number;
  page_size: number;
  total_products: number;
  products: Product[];
};

type SortOption =
  | "reviews"
  | "highest"
  | "lowest"
  | "positive"
  | "negative";

const PAGE_SIZE = 20;

export default function ProductsPage() {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("reviews");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    getProducts(page, PAGE_SIZE, query || undefined)
      .then((response) => {
        if (active) {
          setData(response as ProductsResponse);
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [page, query]);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setQuery(search.trim());
  }

  const products = useMemo(() => {
    if (!data) return [];

    return [...data.products].sort((a, b) => {
      if (sort === "highest") return b.average_rating - a.average_rating;
      if (sort === "lowest") return a.average_rating - b.average_rating;
      if (sort === "positive") return b.positive_percentage - a.positive_percentage;
      if (sort === "negative") return b.negative_percentage - a.negative_percentage;
      return b.review_count - a.review_count;
    });
  }, [data, sort]);

  const totalPages = data ? Math.max(1, Math.ceil(data.total_products / PAGE_SIZE)) : 1;

  return (
    <main className="min-h-screen px-6 pb-20 pt-12">
      <div className="mx-auto max-w-7xl">
        <section>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-400)]">
            <PackageSearch className="h-4 w-4" />
            <span>Product intelligence</span>
          </div>

          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl">
                Explore product performance.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--text-secondary)]">
                Compare review volume, ratings, helpfulness, and customer sentiment across products.
              </p>
            </div>

            <Link
              href="/#products"
              className="lens-hover-target inline-flex w-fit items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
            >
              Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Products" value={data?.total_products.toLocaleString() ?? "—"} />
          <Metric
            label="Reviews in view"
            value={data ? data.products.reduce((sum, product) => sum + product.review_count, 0).toLocaleString() : "—"}
          />
          <Metric
            label="Avg. rating"
            value={
              data && data.products.length
                ? (data.products.reduce((sum, product) => sum + product.average_rating, 0) / data.products.length).toFixed(2)
                : "—"
            }
          />
          <Metric
            label="Positive share"
            value={
              data && data.products.length
                ? `${(data.products.reduce((sum, product) => sum + product.positive_percentage, 0) / data.products.length).toFixed(1)}%`
                : "—"
            }
          />
        </section>

        <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <form onSubmit={submitSearch} className="flex w-full max-w-xl items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by product ID..."
                  className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] pl-10 pr-4 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-500)]"
                />
              </div>
              <button
                type="submit"
                className="lens-hover-target h-11 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--border-strong)]"
              >
                Search
              </button>
            </form>

            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-[var(--text-muted)]" htmlFor="product-sort">
                Sort
              </label>
              <select
                id="product-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOption)}
                className="h-11 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--brand-500)]"
              >
                <option value="reviews">Most reviewed</option>
                <option value="highest">Highest rated</option>
                <option value="lowest">Lowest rated</option>
                <option value="positive">Most positive</option>
                <option value="negative">Most negative</option>
              </select>
            </div>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
          <div className="border-b border-[var(--border)] px-5 py-5 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Product catalogue
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-[var(--text-primary)]">
              Product-level review intelligence
            </h2>
          </div>

          {loading ? (
            <div className="space-y-3 p-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-16 animate-pulse rounded-xl bg-[var(--surface-soft)]" />
              ))}
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
                <p className="text-sm font-medium text-red-400">Unable to load product analytics</p>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{error}</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm font-medium text-[var(--text-primary)]">No products found.</p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">Try a different product ID.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] text-left">
                  <thead className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
                    <tr className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                      <th className="px-5 py-4">Product</th>
                      <th className="px-5 py-4">Reviews</th>
                      <th className="px-5 py-4">Rating</th>
                      <th className="px-5 py-4">Helpfulness</th>
                      <th className="px-5 py-4">Positive</th>
                      <th className="px-5 py-4">Negative</th>
                      <th className="px-5 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {products.map((product) => (
                      <tr key={product.product_id} className="group transition hover:bg-[var(--surface-soft)]/60">
                        <td className="px-5 py-5">
                          <Link
                            href={`/products/${encodeURIComponent(product.product_id)}`}
                            className="lens-hover-target block w-fit"
                          >
                            <p className="font-mono text-sm font-medium text-[var(--text-primary)] group-hover:text-cyan-300">
                              {product.product_id}
                            </p>
                            <p className="mt-1 text-xs text-[var(--text-muted)]">View product intelligence</p>
                          </Link>
                        </td>
                        <td className="px-5 py-5 text-sm text-[var(--text-secondary)]">
                          {product.review_count.toLocaleString()}
                        </td>
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-1.5">
                            <Star className="h-4 w-4 fill-current text-amber-400" />
                            <span className="text-sm font-medium text-[var(--text-primary)]">
                              {product.average_rating.toFixed(2)}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-5 text-sm text-[var(--text-secondary)]">
                          {product.average_helpfulness === null
                            ? "—"
                            : `${(product.average_helpfulness * 100).toFixed(1)}%`}
                        </td>
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-2">
                            <ThumbsUp className="h-4 w-4 text-[var(--positive)]" />
                            <span className="text-sm font-medium text-[var(--text-primary)]">
                              {product.positive_percentage.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-5">
                          <div className="flex items-center gap-2">
                            <ThumbsDown className="h-4 w-4 text-[var(--negative)]" />
                            <span className="text-sm font-medium text-[var(--text-primary)]">
                              {product.negative_percentage.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-5 text-right">
                          <Link
                            href={`/products/${encodeURIComponent(product.product_id)}`}
                            aria-label={`View ${product.product_id}`}
                            className="lens-hover-target inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-3 text-xs font-medium text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                          >
                            View
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 border-t border-[var(--border)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-xs text-[var(--text-muted)]">
                  Page {page} of {totalPages} · {data?.total_products.toLocaleString()} products
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    className="lens-hover-target inline-flex h-9 items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-3 text-xs font-medium text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] disabled:pointer-events-none disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    className="lens-hover-target inline-flex h-9 items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-3 text-xs font-medium text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] disabled:pointer-events-none disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
      <p className="text-sm font-medium text-[var(--text-secondary)]">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">{value}</p>
    </article>
  );
}
