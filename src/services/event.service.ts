import { Event, IEvent } from "../model/event.model";

export const createEvents = (datas: IEvent[]) => {
  return Event.create(datas, {
    ordered: false,
  });
};

export const insertEvent = (data: IEvent) => {
  return Event.updateOne(
    {
      txId: data.txId,
    },
    {
      $set: {
        ...data,
      },
    },
    {
      upsert: true,
    }
  );
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

export const countUserStakeEvent = async (delegator: string) => {
  const stakeEvents = await Event.countDocuments({
    from: delegator,
    type: "stake",
  });
  return stakeEvents;
};

export const totalStakeQuery = async () => {
  const coretoshiTotalStake = await Event.aggregate([
    {
        $match: {
          dualCoreAmount: {
            $exists: true
          },
          isFromCoretoshiVault: true
        },
    },
    {
      $group: {
        _id: null,
        stake: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$type", "stake"],
              },
              then: {
                $toDouble: "$dualCoreAmount",
              },
              else: {
                $multiply: [
                  {
                    $toDouble: "$dualCoreAmount",
                  },
                  -1,
                ],
              },
            },
          },
        },
      },
    },
  ]) as unknown as { stake: number }[];

  const normalTotalStake = await Event.aggregate([
    {
        $match: {
          dualCoreAmount: {
            $exists: true
          },
          isFromCoretoshiVault: {
            $exists: false
          }
        },

    },
    {
      $group: {
        _id: null,
        stake: {
          $sum: {
            $cond: {
              if: {
                $eq: ["$type", "stake"],
              },
              then: {
                $toDouble: "$dualCoreAmount",
              },
              else: {
                $multiply: [
                  {
                    $toDouble: "$dualCoreAmount",
                  },
                  -1,
                ],
              },
            },
          },
        },
      },
    },
  ]) as unknown as { stake: number }[];
  return {
    coretoshiTotalStake: coretoshiTotalStake.length ? coretoshiTotalStake[0].stake : 0,
    normalTotalStake: normalTotalStake.length ? normalTotalStake[0].stake : 0
  }
};
