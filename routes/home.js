const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const cors = require('cors');

// 数据库连接配置
const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
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

// 设置JSON响应类型  
router.use(express.json());

// 路由处理  
router.options('/api/*', (req, res) => {
    res.sendStatus(200);
});

router.post('/api/add', async (req, res) => {
    const { name, age } = req.body;
    const [rows] = await query('INSERT INTO user (name,age) VALUES (?,?)', [user.name, user.age]);
    res.json({ id: rows.insertId, name, age });
});

router.get('/api/query', async (req, res) => {
    const [rows] = await query('SELECT id, name FROM user');
    res.json(rows);
});

router.post('/api/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    await query('UPDATE user SET name = ? WHERE id = ?', [name, id]);
    res.json({ code: 1001, data: {}, message: 'success' });
});

router.delete('/api/delete/:id', async (req, res) => {
    const { id } = req.params;
    await query('DELETE FROM user WHERE id = ?', [id]);
    res.json({ code: 1001, data: {}, message: 'success' });
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