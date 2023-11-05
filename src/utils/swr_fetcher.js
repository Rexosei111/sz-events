import { APIClient } from "./axios";
import useToken from "@/hooks/token";

export const fetcher = async (url) => {
  const { data } = await APIClient.get(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data;
};
