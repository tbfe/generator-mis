/**
 * 部署配置信息
 */

module.exports = {
    // 部署机器的HOST
    'host': '<%= host %>',
    'modName': '<%= modName %>',
    'subModName': '<%= subModName %>',
    // 静态端口
    'staticPort': 8090,
    // 页面访问端口
    'tplPort': 8080,
    // 静态文件部署路径
    'staticPath': '/home/work/static/static.tieba.baidu.com',
    // 模版文件部署路径
    'tplPath': '/home/work/orp/template'
};