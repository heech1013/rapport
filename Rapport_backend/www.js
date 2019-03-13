const http = require('http');
const https = require('https');
const fs = require('fs');

require('dotenv').config();

const app = require('./app');

const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return 0;
  }
  if (port >= 0) {
    return port;
  }
  return 0;
};

if (process.env.NODE_ENV === 'production') {
  const port = normalizePort(process.env.PORT || '443');
  https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/mildang-blog.xyz/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/mildang-blog.xyz/fullchain.pem')
  }, app).listen(port, () => {
    console.log(`Server started on ${port}`);
  });
} else {
  const port = normalizePort(process.env.PORT || '5959');
  const httpServer = new http.Server(app);
  httpServer.listen(port, () => {
    console.log(`Server started on ${port}`);
  });
}
