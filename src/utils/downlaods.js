import { APIClient } from "./axios";

export async function downlaodItem(url, config = {}) {
  try {
    const { data, headers, request } = await APIClient.get(url, {
      ...config,
    });
    return data;
  } catch (error) {
    console.log(error);
    return false;
  }
}
