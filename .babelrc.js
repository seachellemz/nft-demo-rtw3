module.exports = {
  presets: [
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
        development: process.env.BABEL_ENV === "development",
      },
    ],
  ],
};
