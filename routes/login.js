const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const cors = require('cors');
const router = express.Router();

// 数据库连接配置
const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    pwd: '123456',
    database: 'test',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// 异步函数来连接数据库
async function connectDB() {
    return await mysql.createConnection(dbConfig);

}
let pool;

(async () => {
    try {
        pool = await mysql.createPool(dbConfig);
        console.log('Connection pool initialized successfully');
    } catch (err) {
        console.error('Failed to initialize connection pool:', err);
        process.exit(1); // 退出程序，因为连接池无法初始化
    }
})();

// 封装一个用于执行SQL查询的函数，返回Promise
async function query(sql, args) {
    try {
        const [rows, fields] = await pool.execute(sql, args);
        return [rows, fields];
    } catch (err) {
        console.error('Database error:', err);
        throw err; // 将错误抛出，以便在调用处捕获
    }
}

// 允许跨域请求  
router.use(cors());

// 使用body-parser中间件  
router.use(bodyParser.json());

// 路由处理  
router.options('/login', (req, res) => {
    res.sendStatus(200);
});

// 登录路由  
router.post('/login', async (req, res) => {
    const { phone, pwd } = req.body;
    try {
        // 使用连接池获取数据库连接并执行查询  
        const [rows] = await pool.query(
            'SELECT * FROM user WHERE phone = ? AND pwd = ?',
            [phone, pwd]
        );
        if (rows.length === 0) {
            return res.status(404).send('User Not Found!!!');
        }
        // user表中id字段作为用户的主键  
        const userId = rows[0].id;
        // 生成JWT Token  
        const token = jwt.sign({ userId }, 'secret_key', { expiresIn: '1d' });
        res.json({ token });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// 处理未找到路由的情况  
router.use((req, res) => {
    res.status(404).json({ code: 1002, data: {}, message: 'Error' });
});

// 错误处理中间件  
router.use((err, req, res, next) => {
    console.error('Error handling request:', err);
    res.status(500).json({ code: 1002, data: {}, message: 'Error' });
});

module.exports = router;