const http = require('http');
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

// HTTP服务器  
const server = http.createServer(async (req, res) => {
    // 允许跨域请求  
    res.setHeader('Access-Control-Allow-Origin', '*'); // 允许所有域名访问，出于安全考虑，生产环境应限制为具体的域名  
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    //res.sendStatus(200);

    const url = new URL(req.url, `http://${req.headers.host}`);
    let body = '';

    // 收集POST或PUT请求的数据  
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            //const connection = await createPool().getConnection();

            // 路由处理  
            if (req.method === 'POST' && url.pathname === '/api/add') {
                const user = JSON.parse(body);
                const [rows] = await query('INSERT INTO user (name,age) VALUES (?,?)', [user.name, user.age]);
                res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
                res.end(JSON.stringify({ id: rows.insertId, name: user.name }));
            } else if (req.method === 'GET' && url.pathname === '/api/query') {
                const [rows] = await query('SELECT id, name FROM user');
                res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
                res.end(JSON.stringify(rows));
            } else if (req.method === 'POST' && url.pathname.startsWith('/api/update/')) {
                const userId = parseInt(url.pathname.split('/')[3], 10);
                const user = JSON.parse(body);
                await query('UPDATE user SET name = ? WHERE id = ?', [user.name, userId]);
                res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' }); // No Content  
                res.end(JSON.stringify({
                    code: 1001,
                    data: {},
                    message: 'success'
                }));
            } else if (req.method === 'DELETE' && url.pathname.startsWith('/api/delete/')) {
                const userId = parseInt(url.pathname.split('/')[3], 10);
                await query('DELETE FROM user WHERE id = ?', [userId]);
                res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' }); // No Content  
                res.end(JSON.stringify({
                    code: 1001,
                    data: {},
                    message: 'success'
                }));
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({
                    code: 1002,
                    data: {},
                    message: 'Error'
                }));
            }

            //await connection.release();
        } catch (err) {
            console.error('Database error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                code: 1002,
                data: {},
                message: 'Error'
            }));
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Web服务启动中，监听端口 ${PORT}`);
});