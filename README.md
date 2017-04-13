## memop

Memory Operations

## Install

```bash
npm install memop
```

## Usage

**Pool**

```javascript
let pool = new Pool(function () {
  return vmath.vec3.new(1,1,1);
}, 256);

let a = pool.alloc();
let b = pool.alloc();

// do stuff...

pool.free(a);
pool.free(b);
```

**FramePool**

```javascript
let pool = new FramePool(function () {
  return new Float32Array(16);
}, 256);

function render() {
  pool.reset();

  let a = pool.alloc();
  let b = pool.alloc();

  // do stuff...

  requestAnimationFrame(render);
}

render();
```

## License

MIT © 2017 Johnny Wu