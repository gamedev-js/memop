const tap = require('tap');
const { LinkedArray } = require('../dist/memop');

tap.test('LinkedArray', t => {
  t.test('add', t => {
    let arr = new LinkedArray(100, () => {
      return {
        name: '',
        _next: null,
        _prev: null,
      };
    });

    let node = arr.add();
    node.name = 'foo 001';

    node = arr.add();
    node.name = 'foo 002';

    node = arr.add();
    node.name = 'foo 003';

    t.equal(arr.length, 3);
    t.equal(arr.head.name, 'foo 001');
    t.equal(arr.tail.name, 'foo 003');

    t.end();
  });

  t.test('remove head', t => {
    let arr = new LinkedArray(100, () => {
      return {
        name: '',
        _next: null,
        _prev: null,
      };
    });

    let node = arr.add();
    node.name = 'foo 001';

    node = arr.add();
    node.name = 'foo 002';

    node = arr.add();
    node.name = 'foo 003';

    arr.remove(arr.head);

    t.equal(arr.length, 2);
    t.equal(arr.head.name, 'foo 002');
    t.equal(arr.tail.name, 'foo 003');

    t.end();
  });

  t.test('remove tail', t => {
    let arr = new LinkedArray(100, () => {
      return {
        name: '',
        _next: null,
        _prev: null,
      };
    });

    let node = arr.add();
    node.name = 'foo 001';

    node = arr.add();
    node.name = 'foo 002';

    node = arr.add();
    node.name = 'foo 003';

    arr.remove(arr.tail);

    t.equal(arr.length, 2);
    t.equal(arr.head.name, 'foo 001');
    t.equal(arr.tail.name, 'foo 002');

    t.end();
  });

  t.test('remove', t => {
    let arr = new LinkedArray(100, () => {
      return {
        name: '',
        _next: null,
        _prev: null,
      };
    });

    let node = arr.add();
    node.name = 'foo 001';

    let node02 = arr.add();
    node02.name = 'foo 002';

    node = arr.add();
    node.name = 'foo 003';

    arr.remove(node02);

    t.equal(arr.length, 2);
    t.equal(arr.head.name, 'foo 001');
    t.equal(arr.tail.name, 'foo 003');

    t.end();
  });

  t.test('forEach', t => {
    let arr = new LinkedArray(100, () => {
      return {
        name: '',
        _next: null,
        _prev: null,
      };
    });

    let node = arr.add();
    node.name = 'foo 001';

    node = arr.add();
    node.name = 'foo 002';

    node = arr.add();
    node.name = 'foo 003';

    arr.forEach((item, idx) => {
      if (idx === 0) {
        t.equal(item.name, 'foo 001');
      } else if (idx === 1) {
        t.equal(item.name, 'foo 002');
      } else if (idx === 2) {
        t.equal(item.name, 'foo 003');
      }
    });

    t.end();
  });

  t.end();
});