'use strict';

// 生产环境配置
var MONGO_ADDR = process.env.MONGO_PORT_27017_TCP_ADDR || "localhost";

module.exports = {
    port: process.env.PORT || 8800,
    //生产环境mongodb配置
    mongo: {
        uri: 'mongodb://' +  MONGO_ADDR + '/case-collections'
    }
};
