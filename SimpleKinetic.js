/*! SimpleKinetic v0.0.0 - MIT license */

// bower register simple-kinetic git://repo

;(function (global) { function moduleDefinition(/*dependency*/) {

// ---------------------------------------------------------------------------

'use strict';

var
  //  fast scoped lookup
  isNaN = global.isNaN,
  Math = global.Math,
  abs = Math.abs,
  round = Math.round,
  sqrt = Math.sqrt,
  setInterval = global.setInterval,
  clearInterval = global.clearInterval,
  //  deceleration
  friction = .2,
  //  kinetic distance multiplier
  multiplier = 9,
  //  frames per second
  FPS = 1000 / 60,
  // shortcut
  SimpleKineticPrototype = SimpleKinetic.prototype
;

/**
 * @param options Obect an object containing a context and/or methods to invoke
 * @api public
 * @example
 *  var sk = new SimpleKinetic({
 *    context: aDOMNode,
 *    onmove: function (x, y, dx, dy, ex, ey) {
 *      this.style.cssText = 'top:' + y + 'px;left:' + x + 'px;';
 *    }
 *  });
 *  // simulating a mouse moved on the element
 *  sk.init(0, 0, 10, 10);
 */
function SimpleKinetic(options) {
  for (var key in options) {
    // ignore anything else
    if (key.slice(0, 2) === 'on' || key === 'context') {
      this[key] = options[key];
    }
  }
}

SimpleKineticPrototype.init = function (x, y, xdist, ydist) {
  var
      self = clear(this),
      xdist1 = (abs(xdist) < 1 ? 0 : xdist) * multiplier,
      ydist1 = (abs(ydist) < 1 ? 0 : ydist) * multiplier,
      xdist2 = xdist1 * xdist1,
      ydist2 = ydist1 * ydist1,
      distance = sqrt(xdist2 + ydist2),
      xangle = xdist1 / distance,
      yangle = ydist1 / distance,
      ex, ey
  ;
  self.cancel(self._cx, self._cy);
  if (!(isNaN(xangle) || isNaN(yangle))) {
    //  start in advance regardless
    //  useful to avoid flicks at the very beginning
    self._a = setInterval(next, FPS, self);
    //  used properties in next call
    self._t = 0;                        //  total
    self._d = distance;                 //  distance
    self._sx = self._cx = x;            //  start and current X
    self._sy = self._cy = y;            //  start and current Y
    self._xa = xangle;                  //  angle X
    self._ya = yangle;                  //  angle Y
    ex = round(x + distance * xangle);  //  end X
    ey = round(y + distance * yangle);  //  end Y
    self._ex = ex;
    self._ey = ey;
    if (
      // if end X and end Y are different from start X and start X
      (x !== ex || y !== ey) &&
      // and if the start event does not explicitly return false
      self.start(x, y, 0, 0, ex, ey) !== false
    ) {
      // returns true as kinetic started
      return true;
    }
    // otherwise stop the interval and return false
    clear(self._a);
  }
  return false;
};

// methods handled by the init and the interval
// if necessary is possible to invoke them manually
// Each method will invoke, if defined, the equivalent
// "on" + method counter part with the right context
SimpleKineticPrototype.start = defineCommonMethod('start');
SimpleKineticPrototype.move = defineCommonMethod('move');
SimpleKineticPrototype.end = defineCommonMethod('end');
SimpleKineticPrototype.cancel = function (
  currentX, currentY,
  diffX, diffY,
  endX, endY
) {
  // cancel should invoke oncancel
  // only if not already canceled before
  if (this._a) {
    clear(this).oncancel.call(
      this.context || this,
      currentX, currentY,
      diffX, diffY,
      endX, endY
    );
  }
};

// method invoked "on" actions
SimpleKineticPrototype.onstart =
SimpleKineticPrototype.onmove =
SimpleKineticPrototype.onend =
SimpleKineticPrototype.oncancel = function (
  currentX, currentY,
  diffX, diffY,
  endX, endY
) {
  // avoid checks every single call. by default: invoked
};

function clear(self) {
  clearInterval(self._a);
  self._a = 0;
  return self;
}

function defineCommonMethod(name) {
  name = 'on' + name;
  return function (
    currentX, currentY,
    diffX, diffY,
    endX, endY
  ) {
    return this[name].call(
      this.context || this,
      currentX, currentY,
      diffX, diffY,
      endX, endY
    );
  };
}

function next(self) {
  // all these properties accessed at runtime... I know, disturbing... *but*
  // it avoids creation of N functions over N objects per each kinetic
  var
      t = (self._t += (self._d - self._t) * friction),
      x = round(self._sx + t * self._xa),
      y = round(self._sy + t * self._ya),
      ex = self._ex,
      ey = self._ey,
      diffx = x - self._cx,
      diffy = y - self._cy
  ;
  if (x === ex && y === ey) {
    clear(self).end(ex, ey, diffx, diffy, ex, ey);
  } else {
    self.move(x, y, diffx, diffy, ex, ey);
    self._cx = x;
    self._cy = y;
  }
}

// detect and monkey patch IE < 9
// for this use case only (only 1 extra arg)
var timer = setInterval(function(one){
  clearInterval(timer);
  if (!one) setInterval = function (callback, delay, arg1) {
    return global.setInterval(function () {
      callback(arg1);
    }, delay);
  };
}, 0, 1);

/**
 * Expose SimpleKinetic
 */

return SimpleKinetic;

// ---------------------------------------------------------------------------

} if (typeof exports === 'object') {
    // node export
    module.exports = moduleDefinition(/*require('dependency')*/);
} else if (typeof define === 'function' && define.amd) {
    // amd anonymous module registration
    define([/*'dependency'*/], moduleDefinition);
} else {
    // browser global
    global.SimpleKinetic = moduleDefinition(/*global.dependency*/);
}}(this));
