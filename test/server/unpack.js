

const { resolve } = require('path');
const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const pathToModule = '../../unpack';

describe('unpack', () => {
  describe('#middleware', () => {
    const express = {
      use: () => {},
    };
    it('should pass resolved ./routes/ to simpleload', (done) =>
      proxyquire(pathToModule, {
        simpleload: (p) => {
          expect(p).to.equal(resolve(__dirname, '../../middleware'));
          done();
          return [];
        }
      }).middleware(express)
    );

    it('should pass options to simpleload', (done) =>
      proxyquire(pathToModule, {
        simpleload: (_, options) => {
          expect(options).to.deep.equal({
            suffix: '.js',
            recursive: true,
            as: 'values'
          });
          done();
          return [];
        }
      }).middleware(express)
    );

    it('should should call handler on included middleware', () => {
      const handler = sinon.spy();
      const mod = proxyquire(pathToModule, {
        simpleload: () => [{
          priority: 1,
          handler
        }],
      });
      mod.middleware(express);
      expect(handler.calledWith(express)).to.be.true;
    });

    it('should should sort by priority', () => {
      let counter = 0;
      const mod = proxyquire(pathToModule, {
        simpleload: () => [{
          priority: 5,
          handler: () => {
            expect(counter).to.equal(1);
            counter += 1;
          }
        }, {
          priority: 10,
          handler: () => {
            expect(counter).to.equal(2);
            counter += 1;
          }
        }, {
          priority: 0,
          handler: () => {
            expect(counter).to.equal(0);
            counter += 1;
          }
        }],
      });
      mod.middleware();
      expect(counter).to.equal(3);
    });
  });

  describe('#routes', () => {
    const express = {
      get: () => {},
      post: () => {},
      put: () => {},
      patch: () => {},
      delete: () => {},
    };

    let mock;

    beforeEach(() => {
      mock = sinon.mock(express);
    });
    afterEach(() => {
      mock.restore();
    });

    it('should pass resolved ./routes/ to simpleload', (done) =>
      proxyquire(pathToModule, {
        simpleload: (p) => {
          expect(p).to.equal(resolve(__dirname, '../../routes'));
          done();
          return [];
        }
      }).routes(mock)
    );

    it('should pass options to simpleload', (done) =>
      proxyquire(pathToModule, {
        simpleload: (_, options) => {
          expect(options).to.deep.equal({
            suffix: '.js',
            recursive: true,
            as: 'values'
          });
          done();
          return [];
        }
      }).routes(mock)
    );

    it('should apply route', () => {
      const mod = proxyquire(pathToModule, {
        simpleload: () => [{
          route: '/foo',
          get: 'get'
        }],
      });
      const expected = mock.expects('get').once().withArgs('/foo', 'get');
      mod.routes(express);
      expected.verify();
    });

    it('should apply multiple routes', () => {
      const mod = proxyquire(pathToModule, {
        simpleload: () => [{
          route: '/foo',
          get: 'foo'
        }, {
          route: '/bar',
          get: 'bar'
        }],
      });
      const expected = mock.expects('get').twice();
      mod.routes(express);
      expected.verify();
    });

    it('should support POST', () => {
      const mod = proxyquire(pathToModule, {
        simpleload: () => [{
          route: '/foo',
          post: 'post'
        }],
      });
      const expected = mock.expects('post').once().withArgs('/foo', 'post');
      mod.routes(express);
      expected.verify();
    });

    it('should support PUT', () => {
      const mod = proxyquire(pathToModule, {
        simpleload: () => [{
          route: '/foo',
          put: 'put'
        }],
      });
      const expected = mock.expects('put').once().withArgs('/foo', 'put');
      mod.routes(express);
      expected.verify();
    });

    it('should support DELETE', () => {
      const mod = proxyquire(pathToModule, {
        simpleload: () => [{
          route: '/foo',
          delete: 'delete'
        }],
      });
      const expected = mock.expects('delete').once().withArgs('/foo', 'delete');
      mod.routes(express);
      expected.verify();
    });

    it('should support PATCH', () => {
      const mod = proxyquire(pathToModule, {
        simpleload: () => [{
          route: '/foo',
          patch: 'patch'
        }],
      });
      const expected = mock.expects('patch').once().withArgs('/foo', 'patch');
      mod.routes(express);
      expected.verify();
    });

    it('should allow multiple callbacks', () => {
      const mod = proxyquire(pathToModule, {
        simpleload: () => [{
          route: '/foo',
          post: ['posting', 'is', 'fun']
        }],
      });
      const expected = mock.expects('post').once().withArgs('/foo', 'posting', 'is', 'fun');
      mod.routes(express);
      expected.verify();
    });
  });
});
