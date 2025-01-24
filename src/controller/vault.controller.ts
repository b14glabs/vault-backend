import { Request, Response } from "express";
import Web3 from "web3";
import {
  getClaimedRewardQuery,
  getEventsHistory,
  getStake24hChange,
  getWithdraw24hChange,
} from "../services/event.service";
import {
  findExchangeRatesPerDay,
  getLatestExchangeRates,
} from "../services/exchangeRate.service";
import { getNotInvestAmount } from "../services/stat.service";
import { log } from "../util";
import cache, { getTomorrowDate } from "../util/cache";

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
