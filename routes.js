const fs = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>')
    res.write('<head><title>Enter Message</title></head>');
    res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Submit</button></form></body>');
    res.write('</html>')
    return res.end();
  }

  if (url === '/message' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      console.log('chunk',chunk);

      body.push(chunk);
    });
    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log('parsedBody',parsedBody);
      const message = parsedBody.split('=')[1];
      fs.writeFile('message.txt', message, (err) => {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end;
      });
    });
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<html>')
  res.write('<head><title>Messages</title></head>');
  res.write('<body><div>Hello messages!</div></body>');
  res.write('</html>')
  res.end();
}

// module.exports = requestHandler;
// module.exports = {
//   handler: requestHandler,
//   someText: 'text',
// };

// module.exports.handler = requestHandler;
// module.exports.someText = 'text';

exports.handler = requestHandler;
exports.someText = 'text';