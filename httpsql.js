const http = require('http');
const mysql = require('mysql2');

// 创建MySQL连接池  
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'test'
});

// 创建HTTP服务器  
const server = http.createServer((req, res) => {
    // 解析URL  
    const url = new URL(req.url, `http://${req.headers.host}`);

    // 简单的路由处理  
    if (url.pathname === '/add/User') {
        // 处理POST请求体  
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // 假设发送的是JSON字符串  
        });
        req.on('end', async () => {
            try {
                const user = { name: '小飞', age: 14 }; // 解析JSON请求体  
                await pool.execute('INSERT INTO user (name, age) VALUES (?, ?)', [user.name, user.age]);
                res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
                res.end('用户添加成功');
            } catch (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'text/html;charset=utf-8' });
                res.end('服务器错误');
            }
        });
    } else {
        // 处理其他请求或默认响应  
        res.writeHead(404, { 'Content-Type': 'text/html;charset=utf-8' });
        res.end('未找到资源');
    }
});

// 配置端口号并启动Web服务  
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Web服务启动中，监听端口 ${PORT}`);
});