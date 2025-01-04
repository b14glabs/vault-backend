import dotenv from "dotenv";
import { JsonRpcProvider } from "ethers";
dotenv.config();

export const { DUAL_CORE_ADDRESS, RPC_URL } = process.env;

if (!DUAL_CORE_ADDRESS) {
  throw "DUAL_CORE_ADDRESS is not set";
}

if (!RPC_URL) {
  throw "RPC_URL is not set";
}

export const contractAddresses = {
  dualCore: DUAL_CORE_ADDRESS,
};
console.log("RPC_URL", RPC_URL)
export const jsonRpc = new JsonRpcProvider(RPC_URL);
