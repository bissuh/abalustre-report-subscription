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
}(window, document, 'script', '_aba', '//SOME_CDN/widget.js'));
_aba('init', { id: 'your-organization-id' }); 
</script>
```
