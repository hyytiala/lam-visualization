const express = require("express");
const { getTraffic } = require("../services/tmsService");

const router = express.Router();

router.get("/check", (req, res) => {
  return res.send("Backend running");
});

router.get("/", async (req, res) => {
  const { year, lam, day } = req.query;
  try {
    const result = await getTraffic(year, lam, day);
    res.json(result);
  } catch {
    res.sendStatus(404);
  }
});

module.exports = router;
