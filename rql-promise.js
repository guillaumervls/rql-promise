var r = require('rethinkdb'),
  when = require('when'),
  nodefn = require('when/node/function'),
  fn = require('when/function'),
  poolModule = require('generic-pool');

var _connPool, _connected = false;

var rql = module.exports = function (query) {
  if (!_connected) {
    return when.reject('RQL Promise Error : Not connected');
  }
  return nodefn.call(_connPool.acquire.bind(_connPool)).
  then(function (dbConn) {
    return nodefn.call(query.run.bind(query), dbConn).
    ensure(function () {
      fn.call(_connPool.release.bind(_connPool), dbConn);
    });
  });
};

var disconnect = module.exports.disconnect = function () {
  if (!_connected) {
    return;
  }
  _connected = false;
  _connPool.drain(function () {
    _connPool.destroyAllNow();
  });
};

module.exports.connect = function (config) {
  if (_connected) {
    disconnect();
  }
  _connected = true;
  config = config ||  {};
  _connPool = poolModule.Pool({
    name: 'RethinkdDB connections',
    create: r.connect.bind(r, config),
    validate: function (connection) {
      return connection.open;
    },
    destroy: function (connection) {
      try {
        connection.close();
      } catch (e) {}
    },
    max: config.maxPoolSize || 10,
    min: 1,
    log: !! process.env.DEBUG
  });
};

module.exports.lazy = function (query) {
  return function () {
    return rql(query);
  };
};