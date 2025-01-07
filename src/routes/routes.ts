import { Router } from "express";
import { getClaimedReward, getDailyApy, getEvents, getEventsByUser } from "../controller/vault.controller";


const router = Router()



router.get("/history", getEvents)
router.get("/user-history/:address", getEventsByUser)

router.get("/daily-apy", getDailyApy)
router.get("/claimed-reward", getClaimedReward)

export default router