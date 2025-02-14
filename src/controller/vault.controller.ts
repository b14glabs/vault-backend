import { Request, Response } from "express";
import Web3 from "web3";
import {
  getClaimedRewardQuery,
  getEventsHistory,
  getStake24hChange,
  getWithdraw24hChange,
  countUserStakeEvent,
  updateEvent,
  totalStakeQuery,
} from "../services/event.service";
import {
  findExchangeRatesPerDay,
  getLatestExchangeRates,
} from "../services/exchangeRate.service";
import { getNotInvestAmount } from "../services/stat.service";
import { log } from "../util";
import cache, { getTomorrowDate } from "../util/cache";
import { CORE_VAULT_ADDRESS, jsonRpc } from "../consts";
import { ethers } from "ethers";
import coreVaultAbi from "../abi/core-vault.json";
import { IEvent } from "../model/event.model";
import { readCRTSBalance } from "../helper";

export const getLatestExchangeRate = async (req: Request, res: Response) => {
  try {
    const data = await getLatestExchangeRates();
    res.status(200).json(data);
  } catch (error) {
    log("Get events error : " + error);
    res.status(500).json({ error: "Something wrong!" });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const cacheKey = req.url;

    const cacheValue = await cache.get(cacheKey);

    if (cacheValue) {
      res.status(200).json(cacheValue);
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const type = req.query.type as string;

    const typeQuery = type
      ? {
          $eq: type,
        }
      : { $ne: "claimreward" };

    const data = await getEventsHistory({
      query: {
        type: typeQuery,
      },
      page,
      limit,
      sort: { date: -1 },
    });
    res.status(200).json(data);
    await cache.save(cacheKey, data, 10 * 1000);
  } catch (error) {
    log("Get events error : " + error);
    res.status(500).json({ error: "Something wrong!" });
  }
};

export const getEventsByUser = async (req: Request, res: Response) => {
  try {
    const cacheKey = req.url;
    const cacheValue = await cache.get(cacheKey);

    if (cacheValue) {
      res.status(200).json(cacheValue);
      return;
    }

    const address = req.params.address;
    console.log("address", address);

    if (!Web3.utils.isAddress(address)) {
      res.status(400).json("Address is invalid");
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const type = req.query.type as string;
    const query = type
      ? {
          from: Web3.utils.toChecksumAddress(address),
          type: {
            $eq: type,
          },
        }
      : {
          from: Web3.utils.toChecksumAddress(address),
        };
    const data = await getEventsHistory({
      query,
      page,
      limit,
      sort: { date: -1 },
    });
    res.status(200).json(data);
    await cache.save(cacheKey, data, 10 * 1000);
  } catch (error) {
    log("Get user history error : " + error);
    res.status(500).json({ error: "Something wrong!" });
  }
};

export const getClaimedReward = async (req: Request, res: Response) => {
  try {
    const cacheKey = req.url;

    const cacheValue = await cache.get(cacheKey);

    if (cacheValue) {
      res.status(200).json(cacheValue);
      return;
    }

    const data = await getClaimedRewardQuery();
    if (data.length) {
      await cache.save(
        cacheKey,
        { totalReward: data[0].totalReward },
        10 * 1000
      );
      res.status(200).json({ totalReward: data[0].totalReward });
      return;
    }
    res.status(200).json({ totalReward: 0 });
  } catch (error) {
    log("Get events error : " + error);
    res.status(500).json({ error: "Something wrong!" });
  }
};

export const getDailyApy = async (req: Request, res: Response) => {
  try {
    const cacheKey = req.url;
    const cacheValue = await cache.get(cacheKey);
    if (cacheValue) {
      res.status(200).json({ dailyApy: cacheValue });
      return;
    }
    const data = (await findExchangeRatesPerDay()) as {
      _id: string; // 2025-01-08
      rate: number;
    }[];
    if (data.length <= 1) {
      res.status(200).json({ dailyApy: 0 });
      return;
    }
    const dailyApy =
      data[data.length - 1].rate / data[data.length - 2].rate - 1;
    res.status(200).json({ dailyApy });

    await cache.save(cacheKey, dailyApy, 60 * 5 * 1000, getTomorrowDate());
  } catch (error) {
    log("Get getDailyApy error : " + error);
    res.status(500).json({ error: "Something wrong!" });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const cacheKey = req.url;
    const cacheValue = await cache.get(cacheKey);
    if (cacheValue) {
      res.status(200).json({ data: cacheValue });
      return;
    }
    const [notInvestAmount, stakeChange, withdrawChange] =
      await Promise.allSettled([
        getNotInvestAmount(),
        getStake24hChange(),
        getWithdraw24hChange(),
      ]);

    console.log(
      "notInvestAmount, stakeChange, withdrawChange",
      notInvestAmount,
      stakeChange,
      withdrawChange
    );
    const stake24hChange =
      stakeChange.status === "fulfilled" ? stakeChange.value : 0;
    const withdraw24hChange =
      withdrawChange.status === "fulfilled" ? withdrawChange.value : 0;

    const core24hChange = (stake24hChange - withdraw24hChange).toString();
    const data = {
      notInvestAmount:
        notInvestAmount.status === "fulfilled"
          ? notInvestAmount.value.toString()
          : "0",
      core24hChange,
    };
    res.status(200).json({ data });
    await cache.save(cacheKey, data, 30 * 1000);
  } catch (error) {
    log("Get Stats error : " + error);
    res.status(500).json({ error: "Something wrong!" });
  }
};

export const getApyChart = async (req: Request, res: Response) => {
  try {
    const cacheKey = req.url;
    const cacheValue = await cache.get(cacheKey);

    if (cacheValue) {
      res.status(200).json({ data: cacheValue });
      return;
    }
    const day = isNaN(Number(req.query.day)) ? 14 : Number(req.query.day) - 1;

    let data = (await findExchangeRatesPerDay(day)) as {
      _id: string; // 2025-01-08
      minRate: number;
    }[];
    data = data.map((item) => {
      return {
        ...item,
        date: item._id,
      };
    });
    res.status(200).json({ data });
    await cache.save(cacheKey, data, 60 * 5 * 1000, getTomorrowDate());
  } catch (error) {
    log("Get getApyChart error : " + error);
    res.status(500).json({ error: "Something wrong!" });
  }
};

export const checkUserStaked = async (req: Request, res: Response) => {
  try {
    const delegator = req.params.delegator;
    const stakeEvents = await countUserStakeEvent(
      Web3.utils.toChecksumAddress(delegator)
    );

    res.status(200).json({
      isStaked: stakeEvents > 0 ? true : false,
      stakeEvents,
    });
  } catch (error) {
    log(error);
    res.status(500).json({ error: error.message || error });
  }
};

export const saveCoretoshiTx = async (req: Request, res: Response) => {
  try {
    const { txId } = req.body;

    if (!txId) {
      res.status(400).json({ error: "txId is missing" });
      return;
    }

    const contract = new ethers.Contract(
      CORE_VAULT_ADDRESS,
      coreVaultAbi,
      jsonRpc
    );
    const transaction = await jsonRpc.getTransactionReceipt(txId);

    const crtsBalance = await readCRTSBalance(
      transaction.from,
      transaction.blockNumber
    );
    if (crtsBalance === BigInt(0)) {
      res.status(400).json({ error: "Not from coretoshi holder" });
      return;
    }
    if (transaction.to.toLowerCase() !== CORE_VAULT_ADDRESS.toLowerCase()) {
      res.status(400).json({ error: "txId is invalid. Not tx of core vault" });
      return;
    }

    let txData;
    for (const log of transaction.logs) {
      try {
        const parsedLog = contract.interface.parseLog(log);
        if (
          parsedLog &&
          ["Stake", "WithdrawDirect", "Unbond"].includes(parsedLog.name)
        ) {
          txData = parsedLog;
          break;
        }
      } catch (error) {
        continue;
      }
    }
    if (!txData) {
      res.status(400).json({ error: "txId is invalid" });
      return;
    }

    const { name } = txData;

    const blockNumber = transaction.blockNumber;
    const block = await jsonRpc.getBlock(blockNumber);

    const doc: IEvent = {
      type: name.toLowerCase(),
      txId: transaction.hash as string,
      date: new Date(Number(block.timestamp) * 1000),
      from: transaction.from,
      coreAmount: txData.args[1].toString(),
      dualCoreAmount: txData.args[2].toString(),
      isFromCoretoshiVault: true,
    };

    await updateEvent(doc);
    res.status(200).json({ status: "ok" });
  } catch (error) {
    log("Save coretoshi tx error : " + error);
    res.status(500).json({ error: "Something wrong!" });
  }
};

export const getDualCoreInfo = async (req: Request, res: Response) => {
  try {
    const cacheKey = req.url;
    const cacheValue = await cache.get(cacheKey);
    if (cacheValue) {
      res.status(200).json(cacheValue);
      return;
    }
    const { coretoshiTotalStake, normalTotalStake } = await totalStakeQuery();
    const result = {
      coretoshi: Math.max(coretoshiTotalStake, 0).toString(),
      normal: Math.max(normalTotalStake, 0).toString(),
    };
    res.status(200).json(result);
    await cache.save(cacheKey, result, 4 * 1000);
  } catch (error) {
    log("Get dualCoreInfo error : " + error);
    res.status(500).json({ error: "Something wrong!" });
  }
};
