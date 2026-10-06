"use client";

import { useEffect, useState } from "react";

import { getOverview } from "@/lib/api";


type OverviewData = {
  total_reviews: number;
  average_rating: number;
  rating_distribution: Record<string, number>;
  sentiment_distribution: Record<string, number>;
};


export default function Home() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadOverview() {
      try {
        const result = await getOverview();

        setData(result as OverviewData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load overview data.",
        );
      }
    }

    loadOverview();
  }, []);

  if (error) {
    return (
      <main className="min-h-screen p-10">
        <h1 className="text-2xl font-bold">
          ReviewLens
        </h1>

        <p className="mt-4 text-red-500">
          {error}
        </p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen p-10">
        <h1 className="text-2xl font-bold">
          ReviewLens
        </h1>

        <p className="mt-4">
          Loading analytics...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-10">
      <h1 className="text-3xl font-bold">
        ReviewLens
      </h1>

      <p className="mt-2 text-gray-500">
        Customer Review Intelligence Platform
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border p-6">
          <p className="text-sm text-gray-500">
            Total Reviews
          </p>

          <p className="mt-2 text-3xl font-bold">
            {data.total_reviews.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <p className="text-sm text-gray-500">
            Average Rating
          </p>

          <p className="mt-2 text-3xl font-bold">
            {data.average_rating}
          </p>
        </div>
      </div>
    </main>
  );
}