
const express = require('express');
const { resolve } = require('path');

exports.priority = 2;
exports.handler = (app) =>
  app.use(express.static(resolve(__dirname, '../public')));
