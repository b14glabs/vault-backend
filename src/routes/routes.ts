import { Router } from "express";
import {
  checkUserStaked,
  getApyChart,
  getClaimedReward,
  getDailyApy,
  getEvents,
  getEventsByUser,
  getLatestExchangeRate,
  getStats,
} from "../controller/vault.controller";

const router = Router();

router.get("/history", getEvents);
router.get("/user-history/:address", getEventsByUser);
router.get("/latest-exchange-rate", getLatestExchangeRate);
router.get("/claimed-reward", getClaimedReward);

router.get("/daily-apy", getDailyApy);
router.get("/apy-chart", getApyChart);
// Used for marketplace stats. Do not delete
router.get("/stats", getStats);

router.get("/check-staked/:delegator", checkUserStaked);

export default router;
