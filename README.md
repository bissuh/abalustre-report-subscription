## Abalustre Performance Report Subscription Widget

This tool allow companies to add a report subscription widget as easy as copying and pasting the script below.

At this point in time it cannot be customized.

### Usage

Copy and paste the code below inside your HTML page where you want your code to be displayed.

```html
<script>
(function (w,d,s,o,f,js,fjs) {
    w['AbalustreReportWidget']=o;w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments) };
    js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
    js.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);
}(window, document, 'script', '_aba', 'https://abalustre-report-subscription.s3.amazonaws.com/abalustre-report-subscription/widget.js'));
_aba('init', { id: 'your-organization-id' }); 
</script>
```

#### Options

You will place options in the `_aba('init', {<options>})` init file as the second parameter object attributes.

| Option | Description |
| - | - |
| `buttonColor` | Hexadecimal format color. Default: `#0050b3`. |
| `container` | ID of html div or element where the button is going to be placed. Default: `subscription`. |
