import { Router } from "express";
import { getEvents } from "../controller/vault.controller";


const router = Router()



router.get("/history", getEvents)

export default router