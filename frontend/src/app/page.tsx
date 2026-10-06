"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  MessageSquareText,
  Star,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getOverview, getProducts } from "@/lib/api";

type OverviewData = {
  total_reviews: number;
  average_rating: number;
  rating_distribution: Record<string, number>;
  sentiment_distribution: Record<string, number>;
  reviews_by_year: Record<string, number>;
  engagement: {
    average_review_length_words: number;
    average_helpfulness_rate: number;
    reviews_with_helpfulness: number;
    total_helpful_votes: number;
    total_votes: number;
  };
};

export default function Home() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      getOverview(),
      getProducts(1, 10),
    ])
      .then(([overviewData, productsData]) => {
        setData(overviewData as OverviewData);
  
        setProducts(
          (productsData as {
            products: Product[];
          }).products,
        );
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-64 rounded-lg bg-[var(--surface-soft)]" />
  
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-32 rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
                />
              ))}
            </div>
  
            <div className="h-80 rounded-2xl border border-[var(--border)] bg-[var(--surface)]" />
          </div>
        </div>
      </main>
    );
  }
  if (error) {
    return (
      <main className="min-h-screen px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <p className="text-sm font-medium text-red-400">
              Unable to load ReviewLens analytics
            </p>

            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse">
            <div className="h-4 w-32 rounded bg-[var(--surface-soft)]" />

            <div className="mt-5 h-12 w-3/4 max-w-2xl rounded-lg bg-[var(--surface-soft)]" />

            <div className="mt-4 h-5 w-full max-w-xl rounded bg-[var(--surface-soft)]" />

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-40 rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  const positiveReviews =
    data.sentiment_distribution.Positive ?? 0;

  const negativeReviews =
    data.sentiment_distribution.Negative ?? 0;

  const positivePercentage =
    (positiveReviews / data.total_reviews) * 100;

  const negativePercentage =
    (negativeReviews / data.total_reviews) * 100;

    const reviewActivity = Object.entries(
      data.reviews_by_year,
    ).map(([year, reviews]) => ({
      year,
      reviews,
    }));

    const ratingDistribution = Object.entries(
      data.rating_distribution,
    ).map(([rating, reviews]) => ({
      rating: `${rating} Star`,
      reviews,
    }));
    
    const sentimentDistribution = Object.entries(
      data.sentiment_distribution,
    ).map(([sentiment, reviews]) => ({
      sentiment,
      reviews,
    }));

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

  const kpis = [
    {
      label: "Total Reviews",
      value: data.total_reviews.toLocaleString(),
      description: "Customer reviews analyzed",
      icon: MessageSquareText,
      accent: "text-[#5fe3ff]",
      iconBackground: "bg-[#5fe3ff]/10",
    },
    {
      label: "Average Rating",
      value: data.average_rating.toFixed(2),
      description: "Average customer rating",
      icon: Star,
      accent: "text-[#e4ad45]",
      iconBackground: "bg-[#e4ad45]/10",
    },
    {
      label: "Positive Reviews",
      value: `${positivePercentage.toFixed(1)}%`,
      description: `${positiveReviews.toLocaleString()} positive reviews`,
      icon: ThumbsUp,
      accent: "text-[var(--positive)]",
      iconBackground: "bg-[var(--positive)]/10",
    },
    {
      label: "Negative Reviews",
      value: `${negativePercentage.toFixed(1)}%`,
      description: `${negativeReviews.toLocaleString()} negative reviews`,
      icon: ThumbsDown,
      accent: "text-[var(--negative)]",
      iconBackground: "bg-[var(--negative)]/10",
    },
  ];

  return (
    <main className="min-h-screen px-6 pb-20 pt-12">
      <div className="mx-auto max-w-7xl">
        {/* Page introduction */}
        <section>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-400)]">
            <Activity className="h-4 w-4" />
            <span>Customer review analytics</span>
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            Understand what customers are saying.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)]">
            ReviewLens transforms customer reviews into measurable
            insights across ratings, sentiment, products, and
            engagement.
          </p>
        </section>

        {/* KPI cards */}
        <section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;

            return (
              <article
                key={kpi.label}
                className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-secondary)]">
                      {kpi.label}
                    </p>

                    <p className="mt-4 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
                      {kpi.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${kpi.iconBackground}`}
                  >
                    <Icon className={`h-5 w-5 ${kpi.accent}`} />
                  </div>
                </div>

                <p className="mt-4 text-xs text-[var(--text-muted)]">
                  {kpi.description}
                </p>

                <div
                  className={`absolute inset-x-0 bottom-0 h-px opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${kpi.accent.replace(
                    "text-",
                    "bg-",
                  )}`}
                />
              </article>
            );
          })}
        </section>

        <section className="mt-6">
  <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)]">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium text-[var(--text-secondary)]">
          Review activity
        </p>

        <h2 className="mt-1 text-xl font-semibold tracking-tight text-[var(--text-primary)]">
          Customer review volume over time
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text-muted)]">
          Review activity shows how customer participation changed
          across the datasets timeline.
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <span className="h-2 w-2 rounded-full bg-[#5fe3ff]" />
        Reviews
      </div>
    </div>

    <div className="mt-8 h-[340px] w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <AreaChart
          data={reviewActivity}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient
              id="reviewActivityGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#5fe3ff"
                stopOpacity={0.28}
              />

              <stop
                offset="100%"
                stopColor="#5fe3ff"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            vertical={false}
            stroke="var(--border)"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="year"
            tick={{
              fill: "var(--text-muted)",
              fontSize: 11,
            }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            tick={{
              fill: "var(--text-muted)",
              fontSize: 11,
            }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) =>
              Number(value).toLocaleString()
            }
            width={55}
          />

          <Tooltip
            cursor={{
              stroke: "var(--border-strong)",
              strokeDasharray: "4 4",
            }}
            contentStyle={{
              background: "var(--surface-raised)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              boxShadow: "var(--shadow-md)",
              color: "var(--text-primary)",
            }}
            labelStyle={{
              color: "var(--text-secondary)",
              marginBottom: "4px",
            }}
            formatter={(value) => [
              Number(value).toLocaleString(),
              "Reviews",
            ]}
          />

          <Area
            type="monotone"
            dataKey="reviews"
            stroke="#5fe3ff"
            strokeWidth={2}
            fill="url(#reviewActivityGradient)"
            activeDot={{
              r: 5,
              fill: "#5fe3ff",
              stroke: "var(--surface)",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </article>
</section>

<section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
  <div className="mb-6">
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
      Customer feedback
    </p>

    <h2 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
      Rating Distribution
    </h2>

    <p className="mt-1 text-sm text-[var(--text-secondary)]">
      How customer reviews are distributed across the five-star rating scale.
    </p>
  </div>

  <div className="h-[320px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={ratingDistribution}
        layout="vertical"
        margin={{
          top: 4,
          right: 20,
          left: 12,
          bottom: 4,
        }}
      >
        <CartesianGrid
          stroke="var(--border)"
          strokeDasharray="3 3"
          horizontal={false}
        />

        <XAxis
          type="number"
          tick={{
            fill: "var(--text-muted)",
            fontSize: 11,
          }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          type="category"
          dataKey="rating"
          width={70}
          tick={{
            fill: "var(--text-secondary)",
            fontSize: 12,
          }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          cursor={{
            fill: "rgba(139, 124, 246, 0.06)",
          }}
          contentStyle={{
            backgroundColor: "var(--surface-raised)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            color: "var(--text-primary)",
          }}
          formatter={(value) => [
            Number(value).toLocaleString(),
            "Reviews",
          ]}
        />

        <Bar
          dataKey="reviews"
          fill="#8B7CF6"
          radius={[0, 8, 8, 0]}
          barSize={28}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</section>

<section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
  <div className="mb-6">
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
      Review sentiment
    </p>

    <h2 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
      Sentiment Breakdown
    </h2>

    <p className="mt-1 text-sm text-[var(--text-secondary)]">
      Overall sentiment detected across customer review text using VADER.
    </p>
  </div>

  <div className="grid gap-6 lg:grid-cols-[1fr_280px] lg:items-center">
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sentimentDistribution}
          margin={{
            top: 8,
            right: 20,
            left: 0,
            bottom: 8,
          }}
        >
          <CartesianGrid
            stroke="var(--border)"
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="sentiment"
            tick={{
              fill: "var(--text-secondary)",
              fontSize: 12,
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{
              fill: "var(--text-muted)",
              fontSize: 11,
            }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            cursor={{
              fill: "rgba(139, 124, 246, 0.06)",
            }}
            contentStyle={{
              backgroundColor: "var(--surface-raised)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              color: "var(--text-primary)",
            }}
            formatter={(value) => [
              Number(value).toLocaleString(),
              "Reviews",
            ]}
          />

          <Bar
            dataKey="reviews"
            fill="#32C997"
            radius={[8, 8, 0, 0]}
            barSize={52}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className="space-y-3">
      {sentimentDistribution.map((item) => {
        const percentage =
          (item.reviews / data.total_reviews) * 100;

        const isPositive =
          item.sentiment === "Positive";

        const isNegative =
          item.sentiment === "Negative";

        return (
          <div
            key={item.sentiment}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-[var(--text-primary)]">
                {item.sentiment}
              </span>

              <span
                className={
                  isPositive
                    ? "text-sm font-semibold text-[var(--positive)]"
                    : isNegative
                      ? "text-sm font-semibold text-[var(--negative)]"
                      : "text-sm font-semibold text-[var(--neutral)]"
                }
              >
                {percentage.toFixed(2)}%
              </span>
            </div>

            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {item.reviews.toLocaleString()} reviews
            </p>
          </div>
        );
      })}
    </div>
  </div>
</section>
<section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
  <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
        Product performance
      </p>

      <h2 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
        Top Products
      </h2>

      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Products generating the highest volume of customer reviews.
      </p>
    </div>

    <Link
      href="/products"
      className="text-sm font-medium text-cyan-400 transition-colors hover:text-cyan-300"
    >
      View all products →
    </Link>
  </div>

  <div className="space-y-3">
    {products.map((product, index) => (
      <div
        key={product.product_id}
        className="group flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-4 transition-all duration-200 hover:border-[var(--border-strong)] hover:bg-[var(--surface-raised)] sm:flex-row sm:items-center"
      >
        <div className="flex items-center gap-4 sm:w-[280px]">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-50)] text-xs font-semibold text-[var(--brand-300)]">
            {String(index + 1).padStart(2, "0")}
          </span>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
              {product.product_id}
            </p>

            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Product ID
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center gap-x-8 gap-y-3">
          <div>
            <p className="text-xs text-[var(--text-muted)]">
              Reviews
            </p>

            <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
              {product.review_count.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs text-[var(--text-muted)]">
              Rating
            </p>

            <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-[var(--text-primary)]">
              <Star
                size={14}
                fill="currentColor"
                className="text-amber-400"
              />

              {product.average_rating.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-xs text-[var(--text-muted)]">
              Positive
            </p>

            <p className="mt-1 text-sm font-semibold text-[var(--positive)]">
              {product.positive_percentage.toFixed(1)}%
            </p>
          </div>

          <div>
            <p className="text-xs text-[var(--text-muted)]">
              Negative
            </p>

            <p className="mt-1 text-sm font-semibold text-[var(--negative)]">
              {product.negative_percentage.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>
<section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
  <div className="mb-6">
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
      Customer engagement
    </p>

    <h2 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
      Engagement Metrics
    </h2>

    <p className="mt-1 text-sm text-[var(--text-secondary)]">
      A closer look at review depth and customer helpfulness activity.
    </p>
  </div>

  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
      <p className="text-xs font-medium text-[var(--text-muted)]">
        Avg. review length
      </p>

      <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
        {data.engagement.average_review_length_words.toFixed(1)}
      </p>

      <p className="mt-1 text-xs text-[var(--text-secondary)]">
        words per review
      </p>
    </div>

    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
      <p className="text-xs font-medium text-[var(--text-muted)]">
        Avg. helpfulness
      </p>

      <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--positive)]">
        {(data.engagement.average_helpfulness_rate * 100).toFixed(1)}%
      </p>

      <p className="mt-1 text-xs text-[var(--text-secondary)]">
        among reviews with votes
      </p>
    </div>

    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
      <p className="text-xs font-medium text-[var(--text-muted)]">
        Reviews with votes
      </p>

      <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
        {data.engagement.reviews_with_helpfulness.toLocaleString()}
      </p>

      <p className="mt-1 text-xs text-[var(--text-secondary)]">
        reviews receiving feedback
      </p>
    </div>

    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
      <p className="text-xs font-medium text-[var(--text-muted)]">
        Total votes
      </p>

      <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
        {data.engagement.total_votes.toLocaleString()}
      </p>

      <p className="mt-1 text-xs text-[var(--text-secondary)]">
        helpfulness votes recorded
      </p>
    </div>

  </div>
</section>
<section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)] sm:p-6">
  <div className="mb-6">
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
      What the data says
    </p>

    <h2 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
      Key Insights
    </h2>

    <p className="mt-1 text-sm text-[var(--text-secondary)]">
      A concise view of the strongest patterns identified across the review dataset.
    </p>
  </div>

  <div className="grid gap-4 lg:grid-cols-2">

    <article className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--positive-soft)] text-[var(--positive)]">
          <Star
            size={18}
            fill="currentColor"
            strokeWidth={1.7}
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            Five-star reviews dominate
          </h3>

          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            Five-star reviews account for{" "}
            <span className="font-semibold text-[var(--text-primary)]">
              {(
                (data.rating_distribution["5"] /
                  data.total_reviews) *
                100
              ).toFixed(1)}%
            </span>{" "}
            of all reviews, making the highest rating the dominant part of the dataset.
          </p>
        </div>
      </div>
    </article>

    <article className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-50)] text-[var(--brand-300)]">
          <BarChart3
            size={18}
            strokeWidth={1.7}
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            Review activity accelerated over time
          </h3>

          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            Review volume increased substantially throughout the datasets active years,
            with activity reaching its highest level in{" "}
            <span className="font-semibold text-[var(--text-primary)]">
              2012
            </span>
            .
          </p>
        </div>
      </div>
    </article>

    <article className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--positive-soft)] text-[var(--positive)]">
          <ThumbsUp
            size={18}
            strokeWidth={1.7}
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            Customer sentiment is strongly positive
          </h3>

          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            VADER classified{" "}
            <span className="font-semibold text-[var(--positive)]">
              {(
                (data.sentiment_distribution["Positive"] /
                  data.total_reviews) *
                100
              ).toFixed(1)}%
            </span>{" "}
            of reviews as positive, while negative sentiment represents a much smaller
            share of the dataset.
          </p>
        </div>
      </div>
    </article>

    <article className="rounded-xl border border-[var(--border)] bg-[var(--surface-soft)] p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--negative-soft)] text-[var(--negative)]">
          <ThumbsDown
            size={18}
            strokeWidth={1.7}
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            Lower ratings show more sentiment disagreement
          </h3>

          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            Text sentiment does not always align with star ratings. Lower-rated
            reviews show considerably more disagreement, highlighting the limitations
            of relying on either signal alone.
          </p>
        </div>
      </div>
    </article>

  </div>
</section>

      </div>
    </main>
  );
}