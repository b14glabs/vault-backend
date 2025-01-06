import { Router } from "express";
import { getClaimedReward, getDailyApy, getEvents } from "../controller/vault.controller";


const router = Router()



router.get("/history", getEvents)
router.get("/daily-apy", getDailyApy)
router.get("/claimed-reward", getClaimedReward)

export default router