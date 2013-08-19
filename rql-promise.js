var r = require('rethinkdb'),
  when = require('when'),
  nodefn = require('when/node/function'),
  fn = require('when/function'),
  poolModule = require('generic-pool');

var _connPool, _initialized = false;

var rql = module.exports = function (query) {
  if (!_initialized) {
    return when.reject('RQL Promise Error : Not initialized');
  }
  var dbConn = nodefn.call(_connPool.acquire.bind(_connPool)).
  otherwise(function (err) {
    console.log('RQL Promise Error : Could not connect to DB : ' + err);
  });
  return nodefn.call(query.run.bind(query), dbConn).
  ensure(function () {
    fn.call(_connPool.release.bind(_connPool), dbConn);
  });
};

module.exports.init = function (config) {
  if (_initialized) {
    throw new Error('RQL Promise Error : Already initialized');
  }
  _initialized = true;
  config = config ||  {};
  _connPool = poolModule.Pool({
    name: 'RethinkdDB connections',
    create: function (callback) {
      r.connect(config, callback);
    },
    destroy: function (connection) {
      connection.close();
    },
    max: config.maxPoolSize || 5,
    min: 1,
    log: !! process.env.DEBUG
  });
};

module.exports.disconnect = function () {
  if (!_initialized) {
    return;
  }
  _initialized = false;
  _connPool.drain(function () {
    _connPool.destroyAllNow();
  });
};

module.exports.lazy = function (query) {
  return function () {
    return rql(query);
  };
};