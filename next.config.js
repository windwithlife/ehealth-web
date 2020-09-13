//用于 Next 启动服务已经构建阶段，但是不作用于浏览器端。
const withCSS = require('@zeit/next-css');
const withLess = require('@zeit/next-less');
const withPlugins = require('next-compose-plugins');
const {baseUrl} = require("./config.json")
const logger = require("./tool_server/logger")(__filename);
const ENV = process.env.NODE_ENV;
logger.info('process.env.NODE_ENV : ', ENV);

const stylePlugins = [
  [ 
    withCSS,
    {
      cssModules: false,
      cssLoaderOptions: {
        importLoaders: 1,
        minimize:true,
        // localIdentName: "[local]___[hash:base64:5]",
      }
    }
  ],
  [
    /** 
     * The stylesheet is compiled to .next/static/css
     * 如果开启cssModule 会导致ant-design-mobile 样式匹配结果错乱；所以需要关闭
    */
    withLess,  
    {
      cssModules:false, //http://www.ruanyifeng.com/blog/2016/06/css_modules.html CSS Modules 用法教程
      cssLoaderOptions:{
        importLoaders: 1,
        minimize:true,
        // localIdentName: "[local]___[hash:base64:5]", //localIdentName  CSS-Module 定制哈希类名
      },
      lessLoaderOptions: {
        javascriptEnabled: true,
      },
    }
  ]
]

const config = {
  lessLoaderOptions: { javascriptEnabled: true},
  assetPrefix: ENV == "production" ? baseUrl : "",
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
}

// module.exports = withLess({
//   lessLoaderOptions: { javascriptEnabled: true},
//   assetPrefix: baseUrl,
//   async rewrites() {
//     return [
//       {
//         source: `${baseUrl}/:slug*`,
//         destination: '/:slug*',
//       },
//     ]
//   },
//   webpack: (config, { isServer }) => {
//     if (isServer) {
//       const antStyles = /antd\/.*?\/style.*?/
//       const origExternals = [...config.externals]
//       config.externals = [
//         (context, request, callback) => {
//           if (request.match(antStyles)) return callback()
//           if (typeof origExternals[0] === 'function') {
//             origExternals[0](context, request, callback)
//           } else {
//             callback()
//           }
//         },
//         ...(typeof origExternals[0] === 'function' ? [] : origExternals),
//       ]

//       config.module.rules.unshift({
//         test: antStyles,
//         use: 'null-loader',
//       })
//     }
//     return config
//   },
// })

module.exports = withPlugins(stylePlugins,config)