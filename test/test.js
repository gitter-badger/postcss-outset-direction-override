var postcss = require('postcss');
var expect  = require('chai').expect;

var plugin = require('../');

var test = function (input, output, opts, done) {
    postcss([ plugin(opts) ]).process(input).then(function (result) {
        expect(result.css).to.eql(output);
        expect(result.warnings()).to.be.empty;
        done();
    }).catch(function (error) {
        done(error);
    });
};

describe('postcss-direction-support', function () {

    /* Write tests here */

    it('reverse float:right', function (done) {
        test(
            '.foo {float: right}',
            '.foo {float: right}\n[dir="rtl"] .foo {float: left}',
            { },
        done);
    });

    it('reverse float:left', function (done) {
        test(
            '.foo {float: left}',
            '.foo {float: left}\n[dir="rtl"] .foo {float: right}',
            { },
        done);
    });

    it('reverse clear:right', function (done) {
        test(
            '.foo {clear: right}',
            '.foo {clear: right}\n[dir="rtl"] .foo {clear: left}',
            { },
        done);
    });

    it('reverse clear:left', function (done) {
        test(
            '.foo {clear: left}',
            '.foo {clear: left}\n[dir="rtl"] .foo {clear: right}',
            { },
        done);
    });

    it('reverse text-align:left', function (done) {
        test(
            '.foo {text-align: left}',
            '.foo {text-align: left}\n[dir="rtl"] .foo {text-align: right}',
            { },
        done);
    });

    it('reverse text-align:right', function (done) {
        test(
            '.foo {text-align: right}',
            '.foo {text-align: right}\n[dir="rtl"] .foo {text-align: left}',
            { },
        done);
    });

    it('reverse right', function (done) {
        test(
            '.foo {right: 10px}',
            '.foo {right: 10px}\n[dir="rtl"] .foo {left: 10px;right: auto}',
            { },
        done);
    });

    it('reverse left', function (done) {
        test(
            '.foo {left: 10px}',
            '.foo {left: 10px}\n[dir="rtl"] .foo {right: 10px;left: auto}',
            { },
        done);
    });

    it('reverse left,left equal', function (done) {
        test(
            '.foo {left: 10px; right: 10px}',
            '.foo {left: 10px; right: 10px}',
            { },
        done);
    });

    it('reverse left,right notequal', function (done) {
        test(
            '.foo {left: 10px; right: 100px}',
            '.foo {left: 10px; right: 100px}\n[dir="rtl"] ' +
            '.foo {right: 10px;left: 100px}',
            { },
        done);
    });

    it('reverse padding', function (done) {
        test(
            '.foo {padding: 10px 5px 10px 2px}',
            '.foo {padding: 10px 5px 10px 2px}\n[dir="rtl"] ' +
            '.foo {padding: 10px 2px 10px 5px}',
            { },
        done);
    });

    it('reverse padding-right', function (done) {
        test(
            '.foo {padding-right: 10px}',
            '.foo {padding-right: 10px}\n[dir="rtl"] ' +
            '.foo {padding-left: 10px;padding-right: auto}',
            { },
        done);
    });

    it('reverse padding-left', function (done) {
        test(
            '.foo {padding-left: 10px}',
            '.foo {padding-left: 10px}\n[dir="rtl"] ' +
            '.foo {padding-right: 10px;padding-left: auto}',
            { },
        done);
    });

    it('reverse padding-left,padding-right equal', function (done) {
        test(
            '.foo {padding-left: 10px;padding-right: 10px}',
            '.foo {padding-left: 10px;padding-right: 10px}',
            { },
        done);
    });

    it('reverse padding-left,padding-right notequal', function (done) {
        test(
            '.foo {padding-left: 10px;padding-right: 100px}',
            '.foo {padding-left: 10px;padding-right: 100px}\n[dir="rtl"] ' +
            '.foo {padding-right: 10px;padding-left: 100px}',
            { },
        done);
    });

    it('reverse margin', function (done) {
        test(
            '.foo {margin: 10px 5px 10px 2px}',
            '.foo {margin: 10px 5px 10px 2px}\n[dir="rtl"] ' +
            '.foo {margin: 10px 2px 10px 5px}',
            { },
        done);
    });

    it('reverse margin-right', function (done) {
        test(
            '.foo {margin-right: 10px}',
            '.foo {margin-right: 10px}\n[dir="rtl"] ' +
            '.foo {margin-left: 10px;margin-right: auto}',
            { },
        done);
    });

    it('reverse margin-left', function (done) {
        test(
            '.foo {margin-left: 10px}',
            '.foo {margin-left: 10px}\n[dir="rtl"] ' +
            '.foo {margin-right: 10px;margin-left: auto}',
            { },
        done);
    });

    it('reverse margin-left,margin-right equal', function (done) {
        test(
            '.foo {margin-left: 10px;margin-right: 10px}',
            '.foo {margin-left: 10px;margin-right: 10px}',
            { },
        done);
    });

    it('reverse margin-left,margin-right notequal', function (done) {
        test(
            '.foo {margin-left: 10px;margin-right: 100px}',
            '.foo {margin-left: 10px;margin-right: 100px}\n[dir="rtl"] ' +
            '.foo {margin-right: 10px;margin-left: 100px}',
            { },
        done);
    });

    it('skip margin-left', function (done) {
        test(
            '.foo {margin-left: 10px !skip-direction}',
            '.foo {margin-left: 10px}',
            { },
        done);
    });

    it('skip margin-right special with margin-left', function (done) {
        test(
            '.foo {margin-right: 1px !skip-direction;margin-left: 10px}',
            '.foo {margin-right: 1px;margin-left: 10px}\n[dir="rtl"] ' +
            '.foo {margin-right: 10px;margin-left: auto}',
            { },
        done);
    });

    it('skip margin-right', function (done) {
        test(
            '.foo {margin-right: 10px !skip-direction}',
            '.foo {margin-right: 10px}',
            { },
        done);
    });

    it('skip margin-left special with margin-right', function (done) {
        test(
            '.foo {margin-left: 1px !skip-direction;margin-right: 10px}',
            '.foo {margin-left: 1px;margin-right: 10px}\n[dir="rtl"] ' +
            '.foo {margin-left: 10px;margin-right: auto}',
            { },
        done);
    });

    it('skip padding-left', function (done) {
        test(
            '.foo {padding-left: 10px !skip-direction}',
            '.foo {padding-left: 10px}',
            { },
        done);
    });

    it('skip padding-right special with padding-left', function (done) {
        test(
            '.foo {padding-right: 1px !skip-direction;padding-left: 10px}',
            '.foo {padding-right: 1px;padding-left: 10px}\n[dir="rtl"] ' +
            '.foo {padding-right: 10px;padding-left: auto}',
            { },
        done);
    });

    it('skip padding-right', function (done) {
        test(
            '.foo {padding-right: 10px !skip-direction}',
            '.foo {padding-right: 10px}',
            { },
        done);
    });

    it('skip padding-left special with padding-right', function (done) {
        test(
            '.foo {padding-left: 1px !skip-direction;padding-right: 10px}',
            '.foo {padding-left: 1px;padding-right: 10px}\n[dir="rtl"] ' +
            '.foo {padding-left: 10px;padding-right: auto}',
            { },
        done);
    });

    // background-image: url() x y repaet
    // background-position: x y
    // background-position-x: n

    // border-color: a b c d
    // border-right-color: a b c d
    // border-left-color: a b c d

    // border-width: a b c d
    // border-right-width: a b c d
    // border-left-width: a b c d

    // border-radius: a b c d
    // border-top-right-radius
    // border-bottom-right-radius
    // border-top-left-radius
    // border-bottom-left-radius

    // transform: translate(x, y)
    // transform: translate3d(x, y, z, n)
    // transform: rotateX(deg)

    // box-shadow: x y n n
    // text-shadow x y n

    // transform-origin

    // direction

});
