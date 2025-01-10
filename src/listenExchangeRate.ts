import { log } from "./util";
import { contractAddresses, jsonRpc, RPC_URL } from "./consts";
import { Contract, parseEther } from "ethers";
import { CoreVault } from "./types/dualCore";
import { createExchangeRates } from "./services/exchangeRate.service";
import coreVaultAbi from "./abi/core-vault.json";

export async function listenExchangeRate() {
  let isSave = false;
  try {
    const current = new Date();
    const hourUtc = current.getUTCHours();
    if (hourUtc !== 0) {
      return;
    }
    const coreVaultContract = new Contract(
      contractAddresses.coreVault,
      coreVaultAbi,
      jsonRpc
    ) as unknown as CoreVault;

    const [blockNumber, exchangeRate] = await Promise.all([
      jsonRpc.getBlockNumber(),
      coreVaultContract.exchangeCore.staticCall(parseEther("1")),
    ]);

    await createExchangeRates({
      blockNumber: Number(blockNumber),
      date: new Date(),
      exchangeRate: exchangeRate.toString(),
    });
    isSave = true;
  } catch (error) {
    log("listenExchangeRate error :" + error);
  } finally {
    setTimeout(
      () => {
        listenExchangeRate();
      },
      isSave ? 1000 * 60 * 60 * 12 : 1000 * 60 * 7
    );
  }
}
