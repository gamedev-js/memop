const tap = require('tap');
const { CircularPool } = require('../dist/memop');

tap.test('LinkedArray', t => {
  t.test('request', t => {
    let arr = new CircularPool(() => {
      return {
        name: ''
      };
    }, 3);

    let item = arr.request();
    item.name = 'foo 001';

    item = arr.request();
    item.name = 'foo 002';

    item = arr.request();
    item.name = 'foo 003';

    t.equal(arr.request().name, 'foo 001');
    t.equal(arr.request().name, 'foo 002');
    t.equal(arr.request().name, 'foo 003');

    t.end();
  });

  t.end();
});