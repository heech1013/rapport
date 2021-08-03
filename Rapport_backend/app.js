const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const helmet = require('helmet');
require('dotenv').config();

const apiController = require('./routes/controller');
const { sequelize } = require('./models');
const CustomError = require('./middlewares/errorHandler/customError');
const errorHandler = require('./middlewares/errorHandler/errorHandler');

const app = express();

sequelize.sync();
require('./middlewares/passport/local')(passport);
require('./middlewares/passport/jwt')(passport);

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  app.use(helmet());
} else {
  app.use(morgan('dev'));
}
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

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
