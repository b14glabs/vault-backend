import { Router } from "express";
import { getClaimedReward, getDailyApy, getEvents, getEventsByUser, getStats } from "../controller/vault.controller";


const router = Router()



router.get("/history", getEvents)
router.get("/user-history/:address", getEventsByUser)

router.get("/daily-apy", getDailyApy)
router.get("/claimed-reward", getClaimedReward)
// Used for marketplace stats. Do not delete
router.get("/stats", getStats)

export default router