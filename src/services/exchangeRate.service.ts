import { ExchangeRate, IExchangeRate } from "../model/exchangRate.model";

export const createExchangeRates = async (data: IExchangeRate) => {
  return ExchangeRate.create(data);
};

export const findExchangeRatesPerDay = async (day = 7) => {
  const daysAgo = new Date(Date.now() - day * 24 * 60 * 60 * 1000);
  return ExchangeRate.aggregate([
    {
      $addFields: {
        day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        // today: { $dateToString: { format: "%Y-%m-%d", date: current } },
        daysAgo: {
          $dateToString: { format: "%Y-%m-%d", date: daysAgo },
        },
        exchangeRateNumber: { $toDouble: "$exchangeRate" },
      },
    },
    {
      $match: {
        $expr: {
          $gte: ["$day", "$daysAgo"],
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
        _id: 1,
      },
    },
  ]);
};

export const findLastExchangeRate = async () => {
  return ExchangeRate.findOne().sort({ date: -1 }).limit(1);
};

export const getLatestExchangeRates = () => {
  return ExchangeRate.find({}, { blockNumber: 1, exchangeRate: 1 })
    .sort({ blockNumber: -1 })
    .limit(2);
};
