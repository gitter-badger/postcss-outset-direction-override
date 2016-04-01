'use strict;';
module.exports = {
    process: function (prop, value) {
        var skip = false;
        // if prop or value has right or left in any of following:
        // - padding,margin, float, clear,
        // - right, left, text-align, background-position
        var directionPattern = /(right|left)/g;
        var propMatchesDirection = prop.match(directionPattern);
        var valueMatchesDirection = value.match(directionPattern);
        var marginOpadding = prop.match(/(margin|padding)/g);
        //
        if(propMatchesDirection) {
            //
            prop = this.fn.changeDirection(prop);
        } else if(valueMatchesDirection) {
            //
            value = this.fn.changeDirection(value);
        } else if(marginOpadding) {
            // if margin, padding
            //  - check if value has 4 items
            if(value.split(' ').length === 4) {
                //  -- if true swipe 2nd and 4th items
                value = this.fn.swipe(value);
            } else {
                //  -- if false skip
                skip = true;
                value = 'skip';
            }
        } else {
            value = 'skip';
        }
        if(value.indexOf('!skip-direction') !== -1 || value === 'skip') {
            skip = true;
            value = 'skip';
        }
        // rule object
        return { prop: prop, value: value, skip: skip };
    },
    fn: {
        getOpposite: function (dir) {
            var matches = dir.match(/(right|left)/g);
            if(matches !== null && matches[0] === 'right') {
                dir = 'left';
            } else {
                dir = 'right';
            }
            return dir;
        },
        changeDirection: function (dir) {
            var matches = dir.match(/(right|left)/g);
            var opposit = this.getOpposite(dir);
            if(matches) {
                dir = dir.replace(matches[0], opposit);
            }
            return dir;
        },
        swipe: function (value) {
            var list = value.split(' ');
            list[1] = value.split(' ')[3];
            list[3] = value.split(' ')[1];
            value = list.join(' ');
            return value;
        },
        match: function (string) {
            return {
                RL:      string.match(/right|left/),
                padding: string.match(/padding/),
                margin:  string.match(/margin/),
                border:  string.match(/border/),
                skip:    string.match(/!skip-direction/)
            };
        }
    }
};
