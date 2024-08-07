//1. 导入mysql模块
const mysql = require('mysql2')

//2. 建立与MySQL数据库连接
const db = mysql.createPool({
    host: '127.0.0.1', //数据库的ip地址
    user: 'root', //登录数据库账号
    password: 'root', //登录数据库密码
    database: 'test' //指定要操作的数据库
})

// 测试mysql模块能否正常工作
// db.query('select 1', (err, results) => {
//     if (err) return console.log(err.message);
//     else console.log(results);
// })

//查询user表中的所有用户数据
db.query('select * FROM user', (err, results) => {
    if (err) return console.log(err.message);
    else console.log(results);
})
