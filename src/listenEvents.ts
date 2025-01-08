import coreVaultAbi from "./abi/core-vault.json";
import { contractAddresses, jsonRpc, RPC_URL } from "./consts";
import { IEvent } from "./model/event.model";
import { createEvents } from "./services/event.service";
import { AbiCoder } from "ethers";
import Web3, { EventLog } from "web3";
import fs from "fs";
import { log } from "console";

const abiCoder = new AbiCoder();

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
      const type = event.event?.toLowerCase();
      const blockInfo = await web3.eth.getBlock(event.blockNumber);
      const doc: {
        type: string;
        txId: string;
        from?: string;
        coreAmount?: string;
        date: Date;
      } = {
        type,
        txId: event.transactionHash as string,
        date: new Date(Number(blockInfo.timestamp) * 1000),
      };
      if ("ReInvest" === event.event) {
        const { data } = event.returnValues;
        const totalAmount = abiCoder.decode(
          ["bytes", "uint256"],
          data as any
        )[1];
        doc.coreAmount = totalAmount.toString();
        eventDocs.push(doc);
      } else if (["Stake", "WithdrawDirect", "Unbond"].includes(event.event)) {
        const { coreAmount: eventCoreAmount, user } = event.returnValues as {
          coreAmount: bigint;
          sCoreAmount: bigint;
          user: string;
        };
        doc.from = user;
        doc.coreAmount = eventCoreAmount.toString();
        eventDocs.push(doc);
      } else if ("Withdraw" === event.event) {
        const { amount, user } = event.returnValues;
        // @ts-ignore
        doc.from = user;
        doc.coreAmount = amount.toString();
        eventDocs.push(doc);
      } else if ("ClaimReward" === event.event) {
        const { reward } = event.returnValues;
        doc.coreAmount = reward.toString();
        eventDocs.push(doc);
      }
    }
    try {
      await createEvents(eventDocs);
    } catch (error) {
      console.log("Insert to db eror", error);
    }
    fs.writeFileSync("src/log/fromBlock", toBlock.toString());
  } catch (error) {
    log(error);
  } finally {
    setTimeout(() => {
      listenEvents();
    }, 3000);
  }
}
