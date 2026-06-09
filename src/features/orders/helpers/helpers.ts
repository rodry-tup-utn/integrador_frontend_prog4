export const isCancellable = (stateOrder: string): boolean => {
  return ["PENDING", "CONFIRMED", "IN_PREP"].includes(stateOrder);
};

export const isProgressable = (stateOrder: string): boolean => {
  return !["CANCELLED", "DELIVERED"].includes(stateOrder);
};
