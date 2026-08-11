const Node = require('./utils/Node');
const { encodeLink } = require('./utils/URL');

module.exports = {
  embed: {
    image: function(src, attrs) {
      let altText = "";
      let width  = "";
      if (attrs) {
        altText = attrs['alt'] ? attrs['alt'] : "";
        width = attrs['width'] ? attrs['width'] : "";
      }

      let imageTag = `![${altText}](${encodeLink(src)})`;

      if (width) {
        imageTag = imageTag + `{width="${width}px"}`;
      }

      this.append(imageTag)
    },
    formula: function(latex) {
      this.append(String.raw`$${latex.trim()}$`);
    },
    thematic_break: function() {
      this.open = '\n---\n' + this.open;
      this.close = '\n'; // Prevent thematic break from adding an excessive third newline
    },
  },

  inline: {
    italic: function() { return ['_', '_']; },
    bold: function() { return ['**', '**']; },
    link: function(url) { return ['[', '](' + url + ')']; },
    pandocStyle: function(value) { return ['[', ']{style="' + value + '"}']; }
  },

  block: {
    'align': {
      group: function() {
        return new Node(['', '']); 
      },
      line: function(attrs, group) {
        group.el.open = `\n::: {custom-style="align-${attrs.align}"}\n`;
        group.el.close = ':::\n\n'; 
      }
    },
    'header': function({header}) {
      this.open = '#'.repeat(header) + ' ' + this.open;
    },
    blockquote: function() {
      this.open = '> ' + this.open;
    },
    'list': {
      group: function() {
        return new Node(['', '\n']);
      },
      line: function(attrs, group) {
        // Keep individual list items tight
        this.close = '\n';
        
        const indentLevel = attrs.indent || 0;
        const indentStr = indentLevel ? '    '.repeat(indentLevel) : '';

        if (attrs.list === 'bullet') {
          this.open = indentStr + '- ' + this.open;
        } else if (attrs.list === "checked") {
          this.open = indentStr + '- [x] ' + this.open;
        } else if (attrs.list === "unchecked") {
          this.open = indentStr + '- [ ] ' + this.open;
        } else if (attrs.list === 'ordered') {
          group.counts = group.counts || [];
          group.counts.splice(indentLevel + 1);
          group.counts[indentLevel] = (group.counts[indentLevel] || 0) + 1;
          
          const count = group.counts[indentLevel];
          let marker = count + '.';
          
          if (indentLevel % 3 === 1) {
            marker = String.fromCharCode(96 + ((count - 1) % 26 + 1)) + '.';
          } else if (indentLevel % 3 === 2) {
            let n = count;
            const roman = [['x', 10], ['ix', 9], ['v', 5], ['iv', 4], ['i', 1]];
            let str = '';
            for (let i = 0; i < roman.length; i++) {
              while (n >= roman[i][1]) {
                str += roman[i][0];
                n -= roman[i][1];
              }
            }
            marker = str + '.';
          }

          this.open = indentStr + marker + ' ' + this.open;
        }
      },
    }
  },
}