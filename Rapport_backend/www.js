const http = require('http');
const dotenv = require('dotenv');

const app = require('./app');

dotenv.config();  // .env를 환경변수로 설정
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

const httpServer = new http.Server(app);
const port = normalizePort(process.env.PORT || '5959');

httpServer.listen(port, () => {
  console.log(`Server started on ${port}`);
});
// http 모듈로 서버 구축: 디버깅에 유리(예준피셜)