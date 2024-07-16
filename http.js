const http = require('http');
const mysql = require('mysql2/promise');

// 数据库连接配置  
const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'test'
};

// 异步函数来连接数据库  
async function connectDB() {
    return await mysql.createConnection(dbConfig);
}

// HTTP服务器  
const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    let body = '';

    // 收集POST或PUT请求的数据  
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const connection = await connectDB();

            // 路由处理  
            if (url.pathname === '/api/add') {
                const user = { name: '小飞', age: 14 };
                const [rows] = await connection.execute('INSERT INTO user (name,age) VALUES (?,?)', [user.name, user.age]);
                res.writeHead(201, { 'Content-Type': 'text/html;charset=utf-8' });
                res.end(JSON.stringify({ id: rows.insertId, name: user.name }));
            } else if (url.pathname === '/api/query') {
                const [rows] = await connection.execute('SELECT id, name FROM user');
                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                res.end(JSON.stringify(rows));
            } else if (url.pathname.startsWith('/api/update/')) {
                const userId = parseInt(url.pathname.split('/')[3], 10);
                const user = { name: '小炫' };
                await connection.execute('UPDATE user SET name = ? WHERE id = ?', [user.name, userId]);
                res.writeHead(204, { 'Content-Type': 'text/html;charset=utf-8' }); // No Content  
                res.end('更新完成');
            } else if (url.pathname.startsWith('/api/delete/')) {
                const userId = parseInt(url.pathname.split('/')[3], 10);
                await connection.execute('DELETE FROM user WHERE id = ?', [userId]);
                res.writeHead(204, { 'Content-Type': 'text/html;charset=utf-8' }); // No Content  
                res.end('删除完成');
            } else {
                res.writeHead(404);
                res.end('Not Found');
            }

            await connection.end();
        } catch (err) {
            console.error(err);
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Web服务启动中，监听端口 ${PORT}`);
});