import { Request, Response } from "express";
import { log } from "../util";
import { getEventsQuery } from "../services/event.service";
import { findDailyApy } from "../services/exchangeRate.service";
import { cache } from "..";

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

    const data = await getEventsQuery({
      query: {},
      page,
      limit,
      sort: { createdAt: -1 },
    });
    cache.set(cacheKey, data, 60);
    res.status(200).json(data);
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

    const dailyApy = data.length ? data[0].averageRatio - 1 : 0;
    cache.set(cacheKey, dailyApy, 60);
    res.status(200).json({ dailyApy });
  } catch (error) {
    log("Get getDailyApy error : " + error);
    res.status(500).json({ error: "Something wrong!" });
  }
};
