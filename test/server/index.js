const { expect } = require('chai');
const proxyquire = require('proxyquire');

const pathToModule = '../../';

describe('index', () => {
  it('should create express server on port 8000', (done) => {
    proxyquire(pathToModule, {
      './unpack': {
        middleware: () => {},
        routes: () => {}
      },
      express: () => ({
        listen: (port) => {
          expect(port).to.equal(8000);
          done();
        }
      })
    });
  });
  it('should pass app to unpack.routes', (done) => {
    proxyquire(pathToModule, {
      express: () => ({
        mocked: 'yep',
        listen: () => {}
      }),
      './unpack': {
        middleware: () => {},
        routes: (actual) => {
          expect(actual.mocked).to.deep.equal('yep');
          done();
        }
      }
    });
  });
  it('should pass app to unpack.middleware', (done) => {
    proxyquire(pathToModule, {
      express: () => ({
        mocked: 'yep',
        listen: () => {}
      }),
      './unpack': {
        routes: () => {},
        middleware: (actual) => {
          expect(actual.mocked).to.deep.equal('yep');
          done();
        }
      }
    });
  });
});
