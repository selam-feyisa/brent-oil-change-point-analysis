const BASE_URL = "http://localhost:5000/api";

export async function fetchPrices(start, end) {
  const params = new URLSearchParams();
  if (start) params.set("start", start);
  if (end) params.set("end", end);
  const res = await fetch(`${BASE_URL}/prices?${params}`);
  if (!res.ok) throw new Error("Failed to fetch prices");
  return res.json();
}

export async function fetchEvents() {
  const res = await fetch(`${BASE_URL}/events`);
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
}

export async function fetchChangePoints() {
  const res = await fetch(`${BASE_URL}/changepoints`);
  if (!res.ok) throw new Error("Failed to fetch change points");
  return res.json();
}
