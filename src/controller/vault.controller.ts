import { Request, Response } from "express";
import { log } from "../util";
import { getEventsQuery } from "../services/event.service";
import { findDailyApy } from "../services/exchangeRate.service";

export const getEvents = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const data = await getEventsQuery({
      query: {},
      page,
      limit,
      sort: { createdAt: -1 },
    });

    res.status(200).json(data);
  } catch (error) {
    log("Get events error : " + error);
    res.status(500).json({ error: "Something wrong!" });
  }
};

export const getDailyApy = async (req: Request, res: Response) => {
  try {
    const data = await findDailyApy()

    console.log("data", data)

    res.status(200).json({dailyApy: data[0].averageRatio * 100})

  } catch (error) {
    log("Get getDailyApy error : " + error);
    res.status(500).json({ error: "Something wrong!" });
  }
};
