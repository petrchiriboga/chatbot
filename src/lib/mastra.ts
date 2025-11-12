import { MastraClient } from "@mastra/client-js";

export const mastraClientKraken = new MastraClient({
  baseUrl: "http://localhost:8080/ai",
});

export const mastraClientRaw = new MastraClient({
  baseUrl:"http://localhost:4111",
});
