# How to use the parser

The `parseStyle` function accepts two args. The first one should be the custom style, the second one should be default style.

The style should be like this structure:

(the comments are important to understand)
```js
const DEFAULT_STYLES = {
  table: {
    self: { // In this example, self will be apply to the table
      padding: '32px',
      margin: '10px',
      fontFamily: 'sans-serif',
      borderCollapse: 'collapse',
    },
    thead: {
      self: { // here, self will be apply to the thead inside the table
        textTransform: 'uppercase',
        fontWeight: 'bold',
        borderTop: 'solid 3px #000',
        borderBottom: 'solid 3px #000',
      },
      td: { // this style will be applied to the th, inside the thead, that is inside the table tag. So inheritance is respected
        padding: '12px',
      },
    },
    tbody: {
      tr: {
        borderBottom: 'solid 1px rgba(0, 0, 0, 0.1)'
      },
      td: { // this style will be applied to the td, inside the tbody, that is inside the table tag. So inheritance is respected in any level
        self: {
          padding: '12px',
        },
        a: {
          color: '#000',
        },
      },
    },
  },
};
```

After pass the custom and the default styles, the parse returns a function that you can pass a "selector":

```js
  const finalStyle = parseStyle(style, DEFAULT_STYLES);
  finalStyle('table') // returns the style of the table
  finalStyle('table-tbody-td-a') // returns the style of the a, inside the td, that is inside the tbody, that is inside of the table

  // in case you have a link inside the thead, insied the td, inside the table, you should do like this:
  finalStyle('table-thead-td-a') // returns the style of the a, inside the td, that is inside the tbody, that is inside of the table
```

The example uses table, but this works on any type of element

This implementation also support give a "nickname" for each element, so we don't need to have nested objects to defined styles.