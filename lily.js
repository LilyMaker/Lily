// 导入必要的模块
const http = require('http');
const fs = require('fs');
const path = require('path');

// 设置静态文件目录
const staticDir = './';

// 创建HTTP服务器
http.createServer((req, res) => {
  // 解析请求URL以获取请求的文件路径
  const filePath = path.join(staticDir, req.url === '/' ? 'index.html' : decodeURIComponent(req.url));

  // 检查文件是否存在
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      return res.end('<h1>404 Not Found</h1>');
    }

    // 设置响应头信息
    res.writeHead(200, { 'Content-Type': mime.getType(filePath) || 'application/octet-stream' });

    // 创建可读流并发送文件内容到客户端
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });
}).listen(3000, () => {
  console.log('Static file server running at http://localhost:3000/');
});

// 引入mime类型库（确保安装：npm install mime）
const mime = require('mime'); // 不是内置模块，需要先安装：npm install mime

