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
  ).toEqual('Hi **mom**\n')
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
  ).toEqual('LOOK AT THE KITTEN!\n![](https://placekitten.com/g/200/300)\n')
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
  ).toEqual('Image with width:\n![](https://placekitten.com/g/200/300){width="150px"}\n')
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
  ).toEqual('Image with width:\n![A kitten](https://placekitten.com/g/200/300)\n')
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
  ).toEqual('Image with width:\n![A kitten](https://placekitten.com/g/200/300){width="150px"}\n')
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
  ).toEqual('LOOK AT THE KITTEN!\n![](https://placekitten.com/g/200/300%281%29.jpg)\n')
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
  ).toEqual('LOOK AT THE KITTEN!\n![](https://placekitten.com/g/200/300?params=21312321313)\n')
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
  ).toEqual('# Headline\n')
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
    '1. _Glenn v. Brumby_, 663 F.3d 1312 (11th Cir. 2011)\n2. _Barnes v. City of Cincinnati_, 401 F.3d 729 (6th Cir. 2005)\n'
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
    '1. Item 1\n2. Item 2\n3. Item 3\n\nIntervening paragraph\n1. Item 4\n2. Item 5\n3. Item 6\n'
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
    '_Italics! [Italic link](http://example.com)_[ regular link](http://example.com)' +
      '\n'
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
  ).toEqual('- [ ] milk\n- [x] cheese\n')
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
  ).toEqual('[Go to Google](https://www.google.fr)' + '\n')
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
  ).toEqual('Before' + '\n' + '\n' + '---' + '\n' + 'After' + '\n')
});

test('renders formula embed', function() {
  expect(render([
      { insert: "Inline formula " },
      { insert: { formula: " \\sqrt{x} " } },
      { insert: " followed by a formula on its own line:\n" },
      { insert: { formula: "\\frac{x}{y}" } },
      { insert: " \nText after formula.\n" },
    ])).toEqual("Inline formula $\\sqrt{x}$ followed by a formula on its own line:\n$\\frac{x}{y}$ \nText after formula.\n");
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
  ).toEqual('[red text]{style="color: #e60000;"}\n')
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
  ).toEqual('[yellow background]{style="background-color: #ffff00;"}\n')
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
  ).toEqual('[both properties set]{style="color: #e60000; background-color: #ffff00;"}\n')
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
  ).toEqual('_**[all properties set]{style="color: #e60000; background-color: #ffff00;"}**_\n')
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
    '[red text]{style="color: #e60000;"}\n[yellow background]{style="background-color: #ffff00;"}\nplain text\n**bold**\n_italics_\n_**[all properties set]{style="color: #e60000; background-color: #ffff00;"}**_\n'
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
  ).toEqual('cats and dogs\ntabs too\njust a couple spaces\n')
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
  ).toEqual('Start of line **bold text** end of line\n')
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
  ).toEqual('**bold word flush left**\n')
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
  ).toEqual('![](https://placekitten.com/g/200/300)\n') // Note: '\n' behavior matches your other image tests
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
  ).toEqual('$x=1$ and text\n')
})

test('renders nested lists correctly based on quill indent attribute', function() {
  expect(
    render([
      { insert: 'cats' },
      { insert: '\n', attributes: { list: 'ordered' } },
      { insert: 'dogs' },
      { insert: '\n', attributes: { list: 'ordered' } },
      { insert: 'zebras' },
      { insert: '\n', attributes: { list: 'ordered', indent: 1 } },
      { insert: 'giraffes' },
      { insert: '\n', attributes: { list: 'ordered', indent: 1 } },
      { insert: '\n' }, // Blank line separates the lists
      { insert: 'eagles' },
      { insert: '\n', attributes: { list: 'bullet' } },
      { insert: 'sparrows' },
      { insert: '\n', attributes: { list: 'bullet' } },
      { insert: 'pigeons' },
      { insert: '\n', attributes: { list: 'bullet', indent: 1 } },
      { insert: 'geese' },
      { insert: '\n', attributes: { list: 'bullet', indent: 1 } },
    ])
    ).toEqual(
        '1. cats\n2. dogs\n    3. zebras\n    4. giraffes\n\n\n- eagles\n- sparrows\n    - pigeons\n    - geese\n'
    )
})