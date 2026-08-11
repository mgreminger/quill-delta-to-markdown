const render = require('./fromDelta')

test('renders inline format', function() {
  expect(
    render([
      {
        insert: 'Hi ',
      },
      {
        attributes: {
          bold: true,
        },
        insert: 'mom',
      },
    ])
  ).toEqual('Hi **mom**\n\n')
})

test('renders embed format', function() {
  expect(
    render([
      {
        insert: 'LOOK AT THE KITTEN!\n',
      },
      {
        insert: {image: 'https://placekitten.com/g/200/300'},
      },
    ])
  ).toEqual('LOOK AT THE KITTEN!\n\n![](https://placekitten.com/g/200/300)\n\n')
})

test('renders image width inline attribute', function() {
  expect(
    render([
      {
        insert: 'Image with width:\n',
      },
      {
        attributes: {width: "150"},
        insert: {image: 'https://placekitten.com/g/200/300'},
      },
    ])
  ).toEqual('Image with width:\n\n![](https://placekitten.com/g/200/300){width="150px"}\n\n')
})

test('renders image alt inline attribute', function() {
  expect(
    render([
      {
        insert: 'Image with width:\n',
      },
      {
        attributes: {alt: "A kitten"},
        insert: {image: 'https://placekitten.com/g/200/300'},
      },
    ])
  ).toEqual('Image with width:\n\n![A kitten](https://placekitten.com/g/200/300)\n\n')
})

test('renders image width and alt inline attribute', function() {
  expect(
    render([
      {
        insert: 'Image with width:\n',
      },
      {
        attributes: {width: "150", alt: "A kitten"},
        insert: {image: 'https://placekitten.com/g/200/300'},
      },
    ])
  ).toEqual('Image with width:\n\n![A kitten](https://placekitten.com/g/200/300){width="150px"}\n\n')
})

test('encodes image url', function() {
  expect(
    render([
      {
        insert: 'LOOK AT THE KITTEN!\n',
      },
      {
        insert: {image: 'https://placekitten.com/g/200/300(1).jpg'},
      },
    ])
  ).toEqual('LOOK AT THE KITTEN!\n\n![](https://placekitten.com/g/200/300%281%29.jpg)\n\n')
})

test('removes download params for images', function () {
  expect(
    render([
      {
        insert: 'LOOK AT THE KITTEN!\n',
      },
      {
        insert: {image: 'https://placekitten.com/g/200/300?params=21312321313&response-content-disposition=attachment; filename=300.jpg'},
      },
    ])
  ).toEqual('LOOK AT THE KITTEN!\n\n![](https://placekitten.com/g/200/300?params=21312321313)\n\n')
})

test('renders block format', function() {
  expect(
    render([
      {
        insert: 'Headline',
      },
      {
        attributes: {
          header: 1,
        },
        insert: '\n',
      },
    ])
  ).toEqual('# Headline\n\n')
})

test('renders lists with inline formats correctly', function() {
  expect(
    render([
      {
        attributes: {
          italic: true,
        },
        insert: 'Glenn v. Brumby',
      },
      {
        insert: ', 663 F.3d 1312 (11th Cir. 2011)',
      },
      {
        attributes: {
          list: 'ordered',
        },
        insert: '\n',
      },
      {
        attributes: {
          italic: true,
        },
        insert: 'Barnes v. City of Cincinnati',
      },
      {
        insert: ', 401 F.3d 729 (6th Cir. 2005)',
      },
      {
        attributes: {
          list: 'ordered',
        },
        insert: '\n',
      },
    ])
  ).toEqual(
    '1. _Glenn v. Brumby_, 663 F.3d 1312 (11th Cir. 2011)\n2. _Barnes v. City of Cincinnati_, 401 F.3d 729 (6th Cir. 2005)\n\n'
  )
})

test('renders adjacent lists correctly', function() {
  expect(
    render([
      {
        insert: 'Item 1',
      },
      {
        insert: '\n',
        attributes: {
          list: 'ordered',
        },
      },
      {
        insert: 'Item 2',
      },
      {
        insert: '\n',
        attributes: {
          list: 'ordered',
        },
      },
      {
        insert: 'Item 3',
      },
      {
        insert: '\n',
        attributes: {
          list: 'ordered',
        },
      },
      {
        insert: 'Intervening paragraph\nItem 4',
      },
      {
        insert: '\n',
        attributes: {
          list: 'ordered',
        },
      },
      {
        insert: 'Item 5',
      },
      {
        insert: '\n',
        attributes: {
          list: 'ordered',
        },
      },
      {
        insert: 'Item 6',
      },
      {
        insert: '\n',
        attributes: {
          list: 'ordered',
        },
      },
    ])
  ).toEqual(
    '1. Item 1\n2. Item 2\n3. Item 3\n\nIntervening paragraph\n\n1. Item 4\n2. Item 5\n3. Item 6\n\n'
  )
})

test('renders adjacent inline formats correctly', function() {
  expect(
    render([
      {
        attributes: {
          italic: true,
        },
        insert: 'Italics! ',
      },
      {
        attributes: {
          italic: true,
          link: 'http://example.com',
        },
        insert: 'Italic link',
      },
      {
        attributes: {
          link: 'http://example.com',
        },
        insert: ' regular link',
      },
    ])
  ).toEqual(
    '_Italics! [Italic link](http://example.com)_[ regular link](http://example.com)\n\n'
  )
});

test('renders checkboxes correctly', function() {
  expect(
    render([
      {
        insert: "milk"
      },
      {
        attributes: {
          list: "unchecked"
        },
        insert: "\n"
      },
      {
        insert: "cheese"
      },
      {
        attributes: {
          list: "checked"
        },
        insert: "\n"
      }
    ])
  ).toEqual('- [ ] milk\n- [x] cheese\n\n')
})

test('render an inline link', function() {
  expect(
    render([
      {
        insert: 'Go to Google',
        attributes: {
              link: 'https://www.google.fr',
        },
      },
    ])
  ).toEqual('[Go to Google](https://www.google.fr)\n\n')
})

test('renders a separator block', function() {
  expect(
    render([
      {
        insert: 'Before\n',
      },
      {
        insert: {thematic_break: true},
      },
      {
        insert: 'After\n',
      },
    ])
  ).toEqual('Before\n\n---\nAfter\n\n')
});

test('renders formula embed', function() {
  expect(render([
      { insert: "Inline formula " },
      { insert: { formula: " \\sqrt{x} " } },
      { insert: " followed by a formula on its own line:\n" },
      { insert: { formula: "\\frac{x}{y}" } },
      { insert: " \nText after formula.\n" },
    ])).toEqual("Inline formula $\\sqrt{x}$ followed by a formula on its own line:\n\n$\\frac{x}{y}$ \n\nText after formula.\n\n");
})

test('renders text color', function() {
  expect(
    render([
      {
        attributes: {
          color: '#e60000',
        },
        insert: 'red text',
      },
    ])
  ).toEqual('[red text]{style="color: #e60000;"}\n\n')
})

test('renders background color', function() {
  expect(
    render([
      {
        attributes: {
          background: '#ffff00',
        },
        insert: 'yellow background',
      },
    ])
  ).toEqual('[yellow background]{style="background-color: #ffff00;"}\n\n')
})

test('renders text and background color together in a single span', function() {
  expect(
    render([
      {
        attributes: {
          color: '#e60000',
          background: '#ffff00',
        },
        insert: 'both properties set',
      },
    ])
  ).toEqual('[both properties set]{style="color: #e60000; background-color: #ffff00;"}\n\n')
})

test('renders colors mixed with other inline styles correctly', function() {
  expect(
    render([
      {
        attributes: {
          italic: true,
          color: '#e60000',
          background: '#ffff00',
          bold: true,
        },
        insert: 'all properties set',
      },
    ])
  ).toEqual('_**[all properties set]{style="color: #e60000; background-color: #ffff00;"}**_\n\n')
})

test('renders full color delta chunk correctly', function() {
  expect(
    render([
      { attributes: { color: "#e60000" }, insert: "red text" },
      { insert: "\n" },
      { attributes: { background: "#ffff00" }, insert: "yellow background" },
      { insert: "\nplain text\n" },
      { attributes: { bold: true }, insert: "bold" },
      { insert: "\n" },
      { attributes: { italic: true }, insert: "italics" },
      { insert: "\n" },
      { attributes: { italic: true, color: "#e60000", background: "#ffff00", bold: true }, insert: "all properties set" },
      { insert: "\n" }
    ])
  ).toEqual(
    '[red text]{style="color: #e60000;"}\n\n[yellow background]{style="background-color: #ffff00;"}\n\nplain text\n\n**bold**\n\n_italics_\n\n_**[all properties set]{style="color: #e60000; background-color: #ffff00;"}**_\n\n'
  )
})

test('strips leading spaces from standard paragraphs to prevent pandoc code blocks', function() {
  expect(
    render([
      {
        insert: '    cats and dogs\n',
      },
      {
        insert: '\t\ttabs too\n',
      },
      {
        insert: '  just a couple spaces\n',
      },
    ])
  ).toEqual('cats and dogs\n\ntabs too\n\njust a couple spaces\n\n')
})

test('preserves spaces within the middle of a line', function() {
  expect(
    render([
      {
        insert: '    Start of line ',
      },
      {
        attributes: { bold: true },
        insert: 'bold text',
      },
      {
        insert: ' end of line\n',
      },
    ])
  ).toEqual('Start of line **bold text** end of line\n\n')
})

test('handles isolated space deltas at the beginning of a line', function() {
  expect(
    render([
      {
        insert: '   ', // User typed spaces, then hit Ctrl+B
      },
      {
        attributes: { bold: true },
        insert: 'bold word flush left',
      },
      {
        insert: '\n',
      },
    ])
  ).toEqual('**bold word flush left**\n\n')
})

test('strips leading spaces before images to prevent monospace rendering', function() {
  expect(
    render([
      {
        insert: '    ', // 4 spaces preceding the image
      },
      {
        insert: {image: 'https://placekitten.com/g/200/300'},
      },
      {
        insert: '\n',
      },
    ])
  ).toEqual('![](https://placekitten.com/g/200/300)\n\n')
})

test('strips leading spaces before inline formulas', function() {
  expect(
    render([
      {
        insert: '    ',
      },
      {
        insert: { formula: 'x=1' },
      },
      {
        insert: ' and text\n',
      },
    ])
  ).toEqual('$x=1$ and text\n\n')
})

test('renders nested lists with decimal, alpha, and roman numerals cycling correctly', function() {
  expect(
    render([
      { insert: 'cats' },
      { insert: '\n', attributes: { list: 'ordered' } },
      { insert: 'dogs' },
      { insert: '\n', attributes: { list: 'ordered' } },
      
      // Indent 1: Lower-alpha
      { insert: 'zebras' },
      { insert: '\n', attributes: { list: 'ordered', indent: 1 } },
      { insert: 'giraffes' },
      { insert: '\n', attributes: { list: 'ordered', indent: 1 } },
      
      // Indent 2: Lower-roman (going up to 11 to test 'xi')
      { insert: 'ro 1' }, { insert: '\n', attributes: { list: 'ordered', indent: 2 } },
      { insert: 'ro 2' }, { insert: '\n', attributes: { list: 'ordered', indent: 2 } },
      { insert: 'ro 3' }, { insert: '\n', attributes: { list: 'ordered', indent: 2 } },
      { insert: 'ro 4' }, { insert: '\n', attributes: { list: 'ordered', indent: 2 } },
      { insert: 'ro 5' }, { insert: '\n', attributes: { list: 'ordered', indent: 2 } },
      { insert: 'ro 6' }, { insert: '\n', attributes: { list: 'ordered', indent: 2 } },
      { insert: 'ro 7' }, { insert: '\n', attributes: { list: 'ordered', indent: 2 } },
      { insert: 'ro 8' }, { insert: '\n', attributes: { list: 'ordered', indent: 2 } },
      { insert: 'ro 9' }, { insert: '\n', attributes: { list: 'ordered', indent: 2 } },
      { insert: 'ro 10' }, { insert: '\n', attributes: { list: 'ordered', indent: 2 } },
      { insert: 'ro 11' }, { insert: '\n', attributes: { list: 'ordered', indent: 2 } },
      
      // Indent 3: Cycles back to Decimal numbers
      { insert: 'deep numbers 1' },
      { insert: '\n', attributes: { list: 'ordered', indent: 3 } },
      { insert: 'deep numbers 2' },
      { insert: '\n', attributes: { list: 'ordered', indent: 3 } },
      
      // Blank line separating the lists
      { insert: '\n' }, 
      
      // Bullets to confirm they still indent without numbering logic
      { insert: 'eagles' },
      { insert: '\n', attributes: { list: 'bullet' } },
      { insert: 'sparrows' },
      { insert: '\n', attributes: { list: 'bullet', indent: 1 } },
    ])
  ).toEqual(
    '1. cats\n' +
    '2. dogs\n' +
    '    a. zebras\n' +
    '    b. giraffes\n' +
    '        i. ro 1\n' +
    '        ii. ro 2\n' +
    '        iii. ro 3\n' +
    '        iv. ro 4\n' +
    '        v. ro 5\n' +
    '        vi. ro 6\n' +
    '        vii. ro 7\n' +
    '        viii. ro 8\n' +
    '        ix. ro 9\n' +
    '        x. ro 10\n' +
    '        xi. ro 11\n' +
    '            1. deep numbers 1\n' +
    '            2. deep numbers 2\n' +
    '\n' +
    '- eagles\n' +
    '    - sparrows\n\n'
  )
})

test('renders centered alignment correctly via fenced divs', function() {
  expect(
    render([
      { insert: 'Below is a centered equation:' },
      { attributes: { align: 'center' }, insert: '\n' },
      { insert: { formula: 'x=y' } },
      { insert: ' ' },
      { attributes: { align: 'center' }, insert: '\n' },
    ])
  ).toEqual('\n::: {custom-style="align-center"}\nBelow is a centered equation:\n\n$x=y$ \n\n:::\n\n')
})

test('renders right alignment correctly via fenced divs', function() {
  expect(
    render([
      { insert: 'This is right justified' },
      { attributes: { align: 'right' }, insert: '\n' },
    ])
  ).toEqual('\n::: {custom-style="align-right"}\nThis is right justified\n\n:::\n\n')
})

test('renders justified alignment correctly via fenced divs', function() {
  expect(
    render([
      { insert: 'This is justified text' },
      { attributes: { align: 'justify' }, insert: '\n' },
    ])
  ).toEqual('\n::: {custom-style="align-justify"}\nThis is justified text\n\n:::\n\n')
})

test('breaks alignment groups when alignment value changes', function() {
  expect(
    render([
      { insert: 'left justified' },
      { insert: '\n' },
      { insert: 'center justified' },
      { attributes: { align: 'center' }, insert: '\n' },
      { insert: 'right justified' },
      { attributes: { align: 'right' }, insert: '\n' },
    ])
  ).toEqual(
    'left justified\n\n::: {custom-style="align-center"}\ncenter justified\n\n:::\n\n::: {custom-style="align-right"}\nright justified\n\n:::\n\n'
  )
})

test('breaks list groups when list format value changes', function() {
  expect(
    render([
      { insert: 'bullet item 1' },
      { attributes: { list: 'bullet' }, insert: '\n' },
      { insert: 'bullet item 2' },
      { attributes: { list: 'bullet' }, insert: '\n' },
      { insert: 'numbered item 1' },
      { attributes: { list: 'ordered' }, insert: '\n' },
      { insert: 'numbered item 2' },
      { attributes: { list: 'ordered' }, insert: '\n' },
      { insert: 'task item 1' },
      { attributes: { list: 'unchecked' }, insert: '\n' },
    ])
  ).toEqual(
    '- bullet item 1\n' +
    '- bullet item 2\n\n' +
    '1. numbered item 1\n' +
    '2. numbered item 2\n\n' +
    '- [ ] task item 1\n\n'
  )
})

test('renders aligned blocks correctly via fenced divs', function() {
  expect(
    render([
      { insert: 'Line 1' },
      { attributes: { align: 'center' }, insert: '\n' },
      { insert: 'Line 2' },
      { attributes: { align: 'center' }, insert: '\n' },
    ])
  ).toEqual(
    '\n::: {custom-style="align-center"}\n' +
    'Line 1\n\n' +
    'Line 2\n\n' +
    ':::\n\n'
  )
})