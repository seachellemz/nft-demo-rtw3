/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    // Will only be available on the server side
    mySecret: "secret",
    //API_KEY: "SdaynPyfQPNCFF_4YrqaZTyasiKhq",
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: "/static",
    API_KEY: "SdaynPyfQPNCFF_4YrqaZTyasiKhq-bd",
  },
};
