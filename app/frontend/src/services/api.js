const BASE_URL = "http://127.0.0.1:8000/api";

async function requestJson(path) {
  const response = await fetch(`${BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export async function fetchEvents() {
  return requestJson("/events/");
}

export async function fetchEventById(id) {
  return requestJson(`/events/${id}/`);
}

export async function fetchAds() {
  return requestJson("/listing/");
}

export async function fetchListingById(id) {
  return requestJson(`/listing/${id}/`);
}
