const BASE_URL = "http://127.0.0.1:8000/api";

export async function fetchEvents() {
  const response = await fetch(`${BASE_URL}/events/`);
  return response.json();
}

export async function fetchAds() {
  const response = await fetch(`${BASE_URL}/listing/`);
  return response.json();
}
