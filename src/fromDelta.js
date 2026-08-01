const isObject = require('lodash/isObject');
const isArray = require('lodash/isArray');
const trimEnd = require('lodash/trimEnd');
const defaultConverters = require('./fromDelta.converters');
const Node = require('./utils/Node');

exports = module.exports = function(ops, converters = defaultConverters) {
  return trimEnd(convert(ops, converters).render()) + '\n';
};

function convert(ops, converters) {
  var group, line, el, activeInline, beginningOfLine, lineHasContent;
  var root = new Node();

  function newLine() {
    el = line = new Node(['', '\n']);
    root.append(line);
    activeInline = {};
    lineHasContent = false;
  }
  newLine();

  for (var i = 0; i < ops.length; i++) {
    var op = ops[i];

    if (isObject(op.insert)) {
      for (var k in op.insert) {
        if (converters.embed[k]) {
          applyInlineAttributes(op.attributes);
          converters.embed[k].call(el, op.insert[k], op.attributes);
          lineHasContent = true;
        }
      }
    } else {
      var lines = op.insert.split('\n');

      if (hasBlockLevelAttribute(op.attributes, converters)) {
        // Some line-level styling (ie headings) is applied by inserting a \n
        // with the style; the style applies back to the previous \n.
        // There *should* only be one style in an insert operation.

        for (var j = 1; j < lines.length; j++) {
          for (var attr in op.attributes) {
            if (converters.block[attr]) {
              var fn = converters.block[attr];
              if (typeof fn === 'object') {
                if (group && group.type !== attr) {
                  group = null;
                }
                if (!group && fn.group) {
                  group = {
                    el: fn.group(),
                    type: attr,
                    value: op.attributes[k],
                    distance: 0,
                  };
                  root.append(group.el);
                }

                if (group) {
                  group.el.append(line);
                  group.distance = 0;
                }
                fn = fn.line;
              }

              fn.call(line, op.attributes, group);
              newLine();
              break;
            }
          }
        }
        beginningOfLine = true;
      } else {
        for (var l = 0; l < lines.length; l++) {
          if ((l > 0 || beginningOfLine) && group && ++group.distance >= 2) {
            group = null;
          }
          applyInlineAttributes(op.attributes, ops[i + 1] && ops[i + 1].attributes);
          
          let text = lines[l];

          // Strip leading spaces if we are at the very beginning of a line
          if (!lineHasContent) {
            text = text.trimStart();
          }
          
          // If after trimming we have characters, the line now has content
          if (text.length > 0) {
            lineHasContent = true;
          }

          el.append(text);
          if (l < lines.length - 1) {
            newLine();
          }
        }
        beginningOfLine = false;
      }
    }
  }

  return root;

  function applyInlineAttributes(rawAttrs, rawNext) {
    var attrs = rawAttrs ? Object.assign({}, rawAttrs) : {};
    var next = rawNext ? Object.assign({}, rawNext) : null;

    // Helper to build a standard CSS style string
    function buildStyle(a) {
      if (!a.color && !a.background) return null;
      let s = [];
      if (a.color) s.push('color: ' + a.color);
      if (a.background) s.push('background-color: ' + a.background);
      return s.join('; ') + ';';
    }

    let attrStyle = buildStyle(attrs);
    if (attrStyle) {
      attrs.pandocStyle = attrStyle;
      delete attrs.color;
      delete attrs.background;
    }
    
    let nextStyle = next ? buildStyle(next) : null;
    if (nextStyle) {
      next.pandocStyle = nextStyle;
      delete next.color;
      delete next.background;
    }

    var first = [],
      then = [];

    var tag = el,
      seen = {};
      
    while (tag._format) {
      seen[tag._format] = true;
      
      if (!attrs[tag._format] || activeInline[tag._format] !== attrs[tag._format]) {
        for (var k in seen) {
          delete activeInline[k]
        }
        el = tag.parent()
      }

      tag = tag.parent()
    }

    for (var attr in attrs) {
      if (converters.inline[attr]) {
        if (activeInline[attr]) {
          if (activeInline[attr] === attrs[attr]) {
            continue; 
          }
        }

        if (next && attrs[attr] === next[attr]) {
          first.push(attr); 
        } else {
          then.push(attr);
        }
        activeInline[attr] = attrs[attr];
      }
    }

    first.forEach(apply);
    then.forEach(apply);

    function apply(fmt) {
      var newEl = converters.inline[fmt].call(null, attrs[fmt]);
      if (isArray(newEl)) {
        newEl = new Node(newEl);
      }
      newEl._format = fmt;
      el.append(newEl);
      el = newEl;
    }
  }
}

function hasBlockLevelAttribute(attrs, converters) {
  for (var k in attrs) {
    if (Object.keys(converters.block).includes(k)) {
      return true
    }
  }
  return false
}
