// server/src/config/redis/index.ts
import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_URL!;
const token = process.env.UPSTASH_REDIS_TOKEN!;

if (!url || !token) {
  throw new Error("UPSTASH_REDIS_URL and UPSTASH_REDIS_TOKEN must be set in .env");
}

export const redis = new Redis({
  url,
  token,
});
