const path = require('path');
module.exports = {
    apps:[{
        name:'operation_platform_web', // 应用名称
        script:"npm run start",
        watch: ['.next'],  // 监控变化的目录，一旦变化，自动重启
        ignore_watch:['node_modules','logs','public'],
        node_args: '--harmony', // node的启动模式
        env_production: {
            NODE_ENV: 'production'
        },
        out_file: path.join(__dirname,'./logs/out.log'), // 普通日志路径
        error_file: path.join(__dirname,'./logs/error.log'), // 错误日志路径
        merge_logs: true,
        log_date_format: 'YYYY-MM-DD HH:mm:ss',
        // instances:"1", //负载均衡   根据机器CPU核数，开启对应数目的进程运行项目
        // exec_mode : "cluster"
    }]
}

/**
 * https://pm2.keymetrics.io/docs/usage/quick-start/
 * pm2 start
 * pm2 show (appname|id) 查看详细状态信息
 * pm2 monit 监控每个 node 进程的 cpu 和内存使用情况
 * pm2 logs
 * pm2 logs APP-NAME       # Display APP-NAME logs 
 * pm2 web 监控运行这些进程的机器的状态
 * pm2 describe <id|app_name>
 * pm2 reload all
 */