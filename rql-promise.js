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
  var dbConn = nodefn.call(_connPool.acquire.bind(_connPool)).
  otherwise(function (err) {
    console.log('RQL Promise Error : Could not connect to DB : ' + err);
  });
  return nodefn.call(query.run.bind(query), dbConn).
  ensure(function () {
    fn.call(_connPool.release.bind(_connPool), dbConn);
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
    create: function (callback) {
      r.connect(config, callback);
    },
    destroy: function (connection) {
      connection.close();
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