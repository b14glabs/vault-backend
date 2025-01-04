import { Event, IEvent } from "../model/event.model";

export const createEvents = (datas: IEvent[]) => {
  return Event.create(datas, {
    ordered: false,
  });
};

export const getEventsQuery = async ({
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

  const totalCount = await Event.countDocuments();

  return {
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
    results,
  };
};
