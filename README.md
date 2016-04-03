# Outset Direction Support

[![Join the chat at https://gitter.im/unijad/postcss-outset-direction-override](https://badges.gitter.im/unijad/postcss-outset-direction-override.svg)](https://gitter.im/unijad/postcss-outset-direction-override?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[PostCSS] plugin to override direction and flip css properties of styles from ltr/rtl and reverse in a simple overriding way.

[PostCSS]: https://github.com/postcss/postcss
```css
.foo {
    /* Input example */
    right: 10px;
    float: left;
    text-align: right;
    padding: 10px 15px 5px 20px;
    margin: 5px 20px 5px 0px;
    margin-right: 10px;
    margin-left: 10px !skip-direction; /* this will be skipped */
    padding-right: 15px;
    padding-left: 15px;
}
```

```css
[dir="rtl"] .foo {
    /* Override Direction */
    left: 10px;
    float: right;
    text-align: left;
    padding: 10px 20px 5px 15px;
    margin: 5px 0px 5px 20px;
    margin-left: 10px;
    right: auto;
    margin-right: auto;
}
```
## install

using npm

``` terminal
npm install postcss-outset-direction-override --save
```

## Usage

```js
postcss([ require('postcss-outset-direction-override') ])
```

See [POSTCSS] docs for examples for your environment.

## Options

Call plugin function to set options:

``` javascript
var outsetResponsive = require('postcss-outset-direction-override')
postcss([ 
    outsetResponsive({
        direction: 'rtl',
        selector: '[dir=rtl]',
        external: false,
        externalFileName: 'postcss-direction-override',
        externalFilePath: './'
    })
])
```