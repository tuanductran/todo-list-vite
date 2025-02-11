import "https://deno.land/x/dotenv/load.ts";

const API_URL = Deno.env.get("VITE_API_URL") || "";
console.log(API_URL)
