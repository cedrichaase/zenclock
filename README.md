# Zenclock

---

A simple, yet highly configurable analog clock widget that uses an HTML5 Canvas.

![Zenclock examples](https://raw.github.com/cedrichaase/zenclock/master/screenshot/zenclock.png)

See the widget in action [here](http://cedrichaase.github.io/zenclock/).

## Dependencies

- [jQuery v2.1.3 (>= 1.9.0)](http://jquery.com/)

### Usage

Add the following resources for zenclock to function correctly.

```html
<!-- Required Javascript -->
<script src="jquery.js"></script>
<script src="zenclock.js"></script>
```

Create a canvas dom element with width and height attributes set:

```html
<canvas id='clock' width='250' height='250'></div>
```

Initialize zenclock:

```javascript
$('#clock').zenclock();
```

## Options

Zenclock's look and behaviour can be configured using an options JSON object like so:

```javascript
var clockOptions = {
  secondColor: '#fff',
  minuteColor: '#666',
  hourColor: '#000',
  dotColor: '#f00',

  showTicks: false,

  // argument is passed to CSS background property of the canvas, so it accepts pretty much everything
  background: 'linear-gradient(to bottom, rgba(226,226,226,1) 0%,rgba(219,219,219,1) 50%,rgba(209,209,209,1) 51%,rgba(254,254,254,1) 100%);',
  
  borderColor: 'darkgray',
  borderStyle: 'ridge',
  borderWidth: '5px',
  borderRadius: '60px',

  font: '14px Monaco'
}

$('#clock').zenclock(clockOptions);
```

### List of options

Following options are available:

| option             | type    | default value | description |
|--------------------|---------|---------------|-------------|
| secondColor        | String  | '#000'        | Color for the second indicator |
| minuteColor        | String  | '#000'        | Color for the minute indicator |
| hourColor          | String  | '#000'        | Color for the hour indicator |
| dotColor           | String  | '#555'        | Color for the dot in the center of the clock face |
| borderColor        | String  | '#000'        | Color for the clock border |
| borderStyle        | String  | 'double'      | Border Style. Accepts all CSS border styles. |
| borderWidth        | String  | '4px'         | Border width. Accepts all CSS units of measurement. |
| borderRadius       | String  | '500px'       | Border radius of the canvas div. 500px gives you a nice and round clock. |
| showTicks          | Boolean | true          | Show ticks for each minute |
| highlightTickColor | String  | '#000'        | Color for highlighted ticks. Currently every 5th tick is highlighted.|
| highlightTickWidth | Integer | 2             | Width for highlighted ticks. Currently every 5th tick is highlighted.|
| tickColor          | String  | '#000'        | Color for non-highlighted ticks. |
| tickWidth          | Integer | 1             | Width for non-highlighted ticks. |
| background         | String  | 'none'        |CSS Background property of the clock's canvas element. Accepts everything from image urls to gradients to plain old background colors.|
| font               | String  | '12px Arial'  |Font and font size the canvas uses to draw numbers on the watch face.|
| smoothSeconds      | Boolean | false         |Wether or not to take milliseconds into account when drawing the second indicator.|
| smoothMinutes      | Boolean | true          |Wether or not to take seconds into account when drawing the minute indicator.|
| smoothHours        | Boolean | true          |Wether or not to take minutes into account when drawing the hour indicator.|

## Methods

The clock widget can be interacted with using the following methods, like so:

```javascript
$('#clock2').zenclock('stop');
```

### List of methods

Following methods are available:

| method | arguments | description                                                                    |
|--------|-----------|--------------------------------------------------------------------------------|
| start  | -         | Starts the update interval that fetches the current time and renders the clock |
| stop   | -         | Stops the update interval                                                      |
