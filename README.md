RQL Promise
===========

Turn RethinkDB's RQL queries into promises. Uses [WhenJS](https://github.com/cujojs/when) promises.

## Install

`npm install rql-promise`


## Use

```javascript
var rql = require('rql-promise');
var r = require('rethinkdb');

// Connect - Do this only once, or you'll get an error
rql.init({
  host: 'localhost',
  port: 28015,
  db: 'test',
  authKey: '',
  maxPoolSize: 5 // Max number of simultaneous DB connections
                 // Set to 1 to disable pooling
});

// Make a query
rql(r.table('cats').get('fatso')).
then(function (cat) {}, function (err) {});

// Make a "lazy" query - i.e. a function that makes the query only when called
delay(1000). // For this exemple, returns a resolved promise after 1 second
             // Can be found in the "when" NPM module among others
then(rql.lazy(r.table('cats').get('fatso'))).
then(function (cat) {}, function (err) {});

// Disconnect
rql.disconnect();
```
