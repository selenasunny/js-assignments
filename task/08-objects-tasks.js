'use strict';

/**************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
    this.width = width;
    this.height = height;
    Rectangle.prototype.getArea = () => this.width*this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
    return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {   
    let obj = JSON.parse(json);
    obj.__proto__ = proto;
    return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()  => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()  => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()        =>    'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {

    element: function(value) {
        return new Selector().element(value);
    },

    id: function(value) {
        return new Selector().id(value);    
    },

    class: function(value) {
        return new Selector().class(value);
    },

    attr: function(value) {
        return new Selector().attr(value);
    },

    pseudoClass: function(value) {
        return new Selector().pseudoClass(value);
    },

    pseudoElement: function(value) {
        return new Selector().pseudoElement(value);
    },

    combine: function(selector1, combinator, selector2) {
        return new CombinedSelector(selector1, combinator, selector2);
    }    
};

const SelectorState = {
    empty: 0,
    element: 1,
    id: 2,
    class: 3,
    attr: 4,
    pseudoClass: 5,
    pseudoElement: 6,
    full: 7 
};

class Selector {
    constructor() {
        this.result = '';
        this.state = SelectorState.empty;
    }
    
    default(need, opportunity, mapValue) {
        if (this.state == need && !opportunity) {
            throw new Error("Element, id and pseudo-element should not occur more then one time inside the selector");
        }
        if (this.state > need) {
            throw new Error("Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element");
        }
        this.state = need;
        this.result += mapValue;
        return this;      
    }
    
    element(value) { 
        return this.default(SelectorState.element, false, value);
    }
    
    id(value) {
        return this.default(SelectorState.id, false, `#${value}`);
    }
    
    class(value) {
        return this.default(SelectorState.class, true, `.${value}`);
    }
    
    attr(value) {
        return this.default(SelectorState.attr, true, `[${value}]`);
    }
    
    pseudoClass(value) {
        return this.default(SelectorState.pseudoClass, true, `:${value}`);
    }
    
    pseudoElement(value) {
        return this.default(SelectorState.pseudoElement, false, `::${value}`);
    }
    
    stringify() {
        return this.result;
    }    
}

class CombinedSelector {
    constructor(selector1, combinator, selector2) {
        this.selector1 = selector1;
        this.combinator = combinator;
        this.selector2 = selector2;
    }
    
    stringify() {
        return [this.selector1.stringify(), this.combinator, this.selector2.stringify()].join(' ');
}
}

module.exports = {
    Rectangle: Rectangle,
    getJSON: getJSON,
    fromJSON: fromJSON,
    cssSelectorBuilder: cssSelectorBuilder
};