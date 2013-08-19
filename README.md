RQL Promise
===========

Turn RethinkDB's RQL queries into promises. Uses [WhenJS](https://github.com/cujojs/when) promises.

## Install

`npm install rql-promise`


## Use

```javascript
var rql = require('rql-promise');
var r = require('rethinkdb');

// Connect
rql.connect({
  host: 'localhost',
  port: 28015,
  db: 'test',
  authKey: '',
  maxPoolSize: 10 // Max number of simultaneous DB connections
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

### Licence

The MIT License (MIT)

Copyright (c) 2013 guillaumervls

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
