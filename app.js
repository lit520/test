const express = require('express');
const cors = require('cors');
const app = express();
const loginRouter = require('./routes/login');
const homeRouter = require('./routes/home');

// 使用路由  
app.use(cors());
app.use('/login', loginRouter);
app.use('/', homeRouter);

// 设置静态文件目录（如果有）  
// app.use(express.static('public'));  

// 启动服务器  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Web服务启动中，监听端口 ${PORT}`);
});