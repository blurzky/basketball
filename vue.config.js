const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = {
  outputDir: 'basket',
  assetsDir: 'static',
  productionSourceMap: false,
  configureWebpack: () => {
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          new CompressionWebpackPlugin({
            algorithm: 'gzip',
            test: /\.js$|\.html$|\.css/,
            threshold: 10240,
            minRatio: 0.8
          })
        ]
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/assets/sass/main.scss";
        `
      }
    }
  },
  devServer: {
    port: 8888,
    open: true,
    proxy: {
      '/api': {
        target: 'https://bigao.nhgk.shop',
        target: 'http://192.168.5.69:8000',
        changeOrigin: true,
        // pathRewrite: {
        //   '^/api': ''
        // }
      }
    }
  },
}