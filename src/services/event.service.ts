import { Event, IEvent } from "../model/event.model";

export const createEvents = (datas: IEvent[]) => {
  return Event.create(datas, {
    ordered: false,
  });
};

export const getEventsHistory = async ({
  query,
  page,
  limit,
  sort,
}: {
  query: any;
  page: number;
  limit: number;
  sort: any;
}) => {
  const skip = (page - 1) * limit;

  const results = await Event.find({
    ...query,
  })
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const totalCount = await Event.countDocuments({
    ...query,
  });

  return {
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
    results,
  };
};

export const getClaimedRewardQuery = async () => {
  return Event.aggregate([
    {
      $match: {
        type: "claimreward",
      },
    },
    {
      $group: {
        _id: null,
        totalReward: { $sum: { $toDouble: "$coreAmount" } },
      },
    },
  ]);
};

export const getStake24hChange = async () => {
  const current = new Date();
  const previousDate = new Date(current.getTime() - 24 * 60 * 60 * 1000);
  const newStaked = await Event.aggregate([
    {
      $match: {
        type: "stake",
        createdAt: {
          $gte: previousDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalStaked: {
          $sum: {
            $toDouble: "$coreAmount",
          },
        },
      },
    },
  ]);
  return newStaked.length ? newStaked[0].totalStaked as number : 0;
};

export const getWithdraw24hChange = async () => {
  const current = new Date();
  const previousDate = new Date(current.getTime() - 24 * 60 * 60 * 1000);
  const newStaked = await Event.aggregate([
    {
      $match: {
        $or: [
          {
            type: "withdraw",
          },
          {
            type: "withdrawdirect",
          },
        ],
        createdAt: {
          $gte: previousDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalWithdraw: {
          $sum: {
            $toDouble: "$coreAmount",
          },
        },
      },
    },
  ]);
  return newStaked.length ? newStaked[0].totalWithdraw as number : 0;
};
