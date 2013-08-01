var expect = chai.expect;

describe('SimpleKinetic()', function () {
  it('copies methods and context options', function () {
    var
      options = {
        context: document.createElement('div'),
        onstart: function() {},
        onmove: function() {},
        onend: function () {},
        whatever: function () {}
      },
      sk = new SimpleKinetic(options)
    ;
    expect(sk.context).to.equal(options.context);
    expect(sk.onstart).to.equal(options.onstart);
    expect(sk.onmove).to.equal(options.onmove);
    expect(sk.onend).to.equal(options.onend);
    expect(sk.whatever).to.equal(undefined);
  });
  it('should move and end', function (done) {
    var sk = new SimpleKinetic({
      onstart: function () {
        this.i = 0;
      },
      onmove: function () {
        ++this.i;
      },
      onend: function () {
        if (0 < this.i) return done();
        throw "didn't move";
      }
    });
    if (!sk.init(0, 0, 2, 2)) throw "didn't start";
  });
  it('should NOT move or end', function (done) {
    var sk = new SimpleKinetic({
      onstart: function () {
        throw "should not start";
      },
      onmove: function () {
        throw "should not move";
      },
      onend: function () {
        throw "should not end";
      }
    });
    if (sk.init(0, 0, 0, 0)) throw "should not init";
    setTimeout(done, 250);
  });
  it('should be cancelable', function (done) {
    var sk = new SimpleKinetic({
      oncancel: function () {
        // wait to be sure no oncancel were called
        setTimeout(done, 250);
      },
      onstart: function () {
        this.i = 0;
      },
      onmove: function () {
        if (5 < ++this.i) this.cancel();
      },
      onend: function () {
        throw "should not end";
      }
    });
    sk.init(0, 0, 2, 2);
  });
  it('should have right context', function (done) {
    var
      context = {},
      rightContext = true,
      sk = new SimpleKinetic({
        context: context,
        onstart: function () {
          rightContext = rightContext && this === context;
        },
        onmove: function () {
          rightContext = rightContext && this === context;
        },
        onend: function () {
          rightContext = rightContext && this === context;
          if (!rightContext) throw "context ain't right";
          done();
        }
      }
    );
    sk.init(0, 0, 2, 2);
  });
  it('should have right context oncancel too', function (done) {
    var
      context = {},
      rightContext = true,
      sk = new SimpleKinetic({
        context: context,
        onstart: function () {
          this.i = 0;
          rightContext = rightContext && this === context;
        },
        onmove: function () {
          rightContext = rightContext && this === context;
          if (5 < ++this.i) sk.cancel();
        },
        oncancel: function () {
          rightContext = rightContext && this === context;
          if (!rightContext) throw "context ain't right";
          done();
        }
      }
    );
    sk.init(0, 0, 2, 2);
  });
  it('should have the right amount of arguments', function (done) {
    new SimpleKinetic({
      onstart: function () {
        this.arguments = [arguments];
      },
      onmove: function () {
        this.arguments.push(arguments);
      },
      onend: function () {
        this.arguments.push(arguments);
        this.arguments.forEach(function (current, i, all) {
          if (
            current.length !== 6 ||
            (current[0] === current[4] && current[1] === current[5] && i !== all.length - 1)
          ) {
            throw i + ": something went wrong with calculation";
          }
        });
        done();
      }
    }).init(0, 0, 2, 2);
  });
});
