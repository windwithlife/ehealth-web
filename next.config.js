//用于 Next 启动服务已经构建阶段，但是不作用于浏览器端。
const withLess = require('@zeit/next-less');
const {baseUrl} = require("./config.json")


module.exports = withLess({
  lessLoaderOptions: { javascriptEnabled: true},
  assetPrefix: baseUrl,
  async rewrites() {
    return [
      {
        source: `${baseUrl}/:slug*`,
        destination: '/:slug*',
      },
    ]
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      const antStyles = /antd\/.*?\/style.*?/
      const origExternals = [...config.externals]
      config.externals = [
        (context, request, callback) => {
          if (request.match(antStyles)) return callback()
          if (typeof origExternals[0] === 'function') {
            origExternals[0](context, request, callback)
          } else {
            callback()
          }
        },
        ...(typeof origExternals[0] === 'function' ? [] : origExternals),
      ]

      config.module.rules.unshift({
        test: antStyles,
        use: 'null-loader',
      })
    }
    return config
  },
})