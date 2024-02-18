// 引入必要的模块
const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

// 设置静态文件目录和允许列出目录的路径
const staticDir = './public';
const browseableDirs = [staticDir];

// 创建HTTP服务器
http.createServer((req, res) => {
  // 解析请求URL以获取请求的文件路径
  const filePath = path.join(staticDir, req.url === '/' ? 'index.html' : decodeURIComponent(req.url));

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory() && browseableDirs.includes(filePath)) {
      // 如果是可浏览的目录，则列出目录内容
      fs.readdir(filePath, (readErr, files) => {
        if (readErr) {
          res.writeHead(500, { 'Content-Type': 'text/html' });
          return res.end('<h1>Internal Server Error</h1>');
        }

        let html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Directory Listing</title></head><body>';
        html += `<h1>Directory: ${filePath}</h1><ul>`;
        for (const file of files) {
          html += `<li><a href="/${encodeURIComponent(path.relative(staticDir, path.join(filePath, file)))}">${file}</a></li>`;
        }
        html += '</ul></body></html>';

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
      });

    } else if (!err && stats.isFile()) {
      // 如果是文件，则发送文件内容
      res.writeHead(200, { 'Content-Type': mime.getType(filePath) || 'application/octet-stream' });
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

    } else {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found</h1>');
    }
  });
}).listen(3000, () => {
  console.log('Static file server running at http://localhost:3000/');
});
