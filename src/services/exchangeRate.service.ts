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
        sevenDayAgo: {
          $dateToString: { format: "%Y-%m-%d", date: sevenDaysAgo },
        },
        exchangeRateNumber: { $toDouble: "$exchangeRate" },
      },
    },
    {
      $match: {
        $expr: {
          $and: [
            { $gte: ["$day", "$sevenDayAgo"] },
          ],
        },
      },
    },
    {
      $group: {
        _id: "$day",
        rate: { $max: "$exchangeRateNumber" },
      },
    },
    {
      $sort: {
        _id: 1
      }
    }
  ]);
};

export const findLastExchangeRate = async () => {
  return ExchangeRate.findOne().sort({date: -1}).limit(1)
}
