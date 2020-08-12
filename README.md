## Abalustre Website Widgets

This tool allow companies to add a report subscription widget as easy as copying and pasting the script below.

At this point in time it cannot be customized.

### Usage

Copy and paste the code below in the footer of your site. ake sure the `_aba('init');` is present.

```html
<script>
(function (w,d,s,o,f,js,fjs) {
    w['AbalustreReportWidget']=o;w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments) };
    js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
    js.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);
}(window, document, 'script', '_aba', 'https://abalustre-report-subscription.s3.amazonaws.com/widget.js'));
_aba('init'); 
</script>
```

## Subscription

```js
_aba('initSubscription', { id: 'your-organization-id' }); 
```

#### Options

You will place options in the `_aba('initSubscription', {<options>})` init file as the second parameter object attributes.

| Option | Description |
| - | - |
| `buttonColor` | Hexadecimal format color. Default: `#0050b3`. |
| `container` | HTML element ID where the button is going to be placed. When no element is found, the button is going to be ommited. |

## Performance Table

```js
_aba('initPerformance', { id: 'your-organization-id' }); 
```

#### Options

You will place options in the `_aba('initPerformance', {<options>})` init file as the second parameter object attributes.

| Option | Description |
| - | - |
| `language` | Set the language to be used in table render. Options: `pt`. Default: `en`. |
| `container` | HTML element ID where the button is going to be placed. When no element is found, the button is going to be ommited. |
