import { Event, IEvent } from "../model/event.model";

export const createEvents = (datas: IEvent[]) => {
  return Event.create(datas, {
    ordered: false,
  });
};

export const getEvents = ({
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
    

};
