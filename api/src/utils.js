const getCacheKey = (query) => {
  const sortedKeys = Object.keys(query).sort();
  const cacheKey = sortedKeys.map((key) => query[key]).join("-");
  return cacheKey;
};

module.exports = {
  getCacheKey,
};
