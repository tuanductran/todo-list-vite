export async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Failed: ${response.statusText}`);
  return response.json();
}
