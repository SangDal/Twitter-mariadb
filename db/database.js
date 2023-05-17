// import mysql from 'mysql2'; sequelize 깔았으므로 삭제해도 됨
import { config } from '../config.js';
import SQ from 'sequelize';

const { host, user, database, password } = config.db;
// 원본 
// export const sequelize = new SQ.Sequelize(database, user, password, {
//     host,
//     dialect: 'mysql',// 마리아DB로 바꿔줘야함
//     logging: false,
//     timezone: "+09:00"
// })

export const sequelize = new SQ.Sequelize(database, user, password, {
    host,
    dialect: 'mariadb',// 마리아DB로 바꿔줘야함
    logging: false,
    timezone: "+09:00",
    port:"30418"
})