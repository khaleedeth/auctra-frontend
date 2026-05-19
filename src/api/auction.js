import { api } from "./axios";

// Get all auctions
export const getAuctions = () => {
  return api.get("/auctions");
};