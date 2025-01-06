import { ExchangeRate, IExchangeRate } from "../model/exchangRate.model";

export const createExchangeRates = async (data: IExchangeRate) => {
  return ExchangeRate.create(data);
};

export const findDailyApy = async () => {
  const current = new Date();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 100000);

  return ExchangeRate.aggregate([
    {
      $addFields: {
        day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        today: { $dateToString: { format: "%Y-%m-%d", date: current } },
        sevenDayAgo: { $dateToString: { format: "%Y-%m-%d", date: sevenDaysAgo } },
      },
    },
    {
      $match: {
        $expr: {
          $and: [
            { $ne: ["$day", "$today"] },
            { $gte: ["$day", "$sevenDayAgo"] }
          ]
        }
      },
    },
    {
      $group: {
        _id: "$day",
        maxRate: { $max: "$exchangeRate" },
        minRate: { $min: "$exchangeRate" },
      },
    },
    {
      $project: {
        _id: 1,
        ratio: {
          $cond: {
            if: { $eq: ["$minRate", 0] },
            then: null,
            else: { $divide: ["$maxRate", "$minRate"] },
          },
        },
      },
    },
    {
      $match: {
        ratio: { $ne: null },
      },
    },
    {
      $group: {
        _id: null,
        averageRatio: { $avg: "$ratio" },
        // ratios: { $push: { day: "$_id", ratio: "$ratio" } }
      },
    },
  ]);
};
