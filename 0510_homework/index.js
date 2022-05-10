const http = require('http');
const fs = require('fs');
const path = require('path');
let filePath = 'message.txt';

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    res.write(`
      <html>
        <head>
          <title>First Page</title>
        </head>
        <body>
          <h1>Hello Node!</h1>
          <a href='/write-message'>write-message</a>
          <a href='/read-message'>read-message</a>
        </body>
      </html>
  `);
    res.end();
  }

  if (url === '/msg' && method === 'POST') {
    const body = [];

    req.on('data', (data) => {
      body.push(data);
    });
    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];

      fs.writeFile(filePath, message, (err) => {
        if (err) throw err;
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    });
  }

  if (url === '/write-message') {
    res.write(`
      <html>
        <head>
          <title>Write Page</title>
        </head>
        <body>
          <form action="/msg" method="POST">
            <input type="text" name="message" />
            <button type="submit">Submit</button>
          </form>
        </body>
      </html>
    `);
    res.end();
  } else if (url === '/read-message') {
    fs.readFile(filePath, (err, content) => {
      if (err) {
        if (err.code === 'ENOENT') {
          fs.readFile(
            path.join(__dirname, 'public', '404.html'),
            (err, content) => {
              if (err) throw err;
              res.writeHead(400, { 'Content-Type': 'text/html' });
              res.end(content, 'utf8');
            }
          );
        } else {
          res.writeHead(500);
          res.end(`Server error: ${err.code}`);
        }
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content, 'utf8');
      }
    });
  }
});
server.listen(8000);
