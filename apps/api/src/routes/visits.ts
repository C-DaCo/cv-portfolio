import { Router } from "express";
import { Redis } from "@upstash/redis";

const router = Router();

let _redis: Redis | null = null;
const getRedis = () => {
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return _redis;
};

const KEY = "cv:visits";

// POST — incrémente le compteur (une fois par session côté client)
router.post("/", async (_, res) => {
  try {
    const count = await getRedis().incr(KEY);
    return res.status(200).json({ success: true, count });
  } catch (err) {
    console.error("Visits incr error:", err);
    return res.status(500).json({ success: false });
  }
});

// GET — lecture du compteur
router.get("/", async (_, res) => {
  try {
    const count = (await getRedis().get<number>(KEY)) ?? 0;
    return res.status(200).json({ success: true, count });
  } catch (err) {
    console.error("Visits get error:", err);
    return res.status(500).json({ success: false });
  }
});

export default router;
