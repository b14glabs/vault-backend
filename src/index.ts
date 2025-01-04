import dotenv from "dotenv";
import { listenEvents } from "./listenEvents";
import mongoose from "mongoose";

dotenv.config();

async function main() {
  await mongoose.connect(process.env.MONGO_URL as string);
  listenEvents();
}

main();
