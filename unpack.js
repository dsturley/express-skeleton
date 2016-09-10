
const { resolve } = require('path');
const simpleload = require('simpleload');

exports.middleware = (app) =>
  simpleload(resolve(__dirname, 'middleware'), {
    suffix: '.js',
    recursive: true,
    as: 'values'
  }).sort((a, b) => a.priority - b.priority).forEach((m) => m.handler(app));


const methods = ['get', 'put', 'post', 'patch', 'delete'];
exports.routes = (app) =>
  simpleload(resolve(__dirname, 'routes'), {
    suffix: '.js',
    recursive: true,
    as: 'values'
  }).forEach((r) =>
    methods.forEach((method) => {
      const fn = r[method];
      if (fn) {
        app[method].apply(app, [r.route].concat(fn));
      }
    })
  );
