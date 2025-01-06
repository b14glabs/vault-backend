import dotenv from "dotenv";
import { JsonRpcProvider } from "ethers";
dotenv.config();

export const { CORE_VAULT_ADDRESS, RPC_URL } = process.env;

if (!CORE_VAULT_ADDRESS) {
  throw "CORE_VAULT_ADDRESS is not set";
}

if (!RPC_URL) {
  throw "RPC_URL is not set";
}

export const contractAddresses = {
  coreVault: CORE_VAULT_ADDRESS,
};
console.log("RPC_URL", RPC_URL);
export const jsonRpc = new JsonRpcProvider(RPC_URL);
