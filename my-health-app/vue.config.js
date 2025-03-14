module.exports = {
  configureWebpack: {
    resolve: {
      fallback: {
        path: require.resolve("path-browserify"),
        crypto: require.resolve("crypto-browserify"),
        os: require.resolve("os-browserify/browser"),
      },
    },
  },
};
