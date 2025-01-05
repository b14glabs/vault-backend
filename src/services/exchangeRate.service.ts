import { ExchangeRate, IExchangeRate } from "../model/exchangRate.model";

export const createExchangeRates = async (data: IExchangeRate) => {
  return ExchangeRate.create(data);
};

export const findDailyApy = async () => {
    return ExchangeRate.aggregate([
        {
          $addFields: {
            day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            today: { $dateToString: { format: "%Y-%m-%d", date: new Date() } } // Get today's date
          }
        },
        {
          $match: {
            $expr: { $ne: ["$day", "$today"] } 
          }
        },
        {
          $group: {
            _id: "$day",
            maxRate: { $max: "$exchangeRate" },
            minRate: { $min: "$exchangeRate" }
          }
        },
        {
          $project: {
            _id: 1,
            ratio: {
              $cond: {
                if: { $eq: ["$minRate", 0] },
                then: null,
                else: { $divide: ["$maxRate", "$minRate"] }
              }
            }
          }
        },
        {
          $match: {
            ratio: { $ne: null }
          }
        },
        {
          $group: {
            _id: null,
            averageRatio: { $avg: "$ratio" },
            // ratios: { $push: { day: "$_id", ratio: "$ratio" } }
          }
        }
      ]);
      
};
