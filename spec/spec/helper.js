/* create canavs */
var canvas = document.createElement('div')
canvas.id = 'canvas'
with (canvas.style) {
  width = '1px'
  height = '1px'
  overflow = 'hidden'
}
document.getElementsByTagName('body')[0].appendChild(canvas)
window.draw = SVG(canvas)