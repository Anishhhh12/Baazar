export default async function apiFetch(url, options = {}) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}${url}`,
    {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Request failed");
  }

  return res.json();
}
