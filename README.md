# svg.filter.js

A plugin for [svg.js](http://svgjs.com) adding filter functionality.

Svg.filter.js is licensed under the terms of the MIT License.

## Usage
Include this plugin after including the svg.js library in your html document.

For a few visual examples look at the [svg.js filter page](http://svgjs.com/filter).

Here is how each filter effect on the example page is achieved.


### original

```javascript
var image = draw.image('path/to/image.jpg').size(300, 300)
```

### gaussian blur

```javascript
image.filter(function(add) {
  add.gaussianBlur(30)
})
```

### horizontal blur

```javascript
image.filter(function(add) {
  add.gaussianBlur(30, 0)
})
```

### desaturate

```javascript
image.filter(function(add) {
  add.colorMatrix('saturate', 0)
})
```

### contrast

```javascript
image.filter(function(add) {
  var amount = 1.5
  
  add.componentTransfer({
    rgb: { type: 'linear', slope: amount, intercept: -(0.3 * amount) + 0.3 }
  })
})
```

### sepiatone

```javascript
image.filter(function(add) {
  add.colorMatrix('matrix', [ .343, .669, .119, 0, 0 
                            , .249, .626, .130, 0, 0
                            , .172, .334, .111, 0, 0
                            , .000, .000, .000, 1, 0 ])
})
```

### hue rotate 180

```javascript
image.filter(function(add) {
  add.colorMatrix('hueRotate', 180)
})
```

### luminance to alpha

```javascript
image.filter(function(add) {
  add.colorMatrix('luminanceToAlpha')
})
```

### colorize

```javascript
image.filter(function(add) {
  add.colorMatrix('matrix', [ 1.0, 0,   0,   0,   0
                            , 0,   0.2, 0,   0,   0 
                            , 0,   0,   0.2, 0,   0 
                            , 0,   0,   0,   1.0, 0 ])
})
```

### posterize

```javascript
image.filter(function(add) {
  add.componentTransfer({
    rgb: { type: 'discrete', tableValues: [0, 0.2, 0.4, 0.6, 0.8, 1] }
  })
})
```

### darken

```javascript
image.filter(function(add) {
  add.componentTransfer({
    rgb: { type: 'linear', slope: 0.2 }
  })
})
```

### lighten

```javascript
image.filter(function(add) {
  add.componentTransfer({
    rgb: { type: 'linear', slope: 1.5, intercept: 0.2 }
  })
})
```

### invert

```javascript
image.filter(function(add) {
  add.componentTransfer({
    rgb: { type: 'table', tableValues: [1, 0] }
  })
})
```

### gamma correct 1

```javascript
image.filter(function(add) {
  add.componentTransfer({
    g: { type: 'gamma', amplitude: 1, exponent: 0.5 }
  })
})
```

### gamma correct 2

```javascript
image.filter(function(add) {
  add.componentTransfer({
    g: { type: 'gamma', amplitude: 1, exponent: 0.5, offset: -0.1 }
  })
})
```


### drop shadow
You will notice that all the effect descriptions have a drop shadow. Here is how this drop shadow can be achieved:

```javascript
var text = draw.text('SVG text with drop shadow').fill('#fff')

text.filter(function(add) {
  var blur = add.offset(0, 1).in(add.sourceAlpha).gaussianBlur(1)

  add.blend(add.source, blur)
})
```

This technique can be achieved on any other shape of course:

```javascript
var rect = draw.rect(100,100).fill('#f09').stroke({ width: 3, color: '#0f9' }).move(10,10)

rect.filter(function(add) {
  var blur = add.offset(20, 20).in(add.sourceAlpha).gaussianBlur(5)

  add.blend(add.source, blur)

  this.size('200%','200%').move('-50%', '-50%')
})
```

If the drop shadow should get the colour of the shape so it appears like coloured glass:

```javascript
var rect = draw.rect(100,100).fill('#f09').stroke({ width: 3, color: '#0f9' }).move(10,10)

rect.filter(function(add) {
  var blur = add.offset(20, 20).gaussianBlur(5)

  add.blend(add.source, blur)

  this.size('200%','200%').move('-50%', '-50%')
})
```


## Furthermore
Some more features you should know about.

### unfilter
The `unfilter` method removes the filter attribute from the node:

```javascript
image.unfilter()
```

This will return the element to its original state but will retain the filter in the defs node. If the filter node should be removed as well, simply pass the `true` as the first argument:

```javascript
image.unfilter(true)
```


### referencing the filter node
An internal reference to the filter node is made in the element:

```javascript
image.filterer
```

This can also be very useful to reuse an existing filter on various elements:

```javascript
otherImage.filter(image.filterer)
```

### Animating filter values
Every filter value can be animated as well:

```javascript
var hueRotate

image.filter(function(add) {
  hueRotate = add.colorMatrix('hueRotate', 0)
})

hueRotate.animate(3000).attr('values', 360)
```


## Important
This plugin is still under development and does not yet cover the whole range of svg filter capabilities.