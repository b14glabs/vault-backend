
import coreVaultAbi from "./abi/core-vault.json"
import { contractAddresses, jsonRpc, RPC_URL } from "./consts";
import { EnumType, IEvent } from "./model/event.model";
import { createEvents } from "./services/event.service";

import Web3, { EventLog } from "web3";
import fs from "fs";
import { log } from "console";

export async function listenEvents() {
  try {
    const web3 = new Web3(RPC_URL);
    const contract = new web3.eth.Contract(
      coreVaultAbi,
      contractAddresses.coreVault
    );
    const latestBlock = await web3.eth.getBlockNumber();
    let fromBlock = 0;

    try {
      fromBlock = Number(fs.readFileSync("src/log/fromBlock", "utf-8"));
    } catch (error) {
      log(`Error reading file: ${error}`);
    }

    fromBlock = Math.min(fromBlock, Number(latestBlock));
    const toBlock = Math.min(fromBlock + 9999, Number(latestBlock));
    if (fromBlock + 9999 > toBlock) {
      fromBlock = Math.max(toBlock - 9999, 0);
    }

    log(`Get event from ${fromBlock} to ${toBlock}`);

    const allEvent = (await contract.getPastEvents("ALLEVENTS", {
      fromBlock: fromBlock,
      toBlock: toBlock,
    })) as EventLog[];

    const eventDocs: IEvent[] = [];

    for (const event of allEvent) {
      console.log(event.event)
      if (["Rebalance", "Stake", "Withdraw", "Unbond"].includes(event.event)) {
        const type = event.event.toLowerCase() as EnumType;
        const {
          coreAmount: eventCoreAmount,
          sCoreAmount,
          stakeAmounts,
          strategies,
          totalAmounts,
        } = event.returnValues as {
          coreAmount: bigint;
          sCoreAmount: bigint;
          strategies: string[];
          stakeAmounts: bigint[];
          totalAmounts: bigint[];
        };
        let coreAmount = eventCoreAmount
          ? eventCoreAmount
          : stakeAmounts.reduce((prev, cur) => cur + prev, BigInt(0));
        const doc = {
          type,
          txId: event.transactionHash as string,
          from: event.address,
          coreAmount: coreAmount.toString(),
          strategies,
          sCoreAmount: sCoreAmount ? sCoreAmount.toString() : undefined,
        };
        eventDocs.push(doc);
      }
    }

    try {
      await createEvents(eventDocs);
    } catch (error) {
      // console
    }
    fs.writeFileSync("src/log/fromBlock", (toBlock + 1).toString());
  } catch (error) {
    log(error);
  } finally {
    setTimeout(() => {
      listenEvents();
    }, 3000);
  }
}
