const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const helmet = require('helmet');

const apiController = require('./routes');
const { sequelize } = require('./models');
const CustomError = require('./errorHandler/customError');
const errorHandler = require('./errorHandler/errorHandler');

const app = express();

sequelize.sync();
require('./passport/strategy')(passport);

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));  // 서버에 요청 로그 기록 (combined, short, common, tiny)
  app.use(helmet());  // express 권장 보안 모듈
} else { app.use(morgan('dev')); }
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());  // initialize passport authentication module

app.use('/', apiController);

/* error handling */
app.use((_, __, next) => {
  next(CustomError('NotFound'));
});

app.use(errorHandler);

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });

module.exports = app;