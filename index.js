'use strict';

const express = require('express');
const { routes, middleware } = require('./unpack');

const app = express();

const port = 8000;
middleware(app);
routes(app);
app.listen(port, () =>
  console.log('server listening on port: %s', port));
