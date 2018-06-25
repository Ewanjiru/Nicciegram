const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const dotEnv = require('dotenv');
const users = require('./routes/api/users');
const profiles = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const config = require('./config/config');

const app = express();
const database = config.MONGO_DEV;
const port = config.PORT;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose
  .connect(database)
  .then(() => console.log('Database connected'))
  .catch(err => console.log('error occured', err))

app.use(passport.initialize());
require('./config/passport')(passport);

app.use('/api/users', users);
app.use('/api/profile', profiles);
app.use('/api/posts', posts);

app.listen(port, () => console.log(`Server running on port ${port}`))
