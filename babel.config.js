module.exports = function (api) {
  api.cache(true);
  presets: ["@babel/preset-env", "@babel/preset-react"];
  return {
    plugins: ["macros"],
  };
};
