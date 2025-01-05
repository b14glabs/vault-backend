import { Router } from "express";
import { getDailyApy, getEvents } from "../controller/vault.controller";


const router = Router()



router.get("/history", getEvents)
router.get("/daily-apy", getDailyApy)

export default router