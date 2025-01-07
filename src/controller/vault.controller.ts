import { Request, Response } from "express";
import { log } from "../util";
import {
  getEventsHistory,
  getClaimedRewardQuery,
} from "../services/event.service";
import { findDailyApy } from "../services/exchangeRate.service";
import { cache } from "..";
import Web3 from "web3";

export const getEvents = async (req: Request, res: Response) => {
  try {
    const cacheKey = req.url;

    const cacheValue = cache.get(cacheKey);

    if (cacheValue) {
      res.status(200).json(cacheValue);
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const data = await getEventsHistory({
      query: {
        type: { $ne: "claimreward" },
      },
      page,
      limit,
      sort: { createdAt: -1 },
    });
    cache.set(cacheKey, data, 10);
    res.status(200).json(data);
  } catch (error) {
    log("Get events error : " + error);
    res.status(500).json({ error: "Something wrong!" });
  }
};

export const getEventsByUser = async (req: Request, res: Response) => {
  try {
    const cacheKey = req.url;
    const cacheValue = cache.get(cacheKey);

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

    const data = await getEventsHistory({
      query: {
        from: Web3.utils.toChecksumAddress(address),
      },
      page,
      limit,
      sort: { createdAt: -1 },
    });
    cache.set(cacheKey, data, 10);
    res.status(200).json(data);
  } catch (error) {
    log("Get user history error : " + error);
    res.status(500).json({ error: "Something wrong!" });
  }
};

export const getClaimedReward = async (req: Request, res: Response) => {
  try {
    const cacheKey = req.url;

    const cacheValue = cache.get(cacheKey);

    if (cacheValue) {
      res.status(200).json(cacheValue);
      return;
    }

    const data = await getClaimedRewardQuery();
    if (data.length) {
      cache.set(cacheKey, { totalReward: data[0].totalReward }, 10);
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
    const cacheValue = cache.get(cacheKey);
    if (cacheValue) {
      res.status(200).json({ dailyApy: cacheValue });
      return;
    }
    const data = await findDailyApy();
    console.log("data", data);
    const dailyApy = data.length ? data[0].averageRatio - 1 : 0;
    cache.set(cacheKey, dailyApy, 60);
    res.status(200).json({ dailyApy });
  } catch (error) {
    log("Get getDailyApy error : " + error);
    res.status(500).json({ error: "Something wrong!" });
  }
};
