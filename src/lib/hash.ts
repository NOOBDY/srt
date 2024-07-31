const XXH = require("xxhashjs");

export const hash = (url: string) => {
  const hash: string = XXH.h32(url, "0").toString(16);
  return hash.slice(0, 3);
};
