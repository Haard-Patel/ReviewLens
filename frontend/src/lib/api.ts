const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";


async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
  );

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}


export function getOverview() {
  return fetchApi("/api/overview");
}


export function getReviews(
  page = 1,
  pageSize = 20,
  search?: string,
  rating?: number,
  sentiment?: string,
) {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("page_size", String(pageSize));

  if (search) {
    params.set("search", search);
  }

  if (rating !== undefined) {
    params.set("rating", String(rating));
  }

  if (sentiment) {
    params.set("sentiment", sentiment);
  }

  return fetchApi(
    `/api/reviews?${params.toString()}`,
  );
}


export function getSentiment() {
  return fetchApi("/api/sentiment");
}


export function getProducts(
  page = 1,
  pageSize = 20,
  search?: string,
) {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("page_size", String(pageSize));

  if (search) {
    params.set("search", search);
  }

  return fetchApi(
    `/api/products?${params.toString()}`,
  );
}


export function getRatings() {
  return fetchApi("/api/ratings");
}