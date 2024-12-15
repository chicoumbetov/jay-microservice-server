export type EventPayload = {
  event: string;
  data: {
    userId: string;
    product?: any;
    order?: any;
    qty?: number;
  };
};
