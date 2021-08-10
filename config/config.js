module.exports = {
  "development": {
    "user": "root",
    "password": "akgml3413@@",
    "database": "rapport_development",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "production": {
    "user": process.env.RDS_USER,  // RDS master ID
    "password": process.env.RDS_PASSWORD,  // RDS master PW
    "database": process.env.RDS_DATABASE,  // RDS 데이터베이스 명
    "host": process.env.RDS_HOST,  // RDS 데이터베이스 호스트 (endpoint)
    "port": process.env.RDS_PORT,  // RDS 사용 포트
    "dialect": "mysql",
    "operatorsAliases": false,
    "logging": false
  }
}
