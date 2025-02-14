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
  saveCoretoshiTx,
  getDualCoreInfo
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
router.post("/save-coretoshi-tx", saveCoretoshiTx)
router.get("/dualCore-info", getDualCoreInfo)

export default router;
