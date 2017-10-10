const tap = require('tap');
const { FixedArray } = require('../dist/memop');

tap.test('FixedArray', t => {
  t.test('push', t => {
    let arr = new FixedArray(100);

    arr.push(1);
    arr.push(2);
    arr.push(3);
    arr.push(4);
    arr.push(5);

    t.equal(arr.length, 5);
    t.equal(arr.data.length, 100);
    t.equal(arr.data[0], 1);
    t.equal(arr.data[1], 2);
    t.equal(arr.data[2], 3);
    t.equal(arr.data[3], 4);
    t.equal(arr.data[4], 5);

    t.end();
  });

  t.test('pop', t => {
    let arr = new FixedArray(100);

    arr.push(1);
    arr.push(2);
    arr.push(3);
    arr.push(4);
    arr.push(5);

    arr.pop(5);

    t.equal(arr.length, 4);
    t.equal(arr.data.length, 100);
    t.equal(arr.data[0], 1);
    t.equal(arr.data[1], 2);
    t.equal(arr.data[2], 3);
    t.equal(arr.data[3], 4);
    t.equal(arr.data[4], undefined);

    t.end();
  });

  t.test('fastRemove', t => {
    let arr = new FixedArray(100);

    arr.push(1);
    arr.push(2);
    arr.push(3);
    arr.push(4);
    arr.push(5);

    arr.fastRemove(2);

    t.equal(arr.length, 4);
    t.equal(arr.data.length, 100);
    t.equal(arr.data[0], 1);
    t.equal(arr.data[1], 2);
    t.equal(arr.data[2], 5);
    t.equal(arr.data[3], 4);
    t.equal(arr.data[4], undefined);

    t.end();
  });

  t.test('reset', t => {
    let arr = new FixedArray(100);

    arr.push(1);
    arr.push(2);
    arr.push(3);
    arr.push(4);
    arr.push(5);

    arr.reset(0);

    t.equal(arr.length, 0);
    t.equal(arr.data.length, 100);
    t.equal(arr.data[0], undefined);
    t.equal(arr.data[1], undefined);
    t.equal(arr.data[2], undefined);
    t.equal(arr.data[3], undefined);
    t.equal(arr.data[4], undefined);

    t.end();
  });

  t.test('indexOf', t => {
    let arr = new FixedArray(100);

    arr.push(100);
    arr.push(200);
    arr.push(300);
    arr.push(400);
    arr.push(500);

    t.equal(arr.indexOf(300), 2);
    t.equal(arr.indexOf(400), 3);

    t.end();
  });

  t.test('sort', t => {
    let arr = new FixedArray(100);

    // sort here to make sure it can sort emtpty array
    arr.sort();

    arr.push(840);
    arr.push(343);
    arr.push(457);
    arr.push(231);
    arr.push(759);

    arr.sort();
    t.equal(arr.indexOf(231), 0);
    t.equal(arr.indexOf(840), 4);

    t.end();
  });

  t.test('sort with function', t => {
    let arr = new FixedArray(100);

    // sort here to make sure it can sort emtpty array
    arr.sort((a, b) => {
      return a.id - b.id;
    });

    arr.push({ id: 840 });
    arr.push({ id: 343 });
    arr.push({ id: 457 });
    arr.push({ id: 231 });
    arr.push({ id: 759 });

    arr.sort((a, b) => {
      return a.id - b.id;
    });

    t.equal(arr.data[0].id, 231);
    t.equal(arr.data[4].id, 840);

    t.end();
  });

  t.end();
});