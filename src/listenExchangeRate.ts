import { log } from "./util";
import { contractAddresses, jsonRpc, RPC_URL } from "./consts";
import dualCoreAbi from "./abi/dual-core.json";
import { Contract } from "ethers";
import { DualCore } from "./types/dualCore";
import { createExchangeRates } from "./services/exchangeRate.service";

export async function listenExchangeRate() {
  try {
    const dualCoreContract = new Contract(
      contractAddresses.dualCore,
      dualCoreAbi,
      jsonRpc
    ) as unknown as DualCore;

    const [blockNumber, exchangeRate] = await Promise.all([
      jsonRpc.getBlockNumber(),
      dualCoreContract.realtimeExchangeRate.staticCall(),
    ]);
    await createExchangeRates({
      blockNumber: Number(blockNumber),
      date: new Date(),
      exchangeRate: Number(exchangeRate),
    });
  } catch (error) {
    log("listenExchangeRate error :" + error);
  } finally {
    setTimeout(() => {
      listenExchangeRate();
    }, 1000 * 60 * 30);
  }
}
