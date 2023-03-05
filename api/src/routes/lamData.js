const express = require("express");
const cache = require("memory-cache");
const { getTraffic } = require("../services/tmsService");
const { getCacheKey } = require("../utils");

const router = express.Router();

const CACHE_TIME = 1000 * 60 * 15;

router.get("/check", (req, res) => {
  return res.send("Backend running");
});

router.get("/", async (req, res) => {
  const { year, lam, day } = req.query;
  const cacheKey = getCacheKey(req.query);
  const cachedValue = cache.get(cacheKey);

  if (cachedValue) return res.json(cachedValue);

  try {
    const result = await getTraffic(year, lam, day);
    cache.put(cacheKey, result, CACHE_TIME);
    res.json(result);
  } catch {
    res.sendStatus(404);
  }
});

module.exports = router;
