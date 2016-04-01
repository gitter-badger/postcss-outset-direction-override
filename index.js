'use strict';
//# require postcss
const postcss = require('postcss');
const assets = require('./assets');
const fs = require('fs');

/**
 * @module postcss-outset-direction-override
 * @param {object} opts - postcss plugin options
 * @author younis jad <younis.m.jad@gmail.com>
 * @exports postcss-outset-direction-override
 * @return {object} postcss-outset-direction-override
 */
module.exports = postcss.plugin('postcss-outset-direction-override', function (opts) {
    // options initials
    opts = opts || {};
    let options = {};
    //# set options
    options.direction        = opts.dir || 'rtl'; //# target direction
    options.selector         = opts.selector || ''; //# selector to use as override
    options.external         = opts.external || false; //# boolean: to check if external file
    options.externalFileName = opts.filename || opts.direction; //# external file name
    options.externalFilePath = opts.filePath || './'; //# external file path
    //# if seletor is empty
    if (options.selector === '') {
        //# set external file name as default
        options.selector = opts.selector || '[dir="' + options.direction + '"]';
    }
    // properties to override
    let convertables = [
        'padding',
        'padding-left',
        'padding-right',
        'margin',
        'margin-left',
        'margin-right',
        'right',
        'left',
        'border-right',
        'border-left',
        'text-align',
        'float',
        'clear'
    ];
    
    return function (css) {
        'use strict';
        // create new root
        let Root = postcss.root();
        let Rules = [];
        let RulesSelectors = [];
        let targetRoot;

        css.walkDecls(function (decl) {
            let target = decl.parent;
            let rule = decl.parent.selector;
            let prop = decl.prop;
            let value = decl.value;
            // check if property is convertable
            if(convertables.indexOf(prop) !== -1) {
                // build properties
                if(RulesSelectors.indexOf(rule) === -1) {
                    // push properties to Rule
                    RulesSelectors.push(rule);
                    Rules.push({
                        selector: rule,
                        decl:     [],
                        target:   target
                    });
                }
                if(decl.parent.parent.name !== 'keyframes') {
                    Rules[RulesSelectors.indexOf(rule)].decl.push({
                        prop:  prop,
                        value: value
                    });
                }
            }
        });
        //
        Rules.forEach(function (rule) {
            if(rule.decl.length > 0) {
                // define Selector object
                // append Direction to Selector
                rule.selector = rule.selector.replace('\n', '');
                rule.selector = rule.selector.replace(
                    ',',
                    ',\n' + options.selector + ' '
                );
                // Define Root and Append Selector
                let selector = {
                    selector: options.selector + ' ' + rule.selector
                };
                // if selector has atRule as parent
                if(rule.target.parent.type === 'atrule') {
                    // get boolean if selector has same Parent atRule
                    let atRuleMatches = {
                        name:   targetRoot.name === rule.target.parent.name,
                        params: targetRoot.params === rule.target.parent.params
                    };
                    // if selectors deosnt share same parent, create new atRule
                    if (!atRuleMatches.name && !atRuleMatches.params) {
                        let atRule = postcss.atRule({
                            name:   rule.target.parent.name,
                            params: rule.target.parent.params
                        });
                        // append newly created atRule to end of Root
                        Root.append(atRule);
                    }
                    // update Target Root with the atRule Root
                    targetRoot = Root.last;
                } else { // if not atRule
                    // set target to Main Root
                    targetRoot = Root;
                }
                // check if opposite direction are set
                let directionArray = {
                    RL:   [],
                    M_RL: [],
                    P_RL: [],
                    B_RL: []
                };
                rule.decl.forEach(function (decl, i) {
                    let match = assets.fn.match(decl.prop);
                    let target;
                    // let margin-right = decl.prop.match(/^margin-right$/);
                    if(!assets.fn.match(decl.value).skip) {
                        if(match.RL) {
                            // if right/left
                            if(match.RL.index === 0) {
                                target = directionArray.RL;
                            }
                            // if padding
                            if(match.padding) {
                                target = directionArray.P_RL;
                            }
                            // if margin
                            if(match.margin) {
                                target = directionArray.M_RL;
                            }
                            // if border
                            if(match.border) {
                                target = directionArray.B_RL;
                            }
                            target.push({
                                index: i,
                                prop:  decl.prop,
                                value: decl.value
                            });
                        }
                    }
                });
                for (let prop in directionArray) {
                    let value = directionArray[prop];
                    if(value.length === 2) {
                        if(value[0].value === value[1].value) {
                            rule.decl[value[0].index].value = 'skip';
                            rule.decl[value[1].index].value = 'skip';
                        }
                    } else if(value.length === 1) {
                        // check if it has no other alternatives,
                        // create auto or null for alternative
                        let target = rule.decl[value[0].index];
                        let originalProp = assets.process(
                            target.prop,
                            target.value
                        );
                        let match = assets.fn.match(originalProp.prop);
                        if(match.RL) {
                            if(match.RL.index === 0 ||
                                match.margin ||
                                match.padding
                            ) {
                                rule.decl.push({
                                    prop:  originalProp.prop,
                                    value: 'auto'
                                });
                            }
                            if(match.border) {
                                originalProp.value = '0';
                                rule.decl.push({
                                    prop:  originalProp.prop,
                                    value: originalProp.value
                                });
                            }
                        }
                    }
                }
                // Add Properties to Rule
                let skippedItems = [];
                let itemDecls = [];
                rule.decl.forEach(function (decl, i) {
                    // convert prop and value
                    let assetProccess = assets.process(decl.prop, decl.value);
                    decl.prop = assetProccess.prop;
                    decl.value = assetProccess.value;
                    //
                    if(!assetProccess.skip) {
                        itemDecls.push({
                            prop:  decl.prop,
                            value: decl.value
                        });
                    } else {
                        skippedItems.push(i);
                    }
                });

                if(skippedItems.length !== rule.decl.length) {
                    // append Selector to previously Defined Root
                    targetRoot.append(selector);
                    itemDecls.forEach(function (decl) {
                        targetRoot.last.append(decl);
                    });
                }
            }
        });
        //
        css.replaceValues(' !skip-direction', {
            fast: 'skip-direction'
        }, function () {
            return '';
        });
        if(opts.external) {
            fs.writeFileSync(
                options.externalFilePath + options.externalFileName + '.css',
                Root.toString()
            );
        } else {
            css.append(Root);
        }
    };
});
