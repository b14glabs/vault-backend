import { log } from "./util";
import { contractAddresses, jsonRpc, RPC_URL } from "./consts";
import { Contract, parseEther } from "ethers";
import { CoreVault } from "./types/dualCore";
import {
  createExchangeRates,
  findLastExchangeRate,
} from "./services/exchangeRate.service";
import coreVaultAbi from "./abi/core-vault.json";

export async function listenExchangeRate() {
  let delayTimeOut = 60 * 1000 * 10; // 10m
  try {
    const current = new Date();
    const hourUtc = current.getUTCHours();
    const minuteUtc = current.getUTCMinutes();
    // Prevent trigger many time 
    if (hourUtc !== 0 || minuteUtc > 30) {
      return;
    }

    const coreVaultContract = new Contract(
      contractAddresses.coreVault,
      coreVaultAbi,
      jsonRpc
    ) as unknown as CoreVault;

    const [blockNumber, exchangeRate, lastExchangeRate] = await Promise.all([
      jsonRpc.getBlockNumber(),
      coreVaultContract.exchangeCore.staticCall(parseEther("1")),
      findLastExchangeRate(),
    ]);
    
    if (exchangeRate == BigInt(lastExchangeRate.exchangeRate)) {
      return
    }
    
    const tomorrow = new Date();
    tomorrow.setUTCDate(current.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 10, 0, 0);
    delayTimeOut = tomorrow.getTime() - current.getTime()

    await createExchangeRates({
      blockNumber: Number(blockNumber),
      date: new Date(),
      exchangeRate: exchangeRate.toString(),
    });
  } catch (error) {
    log("listenExchangeRate error :" + error);
  } finally {
    setTimeout(() => {
      listenExchangeRate();
    }, delayTimeOut);
  }
}
