"use strict";

const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    name: 'nodejs-restify-api',
    hostname: process.env.APP_URL || 'http://localhost',
    version: '0.0.1',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8081,
    db: {
        get: mysql.createConnection({
            host: process.env.MYSQL_HOST || 'localhost',
            user: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || 'password',
            database: process.env.MYSQL_DATABASE || 'qna'
        })
    },
    jwt: {
        secret: "&@$!restify!$@&"
    }
}