# SimpleKinetic [![build status](https://secure.travis-ci.org/WebReflection/simple-kinetic.svg)](http://travis-ci.org/WebReflection/simple-kinetic)

A basic utility to add kinetics effect.


#### Basic Example

```js
var sk = new SimpleKinetic({
  onstart: function (
    currentX, currentY,
    diffX, diffY,
    endX, endY
  ) {
    console.log('start', arguments);
  },
  onmove: function (cx, cy, dx, dy, ex, ey) {
    console.log('move', arguments);
  },
  onend: function (cx, cy, dx, dy, ex, ey) {
    console.log('end', arguments);
  },
  oncancel: function (cx, cy, dx, dy, ex, ey) {
    console.log('cancel', arguments);
  }
});

// check the log
sk.init(0, 0, 10, 10, true, false);
```