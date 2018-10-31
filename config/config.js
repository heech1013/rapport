module.exports = {
  "development": {
    "user": "root",
    "password": "111111",
    "database": "rapport_development",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "test": {
    "user": "root",
    "password": "111111",
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "production": {
    "user": "",
    "password": process.env.SEQUELIZE_PASSWORD,
    "database": "",
    "host": "",
    "dialect": "mysql",
    "operatorsAliases": false,
    "logging": false
  }
}