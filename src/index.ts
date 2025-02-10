import dotenv from "dotenv";
import { listenEvents } from "./listenEvents";
import mongoose from "mongoose";
import express, { Router } from "express";
import vaultRouter from "./routes/routes";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import { log } from "console";
import { listenExchangeRate } from "./listenExchangeRate";
import { ensureCacheFileExists } from "./util/cache";

const app = express();
const port = process.env.PORT || 3002;

app.use(bodyParser.json());
app.use(cors());
app.use(morgan(":method :url :status - :response-time ms"));

const router: Router = Router();
router.use("/vault", vaultRouter);
app.use("/restake", router);

dotenv.config();
ensureCacheFileExists();

async function main() {
  await mongoose.connect(process.env.MONGO_URL as string, {
    dbName: "vault"
  });
  app.listen(port, async () => {
    log(`[server]: Server is running at http://localhost:${port}`);
  });

  listenEvents();
  listenExchangeRate()
}

main();
