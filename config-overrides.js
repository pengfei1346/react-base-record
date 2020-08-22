// //根目录创建config-overrides.js, 修改默认配置
// const { override, fixBabelImports } = require("customize-cra");
//
// module.exports = override(
//   // fixBabelImports("import", {//antd按需加载
//   //   libraryName: "antd",
//   //   libraryDirectory: "es",
//   //   style: "css"
//   // })
// );
const { override, overrideDevServer, addLessLoader, addPostcssPlugins, fixBabelImports } = require('customize-cra');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
// 打包配置
const addCustomize = () => config => {
  if (process.env.NODE_ENV === 'production') {
    // 关闭sourceMap
    config.devtool = false;
    // 配置打包后的文件位置
    config.output.path = __dirname + '../dist/demo/';
    config.output.publicPath = './demo';
    // 添加js打包gzip配置
    config.plugins.push(
      new CompressionWebpackPlugin({
        test: /\.js$|\.css$/,
        threshold: 1024,
      }),
    )
  }
  return config;
}

// 跨域配置
const devServerConfig = () => config => {
  return {
    ...config,
    // 服务开启gzip
    compress: true,
    proxy: {
      '/api': {
        target: 'xxx',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api',
        },
      }
    }
  }
}

module.exports = {
  webpack: override(
    fixBabelImports('import', {
      libraryName: 'antd-mobile',
      style: 'css',
    }),
    addLessLoader(),
    addPostcssPlugins([require('postcss-pxtorem')({ rootValue: 75, propList: ['*'], minPixelValue: 2, selectorBlackList: ['am-'] })]),
    addCustomize(),
  ),
  devServer: overrideDevServer(
    devServerConfig()
  )
}

